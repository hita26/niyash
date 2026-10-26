import React, { useState } from 'react';
import { Send, CheckCircle2, ShieldAlert, CheckSquare, Layers, AlertCircle } from 'lucide-react';

function Manufacturing() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
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
    if (cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsSubmitting(true);

    try {
      const fullMessage = `Company: ${company.trim()}\nRequested Formulations: ${formulations.trim()}\nEstimated Batch Size: ${batchSize.trim()}\n\nNotes: ${message.trim()}`;

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
        setFormulations('');
        setBatchSize('');
        setMessage('');
        setTimeout(() => setIsSuccess(false), 6000);
      } else {
        setErrorMessage(data.message || 'Failed to submit manufacturing enquiry.');
      }
    } catch (error) {
      console.error('Error submitting manufacturing form:', error);
      setErrorMessage('Network connection error. Please check your internet and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const highlights = [
    { title: 'WHO-GMP Compliant', desc: 'All contract manufacturing formulations are processed in state-of-the-art WHO-GMP certified facilities.' },
    { title: 'Custom Formulations', desc: 'Capable of manufacturing tablets, capsules, dry syrups, ointments, and injectables under your brand label.' },
    { title: 'Rigorous Quality Checks', desc: 'In-house quality control testing laboratories check raw materials, intermediates, and final batches.' },
    { title: 'Optimized Turnaround Time', desc: 'Efficient production planning and logistical coordination guarantee timely dispatch of final formulations.' }
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
            Third-Party & Contract Manufacturing
          </span>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Pharmaceutical Manufacturing</h1>
          <p style={{ color: 'var(--text-medium)', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '30px' }}>
            Niyansh Pharma facilitates high-quality contract manufacturing and third-party production services for domestic pharmaceutical companies. Leverage our partner network of WHO-GMP certified production units to manufacture your formulations with guaranteed quality standards.
          </p>

          <h2 style={{ fontSize: '1.4rem', marginBottom: '25px' }}>Manufacturing Advantages</h2>
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
        </div>

        {/* Form Column */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="card sticky-form-desktop" style={{ padding: '30px', position: 'sticky', top: '100px' }}>
            <h2 style={{ fontSize: '1.4rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Layers size={22} color="var(--primary-blue)" /> Manufacturing Enquiry Form
            </h2>

            {isSuccess ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '15px', textAlign: 'center', padding: '40px 0' }}>
                <CheckCircle2 size={54} color="var(--secondary-green)" />
                <h3 style={{ color: 'var(--secondary-green)' }}>Enquiry Sent!</h3>
                <p style={{ color: 'var(--text-medium)', fontSize: '0.95rem' }}>
                  Your formulation manufacturing enquiry has been successfully registered. Our technical production team will contact you to discuss drug master files (DMF) and batch pricing.
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
                    <label htmlFor="mfg-name" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-medium)' }}>Your Name *</label>
                    <input 
                      id="mfg-name"
                      type="text" 
                      required 
                      placeholder="Enter name"
                      value={name}
                      onChange={(e) => { setName(e.target.value); if (errorMessage) setErrorMessage(''); }}
                      style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label htmlFor="mfg-phone" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-medium)' }}>Phone Number *</label>
                    <input 
                      id="mfg-phone"
                      type="tel" 
                      required 
                      placeholder="Enter mobile"
                      value={phone}
                      onChange={(e) => { setPhone(e.target.value); if (errorMessage) setErrorMessage(''); }}
                      style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label htmlFor="mfg-email" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-medium)' }}>Email ID *</label>
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
                    <label htmlFor="mfg-company" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-medium)' }}>Company Name *</label>
                    <input 
                      id="mfg-company"
                      type="text" 
                      required 
                      placeholder="Enter firm name"
                      value={company}
                      onChange={(e) => { setCompany(e.target.value); if (errorMessage) setErrorMessage(''); }}
                      style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label htmlFor="mfg-formulations" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-medium)' }}>Formulation Type *</label>
                    <select 
                      id="mfg-formulations"
                      required
                      value={formulations}
                      onChange={(e) => setFormulations(e.target.value)}
                      style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem', backgroundColor: '#fff' }}
                    >
                      <option value="">Select Category</option>
                      <option value="Tablets">Tablets (Beta-Lactam / Non-Beta)</option>
                      <option value="Capsules">Capsules (Hard / Soft Gelatin)</option>
                      <option value="Liquid Orals">Liquid Orals (Syrups / Suspensions)</option>
                      <option value="Injectables">Injectables (Liquid / Dry Powder)</option>
                      <option value="Ointments">Ointments / Creams / Gels</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label htmlFor="mfg-batch" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-medium)' }}>Est. Batch Size *</label>
                    <input 
                      id="mfg-batch"
                      type="text" 
                      required
                      placeholder="E.g., 50k tablets"
                      value={batchSize}
                      onChange={(e) => setBatchSize(e.target.value)}
                      style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label htmlFor="mfg-notes" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-medium)' }}>Formulation details / special notes</label>
                  <textarea 
                    id="mfg-notes"
                    rows="3" 
                    placeholder="Enter composition details, packing requirements (Alu-Alu / Blister)..."
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
                  {isSubmitting ? 'Sending Request...' : 'Send Manufacturing Enquiry'}
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Manufacturing;
