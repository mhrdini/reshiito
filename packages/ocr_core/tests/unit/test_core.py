import pytest
from ocr_core.core import (
    ocr_image,
    ocr_image_async,
    ocr_images_batch,
    ocr_images_batch_async,
)


@pytest.fixture(autouse=True)
def mock_config(mocker):
    mock_config = mocker.Mock()
    mock_config.max_concurrency = 2
    return mock_config


def test_ocr_image_calls_strategy(
    mock_config, mock_ocr_strategy, sample_image, sample_text
):
    # Arrange
    mock_ocr_strategy.run_ocr.return_value = sample_text

    # Act
    result = ocr_image(sample_image, mock_config, mock_ocr_strategy)

    # Assert
    mock_ocr_strategy.run_ocr.assert_called_once_with(sample_image, mock_config)
    assert result == sample_text


@pytest.mark.asyncio
async def test_ocr_image_async_calls_strategy(
    mock_config, mock_ocr_strategy, sample_image, sample_text
):
    # Arrange
    mock_ocr_strategy.run_ocr_async.return_value = sample_text

    # Act
    result = await ocr_image_async(sample_image, mock_config, mock_ocr_strategy)

    # Assert
    mock_ocr_strategy.run_ocr_async.assert_called_once_with(sample_image, mock_config)
    assert result == sample_text


def test_ocr_images_batch_calls_strategy(
    mock_config, mock_ocr_strategy, sample_image, sample_text
):
    # Arrange
    mock_ocr_strategy.run_ocr.side_effect = [sample_text, sample_text]
    images = [sample_image, sample_image]

    # Act
    result = ocr_images_batch(images, mock_config, mock_ocr_strategy)

    # Assert
    assert mock_ocr_strategy.run_ocr.call_count == 2
    mock_ocr_strategy.run_ocr.assert_any_call(sample_image, mock_config)
    assert result == [sample_text, sample_text]


@pytest.mark.asyncio
async def test_ocr_images_batch_async_calls_strategy(
    mock_config, mock_ocr_strategy, sample_image, sample_text
):
    # Arrange
    mock_ocr_strategy.run_ocr_async.side_effect = [sample_text, sample_text]
    images = [sample_image, sample_image]

    # Act
    result = await ocr_images_batch_async(images, mock_config, mock_ocr_strategy)

    # Assert
    assert mock_ocr_strategy.run_ocr_async.call_count == 2
    mock_ocr_strategy.run_ocr_async.assert_any_call(sample_image, mock_config)
    assert result == [sample_text, sample_text]
