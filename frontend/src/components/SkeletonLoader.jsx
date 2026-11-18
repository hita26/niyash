import React from 'react';

/**
 * Enterprise Shimmer Skeleton Loader System
 * Provides ultra-smooth, zero-lag perceived performance across the entire Niyansh Pharma platform:
 * - Public & Retailer Pages: Products, OurProducts, QuickOrder, ProductDetail, CompanyDirectory, CompanyDetail, NewsFeed, OutstandingLedger, RetailerDashboard
 * - Admin Console: Overview, Product Catalog, Orders, Enquiries, Careers, News, Sub-Admins Table
 */
export default function SkeletonLoader({ variant = 'product-grid', count = 8, rows = 5 }) {

  // ==========================================
  // 1. SHIMMERING PRODUCT CATALOG GRID
  // ==========================================
  if (variant === 'product-grid') {
    return (
      <div className="responsive-product-grid" style={{ width: '100%' }}>
        {Array.from({ length: count }).map((_, idx) => (
          <div
            key={idx}
            className="card"
            style={{
              padding: '16px',
              borderRadius: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              border: '1px solid var(--border-light)',
              backgroundColor: 'var(--bg-card)'
            }}
          >
            {/* Image Placeholder */}
            <div className="skeleton-shimmer" style={{ width: '100%', height: '170px', borderRadius: '8px' }} />

            {/* Category / Brand Pill */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="skeleton-shimmer" style={{ width: '80px', height: '18px', borderRadius: '12px' }} />
              <div className="skeleton-shimmer" style={{ width: '50px', height: '14px', borderRadius: '4px' }} />
            </div>

            {/* Medicine Title */}
            <div className="skeleton-shimmer" style={{ width: '85%', height: '22px' }} />

            {/* Composition / Pack */}
            <div className="skeleton-shimmer" style={{ width: '60%', height: '14px' }} />

            {/* Price & Action */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '12px', paddingTop: '10px', borderTop: '1px solid var(--border-light)' }}>
              <div>
                <div className="skeleton-shimmer" style={{ width: '50px', height: '12px', marginBottom: '4px' }} />
                <div className="skeleton-shimmer" style={{ width: '90px', height: '24px' }} />
              </div>
              <div className="skeleton-shimmer" style={{ width: '95px', height: '36px', borderRadius: '20px' }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ==========================================
  // 2. PRODUCT DETAIL PAGE SKELETON
  // ==========================================
  if (variant === 'product-detail') {
    return (
      <div className="container section" style={{ width: '100%', padding: '30px 16px' }}>
        {/* Breadcrumb shimmer */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '24px' }}>
          <div className="skeleton-shimmer" style={{ width: '60px', height: '16px' }} />
          <div className="skeleton-shimmer" style={{ width: '12px', height: '16px' }} />
          <div className="skeleton-shimmer" style={{ width: '90px', height: '16px' }} />
          <div className="skeleton-shimmer" style={{ width: '12px', height: '16px' }} />
          <div className="skeleton-shimmer" style={{ width: '140px', height: '16px' }} />
        </div>

        {/* Main 2-Column Product Detail Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))',
          gap: '36px',
          alignItems: 'start',
          marginBottom: '50px'
        }}>
          {/* Left: Product Media Gallery */}
          <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', border: '1px solid var(--border-light)' }}>
            <div className="skeleton-shimmer" style={{ width: '100%', height: '380px', borderRadius: '12px' }} />
            <div style={{ display: 'flex', gap: '12px' }}>
              <div className="skeleton-shimmer" style={{ width: '70px', height: '70px', borderRadius: '8px' }} />
              <div className="skeleton-shimmer" style={{ width: '70px', height: '70px', borderRadius: '8px' }} />
              <div className="skeleton-shimmer" style={{ width: '70px', height: '70px', borderRadius: '8px' }} />
            </div>
          </div>

          {/* Right: Formulation Details & Actions */}
          <div className="card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '18px', border: '1px solid var(--border-light)' }}>
            {/* Badges */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <div className="skeleton-shimmer" style={{ width: '90px', height: '22px', borderRadius: '12px' }} />
              <div className="skeleton-shimmer" style={{ width: '70px', height: '22px', borderRadius: '12px' }} />
              <div className="skeleton-shimmer" style={{ width: '80px', height: '22px', borderRadius: '12px' }} />
            </div>

            {/* Title */}
            <div className="skeleton-shimmer" style={{ width: '80%', height: '32px' }} />
            <div className="skeleton-shimmer" style={{ width: '50%', height: '18px' }} />

            {/* Composition Box */}
            <div style={{ padding: '14px', borderRadius: '8px', backgroundColor: 'var(--bg-surface-alt)', border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div className="skeleton-shimmer" style={{ width: '35%', height: '14px' }} />
              <div className="skeleton-shimmer" style={{ width: '95%', height: '18px' }} />
            </div>

            {/* Pricing Box */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', padding: '16px 0', borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)' }}>
              <div className="skeleton-shimmer" style={{ width: '130px', height: '36px' }} />
              <div className="skeleton-shimmer" style={{ width: '80px', height: '20px' }} />
              <div className="skeleton-shimmer" style={{ width: '60px', height: '20px', borderRadius: '10px' }} />
            </div>

            {/* Quantity Selector & Add Button */}
            <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginTop: '10px' }}>
              <div className="skeleton-shimmer" style={{ width: '120px', height: '44px', borderRadius: '8px' }} />
              <div className="skeleton-shimmer" style={{ flex: 1, height: '44px', borderRadius: '8px' }} />
            </div>

            {/* Spec lines */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
              <div className="skeleton-shimmer" style={{ width: '100%', height: '16px' }} />
              <div className="skeleton-shimmer" style={{ width: '85%', height: '16px' }} />
              <div className="skeleton-shimmer" style={{ width: '70%', height: '16px' }} />
            </div>
          </div>
        </div>

        {/* Bottom Related Products Shimmer */}
        <div style={{ marginTop: '40px' }}>
          <div className="skeleton-shimmer" style={{ width: '220px', height: '26px', marginBottom: '20px' }} />
          <div className="responsive-product-grid">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="card" style={{ padding: '16px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '10px', border: '1px solid var(--border-light)' }}>
                <div className="skeleton-shimmer" style={{ width: '100%', height: '150px', borderRadius: '8px' }} />
                <div className="skeleton-shimmer" style={{ width: '80%', height: '18px' }} />
                <div className="skeleton-shimmer" style={{ width: '50%', height: '14px' }} />
                <div className="skeleton-shimmer" style={{ width: '90px', height: '22px', marginTop: '8px' }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // 3. COMPANY DIRECTORY GRID SKELETON
  // ==========================================
  if (variant === 'company-grid') {
    return (
      <div className="responsive-company-grid" style={{ width: '100%' }}>
        {Array.from({ length: count }).map((_, idx) => (
          <div
            key={idx}
            className="card"
            style={{
              padding: '0',
              overflow: 'hidden',
              borderRadius: '14px',
              border: '1px solid var(--border-light)',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Header Media */}
            <div style={{ padding: '18px', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div className="skeleton-shimmer" style={{ width: '58px', height: '58px', borderRadius: '12px', flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div className="skeleton-shimmer" style={{ width: '80%', height: '20px' }} />
                <div className="skeleton-shimmer" style={{ width: '50%', height: '14px' }} />
              </div>
            </div>

            {/* Body */}
            <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                <div className="skeleton-shimmer" style={{ width: '60px', height: '18px', borderRadius: '10px' }} />
                <div className="skeleton-shimmer" style={{ width: '75px', height: '18px', borderRadius: '10px' }} />
              </div>
              <div className="skeleton-shimmer" style={{ width: '90%', height: '14px' }} />
              <div className="skeleton-shimmer" style={{ width: '70%', height: '14px' }} />

              {/* Action Button */}
              <div className="skeleton-shimmer" style={{ width: '100%', height: '38px', borderRadius: '8px', marginTop: '6px' }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ==========================================
  // 4. COMPANY DETAIL PROFILE SKELETON
  // ==========================================
  if (variant === 'company-detail') {
    return (
      <div style={{ backgroundColor: 'var(--bg-light)', minHeight: '85vh', padding: '30px 0 60px' }}>
        <div className="container">
          {/* Breadcrumb shimmer */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '24px' }}>
            <div className="skeleton-shimmer" style={{ width: '50px', height: '16px' }} />
            <div className="skeleton-shimmer" style={{ width: '12px', height: '16px' }} />
            <div className="skeleton-shimmer" style={{ width: '90px', height: '16px' }} />
            <div className="skeleton-shimmer" style={{ width: '12px', height: '16px' }} />
            <div className="skeleton-shimmer" style={{ width: '120px', height: '16px' }} />
          </div>

          {/* Hero Company Card */}
          <div className="card" style={{ padding: '28px', borderRadius: '16px', marginBottom: '30px', border: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div className="skeleton-shimmer" style={{ width: '100px', height: '100px', borderRadius: '16px', flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: '260px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <div className="skeleton-shimmer" style={{ width: '220px', height: '28px' }} />
                  <div className="skeleton-shimmer" style={{ width: '70px', height: '20px', borderRadius: '10px' }} />
                </div>
                <div className="skeleton-shimmer" style={{ width: '65%', height: '16px' }} />
                <div className="skeleton-shimmer" style={{ width: '45%', height: '14px' }} />
              </div>
            </div>

            {/* Stats row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border-light)' }}>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div className="skeleton-shimmer" style={{ width: '70px', height: '14px' }} />
                  <div className="skeleton-shimmer" style={{ width: '110px', height: '24px' }} />
                </div>
              ))}
            </div>
          </div>

          {/* Filter Bar shimmer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
            <div className="skeleton-shimmer" style={{ width: '300px', height: '42px', borderRadius: '8px' }} />
            <div className="skeleton-shimmer" style={{ width: '180px', height: '42px', borderRadius: '8px' }} />
          </div>

          {/* Products Grid Shimmer */}
          <div className="responsive-product-grid">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx} className="card" style={{ padding: '16px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '10px', border: '1px solid var(--border-light)' }}>
                <div className="skeleton-shimmer" style={{ width: '100%', height: '160px', borderRadius: '8px' }} />
                <div className="skeleton-shimmer" style={{ width: '80%', height: '20px' }} />
                <div className="skeleton-shimmer" style={{ width: '55%', height: '14px' }} />
                <div className="skeleton-shimmer" style={{ width: '90px', height: '22px', marginTop: '8px' }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // 5. NEWS & SCHEMES FEED SKELETON
  // ==========================================
  if (variant === 'news-list') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
        {/* Category Filter Chips Shimmer */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton-shimmer" style={{ width: i === 0 ? '70px' : '110px', height: '36px', borderRadius: '20px' }} />
          ))}
        </div>

        {/* Announcement Cards */}
        {Array.from({ length: count }).map((_, idx) => (
          <div
            key={idx}
            className="card"
            style={{
              padding: '22px',
              borderRadius: '16px',
              border: '1px solid var(--border-light)',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}
          >
            {/* Header: Date + Tag + Pin */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <div className="skeleton-shimmer" style={{ width: '90px', height: '22px', borderRadius: '12px' }} />
                <div className="skeleton-shimmer" style={{ width: '110px', height: '14px' }} />
              </div>
              <div className="skeleton-shimmer" style={{ width: '24px', height: '24px', borderRadius: '50%' }} />
            </div>

            {/* Headline */}
            <div className="skeleton-shimmer" style={{ width: '85%', height: '26px' }} />

            {/* Content snippet */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div className="skeleton-shimmer" style={{ width: '100%', height: '15px' }} />
              <div className="skeleton-shimmer" style={{ width: '92%', height: '15px' }} />
              <div className="skeleton-shimmer" style={{ width: '65%', height: '15px' }} />
            </div>

            {/* Scheme Banner / Action Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', paddingTop: '12px', borderTop: '1px solid var(--border-light)' }}>
              <div className="skeleton-shimmer" style={{ width: '130px', height: '16px' }} />
              <div className="skeleton-shimmer" style={{ width: '110px', height: '34px', borderRadius: '8px' }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ==========================================
  // 6. RETAILER LEDGER & STATEMENT SKELETON
  // ==========================================
  if (variant === 'ledger-statement') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
        {/* Account Summary KPI Card */}
        <div className="card" style={{ padding: '24px', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div className="skeleton-shimmer" style={{ width: '180px', height: '24px' }} />
              <div className="skeleton-shimmer" style={{ width: '130px', height: '16px' }} />
            </div>
            <div className="skeleton-shimmer" style={{ width: '100px', height: '28px', borderRadius: '14px' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div className="skeleton-shimmer" style={{ width: '90px', height: '14px' }} />
              <div className="skeleton-shimmer" style={{ width: '140px', height: '28px' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div className="skeleton-shimmer" style={{ width: '90px', height: '14px' }} />
              <div className="skeleton-shimmer" style={{ width: '140px', height: '28px' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div className="skeleton-shimmer" style={{ width: '90px', height: '14px' }} />
              <div className="skeleton-shimmer" style={{ width: '140px', height: '28px' }} />
            </div>
          </div>
        </div>

        {/* Statement Invoices Table */}
        <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-light)', padding: '16px', overflowX: 'auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', minWidth: '600px' }}>
            {/* Table Header shimmer */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr 0.8fr', gap: '16px', paddingBottom: '12px', borderBottom: '1.5px solid var(--border-light)' }}>
              <div className="skeleton-shimmer" style={{ height: '16px', width: '70%' }} />
              <div className="skeleton-shimmer" style={{ height: '16px', width: '60%' }} />
              <div className="skeleton-shimmer" style={{ height: '16px', width: '60%' }} />
              <div className="skeleton-shimmer" style={{ height: '16px', width: '50%' }} />
              <div className="skeleton-shimmer" style={{ height: '16px', width: '80%' }} />
            </div>
            {/* Table Rows shimmer */}
            {Array.from({ length: rows }).map((_, idx) => (
              <div
                key={idx}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.2fr 1fr 1fr 1fr 0.8fr',
                  gap: '16px',
                  alignItems: 'center',
                  padding: '12px 0',
                  borderBottom: idx < rows - 1 ? '1px solid var(--border-light)' : 'none'
                }}
              >
                <div className="skeleton-shimmer" style={{ height: '20px', width: '80%' }} />
                <div className="skeleton-shimmer" style={{ height: '16px', width: '60%' }} />
                <div className="skeleton-shimmer" style={{ height: '18px', width: '75%' }} />
                <div className="skeleton-shimmer" style={{ height: '22px', width: '70px', borderRadius: '12px' }} />
                <div className="skeleton-shimmer" style={{ height: '32px', width: '85px', borderRadius: '6px' }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // 7. ADMIN OVERVIEW DASHBOARD SKELETON
  // ==========================================
  if (variant === 'admin-overview') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', width: '100%' }}>
        {/* Title bar shimmer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div className="skeleton-shimmer" style={{ width: '240px', height: '28px' }} />
            <div className="skeleton-shimmer" style={{ width: '340px', height: '16px' }} />
          </div>
          <div className="skeleton-shimmer" style={{ width: '130px', height: '36px', borderRadius: '8px' }} />
        </div>

        {/* 4-Stage Fulfillment Pipeline Funnel shimmer */}
        <div className="card" style={{ padding: '20px 24px', borderRadius: '14px', border: '1px solid var(--border-light)' }}>
          <div className="skeleton-shimmer" style={{ width: '200px', height: '20px', marginBottom: '16px' }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} style={{ padding: '16px', borderRadius: '10px', border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div className="skeleton-shimmer" style={{ width: '80px', height: '14px' }} />
                  <div className="skeleton-shimmer" style={{ width: '24px', height: '24px', borderRadius: '50%' }} />
                </div>
                <div className="skeleton-shimmer" style={{ width: '60px', height: '26px' }} />
              </div>
            ))}
          </div>
        </div>

        {/* 4 KPI Summary Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="card"
              style={{
                padding: '20px',
                borderRadius: '14px',
                border: '1px solid var(--border-light)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="skeleton-shimmer" style={{ width: '100px', height: '14px' }} />
                <div className="skeleton-shimmer" style={{ width: '32px', height: '32px', borderRadius: '8px' }} />
              </div>
              <div className="skeleton-shimmer" style={{ width: '110px', height: '30px' }} />
              <div className="skeleton-shimmer" style={{ width: '70%', height: '12px' }} />
            </div>
          ))}
        </div>

        {/* 2-Column Split: Orders & Inquiries shimmer */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
          <div className="card" style={{ padding: '20px', borderRadius: '14px', border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="skeleton-shimmer" style={{ width: '160px', height: '22px' }} />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div className="skeleton-shimmer" style={{ width: '120px', height: '16px' }} />
                  <div className="skeleton-shimmer" style={{ width: '80px', height: '12px' }} />
                </div>
                <div className="skeleton-shimmer" style={{ width: '70px', height: '24px', borderRadius: '12px' }} />
              </div>
            ))}
          </div>

          <div className="card" style={{ padding: '20px', borderRadius: '14px', border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="skeleton-shimmer" style={{ width: '160px', height: '22px' }} />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div className="skeleton-shimmer" style={{ width: '140px', height: '16px' }} />
                  <div className="skeleton-shimmer" style={{ width: '90px', height: '12px' }} />
                </div>
                <div className="skeleton-shimmer" style={{ width: '60px', height: '22px', borderRadius: '4px' }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // 8. ADMIN CATALOG & DATA TABLE SKELETON
  // ==========================================
  if (variant === 'admin-table') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
        {/* KPI Summary Chips shimmer */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
          {Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className="card" style={{ padding: '14px 18px', borderRadius: '12px', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="skeleton-shimmer" style={{ width: '38px', height: '38px', borderRadius: '8px', flexShrink: 0 }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                <div className="skeleton-shimmer" style={{ width: '50px', height: '20px' }} />
                <div className="skeleton-shimmer" style={{ width: '80px', height: '12px' }} />
              </div>
            </div>
          ))}
        </div>

        {/* Filter Pills row shimmer */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className="skeleton-shimmer" style={{ width: idx === 0 ? '90px' : '120px', height: '34px', borderRadius: '20px' }} />
          ))}
        </div>

        {/* Search & Select Controls Card shimmer */}
        <div className="card" style={{ padding: '16px', borderRadius: '12px', border: '1px solid var(--border-light)', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="skeleton-shimmer" style={{ flex: '1 1 240px', height: '40px', borderRadius: '8px' }} />
          <div className="skeleton-shimmer" style={{ width: '160px', height: '40px', borderRadius: '8px' }} />
          <div className="skeleton-shimmer" style={{ width: '130px', height: '40px', borderRadius: '8px' }} />
        </div>

        {/* Desktop Table shimmer */}
        <div className="card" style={{ padding: '0', borderRadius: '12px', border: '1px solid var(--border-light)', overflow: 'hidden' }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border-light)', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 0.8fr', gap: '14px' }}>
            <div className="skeleton-shimmer" style={{ height: '16px', width: '50%' }} />
            <div className="skeleton-shimmer" style={{ height: '16px', width: '50%' }} />
            <div className="skeleton-shimmer" style={{ height: '16px', width: '50%' }} />
            <div className="skeleton-shimmer" style={{ height: '16px', width: '50%' }} />
            <div className="skeleton-shimmer" style={{ height: '16px', width: '50%', marginLeft: 'auto' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {Array.from({ length: rows }).map((_, idx) => (
              <div
                key={idx}
                style={{
                  padding: '14px 18px',
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr 1fr 0.8fr',
                  gap: '14px',
                  alignItems: 'center',
                  borderBottom: idx < rows - 1 ? '1px solid var(--border-light)' : 'none'
                }}
              >
                {/* Column 1: Image + Title + SKU */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div className="skeleton-shimmer" style={{ width: '44px', height: '44px', borderRadius: '8px', flexShrink: 0 }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                    <div className="skeleton-shimmer" style={{ width: '75%', height: '16px' }} />
                    <div className="skeleton-shimmer" style={{ width: '50%', height: '12px' }} />
                  </div>
                </div>

                {/* Column 2: Category */}
                <div className="skeleton-shimmer" style={{ width: '65%', height: '14px' }} />

                {/* Column 3: Price */}
                <div className="skeleton-shimmer" style={{ width: '60%', height: '16px' }} />

                {/* Column 4: Stock / Status */}
                <div className="skeleton-shimmer" style={{ width: '70px', height: '22px', borderRadius: '12px' }} />

                {/* Column 5: Action buttons */}
                <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                  <div className="skeleton-shimmer" style={{ width: '28px', height: '28px', borderRadius: '6px' }} />
                  <div className="skeleton-shimmer" style={{ width: '28px', height: '28px', borderRadius: '6px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // 9. SUPER ADMIN SUB-ADMINS SKELETON
  // ==========================================
  if (variant === 'admin-subadmins') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
        {Array.from({ length: rows }).map((_, idx) => (
          <div
            key={idx}
            style={{
              padding: '14px 16px',
              display: 'grid',
              gridTemplateColumns: '1.5fr 1.2fr 1fr 1fr 1fr 0.8fr',
              gap: '12px',
              alignItems: 'center',
              borderBottom: '1px solid var(--border-light)'
            }}
          >
            {/* Avatar + Name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="skeleton-shimmer" style={{ width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0 }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                <div className="skeleton-shimmer" style={{ width: '80%', height: '14px' }} />
                <div className="skeleton-shimmer" style={{ width: '50%', height: '10px' }} />
              </div>
            </div>
            <div className="skeleton-shimmer" style={{ width: '75%', height: '14px' }} />
            <div className="skeleton-shimmer" style={{ width: '60px', height: '14px' }} />
            <div className="skeleton-shimmer" style={{ width: '70%', height: '14px' }} />
            <div className="skeleton-shimmer" style={{ width: '60px', height: '20px', borderRadius: '10px' }} />
            <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
              <div className="skeleton-shimmer" style={{ width: '26px', height: '26px', borderRadius: '6px' }} />
              <div className="skeleton-shimmer" style={{ width: '26px', height: '26px', borderRadius: '6px' }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ==========================================
  // 10. GENERAL TABLE ROWS SKELETON
  // ==========================================
  if (variant === 'table') {
    return (
      <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-light)', padding: '16px', overflowX: 'auto', width: '100%' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', minWidth: '520px' }}>
          {Array.from({ length: rows }).map((_, idx) => (
            <div
              key={idx}
              style={{
                display: 'grid',
                gridTemplateColumns: '1.2fr 1fr 1fr 1fr 0.8fr',
                gap: '16px',
                alignItems: 'center',
                padding: '10px 0',
                borderBottom: idx < rows - 1 ? '1px solid var(--border-light)' : 'none'
              }}
            >
              <div className="skeleton-shimmer" style={{ height: '20px', width: '80%' }} />
              <div className="skeleton-shimmer" style={{ height: '16px', width: '60%' }} />
              <div className="skeleton-shimmer" style={{ height: '16px', width: '70%' }} />
              <div className="skeleton-shimmer" style={{ height: '20px', width: '75%' }} />
              <div className="skeleton-shimmer" style={{ height: '28px', width: '90px', borderRadius: '6px' }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ==========================================
  // 11. KPI METRICS SKELETON
  // ==========================================
  if (variant === 'metrics') {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '16px', marginBottom: '28px', width: '100%' }}>
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className="card"
            style={{
              padding: '20px',
              borderRadius: '14px',
              border: '1px solid var(--border-light)',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div className="skeleton-shimmer" style={{ width: '110px', height: '14px' }} />
              <div className="skeleton-shimmer" style={{ width: '60px', height: '18px', borderRadius: '10px' }} />
            </div>
            <div className="skeleton-shimmer" style={{ width: '140px', height: '32px' }} />
            <div className="skeleton-shimmer" style={{ width: '70%', height: '12px' }} />
            <div className="skeleton-shimmer" style={{ width: '100%', height: '34px', borderRadius: '8px', marginTop: '6px' }} />
          </div>
        ))}
      </div>
    );
  }

  // Default fallback block shimmer
  return <div className="skeleton-shimmer" style={{ width: '100%', height: '120px' }} />;
}
