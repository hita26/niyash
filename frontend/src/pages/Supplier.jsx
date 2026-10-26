import React, { useState } from 'react';
import { Send, CheckCircle2, Factory, ShieldCheck, TrendingUp, AlertCircle } from 'lucide-react';

function Supplier() {
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
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
      const fullMessage = `Company: ${companyName.trim()}\nGSTIN: ${gstNumber.trim()}\n\nPortfolio details: ${message.trim()}`;

      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'Supplier',
          name: contactName.trim(),
          phone: cleanPhone,
          email: email.trim(),
          address: address.trim(),
          message: fullMessage,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setCompanyName('');
        setContactName('');
        setPhone('');
        setEmail('');
        setGstNumber('');
        setAddress('');
        setMessage('');
        setTimeout(() => setIsSuccess(false), 6000);
      } else {
        setErrorMessage(data.message || 'Failed to submit supplier details.');
      }
    } catch (error) {
      console.error('Error submitting supplier form:', error);
      setErrorMessage('Network connection error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="section animate-fade-in" style={{ backgroundColor: 'var(--bg-main)' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '40px', alignItems: 'center' }}>
        
        {/* Info Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          <div>
            <span style={{
              backgroundColor: 'rgba(27, 117, 188, 0.1)', color: 'var(--accent-blue)',
              padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '700',
              textTransform: 'uppercase', display: 'inline-block', marginBottom: '15px'
            }}>
              Manufacturer & Importer Channel
            </span>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '20px', lineHeight: '1.2' }}>Become a Supplier</h1>
            <p style={{ color: 'var(--text-medium)', fontSize: '1.05rem', lineHeight: '1.6' }}>
              Are you a pharmaceutical manufacturer, wellness product importer, or brand owner? Expand your reach in Gujarat. Partner with Niyansh Pharma to supply your high-quality products to our extensive network of pharmacies, clinics, and hospitals.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
              <div style={{ backgroundColor: '#ffffff', padding: '10px', borderRadius: '50%', color: 'var(--accent-blue)', display: 'flex', boxShadow: 'var(--card-shadow)' }}>
                <TrendingUp size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>Market Expansion</h3>
                <p style={{ color: 'var(--text-medium)', fontSize: '0.9rem' }}>Instant distribution leverage across Rajkot and neighboring districts in Gujarat.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
              <div style={{ backgroundColor: '#ffffff', padding: '10px', borderRadius: '50%', color: 'var(--accent-blue)', display: 'flex', boxShadow: 'var(--card-shadow)' }}>
                <Factory size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>Bulk Procurement</h3>
                <p style={{ color: 'var(--text-medium)', fontSize: '0.9rem' }}>We purchase in bulk volumes with organized logistical handling and storage standards.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
              <div style={{ backgroundColor: '#ffffff', padding: '10px', borderRadius: '50%', color: 'var(--accent-blue)', display: 'flex', boxShadow: 'var(--card-shadow)' }}>
                <ShieldCheck size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>Ethical Business Terms</h3>
                <p style={{ color: 'var(--text-medium)', fontSize: '0.9rem' }}>Timely payments, clear transactions, and long-term business partnerships.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Column */}
        <div className="card" style={{ padding: '30px' }}>
          <h2 style={{ fontSize: '1.4rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Factory size={22} color="var(--primary-blue)" /> Supplier Registration Form
          </h2>

          {isSuccess ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '15px', textAlign: 'center', padding: '40px 0' }}>
              <CheckCircle2 size={54} color="var(--secondary-green)" />
              <h3 style={{ color: 'var(--secondary-green)' }}>Details Submitted!</h3>
              <p style={{ color: 'var(--text-medium)', fontSize: '0.95rem' }}>
                Thank you for reaching out. Our business development team will review your product catalog and contact you for trade terms.
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
                  <label htmlFor="supplier-company" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-medium)' }}>Company / Entity Name *</label>
                  <input 
                    id="supplier-company"
                    type="text" 
                    required 
                    placeholder="E.g., Sunrise Pharma Labs"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label htmlFor="supplier-contact" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-medium)' }}>Contact Person Name *</label>
                  <input 
                    id="supplier-contact"
                    type="text" 
                    required 
                    placeholder="Enter full name"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label htmlFor="supplier-phone" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-medium)' }}>Mobile Number *</label>
                  <input 
                    id="supplier-phone"
                    type="tel" 
                    required 
                    placeholder="Enter contact number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label htmlFor="supplier-email" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-medium)' }}>Business Email *</label>
                  <input 
                    id="supplier-email"
                    type="email" 
                    required
                    placeholder="sales@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value.toLowerCase())}
                    style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label htmlFor="supplier-gst" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-medium)' }}>GSTIN (GST Number) *</label>
                  <input 
                    id="supplier-gst"
                    type="text" 
                    required
                    placeholder="Enter GSTIN number"
                    value={gstNumber}
                    onChange={(e) => setGstNumber(e.target.value)}
                    style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label htmlFor="supplier-address" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-medium)' }}>Company Address *</label>
                <input 
                  id="supplier-address"
                  type="text" 
                  required 
                  placeholder="Factory/Office Address, State, Pincode"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label htmlFor="supplier-msg" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-medium)' }}>Product Portfolio & Details *</label>
                <textarea 
                  id="supplier-msg"
                  required
                  rows="4" 
                  placeholder="Mention product categories (e.g., Generic medicines, Ayurvedic, Surgical items) and certifications (WHO-GMP, ISO)..."
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
                {isSubmitting ? 'Submitting details...' : 'Submit Supplier Details'}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}

export default Supplier;
