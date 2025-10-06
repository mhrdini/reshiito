# ----------------------------------------------
# > Run codegen script(s)
# ----------------------------------------------
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
& python "$ScriptDir\generate_types.py"