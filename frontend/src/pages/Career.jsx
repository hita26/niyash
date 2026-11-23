import React, { useState } from 'react';
import { Briefcase, Upload, Send, CheckCircle2, Clock, AlertCircle, Mail } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

function Career() {
  const { t, language } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [position, setPosition] = useState('');
  const [experience, setExperience] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const positions = [
    { 
      title: t('career.job1Title', 'Sales Manager'), 
      dept: t('career.job1Dept', 'Sales & Business Development'), 
      type: language === 'gu' ? 'ફુલ ટાઈમ' : language === 'hi' ? 'फुल टाइम' : 'Full Time', 
      desc: t('career.job1Desc', 'Lead institutional pharma sales, wholesale distributor relations, and territory expansion across Gujarat.') 
    },
    { 
      title: t('career.job2Title', 'Sales Executive'), 
      dept: t('career.job2Dept', 'Field Sales'), 
      type: language === 'gu' ? 'ફુલ ટાઈમ' : language === 'hi' ? 'फुल टाइम' : 'Full Time', 
      desc: t('career.job2Desc', 'Promote products to medical stores and collect orders.') 
    },
    { 
      title: t('career.job3Title', 'Warehouse In-charge'), 
      dept: t('career.job3Dept', 'Logistics & Inventory'), 
      type: language === 'gu' ? 'ફુલ ટાઈમ' : language === 'hi' ? 'फुल टाइम' : 'Full Time', 
      desc: t('career.job3Desc', 'Manage pharmaceutical stocks, batch details, and packaging.') 
    },
    { 
      title: t('career.job4Title', 'Delivery Partner (Local)'), 
      dept: t('career.job4Dept', 'Distribution'), 
      type: language === 'gu' ? 'ફુલ / પાર્ટ ટાઈમ' : language === 'hi' ? 'फुल / पार्ट टाइम' : 'Full Time / Part Time', 
      desc: t('career.job4Desc', 'Deliver products safely and timely to local hospitals and pharmacies.') 
    },
    { 
      title: t('career.job5Title', 'Telecaller / Order Clerk'), 
      dept: t('career.job5Dept', 'Customer Support'), 
      type: language === 'gu' ? 'ફુલ ટાઈમ' : language === 'hi' ? 'फुल टाइम' : 'Full Time', 
      desc: t('career.job5Desc', 'Call medical stores, book wholesale orders, and handle general enquiries.') 
    }
  ];

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const allowedExts = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'webp'];
      const ext = file.name.split('.').pop().toLowerCase();
      if (!allowedExts.includes(ext)) {
        setErrorMessage(
          language === 'gu'
            ? 'કૃપા કરીને માન્ય ફાઇલ (PDF, Word, JPG અથવા PNG) અપલોડ કરો.'
            : language === 'hi'
            ? 'कृपया वैध फ़ाइल (PDF, Word, JPG या PNG) अपलोड करें।'
            : 'Please upload a valid file format (PDF, Word, JPG, or PNG).'
        );
        e.target.value = '';
        setResumeFile(null);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage(
          language === 'gu'
            ? 'ફાઇલનું કદ 5MB કરતાં ઓછું હોવું જોઈએ.'
            : language === 'hi'
            ? 'फ़ाइल का आकार 5MB से कम होना चाहिए।'
            : 'File size must be less than 5MB.'
        );
        e.target.value = '';
        setResumeFile(null);
        return;
      }
      setResumeFile(file);
      setErrorMessage('');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!resumeFile) {
      setErrorMessage(
        language === 'gu'
          ? 'કૃપા કરીને આપનો રેઝ્યુમે / બાયોડેટા (PDF, Word, JPG કે PNG ફાઇલ) અપલોડ કરો.'
          : language === 'hi'
          ? 'कृपया अपना बायोडाटा (PDF, Word, JPG या PNG फ़ाइल) अपलोड करें।'
          : 'Please upload your resume (PDF, Word, JPG, or PNG document).'
      );
      return;
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage(
        language === 'gu'
          ? 'કૃપા કરીને માન્ય ૧૦ આંકડાનો મોબાઈલ નંબર દાખલ કરો.'
          : language === 'hi'
          ? 'कृपया वैध १० अंकों का मोबाइल नंबर दर्ज करें।'
          : 'Please enter a valid 10-digit mobile number.'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('name', (name || '').trim().toUpperCase());
      formData.append('email', (email || '').trim().toLowerCase());
      formData.append('phone', cleanPhone);
      formData.append('position', (position || '').trim().toUpperCase());
      formData.append('experience', (experience || '').trim().toUpperCase());
      formData.append('coverLetter', (coverLetter || '').trim().toUpperCase());
      formData.append('resume', resumeFile);

      const response = await fetch('/api/careers', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setName('');
        setEmail('');
        setPhone('');
        setPosition('');
        setExperience('');
        setCoverLetter('');
        setResumeFile(null);
        const fileInput = document.getElementById('career-resume');
        if (fileInput) fileInput.value = '';
        
        setTimeout(() => setIsSuccess(false), 6000);
      } else {
        setErrorMessage(data.message || t('common.error', 'Failed to submit application. Please check your details.'));
      }
    } catch (error) {
      console.error('Error submitting career form:', error);
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
        
        {/* Left: Job Listings */}
        <div>
          <h1 style={{ fontSize: '2.1rem', marginBottom: '10px' }}>
            {t('career.title', 'Careers at Niyansh Pharma')}
          </h1>
          <p style={{ color: 'var(--text-medium)', marginBottom: '20px', fontSize: '1.02rem', lineHeight: '1.6' }}>
            {t('career.subtitle', 'Join our growing team and build a rewarding career in pharmaceutical distribution. We offer competitive salaries, performance incentives, and a collaborative work environment.')}
          </p>

          <h2 style={{ fontSize: '1.4rem', marginBottom: '20px' }}>
            {t('career.openingsTitle', 'Current Job Openings')}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {positions.map((pos, i) => (
              <div key={i} className="card card-hover-pharma" style={{ padding: '25px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-blue)' }}>{pos.title}</h3>
                  <span style={{ fontSize: '0.75rem', padding: '4px 10px', backgroundColor: 'rgba(56, 142, 60, 0.1)', color: 'var(--secondary-green)', borderRadius: '20px', fontWeight: '700' }}>
                    {pos.type}
                  </span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', display: 'flex', gap: '15px' }}>
                  <span>{language === 'gu' ? 'વિભાગ:' : language === 'hi' ? 'विभाग:' : 'Department:'} <strong>{pos.dept}</strong></span>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-medium)', lineHeight: '1.5' }}>{pos.desc}</p>
                <button 
                  onClick={() => {
                    setPosition(pos.title);
                    document.getElementById('career-form-container')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  style={{ alignSelf: 'flex-start', color: 'var(--primary-blue)', fontWeight: '700', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '5px', cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
                >
                  {language === 'gu' ? 'અરજી કરો →' : language === 'hi' ? 'आवेदन करें →' : 'Apply Now →'}
                </button>
              </div>
            ))}
          </div>

          {/* Direct HR & Careers Recruitment Desk */}
          <div className="card card-hover-pharma" style={{ marginTop: '25px', padding: '22px', display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-light)' }}>
            <div style={{ backgroundColor: 'rgba(12, 61, 108, 0.08)', padding: '12px', borderRadius: '12px', color: 'var(--primary-blue)', display: 'flex', flexShrink: 0 }}>
              <Mail size={24} />
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: '800', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {language === 'gu' ? 'એચઆર અને ભરતી ડેસ્ક' : language === 'hi' ? 'एचआर एवं भर्ती डेस्क' : 'HR & Recruitment Desk'}
              </div>
              <div style={{ fontSize: '1.08rem', fontWeight: '700', marginTop: '3px' }}>
                <a href="mailto:info@niyanshpharma.com" style={{ color: 'var(--primary-blue)', textDecoration: 'none' }}>
                  info@niyanshpharma.com
                </a>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-medium)', marginTop: '3px' }}>
                {language === 'gu' ? 'આપનો રેઝ્યુમે અથવા સીવી સીધા આ ઇમેઇલ પર પણ મોકલી શકો છો.' : language === 'hi' ? 'अपना बायोडाटा (CV) सीधे इस ईमेल पर भी भेज सकते हैं।' : 'Send your CV or resume directly to our HR recruitment desk.'}
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

        {/* Right: Application Form */}
        <div id="career-form-container" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="card sticky-form-desktop" style={{ padding: '30px', position: 'sticky', top: '100px' }}>
            <h2 style={{ fontSize: '1.4rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Briefcase size={22} color="var(--primary-blue)" /> {t('career.applyTitle', 'Apply for a Position')}
            </h2>

            {isSuccess ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '15px', textAlign: 'center', padding: '40px 0' }}>
                <CheckCircle2 size={54} color="var(--secondary-green)" />
                <h3 style={{ color: 'var(--secondary-green)' }}>{t('common.success', 'Application Submitted!')}</h3>
                <p style={{ color: 'var(--text-medium)', fontSize: '0.95rem' }}>
                  {t('career.successNotice', 'Your application has been received. Our HR team will review your profile and contact shortlisted candidates.')}
                </p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {errorMessage && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', color: '#b91c1c', fontSize: '0.88rem' }} role="alert">
                    <AlertCircle size={16} style={{ flexShrink: 0 }} aria-hidden="true" />
                    <span>{errorMessage}</span>
                  </div>
                )}
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label htmlFor="career-name" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-medium)' }}>
                    {t('cart.fullName', 'Full Name')} <span className="required-star">*</span>
                  </label>
                  <input 
                    id="career-name"
                    type="text" 
                    required 
                    placeholder={language === 'gu' ? 'પૂરું નામ લખો' : language === 'hi' ? 'पूरा नाम लिखें' : 'Enter name'}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '15px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label htmlFor="career-email" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-medium)' }}>
                      {t('cart.email', 'Email')} <span className="required-star">*</span>
                    </label>
                    <input 
                      id="career-email"
                      type="email" 
                      required 
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value.toLowerCase())}
                      style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label htmlFor="career-phone" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-medium)' }}>
                      {t('cart.phone', 'Phone Number')} <span className="required-star">*</span>
                    </label>
                    <input 
                      id="career-phone"
                      type="tel" 
                      required 
                      maxLength={10}
                      placeholder={language === 'gu' ? '૧૦ આંકડાનો મોબાઈલ' : language === 'hi' ? '१० अंकों का मोबाइल' : 'Enter mobile'}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '15px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label htmlFor="career-pos-select" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-medium)' }}>
                      {t('career.selectPosition', 'Position Applying For')} <span className="required-star">*</span>
                    </label>
                    <select 
                      id="career-pos-select"
                      required
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem', backgroundColor: '#fff' }}
                    >
                      <option value="">{language === 'gu' ? 'જગ્યા પસંદ કરો' : language === 'hi' ? 'पद चुनें' : 'Select Position'}</option>
                      {positions.map((p, idx) => (
                        <option key={idx} value={p.title}>{p.title}</option>
                      ))}
                    </select>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label htmlFor="career-exp-select" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-medium)' }}>
                      {t('career.expLabel', 'Experience')} <span className="required-star">*</span>
                    </label>
                    <select 
                      id="career-exp-select"
                      required
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem', backgroundColor: '#fff' }}
                    >
                      <option value="">{language === 'gu' ? 'અનુભવ પસંદ કરો' : language === 'hi' ? 'अनुभव चुनें' : 'Select Exp'}</option>
                      <option value="Freshers">{language === 'gu' ? 'ફ્રેશર (નવા)' : language === 'hi' ? 'फ्रेशर (नए)' : 'Fresher'}</option>
                      <option value="1-2 Years">{language === 'gu' ? '૧-૨ વર્ષ' : language === 'hi' ? '१-२ वर्ष' : '1-2 Years'}</option>
                      <option value="3+ Years">{language === 'gu' ? '૩+ વર્ષ' : language === 'hi' ? '३+ वर्ष' : '3+ Years'}</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label htmlFor="career-cover" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-medium)' }}>
                    {t('career.coverLabel', 'Brief Introduction / Cover Note')}
                  </label>
                  <textarea 
                    id="career-cover"
                    rows="3" 
                    placeholder={language === 'gu' ? 'આપનો ટૂંકો પરિચય અને અનુભવ જણાવો...' : language === 'hi' ? 'अपना संक्षिप्त परिचय और अनुभव बताएं...' : 'Briefly introduce yourself...'}
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem', resize: 'vertical' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label htmlFor="career-resume" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-medium)' }}>
                    {t('career.resumeLabel', 'Upload Resume / CV (PDF, Word, JPG, PNG, Max 5MB)')} <span className="required-star">*</span>
                  </label>
                  <div style={{
                    border: '2px dashed #cbd5e1', borderRadius: '6px', padding: '15px',
                    textAlign: 'center', cursor: 'pointer', position: 'relative',
                    backgroundColor: '#f8fafc', transition: 'var(--transition-smooth)'
                  }}>
                    <Upload size={20} color="var(--text-light)" style={{ marginBottom: '5px' }} />
                    <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-medium)' }}>
                      {resumeFile ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--primary-blue)', fontWeight: '600' }}>
                          <CheckCircle2 size={16} color="var(--secondary-green)" />
                          {resumeFile.name} ({(resumeFile.size / 1024).toFixed(0)} KB)
                        </span>
                      ) : (
                        language === 'gu'
                          ? 'PDF, Word, JPG કે PNG ફાઇલ પસંદ કરવા અહીં ક્લિક કરો'
                          : language === 'hi'
                          ? 'PDF, Word, JPG या PNG फ़ाइल चुनने के लिए यहाँ क्लिक करें'
                          : 'Click to select PDF, Word, JPG or PNG file'
                      )}
                    </span>
                    <input 
                      id="career-resume"
                      type="file" 
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,image/png,image/webp"
                      onChange={handleFileChange}
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="btn btn-primary" 
                  style={{ width: '100%', height: '45px', gap: '10px', marginTop: '10px' }}
                >
                  <Send size={16} />
                  {isSubmitting ? t('career.submittingBtn', 'Submitting Application...') : t('career.submitBtn', 'Submit Job Application')}
                </button>

                <div style={{ textAlign: 'center', marginTop: '14px', fontSize: '0.82rem', color: 'var(--text-medium)' }}>
                  {language === 'gu' ? 'અથવા રેઝ્યુમે સીધો ઇમેઇલ કરો:' : language === 'hi' ? 'या बायोडाटा सीधे ईमेल करें:' : 'Or email resume directly:'}{' '}
                  <a href="mailto:info@niyanshpharma.com" style={{ color: 'var(--primary-blue)', fontWeight: '700' }}>
                    info@niyanshpharma.com
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

export default Career;
