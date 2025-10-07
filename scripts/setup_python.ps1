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

$ExtraDepsFile = "extra_deps.py"
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
# > Extract extras from pyproject.toml (optional dependencies)
# ----------------------------------------------
$Extras = & $Python "$ScriptDir\$ExtraDepsFile"

# ----------------------------------------------
# > Install packages and export requirements
# ----------------------------------------------
$PythonPackages = @("apps/server", "packages/ocr_core")
$PyProjectToml = "pyproject.toml"
$RequirementsTxt = "requirements.txt"

foreach ($pkg in $PythonPackages) {
    $PackageDir = Join-Path $RootDir $pkg

    if (Test-Path (Join-Path $PackageDir $PyProjectToml)) {
        Write-Host "➡️  Installing $pkg..."
        Push-Location $PackageDir

        if ($Extras) {
            & $Python -m pip install ".[$Extras]" -e .
        }
        else {
            & $Python -m pip install -e .
        }

        Write-Host "➡️  Exporting dependencies to requirements.txt..."
        uv export --no-hashes --format requirements-txt -p $Python | Out-File -Encoding utf8 $RequirementsTxt

        Pop-Location
    }
    else {
        Write-Warning "⚠️ No $PyProjectToml found in $pkg — skipping."
    }
}

Write-Host "✅ All Python dependencies installed and requirements.txt generated!"

# ----------------------------------------------
# > Run codegen script(s)
# ----------------------------------------------
& $Python "$ScriptDir\generate_types.py"

# ----------------------------------------------
# > Output venv activate path for shell sourcing
# ----------------------------------------------
& Write-Output "Enter the command '. $ActivatePath' to activate the Python environment"
