import logging

from ocr_core.logger import logger


def test_logger_info_mock(mocker):
    # Arrange
    mock_info = mocker.patch("ocr_core.logger.logger.info")

    # Act
    logger.info("Mocked message")

    # Assert
    mock_info.assert_called_once_with("Mocked message")


def test_logger_info(caplog):
    # Arrange
    test_message = "Hello, OCR!"

    # Act
    with caplog.at_level(logging.INFO):
        logger.info(test_message)

    # Assert
    assert len(caplog.records) == 1
    record = caplog.records[0]
    assert record.levelname == "INFO"
    assert record.getMessage() == test_message
