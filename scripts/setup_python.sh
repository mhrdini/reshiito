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
VENV_DIR="$ROOT_DIR/apps/server/.venv"
PYTHON_VERSION="3.13"

EXTRA_DEPS_FILE="extra_deps.py"

# ----------------------------------------------
# > Install direnv locally if missing
# ----------------------------------------------
if ! command -v direnv &>/dev/null; then
    echo "⚠️ direnv not installed, please follow install instructions at: https://direnv.net/docs/installation.html" >&2
    exit 1
else
    echo "✅ direnv already installed" >&2
fi

# ----------------------------------------------
# > Install uv locally if missing
# ----------------------------------------------
if ! command -v uv &> /dev/null; then
    echo "⬇️ Installing uv..." >&2
    curl -sSL https://astral.sh/uv/install.sh | bash
else
    echo "✅ uv already installed" >&2
fi

# ----------------------------------------------
# > Install Python & create venv if missing
# ----------------------------------------------
if [ ! -d "$VENV_DIR" ]; then
    echo "🐍 .venv not found, installing Python $PYTHON_VERSION and creating venv..." >&2
    uv python install "$PYTHON_VERSION"
    uv venv -p "$PYTHON_VERSION" "$VENV_DIR"
else
    echo "✅ .venv already exists" >&2
fi

# ----------------------------------------------
# > Activate venv for current session
# ----------------------------------------------
PYTHON="$VENV_DIR/bin/python"
export PATH="$VENV_DIR/bin:$PATH"
ACTIVATE_PATH="$VENV_DIR/bin/activate"
source "$ACTIVATE_PATH"
echo "🐍 Using $($PYTHON -V)" >&2

# ----------------------------------------------
# > Install pip, setuptools, wheel
# ----------------------------------------------
"$PYTHON" -m ensurepip --upgrade
"$PYTHON" -m pip install --upgrade pip setuptools wheel toml

# ----------------------------------------------
# > Install internal packages as editable
# ----------------------------------------------
bash -c $(source ./install_packages.sh)

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
        echo "➡️  Installing $pkg..." >&2
        
        if [ -n "$EXTRAS" ]; then
            "$PYTHON" -m pip install ".[${EXTRAS}]" -e .
        else
            "$PYTHON" -m pip install -e .
        fi

        echo "➡️  Exporting dependencies to requirements.txt..." >&2
        uv export --no-hashes --format requirements-txt -p "$PYTHON" > "$REQUIREMENTS_TXT"
        )
    else
        echo "⚠️ No ${PYPROJECT_TOML} found in $pkg — skipping." >&2
    fi
done

echo "✅ All Python dependencies installed and requirements.txt generated!" >&2

# ----------------------------------------------
# > Run codegen script(s)
# ----------------------------------------------
bash -c $(source ./generate_types.sh)

# ----------------------------------------------
# > Output venv activate path for shell sourcing
# ----------------------------------------------
echo "$ACTIVATE_PATH" > "$ROOT_DIR/.envrc.setup"
echo "$ACTIVATE_PATH"