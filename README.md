# reshiito

## 🌐 Global Requirements

- Node
- pnpm
- Turbo

## ⚙️ Development

You **must** set up Python first, **before** you run the development script in the project directory:

```bash
# cd $PROJECT_DIRECTORY
pnpm setup:python
pnpm dev
```

Directories in `pnpm-workspace.yaml` will be considered a runtime package that
is needed when you run `pnpm dev`:

```yaml
# pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
  - 'config/*'
```

### 🐍 Setting up Python

#### Run the setup script

To start, in your shell pointing to the project directory:

```bash
# cd $PROJECT_DIRECTORY
pnpm setup:python
```

You **must** run this script for the project to work.

What this script does:

- Detects OS
- Decides Python version: `3.12`
- (Unix only) Installs `direnv`
- Installs `uv` (Python package and project manager)
- Creates a Python virtual environment at `/apps/server/.venv`
- Install prerequisites (`pip`, `setuptools`, `wheel`, `toml`)
- Install internal packages listed in `/config/python_packages.json` as editable installs
- Install dependencies of packages listed in `/config/python_packages.json`
- Generates TypeScript types in `/packages/types/schemas` from Pydantic schemas
  in `packages/*_core/**/schemas.py`
- (Unix only) Sets up `direnv` to activate Python at the created virtual
  environment directory consistently while within project directory

To know how to create, install, and import your own internal Python packages for
use within the project, see [this document](/docs/python.md).

#### VSCode Settings

Manually select the Python interpreter at `/apps/server/.venv/bin/python`.
