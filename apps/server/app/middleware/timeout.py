import asyncio

from fastapi import Request
from fastapi.responses import JSONResponse
from main import app
from shared import api

TIMEOUT_DURATION = api["TIMEOUT"] / 1000  # seconds


@app.middleware("http")
async def timeout_middleware(request: Request, call_next):
    try:
        # Set a timeout for the request processing
        return await asyncio.wait_for(call_next(request), timeout=TIMEOUT_DURATION)
    except asyncio.TimeoutError:
        return JSONResponse(
            status_code=504,
            content={"detail": "Request timed out."},
        )
