#!/usr/bin/env bash

# ----------------------------------------------
# > Run codegen script(s)
# ----------------------------------------------
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
python "$SCRIPT_DIR/generate_types.py"