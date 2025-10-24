$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$RootDir = Join-Path $ScriptDir ".."

$VenvDir = Join-Path $RootDir "apps\server\.venv"
$Python = Join-Path $VenvDir "Scripts\python.exe"

$packagesJson = Get-Content "$RootDir\config\python_packages.json" -Raw | ConvertFrom-Json
$InternalPackages = $packagesJson.internal_packages
$PythonPackages = $packagesJson.python_packages

$ExtraDepsFile = "extra_deps.py"

# ----------------------------------------------
# > Install test dependencies
# ----------------------------------------------
Write-Host "Installing test dependencies..."
& $Python -m pip install pytest pytest-mock pytest-asyncio pytest-cov httpx


# ----------------------------------------------
# > Install internal packages as editable
# ----------------------------------------------
foreach ($pkg in $InternalPackages) {
    $fullPath = Join-Path $RootDir $pkg
    if (Test-Path $fullPath) {
        Write-Host "Installing: $fullPath"
        & python -m pip install -e $fullPath
    } else {
        Write-Warning "Package path does not exist: $fullPath"
    }
}

# ----------------------------------------------
# > Extract extras from pyproject.toml (optional dependencies)
# ----------------------------------------------
$Extras = & $Python "$ScriptDir\$ExtraDepsFile"

# ----------------------------------------------
# > Install packages and export requirements
# ----------------------------------------------
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

