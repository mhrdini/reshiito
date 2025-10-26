import asyncio
from abc import ABC, abstractmethod
from pathlib import Path

import pytesseract
from PIL import Image

from ..config import OCRConfig
from ..helpers import clean_ocr_text, ensure_rgb, resize_large_image, save_temp_image


class OCRStrategy(ABC):
    """Abstract OCR strategy."""

    LANG_MAP: dict[str, str]

    def get_lang_code(self, lang: str) -> str:
        return self.LANG_MAP.get(lang, lang)

    @abstractmethod
    def run_ocr(self, image: Image.Image, config: OCRConfig) -> str:
        pass

    @abstractmethod
    async def run_ocr_async(self, image: Image.Image, config: OCRConfig) -> str:
        pass


class PytesseractOCRStrategy(OCRStrategy):
    """Concrete OCR strategy using pytesseract."""

    LANG_MAP = {
        "japanese": "jpn",
        "english": "eng",
    }

    def run_ocr(self, image: Image.Image, config: OCRConfig) -> str:
        image = ensure_rgb(image)
        image = resize_large_image(image)

        temp_path: Path = Path(
            save_temp_image(image, temp_dir=config.temp_dir, debug=config.debug)
        )

        try:
            lang_code = self.get_lang_code(config.lang)
            result = pytesseract.image_to_string(
                str(temp_path), lang=lang_code, config="--psm 6"
            )
            cleaned = clean_ocr_text(result)
            return cleaned
        finally:
            if temp_path.exists() and not config.debug:
                temp_path.unlink()

    async def run_ocr_async(self, image: Image.Image, config: OCRConfig) -> str:
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(None, self.run_ocr, image, config)


STRATEGIES = {
    "pytesseract": PytesseractOCRStrategy,
    # Future strategies can be added here
}


def get_ocr_strategy(name: str):
    cls = STRATEGIES.get(name.lower())
    if not cls:
        raise ValueError(f"Unknown OCR strategy: {name}")
    return cls()
