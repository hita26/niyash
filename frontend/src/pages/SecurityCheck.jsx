import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SecurityVerification from '../components/SecurityVerification';

/**
 * Dedicated Security Verification Preview & Test Page
 * Accessible via `/security-check`
 */
export default function SecurityCheck() {
  const navigate = useNavigate();
  const [completed, setCompleted] = useState(false);

  const handleVerified = () => {
    setCompleted(true);
    // After short delay, optionally allow redirect or show completed state
  };

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh', backgroundColor: '#000000' }}>
      <SecurityVerification 
        isPageMode={true} 
        onVerified={handleVerified}
      />

      {completed && (
        <div style={{
          position: 'fixed',
          bottom: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid #10b981',
          borderRadius: '8px',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          zIndex: 1000000,
          backdropFilter: 'blur(8px)'
        }}>
          <span style={{ color: '#10b981', fontSize: '14px', fontWeight: '600' }}>
            ✓ Verification Passed Successfully
          </span>
          <button
            onClick={() => navigate('/')}
            style={{
              backgroundColor: '#10b981',
              color: '#ffffff',
              border: 'none',
              padding: '6px 14px',
              borderRadius: '6px',
              fontWeight: '600',
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            Enter Website
          </button>
        </div>
      )}
    </div>
  );
}
