from pathlib import Path


class OCRConfig:
    """Pure configuration for OCR processing."""

    def __init__(
        self,
        lang: str,
        temp_dir: Path | None = None,
        timeout: int = 30,
        retries: int = 2,
        debug: bool = False,
        max_concurrency: int = 4,
    ):
        self.lang = lang
        self.temp_dir = temp_dir
        self.timeout = timeout
        self.retries = retries
        self.debug = debug
        self.max_concurrency = max_concurrency
