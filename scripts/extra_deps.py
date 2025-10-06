import toml
import sys

try:
    py = toml.load("pyproject.toml")
except FileNotFoundError:
    sys.exit(0)

deps = py.get("project", {}).get("optional-dependencies", {})
# Combine all extras except 'all'
all_extras = [dep for k, lst in deps.items() if k != "all" for dep in lst]
print(",".join(all_extras))