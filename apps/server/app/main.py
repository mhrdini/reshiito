import importlib.util
import pathlib
import sys
from contextlib import asynccontextmanager
from pathlib import Path

from app.logger import logger
from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

# Load .env (one level above `app/`)
env_path = Path(__file__).parent.parent / ".env"
load_dotenv(dotenv_path=env_path)


# Auto-discover all endpoints in /api/v*/endpoints/*.py
ROOT = pathlib.Path(__file__).parent / "api"


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup actions
    if not logger.handlers:
        logger.propagate = True

    logger.info("🚀 Starting up the server...")

    # Walk through all version folders (v1, v2, etc.)
    for version_dir in ROOT.glob("v*/endpoints"):
        for file_path in version_dir.glob("*.py"):
            if file_path.name == "__init__.py":
                continue

            # Construct a unique module name for Python
            module_name = f"{version_dir.relative_to(ROOT.parent).as_posix().replace('/', '.')}.{file_path.stem}"

            # Load module from file path with error handling
            spec = importlib.util.spec_from_file_location(module_name, file_path)
            if spec is None or spec.loader is None:
                raise ImportError(f"Cannot load module from {file_path}")
            module = importlib.util.module_from_spec(spec)
            sys.modules[module_name] = module
            spec.loader.exec_module(module)

            # If module has a router, include it
            if hasattr(module, "router"):
                # > Prefix API with version folder name (e.g., /api/v1)
                version_prefix = f"/api/{version_dir.parent.name}"
                # > Include router here
                app.include_router(module.router, prefix=version_prefix)
                logger.info(
                    f"✅ Registered router from {module_name} with prefix {version_prefix}"
                )

    yield
    # Shutdown actions
    logger.info("Shutting down the server...")


app = FastAPI(lifespan=lifespan)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc):
    logger.error(f"Request body: {await request.body()}")
    return JSONResponse(
        status_code=422,
        content={"detail": [str(e) for e in exc.errors()]},  # make it JSON-safe
    )


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    # Log request body
    try:
        logger.error(f"Request body: {await request.body()}")
    except Exception:
        logger.error("Could not read request body")

    # Log full traceback
    logger.error("Exception occurred:", exc_info=True)

    # Return JSON-safe response
    return JSONResponse(
        status_code=500,  # default for generic exceptions
        content={"detail": str(exc)},
    )
