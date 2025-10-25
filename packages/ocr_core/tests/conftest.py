import ocr_core.helpers as helpers
import pytest
from shared import ocr


@pytest.fixture
def helper_module():
    return helpers


@pytest.fixture
def sample_image():
    img = helpers.Image.new("RGB", (10, 10), color=(255, 0, 0))
    return img


@pytest.fixture
def sample_bytes(sample_image):
    import io

    buf = io.BytesIO()
    sample_image.save(buf, format="PNG")
    byte_data = buf.getvalue()
    return byte_data


@pytest.fixture
def sample_base64(sample_bytes):
    import base64

    b64_data = base64.b64encode(sample_bytes).decode("utf-8")
    return b64_data


@pytest.fixture
def sample_text():
    return "This is a sample extracted text."


@pytest.fixture
def config(tmp_path):
    """Fixture for OCRConfig-like object."""

    class DummyConfig:
        temp_dir = tmp_path
        debug = False
        lang = ocr["languages"]["japanese"]
        max_concurrency = 2

    return DummyConfig()


@pytest.fixture
def sample_temp_image_path():
    return "temp_image.png"


@pytest.fixture
def mock_image_strategy(mocker, sample_image):
    from ocr_core.strategies.image_strategy import ImageStrategy

    strategy = mocker.Mock(spec=ImageStrategy)
    strategy.to_image.return_value = sample_image
    return strategy


@pytest.fixture
def mock_ocr_strategy(mocker):
    from ocr_core.strategies.ocr_strategy import OCRStrategy

    return mocker.Mock(spec=OCRStrategy)
