# Niyansh Pharma - B2B Order Booking, Billing, Outstanding Ledger & Dynamic News Ecosystem

**Date:** 2026-08-23
**Status:** Approved
**Version:** 1.0.0

---

## 1. Project Overview & Vision
Niyansh Pharma is expanding into a comprehensive B2B Wholesale Distribution and Retailer Order Booking Platform inspired by Medilio and modern pharmaceutical POS/ERP systems.

The system enables pharmaceutical retailers, medical stores, and distributors to:
1. **Book Orders Instantly** using high-speed search, box quantity controls, company filtering, and minimum reorder (MOQ) validation.
2. **Generate Commercial Wholesale Bills** with live PTR rates, GST calculations, and automatic WhatsApp & Email dispatch.
3. **Track Outstanding Payments & Statements** with ledger balances, overdue tracking, payment gateway integration (UPI QR / Razorpay / NetBanking), and 1-click WhatsApp/Email statement sharing.
4. **Access Dynamic Pharma News & Schemes** via a live top ticker and news feed managed from the Admin console.
5. **Explore Comprehensive Formulations & Ayurvedic Catalogs** covering Creams, Drops, Lotions, Soaps, Sprays, Oils, Ayurvedic & Herbal remedies, Tablets, Capsules, and Injections with active salt details and quality certifications (WHO-GMP, AYUSH).

---

## 2. System Architecture & Tech Stack
- **Frontend:** React 18 (Vite), React Router v6, Tailwind CSS / Modern CSS, Lucide Icons, Canvas/Print for PDF invoices, SheetJS/CSV for Excel export.
- **Backend:** Node.js, Express.js REST API.
- **Database:** MongoDB / Mongoose ODM (with local/browser storage fallback for resilience).
- **Communication Channels:** WhatsApp Business Link Protocol + REST Email Service for HTML/PDF invoice dispatch.
- **Payment Processing:** Payment Gateway integration (Razorpay / UPI Intent / QR Codes / Net Banking simulation and verified recording).

---

## 3. Detailed Functional Modules
### 3.1 Quick Order Booking & Billing Portal (/quick-order & /portal)
- Retailer Profile Header: Store Name, Contact Person, Retailer Mobile, Store GSTIN, Delivery Address, Destination WhatsApp Order Booking line.
- Dynamic Search & Filters: Real-time search across Medicine Name, Active Chemical Composition / Salt, Brand, and SKU.
- Filter by Company (All, DAXIA, Cipla, Sun Pharma, Abbott, Healing Pharma, Leeford, Troikaa, Dr. Morepen, etc.) and Formulation (Cream, Drops, Lotion, Soap, Spray, Oil, Ayurvedic, Tablet, Capsule, Injection, Syrup, IV Fluid, Surgical).
- Product Row with Stepper & MOQ Rules: Name, Active Ingredients, Packing, Quality Specs (WHO-GMP/AYUSH), PTR, MRP, Minimum Reorder Quantity (MOQ) with warning badge.
- Live Wholesale Tax & Scheme Calculation: Real-time Subtotal, Applicable GST (5%/12%/18%), Scheme discounts (e.g. 10+1 free), and Grand Total.
- Multi-Channel Dispatch: WhatsApp Order Dispatch (formatted text message), Email Invoice Dispatch (HTML/PDF), Excel/CSV Export, and Date-wise saved order history table with reorder button.

### 3.2 Outstanding Payment & Retailer Ledger (/outstanding)
- KPI Overview Cards: Total Outstanding Balance (INR), Overdue Balance (> 21/30 days), Credit Limit & Remaining Available Credit.
- Detailed Invoice Ledger Table: Date, Invoice Number, Bill Amount, Paid Amount, Balance Due, Payment Status (Paid, Partial, Overdue, Pending), Due Date.
- Payment Gateway Integration: Supports paying full balance or custom partial amount via UPI QR, Cards, NetBanking, and Razorpay.
- WhatsApp & Email Statement Dispatch: 1-click Send Statement to WhatsApp with complete invoice breakdown, outstanding balance, and payment link.
- Admin Management Console: Admin view of all retailers with filter by outstanding/overdue, with 1-click WhatsApp payment reminders.

### 3.3 Dynamic Daily Pharma News & Schemes (/news & Header Ticker)
- Top Header Marquee Ticker: Dynamic scrolling ticker for manufacturer schemes, price drop alerts, new launches, and regulatory announcements.
- Daily Pharma News Center: Categorized news feed cards (Scheme, Price Alert, New Arrival, Market News) with publish date, validity expiry, and associated company.
- Admin Management: Full CRUD interface to add, edit, and toggle ticker visibility for news items.

### 3.4 Product Catalog & Formulation Expansion
- Formulation Forms: Cream, Drops, Lotion, Soap, Spray, Oil, Ayurvedic Products, Tablets, Capsules, Injections, Syrups, IV Fluids, Surgicals.
- Quality & Composition Details: Standard grade (IP, BP, USP, Ayush Standard), Certifications (WHO-GMP, ISO 9001:2015, Ayush Premium), detailed active ingredients and concentration breakdown.

---

## 4. Data Models Schema
- Product: name, brand, company, category, form, sku, price, mrp, gstRate, minReorderQty, unitsPerBox, packing, composition, qualitySpecs, scheme, inStock, imageUrl, description.
- Order: orderNumber, shopName, retailerMobile, retailerEmail, gstin, destinationWhatsApp, items, subTotal, gstAmount, discountAmount, grandTotal, paymentStatus, orderStatus.
- Ledger: retailerMobile, shopName, email, totalBilled, totalPaid, outstandingBalance, creditLimit, invoices, payments.
- NewsUpdate: title, content, category, isTickerActive, priority, expiryDate.

---

## 5. Validation & Error Handling
- Validates MOQ requirements before order confirmation with user-friendly toast alerts.
- Sanitizes input fields and formats phone numbers to standard 10-digit Indian numbers.
- Ensures offline fallback and localStorage synchronisation so retailers never lose cart or order data.