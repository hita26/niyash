import React, { useState } from 'react';
import { Send, CheckCircle2, Factory, ShieldCheck, TrendingUp, AlertCircle, Upload, FileSpreadsheet, FileText, X, Check, Mail, Clock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

function Supplier() {
  const { t, language } = useLanguage();
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
      setErrorMessage(
        language === 'gu'
          ? `ફાઇલ "${file.name}" 10MB ની મર્યાદા કરતાં મોટી છે.`
          : language === 'hi'
          ? `फ़ाइल "${file.name}" 10MB की सीमा से अधिक है।`
          : `File "${file.name}" exceeds 10MB limit.`
      );
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
      setErrorMessage(
        language === 'gu'
          ? 'મોબાઈલ નંબર બરાબર ૧૦ આંકડાનો હોવો આવશ્યક છે.'
          : language === 'hi'
          ? 'मोबाइल नंबर ठीक १० अंकों का होना चाहिए।'
          : 'Phone number must contain exactly 10 numeric digits.'
      );
      return;
    }

    if (!designation || !designation.trim()) {
      setErrorMessage(
        language === 'gu'
          ? 'કૃપા કરીને આપનો હોદ્દો દાખલ કરો.'
          : language === 'hi'
          ? 'कृपया अपना पद दर्ज करें।'
          : 'Please enter your Designation.'
      );
      return;
    }

    if (!portfolioFile && !portfolioUrl) {
      setErrorMessage(
        language === 'gu'
          ? 'કૃપા કરીને પ્રોડક્ટ કેટલોગ ફાઇલ (JPG, PNG, Excel કે PDF) અપલોડ કરો.'
          : language === 'hi'
          ? 'कृपया उत्पाद कैटलॉग फ़ाइल (JPG, PNG, Excel या PDF) अपलोड करें।'
          : 'Please upload your Product Portfolio file (JPG, PNG, Excel or PDF).'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const fullMessage = `COMPANY: ${companyName.trim().toUpperCase()}\nCONTACT PERSON: ${contactName.trim().toUpperCase()}\nDESIGNATION: ${designation.trim().toUpperCase()}\nGSTIN: ${gstNumber.trim().toUpperCase()}\nPORTFOLIO FILE: ${(portfolioFile?.name || 'UPLOADED').toUpperCase()}\nPORTFOLIO LINK: ${portfolioUrl || 'ATTACHED'}\n\nPORTFOLIO DETAILS: ${message.trim().toUpperCase()}`;

      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'Supplier',
          name: contactName.trim().toUpperCase(),
          phone: cleanPhone,
          email: email.trim().toLowerCase(),
          address: address.trim().toUpperCase(),
          designation: designation.trim().toUpperCase(),
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
        setErrorMessage(data.message || t('common.error', 'Failed to submit supplier details.'));
      }
    } catch (error) {
      console.error('Error submitting supplier form:', error);
      setErrorMessage(
        language === 'gu'
          ? 'નેટવર્ક કનેક્શન એરર. કૃપા કરીને ફરી પ્રયાસ કરો.'
          : language === 'hi'
          ? 'नेटवर्क कनेक्शन त्रुटि। कृपया पुनः प्रयास करें।'
          : 'Network connection error. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="section animate-fade-in" style={{ backgroundColor: 'var(--bg-main)' }}>
      <div className="container responsive-split-layout" style={{ alignItems: 'start' }}>
        
        {/* Info Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', minWidth: 0 }}>
          <div>
            <span style={{
              backgroundColor: 'rgba(27, 117, 188, 0.1)', color: 'var(--accent-blue)',
              padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '700',
              textTransform: 'uppercase', display: 'inline-block', marginBottom: '15px'
            }}>
              {t('supplier.badge', 'Pharmaceutical Manufacturer Onboarding')}
            </span>
            <h1 style={{ fontSize: 'clamp(1.6rem, 4.5vw, 2.5rem)', marginBottom: '20px', lineHeight: '1.2' }}>
              {t('supplier.title', 'Supply Your Formulations to Niyansh Pharma')}
            </h1>
            <p style={{ color: 'var(--text-medium)', fontSize: '1.05rem', lineHeight: '1.6' }}>
              {t('supplier.subtitle', 'Expand your pharmaceutical reach across 1,200+ licensed chemists, clinics, and hospitals in Saurashtra and Gujarat. We invite certified manufacturers to supply quality medicines through our established distribution network.')}
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
              <div style={{ backgroundColor: '#ffffff', padding: '10px', borderRadius: '50%', color: 'var(--accent-blue)', display: 'flex', boxShadow: 'var(--card-shadow)' }}>
                <TrendingUp size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>
                  {t('supplier.benefit1Title', 'PAN Saurashtra Reach')}
                </h3>
                <p style={{ color: 'var(--text-medium)', fontSize: '0.9rem' }}>
                  {t('supplier.benefit1Desc', 'Instant access to a mature network of independent chemists and hospital procurement desks.')}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
              <div style={{ backgroundColor: '#ffffff', padding: '10px', borderRadius: '50%', color: 'var(--accent-blue)', display: 'flex', boxShadow: 'var(--card-shadow)' }}>
                <Factory size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>
                  {t('supplier.benefit2Title', 'Timely Settlement Cycles')}
                </h3>
                <p style={{ color: 'var(--text-medium)', fontSize: '0.9rem' }}>
                  {t('supplier.benefit2Desc', 'Transparent billing and reliable payment reconciliation compliant with agreed payment schedules.')}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
              <div style={{ backgroundColor: '#ffffff', padding: '10px', borderRadius: '50%', color: 'var(--accent-blue)', display: 'flex', boxShadow: 'var(--card-shadow)' }}>
                <ShieldCheck size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>
                  {t('supplier.benefit3Title', 'Validated Warehousing')}
                </h3>
                <p style={{ color: 'var(--text-medium)', fontSize: '0.9rem' }}>
                  {t('supplier.benefit3Desc', 'WHO-GDP compliant storage facilities with strictly controlled temperature and humidity parameters.')}
                </p>
              </div>
            </div>
          </div>

          {/* Direct Supplier Sales Desk */}
          <div className="card card-hover-pharma" style={{ marginTop: '25px', padding: '22px', display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-light)' }}>
            <div style={{ backgroundColor: 'rgba(12, 61, 108, 0.08)', padding: '12px', borderRadius: '12px', color: 'var(--primary-blue)', display: 'flex', flexShrink: 0 }}>
              <Mail size={24} />
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: '800', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {language === 'gu' ? 'સત્તાવાર પ્રોક્યોરમેન્ટ ડેસ્ક' : language === 'hi' ? 'आधिकारिक खरीद डेस्क' : 'Official Procurement Desk'}
              </div>
              <div style={{ fontSize: '1.08rem', fontWeight: '700', marginTop: '3px' }}>
                <a href="mailto:info@niyanshpharma.com" style={{ color: 'var(--primary-blue)', textDecoration: 'none' }}>
                  info@niyanshpharma.com
                </a>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-medium)', marginTop: '3px' }}>
                {language === 'gu' ? 'પ્રોડક્ટ પોર્ટફોલિયો અને સપ્લાય ઓફર સીધા ઇમેઇલ કરવા માટે.' : language === 'hi' ? 'उत्पाद पोर्टफोलियो और आपूर्ति प्रस्ताव सीधे ईमेल करने के लिए।' : 'Direct inquiries and product rate sheets from pharma manufacturers.'}
              </div>
            </div>
          </div>

          {/* Operating Hours Card */}
          <div className="card" style={{ marginTop: '16px', padding: '18px 22px', display: 'flex', alignItems: 'flex-start', gap: '14px', backgroundColor: 'rgba(12, 61, 108, 0.03)', border: '1px solid var(--border-light)' }}>
            <div style={{ backgroundColor: 'rgba(12, 61, 108, 0.08)', padding: '10px', borderRadius: '10px', color: 'var(--primary-blue)', display: 'flex', flexShrink: 0 }}>
              <Clock size={20} />
            </div>
            <div style={{ fontSize: '0.86rem', lineHeight: '1.5' }}>
              <div style={{ fontWeight: '700', color: 'var(--text-dark)', marginBottom: '3px' }}>
                {language === 'gu' ? 'કામકાજના કલાકો (સોમ - શનિ)' : language === 'hi' ? 'कार्य समय (सोम - शनि)' : 'Office Hours (Mon – Sat)'}: <span style={{ color: 'var(--primary-blue)' }}>9:00 AM – 9:00 PM</span>
              </div>
              <div style={{ color: 'var(--text-medium)', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <span><strong>{language === 'gu' ? 'લંચ બ્રેક' : language === 'hi' ? 'लंच ब्रेक' : 'Lunch Break'}:</strong> 2:00 PM – 4:00 PM</span>
                <span style={{ color: '#b91c1c', fontWeight: '600' }}>• {language === 'gu' ? 'રવિવાર: રજા' : language === 'hi' ? 'रविवार: अवकाश' : 'Sunday: Holiday'}</span>
              </div>
            </div>
          </div>


        </div>

        {/* Form Column */}
        <div className="card" style={{ padding: '30px' }}>
          <h2 style={{ fontSize: '1.4rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Factory size={22} color="var(--primary-blue)" /> {t('supplier.formTitle', 'Manufacturer Onboarding Form')}
          </h2>

          {isSuccess ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '15px', textAlign: 'center', padding: '40px 0' }}>
              <CheckCircle2 size={54} color="var(--secondary-green)" />
              <h3 style={{ color: 'var(--secondary-green)' }}>{t('common.success', 'Details Submitted!')}</h3>
              <p style={{ color: 'var(--text-medium)', fontSize: '0.95rem' }}>
                {t('supplier.successNotice', 'Supplier registration received. Our procurement team will review your portfolio and initiate onboarding.')}
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
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '15px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label htmlFor="supplier-company" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-medium)' }}>
                    {t('supplier.companyLabel', 'Manufacturing / Pharmaceutical Firm')} <span className="required-star">*</span>
                  </label>
                  <input 
                    id="supplier-company"
                    type="text" 
                    required 
                    placeholder={language === 'gu' ? 'દા.ત. સનરાઇઝ ફાર્મા લેબ્સ' : language === 'hi' ? 'उदा. सनराइज फार्मा लैब्स' : 'E.g., Sunrise Pharma Labs'}
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label htmlFor="supplier-contact" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-medium)' }}>
                    {t('supplier.contactLabel', 'Contact Person Name')} <span className="required-star">*</span>
                  </label>
                  <input 
                    id="supplier-contact"
                    type="text" 
                    required 
                    placeholder={language === 'gu' ? 'પૂરું નામ દાખલ કરો' : language === 'hi' ? 'पूरा नाम दर्ज करें' : 'Enter full name'}
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              {/* Row 2: Designation & Mobile Number */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '15px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label htmlFor="supplier-designation" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-medium)' }}>
                    {t('supplier.designationLabel', 'Designation')} <span className="required-star">*</span>
                  </label>
                  <input 
                    id="supplier-designation"
                    type="text" 
                    required 
                    placeholder={language === 'gu' ? 'સેલ્સ ડિરેક્ટર, મેનેજિંગ ડિરેક્ટર' : language === 'hi' ? 'सेल्स डायरेक्टर, प्रबंध निदेशक' : 'E.g., Sales Director, Managing Director'}
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label htmlFor="supplier-phone" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-medium)' }}>
                    {t('partner.phoneLabel', '10-Digit Mobile Number')} <span className="required-star">*</span>
                  </label>
                  <input 
                    id="supplier-phone"
                    type="tel" 
                    required 
                    maxLength={10}
                    placeholder={language === 'gu' ? '૧૦ આંકડાનો મોબાઈલ નંબર' : language === 'hi' ? '१० अंकों का मोबाइल नंबर' : '10-digit mobile number'}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              {/* Row 3: Business Email & GSTIN */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '15px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label htmlFor="supplier-email" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-medium)' }}>
                    {t('cart.email', 'Business Email')} <span className="required-star">*</span>
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
                    {t('supplier.gstLabel', 'GSTIN Number')} <span className="required-star">*</span>
                  </label>
                  <input 
                    id="supplier-gst"
                    type="text" 
                    required
                    placeholder={language === 'gu' ? 'જીએસટી નંબર દાખલ કરો' : language === 'hi' ? 'जीएसटी नंबर दर्ज करें' : 'Enter GSTIN number'}
                    value={gstNumber}
                    onChange={(e) => setGstNumber(e.target.value)}
                    style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              {/* Row 4: Company Address */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label htmlFor="supplier-address" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-medium)' }}>
                  {t('supplier.addressLabel', 'Plant / Corporate Address')} <span className="required-star">*</span>
                </label>
                <input 
                  id="supplier-address"
                  type="text" 
                  required 
                  placeholder={language === 'gu' ? 'ફેક્ટરી/ઓફિસ સરનામું, રાજ્ય, પીનકોડ' : language === 'hi' ? 'फैक्ट्री/कार्यालय पता, राज्य, पिनकोड' : 'Factory/Office Address, State, Pincode'}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                />
              </div>

              {/* Row 5: Product Portfolio Upload (JPG, PNG, Excel, PDF) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label htmlFor="supplier-portfolio-upload" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-medium)' }}>
                    {t('supplier.uploadPortfolio', 'Product Catalog / Price List (Excel, PDF or JPG)')} <span className="required-star">*</span>
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
                          {isUploadingFile ? t('common.loading', 'Uploading file...') : t('supplier.dragOrClick', 'Click to browse or drag file here (Max 10MB)')}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-medium)', margin: 0 }}>
                        {language === 'gu' ? 'સમર્થિત ફોર્મેટ: JPG, PNG, Excel (.xlsx, .xls) અથવા PDF' : language === 'hi' ? 'समर्थित प्रारूप: JPG, PNG, Excel (.xlsx, .xls) या PDF' : 'Supported formats: JPG, PNG image, Excel (.xlsx, .xls, .csv), or PDF price list'}
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
                        <span>{language === 'gu' ? 'ફાઇલ પસંદ કરો' : language === 'hi' ? 'फ़ाइल चुनें' : 'Select File'}</span>
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
                  {t('supplier.notesLabel', 'Formulation Portfolio Details / Message')} <span className="required-star">*</span>
                </label>
                <textarea 
                  id="supplier-msg"
                  required
                  rows="3" 
                  placeholder={language === 'gu' ? 'દવાની કેટેગરી (દા.ત. જેનરિક દવાઓ, આયુર્વેદિક, સર્જિકલ) અને પ્રમાણપત્રો (WHO-GMP) જણાવો...' : language === 'hi' ? 'दवा श्रेणी (उदा. जेनेरिक दवाएं, आयुर्वेदिक, सर्जिकल) और प्रमाणन (WHO-GMP) का उल्लेख करें...' : 'Mention product categories and certifications (WHO-GMP)...'}
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
                {isSubmitting ? t('supplier.submittingBtn', 'Registering...') : t('supplier.submitBtn', 'Register as Supplier')}
              </button>

              <div style={{ textAlign: 'center', marginTop: '14px', fontSize: '0.82rem', color: 'var(--text-medium)' }}>
                {language === 'gu' ? 'અથવા સીધો ઇમેઇલ કરો:' : language === 'hi' ? 'या सीधे ईमेल करें:' : 'Or email directly:'}{' '}
                <a href="mailto:info@niyanshpharma.com" style={{ color: 'var(--primary-blue)', fontWeight: '700' }}>
                  info@niyanshpharma.com
                </a>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}

export default Supplier;
