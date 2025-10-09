import os

from ocr_core.services import OCRService, OCRServiceInterface
from ocr_core.strategies import get_ocr_strategy

DEFAULT_OCR_ENGINE = "pytesseract"


def get_ocr_service() -> OCRServiceInterface:
    """Dependency injection for OCR service with chosen strategy."""
    # Switching OCR strategy will determine here
    strategy_name = os.getenv("OCR_ENGINE", DEFAULT_OCR_ENGINE)
    strategy = get_ocr_strategy(strategy_name)
    return OCRService(ocr_strategy=strategy)
