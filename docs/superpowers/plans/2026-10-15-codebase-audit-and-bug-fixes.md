# Full Court Review, Audit & Bug Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Conduct a comprehensive full-court audit of the Niyansh Pharma B2B wholesale platform, fix critical backend security vulnerabilities, resolve regex injection / ReDoS crashes, fix Mongoose 8 deprecations, correct ledger FIFO and phone number formatting issues, fix file upload MIME handling, resolve UI slider range bugs and redundant fetch loops, and verify the entire test suite passes with 100% success.

**Architecture:** Node.js/Express REST API backend with MongoDB Atlas (8,792+ pharmaceutical products), JWT authentication, Multer file uploads, and React 18 / Vite frontend with responsive B2B Quick Order matrix, Outstanding Ledger, and dynamic Schemes & News feed.

**Tech Stack:** Node.js 22, Express 4.19, Mongoose 8.2, JWT, Multer, bcryptjs, React 18, React Router v6, Vite 5, Tailwind CSS / Vanilla CSS.

---

### Task 1: Fix Database Connection Singleton, Serverless Cold-Start Middleware & Auto-Initialization

**Files:**
- Modify: `backend/config/db.js`
- Modify: `backend/server.js`

- [x] **Step 1: Write singleton connection logic with readyState checking in `backend/config/db.js`**
Ensure parallel calls to `connectDB()` share the same pending connection promise and do not create duplicate sockets or error out with undefined hostnames.

- [x] **Step 2: Add database ready middleware in `backend/server.js`**
Ensure every `/api/` request awaits database readiness before executing route handlers, preventing cold-start buffer timeouts in serverless environments.

- [x] **Step 3: Align static `/uploads` serving directory in `backend/server.js`**
Ensure `/tmp/uploads` is served when running under Vercel serverless.

---

### Task 2: Fix Mongoose 8 User Model Hook and Implement Real Admin Authentication

**Files:**
- Modify: `backend/models/User.js`
- Modify: `backend/routes/userRoutes.js`
- Modify: `backend/middleware/authMiddleware.js`
- Modify: `frontend/src/pages/Admin.jsx`

- [x] **Step 1: Fix async pre('save') hook in `backend/models/User.js`**
Remove `next` parameter from async pre-save function to conform to Mongoose 8 standards.

- [x] **Step 2: Auto-initialize Admin User if not existing**
Add auto-provisioning of `admin@niyanshpharma.com` with `role: 'admin'` on server startup if no admin account exists in MongoDB.

- [x] **Step 3: Update `frontend/src/pages/Admin.jsx` to authenticate via API**
Replace client-only password check with `POST /api/users/login`, store admin JWT token in `localStorage`, and send `Authorization: Bearer <token>` in all admin API requests.

---

### Task 3: Regex Escaping & Input Sanitization Across All Backend Routes

**Files:**
- Modify: `backend/routes/productRoutes.js`
- Modify: `backend/routes/orderRoutes.js`
- Modify: `backend/routes/ledgerRoutes.js`
- Modify: `backend/routes/newsRoutes.js`

- [x] **Step 1: Add `escapeRegex` helper in `backend/routes/productRoutes.js`**
Escape special characters in `search`, `company`, `brand`, `form`, and `category` query filters to prevent regex syntax error crashes on terms with parentheses (e.g., `Paracetamol (500mg)`).

- [x] **Step 2: Add `escapeRegex` in `backend/routes/orderRoutes.js`, `ledgerRoutes.js`, and `newsRoutes.js`**
Escape user search queries before passing to MongoDB `$regex`.

---

### Task 4: Fix Multer Upload MIME Type Validation & Error Handling

**Files:**
- Modify: `backend/routes/careerRoutes.js`

- [x] **Step 1: Correct MIME types in `checkFileType`**
Support `application/pdf`, `application/msword`, and `application/vnd.openxmlformats-officedocument.wordprocessingml.document`.

- [x] **Step 2: Fix Multer callback error object**
Pass `new Error('Error: PDF or Word Documents Only!')` instead of a plain string.

- [x] **Step 3: Add explicit multer error handling middleware**
Catch Multer-specific errors and return 400 Bad Request with user-friendly error messages.

---

### Task 5: Fix Ledger FIFO Invoice Deduction, Phone Normalization & Seed Demo Fixtures

**Files:**
- Modify: `backend/routes/ledgerRoutes.js`

- [x] **Step 1: Normalize phone numbers**
Clean incoming phone numbers to 10-digit format (`replace(/\D/g, '').replace(/^91/, '').slice(-10)`) in `GET /api/ledger/:mobile` and `POST /api/ledger/payment`.

- [x] **Step 2: Sort unpaid invoices by date ascending (FIFO)**
Sort invoices by date ascending before applying payments, and correctly calculate `outstandingBalance` even when no invoices exist.

- [x] **Step 3: Provide default demo fixtures for test accounts**
When auto-creating ledger for demo mobile numbers (`9825012345` / `Shanti Medico`), populate appropriate initial invoice and shopName data.

---

### Task 6: Seed Initial News Updates & Dynamic Schemes

**Files:**
- Modify: `backend/scripts/seedData.js`
- Modify: `backend/server.js`

- [x] **Step 1: Ensure initial news announcements exist**
Check if `NewsUpdate.countDocuments() === 0` and seed default active schemes and alerts without wiping existing products.

- [x] **Step 2: Verify `/api/news?ticker=true` returns live database news**

---

### Task 7: Fix Trade Scheme vs Cash Discount & Expand Product Form Enum

**Files:**
- Modify: `frontend/src/pages/QuickOrder.jsx`
- Modify: `backend/models/Product.js`

- [x] **Step 1: Expand `form` enum in `backend/models/Product.js`**
Add `'Ointment'`, `'Powder'`, `'Gel'`, `'Suspension'` to permitted forms.

- [x] **Step 2: Separate bonus goods value from monetary invoice discount in `frontend/src/pages/QuickOrder.jsx`**
Ensure monetary `grandTotal` on screen and in `/api/orders` payload are 100% synchronized and do not deduct non-cash bonus goods as cash deductions.

---

### Task 8: Fix Products Page Price Range Slider & Search Sync Loop

**Files:**
- Modify: `frontend/src/pages/Products.jsx`

- [x] **Step 1: Increase price slider range**
Change price slider max from 100 to 2000 (with step of 10) so wholesale medicines above ₹100 are not filtered out.

- [x] **Step 2: Remove redundant re-fetching loop**
Optimize `useEffect` dependencies and safely handle `setProducts(data.products || [])`.

---

### Task 9: Optimize Vercel Configuration & Deployment

**Files:**
- Modify: `vercel.json`

- [x] **Step 1: Ensure correct SPA rewrites and API routing in `vercel.json`**

---

### Task 10: Run End-to-End Verification Tests & Build

**Files:**
- Modify: `backend/scripts/testEndpoints.js`
- Verify: `npm run build`
- Verify: `node backend/scripts/testEndpoints.js`

- [x] **Step 1: Run `node backend/scripts/testEndpoints.js` and verify all tests PASS (0 failures)**
- [x] **Step 2: Run `npm run build` and verify frontend bundle builds cleanly without errors**
