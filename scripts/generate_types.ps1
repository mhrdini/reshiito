# ----------------------------------------------
# > Run codegen script(s)
# ----------------------------------------------
try {
    $json2ts = Get-Command json2ts -ErrorAction Stop
} catch {
    Write-Error "⚠️ json2ts not installed, please run the command: pnpm setup:python"
    exit 1
}
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
& python "$ScriptDir\generate_types.py"