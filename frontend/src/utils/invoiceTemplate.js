// Shared B2B Wholesale GST Tax Invoice / Bill Template Generator for Niyansh Pharma

function numberToIndianWords(num) {
  const n = Math.round(Number(num) || 0);
  if (n === 0) return 'Zero Rupees Only';

  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Thirteen', 'Eighteen', 'Nineteen'];
  // Fix 17 typo cleanly
  ones[17] = 'Seventeen';
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const twoDigits = (val) => {
    if (val < 20) return ones[val];
    return tens[Math.floor(val / 10)] + (val % 10 ? ' ' + ones[val % 10] : '');
  };

  const threeDigits = (val) => {
    if (val >= 100) {
      return ones[Math.floor(val / 100)] + ' Hundred' + (val % 100 ? ' ' + twoDigits(val % 100) : '');
    }
    return twoDigits(val);
  };

  let result = '';
  const crore = Math.floor(n / 10000000);
  const lakh = Math.floor((n % 10000000) / 100000);
  const thousand = Math.floor((n % 100000) / 1000);
  const rest = n % 1000;

  if (crore) result += twoDigits(crore) + ' Crore ';
  if (lakh) result += twoDigits(lakh) + ' Lakh ';
  if (thousand) result += twoDigits(thousand) + ' Thousand ';
  if (rest) result += threeDigits(rest);

  return result.trim() + ' Rupees Only';
}

