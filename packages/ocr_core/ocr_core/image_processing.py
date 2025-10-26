import cv2
import numpy as np
from PIL import Image

"""
Helpers for image processing using OpenCV and PIL.
"""


def convert_to_opencv(image: Image.Image) -> np.ndarray:
    """Convert a PIL Image to an OpenCV image (numpy array)."""
    return cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)


def convert_to_pil(cv_image: np.ndarray) -> Image.Image:
    """Convert an OpenCV image (numpy array) to a PIL Image."""
    return Image.fromarray(cv2.cvtColor(cv_image, cv2.COLOR_BGR2RGB))


def grayscale_image(image: np.ndarray | Image.Image) -> np.ndarray:
    if isinstance(image, Image.Image):
        image = convert_to_opencv(image)
    return cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)


def preprocess_image(image: np.ndarray | Image.Image) -> Image.Image:
    if isinstance(image, Image.Image):
        image = convert_to_opencv(image)
    image = normalize_image(image, size=(1024, 1024))
    image = remove_noise(image)
    image = threshold_image(image)
    image = set_image_dpi(image, dpi=300)
    image = convert_to_pil(image)
    return image


def get_contours(image: np.ndarray | Image.Image):
    if isinstance(image, Image.Image):
        image = convert_to_opencv(image)
    gray = grayscale_image(image)
    edged = cv2.Canny(gray, 30, 200)
    contours, _ = cv2.findContours(edged, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    return contours


def normalize_image(
    image: np.ndarray | Image.Image, size: tuple[int, int]
) -> np.ndarray:
    if isinstance(image, Image.Image):
        image = convert_to_opencv(image)
    norm_image = np.zeros((image.shape[0], image.shape[1]))
    return cv2.normalize(image, norm_image, 0, 255, cv2.NORM_MINMAX)


def deskew_image(image: np.ndarray | Image.Image) -> np.ndarray:
    if isinstance(image, Image.Image):
        image = convert_to_opencv(image)
    co_ords = np.column_stack(np.where(image > 0))
    angle = cv2.minAreaRect(co_ords)[-1]
    if angle < -45:
        angle = -(90 + angle)
    else:
        angle = -angle
    (h, w) = image.shape[:2]
    center = (w // 2, h // 2)
    M = cv2.getRotationMatrix2D(center, angle, 1.0)
    rotated = cv2.warpAffine(
        image, M, (w, h), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE
    )
    return rotated


def set_image_dpi(image: np.ndarray | Image.Image, dpi: int = 300) -> np.ndarray:
    if isinstance(image, np.ndarray):
        image = convert_to_pil(image)

    length_x, width_y = image.size
    factor = min(1, float(1024.0 / length_x))
    size = int(factor * length_x), int(factor * width_y)
    image = image.resize(size, Image.Resampling.LANCZOS)
    image.save("temp_image.tiff", dpi=(dpi, dpi))
    image = Image.open("temp_image.tiff")
    return convert_to_opencv(image)


def remove_noise(image: np.ndarray | Image.Image) -> np.ndarray:
    if isinstance(image, Image.Image):
        image = convert_to_opencv(image)
    return cv2.fastNlMeansDenoisingColored(image, None, 10, 10, 7, 15)


def threshold_image(image: np.ndarray | Image.Image) -> np.ndarray:
    if isinstance(image, Image.Image):
        image = convert_to_opencv(image)
    gray = grayscale_image(image)
    _, thresh_image = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    return thresh_image
