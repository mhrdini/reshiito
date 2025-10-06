#!/usr/bin/env python3
from pathlib import Path

from pydantic2ts import generate_typescript_defs

# Base paths
BASE_DIR = Path(__file__).parent.parent

PACKAGES_DIR = BASE_DIR / "packages"
OUTPUT_DIR = BASE_DIR / "packages/types/src/schemas"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

SCHEMAS_TS_FILE = BASE_DIR / "packages/types/src/schemas.ts"
INDEX_FILE = BASE_DIR / "packages/types/src/index.ts"

schema_files = []

# -----------------------------
# Find all schemas.py in *_core packages
# -----------------------------
for core_pkg in PACKAGES_DIR.glob("*_core/*_core"):
    for schemas_py in core_pkg.rglob("schemas.py"):
        # Determine root package (outer folder without _core)
        root_pkg = None
        for parent in schemas_py.parents:
            if parent.name.endswith("_core"):
                root_pkg = parent.name.removesuffix("_core")
                break
        if root_pkg is None:
            print(f"⚠️ Could not determine _core folder for {schemas_py}")
            continue

        # Relative path from *_core/*_core to folder containing schemas.py
        rel_dir = schemas_py.parent.relative_to(core_pkg)
        rel_dir_safe = "_".join(rel_dir.parts)

        # Output TypeScript filename
        ts_filename = f"{root_pkg}_{rel_dir_safe}.ts"
        output_file = OUTPUT_DIR / ts_filename

        print(f"➡️  Generating {output_file} from {schemas_py}")

        # Use the Python file path for pydantic2ts
        generate_typescript_defs(
            module=str(schemas_py.resolve()),  # file path works
            output=str(output_file),
        )

        schema_files.append(ts_filename)

# -----------------------------
# Generate schemas.ts barrel
# -----------------------------
with open(SCHEMAS_TS_FILE, "w") as f:
    f.write("// Auto-generated schemas barrel\n")
    for filename in sorted(set(schema_files)):
        name = Path(filename).stem
        f.write(f"export * from './schemas/{name}';\n")

# -----------------------------
# Ensure index.ts exports schemas.ts
# -----------------------------
if INDEX_FILE.exists():
    index_text = INDEX_FILE.read_text()
    if "export * from './schemas'" not in index_text:
        with INDEX_FILE.open("a") as f:
            f.write("\nexport * from './schemas';\n")
        print("✅ Added export for schemas.ts to index.ts")
    else:
        print("✅ schemas.ts already exported in index.ts")
else:
    print(f"⚠️ {INDEX_FILE} not found; cannot update index.ts")

print("✅ Type generation complete!")
