# ----------------------------------------------
# > Make all shell scripts executable
# ----------------------------------------------
Get-ChildItem -Path "scripts" -Filter "*.sh" -Recurse | ForEach-Object {
    icacls $_.FullName /grant Everyone:(RX)
}
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force

# ----------------------------------------------
# > Paths
# ----------------------------------------------
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$RootDir = Join-Path $ScriptDir ".."
$VenvDir = Join-Path $RootDir "apps\server\.venv"
$PythonVersion = "3.12"

# ----------------------------------------------
# > Install uv locally if missing
# ----------------------------------------------
try {
    # Try to get uv command
    $uvPath = Get-Command uv -ErrorAction Stop
    Write-Host "✅ uv already installed"
} catch {
    Write-Host "⬇️ Installing uv..."
    # Use Invoke-Expression to run install script from URL
    iex (irm "https://astral.sh/uv/install.ps1")
}

# ----------------------------------------------
# > Install Python & create venv if missing
# ----------------------------------------------
if (-not (Test-Path $VenvDir)) {
    Write-Host "🐍 .venv not found, installing Python $PythonVersion and creating venv..."
    uv python install $PythonVersion
    uv venv -p $PythonVersion $VenvDir
} else {
    Write-Host "✅ .venv already exists"
}

# ----------------------------------------------
# > Activate venv for current session
# ----------------------------------------------
$Python = Join-Path $VenvDir "Scripts\python.exe"
$env:PATH = "$VenvDir\Scripts;$env:PATH"
$ActivatePath = Join-Path $VenvDir "Scripts\Activate.ps1"
. $ActivatePath
Write-Host "🐍 Using $Python --version"

# ----------------------------------------------
# > Install pip, setuptools, wheel
# ----------------------------------------------
& $Python -m ensurepip --upgrade
& $Python -m pip install --upgrade pip setuptools wheel toml

# ----------------------------------------------
# Install packages and export requirements
# ----------------------------------------------
if (Test-Path $installScript) {
    & $Python "$ScriptDir\install_packages.py"
} else {
    Write-Host "⚠️ install_packages.sh not found — skipping"
}

# ----------------------------------------------
# > Run codegen script(s)
# ----------------------------------------------
& $Python "$ScriptDir\generate_types.py"

# ----------------------------------------------
# > Output venv activate path for shell sourcing
# ----------------------------------------------
& Write-Output "Enter the command '. $ActivatePath' to activate the Python environment"
