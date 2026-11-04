import React, { useState } from 'react';
import { Send, CheckCircle2, Factory, ShieldCheck, TrendingUp, AlertCircle, Upload, FileSpreadsheet, FileText, X, Check } from 'lucide-react';

function Supplier() {
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [designation, setDesignation] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [address, setAddress] = useState('');
  const [message, setMessage] = useState('');
  
  // Product Portfolio Upload State
  const [portfolioFile, setPortfolioFile] = useState(null);
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handlePortfolioUpload = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    // Check size limit: 10MB for product portfolio catalogs/spreadsheets
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage(`File "${file.name}" exceeds 10MB limit.`);
      return;
    }

    setErrorMessage('');
    const sizeKB = Math.round(file.size / 1024);
    const sizeDisplay = sizeKB > 1024 ? `${(sizeKB / 1024).toFixed(1)} MB` : `${sizeKB} KB`;

    // Local instant preview / fallback
    const reader = new FileReader();
    reader.onload = (loadEvt) => {
      setPortfolioFile({ name: file.name, sizeDisplay, url: loadEvt.target.result });
      setPortfolioUrl(loadEvt.target.result);
    };
    reader.readAsDataURL(file);

    // Upload to server endpoint
    setIsUploadingFile(true);
    try {
      const uploadData = new FormData();
      uploadData.append('file', file);
      const res = await fetch('/api/users/upload-doc', {
        method: 'POST',
        body: uploadData,
      });
      const result = await res.json();
      if (res.ok && result.url) {
        setPortfolioUrl(result.url);
        setPortfolioFile({ name: file.name, sizeDisplay, url: result.url });
      }
    } catch (err) {
      console.warn('Fallback to local file data for portfolio:', err);
    } finally {
      setIsUploadingFile(false);
    }
  };

  const handleRemovePortfolio = () => {
    setPortfolioFile(null);
    setPortfolioUrl('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setErrorMessage('Phone number must contain exactly 10 numeric digits.');
      return;
    }

    if (!designation || !designation.trim()) {
      setErrorMessage('Please enter your Designation.');
      return;
    }

    if (!portfolioFile && !portfolioUrl) {
      setErrorMessage('Please upload your Product Portfolio file (JPG, PNG, Excel or PDF).');
      return;
    }

    setIsSubmitting(true);

    try {
      const fullMessage = `Company: ${companyName.trim()}\nContact Person: ${contactName.trim()}\nDesignation: ${designation.trim()}\nGSTIN: ${gstNumber.trim()}\nPortfolio File: ${portfolioFile?.name || 'Uploaded'}\nPortfolio Link: ${portfolioUrl || 'Attached'}\n\nPortfolio details: ${message.trim()}`;

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
          designation: designation.trim(),
          attachment: portfolioUrl || '',
          message: fullMessage,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setCompanyName('');
        setContactName('');
        setDesignation('');
        setPhone('');
        setEmail('');
        setGstNumber('');
        setAddress('');
        setMessage('');
        setPortfolioFile(null);
        setPortfolioUrl('');
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
                <p style={{ color: 'var(--text-medium)', fontSize: '0.9rem' }}>Instant distribution leverage across Rajkot, Saurashtra, and neighboring districts in Gujarat.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
              <div style={{ backgroundColor: '#ffffff', padding: '10px', borderRadius: '50%', color: 'var(--accent-blue)', display: 'flex', boxShadow: 'var(--card-shadow)' }}>
                <Factory size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>Bulk Procurement</h3>
                <p style={{ color: 'var(--text-medium)', fontSize: '0.9rem' }}>We purchase in bulk volumes with organized logistical handling, batch verification, and WHO-GMP compliant storage standards.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
              <div style={{ backgroundColor: '#ffffff', padding: '10px', borderRadius: '50%', color: 'var(--accent-blue)', display: 'flex', boxShadow: 'var(--card-shadow)' }}>
                <ShieldCheck size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>Ethical Business Terms</h3>
                <p style={{ color: 'var(--text-medium)', fontSize: '0.9rem' }}>Prompt payments, transparent billing reconciliation, and reliable long-term manufacturer partnerships.</p>
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
                Thank you for reaching out. Our business development team will review your product portfolio and contact you for trade terms.
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
              
              {/* Row 1: Company Name & Contact Person */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label htmlFor="supplier-company" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-medium)' }}>
                    Company / Entity Name *
                  </label>
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
                  <label htmlFor="supplier-contact" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-medium)' }}>
                    Contact Person Name *
                  </label>
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

              {/* Row 2: Designation & Mobile Number */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label htmlFor="supplier-designation" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-medium)' }}>
                    Designation *
                  </label>
                  <input 
                    id="supplier-designation"
                    type="text" 
                    required 
                    placeholder="E.g., Sales Director, Managing Director, National Head"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label htmlFor="supplier-phone" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-medium)' }}>
                    Mobile Number *
                  </label>
                  <input 
                    id="supplier-phone"
                    type="tel" 
                    required 
                    maxLength={10}
                    placeholder="10-digit mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              {/* Row 3: Business Email & GSTIN */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label htmlFor="supplier-email" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-medium)' }}>
                    Business Email *
                  </label>
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label htmlFor="supplier-gst" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-medium)' }}>
                    GSTIN (GST Number) *
                  </label>
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

              {/* Row 4: Company Address */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label htmlFor="supplier-address" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-medium)' }}>
                  Company / Factory Address *
                </label>
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

              {/* Row 5: Product Portfolio Upload (JPG, PNG, Excel, PDF) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label htmlFor="supplier-portfolio-upload" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-medium)' }}>
                    Product Portfolio Upload (JPG, PNG, Excel, PDF) *
                  </label>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Max 10 MB</span>
                </div>
                
                <div style={{
                  border: '1.5px dashed #cbd5e1',
                  borderRadius: '8px',
                  padding: '14px',
                  backgroundColor: 'var(--bg-main, #f8fafc)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  textAlign: 'center'
                }}>
                  {portfolioFile ? (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      padding: '8px 12px',
                      backgroundColor: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid #a7f3d0',
                      borderRadius: '6px',
                      color: '#065f46',
                      fontSize: '0.85rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                        <FileSpreadsheet size={18} style={{ flexShrink: 0, color: '#059669' }} />
                        <span style={{ fontWeight: '700', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          ✓ {portfolioFile.name}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#047857' }}>({portfolioFile.sizeDisplay})</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemovePortfolio}
                        style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontWeight: '700', padding: '2px 6px' }}
                        title="Remove file"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-blue)' }}>
                        <Upload size={20} />
                        <span style={{ fontSize: '0.88rem', fontWeight: '700' }}>
                          {isUploadingFile ? 'Uploading file...' : 'Choose Product Portfolio File'}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-medium)', margin: 0 }}>
                        Supported formats: JPG, PNG image, Excel (.xlsx, .xls, .csv), or PDF price list
                      </p>
                      <label style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        backgroundColor: '#0c3d6c',
                        color: '#ffffff',
                        padding: '6px 14px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.82rem',
                        fontWeight: '700',
                        marginTop: '4px'
                      }}>
                        <Upload size={14} />
                        <span>Select File</span>
                        <input
                          id="supplier-portfolio-upload"
                          type="file"
                          accept="image/png, image/jpeg, image/jpg, .pdf, .xls, .xlsx, .csv, application/pdf, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, text/csv"
                          style={{ display: 'none' }}
                          onChange={handlePortfolioUpload}
                        />
                      </label>
                    </>
                  )}
                </div>
              </div>

              {/* Row 6: Product Portfolio Details / Notes */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label htmlFor="supplier-msg" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-medium)' }}>
                  Product Portfolio & Certifications Details *
                </label>
                <textarea 
                  id="supplier-msg"
                  required
                  rows="3" 
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