export function buildWholesaleInvoiceHtml({
  invoiceNumber,
  invoiceDate,
  shopName = 'Retail Chemist Store',
  retailerMobile = 'N/A',
  retailerEmail = '',
  gstin = '',
  drugLicense = '',
  items = [],
  taxableSubtotal = 0,
  totalGstAmount = 0,
  grandTotal = 0,
  totalBoxes = 0,
  totalUnits = 0,
  totalSchemeBonusUnits = 0,
  totalSchemeSavings = 0,
  paymentStatus = 'Pending'
}) {
  const safeOrderNo = invoiceNumber || `NP-INV-${Date.now().toString().slice(-6)}`;
  const dateObj = invoiceDate ? new Date(invoiceDate) : new Date();
  const dateStr = dateObj.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const computedTaxable = Number(taxableSubtotal) || items.reduce((s, it) => s + (Number(it.lineSubtotal || it.itemTotal) || 0), 0);
  const computedGst = Number(totalGstAmount) || items.reduce((s, it) => {
    const base = Number(it.lineSubtotal || it.itemTotal) || 0;
    const rate = it.gstRate !== undefined ? Number(it.gstRate) : 12;
    return s + (Number(it.lineGst) || Math.round((base * rate / 100) * 100) / 100);
  }, 0);
  const computedGrand = Number(grandTotal) || (computedTaxable + computedGst);
  const cgst = Math.round((computedGst / 2) * 100) / 100;
  const sgst = Math.round((computedGst - cgst) * 100) / 100;
  const computedBoxes = Number(totalBoxes) || items.reduce((s, it) => s + (Number(it.boxes || it.quantity) || 0), 0);
  const computedUnits = Number(totalUnits) || items.reduce((s, it) => s + (Number(it.totalUnits) || (Number(it.boxes || it.quantity) || 1) * (Number(it.unitsPerBox) || 1)), 0);

  const escapeHtml = (str) => String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

  const rowsHtml = items.map((item, idx) => {
    const boxes = Number(item.boxes || item.quantity) || 1;
    const units = Number(item.totalUnits) || boxes * (Number(item.unitsPerBox) || 1);
    const rate = Number(item.unitPrice || item.price) || 0;
    const gstRate = item.gstRate !== undefined ? Number(item.gstRate) : 12;
    const lineSub = Number(item.lineSubtotal || item.itemTotal) || (units * rate);
    const lineGst = Number(item.lineGst) || Math.round((lineSub * gstRate / 100) * 100) / 100;
    const lineTot = Number(item.lineTotal) || (lineSub + lineGst);
    const bonus = Number(item.bonusUnits) || 0;

    return `
      <tr>
        <td style="text-align:center;">${idx + 1}</td>
        <td>
          <strong>${escapeHtml(item.productName || item.name)}</strong>
          ${item.company ? `<div class="muted">${escapeHtml(item.company)}${item.form ? ` • ${escapeHtml(item.form)}` : ''}</div>` : ''}
          ${item.composition ? `<div class="muted">${escapeHtml(item.composition)}</div>` : ''}
          ${item.scheme ? `<div class="scheme-tag">Scheme: ${escapeHtml(item.scheme)}${bonus > 0 ? ` (+${bonus} Free)` : ''}</div>` : ''}
        </td>
        <td style="text-align:center;">${escapeHtml(item.hsnCode || '3004')}</td>
        <td>${escapeHtml(item.packing || `${item.unitsPerBox || 10} Units/Box`)}</td>
        <td class="text-right">${boxes} Box<div class="muted">(${units} U)</div></td>
        <td class="text-right">${bonus > 0 ? `+${bonus}` : '-'}</td>
        <td class="text-right">₹${rate.toFixed(2)}</td>
        <td class="text-right">${gstRate}%</td>
        <td class="text-right">₹${lineSub.toFixed(2)}</td>
        <td class="text-right"><strong>₹${lineTot.toFixed(2)}</strong></td>
      </tr>
    `;
  }).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Niyansh Pharma - GST Tax Invoice ${escapeHtml(safeOrderNo)}</title>
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 0;
      padding: 18px;
      color: #0f172a;
      background: #f8fafc;
      line-height: 1.4;
    }
    .sheet {
      max-width: 960px;
      margin: 0 auto;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 10px;
      padding: 22px;
      box-shadow: 0 4px 18px rgba(0, 0, 0, 0.06);
    }
    .toolbar {
      max-width: 960px;
      margin: 0 auto 12px auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
    }
    .btn-print {
      background: #0c3d6c;
      color: #ffffff;
      border: none;
      padding: 10px 18px;
      border-radius: 8px;
      font-weight: 700;
      font-size: 14px;
      cursor: pointer;
    }
    .btn-close {
      background: #e2e8f0;
      color: #334155;
      border: none;
      padding: 10px 14px;
      border-radius: 8px;
      font-weight: 700;
      font-size: 14px;
      cursor: pointer;
    }
    .header {
      border-bottom: 2px solid #0c3d6c;
      padding-bottom: 14px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 16px;
      flex-wrap: wrap;
    }
    .title { color: #0c3d6c; font-size: 22px; font-weight: 900; letter-spacing: 0.3px; margin-bottom: 2px; }
    .subtitle { font-size: 11.5px; color: #475569; }
    .inv-meta { text-align: right; }
    .badge {
      display: inline-block;
      padding: 3px 10px;
      font-size: 11px;
      font-weight: 800;
      background: #e0f2fe;
      color: #0369a1;
      border-radius: 4px;
      border: 1px solid #bae6fd;
    }
    .details {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
      margin: 16px 0;
      font-size: 12.5px;
    }
    .box {
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 10px 12px;
      background: #fcfdff;
    }
    .box-title {
      font-weight: 800;
      color: #0c3d6c;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 5px;
      margin-bottom: 6px;
      font-size: 11.5px;
      text-transform: uppercase;
      letter-spacing: 0.4px;
    }
    .table-wrap { width: 100%; overflow-x: auto; }
    table.items-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 8px;
      font-size: 11.5px;
      min-width: 680px;
    }
    table.items-table th {
      background: #f1f5f9;
      color: #0c3d6c;
      font-weight: 800;
      text-align: left;
      padding: 8px 6px;
      border: 1px solid #cbd5e1;
      white-space: nowrap;
    }
    table.items-table td {
      padding: 7px 6px;
      border: 1px solid #e2e8f0;
      vertical-align: top;
    }
    .muted { font-size: 10px; color: #64748b; }
    .scheme-tag { font-size: 10px; color: #ea580c; font-weight: 700; margin-top: 2px; }
    .text-right { text-align: right !important; }
    .bottom-grid {
      display: grid;
      grid-template-columns: 1fr 330px;
      gap: 18px;
      margin-top: 16px;
      align-items: start;
    }
    .words-box {
      border: 1px solid #e2e8f0;
      background: #f8fafc;
      border-radius: 6px;
      padding: 10px 12px;
      font-size: 12px;
    }
    .summary-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12.5px;
    }
    .summary-table td {
      padding: 6px 10px;
      border: 1px solid #cbd5e1;
    }
    .grand-total {
      font-weight: 900;
      font-size: 15px;
      background: #f0fdf4;
      color: #166534;
    }
    .footer {
      margin-top: 28px;
      font-size: 11px;
      color: #64748b;
      border-top: 1px dashed #cbd5e1;
      padding-top: 12px;
      display: flex;
      justify-content: space-between;
      gap: 16px;
      flex-wrap: wrap;
    }
    @media (max-width: 680px) {
      body { padding: 8px; }
      .sheet { padding: 14px; }
      .details, .bottom-grid { grid-template-columns: 1fr; }
      .inv-meta { text-align: left; }
    }
    @media print {
      body { background: #ffffff; padding: 0; }
      .sheet { border: none; box-shadow: none; padding: 0; }
      .toolbar { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="toolbar">
    <span style="font-size:13px;font-weight:700;color:#475569;">Niyansh Pharma • Wholesale GST Tax Invoice Preview</span>
    <div style="display:flex;gap:8px;">
      <button class="btn-print" onclick="window.print()">🖨️ Print / Save PDF</button>
      <button class="btn-close" onclick="window.close()">Close</button>
    </div>
  </div>

  <div class="sheet">
    <div class="header">
      <div>
        <div class="title">NIYANSH PHARMA</div>
        <div class="subtitle"><strong>Wholesale Pharmaceutical &amp; Healthcare Distributors</strong></div>
        <div class="subtitle">Rajkot Wholesale Hub, Gujarat | Contact: +91 99099 23130</div>
        <div class="subtitle">D.L. No.: 20B GJ-RJT-264618, 21B GJ-RJT-264619 | FSSAI: 20726030000567</div>
        <div class="subtitle">GSTIN: <strong>24BVXPP6108F2Z7</strong> | PAN: <strong>BVXPP6108F</strong></div>
      </div>
      <div class="inv-meta">
        <span class="badge">B2B GST TAX INVOICE</span>
        <div style="font-weight:800;margin-top:8px;font-size:14px;color:#0c3d6c;"># ${escapeHtml(safeOrderNo)}</div>
        <div style="font-size:12px;color:#475569;">Date: ${escapeHtml(dateStr)}</div>
        <div style="font-size:11.5px;color:#475569;">Status: <strong>${escapeHtml(paymentStatus)}</strong></div>
      </div>
    </div>

    <div class="details">
      <div class="box">
        <div class="box-title">Billed To (Retailer / Chemist)</div>
        <div><strong>Store Name:</strong> ${escapeHtml(shopName)}</div>
        <div><strong>Mobile:</strong> ${escapeHtml(retailerMobile)}</div>
        ${retailerEmail ? `<div><strong>Email:</strong> ${escapeHtml(retailerEmail)}</div>` : ''}
        <div><strong>GSTIN:</strong> ${escapeHtml(gstin || 'Unregistered / B2B Exempt')}</div>
        ${drugLicense ? `<div><strong>Drug License:</strong> ${escapeHtml(drugLicense)}</div>` : ''}
      </div>
      <div class="box">
        <div class="box-title">Dispatch &amp; Payment Terms</div>
        <div><strong>Dispatch Hub:</strong> Niyansh Pharma Logistics Desk, Rajkot</div>
        <div><strong>Payment Mode:</strong> Bank NEFT / RTGS / Instant UPI</div>
        <div><strong>UPI ID:</strong> 9316566894@okbizaxis</div>
        <div><strong>Credit Terms:</strong> Standard 21-Day Trade Credit</div>
      </div>
    </div>

    <div class="table-wrap">
      <table class="items-table">
        <thead>
          <tr>
            <th style="width:28px;text-align:center;">#</th>
            <th>Product Name &amp; Composition</th>
            <th style="text-align:center;">HSN</th>
            <th>Packing</th>
            <th class="text-right">Qty</th>
            <th class="text-right">Free</th>
            <th class="text-right">PTR (₹)</th>
            <th class="text-right">GST %</th>
            <th class="text-right">Taxable (₹)</th>
            <th class="text-right">Total (₹)</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    </div>

    <div class="bottom-grid">
      <div class="words-box">
        <div style="font-weight:800;color:#0c3d6c;margin-bottom:4px;">Invoice Amount in Words:</div>
        <div style="font-weight:700;color:#1e293b;margin-bottom:8px;">${escapeHtml(numberToIndianWords(computedGrand))}</div>
        <div style="font-size:11px;color:#64748b;">
          <strong>Total Quantity:</strong> ${items.length} Line Item(s) • ${computedBoxes} Box(es) • ${computedUnits} Unit(s)
          ${totalSchemeBonusUnits > 0 ? `<br/><strong style="color:#15803d;">Free Scheme Units:</strong> +${totalSchemeBonusUnits} Units (Value ₹${Number(totalSchemeSavings).toFixed(2)})` : ''}
        </div>
      </div>

      <table class="summary-table">
        <tr>
          <td>Taxable Subtotal (PTR)</td>
          <td class="text-right">₹${computedTaxable.toFixed(2)}</td>
        </tr>
        <tr>
          <td>CGST (6% / 9%)</td>
          <td class="text-right">₹${cgst.toFixed(2)}</td>
        </tr>
        <tr>
          <td>SGST (6% / 9%)</td>
          <td class="text-right">₹${sgst.toFixed(2)}</td>
        </tr>
        <tr>
          <td>Total GST Tax</td>
          <td class="text-right"><strong>₹${computedGst.toFixed(2)}</strong></td>
        </tr>
        <tr class="grand-total">
          <td>Grand Commercial Total</td>
          <td class="text-right">₹${computedGrand.toFixed(2)}</td>
        </tr>
      </table>
    </div>

    <div class="footer">
      <div style="flex:1;min-width:220px;">
        <strong>Terms &amp; Conditions:</strong><br/>
        1. Goods once sold will not be taken back unless batch verified for transit damage within 24 hours.<br/>
        2. Subject to Rajkot Jurisdiction. E. &amp; O.E.
      </div>
      <div style="text-align:right;min-width:160px;">
        <div style="margin-bottom:28px;font-weight:700;color:#0c3d6c;">For NIYANSH PHARMA</div>
        <div style="border-top:1px solid #94a3b8;padding-top:4px;">Authorized Signatory</div>
      </div>
    </div>
  </div>
</body>
</html>`;
}

export function openWholesaleInvoiceWindow(invoicePayload) {
  const html = buildWholesaleInvoiceHtml(invoicePayload);
  const printWin = window.open('', '_blank');
  if (printWin) {
    printWin.document.open();
    printWin.document.write(html);
    printWin.document.close();
    setTimeout(() => {
      try {
        printWin.focus();
      } catch (_) {}
    }, 300);
    return true;
  }
  return false;
}
