from abc import ABC, abstractmethod

from PIL import Image

from ..preprocessing import base64_to_image, bytes_to_image
from ..schemas import OCRRequest

"""
Defines strategies for handling different types of image input for OCR processing.
"""


class ImageInputStrategy(ABC):
    @abstractmethod
    def to_image(self) -> Image.Image:
        pass


class BytesInputStrategy(ImageInputStrategy):
    def __init__(self, data: bytes):
        self.data = data

    def to_image(self):
        return bytes_to_image(self.data)


class Base64InputStrategy(ImageInputStrategy):
    def __init__(self, b64: str):
        self.b64 = b64

    def to_image(self):
        return base64_to_image(self.b64)


def get_input_strategy(req: OCRRequest) -> ImageInputStrategy:
    if req.b64:
        return Base64InputStrategy(req.b64)
    elif req.data:
        return BytesInputStrategy(req.data)
    else:
        raise ValueError("No valid input provided")
