#!/usr/bin/env bash

# ----------------------------------------------
# > Install internal packages as editable
# ----------------------------------------------
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
INTERNAL_PACKAGES=($(jq -r '.internal_packages[]' "$ROOT_DIR/config/internal_packages.json"))

for pkg in "${INTERNAL_PACKAGES[@]}"; do
    if [ -d "$pkg" ]; then
        echo "➡️  Installing: $pkg" >&2
        python -m pip install -e "$pkg"
    else
        echo "⚠️ Internal package path does not exist: $pkg" >&2
    fi
done
