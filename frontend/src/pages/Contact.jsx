import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, CheckCircle2, Clock } from 'lucide-react';

function Contact() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'General Enquiry',
          name,
          phone,
          email,
          message: `Subject: ${subject}\n\n${message}`,
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
        setTimeout(() => setIsSuccess(false), 5000);
      } else {
        alert(data.message || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      alert('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="section animate-fade-in" style={{ backgroundColor: 'var(--bg-main)' }}>
      <div className="container">
        <h1 className="section-title">Contact Us</h1>
        <p className="section-subtitle">Reach out to Niyansh Pharma for wholesale distributorship queries, orders, or support.</p>

        <div className="contact-layout">
          
          {/* Contact Details & Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <div className="card" style={{ padding: '30px', flex: 1, display: 'flex', flexDirection: 'column', gap: '25px' }}>
              <h2 style={{ fontSize: '1.4rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px' }}>Get In Touch</h2>
              
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <li style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                  <div style={{ backgroundColor: 'rgba(12, 61, 108, 0.08)', padding: '10px', borderRadius: '10px', color: 'var(--primary-blue)', display: 'flex' }}>
                    <MapPin size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', marginBottom: '4px' }}>Office Address</h3>
                    <p style={{ color: 'var(--text-medium)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                      Block no. 52B, Panchayat Nagar-3,<br />
                      Ram Park Main Road, University Rd,<br />
                      Above Jan Aarogya Sevao,<br />
                      Rajkot, Gujarat - 360005.
                    </p>
                  </div>
                </li>

                <li style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                  <div style={{ backgroundColor: 'rgba(12, 61, 108, 0.08)', padding: '10px', borderRadius: '10px', color: 'var(--primary-blue)', display: 'flex' }}>
                    <Phone size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', marginBottom: '4px' }}>Phone Numbers</h3>
                    <p style={{ color: 'var(--text-medium)', fontSize: '0.9rem' }}>
                      Mobile: <a href="tel:+919909923130" style={{ color: 'var(--text-dark)', fontWeight: '600' }}>+91 99099 23130</a>
                    </p>
                  </div>
                </li>

                <li style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                  <div style={{ backgroundColor: 'rgba(12, 61, 108, 0.08)', padding: '10px', borderRadius: '10px', color: 'var(--primary-blue)', display: 'flex' }}>
                    <Mail size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', marginBottom: '4px' }}>Email Address</h3>
                    <p style={{ color: 'var(--text-medium)', fontSize: '0.9rem' }}>
                      General: <a href="mailto:NiyanshPharma@gmail.com" style={{ color: 'var(--text-dark)', fontWeight: '600' }}>NiyanshPharma@gmail.com</a>
                    </p>
                  </div>
                </li>

                <li style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                  <div style={{ backgroundColor: 'rgba(12, 61, 108, 0.08)', padding: '10px', borderRadius: '10px', color: 'var(--primary-blue)', display: 'flex' }}>
                    <Clock size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', marginBottom: '4px' }}>Business Hours</h3>
                    <p style={{ color: 'var(--text-medium)', fontSize: '0.9rem' }}>
                      Monday – Saturday: 9:00 AM – 7:00 PM<br />
                      Sunday: Closed
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Embedded Google Map (Interactive representation) */}
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
              Send Us A Message
            </h2>
            
            {isSuccess ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: '15px', textAlign: 'center', padding: '40px 0' }}>
                <CheckCircle2 size={54} color="var(--secondary-green)" />
                <h3 style={{ color: 'var(--secondary-green)' }}>Message Sent!</h3>
                <p style={{ color: 'var(--text-medium)', fontSize: '0.95rem' }}>
                  Thank you for contacting Niyansh Pharma. We have received your query and will reply within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', flex: 1 }}>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label htmlFor="contact-name" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-medium)' }}>Your Name *</label>
                    <input 
                      id="contact-name"
                      type="text" 
                      required 
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={{ padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label htmlFor="contact-phone" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-medium)' }}>Phone Number *</label>
                    <input 
                      id="contact-phone"
                      type="tel" 
                      required 
                      placeholder="99099 XXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      style={{ padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label htmlFor="contact-email" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-medium)' }}>Email Address</label>
                  <input 
                    id="contact-email"
                    type="email" 
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label htmlFor="contact-subject" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-medium)' }}>Subject *</label>
                  <input 
                    id="contact-subject"
                    type="text" 
                    required 
                    placeholder="Wholesale Distributorship Query"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    style={{ padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: 1 }}>
                  <label htmlFor="contact-msg" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-medium)' }}>Message *</label>
                  <textarea 
                    id="contact-msg"
                    required 
                    rows="5" 
                    placeholder="Write your message detail here..."
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
                  {isSubmitting ? 'Sending Message...' : 'Send Message'}
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
