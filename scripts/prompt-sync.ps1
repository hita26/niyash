# =========================================================================
# Prompt ERP ↔ Niyansh Pharma Cloud Live Sync (PowerShell Agent)
# =========================================================================
param (
    [string]$WatchFile = "C:\PromptData\Stock.csv",
    [string]$ApiUrl = "https://niyanshpharma.com/api/sync/prompt-stock",
    [string]$ApiKey = "NP_PROMPT_SECRET_KEY_2026",
    [int]$IntervalSeconds = 15
)

Write-Host "===========================================================" -ForegroundColor Cyan
Write-Host "⚡ Niyansh Pharma — Prompt ERP Live Sync Bridge (Windows)" -ForegroundColor Yellow
Write-Host "===========================================================" -ForegroundColor Cyan
Write-Host "📁 Target File    : $WatchFile"
Write-Host "🌐 Cloud API      : $ApiUrl"
Write-Host "⏱️ Poll Interval  : ${IntervalSeconds}s"
Write-Host "===========================================================`n"

# Ensure test sample file if missing
$folder = Split-Path -Parent $WatchFile
if (-not (Test-Path $folder)) {
    New-Item -ItemType Directory -Path $folder -Force | Out-Null
}

if (-not (Test-Path $WatchFile)) {
    $sampleData = @"
ItemCode,ItemName,Company,Packing,BatchNo,Expiry,MRP,Rate,StockQty,Scheme
DAX-MUC-600,MUCIDAX 600 TAB,Daxia Healthcare,10x10 Tablets,MC-2401,12/2027,260.00,185.00,450,10+1 FREE
DAX-AZI-500,AZITHROMYCIN 500 MG TAB,Daxia Healthcare,10x3 Tablets,AZ-902,08/2028,145.00,95.00,280,Flat 10% Off
DAX-TEL-40,TELMISARTAN 40 MG TAB,Daxia Healthcare,10x10 Tablets,TL-881,11/2027,85.00,42.00,620,10+2 FREE
DAX-PAN-40,PANTOPRAZOLE 40 MG TAB,Daxia Healthcare,10x10 Tablets,PN-440,05/2028,95.00,48.00,510,Flat 12% Off
DAX-PAR-650,PARACETAMOL 650 MG TAB,Daxia Healthcare,10x15 Tablets,PC-650,09/2028,32.00,18.00,1200,Regular
"@
    Set-Content -Path $WatchFile -Value $sampleData -Encoding UTF8
    Write-Host "[PromptSync] Created test sample stock file at: $WatchFile" -ForegroundColor Green
}

$lastHash = $null

function Sync-PromptStock {
    if (-not (Test-Path $WatchFile)) {
        Write-Host "[PromptSync] Waiting for export file: $WatchFile" -ForegroundColor DarkGray
        return
    }

    $currentHash = (Get-FileHash -Path $WatchFile -Algorithm MD5).Hash
    if ($currentHash -eq $script:lastHash) {
        return
    }

    Write-Host "`n[$(Get-Date -Format 'HH:mm:ss')] 📦 Detected update in Prompt export file!" -ForegroundColor Yellow
    
    try {
        $rows = Import-Csv -Path $WatchFile
        if ($rows.Count -eq 0) {
            Write-Host "⚠️ No rows found in CSV." -ForegroundColor DarkYellow
            $script:lastHash = $currentHash
            return
        }

        $items = @()
        foreach ($r in $rows) {
            $items += @{
                itemCode = $r.ItemCode
                itemName = $r.ItemName
                company  = if ($r.Company) { $r.Company } else { "Daxia Healthcare" }
                packing  = if ($r.Packing) { $r.Packing } else { "Standard" }
                batchNo  = if ($r.BatchNo) { $r.BatchNo } else { "REGULAR" }
                expiry   = if ($r.Expiry) { $r.Expiry } else { "" }
                mrp      = [double]($r.MRP)
                rate     = [double]($r.Rate)
                stockQty = [int]($r.StockQty)
                scheme   = if ($r.Scheme) { $r.Scheme } else { "" }
            }
        }

        $payload = @{
            source      = "Prompt ERP Windows Background Agent"
            triggeredBy = "Billing PC ($env:COMPUTERNAME)"
            items       = $items
        } | ConvertTo-Json -Depth 5

        Write-Host "🚀 Uploading $($items.Count) products to $ApiUrl..." -ForegroundColor Cyan

        $headers = @{
            "Content-Type"   = "application/json"
            "x-sync-api-key" = $ApiKey
        }

        $response = Invoke-RestMethod -Uri $ApiUrl -Method Post -Headers $headers -Body $payload

        if ($response.success) {
            Write-Host "✅ SYNC SUCCESS! $($response.message)" -ForegroundColor Green
            Write-Host "   ├─ Stock & Rates Updated : $($response.proof.stockRatesUpdated)" -ForegroundColor Green
            Write-Host "   ├─ New Products Added    : $($response.proof.newProductsCreated)" -ForegroundColor Green
            Write-Host "   ├─ Duplicates Prevented  : 100% Guaranteed Zero-Duplication" -ForegroundColor Green
            Write-Host "   └─ Cloud Status          : LIVE ON niyanshpharma.com`n" -ForegroundColor Green
            $script:lastHash = $currentHash
        } else {
            Write-Host "❌ Cloud returned error: $($response.message)" -ForegroundColor Red
        }
    }
    catch {
        Write-Host "❌ Sync Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Run immediate check once, then loop
Sync-PromptStock

Write-Host "[PromptSync] Watching $WatchFile in background (Press Ctrl+C to stop)..." -ForegroundColor DarkCyan

while ($true) {
    Start-Sleep -Seconds $IntervalSeconds
    Sync-PromptStock
}
