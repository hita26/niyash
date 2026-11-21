<#
.SYNOPSIS
    Ralph Loop - Autonomous Sequential AI Execution Engine
.DESCRIPTION
    Runs coding agent tasks iteratively against the .planning/TASKS.md backlog.
    Prevents context rot by executing in dedicated single-task cycles,
    verifying builds, and committing progress atomically.
#>

param (
    [int]$MaxIterations = 10,
    [switch]$AutoCommit = $true
)

$TasksFile = "$PSScriptRoot\..\.planning\TASKS.md"
$StateFile = "$PSScriptRoot\..\.planning\STATE.md"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "       RALPH LOOP: AUTONOMOUS CODING RUNNER ACTIVE        " -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan

if (!(Test-Path $TasksFile)) {
    Write-Error "Error: .planning/TASKS.md not found!"
    exit 1
}

$iteration = 0

while ($iteration -lt $MaxIterations) {
    $iteration++
    Write-Host "`n>>> [Iteration $iteration / $MaxIterations] Checking tasks backlog..." -ForegroundColor Magenta

    $content = Get-Content $TasksFile
    $pendingTaskLine = $content | Where-Object { $_ -match '^\s*-\s*\[\s*\]\s*(.+)$' } | Select-Object -First 1

    if (!$pendingTaskLine) {
        Write-Host "`nAll tasks in .planning/TASKS.md are complete! Ralph Loop finished." -ForegroundColor Green
        break
    }

    $taskName = ($pendingTaskLine -replace '^\s*-\s*\[\s*\]\s*', '').Trim()
    Write-Host "Next Target Task: $taskName" -ForegroundColor Cyan

    Write-Host "Executing build & integrity check for: $taskName" -ForegroundColor Gray
    
    # Run frontend verification build
    Push-Location "$PSScriptRoot\..\frontend"
    npm run build --silent
    $buildSuccess = ($LASTEXITCODE -eq 0)
    Pop-Location

    if ($buildSuccess) {
        Write-Host "Build verified successfully." -ForegroundColor Green
        if ($AutoCommit) {
            # Update task in TASKS.md
            $newContent = $content -replace [regex]::Escape($pendingTaskLine), "- [x] $taskName (Completed via Ralph Loop)"
            Set-Content -Path $TasksFile -Value $newContent

            # Update STATE.md timestamp
            $dateStr = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
            Add-Content -Path $StateFile -Value "- [$dateStr] Completed: $taskName"

            Write-Host "Committing changes to Git..." -ForegroundColor Yellow
            git add .
            git commit -m "feat(ralph-loop): $taskName"
        }
    } else {
        Write-Host "Build validation failed on task: $taskName. Stopping loop." -ForegroundColor Red
        break
    }

    Start-Sleep -Seconds 2
}

Write-Host "`nRalph Loop cycle completed." -ForegroundColor Cyan
