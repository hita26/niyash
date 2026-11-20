import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, Lock, Mail, User, ShieldAlert, FileText, Phone, Building, 
  KeyRound, CheckCircle2, ArrowLeft, Eye, EyeOff, MessageCircle, RotateCcw,
  Upload, Check, Paperclip, ExternalLink
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const MAX_DOC_SIZE_MB = 5; // Maximum document upload size in MB
const MAX_DOC_SIZE_BYTES = MAX_DOC_SIZE_MB * 1024 * 1024;

function AuthModal({ isOpen, onClose, onSuccess }) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  // Modes: 'login' | 'register' | 'forgot-request' | 'forgot-verify' | 'forgot-success'
  const [authMode, setAuthMode] = useState('login');
  const [registerStep, setRegisterStep] = useState(1); // Step 1: Store & Contact Info, Step 2: Licenses & KYC
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
    pan: '',
    drugLicense: '',
    drugLicense1: '',
    drugLicense2: '',
    phone: '',
    gstinDoc: '',
    panDoc: '',
    drugLicense1Doc: '',
    drugLicense2Doc: '',
  });

  // Uploaded Document Files State
  const [docFiles, setDocFiles] = useState({
    gstin: null,
    pan: null,
    drugLicense1: null,
    drugLicense2: null,
  });

  // Chemist Registration Pending Approval State
  const [registrationSuccessData, setRegistrationSuccessData] = useState(null);

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

  // Lock body & documentElement scroll and listen for Escape key
  useEffect(() => {
    if (!isOpen) return;
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalBodyTouch = document.body.style.touchAction;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.touchAction = originalBodyTouch;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Reset modal state when closed or opened
  useEffect(() => {
    if (isOpen) {
      setError('');
      setInfoMessage('');
      setRegisterStep(1);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isLogin = authMode === 'login';
  const isRegister = authMode === 'register';

  const handleChange = (e) => {
    const { name, value } = e.target;
    let val = value;

    if (name === 'email') {
      val = val.toLowerCase();
      setFormData(prev => ({ ...prev, [name]: val }));
    } else if (name === 'phone') {
      val = val.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({ ...prev, [name]: val }));
    } else if (name === 'gstin') {
      val = val.toUpperCase().trim();
      let derivedPan = formData.pan;
      if (val.length >= 12) {
        const panCandidate = val.substring(2, 12).replace(/[^A-Z0-9]/g, '');
        if (panCandidate.length === 10 && !formData.pan) {
          derivedPan = panCandidate;
        }
      }
      setFormData(prev => ({ ...prev, gstin: val, pan: derivedPan }));
    } else if (name === 'pan') {
      val = val.toUpperCase().trim().slice(0, 10);
      setFormData(prev => ({ ...prev, [name]: val }));
    } else if (name === 'drugLicense1') {
      val = val.toUpperCase();
      setFormData(prev => ({ ...prev, drugLicense1: val, drugLicense: val }));
    } else if (name === 'drugLicense2') {
      val = val.toUpperCase();
      setFormData(prev => ({ ...prev, [name]: val }));
    } else if (name === 'password') {
      setFormData(prev => ({ ...prev, [name]: val }));
    } else {
      if (typeof val === 'string' && isRegister) {
        val = val.toUpperCase();
      }
      setFormData(prev => ({ ...prev, [name]: val }));
    }
  };

  const handleFileUpload = async (e, field) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const sizeInKB = Math.round(file.size / 1024);
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
    const formattedSize = file.size > 1024 * 1024 ? `${sizeInMB} MB` : `${sizeInKB} KB`;
    const fileName = file.name || '';
    const fileExt = fileName.slice((fileName.lastIndexOf('.') - 1 >>> 0) + 2).toLowerCase();
    const allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png', 'webp'];

    // 1. Validate file extension / MIME type
    if (!allowedExtensions.includes(fileExt) && !file.type.match(/^(image\/(jpeg|png|webp)|application\/pdf)$/)) {
      setError(`File "${fileName}" is not supported. Please upload PDF, JPG, JPEG, PNG, or WEBP documents.`);
      e.target.value = '';
      return;
    }

    // 2. Enforce 5 MB limit
    if (file.size > MAX_DOC_SIZE_BYTES) {
      setError(`File "${fileName}" is ${formattedSize}. Maximum allowed size is ${MAX_DOC_SIZE_MB} MB. Please upload a file smaller than 5 MB.`);
      e.target.value = '';
      return;
    }

    setError('');

    // Instant local Base64 preview & Cloud persistence Data URL
    const reader = new FileReader();
    reader.onload = async (loadEvt) => {
      const dataUrl = loadEvt.target.result;
      setDocFiles(prev => ({
        ...prev,
        [field]: { name: file.name, sizeStr: formattedSize, sizeKB: sizeInKB, url: dataUrl, uploading: true }
      }));
      // Default to Data URL so it is stored directly in MongoDB Atlas Cloud
      setFormData(prev => ({ ...prev, [`${field}Doc`]: dataUrl }));

      // Also upload to server to get server URL/validation
      try {
        const uploadData = new FormData();
        uploadData.append('file', file);
        const res = await fetch('/api/users/upload-doc', {
          method: 'POST',
          body: uploadData,
        });
        const result = await res.json();
        if (res.ok) {
          const finalUrl = result.dataUrl || dataUrl || result.url;
          setDocFiles(prev => ({
            ...prev,
            [field]: { name: file.name, sizeKB: result.sizeKB || sizeInKB, url: finalUrl, uploading: false }
          }));
          setFormData(prev => ({ ...prev, [`${field}Doc`]: finalUrl }));
        } else {
          if (result.message) {
            setError(result.message);
          }
          setDocFiles(prev => ({
            ...prev,
            [field]: { ...(prev[field] || {}), uploading: false }
          }));
        }
      } catch (err) {
        // Offline / serverless fallback: retain persistent base64 dataUrl
        setDocFiles(prev => ({
          ...prev,
          [field]: { ...(prev[field] || {}), uploading: false }
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = (field) => {
    setDocFiles(prev => ({ ...prev, [field]: null }));
    setFormData(prev => ({ ...prev, [`${field}Doc`]: '' }));
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

  const handleProceedToStep2 = (e) => {
    if (e) e.preventDefault();
    setError('');
    if (!formData.companyName || !formData.companyName.trim()) {
      setError('Chemist / Store Name is required.');
      return;
    }
    if (!formData.name || !formData.name.trim()) {
      setError('Contact Person Name is required.');
      return;
    }
    const cleanPhone = (formData.phone || '').replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setError('Phone number is required and must contain exactly 10 digits.');
      return;
    }
    const cleanEmail = (formData.email || '').trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setError('A valid business email address is required.');
      return;
    }
    if (!formData.password || formData.password.length < 6) {
      setError('Password is required and must be at least 6 characters.');
      return;
    }
    setRegisterStep(2);
    setError('');
  };

  // 1. Submit Login or Register
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfoMessage('');
    setLoading(true);

    if (isRegister) {
      // Step 1 Validation
      if (!formData.companyName || !formData.companyName.trim()) {
        setError('Chemist / Store Name is required.');
        setRegisterStep(1);
        setLoading(false);
        return;
      }
      if (!formData.name || !formData.name.trim()) {
        setError('Contact Person Name is required.');
        setRegisterStep(1);
        setLoading(false);
        return;
      }
      const cleanPhone = (formData.phone || '').replace(/\D/g, '');
      if (cleanPhone.length !== 10) {
        setError('Phone number is required and must contain exactly 10 digits.');
        setRegisterStep(1);
        setLoading(false);
        return;
      }
      const cleanEmail = (formData.email || '').trim().toLowerCase();
      if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
        setError('A valid business email address is required.');
        setRegisterStep(1);
        setLoading(false);
        return;
      }
      if (!formData.password || formData.password.length < 6) {
        setError('Password is required and must be at least 6 characters.');
        setRegisterStep(1);
        setLoading(false);
        return;
      }

      // If user somehow triggers submit while on Step 1, advance to Step 2
      if (registerStep === 1) {
        setRegisterStep(2);
        setLoading(false);
        return;
      }

      // Step 2 Validation (KYC)
      const cleanGstin = (formData.gstin || '').trim().toUpperCase();
      let cleanPan = (formData.pan || '').trim().toUpperCase();

      // 1. PAN Number & PAN Document are STRICTLY REQUIRED
      if (!cleanPan) {
        if (cleanGstin && cleanGstin.length >= 12) {
          cleanPan = cleanGstin.substring(2, 12);
        } else {
          setError('PAN Number is required for chemist retail registration.');
          setLoading(false);
          return;
        }
      }
      if (cleanPan.length !== 10) {
        setError('PAN Number must contain exactly 10 alphanumeric characters (e.g. ABCDE1234F).');
        setLoading(false);
        return;
      }
      if (!formData.panDoc) {
        setError('Please upload your PAN Card document (PDF, JPG, or PNG, Max 5 MB).');
        setLoading(false);
        return;
      }

      // 2. Both Drug Licenses (Form 20 and Form 21) are STRICTLY REQUIRED
      const dl1 = (formData.drugLicense1 || formData.drugLicense || '').trim();
      const dl2 = (formData.drugLicense2 || '').trim();

      if (!dl1) {
        setError('Drug License 1 (Form 20) number is required.');
        setLoading(false);
        return;
      }
      if (!formData.drugLicense1Doc) {
        setError('Please upload your Drug License 1 (Form 20) document (PDF, JPG, or PNG, Max 5 MB).');
        setLoading(false);
        return;
      }

      if (!dl2) {
        setError('Drug License 2 (Form 21) number is required.');
        setLoading(false);
        return;
      }
      if (!formData.drugLicense2Doc) {
        setError('Please upload your Drug License 2 (Form 21) document (PDF, JPG, or PNG, Max 5 MB).');
        setLoading(false);
        return;
      }
    }

    const url = isLogin ? '/api/users/login' : '/api/users/register';
    const cleanEmail = formData.email.toLowerCase().trim();
    const body = isLogin 
      ? { email: cleanEmail, password: formData.password }
      : { 
          ...formData, 
          email: cleanEmail,
          drugLicense: formData.drugLicense1 || formData.drugLicense 
        };

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

      // If registered chemist is pending verification, do NOT auto-login; display confirmation view
      if (!isLogin && (data.isApproved === false || data.status === 'pending')) {
        setRegistrationSuccessData({
          companyName: formData.companyName || 'Retail Pharmacy',
          name: formData.name,
          email: cleanEmail,
          phone: formData.phone,
          drugLicense1: formData.drugLicense1 || formData.drugLicense,
          drugLicense2: formData.drugLicense2,
          pan: formData.pan,
          gstin: formData.gstin,
          message: data.message
        });
        return;
      }

      onSuccess(data);
      onClose();

      // In real-world B2B pharma flow: redirect chemist straight into their Wholesale Dashboard
      if (!window.location.pathname.startsWith('/admin') && !window.location.pathname.startsWith('/dashboard')) {
        navigate('/dashboard');
      }
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
    if (!identifier.includes('@')) {
      const cleanP = identifier.replace(/\D/g, '');
      if (cleanP.length !== 10) {
        setError('Phone number must contain exactly 10 numeric digits.');
        return;
      }
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
      onWheel={(e) => { if (e.target === e.currentTarget) e.preventDefault(); }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.78)', backdropFilter: 'blur(6px)',
        zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px',
        overscrollBehavior: 'contain'
      }}
    >
      <div 
        role="dialog"
        aria-modal="true"
        aria-label={
          isLogin 
            ? 'Retailer Account Login' 
            : isRegister 
            ? 'Chemist Wholesale Registration' 
            : 'Reset Account Password'
        }
        className="card animate-fade-in" 
        style={{
          width: '100%', 
          maxWidth: isRegister ? '640px' : '440px', 
          padding: '24px 26px',
          position: 'relative', 
          backgroundColor: 'var(--card-bg, #ffffff)', 
          maxHeight: '92vh', 
          overflowY: 'auto',
          overflowX: 'hidden',
          borderRadius: '18px',
          boxShadow: '0 25px 50px -12px rgba(12, 61, 108, 0.25)',
          overscrollBehavior: 'contain'
        }}
      >
        {/* Close Button */}
        <button 
          onClick={() => {
            setRegistrationSuccessData(null);
            onClose();
          }}
          style={{ 
            position: 'absolute', top: '16px', right: '16px', 
            color: 'var(--text-light)', background: 'var(--bg-main, #f8fafc)', 
            border: '1px solid var(--border-light, #e2e8f0)', 
            borderRadius: '50%', cursor: 'pointer', padding: '6px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'var(--transition-smooth)',
            zIndex: 10
          }}
          aria-label="Close dialog"
        >
          <X size={18} />
        </button>

        {/* CHEMIST REGISTRATION PENDING CONFIRMATION VIEW */}
        {registrationSuccessData ? (
          <div style={{ textAlign: 'center', padding: '20px 10px' }} className="animate-fade-in">
            <div style={{
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              backgroundColor: 'rgba(34, 197, 94, 0.14)',
              color: '#16a34a',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
              border: '2px solid rgba(34, 197, 94, 0.3)'
            }}>
              <CheckCircle2 size={38} />
            </div>

            <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-dark, #0f172a)', margin: '0 0 8px 0' }}>
              નોંધણી સફળતાપૂર્વક સબમિટ થઈ ગઈ છે!
            </h3>

            <div style={{
              display: 'inline-block',
              backgroundColor: '#fef3c7',
              border: '1px solid #f59e0b',
              color: '#b45309',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '0.82rem',
              fontWeight: '700',
              marginBottom: '18px'
            }}>
              ⏳ KYC & ડ્રગ લાયસન્સ ચકાસણી હેઠળ છે (24 કલાકમાં)
            </div>

            <div style={{
              backgroundColor: 'var(--bg-main, #f8fafc)',
              border: '1px solid var(--border-light, #e2e8f0)',
              borderRadius: '12px',
              padding: '16px',
              textAlign: 'left',
              marginBottom: '16px',
              fontSize: '0.88rem',
              lineHeight: '1.6'
            }}>
              <div style={{ marginBottom: '6px' }}>
                <strong style={{ color: 'var(--primary-blue, #0c3d6c)' }}>ફાર્મસી / સ્ટોર:</strong> {registrationSuccessData.companyName}
              </div>
              <div style={{ marginBottom: '6px' }}>
                <strong style={{ color: 'var(--text-dark, #0f172a)' }}>સંપર્ક વ્યક્તિ:</strong> {registrationSuccessData.name}
              </div>
              <div style={{ marginBottom: '6px' }}>
                <strong style={{ color: 'var(--text-dark, #0f172a)' }}>રજીસ્ટર્ડ ઈમેઈલ:</strong> {registrationSuccessData.email}
              </div>
              <div style={{ marginBottom: '6px' }}>
                <strong style={{ color: 'var(--text-dark, #0f172a)' }}>મોબાઈલ નંબર:</strong> +91 {registrationSuccessData.phone}
              </div>
              <div style={{ marginBottom: '6px' }}>
                <strong style={{ color: 'var(--text-dark, #0f172a)' }}>ડ્રગ લાયસન્સ 1 (Form 20):</strong> <span style={{ color: '#047857', fontWeight: '700' }}>{registrationSuccessData.drugLicense1 || 'સબમિટ થયેલ'}</span>
              </div>
              <div style={{ marginBottom: '6px' }}>
                <strong style={{ color: 'var(--text-dark, #0f172a)' }}>ડ્રગ લાયસન્સ 2 (Form 21):</strong> <span style={{ color: '#047857', fontWeight: '700' }}>{registrationSuccessData.drugLicense2 || 'સબમિટ થયેલ'}</span>
              </div>
              <div>
                <strong style={{ color: 'var(--text-dark, #0f172a)' }}>PAN નંબર:</strong> <span style={{ color: '#0c3d6c', fontWeight: '700' }}>{registrationSuccessData.pan || 'સબમિટ થયેલ'}</span>
                {registrationSuccessData.gstin && (
                  <span style={{ marginLeft: '12px', color: '#64748b' }}>• GSTIN: {registrationSuccessData.gstin}</span>
                )}
              </div>
            </div>

            {/* Document Security Guarantee */}
            <div style={{
              backgroundColor: '#f0fdf4',
              border: '1px solid #86efac',
              borderRadius: '8px',
              padding: '10px 14px',
              textAlign: 'left',
              fontSize: '0.8rem',
              color: '#166534',
              lineHeight: '1.5',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{ fontSize: '1.1rem' }}>🔒</span>
              <span><strong>સિક્યુરિટી ગેરંટી:</strong> તમારા અપલોડ કરેલા Form 20, Form 21 અને PAN દસ્તાવેજ 256-Bit SSL એન્ક્રિપ્ટેડ સુરક્ષિત વોલ્ટમાં સંગ્રહિત છે, જે માત્ર FDCA રેગ્યુલેટરી વેરિફિકેશન માટે જ ઉપયોગમાં લેવાશે.</span>
            </div>

            <div style={{
              backgroundColor: 'rgba(37, 99, 235, 0.08)',
              borderLeft: '4px solid #2563eb',
              borderRadius: '6px',
              padding: '14px',
              textAlign: 'left',
              fontSize: '0.84rem',
              color: '#1e40af',
              lineHeight: '1.55',
              marginBottom: '22px'
            }}>
              <strong>આગળનું સ્ટેપ:</strong> અમારી કમ્પ્લાયન્સ ટીમ તમારા ડ્રગ લાયસન્સ (Form 20/21) અને KYC ડોક્યુમેન્ટ્સ ચકાસી રહી છે. <strong>24 કલાકમાં</strong> સુપરએડમિન દ્વારા મંજૂરી અપાતાં જ તમારા રજીસ્ટર્ડ ઈમેઈલ પર <strong>હોલસેલ લોગિન યુઝરનેમ અને પાસવર્ડ</strong> મોકલી દેવાશે, જેથી તમારું એકાઉન્ટ એક્ટિવ થઈ જશે.
            </div>

            <button
              onClick={() => {
                setRegistrationSuccessData(null);
                onClose();
              }}
              style={{
                width: '100%',
                padding: '13px',
                borderRadius: '10px',
                backgroundColor: 'var(--primary-blue, #0c3d6c)',
                color: '#ffffff',
                border: 'none',
                fontWeight: '700',
                fontSize: '0.95rem',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(12, 61, 108, 0.25)'
              }}
            >
              સમજાઈ ગયું (બંધ કરો)
            </button>
          </div>
        ) : (
        <>

        {/* Top Header: Clean Header in Sign In mode, Back Link in Register mode */}
        {isLogin && (
          <div style={{ marginBottom: '18px', textAlign: 'left', paddingRight: '36px' }}>
            <h3 style={{
              fontSize: '1.22rem',
              fontWeight: '800',
              color: 'var(--text-dark, #0f172a)',
              margin: '0 0 4px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Lock size={19} style={{ color: 'var(--primary-blue, #2563eb)' }} />
              <span>{t('auth.loginTitle', 'Chemist & Hospital Sign In')}</span>
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-medium, #64748b)', margin: 0, lineHeight: '1.4' }}>
              Access live wholesale PTR rates, stock availability, and your pharmacy ledger.
            </p>
          </div>
        )}

        {isRegister && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
            paddingBottom: '10px',
            borderBottom: '1px solid var(--border-light, #e2e8f0)',
            paddingRight: '36px'
          }}>
            <button
              type="button"
              onClick={() => { setAuthMode('login'); setError(''); setInfoMessage(''); }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'none',
                border: 'none',
                color: 'var(--primary-blue, #2563eb)',
                fontSize: '0.85rem',
                fontWeight: '700',
                cursor: 'pointer',
                padding: 0
              }}
            >
              <ArrowLeft size={16} />
              <span>← Back to Sign In</span>
            </button>
            <span style={{ fontSize: '0.88rem', fontWeight: '800', color: 'var(--text-dark)' }}>
              Register Medical Store
            </span>
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
                color: 'var(--primary-blue, #2563eb)', fontSize: '0.85rem', fontWeight: '600',
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
            color: '#b91c1c', padding: '12px 14px', borderRadius: '8px', marginBottom: '16px',
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
            color: '#1d4ed8', padding: '12px 14px', borderRadius: '8px', marginBottom: '16px',
            fontSize: '0.85rem', border: '1px solid #dbeafe', lineHeight: '1.4'
          }}>
            <CheckCircle2 size={17} style={{ flexShrink: 0, marginTop: '2px', color: '#2563eb' }} />
            <span>{infoMessage}</span>
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 1: CHEMIST SIGN IN                                  */}
        {/* ======================================================== */}
        {isLogin && (
          <form onSubmit={handleSubmit} className="login-form" data-auth-mode="login" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-dark)' }}>
                {t('auth.emailLabel', 'Email Address or Mobile')} <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                <input 
                  type="email" 
                  name="email" 
                  required 
                  className="login-input"
                  data-no-uppercase="true"
                  value={formData.email} 
                  onChange={handleChange}
                  placeholder={t('auth.emailPlaceholder', 'example@mail.com')}
                  style={{ width: '100%', padding: '10px 10px 10px 38px', borderRadius: '8px', border: '1px solid var(--border-light)', fontSize: '0.9rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-dark)' }}>
                {t('auth.passwordLabel', 'Password')} <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                <input 
                  type={showLoginPassword ? 'text' : 'password'} 
                  name="password" 
                  required 
                  className="login-input"
                  data-no-uppercase="true"
                  value={formData.password} 
                  onChange={handleChange}
                  placeholder="••••••••"
                  style={{ width: '100%', padding: '10px 40px 10px 38px', borderRadius: '8px', border: '1px solid var(--border-light)', fontSize: '0.9rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  style={{
                    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer', padding: '2px',
                    display: 'flex', alignItems: 'center'
                  }}
                  title={showLoginPassword ? t('auth.hidePassword', 'Hide password') : t('auth.showPassword', 'Show password')}
                  aria-label={showLoginPassword ? t('auth.hidePassword', 'Hide password') : t('auth.showPassword', 'Show password')}
                >
                  {showLoginPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Forgot Password Link */}
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
                  {t('auth.forgotPassword', 'Forgot Password?')}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '11px', marginTop: '4px', borderRadius: '8px', fontWeight: '700', fontSize: '0.92rem' }}
            >
              {loading ? t('auth.authenticating', 'Signing In...') : t('auth.loginBtn', 'Sign In to Account')}
            </button>

            {/* B2B Onboarding Welcome Card (Replaces redundant register link) */}
            <div style={{
              marginTop: '16px',
              padding: '14px 16px',
              borderRadius: '12px',
              backgroundColor: 'var(--bg-main, #f8fafc)',
              border: '1px solid var(--border-light, #e2e8f0)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.86rem', fontWeight: '800', color: 'var(--text-dark)', marginBottom: '3px' }}>
                🏪 New Retail Chemist or Hospital?
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-medium, #64748b)', margin: '0 0 10px 0', lineHeight: '1.4' }}>
                Join Niyansh Pharma's B2B distribution network for live PTR pricing, 10+1 bonus schemes, credit billing, and same-day delivery across Gujarat.
              </p>
              <button
                type="button"
                onClick={() => { setAuthMode('register'); setRegisterStep(1); setError(''); setInfoMessage(''); }}
                style={{
                  width: '100%',
                  padding: '9px 14px',
                  borderRadius: '7px',
                  fontSize: '0.82rem',
                  fontWeight: '700',
                  backgroundColor: '#ffffff',
                  color: 'var(--primary-blue, #2563eb)',
                  border: '1.5px solid var(--primary-blue, #2563eb)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <span>Register New Medical Store ➔</span>
              </button>
            </div>
          </form>
        )}

        {/* ======================================================== */}
        {/* VIEW 2: SMART 2-STEP CHEMIST REGISTRATION                */}
        {/* ======================================================== */}
        {isRegister && (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            
            {/* Step Progress Stepper Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '10px',
              paddingBottom: '12px',
              borderBottom: '1px solid var(--border-light, #e2e8f0)'
            }}>
              <div 
                onClick={() => { if (registerStep === 2) setRegisterStep(1); }}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: registerStep === 2 ? 'pointer' : 'default' }}
              >
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: registerStep === 1 ? 'var(--primary-blue, #2563eb)' : '#10b981',
                  color: '#ffffff',
                  fontSize: '0.76rem',
                  fontWeight: '800'
                }}>
                  {registerStep === 2 ? '✓' : '1'}
                </span>
                <span style={{ fontSize: '0.84rem', fontWeight: '700', color: registerStep === 1 ? 'var(--primary-blue, #2563eb)' : '#10b981' }}>
                  1. Store & Contact Info
                </span>
              </div>

              <span style={{ color: 'var(--border-light, #cbd5e1)', fontWeight: 'bold' }}>➔</span>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: registerStep === 2 ? 'var(--primary-blue, #2563eb)' : '#94a3b8',
                  color: '#ffffff',
                  fontSize: '0.76rem',
                  fontWeight: '800'
                }}>
                  2
                </span>
                <span style={{ fontSize: '0.84rem', fontWeight: '700', color: registerStep === 2 ? 'var(--primary-blue, #2563eb)' : 'var(--text-light, #94a3b8)' }}>
                  2. Licenses & KYC
                </span>
              </div>
            </div>

            {/* STEP 1: STORE & CONTACT DETAILS */}
            {registerStep === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Store Name & Contact Name */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: '12px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-dark)' }}>
                      {t('auth.companyLabel', 'Chemist / Store Name')} <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Building size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                      <input 
                        type="text" 
                        name="companyName" 
                        required
                        value={formData.companyName} 
                        onChange={handleChange}
                        placeholder={t('auth.companyPlaceholder', 'e.g. Niyansh Medical Store')}
                        style={{ width: '100%', padding: '9px 10px 9px 36px', borderRadius: '7px', border: '1px solid var(--border-light)', fontSize: '0.86rem' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-dark)' }}>
                      {t('auth.nameLabel', 'Contact Person Name')} <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                      <input 
                        type="text" 
                        name="name" 
                        required 
                        value={formData.name} 
                        onChange={handleChange}
                        placeholder={t('auth.namePlaceholder', 'e.g. John Doe')}
                        style={{ width: '100%', padding: '9px 10px 9px 36px', borderRadius: '7px', border: '1px solid var(--border-light)', fontSize: '0.86rem' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Mobile Phone & Business Email */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: '12px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-dark)' }}>
                      {t('auth.phoneLabel', '10-Digit Mobile Number')} <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Phone size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                      <input 
                        type="tel" 
                        name="phone" 
                        required
                        maxLength={10}
                        value={formData.phone} 
                        onChange={handleChange}
                        placeholder={t('auth.phonePlaceholder', '10-digit mobile number')}
                        style={{ width: '100%', padding: '9px 10px 9px 36px', borderRadius: '7px', border: '1px solid var(--border-light)', fontSize: '0.86rem' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-dark)' }}>
                      {t('auth.emailLabel', 'Business Email Address')} <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                      <input 
                        type="email" 
                        name="email" 
                        required 
                        value={formData.email} 
                        onChange={handleChange}
                        placeholder={t('auth.emailPlaceholder', 'pharmacy@example.com')}
                        style={{ width: '100%', padding: '9px 10px 9px 36px', borderRadius: '7px', border: '1px solid var(--border-light)', fontSize: '0.86rem' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Password Field */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-dark)' }}>
                    {t('auth.passwordLabel', 'Account Password')} <span style={{ color: '#ef4444' }}>* (Minimum 6 characters)</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                    <input 
                      type={showLoginPassword ? 'text' : 'password'} 
                      name="password" 
                      required 
                      value={formData.password} 
                      onChange={handleChange}
                      placeholder="••••••••"
                      style={{ width: '100%', padding: '9px 40px 9px 36px', borderRadius: '7px', border: '1px solid var(--border-light)', fontSize: '0.86rem' }}
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
                    >
                      {showLoginPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Continue to Step 2 Button */}
                <button 
                  type="button" 
                  onClick={handleProceedToStep2}
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    padding: '11px',
                    marginTop: '8px',
                    borderRadius: '8px',
                    fontWeight: '700',
                    fontSize: '0.92rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <span>Continue to Licenses & KYC ➔</span>
                </button>
              </div>
            )}

            {/* STEP 2: LICENSES & KYC DOCUMENT UPLOADS */}
            {registerStep === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                
                {/* Back button link */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <button
                    type="button"
                    onClick={() => { setRegisterStep(1); setError(''); }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      background: 'none',
                      border: 'none',
                      color: 'var(--primary-blue, #2563eb)',
                      fontSize: '0.82rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      padding: '2px 0'
                    }}
                  >
                    <ArrowLeft size={15} />
                    <span>← Edit Store & Contact Info</span>
                  </button>
                  <span style={{ fontSize: '0.74rem', color: '#059669', backgroundColor: '#ecfdf5', padding: '3px 8px', borderRadius: '12px', fontWeight: '700' }}>
                    Step 2 of 2
                  </span>
                </div>

                {/* Section 1: Tax Credentials (PAN Required, GSTIN Optional) */}
                <div style={{
                  backgroundColor: 'var(--bg-main, #f8fafc)',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-light, #e2e8f0)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '4px' }}>
                    <span style={{ fontSize: '0.84rem', fontWeight: '800', color: 'var(--primary-blue, #2563eb)' }}>
                      1. Tax Identity (PAN & GSTIN)
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#047857', backgroundColor: '#dcfce7', padding: '2px 8px', borderRadius: '10px', fontWeight: '700' }}>
                      PAN Required • GSTIN Optional
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: '12px' }}>
                    {/* PAN Card - FIRST (Required) */}
                    <div style={{ backgroundColor: '#ffffff', border: '1.5px solid #93c5fd', borderRadius: '8px', padding: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#0c3d6c' }}>
                          PAN Number <span style={{ color: '#ef4444' }}>*</span>
                        </span>
                        <span style={{ fontSize: '0.7rem', color: '#ef4444', fontWeight: '700' }}>(Required)</span>
                      </div>
                      <input 
                        type="text" 
                        name="pan" 
                        required
                        maxLength={10}
                        value={formData.pan} 
                        onChange={handleChange}
                        placeholder="e.g. ABCDE1234F"
                        style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem', fontWeight: '600' }}
                      />
                      {docFiles.pan ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.74rem', backgroundColor: '#ecfdf5', color: '#065f46', padding: '4px 8px', borderRadius: '5px', border: '1px solid #a7f3d0' }}>
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '170px', fontWeight: '600' }}>
                            ✓ {docFiles.pan.name} ({docFiles.pan.sizeStr || `${docFiles.pan.sizeKB} KB`})
                          </span>
                          <button type="button" onClick={() => handleRemoveFile('pan')} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontWeight: '800' }}>✕</button>
                        </div>
                      ) : (
                        <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', fontSize: '0.74rem', fontWeight: '700', color: '#ffffff', backgroundColor: '#0284c7', padding: '6px 8px', borderRadius: '5px', cursor: 'pointer' }}>
                          <Upload size={12} />
                          <span>Attach PAN Card Photo * (Required)</span>
                          <input type="file" accept=".pdf, .jpg, .jpeg, .png, .webp" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, 'pan')} />
                        </label>
                      )}
                    </div>

                    {/* GSTIN Card - SECOND (Optional) */}
                    <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-light, #cbd5e1)', borderRadius: '8px', padding: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-dark)' }}>GSTIN Number</span>
                        <span style={{ fontSize: '0.7rem', color: '#64748b' }}>(Optional)</span>
                      </div>
                      <input 
                        type="text" 
                        name="gstin" 
                        maxLength={15}
                        value={formData.gstin} 
                        onChange={handleChange}
                        placeholder="e.g. 24AAAAA0000A1Z"
                        style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                      />
                      {docFiles.gstin ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.74rem', backgroundColor: '#ecfdf5', color: '#065f46', padding: '4px 8px', borderRadius: '5px', border: '1px solid #a7f3d0' }}>
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '170px', fontWeight: '600' }}>
                            ✓ {docFiles.gstin.name} ({docFiles.gstin.sizeStr || `${docFiles.gstin.sizeKB} KB`})
                          </span>
                          <button type="button" onClick={() => handleRemoveFile('gstin')} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontWeight: '800' }}>✕</button>
                        </div>
                      ) : (
                        <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', fontSize: '0.74rem', fontWeight: '700', color: '#0284c7', backgroundColor: '#e0f2fe', padding: '6px 8px', borderRadius: '5px', cursor: 'pointer' }}>
                          <Upload size={12} />
                          <span>Attach GST Certificate (Optional)</span>
                          <input type="file" accept=".pdf, .jpg, .jpeg, .png, .webp" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, 'gstin')} />
                        </label>
                      )}
                    </div>
                  </div>
                </div>

                {/* Section 2: Drug Licenses (Form 20 & 21 BOTH REQUIRED) */}
                <div style={{
                  backgroundColor: 'var(--bg-main, #f8fafc)',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-light, #e2e8f0)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '4px' }}>
                    <span style={{ fontSize: '0.84rem', fontWeight: '800', color: 'var(--primary-blue, #2563eb)' }}>
                      2. Drug Licenses (Form 20 & 21)
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#b91c1c', backgroundColor: '#fee2e2', padding: '2px 8px', borderRadius: '10px', fontWeight: '800' }}>
                      Both Form 20 & Form 21 Required
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: '12px' }}>
                    {/* Drug License 1 (Form 20) - REQUIRED */}
                    <div style={{ backgroundColor: '#ffffff', border: '1.5px solid #93c5fd', borderRadius: '8px', padding: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#0c3d6c' }}>
                          Drug License 1 (Form 20) <span style={{ color: '#ef4444' }}>*</span>
                        </span>
                        <span style={{ fontSize: '0.7rem', color: '#ef4444', fontWeight: '800' }}>(Required)</span>
                      </div>
                      <input 
                        type="text" 
                        name="drugLicense1" 
                        required
                        value={formData.drugLicense1} 
                        onChange={handleChange}
                        placeholder="e.g. 20B/1234 or G/20/1234"
                        style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem', fontWeight: '600' }}
                      />
                      {docFiles.drugLicense1 ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.74rem', backgroundColor: '#ecfdf5', color: '#065f46', padding: '4px 8px', borderRadius: '5px', border: '1px solid #a7f3d0' }}>
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '170px', fontWeight: '600' }}>
                            ✓ {docFiles.drugLicense1.name} ({docFiles.drugLicense1.sizeStr || `${docFiles.drugLicense1.sizeKB} KB`})
                          </span>
                          <button type="button" onClick={() => handleRemoveFile('drugLicense1')} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontWeight: '800' }}>✕</button>
                        </div>
                      ) : (
                        <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', fontSize: '0.74rem', fontWeight: '700', color: '#ffffff', backgroundColor: '#0284c7', padding: '6px 8px', borderRadius: '5px', cursor: 'pointer' }}>
                          <Upload size={12} />
                          <span>Attach Form 20 License * (Required)</span>
                          <input type="file" accept=".pdf, .jpg, .jpeg, .png, .webp" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, 'drugLicense1')} />
                        </label>
                      )}
                    </div>

                    {/* Drug License 2 (Form 21) - REQUIRED */}
                    <div style={{ backgroundColor: '#ffffff', border: '1.5px solid #93c5fd', borderRadius: '8px', padding: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#0c3d6c' }}>
                          Drug License 2 (Form 21) <span style={{ color: '#ef4444' }}>*</span>
                        </span>
                        <span style={{ fontSize: '0.7rem', color: '#ef4444', fontWeight: '800' }}>(Required)</span>
                      </div>
                      <input 
                        type="text" 
                        name="drugLicense2" 
                        required
                        value={formData.drugLicense2} 
                        onChange={handleChange}
                        placeholder="e.g. 21B/5678 or G/21/5678"
                        style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem', fontWeight: '600' }}
                      />
                      {docFiles.drugLicense2 ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.74rem', backgroundColor: '#ecfdf5', color: '#065f46', padding: '4px 8px', borderRadius: '5px', border: '1px solid #a7f3d0' }}>
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '170px', fontWeight: '600' }}>
                            ✓ {docFiles.drugLicense2.name} ({docFiles.drugLicense2.sizeStr || `${docFiles.drugLicense2.sizeKB} KB`})
                          </span>
                          <button type="button" onClick={() => handleRemoveFile('drugLicense2')} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontWeight: '800' }}>✕</button>
                        </div>
                      ) : (
                        <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', fontSize: '0.74rem', fontWeight: '700', color: '#ffffff', backgroundColor: '#0284c7', padding: '6px 8px', borderRadius: '5px', cursor: 'pointer' }}>
                          <Upload size={12} />
                          <span>Attach Form 21 License * (Required)</span>
                          <input type="file" accept=".pdf, .jpg, .jpeg, .png, .webp" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, 'drugLicense2')} />
                        </label>
                      )}
                    </div>
                  </div>
                </div>

                {/* Document Format & Max Size Info Strip */}
                <div style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  backgroundColor: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '8px'
                }}>
                  <div style={{ fontSize: '0.78rem', color: '#166534', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600' }}>
                    <ShieldAlert size={15} style={{ color: '#16a34a', flexShrink: 0 }} />
                    <span>Max 5 MB per file • Supported: PDF, JPG, JPEG, PNG, WEBP • 256-Bit SSL Encrypted</span>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <a href="https://www.iloveimg.com/compress-image" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.74rem', color: '#0284c7', fontWeight: '700', textDecoration: 'underline' }}>Compress Image ↗</a>
                    <a href="https://www.ilovepdf.com/compress_pdf" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.74rem', color: '#0284c7', fontWeight: '700', textDecoration: 'underline' }}>Compress PDF ↗</a>
                  </div>
                </div>

                {/* Action Buttons: Back & Complete Registration */}
                <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                  <button 
                    type="button" 
                    onClick={() => { setRegisterStep(1); setError(''); }}
                    className="btn btn-outline"
                    style={{ flex: 1, padding: '11px', borderRadius: '8px', fontWeight: '700', fontSize: '0.88rem' }}
                  >
                    ← Back
                  </button>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="btn btn-primary"
                    style={{ flex: 2, padding: '11px', borderRadius: '8px', fontWeight: '700', fontSize: '0.88rem' }}
                  >
                    {loading ? 'Submitting Application...' : 'Complete Registration ✓'}
                  </button>
                </div>
              </div>
            )}

            {/* Bottom Switch back to Sign In */}
            <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.84rem', color: 'var(--text-medium)' }}>
              <span>Already have an approved account? </span>
              <button 
                type="button"
                onClick={() => { setAuthMode('login'); setError(''); setInfoMessage(''); }}
                style={{ color: 'var(--primary-blue)', fontWeight: '700', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Sign In ➔
              </button>
            </div>
          </form>
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
                  Registered Email or Phone <span className="required-star">*</span>
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
                    6-Digit Verification Code <span className="required-star">*</span>
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
                  New Password <span className="required-star">*</span>
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
                  Confirm New Password <span className="required-star">*</span>
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
        </>
        )}

      </div>
    </div>
  );
}

export default AuthModal;
