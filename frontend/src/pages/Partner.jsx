import React, { useState } from 'react';
import { Send, CheckCircle2, ShieldCheck, Award, Handshake, AlertCircle } from 'lucide-react';

function Partner() {
  const [storeName, setStoreName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [drugLicense, setDrugLicense] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [address, setAddress] = useState('');
  const [message, setMessage] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsSubmitting(true);

    try {
      const fullMessage = `Store/Hospital Name: ${storeName.trim()}\nDrug License: ${drugLicense.trim()}\nGSTIN: ${gstNumber.trim()}\n\nMessage: ${message.trim()}`;

      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'Partner',
          name: ownerName.trim(),
          phone: cleanPhone,
          email: email.trim(),
          address: address.trim(),
          message: fullMessage,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setStoreName('');
        setOwnerName('');
        setPhone('');
        setEmail('');
        setDrugLicense('');
        setGstNumber('');
        setAddress('');
        setMessage('');
        setTimeout(() => setIsSuccess(false), 6000);
      } else {
        setErrorMessage(data.message || 'Failed to submit registration request.');
      }
    } catch (error) {
      console.error('Error submitting partner form:', error);
      setErrorMessage('Network connection error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="section animate-fade-in" style={{ backgroundColor: 'var(--bg-main)' }}>
      <div className="container responsive-split-layout">
        
        {/* Info Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          <div>
            <span style={{
              backgroundColor: 'rgba(56, 142, 60, 0.1)', color: 'var(--secondary-green)',
              padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '700',
              textTransform: 'uppercase', display: 'inline-block', marginBottom: '15px'
            }}>
              Retailer & Hospital Partnership
            </span>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '20px', lineHeight: '1.2' }}>Partner With Niyansh Pharma</h1>
            <p style={{ color: 'var(--text-medium)', fontSize: '1.05rem', lineHeight: '1.6' }}>
              Are you a medical store owner, hospital procurement manager, or private clinic administrator? Partner with Niyansh Pharma to secure reliable, bulk supplies of genuine medicines and surgical items at highly competitive wholesale rates.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
              <div style={{ backgroundColor: '#ffffff', padding: '10px', borderRadius: '50%', color: 'var(--secondary-green)', display: 'flex', boxShadow: 'var(--card-shadow)' }}>
                <Award size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>Reputed Brands</h3>
                <p style={{ color: 'var(--text-medium)', fontSize: '0.9rem' }}>Direct access to product portfolios of Cipla, Abbott, Sun Pharma, and 20+ top brands.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
              <div style={{ backgroundColor: '#ffffff', padding: '10px', borderRadius: '50%', color: 'var(--secondary-green)', display: 'flex', boxShadow: 'var(--card-shadow)' }}>
                <ShieldCheck size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>Compliance Assured</h3>
                <p style={{ color: 'var(--text-medium)', fontSize: '0.9rem' }}>All deliveries are backed by proper tax invoices and verified drug licenses.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
              <div style={{ backgroundColor: '#ffffff', padding: '10px', borderRadius: '50%', color: 'var(--secondary-green)', display: 'flex', boxShadow: 'var(--card-shadow)' }}>
                <Handshake size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>Dedicated Account Manager</h3>
                <p style={{ color: 'var(--text-medium)', fontSize: '0.9rem' }}>Get personalized order support and credit terms based on transaction volumes.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Column */}
        <div className="card sticky-form-desktop" style={{ padding: '30px', position: 'sticky', top: '100px' }}>
          <h2 style={{ fontSize: '1.4rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Handshake size={22} color="var(--primary-blue)" /> Business Registration Form
          </h2>

          {isSuccess ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '15px', textAlign: 'center', padding: '40px 0' }}>
              <CheckCircle2 size={54} color="var(--secondary-green)" />
              <h3 style={{ color: 'var(--secondary-green)' }}>Application Received!</h3>
              <p style={{ color: 'var(--text-medium)', fontSize: '0.95rem' }}>
                Thank you for choosing Niyansh Pharma. Our sales head will verify your license details and contact you to establish your wholesale account.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {errorMessage && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', color: '#b91c1c', fontSize: '0.88rem' }} role="alert">
                  <AlertCircle size={16} style={{ flexShrink: 0 }} aria-hidden="true" />
                  <span>{errorMessage}</span>
                </div>
              )}
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label htmlFor="partner-store" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-medium)' }}>Medical Store / Hospital Name *</label>
                  <input 
                    id="partner-store"
                    type="text" 
                    required 
                    placeholder="E.g., Care Pharmacy"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label htmlFor="partner-owner" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-medium)' }}>Owner / Purchaser Name *</label>
                  <input 
                    id="partner-owner"
                    type="text" 
                    required 
                    placeholder="Enter full name"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label htmlFor="partner-phone" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-medium)' }}>Mobile Number *</label>
                  <input 
                    id="partner-phone"
                    type="tel" 
                    required 
                    placeholder="99099 XXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label htmlFor="partner-email" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-medium)' }}>Email Address</label>
                  <input 
                    id="partner-email"
                    type="email" 
                    placeholder="store@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value.toLowerCase())}
                    style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label htmlFor="partner-license" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-medium)' }}>Drug License Number (20B/21B) *</label>
                  <input 
                    id="partner-license"
                    type="text" 
                    required 
                    placeholder="E.g., GJ-RAJ-XXXXXX"
                    value={drugLicense}
                    onChange={(e) => setDrugLicense(e.target.value)}
                    style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label htmlFor="partner-gst" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-medium)' }}>GSTIN (GST Number)</label>
                  <input 
                    id="partner-gst"
                    type="text" 
                    placeholder="24XXXXXXXXXXXXX"
                    value={gstNumber}
                    onChange={(e) => setGstNumber(e.target.value)}
                    style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label htmlFor="partner-address" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-medium)' }}>Shop Address *</label>
                <input 
                  id="partner-address"
                  type="text" 
                  required 
                  placeholder="Address, City, Pincode"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label htmlFor="partner-msg" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-medium)' }}>Message / Query Details</label>
                <textarea 
                  id="partner-msg"
                  rows="3" 
                  placeholder="List specific brands or medicine categories you are interested in..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem', resize: 'vertical' }}
                />
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="btn btn-primary" 
                style={{ width: '100%', height: '45px', gap: '10px', marginTop: '10px' }}
              >
                <Send size={16} />
                {isSubmitting ? 'Submitting Form...' : 'Submit Partnership Query'}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}

export default Partner;
