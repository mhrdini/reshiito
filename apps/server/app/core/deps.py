import os

from ocr_core.services import OCRService, OCRServiceInterface
from ocr_core.strategies import get_ocr_strategy

DEFAULT_OCR_ENGINE = "pytesseract"
OCR_STRATEGY_NAME = os.getenv("OCR_ENGINE", DEFAULT_OCR_ENGINE)
OCR_STRATEGY_INSTANCE = get_ocr_strategy(OCR_STRATEGY_NAME)
OCR_SERVICE_SINGLETON = OCRService(ocr_strategy=OCR_STRATEGY_INSTANCE)


def get_ocr_service() -> OCRServiceInterface:
    """Dependency injection for OCR service with chosen strategy."""
    # Switching OCR strategy will determine here
    return OCR_SERVICE_SINGLETON
