# Niyansh Pharma — Prompt ERP Client Machine Setup & Synchronization Field Guide

> **Confidential Technical Field Guide**  
> *Target Audience:* Implementation Engineer / Field Technician  
> *Target Environment:* Wholesale Pharmacy Billing PC (Windows 10 / Windows 11)  
> *Security Notice:* For internal technical setup only. Do NOT publish to public-facing website pages.

---

## 1. Overview & Architecture

This guide covers the deployment of the **Niyansh Pharma Prompt ERP Live Sync Bridge** on the client's local Windows billing computer.

```
┌───────────────────────────────┐               ┌─────────────────────────────────┐
│     Prompt ERP Software       │               │     Niyansh Pharma Cloud        │
│   (Wholesale Billing PC)      │               │   (https://niyanshpharma.com)   │
└──────────────┬────────────────┘               └────────────────┬────────────────┘
               │ Auto-Export CSV                                 │
               ▼                                                 │
┌───────────────────────────────┐                                │
│    C:\PromptData\Stock.csv    │                                │
└──────────────┬────────────────┘                                │
               │ File Watcher (MD5 Hash Diff)                    │
               ▼                                                 │
┌───────────────────────────────┐   HTTPS Encrypted POST Batch   │
│   Sync Bridge Agent           ├────────────────────────────────►
│  (PowerShell or Node Daemon)  │   x-sync-api-key: Secret Key   │
└───────────────────────────────┘                                │
                                                                 ▼
                                                ┌─────────────────────────────────┐
                                                │   Cloud Database & Admin Hub    │
                                                │  - 100% Zero-Duplicate Upsert   │
                                                │  - Live Stock & Scheme Updates  │
                                                │  - Real-Time Audit Trail        │
                                                └─────────────────────────────────┘
```

---

## 2. Pre-Requisite Diagnostics (Client PC Verification)

Open **PowerShell** or **Command Prompt** (Press `Win + R`, type `powershell`, press Enter) on the client machine and run the following diagnostic commands:

### Step 1: Check Windows Architecture & PowerShell Version
```powershell
$PSVersionTable.PSVersion
```
*Expected Result:* PSVersion `5.1` or higher (built into all modern Windows 10/11 installations).

### Step 2: Check if Node.js is Installed
```powershell
node -v
```
- If output displays `v18.x.x` or `v20.x.x` or higher: **Node.js is ready** (proceed to Method A or B).
- If command is not recognized (`'node' is not recognized...`): **Use Method B (Native PowerShell, 0 installs needed)** OR install Node in 30 seconds using the command below.

### Step 3: Install Node.js (Optional - One-Command Setup)
If you prefer running the Node daemon and the PC lacks Node.js, run:
```powershell
winget install OpenJS.NodeJS.LTS -e
```
*Note: Restart the PowerShell terminal after installation.*

---

## 3. Prompt ERP Export Configuration

Configure the client's Prompt ERP software to export daily/hourly inventory snapshots:

1. In **Prompt ERP**, navigate to: **Reports / Utilities** ➔ **Inventory Export** (or **Stock Status Export**).
2. Set the destination folder:
   ```
   C:\PromptData\Stock.csv
   ```
3. Set the file format: **CSV (Comma Delimited)**.
4. Ensure the following standard column headers are included (Prompt ERP default layout):
   - `ItemCode` (Unique Medicine Code / SKU)
   - `ItemName` (Brand Name & Strength, e.g., *MUCIDAX 600 TAB*)
   - `Company` (Manufacturer / Marketing Division, e.g., *Daxia Healthcare*)
   - `Packing` (Packaging details, e.g., *10x10 Tablets*)
   - `BatchNo` (Batch number, e.g., *MC-2401*)
   - `Expiry` (Expiration date, e.g., *12/2027*)
   - `MRP` (Maximum Retail Price)
   - `Rate` (Wholesale Net Billing Rate)
   - `StockQty` (Closing physical stock quantity)
   - `Scheme` (Discount or bonus offer, e.g., *10+1 FREE*, *Flat 10% Off*)

---

## 4. Sync Agent Execution (Choose Method A or B)

Both agents include:
- **MD5 Hash Deduplication:** If the file has not changed, zero network requests are made.
- **Auto-Retry & Lock Handling:** If Prompt ERP is actively writing to the CSV, the agent waits and retries automatically.
- **Secure Authentication:** Transmits via HTTPS with `x-sync-api-key`.

### Method A: Native PowerShell Agent (Zero Installation Required) ⭐
> **Best for restricted or strictly controlled billing PCs where installing third-party software is not permitted.**

