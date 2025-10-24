from app.core.deps import get_ocr_service
from app.logger import logger
from fastapi import APIRouter, Depends, HTTPException
from ocr_core.schemas import OCRRequest, OCRResponse
from ocr_core.services import OCRServiceInterface
from ocr_core.strategies import get_input_strategy
from shared import ocr

router = APIRouter()

DEFAULT_LANGUAGE = ocr["languages"]["japanese"]


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
    try:
        strategy = get_input_strategy(req)
        logger.info("✨ Starting OCR processing...")
        text = await ocr_service.extract_text_async(
            strategy, lang=req.lang or DEFAULT_LANGUAGE
        )
        return OCRResponse(text=text)
    except ValueError as ve:
        # Handle invalid image input
        logger.error(f"perform_ocr: {ve}")
        raise HTTPException(status_code=422, detail=str(ve))
    except Exception as e:
        # Catch-all for anything else
        logger.error(f"perform_ocr: {e}")
        raise HTTPException(status_code=500, detail=str(e))
