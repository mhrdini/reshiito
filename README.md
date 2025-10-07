# reshiito

## 🌐 Global Requirements

- Node
- pnpm
- Turbo

## ⚙️ Development

Directories in `pnpm-workspace.yaml` will be considered a runtime package that
is needed when you run `pnpm dev`:

```yaml
# pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
  - 'config/*'
```

Before you run the development script in the project directory:

```bash
# cd $PROJECT_DIRECTORY
pnpm dev
```

You **must** set up Python first.

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
- Decides Python version: `3.13`
- (Unix only) Installs `direnv`
- Installs `uv` (Python package and project manager)
- Creates a Python virtual environment at `/apps/server/.venv`
- Install prerequisites (pip, setuptools, wheel, toml)
- Install internal packages listed `/config/internal_packages.json` as editable installs
- Install dependencies of internal packages
- Generates TypeScript types in `/packages/types/schemas` from
  `packages/*_core/**/schemas.py`
- (Unix only) Sets up `direnv` to activate Python at the created virtual
  environment consistently when within project directory

To know how to create, install, and import your own internal Python packages for
use within the project, see [this document](/docs/python.md).
