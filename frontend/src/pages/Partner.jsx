import React, { useState } from 'react';
import { Send, CheckCircle2, ShieldCheck, Award, Handshake, AlertCircle, Building, User, Briefcase, Mail } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

function Partner() {
  const { t, language } = useLanguage();
  const [distributorName, setDistributorName] = useState('');
  const [storeName, setStoreName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [designation, setDesignation] = useState('');
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

    setIsSubmitting(true);

    try {
      const fullMessage = `DISTRIBUTOR NAME: ${distributorName.trim().toUpperCase()}\nSTORE/HOSPITAL NAME: ${storeName.trim().toUpperCase()}\nOWNER/CONTACT PERSON: ${ownerName.trim().toUpperCase()}\nDESIGNATION: ${designation.trim().toUpperCase()}\nDRUG LICENSE: ${drugLicense.trim().toUpperCase()}\nGSTIN: ${gstNumber.trim().toUpperCase()}\n\nMESSAGE: ${message.trim().toUpperCase()}`;

      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'Partner',
          name: ownerName.trim().toUpperCase(),
          phone: cleanPhone,
          email: email.trim().toLowerCase(),
          address: address.trim().toUpperCase(),
          designation: designation.trim().toUpperCase(),
          message: fullMessage,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setDistributorName('');
        setStoreName('');
        setOwnerName('');
        setDesignation('');
        setPhone('');
        setEmail('');
        setDrugLicense('');
        setGstNumber('');
        setAddress('');
        setMessage('');
        setTimeout(() => setIsSuccess(false), 6000);
      } else {
        setErrorMessage(data.message || t('common.error', 'Failed to submit registration request.'));
      }
    } catch (error) {
      console.error('Error submitting partner form:', error);
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
    <div className="section animate-fade-in" style={{ backgroundColor: 'var(--bg-main)', paddingTop: '18px', paddingBottom: '44px' }}>
      <div className="container responsive-split-layout">
        
        {/* Info Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <span style={{
              backgroundColor: 'rgba(56, 142, 60, 0.1)', color: 'var(--secondary-green)',
              padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '700',
              textTransform: 'uppercase', display: 'inline-block', marginBottom: '10px'
            }}>
              {t('partner.badge', 'Retailer & Healthcare Business Partnership')}
            </span>
            <h1 style={{ fontSize: '2.3rem', marginBottom: '14px', lineHeight: '1.2' }}>
              {t('partner.title', 'Business With Niyansh Pharma')}
            </h1>
            <p style={{ color: 'var(--text-medium)', fontSize: '1.02rem', lineHeight: '1.6' }}>
              {t('partner.subtitle', 'Are you a distributor, medical store owner, hospital procurement manager, or healthcare provider? Do business with Niyansh Pharma to secure reliable, bulk supplies of genuine WHO-GMP certified medicines and surgical formulations at highly competitive wholesale trade rates.')}
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
              <div style={{ backgroundColor: '#ffffff', padding: '10px', borderRadius: '50%', color: 'var(--secondary-green)', display: 'flex', boxShadow: 'var(--card-shadow)' }}>
                <Award size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>
                  {t('partner.adv1Title', 'Competitive Wholesale Margins')}
                </h3>
                <p style={{ color: 'var(--text-medium)', fontSize: '0.9rem' }}>
                  {t('partner.adv1Desc', 'Access transparent PTR wholesale pricing and profitable trade schemes on fast-moving healthcare formulations.')}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
              <div style={{ backgroundColor: '#ffffff', padding: '10px', borderRadius: '50%', color: 'var(--secondary-green)', display: 'flex', boxShadow: 'var(--card-shadow)' }}>
                <ShieldCheck size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>
                  {t('partner.adv2Title', 'Priority Cold-Chain Dispatch')}
                </h3>
                <p style={{ color: 'var(--text-medium)', fontSize: '0.9rem' }}>
                  {t('partner.adv2Desc', 'Dedicated delivery channels guaranteeing same-day or next-day order dispatch across Gujarat.')}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
              <div style={{ backgroundColor: '#ffffff', padding: '10px', borderRadius: '50%', color: 'var(--secondary-green)', display: 'flex', boxShadow: 'var(--card-shadow)' }}>
                <Handshake size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>
                  {t('partner.adv4Title', 'Dedicated Account Support')}
                </h3>
                <p style={{ color: 'var(--text-medium)', fontSize: '0.9rem' }}>
                  {t('partner.adv4Desc', 'Direct assistance from a dedicated pharmaceutical trade representative for your supply needs.')}
                </p>
              </div>
            </div>
          </div>

          {/* Direct Business Partnership Desk */}
          <div className="card card-hover-pharma" style={{ marginTop: '25px', padding: '22px', display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-light)' }}>
            <div style={{ backgroundColor: 'rgba(12, 61, 108, 0.08)', padding: '12px', borderRadius: '12px', color: 'var(--primary-blue)', display: 'flex', flexShrink: 0 }}>
              <Mail size={24} />
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: '800', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {language === 'gu' ? 'બિઝનેસ જોડાણ ડેસ્ક' : language === 'hi' ? 'बिजनेस साझेदारी डेस्क' : 'Business Partnership Desk'}
              </div>
              <div style={{ fontSize: '1.08rem', fontWeight: '700', marginTop: '3px' }}>
                <a href="mailto:info@niyanshpharma.com" style={{ color: 'var(--primary-blue)', textDecoration: 'none' }}>
                  info@niyanshpharma.com
                </a>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-medium)', marginTop: '3px' }}>
                {language === 'gu' ? 'સંસ્થાકીય સપ્લાય, વિતરણ ભાગીદારી અને હોસ્પિટલ જોડાણ માટે.' : language === 'hi' ? 'संस्थागत आपूर्ति, वितरण साझेदारी और अस्पताल सहयोग के लिए।' : 'For institutional supply, distribution partnerships & hospital tenders.'}
              </div>
            </div>
          </div>


        </div>

        {/* Form Column */}
        <div className="card sticky-form-desktop" style={{ padding: '30px', position: 'sticky', top: '100px' }}>
          <h2 style={{ fontSize: '1.4rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Handshake size={22} color="var(--primary-blue)" /> {t('partner.formTitle', 'Chemist & Institutional Registration')}
          </h2>

          {isSuccess ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '15px', textAlign: 'center', padding: '40px 0' }}>
              <CheckCircle2 size={54} color="var(--secondary-green)" />
              <h3 style={{ color: 'var(--secondary-green)' }}>{t('common.success', 'Application Received!')}</h3>
              <p style={{ color: 'var(--text-medium)', fontSize: '0.95rem' }}>
                {t('partner.successNotice', 'Your partnership request has been received. Our trade desk will verify your details and connect with you shortly.')}
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
              
              {/* Row 1: Distributor Name & Medical Store / Hospital Name */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '15px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label htmlFor="partner-distributor" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-medium)' }}>
                    {t('partner.storeTypeDistributor', 'Sub-Stockist / Distributor')} <span className="required-star">*</span>
                  </label>
                  <input 
                    id="partner-distributor"
                    type="text" 
                    required 
                    placeholder={language === 'gu' ? 'દા.ત. સૌરાષ્ટ્ર ફાર્મા એજન્સી' : language === 'hi' ? 'उदा. सौराष्ट्र फार्मा एजेंसी' : 'E.g., Saurashtra Pharma Agency'}
                    value={distributorName}
                    onChange={(e) => setDistributorName(e.target.value)}
                    style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label htmlFor="partner-store" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-medium)' }}>
                    {t('partner.storeNameLabel', 'Medical Store / Pharmacy Name')} <span className="required-star">*</span>
                  </label>
                  <input 
                    id="partner-store"
                    type="text" 
                    required 
                    placeholder={language === 'gu' ? 'દા.ત. કેર ફાર્મસી / એપેક્સ હોસ્પિટલ' : language === 'hi' ? 'उदा. केयर फार्मेसी / एपेक्स अस्पताल' : 'E.g., Care Pharmacy / Apex Hospital'}
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              {/* Row 2: Owner / Contact Person & Designation */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '15px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label htmlFor="partner-owner" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-medium)' }}>
                    {t('partner.ownerLabel', 'Owner / Contact Person Name')} <span className="required-star">*</span>
                  </label>
                  <input 
                    id="partner-owner"
                    type="text" 
                    required 
                    placeholder={language === 'gu' ? 'પૂરું નામ લખો' : language === 'hi' ? 'पूरा नाम लिखें' : 'Enter full name'}
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label htmlFor="partner-designation" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-medium)' }}>
                    {t('supplier.designationLabel', 'Designation')} <span className="required-star">*</span>
                  </label>
                  <input 
                    id="partner-designation"
                    type="text" 
                    required 
                    placeholder={language === 'gu' ? 'માલિક, પરચેઝ મેનેજર' : language === 'hi' ? 'मालिक, खरीद प्रबंधक' : 'E.g., Proprietor, Purchase Manager'}
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              {/* Row 3: Mobile Number & Email Address */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '15px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label htmlFor="partner-phone" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-medium)' }}>
                    {t('partner.phoneLabel', '10-Digit Mobile Number')} <span className="required-star">*</span>
                  </label>
                  <input 
                    id="partner-phone"
                    type="tel" 
                    required 
                    maxLength={10}
                    placeholder={language === 'gu' ? '૧૦ આંકડાનો મોબાઈલ નંબર' : language === 'hi' ? '१० अंकों का मोबाइल नंबर' : '10-digit mobile number'}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label htmlFor="partner-email" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-medium)' }}>
                    {t('partner.emailLabel', 'Email Address')}
                  </label>
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

              {/* Row 4: Drug License Number & GSTIN */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '15px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label htmlFor="partner-license" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-medium)' }}>
                    {t('partner.drugLicenseLabel', 'Drug License Number (20B / 21B)')} <span className="required-star">*</span>
                  </label>
                  <input 
                    id="partner-license"
                    type="text" 
                    required 
                    placeholder="GJ-RAJ-XXXXXX"
                    value={drugLicense}
                    onChange={(e) => setDrugLicense(e.target.value)}
                    style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label htmlFor="partner-gst" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-medium)' }}>
                    {t('partner.gstLabel', 'GSTIN Number')}
                  </label>
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

              {/* Row 5: Shop / Entity Address */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label htmlFor="partner-address" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-medium)' }}>
                  {t('partner.addressLabel', 'Complete Shop / Hospital Address')} <span className="required-star">*</span>
                </label>
                <input 
                  id="partner-address"
                  type="text" 
                  required 
                  placeholder={language === 'gu' ? 'સરનામું, શહેર, પીનકોડ (દા.ત. રાજકોટ - ૩૬૦૦૦૫)' : language === 'hi' ? 'पता, शहर, पिनकोड (उदा. राजकोट - ३६०००५)' : 'Address, City, Pincode (e.g. Rajkot - 360005)'}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                />
              </div>

              {/* Row 6: Message / Query Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label htmlFor="partner-msg" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-medium)' }}>
                  {t('partner.messageLabel', 'Formulation Requirements / Message')}
                </label>
                <textarea 
                  id="partner-msg"
                  rows="3" 
                  placeholder={language === 'gu' ? 'જરૂરી બ્રાન્ડ્સ કે દવાઓની યાદી અહીં લખો...' : language === 'hi' ? 'आवश्यक ब्रांड्स या दवाओं की सूची यहाँ लिखें...' : 'List specific brands or medicine categories you are interested in...'}
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
                {isSubmitting ? t('partner.submittingBtn', 'Submitting...') : t('partner.submitBtn', 'Submit Business Registration')}
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

export default Partner;
