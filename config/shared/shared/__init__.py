import json
from pathlib import Path
from typing import Any, Dict

__all__ = []  # Will be filled dynamically

# Type hints for Pylance
ocr: Dict[str, Any]
api: Dict[str, Any]


def _load_jsons():
    """
    Automatically load all .json files in this package as module-level
    variables.
    """
    base_path = Path(__file__).parent
    for json_file in base_path.glob("*.json"):
        name = json_file.stem  # e.g. 'ocr' or 'api'
        with open(json_file, "r", encoding="utf-8") as f:
            globals()[name] = json.load(f)
        __all__.append(name)


_load_jsons()
