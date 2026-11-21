# Project Specifications: Niyansh Pharma B2B Portal

## Overview
Enterprise pharmaceutical wholesale distribution platform operating in Rajkot & Saurashtra, Gujarat.

## Architecture
- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, PWA Standalone support.
  - Hosted: GoDaddy cPanel Apache (`public_html/`) via GitHub Actions CI/CD.
  - Live Domain: https://niyanshpharma.com
- **Backend**: Node.js, Express, MongoDB Atlas, JWT Auth.
  - Hosted: Vercel Serverless (`https://pharma-bay-two.vercel.app`).
- **Transactional Notifications**: Dual-layer email delivery (Direct SMTP + GoDaddy cPanel PHP Mail fallback).

## Core Rules & Guardrails
1. Never break live catalog rendering (9,800+ formulations).
2. Never introduce visual loader flickering on background sync/polling.
3. Keep uppercase transformation strictly scoped to pharma identifiers (SKU, GSTIN, PAN, DL No.).
4. All database queries must be lean, indexed, and cached where appropriate.
