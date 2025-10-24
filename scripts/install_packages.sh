#!/usr/bin/env bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
SERVER_DIR="$ROOT_DIR/apps/server"

VENV_DIR="$SERVER_DIR/.venv"
PYTHON="$VENV_DIR/bin/python"

INTERNAL_PACKAGES=($(jq -r '.internal_packages[]' "$ROOT_DIR/config/python_packages.json"))
PYTHON_PACKAGES=($(jq -r '.python_packages[]' "$ROOT_DIR/config/python_packages.json"))

EXTRA_DEPS_FILE="extra_deps.py"

# ----------------------------------------------
# > Install test dependencies
# ----------------------------------------------
echo "➡️  Installing test dependencies..."
"$PYTHON" -m pip install pytest pytest-mock pytest-asyncio pytest-cov httpx

# ----------------------------------------------
# > Install internal packages as editable
# ----------------------------------------------
for pkg in "${INTERNAL_PACKAGES[@]}"; do
    if [ -d "$ROOT_DIR/$pkg" ]; then
        echo "➡️  Installing: $pkg"
        "$PYTHON" -m pip install -e "$ROOT_DIR/$pkg"
    else
        echo "⚠️ Internal package path does not exist: $pkg"
    fi
done

# ----------------------------------------------
# > Extract extras from pyproject.toml (optional dependencies)
# ----------------------------------------------
EXTRAS=$($PYTHON "$SCRIPT_DIR/$EXTRA_DEPS_FILE")

# ----------------------------------------------
# > Install packages and export requirements
# ----------------------------------------------
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

