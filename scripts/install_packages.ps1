# ----------------------------------------------
# > Install internal packages as editable
# ----------------------------------------------
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$RootDir = Join-Path $ScriptDir ".."
$packagesJson = Get-Content "$RootDir\config\internal_packages.json" -Raw | ConvertFrom-Json
$InternalPackages = $packagesJson.internal_packages

foreach ($pkg in $InternalPackages) {
    $fullPath = Join-Path $RootDir $pkg
    if (Test-Path $fullPath) {
        Write-Host "Installing: $fullPath"
        & python -m pip install -e $fullPath
    } else {
        Write-Warning "Package path does not exist: $fullPath"
    }
}
