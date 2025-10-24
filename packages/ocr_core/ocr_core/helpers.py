import base64
import binascii
import io
import tempfile
import uuid
from pathlib import Path

from PIL import Image

from .logger import logger

MAX_IMAGE_WIDTH = 4000
MAX_IMAGE_HEIGHT = 4000

"""
Provides image processing utility functions for OCR.
"""


def bytes_to_image(data: bytes) -> Image.Image:
    """
    Converts bytes to a PIL Image suitable for pytesseract.
    """
    try:
        image = Image.open(io.BytesIO(data))
        image = image.convert("RGB")
        image = image.copy()  # make sure the image is writable
    except Exception as e:
        raise ValueError("Bytes do not represent a valid image") from e
    return image


def base64_to_image(b64: str) -> Image.Image:
    """
    Convert a base64 string to a validated PIL Image.

    Raises:
        ValueError: if the base64 string is invalid or the image is corrupted.
    """
    try:
        # Decode base64 (validate=True ensures proper base64)
        image_bytes = base64.b64decode(b64, validate=True)
    except (binascii.Error, ValueError) as e:
        raise ValueError("Invalid base64 string") from e

    try:
        # Load image from bytes
        image = Image.open(io.BytesIO(image_bytes))
        image.verify()  # verify integrity
        # Reopen image after verify to use normally
        image = Image.open(io.BytesIO(image_bytes))
        image = image.convert("RGB")
        image = image.copy()  # make sure the image is writable
        return image
    except Exception as e:
        raise ValueError("Bytes do not represent a valid image") from e


def ensure_rgb(image: Image.Image) -> Image.Image:
    """Ensure the image is in RGB mode to avoid Tesseract errors"""
    if image.mode != "RGB":
        image = image.convert("RGB")
        logger.debug("🖼️ Converted image to RGB")
    return image


def resize_large_image(image: Image.Image) -> Image.Image:
    """Resize very large images to save memory and improve OCR performance"""
    width, height = image.size
    if width > MAX_IMAGE_WIDTH or height > MAX_IMAGE_HEIGHT:
        ratio = min(MAX_IMAGE_WIDTH / width, MAX_IMAGE_HEIGHT / height)
        new_size = (int(width * ratio), int(height * ratio))
        image = image.resize(new_size, Image.Resampling.LANCZOS)
        logger.debug(f"📐 Resized image to {new_size}")
    return image


def generate_temp_path(temp_dir: Path | None = None, suffix: str = ".png") -> Path:
    """Generate a temp path inside the given directory or system temp dir"""
    if temp_dir is None:
        temp_dir = Path(tempfile.gettempdir())
    filename = f"ocr_temp_{uuid.uuid4().hex}{suffix}"
    return temp_dir / filename


def save_temp_image(
    image: Image.Image, temp_dir: Path | None = None, debug: bool = False
) -> Path:
    """Save image to temporary file; optionally keep for debugging"""
    temp_path = generate_temp_path(temp_dir=temp_dir)
    image.save(temp_path, format="PNG")
    if debug:
        logger.info(f"📝 OCR debug: saved temp image at {temp_path}")
    return temp_path
