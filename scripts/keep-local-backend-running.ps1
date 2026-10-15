$ErrorActionPreference = 'SilentlyContinue'
$projectRoot = Split-Path -Parent $PSScriptRoot
$backendDir = Join-Path $projectRoot 'backend'
$python = Join-Path $projectRoot '.venv\Scripts\python.exe'
$logPath = Join-Path $env:LOCALAPPDATA 'CareerSage\backend.log'
$errorPath = Join-Path $env:LOCALAPPDATA 'CareerSage\backend-error.log'
$logDir = Split-Path -Parent $logPath
New-Item -ItemType Directory -Path $logDir -Force | Out-Null

while ($true) {
    $healthy = $false
    try {
        $response = Invoke-WebRequest -Uri 'http://127.0.0.1:8000/api/health' -UseBasicParsing -TimeoutSec 3
        $healthy = $response.StatusCode -eq 200
    } catch {}

    if (-not $healthy) {
        Add-Content -Path $logPath -Value "$(Get-Date -Format o) Starting CareerSage backend"
        Start-Process -FilePath $python `
            -ArgumentList @('-m', 'uvicorn', 'main:app', '--host', '127.0.0.1', '--port', '8000') `
            -WorkingDirectory $backendDir `
            -WindowStyle Hidden `
            -RedirectStandardOutput $logPath `
            -RedirectStandardError $errorPath
        Start-Sleep -Seconds 5
    } else {
        Start-Sleep -Seconds 15
    }
}
