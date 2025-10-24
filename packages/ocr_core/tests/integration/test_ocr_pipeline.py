from ocr_core.services import OCRService


def test_ocr_pipeline_integration(
    config, mock_ocr_strategy, mock_image_strategy, sample_text
):
    # --- Arrange ---
    mock_ocr_strategy.run_ocr.return_value = sample_text
    ocr_service = OCRService(ocr_strategy=mock_ocr_strategy)

    # --- Act ---
    result = ocr_service.extract_text(
        image_strategy=mock_image_strategy, lang=config.lang
    )

    # --- Assert ---
    assert result == sample_text


def test_ocr_pipeline_real(tmp_path):
    import io

    from ocr_core.config import OCRConfig
    from ocr_core.services import OCRService
    from ocr_core.strategies.image_strategy import BytesImageStrategy
    from ocr_core.strategies.ocr_strategy import PytesseractOCRStrategy
    from PIL import Image, ImageDraw

    # --- Arrange ---
    config = OCRConfig(temp_dir=tmp_path, lang="eng", debug=False)
    ocr_strategy = PytesseractOCRStrategy()
    ocr_service = OCRService(ocr_strategy=ocr_strategy)

    # Create a simple image with text
    img = Image.new("RGB", (100, 30), color=(255, 255, 255))

    draw = ImageDraw.Draw(img)
    draw.text((10, 5), "Hello", fill=(0, 0, 0))

    buf = io.BytesIO()
    img.save(buf, format="PNG")
    bytes_data = buf.getvalue()
    image_strategy = BytesImageStrategy(bytes_data)

    # --- Act ---
    result = ocr_service.extract_text(image_strategy=image_strategy, lang=config.lang)

    # --- Assert ---
    assert "Hello" in result
