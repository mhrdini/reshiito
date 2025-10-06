from abc import ABC, abstractmethod

import pytesseract

from ..strategies import ImageInputStrategy

"""
Defines the OCR service interface and its implementations.
To be called as a dependency in FastAPI endpoints.
"""


class OCRServiceInterface(ABC):
    @abstractmethod
    async def extract_text(self, input_strategy: ImageInputStrategy) -> str:
        pass


class PytesseractOCRService(OCRServiceInterface):
    async def extract_text(self, input_strategy: ImageInputStrategy) -> str:
        image = input_strategy.to_image()
        # pytesseract is blocking, so run in thread pool for async
        import asyncio

        loop = asyncio.get_event_loop()
        text = await loop.run_in_executor(None, pytesseract.image_to_string, image)
        return text
