import React, { useState, useEffect } from 'react';
import { 
  X, Lock, Mail, User, ShieldAlert, FileText, Phone, Building, 
  KeyRound, CheckCircle2, ArrowLeft, Eye, EyeOff, MessageCircle, RotateCcw 
} from 'lucide-react';

function AuthModal({ isOpen, onClose, onSuccess }) {
  // Modes: 'login' | 'register' | 'forgot-request' | 'forgot-verify' | 'forgot-success'
  const [authMode, setAuthMode] = useState('login');
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Form State for Login / Register
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    companyName: '',
    gstin: '',
    drugLicense: '',
    phone: '',
  });

  // Forgot Password & Reset State
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetData, setResetData] = useState({
    otp: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [serverOtp, setServerOtp] = useState('');
  const [countdown, setCountdown] = useState(0);

  // Password Visibility Toggles
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Resend Countdown Timer
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  // Lock body scroll and listen for Escape key
  useEffect(() => {
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

  // Reset modal state when closed or opened
  useEffect(() => {
    if (isOpen) {
      setError('');
      setInfoMessage('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isLogin = authMode === 'login';
  const isRegister = authMode === 'register';

  const handleChange = (e) => {
    const val = e.target.name === 'email' ? e.target.value.toLowerCase() : e.target.value;
    setFormData({ ...formData, [e.target.name]: val });
  };

  const handleResetChange = (e) => {
    setResetData({ ...resetData, [e.target.name]: e.target.value });
  };

  const openForgotPassword = () => {
    setForgotEmail(formData.email || '');
    setAuthMode('forgot-request');
    setError('');
    setInfoMessage('');
  };

  // 1. Submit Login or Register
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfoMessage('');
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

  // 2. Request Password Reset OTP
  const handleRequestResetOtp = async (e) => {
    if (e) e.preventDefault();
    const identifier = (forgotEmail || formData.email || '').trim();
    if (!identifier) {
      setError('Please enter your registered email address or phone number');
      return;
    }

    setError('');
    setInfoMessage('');
    setLoading(true);

    try {
      const res = await fetch('/api/users/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: identifier }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to request reset code');
      }

      setForgotEmail(data.email || identifier);
      if (data.otp) {
        setServerOtp(data.otp);
      }
      setInfoMessage(data.message || 'Verification code sent.');
      setCountdown(30);
      setAuthMode('forgot-verify');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 3. Submit Reset Password with OTP
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setInfoMessage('');

    if (!resetData.otp || resetData.otp.trim().length !== 6) {
      setError('Please enter the complete 6-digit verification code');
      return;
    }

    if (!resetData.newPassword || resetData.newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      return;
    }

    if (resetData.newPassword !== resetData.confirmPassword) {
      setError('New password and confirm password do not match');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/users/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: forgotEmail.toLowerCase().trim(),
          otp: resetData.otp.trim(),
          newPassword: resetData.newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to reset password');
      }

      setAuthMode('forgot-success');
      
      // Auto login user on successful reset
      setTimeout(() => {
        if (data.token) {
          onSuccess(data);
        }
        onClose();
      }, 2200);

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
        backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(5px)',
        zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
      }}
    >
      <div 
        role="dialog"
        aria-modal="true"
        aria-label={
          isLogin 
            ? 'Retailer Account Login' 
            : isRegister 
            ? 'Retailer Wholesale Registration' 
            : 'Reset Account Password'
        }
        className="card animate-fade-in" 
        style={{
          width: '100%', 
          maxWidth: isRegister ? '560px' : '430px', 
          padding: '28px',
          position: 'relative', 
          backgroundColor: '#ffffff', 
          maxHeight: '92vh', 
          overflowY: 'auto',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(12, 61, 108, 0.25)',
        }}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{ 
            position: 'absolute', top: '18px', right: '18px', 
            color: 'var(--text-light)', background: '#f8fafc', 
            border: '1px solid var(--border-light)', 
            borderRadius: '50%', cursor: 'pointer', padding: '6px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'var(--transition-smooth)'
          }}
          aria-label="Close dialog"
        >
          <X size={18} />
        </button>

        {/* Top Navigation Tabs (Only in Login / Register mode) */}
        {(isLogin || isRegister) && (
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border-light)', marginBottom: '22px' }}>
            <button 
              type="button"
              onClick={() => { setAuthMode('login'); setError(''); setInfoMessage(''); }}
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
              onClick={() => { setAuthMode('register'); setError(''); setInfoMessage(''); }}
              style={{
                flex: 1, padding: '12px', fontWeight: '700', fontSize: '1rem',
                color: isRegister ? 'var(--primary-blue)' : 'var(--text-medium)',
                borderBottom: isRegister ? '3px solid var(--primary-blue)' : '3px solid transparent',
                background: 'none', border: 'none', cursor: 'pointer',
                transition: 'var(--transition-smooth)'
              }}
            >
              B2B Register
            </button>
          </div>
        )}

        {/* Back Button for Forgot Password Flow */}
        {(authMode === 'forgot-request' || authMode === 'forgot-verify') && (
          <div style={{ marginBottom: '18px' }}>
            <button
              type="button"
              onClick={() => {
                if (authMode === 'forgot-verify') {
                  setAuthMode('forgot-request');
                } else {
                  setAuthMode('login');
                }
                setError('');
                setInfoMessage('');
              }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                color: 'var(--primary-blue)', fontSize: '0.85rem', fontWeight: '600',
                background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0'
              }}
            >
              <ArrowLeft size={16} />
              <span>{authMode === 'forgot-verify' ? 'Change Email / Phone' : 'Back to Log In'}</span>
            </button>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div style={{
            display: 'flex', gap: '10px', alignItems: 'center', backgroundColor: '#fef2f2',
            color: '#b91c1c', padding: '12px 14px', borderRadius: '8px', marginBottom: '18px',
            fontSize: '0.85rem', border: '1px solid #fee2e2', lineHeight: '1.4'
          }}>
            <ShieldAlert size={17} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Info Banner */}
        {infoMessage && (
          <div style={{
            display: 'flex', gap: '10px', alignItems: 'flex-start', backgroundColor: '#eff6ff',
            color: '#1d4ed8', padding: '12px 14px', borderRadius: '8px', marginBottom: '18px',
            fontSize: '0.85rem', border: '1px solid #dbeafe', lineHeight: '1.4'
          }}>
            <CheckCircle2 size={17} style={{ flexShrink: 0, marginTop: '2px', color: '#2563eb' }} />
            <span>{infoMessage}</span>
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 1 & 2: LOGIN / REGISTER FORMS                       */}
        {/* ======================================================== */}
        {(isLogin || isRegister) && (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            
            {isRegister && (
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
                  type={showLoginPassword ? 'text' : 'password'} 
                  name="password" 
                  required 
                  value={formData.password} 
                  onChange={handleChange}
                  placeholder="••••••••"
                  style={{ width: '100%', padding: '10px 40px 10px 38px', borderRadius: '6px', border: '1px solid var(--border-light)' }}
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  style={{
                    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer', padding: '2px',
                    display: 'flex', alignItems: 'center'
                  }}
                  title={showLoginPassword ? 'Hide password' : 'Show password'}
                  aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                >
                  {showLoginPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* ONLY ONE Forgot Password link: right below the password field */}
              {isLogin && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                  <button
                    type="button"
                    onClick={openForgotPassword}
                    style={{
                      background: 'none', border: 'none', color: 'var(--primary-blue)',
                      fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer', padding: '2px 0',
                      textDecoration: 'underline'
                    }}
                  >
                    Forgot Password?
                  </button>
                </div>
              )}
            </div>

            {isRegister && (
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
        )}

        {/* Bottom Switch between Login / Register */}
        {(isLogin || isRegister) && (
          <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.85rem', color: 'var(--text-medium)' }}>
            {isLogin ? (
              <span>
                New B2B buyer?{' '}
                <button 
                  type="button"
                  onClick={() => { setAuthMode('register'); setError(''); setInfoMessage(''); }}
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
                  onClick={() => { setAuthMode('login'); setError(''); setInfoMessage(''); }}
                  style={{ color: 'var(--primary-blue)', fontWeight: '700', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  Log In
                </button>
              </span>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 3: FORGOT PASSWORD - STEP 1 (REQUEST OTP)          */}
        {/* ======================================================== */}
        {authMode === 'forgot-request' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '22px' }}>
              <div style={{
                width: '54px', height: '54px', borderRadius: '50%', backgroundColor: '#eff6ff',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px',
                color: 'var(--primary-blue)', border: '1px solid #bfdbfe'
              }}>
                <KeyRound size={26} />
              </div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-blue)', marginBottom: '6px', fontWeight: '700' }}>
                Forgot Password?
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-medium)', lineHeight: '1.5' }}>
                Enter your registered wholesale email address or mobile number. We will generate a 6-digit verification code to reset your password.
              </p>
            </div>

            <form onSubmit={handleRequestResetOtp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-dark)' }}>
                  Registered Email or Phone *
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                  <input 
                    type="text" 
                    required 
                    value={forgotEmail} 
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="e.g. store@gmail.com or 98250xxxxx"
                    style={{ width: '100%', padding: '10px 10px 10px 38px', borderRadius: '6px', border: '1px solid var(--border-light)', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="btn btn-primary"
                style={{ width: '100%', padding: '12px', borderRadius: '6px', fontWeight: '700', marginTop: '6px' }}
              >
                {loading ? 'Sending Code...' : 'Send Verification Code'}
              </button>
            </form>

            {/* Wholesale WhatsApp Help Banner */}
            <div style={{
              marginTop: '22px', padding: '14px', borderRadius: '8px',
              backgroundColor: '#f8fafc', border: '1px solid var(--border-light)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MessageCircle size={20} color="#16a34a" />
                <div style={{ fontSize: '0.8rem', color: 'var(--text-medium)' }}>
                  Need urgent help? <br />
                  <strong style={{ color: 'var(--text-dark)' }}>Wholesale Desk Support</strong>
                </div>
              </div>
              <a
                href={`https://wa.me/919316566894?text=${encodeURIComponent(`Hello Niyansh Pharma, I need help resetting password for account: ${forgotEmail || ''}`)}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  fontSize: '0.78rem', fontWeight: '700', color: '#16a34a',
                  backgroundColor: '#dcfce7', padding: '6px 12px', borderRadius: '6px',
                  textDecoration: 'none', whiteSpace: 'nowrap'
                }}
              >
                WhatsApp Desk
              </a>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 4: FORGOT PASSWORD - STEP 2 (ENTER CODE & RESET)    */}
        {/* ======================================================== */}
        {authMode === 'forgot-verify' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{
                width: '54px', height: '54px', borderRadius: '50%', backgroundColor: '#eff6ff',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px',
                color: 'var(--primary-blue)', border: '1px solid #bfdbfe'
              }}>
                <Lock size={26} />
              </div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-blue)', marginBottom: '4px', fontWeight: '700' }}>
                Reset Your Password
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-medium)' }}>
                Code generated for <strong style={{ color: 'var(--text-dark)' }}>{forgotEmail}</strong>
              </p>
            </div>

            {/* Fallback OTP Auto-fill Box if Server has no SMTP configured */}
            {serverOtp && (
              <div style={{
                backgroundColor: '#fefce8', border: '1px solid #fef08a', borderRadius: '8px',
                padding: '10px 14px', marginBottom: '16px', display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', fontSize: '0.85rem', color: '#854d0e'
              }}>
                <div>
                  <span style={{ fontWeight: '600' }}>Reset Code: </span>
                  <span style={{ fontFamily: 'monospace', fontWeight: '800', fontSize: '1rem', letterSpacing: '2px', color: '#713f12' }}>
                    {serverOtp}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setResetData({ ...resetData, otp: serverOtp })}
                  style={{
                    backgroundColor: '#ca8a04', color: '#ffffff', fontSize: '0.75rem',
                    fontWeight: '700', padding: '4px 10px', borderRadius: '5px', border: 'none', cursor: 'pointer'
                  }}
                >
                  Fill Code
                </button>
              </div>
            )}

            <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              {/* 6-Digit Verification Code */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-dark)' }}>
                    6-Digit Verification Code *
                  </label>
                  <button
                    type="button"
                    disabled={countdown > 0 || loading}
                    onClick={() => handleRequestResetOtp()}
                    style={{
                      background: 'none', border: 'none', 
                      color: countdown > 0 ? 'var(--text-light)' : 'var(--primary-blue)',
                      fontSize: '0.78rem', fontWeight: '700', cursor: countdown > 0 ? 'default' : 'pointer',
                      display: 'inline-flex', alignItems: 'center', gap: '4px'
                    }}
                  >
                    <RotateCcw size={12} />
                    {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
                  </button>
                </div>
                <div style={{ position: 'relative' }}>
                  <KeyRound size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                  <input 
                    type="text" 
                    name="otp" 
                    required 
                    maxLength={6}
                    value={resetData.otp} 
                    onChange={handleResetChange}
                    placeholder="Enter 6-digit code"
                    style={{ 
                      width: '100%', padding: '10px 10px 10px 38px', borderRadius: '6px', 
                      border: '1px solid var(--border-light)', fontSize: '1rem',
                      letterSpacing: '3px', fontWeight: '700', color: 'var(--text-dark)' 
                    }}
                  />
                </div>
              </div>

              {/* New Password */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-dark)' }}>
                  New Password *
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                  <input 
                    type={showNewPassword ? 'text' : 'password'} 
                    name="newPassword" 
                    required 
                    minLength={6}
                    value={resetData.newPassword} 
                    onChange={handleResetChange}
                    placeholder="At least 6 characters"
                    style={{ width: '100%', padding: '10px 40px 10px 38px', borderRadius: '6px', border: '1px solid var(--border-light)' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    style={{
                      position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer', padding: '2px',
                      display: 'flex', alignItems: 'center'
                    }}
                    title={showNewPassword ? 'Hide password' : 'Show password'}
                    aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                  >
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-dark)' }}>
                  Confirm New Password *
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                  <input 
                    type={showConfirmPassword ? 'text' : 'password'} 
                    name="confirmPassword" 
                    required 
                    minLength={6}
                    value={resetData.confirmPassword} 
                    onChange={handleResetChange}
                    placeholder="Re-enter new password"
                    style={{ width: '100%', padding: '10px 40px 10px 38px', borderRadius: '6px', border: '1px solid var(--border-light)' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer', padding: '2px',
                      display: 'flex', alignItems: 'center'
                    }}
                    title={showConfirmPassword ? 'Hide password' : 'Show password'}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="btn btn-primary"
                style={{ width: '100%', padding: '12px', borderRadius: '6px', fontWeight: '700', marginTop: '6px' }}
              >
                {loading ? 'Updating Password...' : 'Reset Password & Sign In'}
              </button>
            </form>
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 5: FORGOT PASSWORD - SUCCESS CONFIRMATION           */}
        {/* ======================================================== */}
        {authMode === 'forgot-success' && (
          <div style={{ textAlign: 'center', padding: '20px 10px' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#dcfce7',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px',
              color: '#16a34a'
            }}>
              <CheckCircle2 size={36} />
            </div>
            <h3 style={{ fontSize: '1.3rem', color: 'var(--primary-blue)', marginBottom: '8px', fontWeight: '800' }}>
              Password Reset Successful!
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-medium)', lineHeight: '1.5', marginBottom: '20px' }}>
              Your account password has been updated successfully. You are being securely signed into your wholesale account.
            </p>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
              Redirecting to wholesale portal...
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default AuthModal;
