from pathlib import Path

import pytest
from ocr_core.strategies.ocr_strategy import PytesseractOCRStrategy, get_ocr_strategy


@pytest.fixture
def strategy():
    return PytesseractOCRStrategy()


def test_run_ocr_sync(
    mocker, config, strategy, sample_image, sample_text, sample_temp_image_path
):
    # Arrange
    mock_ensure_rgb = mocker.patch("ocr_core.strategies.ocr_strategy.ensure_rgb")
    mock_resize = mocker.patch("ocr_core.strategies.ocr_strategy.resize_large_image")
    mock_save = mocker.patch(
        "ocr_core.strategies.ocr_strategy.save_temp_image",
        return_value=sample_temp_image_path,
    )
    mock_ocr = mocker.patch(
        "ocr_core.strategies.ocr_strategy.pytesseract.image_to_string",
        return_value=sample_text,
    )

    mocker.patch.object(Path, "exists", return_value=True)
    mock_unlink = mocker.patch.object(Path, "unlink")

    # Act
    result = strategy.run_ocr(sample_image, config)

    # Assert
    mock_ensure_rgb.assert_called_once_with(sample_image)
    mock_resize.assert_called_once()
    mock_save.assert_called_once()
    mock_ocr.assert_called_once_with(sample_temp_image_path, lang=config.lang)
    mock_unlink.assert_called_once()
    assert result == sample_text


def test_run_ocr_sync_deletes_temp_file(
    mocker, config, strategy, sample_image, sample_text, sample_temp_image_path
):
    # Arrange
    mocker.patch(
        "ocr_core.strategies.ocr_strategy.save_temp_image",
        return_value=sample_temp_image_path,
    )
    mocker.patch(
        "ocr_core.strategies.ocr_strategy.pytesseract.image_to_string",
        return_value=sample_text,
    )

    mock_exists = mocker.patch.object(Path, "exists", return_value=True)
    mock_unlink = mocker.patch.object(Path, "unlink")

    # Act
    result = strategy.run_ocr(sample_image, config)

    # Assert
    mock_exists.assert_called_once()
    mock_unlink.assert_called_once()
    assert result == sample_text


def test_run_ocr_sync_debug_mode(
    mocker, config, strategy, sample_image, sample_text, sample_temp_image_path
):
    # Arrange
    config.debug = True  # Enable debug mode to prevent file deletion
    mocker.patch(
        "ocr_core.strategies.ocr_strategy.save_temp_image",
        return_value=sample_temp_image_path,
    )
    mocker.patch(
        "ocr_core.strategies.ocr_strategy.pytesseract.image_to_string",
        return_value=sample_text,
    )

    mock_unlink = mocker.patch.object(Path, "unlink")

    # Act
    result = strategy.run_ocr(sample_image, config)

    # Assert
    mock_unlink.assert_not_called()  # File should not be deleted
    assert result == sample_text


@pytest.mark.asyncio
async def test_run_ocr_async(mocker, config, strategy, sample_image, sample_text):
    # Arrange
    mock_run_ocr = mocker.patch.object(
        PytesseractOCRStrategy, "run_ocr", return_value=sample_text
    )
    # Act
    result = await strategy.run_ocr_async(sample_image, config)

    # Assert
    mock_run_ocr.assert_called_once_with(sample_image, config)
    assert result == sample_text


def test_get_ocr_strategy_returns_correct_class():
    strategy = get_ocr_strategy("pytesseract")
    assert isinstance(strategy, PytesseractOCRStrategy)


def test_get_ocr_strategy_raises_error():
    with pytest.raises(ValueError):
        get_ocr_strategy("unknown")
