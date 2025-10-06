import base64
import io

from PIL import Image

"""
Provides image processing utility functions for OCR.
"""


def bytes_to_image(data: bytes) -> Image.Image:
    """
    Converts bytes to a PIL Image suitable for pytesseract.
    """
    image = Image.open(io.BytesIO(data))
    return image


def base64_to_image(b64: str) -> Image.Image:
    """
    Converts a base64 string to a PIL Image suitable for pytesseract.
    """
    image_bytes = base64.b64decode(b64)
    image = Image.open(io.BytesIO(image_bytes))
    return image
