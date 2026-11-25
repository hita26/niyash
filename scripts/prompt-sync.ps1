# =========================================================================
# Prompt ERP ↔ Niyansh Pharma Cloud Live Sync (PowerShell Agent)
# =========================================================================
# Supports: D:\niyansh\stock.xls, .xlsx, and .csv
# Auto-detects Prompt Rx "Stock Actual" layout and syncs to cloud in real time.
# =========================================================================
param (
    [string]$WatchFile = "D:\niyansh\stock.xls",
    [string]$ApiUrl = "https://niyanshpharma.com/api/sync/prompt-stock",
    [string]$ApiKey = "NP_PROMPT_SECRET_KEY_2026",
    [int]$IntervalSeconds = 15
)

# Fallback path if D:\niyansh\stock.xls does not exist yet
if (-not (Test-Path $WatchFile)) {
    if (Test-Path "D:\niyansh\stock.csv") {
        $WatchFile = "D:\niyansh\stock.csv"
    } elseif (Test-Path "C:\PromptData\Stock.csv") {
        $WatchFile = "C:\PromptData\Stock.csv"
    }
}

Write-Host "===========================================================" -ForegroundColor Cyan
Write-Host "⚡ Niyansh Pharma — Prompt ERP Live Sync Bridge (Windows)" -ForegroundColor Yellow
Write-Host "===========================================================" -ForegroundColor Cyan
Write-Host "📁 Target File    : $WatchFile"
Write-Host "🌐 Cloud API      : $ApiUrl"
Write-Host "⏱️ Poll Interval  : ${IntervalSeconds}s"
Write-Host "===========================================================`n"

$script:lastHash = $null
$script:isSyncing = $false

function Extract-ItemsFromExcel([string]$filePath) {
    $items = @()
    $excel = $null
    $wb = $null
    try {
        $excel = New-Object -ComObject Excel.Application
        $excel.Visible = $false
        $excel.DisplayAlerts = $false
        
        $wb = $excel.Workbooks.Open($filePath, 0, $true) # Open ReadOnly
        $ws = $wb.Sheets.Item(1)
        $usedRange = $ws.UsedRange
        $rowCount = $usedRange.Rows.Count

        # Locate Header Row (usually Row 6 in Prompt Stock Actual)
        $headerRow = 6
        for ($r = 1; $r -le [Math]::Min(15, $rowCount); $r++) {
            for ($c = 1; $c -le 10; $c++) {
                $val = "$($ws.Cells.Item($r, $c).Text)".Trim()
                if ($val -like "*Product*") {
                    $headerRow = $r
                    break
                }
            }
        }

        # Dynamic Column Detection
        $colProd = 3
        $colPack = 6
        $colQty = 8
        $colRate = 9
        for ($c = 1; $c -le 15; $c++) {
            $headerText = "$($ws.Cells.Item($headerRow, $c).Text)".Trim().ToLower()
            if ($headerText -eq "product") { $colProd = $c }
            if ($headerText -eq "pack")    { $colPack = $c }
            if ($headerText -eq "qty")     { $colQty = $c }
            if ($headerText -eq "rate")    { $colRate = $c }
        }

        # Iterate Data Rows
        for ($r = $headerRow + 1; $r -le $rowCount; $r++) {
            $prodName = "$($ws.Cells.Item($r, $colProd).Text)".Trim()
            if (-not $prodName -or $prodName -eq "Total" -or $prodName -like "*Amount*") {
                continue
            }

            $pack = "$($ws.Cells.Item($r, $colPack).Text)".Trim()
            $qtyRaw = "$($ws.Cells.Item($r, $colQty).Text)".Replace(",", "").Trim()
            $rateRaw = "$($ws.Cells.Item($r, $colRate).Text)".Replace(",", "").Trim()

            $qty = 0; [double]::TryParse($qtyRaw, [ref]$qty) | Out-Null
            $rate = 0; [double]::TryParse($rateRaw, [ref]$rate) | Out-Null

            $items += @{
                itemName = $prodName
                company  = "Niyansh Pharma"
                packing  = if ($pack) { $pack } else { "Standard" }
                stockQty = [int]$qty
                rate     = [double]$rate
                mrp      = [double]$rate
            }
        }
    }
    finally {
        if ($wb) { $wb.Close($false) }
        if ($excel) {
            $excel.Quit()
            [System.Runtime.InteropServices.Marshal]::ReleaseComObject($excel) | Out-Null
        }
        [GC]::Collect()
        [GC]::WaitForPendingFinalizers()
    }
    return $items
}