1. Copy the `scripts` folder to `C:\NiyanshSync\` on the client machine.
2. Open PowerShell and run:
   ```powershell
   powershell -ExecutionPolicy Bypass -File "C:\NiyanshSync\scripts\prompt-sync.ps1" -WatchFile "C:\PromptData\Stock.csv" -ApiUrl "https://niyanshpharma.com/api/sync/prompt-stock" -ApiKey "NP_PROMPT_SECRET_KEY_2026"
   ```

### Method B: Node.js Background Daemon
> **Best for high-concurrency continuous monitoring.**

1. Copy the `scripts` folder to `C:\NiyanshSync\` on the client machine.
2. Open terminal and run:
   ```powershell
   node "C:\NiyanshSync\scripts\promptSyncDaemon.js" --watch "C:\PromptData\Stock.csv" --api "https://niyanshpharma.com/api/sync/prompt-stock" --key "NP_PROMPT_SECRET_KEY_2026"
   ```

---

## 5. Security & Secret Key Configuration

### What is `NP_PROMPT_SECRET_KEY_2026`?
- The secret key is a pre-shared cryptographic bearer token configured between the client desktop sync agent and the Niyansh Pharma cloud backend.
- It prevents unauthorized actors or web scrapers from altering inventory or rates.
- The cloud backend validates every sync request against this key before committing any atomic database updates.

**HTTP Header Sent by Agent:**
```http
POST /api/sync/prompt-stock HTTP/1.1
Host: niyanshpharma.com
Content-Type: application/json
x-sync-api-key: NP_PROMPT_SECRET_KEY_2026
```

---

## 6. Auto-Start On Windows Boot (Set & Forget Setup)

To ensure the sync agent runs silently in the background whenever the client PC boots up:

### Option A: Windows Startup Folder Shortcut (Easiest)
1. On the client machine, create a file named `StartPromptSync.bat` inside `C:\NiyanshSync\`:
   ```bat
   @echo off
   title Niyansh Pharma Prompt Sync Service
   echo Starting Niyansh Pharma Sync Bridge...
   powershell -ExecutionPolicy Bypass -WindowStyle Minimized -File "C:\NiyanshSync\scripts\prompt-sync.ps1" -WatchFile "C:\PromptData\Stock.csv"
   ```
2. Press `Win + R`, type `shell:startup`, and press Enter.
3. Right-click ➔ **New** ➔ **Shortcut**, and select `C:\NiyanshSync\StartPromptSync.bat`.
4. The sync agent will now start minimized whenever Windows boots.

### Option B: Windows Task Scheduler (Enterprise Background Service)
Run this single PowerShell command as Administrator to register a permanent background service:
```powershell
$Action = New-ScheduledTaskAction -Execute 'powershell.exe' -Argument '-ExecutionPolicy Bypass -WindowStyle Hidden -File "C:\NiyanshSync\scripts\prompt-sync.ps1"'
$Trigger = New-ScheduledTaskTrigger -AtLogon
Register-ScheduledTask -TaskName "NiyanshPharmaPromptSync" -Action $Action -Trigger $Trigger -Description "Syncs Prompt ERP inventory with Niyansh Pharma Cloud" -User "$env:USERNAME" -RunLevel Highest
```

---

## 7. Verification & Live Acceptance Checklist

Execute this 3-step checklist before leaving the client's office:

| Step | Action | Expected Output | Status |
| :--- | :--- | :--- | :---: |
| **1. Export Test** | Trigger an export in Prompt ERP or modify `C:\PromptData\Stock.csv` with a test stock change (e.g. change MUCIDAX stock from 450 to 455). | File timestamp updates on disk. | [ ] |
| **2. Terminal Audit** | Observe the active terminal window running the sync agent. | Console displays: `[PromptSync] SYNC SUCCESS! Updated X items. Zero duplicates.` | [ ] |
| **3. Cloud Admin Verification** | Open `https://niyanshpharma.com/admin` in any browser, log in, and click **⚡ ERP Sync & Logs**. | The live audit log table shows the new sync event with exact timestamp, item count, and `SUCCESS` badge. | [ ] |

---

## 8. Common Troubleshooting

| Symptom | Cause | Solution |
| :--- | :--- | :--- |
| **"Execution of scripts is disabled on this system"** | Windows PowerShell Execution Policy restriction. | Always run with `-ExecutionPolicy Bypass`. |
| **"The process cannot access the file because it is being used by another process"** | Prompt ERP is actively writing the CSV file during sync cycle. | Both agents automatically catch this and retry on the next 15-second interval. |
| **"Unauthorized / 401 Invalid Sync Key"** | Key mismatch between desktop agent and cloud backend. | Verify `--key "NP_PROMPT_SECRET_KEY_2026"` matches the cloud secret. |
| **"Failed to connect to niyanshpharma.com"** | Internet disconnection or local firewall blocking outbound HTTPS. | Verify internet access in client browser; whitelist outbound port 443. |
