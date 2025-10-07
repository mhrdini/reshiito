#!/usr/bin/env bash
# ----------------------------------------------
# > Run codegen script(s)
# ----------------------------------------------
if ! command -v json2ts &> /dev/null; then
    echo "⚠️ json2ts not installed, please run the command: pnpm setup:python" >&2
    exit 1
fi
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
python "$SCRIPT_DIR/generate_types.py"