import pytest
from ocr_core.strategies.image_strategy import Base64ImageStrategy, BytesImageStrategy


@pytest.fixture
def bytes_image_strategy(sample_bytes):
    return BytesImageStrategy(sample_bytes)


@pytest.fixture
def base64_image_strategy(sample_base64):
    return Base64ImageStrategy(sample_base64)


def test_bytes_image_strategy_to_image(bytes_image_strategy):
    image = bytes_image_strategy.to_image()
    assert image is not None
    assert image.mode == "RGB"


def test_base64_image_strategy_to_image(base64_image_strategy):
    image = base64_image_strategy.to_image()
    assert image is not None
    assert image.mode == "RGB"


def test_image_strategy_invalid_input():
    with pytest.raises(ValueError):
        BytesImageStrategy(b"invalid_input").to_image()
    with pytest.raises(ValueError):
        Base64ImageStrategy("invalid_input").to_image()
