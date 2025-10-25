import base64
import io

import pytest
from app.main import app
from fastapi.testclient import TestClient
from PIL import Image
from shared import ocr


@pytest.fixture()
def client():
    """
    Provides a FastAPI TestClient that triggers the lifespan events.
    """
    with TestClient(app) as c:
        yield c


@pytest.fixture(autouse=True)
def clear_dependency_overrides():
    from app.main import app

    yield
    app.dependency_overrides.clear()


@pytest.fixture(scope="session")
def sample_image_bytes():
    """
    Creates an in-memory small black square PNG for consistent testing.
    Used when you need an actual image object.
    """
    img = Image.new("RGB", (10, 10), color=(0, 0, 0))
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    buf.seek(0)
    return buf.getvalue()


@pytest.fixture(scope="session")
def sample_image_b64(sample_image_bytes):
    """
    Encodes the sample image into base64 format for OCR payloads.
    """
    return base64.b64encode(sample_image_bytes).decode("utf-8")


@pytest.fixture
def ocr_payload_factory(
    sample_image_b64,
    sample_image_bytes,
):
    """
    Factory fixture to create OCR request payloads dynamically.
    Can generate valid or corrupted payloads as needed.
    """

    def _factory(
        *,
        input_type: str = "base64",
        valid=True,
        lang=ocr["languages"]["japanese"],
        custom_data=None,
    ):
        if input_type == "base64":
            data = sample_image_b64 if valid else "invalid_base64_string"
            payload = {
                "b64": custom_data if custom_data is not None else data,
                "lang": lang,
            }
        elif input_type == "bytes":
            data = sample_image_bytes if valid else b"not_really_image_data"
            payload = {
                "data": custom_data if custom_data is not None else data,
                "lang": lang,
            }
        else:
            raise ValueError("Invalid input_type for ocr_payload_factory")

        return payload

    return _factory
