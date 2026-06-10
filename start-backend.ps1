# =========================================
# 3J Backend Startup Script
# Run from the project root: .\start-backend.ps1
# =========================================

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "   3J Backend Startup" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check Docker is running
Write-Host "[1/4] Checking Docker..." -ForegroundColor Yellow
try {
    docker info | Out-Null
    Write-Host "      Docker is running." -ForegroundColor Green
} catch {
    Write-Host "      ERROR: Docker is not running. Please start Docker Desktop first." -ForegroundColor Red
    exit 1
}

# Step 2: Start postgres container
Write-Host "[2/4] Starting PostgreSQL container..." -ForegroundColor Yellow
try {
    docker-compose up -d postgres 2>&1 | Out-Null
} catch {
    # On Windows, docker-compose may return a non-zero exit code even on success
    # when it emits warnings to stderr. We rely on the pg_isready check in step 3
    # to catch genuine failures, so we swallow this error here.
}
Write-Host "      PostgreSQL container started." -ForegroundColor Green

# Step 3: Wait for postgres to be ready
Write-Host "[3/4] Waiting for PostgreSQL to be ready..." -ForegroundColor Yellow
$maxAttempts = 20
$attempt = 0
$ready = $false

while ($attempt -lt $maxAttempts) {
    $attempt++
    try {
        $result = docker exec 3j_postgres pg_isready -U user -d 3j_db 2>&1
        if ($result -match "accepting connections") {
            $ready = $true
            break
        }
    } catch {}
    Write-Host "      Attempt $attempt/$maxAttempts - waiting..." -ForegroundColor DarkGray
    Start-Sleep -Seconds 2
}

if (-not $ready) {
    Write-Host "      ERROR: PostgreSQL did not become ready in time." -ForegroundColor Red
    exit 1
}
Write-Host "      PostgreSQL is ready." -ForegroundColor Green

# Step 4: Start FastAPI backend
Write-Host "[4/4] Starting FastAPI backend..." -ForegroundColor Yellow
Write-Host ""
Write-Host "  API:  http://localhost:8000" -ForegroundColor Cyan
Write-Host "  Docs: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Press Ctrl+C to stop." -ForegroundColor DarkGray
Write-Host ""

Set-Location backend
& .\venv\Scripts\Activate.ps1
python main.py
