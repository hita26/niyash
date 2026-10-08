#!/usr/bin/env python3
"""
extractMdbData.py
Extracts and structures data from Prompt PharmaExcel (PromptData.mdb)
Strictly READ-ONLY with respect to data/ folder.
Outputs structured JSON to backend/scripts/extractedData.json.
"""

import subprocess
import csv
import io
import json
import os
import re
from datetime import datetime

MDB_PATH = os.path.abspath('data/PharmaExcel/PPE/2026-27/PromptData.mdb')
OUT_PATH = os.path.abspath('backend/scripts/extractedData.json')

def run_mdb_export(table_name):
    cmd = ['mdb-export', MDB_PATH, table_name]
    res = subprocess.run(cmd, capture_output=True, text=True, check=True)
    reader = csv.DictReader(io.StringIO(res.stdout))
    return list(reader)

def detect_form(name):
    n = name.upper()
    if re.search(r'\b(TAB|TABLET|TABLETS)\b', n):
        return 'Tablet'
    elif re.search(r'\b(CAP|CAPSULE|CAPSULES)\b', n):
        return 'Capsule'
    elif re.search(r'\b(INJ|INJECTION|VIAL|AMP|AMPOULE)\b', n):
        return 'Injection'
    elif re.search(r'\b(SYP|SYRUP|SUSP|SUSPENSION|LIQUID|SOL|SOLUTION|ELIXIR)\b', n):
        return 'Syrup'
    elif re.search(r'\b(DROP|DROPS|EYE|EAR)\b', n):
        return 'Drops'
    elif re.search(r'\b(CRM|CREAM|OINT|OINTMENT|GEL)\b', n):
        return 'Cream'
    elif re.search(r'\b(LOT|LOTION)\b', n):
        return 'Lotion'
    elif re.search(r'\b(SOAP|WASH)\b', n):
        return 'Soap'
    elif re.search(r'\b(SPRAY)\b', n):
        return 'Spray'
    elif re.search(r'\b(OIL)\b', n):
        return 'Oil'
    elif re.search(r'\b(IV|INFUSION|FLUID)\b', n):
        return 'IV Fluid'
    elif re.search(r'\b(SURGICAL|GAUZE|BANDAGE|SYRINGE|NEEDLE|GLOVE|GLOVES|COTTON|TAPE|MASK|CATHETER)\b', n):
        return 'Surgical'
    elif re.search(r'\b(AYUR|CHURNA|KWATH|TAILA|ASAV|ARISHTA)\b', n):
        return 'Ayurvedic'
    return 'Tablet'

def detect_category(form, name):
    n = name.upper()
    if 'SURGICAL' in n or form == 'Surgical':
        return 'Surgical & Medical Supplies'
    if form in ['Injection', 'IV Fluid']:
        return 'Injectables'
    if form in ['Cream', 'Lotion', 'Soap']:
        return 'Dermatology & Topicals'
    if form in ['Drops', 'Spray']:
        return 'OTC Products'
    if form == 'Ayurvedic':
        return 'Ayurvedic Products'
    return 'Pharma Products'

def parse_date(date_str):
    if not date_str:
        return None
    for fmt in ('%m/%d/%y %H:%M:%S', '%m/%d/%Y %H:%M:%S', '%m/%d/%y', '%Y-%m-%d'):
        try:
            return datetime.strptime(date_str.strip(), fmt).isoformat()
        except ValueError:
            pass
    return None

