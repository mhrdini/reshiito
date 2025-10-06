import importlib.util
import pathlib
import sys

from fastapi import FastAPI

app = FastAPI()

# Auto-discover all endpoints in /api/v*/endpoints/*.py
APP_ROOT = pathlib.Path(__file__).parent / "api"

# Walk through all version folders (v1, v2, etc.)
for version_dir in APP_ROOT.glob("v*/endpoints"):
    for file_path in version_dir.glob("*.py"):
        if file_path.name == "__init__.py":
            continue

        # Construct a unique module name for Python
        module_name = f"{version_dir.relative_to(APP_ROOT.parent).as_posix().replace('/', '.')}.{file_path.stem}"

        # Load module from file path
        spec = importlib.util.spec_from_file_location(module_name, file_path)
        module = importlib.util.module_from_spec(spec)
        sys.modules[module_name] = module
        spec.loader.exec_module(module)

        # If module has a router, include it
        if hasattr(module, "router"):
            # > Prefix API with version folder name (e.g., /api/v1)
            version_prefix = f"/api/{version_dir.parent.name}"
            # > Include router here
            app.include_router(module.router, prefix=version_prefix)
            print(f"Registered router from {module_name} with prefix {version_prefix}")
