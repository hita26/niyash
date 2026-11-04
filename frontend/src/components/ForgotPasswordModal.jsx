import React, { useState } from 'react';
import { ArrowLeft, X, ShieldAlert, KeyRound, Mail, MessageCircle, Loader2, CheckCircle2 } from 'lucide-react';

/**
 * Responsive, modern Forgot Password Modal Component
 * Styled with Tailwind CSS & Lucide Icons
 */
export default function ForgotPasswordModal({
  isOpen = true,
  onClose,
  onBackToLogin,
  onCodeSent,
  supportPhone = '9316566894',
}) {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Sample registered accounts for validation simulation (or connects to API)
  const registeredSampleRecords = [
    'shihorahita863@gmail.com',
    '8668139528',
    'admin@niyanshpharma.com',
    '9316566894',
    'retailer@gmail.com',
  ];

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanInput = emailOrPhone.trim().toLowerCase();

    if (!cleanInput) {
      setError('Please provide your registered email address or mobile number.');
      return;
    }
    if (!cleanInput.includes('@')) {
      const numericOnly = cleanInput.replace(/\D/g, '');
      if (numericOnly.length !== 10) {
        setError('Phone number must contain exactly 10 numeric digits.');
        return;
      }
    }

    setError('');
    setIsLoading(true);

    try {
      // 1. First attempt to call the real backend endpoint if available
      let responseSuccess = false;
      let responseData = null;

      try {
        const res = await fetch('/api/users/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: cleanInput }),
        });
        responseData = await res.json();
        if (res.ok && responseData.success) {
          responseSuccess = true;
        }
      } catch {
        // Fallback to local simulation if offline or standalone demo
      }

      // 2. Local verification simulation if not connected to server
      if (!responseSuccess) {
        // Check if matches sample records or matches typical email/phone formats
        const isMatched = registeredSampleRecords.some(
          (rec) => rec.toLowerCase() === cleanInput || cleanInput.replace(/[^0-9]/g, '') === rec
        );

        if (!isMatched && !cleanInput.includes('@example.com')) {
          setError(
            'No registered Chemist account found with this email or phone. Please verify your details or register a new store.'
          );
          setIsLoading(false);
          return;
        }
      }

      // 3. Success state
      setIsSuccess(true);
      if (onCodeSent) {
        onCodeSent(cleanInput, responseData?.otp);
      }
    } catch {
      setError(
        'No registered Chemist account found with this email or phone. Please verify your details or register a new store.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && onClose) {
      onClose();
    }
  };

  const whatsappUrl = `https://wa.me/91${supportPhone}?text=${encodeURIComponent(
    `Hello Niyansh Pharma Support, I need assistance resetting the password for account: ${emailOrPhone || ''}`
  )}`;

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Forgot Password Modal"
        className="relative w-full max-w-md bg-white rounded-2xl sm:rounded-3xl border border-slate-100 shadow-2xl p-6 sm:p-8 overflow-hidden transition-all"
      >
        {/* Header & Navigation */}
        <div className="flex items-center justify-between mb-5">
          <button
            type="button"
            onClick={onBackToLogin || onClose}
            className="group inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-blue-600 transition duration-150"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span>Back to Log In</span>
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition duration-150"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Error Alert Banner (Conditional/State-based) */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 flex items-start gap-3 mb-5 animate-fade-in">
            <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-red-700 leading-snug">{error}</p>
          </div>
        )}

        {/* Success Confirmation State */}
        {isSuccess ? (
          <div className="text-center py-4 animate-fade-in">
            <div className="mx-auto w-14 h-14 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-4">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Code Generated</h3>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">
              We have generated a 6-digit verification code for{' '}
              <span className="font-semibold text-slate-800">{emailOrPhone}</span>.
            </p>
            <button
              type="button"
              onClick={() => {
                setIsSuccess(false);
                if (onBackToLogin) onBackToLogin();
              }}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3.5 rounded-xl transition duration-150 shadow-sm"
            >
              Continue to Login
            </button>
          </div>
        ) : (
          <>
            {/* Visual Icon & Titles */}
            <div className="text-center">
              <div className="mx-auto w-14 h-14 bg-blue-50 border border-blue-100 rounded-full flex items-center justify-center">
                <KeyRound className="w-7 h-7 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight text-center mt-4">
                Forgot Password?
              </h2>
              <p className="text-sm text-slate-500 text-center mt-2 leading-relaxed">
                Enter your registered wholesale email address or mobile number. We will generate a
                6-digit verification code to reset your password.
              </p>
            </div>

            {/* Form Elements */}
            <form onSubmit={handleSubmit} className="space-y-4 mt-6">
              <div>
                <label
                  htmlFor="forgot-email-phone"
                  className="block text-sm font-semibold text-slate-800 mb-1.5"
                >
                  Registered Email or Phone *
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="forgot-email-phone"
                    type="text"
                    required
                    value={emailOrPhone}
                    onChange={(e) => {
                      setEmailOrPhone(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="Enter email or 10-digit mobile number"
                    className="w-full border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 rounded-xl py-3 px-3.5 pl-10 text-slate-800 placeholder:text-slate-400 text-sm transition outline-none"
                  />
                </div>
              </div>

              {/* Primary Action Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-400 text-white font-semibold py-3.5 rounded-xl transition duration-150 shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending Code...</span>
                  </>
                ) : (
                  <span>Send Verification Code</span>
                )}
              </button>
            </form>

            {/* Support Card (Footer) */}
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 flex items-center justify-between mt-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5 text-[#25D366]" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 leading-tight">Need urgent help?</p>
                  <p className="text-sm font-bold text-slate-800 leading-tight mt-0.5">
                    Wholesale Desk Support
                  </p>
                </div>
              </div>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs font-semibold px-3 py-1.5 rounded-lg transition inline-flex items-center"
              >
                WhatsApp Desk
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
