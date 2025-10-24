from abc import ABC, abstractmethod

from PIL import Image

from ..helpers import base64_to_image, bytes_to_image
from ..schemas import OCRRequest

"""
Defines strategies for handling different types of image input for OCR processing.
"""


class ImageStrategy(ABC):
    @abstractmethod
    def to_image(self) -> Image.Image:
        pass


class BytesImageStrategy(ImageStrategy):
    def __init__(self, data: bytes):
        self.data = data

    def to_image(self):
        return bytes_to_image(self.data)


class Base64ImageStrategy(ImageStrategy):
    def __init__(self, b64: str):
        self.b64 = b64

    def to_image(self):
        return base64_to_image(self.b64)


def get_input_strategy(req: OCRRequest) -> ImageStrategy:
    if req.b64:
        return Base64ImageStrategy(req.b64)
    elif req.data:
        return BytesImageStrategy(req.data)
    else:
        raise ValueError("Invalid image input")
