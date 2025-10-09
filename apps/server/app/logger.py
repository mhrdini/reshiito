import logging
import sys

# Ensure root logger prints to console when Uvicorn reloads
logging.basicConfig(
    level=logging.INFO,
    format="%(levelname)s:\t%(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)

# Define logger using Uvicorn's logger
logger = logging.getLogger("uvicorn.error")
logger.setLevel(logging.INFO)