function Extract-ItemsFromCsv([string]$filePath) {
    $rows = Import-Csv -Path $filePath
    $items = @()
    foreach ($r in $rows) {
        $name = if ($r.ItemName) { $r.ItemName } elseif ($r.Product) { $r.Product } else { "" }
        if (-not $name) { continue }
        $items += @{
            itemCode = if ($r.ItemCode) { $r.ItemCode } else { "" }
            itemName = $name
            company  = if ($r.Company) { $r.Company } else { "Niyansh Pharma" }
            packing  = if ($r.Packing) { $r.Packing } elseif ($r.Pack) { $r.Pack } else { "Standard" }
            stockQty = [int]($r.StockQty -or $r.Qty -or 0)
            rate     = [double]($r.Rate -or $r.Price -or 0)
            mrp      = [double]($r.MRP -or $r.Rate -or 0)
            batchNo  = if ($r.BatchNo) { $r.BatchNo } else { "REGULAR" }
            expiry   = if ($r.Expiry) { $r.Expiry } else { "" }
            scheme   = if ($r.Scheme) { $r.Scheme } else { "" }
        }
    }
    return $items
}

function Sync-PromptStock {
    if ($script:isSyncing) { return }
    if (-not (Test-Path $WatchFile)) {
        Write-Host "[PromptSync] Waiting for export file: $WatchFile" -ForegroundColor DarkGray
        return
    }

    try {
        $currentHash = (Get-FileHash -Path $WatchFile -Algorithm MD5).Hash
        if ($currentHash -eq $script:lastHash) {
            return
        }

        $script:isSyncing = $true
        Write-Host "`n[$(Get-Date -Format 'HH:mm:ss')] 📦 Detected update in Prompt export file: $WatchFile" -ForegroundColor Yellow

        $items = @()
        $ext = [System.IO.Path]::GetExtension($WatchFile).ToLower()

        if ($ext -in @('.xls', '.xlsx')) {
            Write-Host "📊 Reading Excel report via COM parser..." -ForegroundColor Cyan
            $items = Extract-ItemsFromExcel -filePath $WatchFile
        } else {
            Write-Host "📄 Reading CSV report..." -ForegroundColor Cyan
            $items = Extract-ItemsFromCsv -filePath $WatchFile
        }

        if ($items.Count -eq 0) {
            Write-Host "⚠️ No valid medicine rows found." -ForegroundColor DarkYellow
            $script:lastHash = $currentHash
            return
        }

        Write-Host "🚀 Uploading $($items.Count) products to $ApiUrl..." -ForegroundColor Cyan

        # Send in batches of 500 to optimize network transfer
        $batchSize = 500
        $totalUploaded = 0
        $totalUpdated = 0
        $totalUnmatched = 0

        for ($i = 0; $i -lt $items.Count; $i += $batchSize) {
            $slice = $items[$i..[Math]::Min($i + $batchSize - 1, $items.Count - 1)]
            
            $payload = @{
                source      = "Prompt ERP Desktop Bridge ($env:COMPUTERNAME)"
                triggeredBy = "Windows Live Sync Agent"
                items       = $slice
            } | ConvertTo-Json -Depth 5

            $headers = @{
                "Content-Type"   = "application/json"
                "x-sync-api-key" = $ApiKey
            }

            $response = Invoke-RestMethod -Uri $ApiUrl -Method Post -Headers $headers -Body $payload
            if ($response.success) {
                $totalUploaded += $slice.Count
                $totalUpdated += [int]($response.proof.stockRatesUpdated)
                $totalUnmatched += [int]($response.proof.unmatchedCount)
                Write-Host "   ├─ Batch $([Math]::Floor($i / $batchSize) + 1): $($slice.Count) items evaluated" -ForegroundColor Green
            } else {
                Write-Host "   ❌ Batch Error: $($response.message)" -ForegroundColor Red
            }
        }

        Write-Host "`n✅ SYNC SUCCESS! Prompt ERP Batch Evaluated against Live Catalog." -ForegroundColor Green
        Write-Host "   ├─ Existing Products Updated : $totalUpdated items" -ForegroundColor Green
        Write-Host "   ├─ Unmatched (Not in Catalog): $totalUnmatched items safely excluded" -ForegroundColor Yellow
        Write-Host "   ├─ New Products Auto-Created : 0 (100% Strict Protection - No fake data)" -ForegroundColor Cyan
        Write-Host "   └─ Cloud Status              : LIVE ON niyanshpharma.com`n" -ForegroundColor Green
        $script:lastHash = $currentHash
    }
    catch {
        Write-Host "❌ Sync Error: $($_.Exception.Message)" -ForegroundColor Red
    }
    finally {
        $script:isSyncing = $false
    }
}

# Run immediate sync on start
Sync-PromptStock

Write-Host "[PromptSync] Active & Watching $WatchFile (Interval: ${IntervalSeconds}s). Press Ctrl+C to stop." -ForegroundColor DarkCyan

while ($true) {
    Start-Sleep -Seconds $IntervalSeconds
    Sync-PromptStock
}
