# Niyansh Pharma B2B Order Booking, Billing, Ledger & News Ecosystem Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete pharmaceutical B2B Order Booking, Commercial Billing, Retailer Outstanding Ledger with Payment Gateway, and Dynamic Daily News platform integrated into Niyansh Pharma.

**Architecture:** MERN Stack (React 18 frontend + Express.js backend + MongoDB Mongoose models) featuring fast POS-style Order Booking with box steppers, MOQ validation, WhatsApp & Email dispatch, Payment Gateway ledger statements, and dynamic news ticker.

**Tech Stack:** React 18, Vite, React Router v6, Tailwind / CSS modules, Lucide React, Node.js, Express.js, MongoDB / Mongoose, SheetJS (xlsx/csv export).

---

### Task 1: Backend Data Models & Expanded Master Seed Data

**Files:**
- Modify: `backend/models/Product.js`
- Create: `backend/models/Order.js`
- Create: `backend/models/Ledger.js`
- Create: `backend/models/NewsUpdate.js`
- Modify: `backend/scripts/seedData.js`

- [ ] **Step 1: Update Product.js model with formulations, company, MOQ, quality specs, and PTR**
Update `backend/models/Product.js` to add `company`, `form` (including Cream, Drops, Lotion, Soap, Spray, Oil, Ayurvedic, etc.), `minReorderQty`, `qualitySpecs`, `scheme`, `unitsPerBox`, `mrp`, and `gstRate`.

- [ ] **Step 2: Create Order.js, Ledger.js, and NewsUpdate.js models**
Define Mongoose schemas for orders, retailer outstanding ledgers, and dynamic news ticker items.

- [ ] **Step 3: Update and execute seedData.js**
Add 25+ diverse pharma products (Daxia Healthcare, Sun Pharma, Cipla, etc. with Cream, Drops, Soap, Spray, Oil, Ayurvedic, etc.), sample retailer ledgers, and live news ticker items.
Run: `node backend/scripts/seedData.js`
Expected: "Sample products, ledgers, and news seeded successfully!"

- [ ] **Step 4: Commit Task 1**
```bash
git add backend/models/ backend/scripts/
git commit -m "feat(backend): add models and master seed data for products, orders, ledger, and news"
```

---

### Task 2: Backend API Routes & Controllers

**Files:**
- Create: `backend/routes/orderRoutes.js`
- Create: `backend/routes/ledgerRoutes.js`
- Create: `backend/routes/newsRoutes.js`
- Modify: `backend/routes/productRoutes.js`
- Modify: `backend/server.js`

- [ ] **Step 1: Create orderRoutes.js**
Implement `POST /api/orders` (calculates tax, generates WhatsApp message string, dispatches email invoice) and `GET /api/orders` (retrieves order history).

- [ ] **Step 2: Create ledgerRoutes.js**
Implement `GET /api/ledger` (all ledgers for admin), `GET /api/ledger/:mobile` (specific retailer ledger), `POST /api/ledger/payment` (records payment gateway transactions), and `POST /api/ledger/send-statement` (WhatsApp & email statement payload).

- [ ] **Step 3: Create newsRoutes.js & update productRoutes.js**
Implement `GET /api/news`, `POST /api/news`, `PUT /api/news/:id`, `DELETE /api/news/:id`. Enhance `productRoutes.js` to filter by `form` and `company`.

- [ ] **Step 4: Register new routes in server.js and test with curl**
Update `backend/server.js` and test endpoints.
Run: `node -e "require('./backend/server.js')"`
Expected: Server starts cleanly without route registration errors.

- [ ] **Step 5: Commit Task 2**
```bash
git add backend/routes/ backend/server.js
git commit -m "feat(backend): implement order booking, ledger, news, and product filter routes"
```

---

### Task 3: Frontend Dynamic News Ticker & Schemes Component

**Files:**
- Create: `frontend/src/components/NewsTicker.jsx`
- Create: `frontend/src/pages/NewsFeed.jsx`

- [ ] **Step 1: Build NewsTicker.jsx component**
Top marquee scrolling banner with category badges (Scheme, Price Alert, New Launch), live pause on hover, and 1-click modal to read full announcement.

- [ ] **Step 2: Build NewsFeed.jsx page**
Full responsive page showing categorized pharma news cards, manufacturer schemes with validity dates, and company tags.

