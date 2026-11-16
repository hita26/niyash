import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

function Contact() {
  const { t, language } = useLanguage();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Phone validation
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
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'General Enquiry',
          name: name.trim(),
          phone: cleanPhone,
          email: email.trim(),
          message: `Subject: ${subject.trim()}\n\n${message.trim()}`,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setName('');
        setPhone('');
        setEmail('');
        setSubject('');
        setMessage('');
        setTimeout(() => setIsSuccess(false), 6000);
      } else {
        setErrorMessage(data.message || t('common.error', 'Failed to send message. Please try again.'));
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
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
      <div className="container">
        <h1 className="section-title">{t('contact.title', 'Contact & Dispatch Desk')}</h1>
        <p className="section-subtitle">{t('contact.subtitle', 'Reach out to Niyansh Pharma for wholesale distributorship queries, orders, or urgent dispatch assistance.')}</p>

        <div className="contact-layout">
          
          {/* Contact Details & Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <div className="card" style={{ padding: '30px', flex: 1, display: 'flex', flexDirection: 'column', gap: '25px' }}>
              <h2 style={{ fontSize: '1.4rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px' }}>
                {t('contact.title', 'Contact & Dispatch Desk')}
              </h2>
              
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <li style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                  <div style={{ backgroundColor: 'rgba(12, 61, 108, 0.08)', padding: '10px', borderRadius: '10px', color: 'var(--primary-blue)', display: 'flex' }}>
                    <MapPin size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', marginBottom: '4px' }}>{t('contact.hubAddress', 'Wholesale Hub Address')}</h3>
                    <p style={{ color: 'var(--text-medium)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                      {t('contact.addressValue', 'Block no. 52B, Panchayat Nagar-3, Ram Park Main Road, University Rd, Rajkot, Gujarat - 360005.')}
                    </p>
                  </div>
                </li>

                <li style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                  <div style={{ backgroundColor: 'rgba(12, 61, 108, 0.08)', padding: '10px', borderRadius: '10px', color: 'var(--primary-blue)', display: 'flex' }}>
                    <Phone size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', marginBottom: '4px' }}>{t('contact.callUs', 'Phone Numbers')}</h3>
                    <p style={{ color: 'var(--text-medium)', fontSize: '0.9rem' }}>
                      {language === 'gu' ? 'મોબાઈલ:' : language === 'hi' ? 'मोबाइल:' : 'Mobile:'} <a href="tel:+919909923130" style={{ color: 'var(--text-dark)', fontWeight: '600' }}>+91 99099 23130</a>
                    </p>
                  </div>
                </li>

                <li style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                  <div style={{ backgroundColor: 'rgba(12, 61, 108, 0.08)', padding: '10px', borderRadius: '10px', color: 'var(--primary-blue)', display: 'flex' }}>
                    <Mail size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', marginBottom: '4px' }}>{t('contact.emailUs', 'Official Email')}</h3>
                    <p style={{ color: 'var(--text-medium)', fontSize: '0.9rem' }}>
                      {language === 'gu' ? 'ઇમેઇલ:' : language === 'hi' ? 'ईमेल:' : 'Official:'} <a href="mailto:info@niyanshpharma.com" style={{ color: 'var(--text-dark)', fontWeight: '600' }}>info@niyanshpharma.com</a>
                    </p>
                  </div>
                </li>

                <li style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                  <div style={{ backgroundColor: 'rgba(12, 61, 108, 0.08)', padding: '10px', borderRadius: '10px', color: 'var(--primary-blue)', display: 'flex' }}>
                    <Clock size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', marginBottom: '4px' }}>{t('contact.workingHours', 'Business Hours')}</h3>
                    <p style={{ color: 'var(--text-medium)', fontSize: '0.9rem', marginBottom: '3px', lineHeight: '1.4' }}>
                      <strong>{t('contact.hoursLabel', 'Business Hours')}:</strong> 9:00 AM – 9:00 PM
                    </p>
                    <p style={{ color: 'var(--text-light)', fontSize: '0.82rem', marginBottom: '6px' }}>
                      ({language === 'gu' ? 'સોમવાર – શનિવાર, રવિવાર રજા' : language === 'hi' ? 'सोमवार – शनिवार, रविवार बंद' : 'Monday – Saturday, Sunday Closed'})
                    </p>
                    <p style={{ color: 'var(--text-medium)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px', lineHeight: '1.4' }}>
                      <span style={{ display: 'inline-block', width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#f59e0b' }}></span>
                      <strong>{t('contact.lunchBreakLabel', 'Lunch Break')}:</strong> 2:00 PM – 4:00 PM
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Embedded Google Map */}
            <div className="card" style={{ padding: '0', overflow: 'hidden', height: '280px' }}>
              <iframe 
                title="Niyansh Pharma Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3691.4650393043817!2d70.76194731589283!3d22.287219093721385!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3959cb33b44fc73f%3A0x3c79432bfa8b8b1d!2sNiyansh%20pharma!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          {/* Contact Message Form */}
          <div className="card" style={{ padding: '30px', display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ fontSize: '1.4rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px', marginBottom: '20px' }}>
              {t('contact.formHeading', 'Send a Wholesale Message')}
            </h2>
            
            {isSuccess ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: '15px', textAlign: 'center', padding: '40px 0' }}>
                <CheckCircle2 size={54} color="var(--secondary-green)" />
                <h3 style={{ color: 'var(--secondary-green)' }}>{t('common.success', 'Message Sent!')}</h3>
                <p style={{ color: 'var(--text-medium)', fontSize: '0.95rem' }}>
                  {t('contact.successMsg', 'Thank you for contacting Niyansh Pharma. We have received your query and will reply within 24 hours.')}
                </p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', flex: 1 }}>
                {errorMessage && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', color: '#b91c1c', fontSize: '0.88rem' }} role="alert">
                    <AlertCircle size={16} style={{ flexShrink: 0 }} aria-hidden="true" />
                    <span>{errorMessage}</span>
                  </div>
                )}
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label htmlFor="contact-name" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-medium)' }}>
                      {t('contact.nameLabel', 'Your Name *')}
                    </label>
                    <input 
                      id="contact-name"
                      type="text" 
                      required 
                      placeholder={language === 'gu' ? 'દા.ત. રમેશભાઈ પટેલ' : language === 'hi' ? 'उदा. रमेश पटेल' : 'e.g. Ramesh Patel'}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={{ padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label htmlFor="contact-phone" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-medium)' }}>
                      {t('contact.phoneLabel', 'Phone Number *')}
                    </label>
                    <input 
                      id="contact-phone"
                      type="tel" 
                      required 
                      maxLength={10}
                      placeholder={language === 'gu' ? '૧૦ આંકડાનો મોબાઈલ નંબર' : language === 'hi' ? '१० अंकों का मोबाइल नंबर' : '10-digit mobile number'}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      style={{ padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label htmlFor="contact-email" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-medium)' }}>
                    {t('cart.email', 'Email Address')}
                  </label>
                  <input 
                    id="contact-email"
                    type="email" 
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value.toLowerCase())}
                    style={{ padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: 1 }}>
                  <label htmlFor="contact-msg" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-medium)' }}>
                    {t('contact.messageLabel', 'Medicines List / Message *')}
                  </label>
                  <textarea 
                    id="contact-msg"
                    required 
                    rows="5" 
                    placeholder={language === 'gu' ? 'આપની જરૂરિયાત કે દવાઓની વિગત અહીં લખો...' : language === 'hi' ? 'अपनी आवश्यकता या दवाओं का विवरण यहाँ लिखें...' : 'Write your requirement or question here...'}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    style={{ padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem', resize: 'vertical', flex: 1, minHeight: '120px' }}
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="btn btn-primary" 
                  style={{ width: '100%', height: '48px', gap: '10px', marginTop: '10px' }}
                >
                  <Send size={16} />
                  {isSubmitting ? t('common.loading', 'Sending...') : t('contact.submitButton', 'Send Wholesale Inquiry')}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default Contact;
