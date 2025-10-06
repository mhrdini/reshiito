from app.core.deps import get_ocr_service
from fastapi import APIRouter, Depends
from ocr_core.schemas import OCRRequest, OCRResponse
from ocr_core.services import OCRServiceInterface
from ocr_core.strategies import get_input_strategy

router = APIRouter()


@router.get("/ocr")
async def health_check():
    """
    Health check endpoint to verify that the OCR service is running.
    """
    return OCRResponse(text="OCR service is running")


@router.post("/ocr")
async def perform_ocr(
    req: OCRRequest, ocr_service: OCRServiceInterface = Depends(get_ocr_service)
):
    """
    Accepts an image, validates it, and returns the extracted text.
    """
    strategy = get_input_strategy(req)
    text = await ocr_service.extract_text(strategy)
    return OCRResponse(text=text)