- [ ] **Step 3: Commit Task 3**
```bash
git add frontend/src/components/NewsTicker.jsx frontend/src/pages/NewsFeed.jsx
git commit -m "feat(frontend): add dynamic news ticker and daily pharma news feed"
```

---

### Task 4: Frontend Quick B2B Order Booking & Live Billing Portal

**Files:**
- Create: `frontend/src/pages/QuickOrder.jsx`

- [ ] **Step 1: Build QuickOrder.jsx with retailer details and filters**
Include shop details (Shop name, mobile, GSTIN, destination WhatsApp line `9316566894`), search box, company filter, and formulation filter (Cream, Drops, Soap, Oil, Ayurvedic, etc.).

- [ ] **Step 2: Implement Product List with Steppers & MOQ Validation**
Product items displaying packaging, active composition, quality certification, PTR rate, MOQ requirement, and `+`/`-` box steppers with manual input.

- [ ] **Step 3: Implement Live Wholesale Billing, WhatsApp Dispatch, Email & CSV Export**
Live Subtotal, GST, Scheme discount, and Net Total math.
"Send Order to WhatsApp & Save" generating formatted WhatsApp message.
"Send Invoice to Email" and "Download Excel/CSV" with SheetJS/CSV generator.
Date-wise saved order history table with reorder button.

- [ ] **Step 4: Commit Task 4**
```bash
git add frontend/src/pages/QuickOrder.jsx
git commit -m "feat(frontend): create high-speed B2B Quick Order Booking and Live Billing Portal"
```

---

### Task 5: Frontend Retailer Ledger, Outstanding & Payment Gateway Modal

**Files:**
- Create: `frontend/src/pages/OutstandingLedger.jsx`
- Create: `frontend/src/components/PaymentGatewayModal.jsx`

- [ ] **Step 1: Build OutstandingLedger.jsx dashboard**
KPI overview cards for Total Outstanding, Overdue Balance, and Credit Limit.
Invoices table with due dates, paid amounts, balance due, and status badges.

- [ ] **Step 2: Build PaymentGatewayModal.jsx**
Interactive modal supporting UPI QR code generation, Cards, NetBanking, and Instant Receipt generator.

- [ ] **Step 3: Implement WhatsApp & Email Statement Dispatch**
1-click "Send Statement to WhatsApp" formatting itemized ledger with payment link.
1-click "Email Statement" with PDF statement download.

- [ ] **Step 4: Commit Task 5**
```bash
git add frontend/src/pages/OutstandingLedger.jsx frontend/src/components/PaymentGatewayModal.jsx
git commit -m "feat(frontend): implement retailer ledger, outstanding tracking, and payment gateway"
```

---

### Task 6: Frontend Navigation & Admin Console Enhancements

**Files:**
- Modify: `frontend/src/components/Header.jsx`
- Modify: `frontend/src/App.jsx`
- Modify: `frontend/src/pages/Admin.jsx`

- [ ] **Step 1: Update Header.jsx with Quick Order, Ledger, News & NewsTicker**
Add top navigation links (`⚡ Quick Order`, `📊 Outstanding Ledger`, `📰 Daily Updates`) and mount `NewsTicker`.

- [ ] **Step 2: Update App.jsx with new routes**
Add routes for `/quick-order`, `/portal`, `/outstanding`, `/news`.

- [ ] **Step 3: Enhance Admin.jsx with News CRUD and Outstanding Management**
Add tabs in Admin to manage Dynamic News Items, view all Chemists Outstanding Balances, and send 1-click WhatsApp payment reminders.

- [ ] **Step 4: Commit Task 6**
```bash
git add frontend/src/components/Header.jsx frontend/src/App.jsx frontend/src/pages/Admin.jsx
git commit -m "feat(frontend): connect header navigation, routes, and admin console modules"
```

---

### Task 7: End-to-End Verification & Build Check

**Files:**
- Verify: Full Application Stack

- [ ] **Step 1: Verify backend models & seed execution**
Run: `node backend/scripts/seedData.js`
Expected: Successful database seeding with 0 errors.

- [ ] **Step 2: Verify frontend compilation**
Run: `npm run build --prefix frontend`
Expected: Clean build without any syntax or bundling errors.

- [ ] **Step 3: Commit Task 7**
```bash
git add .
git commit -m "chore: complete end-to-end integration and verification of B2B portal"
```
