from app.core.deps import get_ocr_service


def test_base64_input(ocr_payload_factory):
    payload = ocr_payload_factory(input_type="base64")
    assert isinstance(payload["b64"], str)  # base64 string


def test_bytes_input(ocr_payload_factory):
    payload = ocr_payload_factory(input_type="bytes")
    assert isinstance(payload["data"], bytes)


def test_ocr_health_check(client):
    response = client.get("/api/v1/ocr")
    assert response.status_code == 200
    assert response.json() == {"text": "OCR service is running"}


def test_perform_ocr_with_mock_service(client, mocker, ocr_payload_factory):
    # 1. Create a mock service
    mock_service = mocker.AsyncMock()
    mock_service.extract_text_async.return_value = "Mocked OCR Result"

    # 2. Define a dependency override function
    async def mock_get_ocr_service():
        return mock_service

    # 3. Override the real dependency in FastAPI
    from app.main import app

    app.dependency_overrides[get_ocr_service] = mock_get_ocr_service

    # 4. Send a fake request to the endpoint
    payload = ocr_payload_factory(input_type="base64")
    response = client.post("/api/v1/ocr", json=payload)

    # 5. Validate the response
    assert response.status_code == 200
    assert response.json() == {"text": "Mocked OCR Result"}

    # 6. Ensure our mock service was called correctly
    mock_service.extract_text_async.assert_awaited_once()


def test_perform_ocr_invalid_input(client, ocr_payload_factory):
    payload = ocr_payload_factory(input_type="base64", valid=False)
    response = client.post("/api/v1/ocr", json=payload)

    assert response.status_code == 422
    assert "Invalid" in response.json()["detail"]


def test_perform_ocr_service_error(client, mocker, ocr_payload_factory):
    mock_service = mocker.MagicMock()
    mock_service.extract_text_async = mocker.AsyncMock(
        side_effect=Exception("Service failure")
    )
    mocker.patch("app.api.v1.endpoints.ocr.get_ocr_service", return_value=mock_service)

    # 1. efine a dependency override function
    async def mock_get_ocr_service():
        return mock_service

    # 2. Override the real dependency in FastAPI
    from app.main import app

    app.dependency_overrides[get_ocr_service] = mock_get_ocr_service

    payload = ocr_payload_factory(input_type="base64")
    response = client.post("/api/v1/ocr", json=payload)

    assert response.status_code == 500
    assert "Service failure" in response.json()["detail"]
    mock_service.extract_text_async.assert_awaited_once()