def main():
    print(f"Reading tables from {MDB_PATH}...")
    companies_raw = run_mdb_export('CompanyMaster')
    products_raw = run_mdb_export('ProductMaster')
    accounts_raw = run_mdb_export('AccountMaster')
    stock_raw = run_mdb_export('StockMaster')
    bills_main_raw = run_mdb_export('BillsMain')
    bills_sub_raw = run_mdb_export('BillsSub')
    orders_raw = run_mdb_export('OrderSales')
    ledger_raw = run_mdb_export('Ledger')

    print(f"  Companies: {len(companies_raw)}")
    print(f"  Products: {len(products_raw)}")
    print(f"  Accounts: {len(accounts_raw)}")
    print(f"  Stock records: {len(stock_raw)}")
    print(f"  BillsMain: {len(bills_main_raw)}")
    print(f"  BillsSub: {len(bills_sub_raw)}")
    print(f"  Orders: {len(orders_raw)}")
    print(f"  Ledger entries: {len(ledger_raw)}")

    # 1. Company Map
    company_map = {}
    for c in companies_raw:
        code = c.get('Code', '').strip()
        name = c.get('Name', '').strip()
        company_map[code] = name or 'General'

    # 2. Stock Map (Code -> latest pricing & stock)
    stock_map = {}
    for s in stock_raw:
        code = s.get('Code', '').strip()
        mrp = float(s.get('MRP') or 0)
        sale_rate = float(s.get('SaleRate') or 0)
        purchase = float(s.get('Purchase') or 0)
        cl_qty = float(s.get('ClQty') or 0)
        batch = s.get('Batch', '').strip()
        expiry = parse_date(s.get('Expiry'))

        if code not in stock_map or cl_qty > 0 or sale_rate > 0:
            stock_map[code] = {
                'mrp': mrp,
                'saleRate': sale_rate,
                'purchase': purchase,
                'clQty': cl_qty,
                'batch': batch,
                'expiry': expiry
            }

    # 3. Process Products
    products = []
    for p in products_raw:
        if p.get('Deleted', '') == '1':
            continue
        code = p.get('Code', '').strip()
        name = p.get('Name', '').strip()
        if not name:
            continue

        comp_code = p.get('Company', '').strip()
        company_name = company_map.get(comp_code, 'DAXIA')
        stock_info = stock_map.get(code, {})

        mrp = stock_info.get('mrp', 0.0)
        price = stock_info.get('saleRate', 0.0)
        if price == 0 and mrp > 0:
            price = round(mrp * 0.70, 2)

        sgst = float(p.get('SGST') or 0)
        cgst = float(p.get('CGST') or 0)
        igst = float(p.get('IGST') or 0)
        gst_rate = round(sgst + cgst if (sgst + cgst) > 0 else (igst if igst > 0 else 12.0), 2)

        cl_qty = float(p.get('ClQty') or 0) + stock_info.get('clQty', 0)
        in_stock = cl_qty > 0 or stock_info.get('clQty', 0) > 0

        form = detect_form(name)
        category = detect_category(form, name)
        pack = (p.get('SalePack') or p.get('PurPack') or '10 x 10 Tablets').strip()
        desc = p.get('Description', '').strip() or f"{name} - {company_name}"

        products.append({
            'code': code,
            'name': name,
            'brand': company_name,
            'company': company_name,
            'category': category,
            'sku': f"NP-{code}",
            'price': price,
            'mrp': mrp,
            'gstRate': gst_rate,
            'minReorderQty': max(1, int(float(p.get('MinQty') or 1))),
            'unitsPerBox': 10,
            'qualitySpecs': 'WHO-GMP Certified',
            'scheme': p.get('SchemeRemarks', '').strip(),
            'inStock': in_stock,
            'packing': pack,
            'composition': desc,
            'form': form,
            'manufacturer': company_name,
            'description': desc,
            'batch': stock_info.get('batch', ''),
            'expiry': stock_info.get('expiry')
        })

    # 4. Process Accounts (Customers / Sundry Debtors)
    accounts = {}
    for a in accounts_raw:
        if a.get('Deleted', '') == '1':
            continue
        code = a.get('Code', '').strip()
        name = a.get('Name', '').strip()
        cbo = a.get('CBO', '').strip()
        atype = a.get('Type', '').strip()
        mobile = a.get('Mobile', '').strip()

        # Sundry Debtors are Asset accounts in Sundries group
        is_customer = (atype == 'Asset' and cbo == 'Sundries') or (mobile and len(mobile) >= 10)
        if not is_customer or not name:
            continue

        # Clean mobile
        clean_mobile = re.sub(r'[^0-9]', '', mobile)
        if len(clean_mobile) < 10:
            clean_mobile = f"99000{code.zfill(5)}"
        elif len(clean_mobile) > 10 and clean_mobile.startswith('91'):
            clean_mobile = clean_mobile[-10:]

        email = (a.get('Email', '') or '').strip().lower()
        if not email or '@' not in email:
            email = f"retailer.{code}@niyanshpharma.com"

        closing_bal = abs(float(a.get('ClosingBalance') or 0))
        credit_limit = float(a.get('LimitRupees') or 0) or 100000.0

        dl = " / ".join(filter(None, [a.get('Dlic1', '').strip(), a.get('Dlic2', '').strip()]))

        accounts[code] = {
            'code': code,
            'name': a.get('KeyPerson', '').strip() or name,
            'shopName': name,
            'mobile': clean_mobile,
            'email': email,
            'gstin': a.get('GSTIN', '').strip(),
            'drugLicense': dl,
            'address': ", ".join(filter(None, [a.get('Desc1', '').strip(), a.get('Desc2', '').strip(), a.get('City', '').strip(), a.get('Pin', '').strip()])),
            'closingBalance': closing_bal,
            'creditLimit': credit_limit,
            'invoices': [],
            'payments': []
        }

    # 5. Process Invoices from BillsMain
    for b in bills_main_raw:
        if b.get('Deleted', '') == '1':
            continue
        tag = b.get('Tag', '').strip()
        if tag != 'S':  # Sales only
            continue
        party_code = b.get('Code', '').strip()
        if party_code not in accounts:
            continue

        tag_ref = b.get('TagBillingRef', '').strip() or f"SDB-T{b.get('Ref', '')}"
        amount = float(b.get('GTRs') or b.get('Amount') or 0)
        inv_date = parse_date(b.get('Date')) or datetime.now().isoformat()
        adjusted = float(b.get('AdjustedRs') or 0)
        balance = max(0.0, round(amount - adjusted, 2))

        status = 'Paid' if balance <= 0 else ('Partial' if adjusted > 0 else 'Pending')

        accounts[party_code]['invoices'].append({
            'invoiceNumber': tag_ref,
            'date': inv_date,
            'amount': amount,
            'paidAmount': adjusted,
            'balance': balance,
            'status': status
        })

    # 6. Process Payments from Ledger
    for l in ledger_raw:
        if l.get('Deleted', '') == '1':
            continue
        tag = l.get('Tag', '').strip()
        party_code = l.get('Code', '').strip()
        if party_code not in accounts:
            continue

        raw_amt = float(l.get('Amount') or 0)
        # Receipts / Clearances credited to party accounts
        if tag in ['Clearing', 'CashReceipt', 'ChequeIssue', 'BankReceipt'] and raw_amt > 0:
            p_date = parse_date(l.get('Date')) or datetime.now().isoformat()
            ref_id = f"PAY-{l.get('RefUnique', '')}"
            bank_str = l.get('Bank', '').strip()
            method = 'UPI' if 'ONLINE' in bank_str.upper() else ('Cash' if 'Cash' in tag else ('Cheque' if 'Cheque' in tag else 'NetBanking'))

            accounts[party_code]['payments'].append({
                'paymentId': ref_id,
                'date': p_date,
                'amount': raw_amt,
                'method': method,
                'transactionRef': l.get('ChequeNumber', '').strip() or l.get('RefNumber', '').strip() or bank_str,
                'notes': l.get('Remarks', '').strip() or f"{tag} Ref {l.get('Ref', '')}"
            })

    # Compute account totals
    for acc in accounts.values():
        billed = sum(inv['amount'] for inv in acc['invoices'])
        paid = sum(p['amount'] for p in acc['payments'])
        acc['totalBilled'] = round(billed, 2)
        acc['totalPaid'] = round(paid, 2)
        if acc['closingBalance'] == 0.0 and billed > 0:
            acc['outstandingBalance'] = max(0.0, round(billed - paid, 2))
        else:
            acc['outstandingBalance'] = round(acc['closingBalance'], 2)

    # 7. Process Orders from OrderSales
    order_groups = {}
    # Create product price lookup
    prod_price_map = {p['code']: p['price'] for p in products}

    for o in orders_raw:
        if o.get('Deleted', '') == '1':
            continue
        order_num = o.get('OrderNumber', '').strip() or f"ORD-{o.get('Ref', '')}"
        party_code = o.get('Party', '').strip()
        party_account = accounts.get(party_code)
        shop_name = party_account['shopName'] if party_account else (o.get('Description', '').strip() or f"Party {party_code}")
        mobile = party_account['mobile'] if party_account else "9499850063"

        prod_code = o.get('Code', '').strip()
        qty = max(1, int(float(o.get('Qty') or 1)))
        rate = float(o.get('Rate') or 0)
        if rate == 0.0:
            rate = prod_price_map.get(prod_code, 0.0)
        amt = float(o.get('Amount') or 0)
        if amt == 0.0:
            amt = round(qty * rate, 2)

        if order_num not in order_groups:
            order_date = parse_date(o.get('Date')) or datetime.now().isoformat()
            order_groups[order_num] = {
                'orderNumber': order_num,
                'shopName': shop_name,
                'retailerMobile': mobile,
                'orderDate': order_date,
                'items': [],
                'subTotal': 0.0,
                'gstAmount': 0.0,
                'grandTotal': 0.0
            }

        order_groups[order_num]['items'].append({
            'productCode': prod_code,
            'boxes': qty,
            'unitsPerBox': 10,
            'totalUnits': qty * 10,
            'unitPrice': rate,
            'gstRate': 12.0,
            'itemTotal': amt
        })
        order_groups[order_num]['subTotal'] += amt

    # Calculate order totals
    orders = []
    for onum, odata in order_groups.items():
        sub = round(odata['subTotal'], 2)
        gst = round(sub * 0.12, 2)
        grand = round(sub + gst, 2)
        odata['subTotal'] = sub
        odata['gstAmount'] = gst
        odata['grandTotal'] = grand
        orders.append(odata)

    result = {
        'metadata': {
            'extractedAt': datetime.now().isoformat(),
            'sourceMdb': MDB_PATH,
            'counts': {
                'products': len(products),
                'accounts': len(accounts),
                'orders': len(orders)
            }
        },
        'products': products,
        'accounts': list(accounts.values()),
        'orders': orders
    }

    with open(OUT_PATH, 'w', encoding='utf-8') as f:
        json.dump(result, f, indent=2)

    print(f"\nExtraction complete! Saved to {OUT_PATH}")
    print(f"Summary:")
    print(f"  Products extracted: {len(products)}")
    print(f"  Accounts (Ledgers/Users): {len(accounts)}")
    print(f"  Sales Orders: {len(orders)}")

if __name__ == '__main__':
    main()
