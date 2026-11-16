import React, { useState } from 'react';
import { Send, CheckCircle2, ShieldAlert, CheckSquare, Layers, AlertCircle, Mail, Phone, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

function Manufacturing() {
  const { t, language } = useLanguage();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [designation, setDesignation] = useState('');
  const [formulations, setFormulations] = useState('');
  const [batchSize, setBatchSize] = useState('');
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
      const fullMessage = `Company: ${company.trim()}\nDesignation: ${designation.trim()}\nRequested Formulations: ${formulations.trim()}\nEstimated Batch Size: ${batchSize.trim()}\n\nNotes: ${message.trim()}`;

      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'Manufacturing',
          name: name.trim(),
          phone: cleanPhone,
          email: email.trim(),
          address: company.trim(),
          designation: designation.trim(),
          message: fullMessage,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setName('');
        setPhone('');
        setEmail('');
        setCompany('');
        setDesignation('');
        setFormulations('');
        setBatchSize('');
        setMessage('');
        setTimeout(() => setIsSuccess(false), 6000);
      } else {
        setErrorMessage(data.message || t('common.error', 'Failed to submit manufacturing enquiry.'));
      }
    } catch (error) {
      console.error('Error submitting manufacturing form:', error);
      setErrorMessage(
        language === 'gu' 
          ? 'નેટવર્ક કનેક્શન એરર. કૃપા કરીને ઇન્ટરનેટ તપાસી ફરી પ્રયાસ કરો.' 
          : language === 'hi' 
          ? 'नेटवर्क कनेक्शन त्रुटि। कृपया इंटरनेट जांचें और पुनः प्रयास करें।' 
          : 'Network connection error. Please check your internet and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const highlights = [
    { title: t('manufacturing.adv1Title', 'WHO-GMP Compliant'), desc: t('manufacturing.adv1Desc', 'All contract manufacturing formulations are processed in state-of-the-art WHO-GMP certified facilities.') },
    { title: t('manufacturing.adv2Title', 'Custom Formulations'), desc: t('manufacturing.adv2Desc', 'Capable of manufacturing tablets, capsules, dry syrups, ointments, and injectables under your brand label.') },
    { title: t('manufacturing.adv3Title', 'Rigorous Quality Checks'), desc: t('manufacturing.adv3Desc', 'In-house quality control testing laboratories check raw materials, intermediates, and final batches.') },
    { title: t('manufacturing.adv4Title', 'Optimized Turnaround Time'), desc: t('manufacturing.adv4Desc', 'Efficient production planning and logistical coordination guarantee timely dispatch of final formulations.') }
  ];

  return (
    <div className="section animate-fade-in" style={{ backgroundColor: 'var(--bg-main)' }}>
      <div className="container responsive-split-layout">
        
        {/* Info Column */}
        <div>
          <span style={{
            backgroundColor: 'rgba(12, 61, 108, 0.08)', color: 'var(--primary-blue)',
            padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '700',
            textTransform: 'uppercase', display: 'inline-block', marginBottom: '15px'
          }}>
            {t('manufacturing.badge', 'Third-Party & Contract Manufacturing')}
          </span>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>
            {t('manufacturing.title', 'Pharmaceutical Manufacturing Services')}
          </h1>
          <p style={{ color: 'var(--text-medium)', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '30px' }}>
            {t('manufacturing.subtitle', 'Niyansh Pharma facilitates high-quality contract manufacturing and third-party production services for domestic pharmaceutical companies. Leverage our partner network of WHO-GMP certified production units to manufacture your formulations with guaranteed quality standards.')}
          </p>

          <h2 style={{ fontSize: '1.4rem', marginBottom: '25px' }}>
            {t('manufacturing.advTitle', 'Manufacturing Advantages')}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {highlights.map((item, idx) => (
              <div key={idx} className="card" style={{ padding: '20px', display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                <div style={{ backgroundColor: 'rgba(56, 142, 60, 0.08)', padding: '10px', borderRadius: '8px', color: 'var(--secondary-green)', display: 'flex' }}>
                  <CheckSquare size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{item.title}</h3>
                  <p style={{ color: 'var(--text-medium)', fontSize: '0.9rem', lineHeight: '1.5' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Direct Production Contact Desk */}
          <div className="card" style={{ marginTop: '25px', padding: '22px', display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-light)' }}>
            <div style={{ backgroundColor: 'rgba(12, 61, 108, 0.08)', padding: '12px', borderRadius: '12px', color: 'var(--primary-blue)', display: 'flex', flexShrink: 0 }}>
              <Mail size={24} />
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: '800', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {language === 'gu' ? 'ઉત્પાદન સંપર્ક ડેસ્ક' : language === 'hi' ? 'उत्पादन संपर्क डेस्क' : 'Manufacturing Contact Desk'}
              </div>
              <div style={{ fontSize: '1.08rem', fontWeight: '700', marginTop: '3px' }}>
                <a href="mailto:production@niyanshpharma.com" style={{ color: 'var(--primary-blue)', textDecoration: 'none' }}>
                  production@niyanshpharma.com
                </a>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-medium)', marginTop: '3px' }}>
                {language === 'gu' ? 'કોન્ટ્રાક્ટ ઉત્પાદન અને થર્ડ-પાર્ટી ઇન્ક્વાયરી માટે સીધો ઇમેઇલ કરો.' : language === 'hi' ? 'अनुबंध विनिर्माण और थर्ड-पार्टी पूछताछ के लिए सीधे ईमेल करें।' : 'Direct email for contract manufacturing & formulation enquiries.'}
              </div>
            </div>
          </div>

          {/* Statutory Registration Badge */}
          <div className="card" style={{ marginTop: '16px', padding: '16px 20px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--secondary-green)', fontWeight: '700', fontSize: '0.85rem' }}>
              <ShieldCheck size={18} />
              <span>{t('compliance.title', 'Official Business Registration & Statutory Licences')}</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 16px', fontSize: '0.82rem', color: 'var(--text-medium)' }}>
              <span><strong>D.L.No.:</strong> <span style={{ fontFamily: 'monospace', fontWeight: '700', color: 'var(--primary-blue)' }}>20B, 264618, 21B, 264619</span></span>
              <span><strong>GSTIN:</strong> <span style={{ fontFamily: 'monospace', fontWeight: '700', color: 'var(--primary-blue)' }}>24BVXPP6108F2Z7</span></span>
              <span><strong>Food License no.:</strong> <span style={{ fontFamily: 'monospace', fontWeight: '700', color: 'var(--primary-blue)' }}>20726030000567</span></span>
            </div>
          </div>
        </div>

        {/* Form Column */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="card sticky-form-desktop" style={{ padding: '30px', position: 'sticky', top: '100px' }}>
            <h2 style={{ fontSize: '1.4rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Layers size={22} color="var(--primary-blue)" /> {t('manufacturing.formTitle', 'Request Manufacturing Quotation')}
            </h2>

            {isSuccess ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '15px', textAlign: 'center', padding: '40px 0' }}>
                <CheckCircle2 size={54} color="var(--secondary-green)" />
                <h3 style={{ color: 'var(--secondary-green)' }}>{t('common.success', 'Enquiry Sent!')}</h3>
                <p style={{ color: 'var(--text-medium)', fontSize: '0.95rem' }}>
                  {t('manufacturing.successNotice', 'Thank you for reaching out. Our manufacturing desk will analyze your formulations and respond within 48 hours.')}
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
                    <label htmlFor="mfg-name" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-medium)' }}>
                      {t('contact.nameLabel', 'Your Name *')}
                    </label>
                    <input 
                      id="mfg-name"
                      type="text" 
                      required 
                      placeholder={language === 'gu' ? 'આપનું નામ દાખલ કરો' : language === 'hi' ? 'अपना नाम दर्ज करें' : 'Enter name'}
                      value={name}
                      onChange={(e) => { setName(e.target.value); if (errorMessage) setErrorMessage(''); }}
                      style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label htmlFor="mfg-phone" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-medium)' }}>
                      {t('contact.phoneLabel', 'Phone Number *')}
                    </label>
                    <input 
                      id="mfg-phone"
                      type="tel" 
                      required 
                      maxLength={10}
                      placeholder={language === 'gu' ? '૧૦ આંકડાનો મોબાઈલ નંબર' : language === 'hi' ? '१० अंकों का मोबाइल नंबर' : '10-digit mobile number'}
                      value={phone}
                      onChange={(e) => { setPhone(e.target.value.replace(/\D/g, '').slice(0, 10)); if (errorMessage) setErrorMessage(''); }}
                      style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label htmlFor="mfg-email" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-medium)' }}>
                      {t('cart.email', 'Email Address')} *
                    </label>
                    <input 
                      id="mfg-email"
                      type="email" 
                      required
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value.toLowerCase()); if (errorMessage) setErrorMessage(''); }}
                      style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label htmlFor="mfg-company" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-medium)' }}>
                      {t('manufacturing.companyLabel', 'Company Name *')}
                    </label>
                    <input 
                      id="mfg-company"
                      type="text" 
                      required 
                      placeholder={language === 'gu' ? 'કંપનીનું નામ' : language === 'hi' ? 'कंपनी का नाम' : 'Enter firm name'}
                      value={company}
                      onChange={(e) => { setCompany(e.target.value); if (errorMessage) setErrorMessage(''); }}
                      style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label htmlFor="mfg-formulations" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-medium)' }}>
                      {t('manufacturing.formulationsLabel', 'Formulation Type *')}
                    </label>
                    <select 
                      id="mfg-formulations"
                      required
                      value={formulations}
                      onChange={(e) => setFormulations(e.target.value)}
                      style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem', backgroundColor: '#fff' }}
                    >
                      <option value="">{language === 'gu' ? 'કેટેગરી પસંદ કરો' : language === 'hi' ? 'श्रेणी चुनें' : 'Select Category'}</option>
                      <option value="Tablets">{language === 'gu' ? 'ટેબ્લેટ્સ (Tablets)' : language === 'hi' ? 'गोलियां (Tablets)' : 'Tablets'}</option>
                      <option value="Capsules">{language === 'gu' ? 'કેપ્સ્યુલ્સ (Capsules)' : language === 'hi' ? 'कैप्सूल (Capsules)' : 'Capsules'}</option>
                      <option value="Liquid Orals">{language === 'gu' ? 'સિરપ / સસ્પેન્શન (Liquid Orals)' : language === 'hi' ? 'सिरप / सस्पेंशन (Liquid Orals)' : 'Liquid Orals (Syrups)'}</option>
                      <option value="Injectables">{language === 'gu' ? 'ઇન્જેક્ટેબલ્સ (Injectables)' : language === 'hi' ? 'इंजेक्टेबल्स (Injectables)' : 'Injectables'}</option>
                      <option value="Ointments">{language === 'gu' ? 'મલમ / જેલ (Ointments/Gels)' : language === 'hi' ? 'मलहम / जेल (Ointments/Gels)' : 'Ointments / Creams / Gels'}</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label htmlFor="mfg-batch" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-medium)' }}>
                      {t('manufacturing.batchSizeLabel', 'Est. Batch Size *')}
                    </label>
                    <input 
                      id="mfg-batch"
                      type="text" 
                      required
                      placeholder={language === 'gu' ? 'દા.ત. ૫૦,૦૦૦ ગોળીઓ' : language === 'hi' ? 'उदा. ५०,००० गोलियां' : 'E.g., 50k tablets'}
                      value={batchSize}
                      onChange={(e) => setBatchSize(e.target.value)}
                      style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label htmlFor="mfg-notes" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-medium)' }}>
                    {t('manufacturing.notesLabel', 'Formulation details / special notes')}
                  </label>
                  <textarea 
                    id="mfg-notes"
                    rows="3" 
                    placeholder={language === 'gu' ? 'દવાની વિગતો અને પેકિંગની જરૂરિયાત લખો...' : language === 'hi' ? 'दवा का विवरण और पैकिंग की आवश्यकता लिखें...' : 'Enter composition details, packing requirements...'}
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
                  {isSubmitting ? t('common.loading', 'Sending Request...') : t('manufacturing.submitBtn', 'Submit Manufacturing Enquiry')}
                </button>

                <div style={{ textAlign: 'center', marginTop: '14px', fontSize: '0.82rem', color: 'var(--text-medium)' }}>
                  {language === 'gu' ? 'અથવા સીધો ઇમેઇલ કરો:' : language === 'hi' ? 'या सीधे ईमेल करें:' : 'Or email directly:'}{' '}
                  <a href="mailto:production@niyanshpharma.com" style={{ color: 'var(--primary-blue)', fontWeight: '700' }}>
                    production@niyanshpharma.com
                  </a>
                </div>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Manufacturing;
