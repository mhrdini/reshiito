from ocr_core.services import OCRServiceInterface, PytesseractOCRService


def get_ocr_service() -> OCRServiceInterface:
    return PytesseractOCRService()
