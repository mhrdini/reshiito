# 🐍 Internal Python packages

## ✨ Creating a Python internal package

### Create and initialise the package

⚠️ **NOTE:** If the Python package will have Pydantic schemas for an API endpoint (or for any other
reason):

> The package name **must end with`"_core"`** (for more info see [this section](##✨-creating-a-/packages/*_core-python-package))

Otherwise, create the package directory in this way:

```bash
cd $PROJECT_DIRECTORY
mkdir /path/to/package_name/package_name
```

An inner folder with the same name as the package is required to
make it importable.

Create a `pyproject.toml` in the package directory:

```toml
# /path/to/package_core/pyproject.toml
[build-system]
requires = ["setuptools", "wheel"]
build-backend = "setuptools.build_meta"

[project]
name = "<package-name>" # Edit the package name with dash-case, same name as the inner folder
version = "0.1.0"
description = "Package description"
requires-python = ">=3.12"
dependencies = []

[tool.setuptools.packages.find]
where = ["."] # When making a flat package
```

⚠️ **NOTE:** The inner folder **must** exist and be the same name as the package
itself:

- Inner folder name: `package_name` (in snake_case)
- Package name in `pyproject.toml`: `package-name` (in dash-case)

### ⚠️ To import modules, create its own `__init__.py`

To make a module accessible, a `__init__.py` file **must be added** to
the module directory.

This includes any and every module accessed through nesting.

It may be left empty, or be used as a barrel export file.

```python
# /packages/ocr_core/ocr_core/schemas/__init.py__
from .schemas import OCRRequest, OCRResponse

__all__ = ["OCRRequest", "OCRResponse"]
```

### Install it as an editable install

Add the package directory (relative to the project root) to `config/packages_json.json`:

```json
{
  "internal_packages": [
    "config/shared",
    "packages/ocr_core",
    "/path/to/package_core" <-- Add it here
  ],
  "python_packages": [
    "config/shared",
    "packages/ocr_core",
    "/path/to/package_core" <-- Add it here
    "apps/server"
  ]
}
```

Run the script to install Python internal packages:

```bash
pnpm install:packages
```

## ✨ Creating a `/packages/*_core` Python package

`/packages/*_core` provide schemas, strategies, services, and extra processing
for data in our application.

They are logically connected to:

- client **features** within `/apps/mobile` and
- server **endpoints** within `/apps/server`

Therefore, they are coherent in names, as shown in this example case for `ocr`:

```text
.
├── apps
│   ├── mobile
│   │   └── src
│   │       └── features
│   │           └── ocr 👈                                    (1) as a client feature
│   │               ├── components
│   │               ├── hooks
│   │               └── services
│   └── server
│       └── app
│           ├── main.py
│           ├── pyproject.tomly
│           └── api
│               └── v1
│                   └── endpoints
│                       └── ocr.py 👈                         (2) with its server endpoints (Python)
└── packages
    ├── ocr_core 👈
    │   ├── pyproject.toml
    │   └── ocr_core 👈 ⚠️ it needs to have an inner folder
    │       ├── schemas_submodule_1
    │       │   └── schemas.py                                (3)
    │       └── schemas_submodule_2
    │           └── schemas.py                                (3)
    └── types
        └── src
            ├── schemas
            │    ├── ocr_(schemas_submodule_1)_schemas.py 👈  (4) with generated types (TypeScript)
            │    └── ocr_(schemas_submodule_2)_schemas.py 👈  (4)
            ├── schemas.ts                                    (5)
            └── index.ts                                      (6)
```

In this example, the OCR **service**:

- is shown through components within `/apps/mobile/src/features/ocr`
- is served by API endpoints at `/apps/server/app/api/v1/endpoints/ocr.py`
- has its core data processed by `/packages/ocr_core`

### Making Python schemas (Pydantic) + TypeScript types consistent

`/packages/types` contains all the **TypeScript types** to be imported and
referenced by TypeScript-based packages.

When we run `/scripts/generate_types.sh`:

> Pydantic schemas are **automatically detected** at (3) `/packages/*_core/**/schemas.py`

And from those schemas:

> TypeScript types are **generated** within (4) `/packages/types/src/schemas/*_schemas.ts` files

And once those types have been generated:

> A barrel export file is **generated** at `/packages/types/src/schemas.ts`,
> and **exported** in the main file at `/packages/types/src/index.ts`

#### Creating and importing a Python schema with Pydantic

In a package with a `pyproject.toml`:

- Create a submodule (in snake_case) directory
- Create `__init__.py` and `schemas.py` files within the directory

```bash
cd /path/to/package_core/package_core
mkdir <submodule_name>
touch <submodule_name>/__init__.py
touch <submodule_name>/schemas.py
```

Once we have created our Pydantic schemas in the `schemas.py` file,
we want to expose the submodule to allow our schemas to be imported directly
from it.

As mentioned before, we do this by initialising an `__init__.py` within the
module, to import and re-export the schemas:

```python
# /packages/*_core/*_core/**/<submodule_name>/__init__.py
from .schemas import CustomPydanticSchema
__all__ = ["CustomPydanticSchema"]
```

So elsewhere, once we have installed the package in our Python environment,
we can import it like this:

```python
# /apps/server/app/main.py
from package_core.**.<submodule_name> import CustomPydanticSchema
# Use this schema however we want
```

#### Generating TypeScript types from Python schemas

From the project directory, run the following command:

```bash
pnpm generate:types
```

This OS-aware script that will:

- Automatically discover all the `schemas.py` in `/packages/*_core/*_core` and
- Generate TypeScript types from it into `/packages/types/schemas` using `pydantic-to-typescript`
