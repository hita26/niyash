import React, { useState } from 'react';
import { X, Lock, Mail, User, ShieldAlert, FileText, Phone, Building } from 'lucide-react';

function AuthModal({ isOpen, onClose, onSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    companyName: '',
    gstin: '',
    drugLicense: '',
    phone: '',
  });

  // Lock body scroll and listen for Escape key
  React.useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const val = e.target.name === 'email' ? e.target.value.toLowerCase() : e.target.value;
    setFormData({ ...formData, [e.target.name]: val });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const url = isLogin ? '/api/users/login' : '/api/users/register';
    const cleanEmail = formData.email.toLowerCase().trim();
    const body = isLogin 
      ? { email: cleanEmail, password: formData.password }
      : { ...formData, email: cleanEmail };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      onSuccess(data);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(5px)',
        zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
      }}
    >
      <div 
        role="dialog"
        aria-modal="true"
        aria-label={isLogin ? 'Retailer Account Login' : 'Retailer Wholesale Registration'}
        className="card animate-fade-in" 
        style={{
          width: '100%', maxWidth: isLogin ? '400px' : '550px', padding: '30px',
          position: 'relative', backgroundColor: '#ffffff', maxHeight: '90vh', overflowY: 'auto'
        }}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: '20px', right: '20px', color: 'var(--text-light)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
          aria-label="Close dialog"
        >
          <X size={20} />
        </button>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-light)', marginBottom: '25px' }}>
          <button 
            type="button"
            onClick={() => { setIsLogin(true); setError(''); }}
            style={{
              flex: 1, padding: '12px', fontWeight: '700', fontSize: '1rem',
              color: isLogin ? 'var(--primary-blue)' : 'var(--text-medium)',
              borderBottom: isLogin ? '3px solid var(--primary-blue)' : '3px solid transparent',
              background: 'none', border: 'none', cursor: 'pointer',
              transition: 'var(--transition-smooth)'
            }}
          >
            Log In
          </button>
          <button 
            type="button"
            onClick={() => { setIsLogin(false); setError(''); }}
            style={{
              flex: 1, padding: '12px', fontWeight: '700', fontSize: '1rem',
              color: !isLogin ? 'var(--primary-blue)' : 'var(--text-medium)',
              borderBottom: !isLogin ? '3px solid var(--primary-blue)' : '3px solid transparent',
              background: 'none', border: 'none', cursor: 'pointer',
              transition: 'var(--transition-smooth)'
            }}
          >
            B2B Register
          </button>
        </div>

        {error && (
          <div style={{
            display: 'flex', gap: '10px', alignItems: 'center', backgroundColor: '#fef2f2',
            color: '#ef4444', padding: '12px 15px', borderRadius: '8px', marginBottom: '20px',
            fontSize: '0.85rem', border: '1px solid #fee2e2'
          }}>
            <ShieldAlert size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          {!isLogin && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-dark)' }}>Contact Name *</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                <input 
                  type="text" 
                  name="name" 
                  required 
                  value={formData.name} 
                  onChange={handleChange}
                  placeholder="John Doe"
                  style={{ width: '100%', padding: '10px 10px 10px 38px', borderRadius: '6px', border: '1px solid var(--border-light)' }}
                />
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-dark)' }}>Email Address *</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
              <input 
                type="email" 
                name="email" 
                required 
                value={formData.email} 
                onChange={handleChange}
                placeholder="example@mail.com"
                style={{ width: '100%', padding: '10px 10px 10px 38px', borderRadius: '6px', border: '1px solid var(--border-light)' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-dark)' }}>Password *</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
              <input 
                type="password" 
                name="password" 
                required 
                value={formData.password} 
                onChange={handleChange}
                placeholder="••••••••"
                style={{ width: '100%', padding: '10px 10px 10px 38px', borderRadius: '6px', border: '1px solid var(--border-light)' }}
              />
            </div>
          </div>

          {!isLogin && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-dark)' }}>Company/Store Name</label>
                  <div style={{ position: 'relative' }}>
                    <Building size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                    <input 
                      type="text" 
                      name="companyName" 
                      value={formData.companyName} 
                      onChange={handleChange}
                      placeholder="Niyansh Medicals"
                      style={{ width: '100%', padding: '10px 10px 10px 38px', borderRadius: '6px', border: '1px solid var(--border-light)', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-dark)' }}>Phone Number</label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                    <input 
                      type="text" 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleChange}
                      placeholder="99099xxxxx"
                      style={{ width: '100%', padding: '10px 10px 10px 38px', borderRadius: '6px', border: '1px solid var(--border-light)', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-dark)' }}>GSTIN (GST Number)</label>
                  <div style={{ position: 'relative' }}>
                    <FileText size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                    <input 
                      type="text" 
                      name="gstin" 
                      value={formData.gstin} 
                      onChange={handleChange}
                      placeholder="24AAAAA0000A1Z"
                      style={{ width: '100%', padding: '10px 10px 10px 38px', borderRadius: '6px', border: '1px solid var(--border-light)', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-dark)' }}>Drug License Number</label>
                  <div style={{ position: 'relative' }}>
                    <FileText size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                    <input 
                      type="text" 
                      name="drugLicense" 
                      value={formData.drugLicense} 
                      onChange={handleChange}
                      placeholder="G/25/1234"
                      style={{ width: '100%', padding: '10px 10px 10px 38px', borderRadius: '6px', border: '1px solid var(--border-light)', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px', marginTop: '10px', borderRadius: '6px', fontWeight: '700' }}
          >
            {loading ? 'Authenticating...' : isLogin ? 'Sign In to Account' : 'Create B2B Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.85rem', color: 'var(--text-medium)' }}>
          {isLogin ? (
            <span>
              New B2B buyer?{' '}
              <button 
                type="button"
                onClick={() => { setIsLogin(false); setError(''); }}
                style={{ color: 'var(--primary-blue)', fontWeight: '700', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Register Store
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{' '}
              <button 
                type="button"
                onClick={() => { setIsLogin(true); setError(''); }}
                style={{ color: 'var(--primary-blue)', fontWeight: '700', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Log In
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
