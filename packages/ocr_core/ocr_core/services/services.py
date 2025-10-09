from abc import ABC, abstractmethod
from typing import Sequence

from PIL import Image

from ..config import OCRConfig
from ..core import ocr_image, ocr_image_async, ocr_images_batch, ocr_images_batch_async
from ..strategies import ImageInputStrategy, OCRStrategy


class OCRServiceInterface(ABC):
    @abstractmethod
    def extract_text(
        self, image_strategy: ImageInputStrategy, lang: str, **kwargs
    ) -> str:
        pass

    @abstractmethod
    async def extract_text_async(
        self, image_strategy: ImageInputStrategy, lang: str, **kwargs
    ) -> str:
        pass

    @abstractmethod
    def extract_text_batch(
        self, image_strategies: Sequence[ImageInputStrategy], lang: str, **kwargs
    ) -> Sequence[str]:
        pass

    @abstractmethod
    async def extract_text_batch_async(
        self, image_strategies: Sequence[ImageInputStrategy], lang: str, **kwargs
    ) -> Sequence[str]:
        pass


class OCRService(OCRServiceInterface):
    """Generic OCR service that uses dependency injection for the OCR strategy."""

    def __init__(self, ocr_strategy: OCRStrategy):
        self.ocr_strategy = ocr_strategy

    def extract_text(
        self, image_strategy: ImageInputStrategy, lang: str, **kwargs
    ) -> str:
        config = OCRConfig(lang=lang, **kwargs)
        image: Image.Image = image_strategy.to_image()
        return ocr_image(image=image, config=config, ocr_strategy=self.ocr_strategy)

    async def extract_text_async(
        self, image_strategy: ImageInputStrategy, lang: str, **kwargs
    ) -> str:
        config = OCRConfig(lang=lang, **kwargs)
        image: Image.Image = image_strategy.to_image()
        return await ocr_image_async(
            image=image, config=config, ocr_strategy=self.ocr_strategy
        )

    def extract_text_batch(
        self, image_strategies: Sequence[ImageInputStrategy], lang: str, **kwargs
    ) -> Sequence[str]:
        config = OCRConfig(lang=lang, **kwargs)
        images = [s.to_image() for s in image_strategies]
        return ocr_images_batch(
            images=images, config=config, ocr_strategy=self.ocr_strategy
        )

    async def extract_text_batch_async(
        self, image_strategies: Sequence[ImageInputStrategy], lang: str, **kwargs
    ) -> Sequence[str]:
        config = OCRConfig(lang=lang, **kwargs)
        images = [s.to_image() for s in image_strategies]
        return await ocr_images_batch_async(
            images=images, config=config, ocr_strategy=self.ocr_strategy
        )
