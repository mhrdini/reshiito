from typing import Optional

from pydantic import BaseModel, model_validator
from shared import ocr

""" 
Defines the request and response schemas for the OCR service.
"""


def OCRLanguages() -> str:
    return ocr["languages"]["japanese"]


class OCRRequest(BaseModel):
    b64: Optional[str] = None
    data: Optional[bytes] = None
    lang: Optional[str] = OCRLanguages()

    @model_validator(mode="before")
    def only_one_image_field(cls, values):
        image_fields = ["b64", "data"]
        provided = [field for field in image_fields if values.get(field) is not None]
        if len(provided) != 1:
            raise ValueError("Provide exactly one image input type")
        return values


class OCRResponse(BaseModel):
    text: str
