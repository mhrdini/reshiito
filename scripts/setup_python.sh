#!/usr/bin/env bash
set -e
# ----------------------------------------------
# > Make all scripts with a shebang executable
# ----------------------------------------------
find scripts -type f -exec head -n 1 {} \; | grep -q "^#\!" && \
find scripts -type f -exec bash -c 'head -n1 "$1" | grep -q "^#\!" && chmod +x "$1"' _ {} \;

# ----------------------------------------------
# > Paths & Python version
# ----------------------------------------------
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
SERVER_DIR="$ROOT_DIR/apps/server"
VENV_DIR="$SERVER_DIR/.venv"
PYTHON_VERSION="3.12"

EXTRA_DEPS_FILE="extra_deps.py"

# ----------------------------------------------
# > Install direnv locally if missing
# ----------------------------------------------
if ! command -v direnv &>/dev/null; then
    echo "⚠️ direnv not installed, please follow install instructions at: https://direnv.net/docs/installation.html"
    exit 1
else
    echo "✅ direnv already installed"
fi

# ----------------------------------------------
# > Install uv locally if missing
# ----------------------------------------------
if ! command -v uv &> /dev/null; then
    echo "⬇️ Installing uv..."
    curl -sSL https://astral.sh/uv/install.sh | bash
else
    echo "✅ uv already installed"
fi

# ----------------------------------------------
# > Install Python & create venv if missing
# ----------------------------------------------
if [ ! -d "$VENV_DIR" ]; then
    echo "🐍 .venv not found, installing Python $PYTHON_VERSION and creating .venv..."
    cd $SERVER_DIR
    uv sync
    cd $ROOT_DIR
else
    echo "✅ .venv already exists"
fi

# ----------------------------------------------
# > Activate venv for current session
# ----------------------------------------------
PYTHON="$VENV_DIR/bin/python"
export PATH="$VENV_DIR/bin:$PATH"
ACTIVATE_PATH="$VENV_DIR/bin/activate"
source $ACTIVATE_PATH
echo "🐍 Using $($PYTHON -V)"

# ----------------------------------------------
# > Install pip, setuptools, wheel
# ----------------------------------------------
if ! "$PYTHON" -m pip --version &>/dev/null; then
    echo "⬇️ Installing pip via ensurepip..."
    "$PYTHON" -m ensurepip --upgrade || echo "⚠️ ensurepip failed — skipping"
fi

# Upgrade pip/setuptools/wheel incrementally to reduce memory pressure
"$PYTHON" -m pip install --upgrade --no-cache-dir pip || echo "⚠️ pip upgrade failed, continuing"
"$PYTHON" -m pip install --upgrade --no-cache-dir setuptools wheel toml || echo "⚠️ setuptools/wheel install failed, continuing"

# ----------------------------------------------
# > Install internal packages as editable
# ----------------------------------------------
if [ -f "$SCRIPT_DIR/install_packages.sh" ]; then
    source "$SCRIPT_DIR/install_packages.sh"
else
    echo "⚠️ install_packages.sh not found — skipping"
fi

# ----------------------------------------------
# > Extract extras from pyproject.toml (optional dependencies)
# ----------------------------------------------
EXTRAS=$($PYTHON "$SCRIPT_DIR/$EXTRA_DEPS_FILE")

# ----------------------------------------------
# > Install packages and export requirements
# ----------------------------------------------
PYTHON_PACKAGES=("apps/server" "packages/ocr_core")
PYPROJECT_TOML="pyproject.toml"
REQUIREMENTS_TXT="requirements.txt"

for pkg in "${PYTHON_PACKAGES[@]}"; do
    PACKAGE_DIR="$ROOT_DIR/$pkg"

    if [ -f "$PACKAGE_DIR/${PYPROJECT_TOML}" ]; then
        (
        cd "$PACKAGE_DIR"
        echo "➡️  Installing $pkg..."
        
        if [ -n "$EXTRAS" ]; then
            "$PYTHON" -m pip install ".[${EXTRAS}]" -e .
        else
            "$PYTHON" -m pip install -e .
        fi

        echo "➡️  Exporting dependencies to requirements.txt..."
        uv export --no-hashes --format requirements-txt -p "$PYTHON" > "$REQUIREMENTS_TXT"
        )
    else
        echo "⚠️ No ${PYPROJECT_TOML} found in $pkg — skipping."
    fi
done

echo "✅ All Python dependencies installed and requirements.txt generated!"

# ----------------------------------------------
# > Run codegen script(s)
# ----------------------------------------------
if [ -f "$SCRIPT_DIR/install_packages.sh" ]; then
    source "$SCRIPT_DIR/generate_types.sh"
else
    echo "⚠️ generate_types.sh not found — skipping"
fi
# ----------------------------------------------
# > Output venv activate path for shell sourcing
# ----------------------------------------------
echo "$ACTIVATE_PATH" > "$ROOT_DIR/.envrc.setup"