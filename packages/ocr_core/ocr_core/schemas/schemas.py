from typing import Optional

from pydantic import BaseModel, model_validator

""" 
Defines the request and response schemas for the OCR service.
"""


class OCRRequest(BaseModel):
    b64: Optional[str] = None
    data: Optional[bytes] = None

    @model_validator(mode="before")
    def only_one_field(cls, values):
        provided = [v for v in values.values() if v is not None]
        if len(provided) != 1:
            raise ValueError("Provide exactly one image input type")
        return values


class OCRResponse(BaseModel):
    text: str
