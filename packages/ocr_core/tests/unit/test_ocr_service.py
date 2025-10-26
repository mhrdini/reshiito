import pytest
from ocr_core.services.ocr_service import OCRService


def test_ocr_service_sync(
    mocker, config, mock_ocr_strategy, mock_image_strategy, sample_text
):
    mocker.patch(
        "ocr_core.services.services.ocr_image",
        return_value=sample_text,
    )

    ocr_service = OCRService(ocr_strategy=mock_ocr_strategy)
    result = ocr_service.extract_text(
        image_strategy=mock_image_strategy,
        lang=config.lang,
    )

    mock_image_strategy.to_image.assert_called_once()
    mock_ocr_strategy.run_ocr.assert_not_called()
    assert result == sample_text


@pytest.mark.asyncio
async def test_ocr_service_async(
    mocker, config, mock_ocr_strategy, mock_image_strategy, sample_text
):
    mocker.patch(
        "ocr_core.services.services.ocr_image_async",
        return_value=sample_text,
    )

    ocr_service = OCRService(ocr_strategy=mock_ocr_strategy)
    result = await ocr_service.extract_text_async(
        image_strategy=mock_image_strategy,
        lang=config.lang,
    )

    mock_image_strategy.to_image.assert_called_once()
    mock_ocr_strategy.run_ocr_async.assert_not_called()
    assert result == sample_text


def test_ocr_service_batch_sync(
    mocker, config, mock_ocr_strategy, mock_image_strategy, sample_text
):
    mocker.patch(
        "ocr_core.services.services.ocr_images_batch",
        return_value=[sample_text, sample_text],
    )

    ocr_service = OCRService(ocr_strategy=mock_ocr_strategy)
    result = ocr_service.extract_text_batch(
        image_strategies=[mock_image_strategy, mock_image_strategy],
        lang=config.lang,
    )

    assert mock_image_strategy.to_image.call_count == 2
    mock_ocr_strategy.run_ocr.assert_not_called()
    assert result == [sample_text, sample_text]


@pytest.mark.asyncio
async def test_ocr_service_batch_async(
    mocker, config, mock_ocr_strategy, mock_image_strategy, sample_text
):
    mocker.patch(
        "ocr_core.services.services.ocr_images_batch_async",
        return_value=[sample_text, sample_text],
    )

    ocr_service = OCRService(ocr_strategy=mock_ocr_strategy)
    result = await ocr_service.extract_text_batch_async(
        image_strategies=[mock_image_strategy, mock_image_strategy],
        lang=config.lang,
    )

    assert mock_image_strategy.to_image.call_count == 2
    mock_ocr_strategy.run_ocr_async.assert_not_called()
    assert result == [sample_text, sample_text]
