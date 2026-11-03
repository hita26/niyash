import React from 'react';

/**
 * Enterprise Shimmer Skeleton Loader
 * Provides zero-lag, instant perceived performance across medicines, tables, and metric cards
 */
export default function SkeletonLoader({ variant = 'product-grid', count = 8, rows = 5 }) {
  
  // 1. Shimmering Product Catalog Grid
  if (variant === 'product-grid') {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '18px', width: '100%' }}>
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

  // 2. Shimmering Table Rows (for Orders & Ledger)
  if (variant === 'table') {
    return (
      <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-light)', padding: '16px', overflow: 'hidden' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
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

  // 3. Shimmering KPI Metric Cards
  if (variant === 'metrics') {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '28px' }}>
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

  return <div className="skeleton-shimmer" style={{ width: '100%', height: '100px' }} />;
}
