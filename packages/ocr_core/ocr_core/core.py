import asyncio
from concurrent.futures import ThreadPoolExecutor
from typing import Sequence

from PIL import Image

from .config import OCRConfig
from .strategies import OCRStrategy

"""
Low-level core OCR processing functions
"""


def ocr_image(image: Image.Image, config: OCRConfig, ocr_strategy: OCRStrategy) -> str:
    """Synchronous OCR via provided strategy"""
    if not ocr_strategy:
        raise RuntimeError("No OCR strategy provided")
    return ocr_strategy.run_ocr(image, config)


async def ocr_image_async(
    image: Image.Image, config: OCRConfig, ocr_strategy: OCRStrategy
) -> str:
    """Async OCR via provided strategy"""
    if not ocr_strategy:
        raise RuntimeError("No OCR strategy provided")
    return await ocr_strategy.run_ocr_async(image, config)


def ocr_images_batch(
    images: Sequence[Image.Image], config: OCRConfig, ocr_strategy: OCRStrategy
) -> Sequence[str]:
    """Synchronous batch OCR"""
    if not ocr_strategy:
        raise RuntimeError("No OCR strategy provided")
    results = []
    with ThreadPoolExecutor(max_workers=config.max_concurrency) as executor:
        for img in images:
            results.append(executor.submit(ocr_strategy.run_ocr, img, config).result())
    return results


async def ocr_images_batch_async(
    images: Sequence[Image.Image], config: OCRConfig, ocr_strategy: OCRStrategy
) -> Sequence[str]:
    """Async batch OCR"""
    if not ocr_strategy:
        raise RuntimeError("No OCR strategy provided")
    tasks = [ocr_strategy.run_ocr_async(img, config) for img in images]
    return await asyncio.gather(*tasks)
