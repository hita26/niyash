import React, { useState } from 'react';
import { Briefcase, Upload, Send, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

function Career() {
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
    { title: 'Sales Executive (Rajkot / Gondal)', dept: 'Field Sales', type: 'Full Time', desc: 'Promote products to medical stores and collect orders.' },
    { title: 'Warehouse In-charge', dept: 'Logistics & Inventory', type: 'Full Time', desc: 'Manage pharmaceutical stocks, batch details, and packaging.' },
    { title: 'Delivery Partner (Local)', dept: 'Distribution', type: 'Full Time / Part Time', desc: 'Deliver products safely and timely to local hospitals and pharmacies.' },
    { title: 'Telecaller / Order Clerk', dept: 'Customer Support', type: 'Full Time', desc: 'Call medical stores, book wholesale orders, and handle general enquiries.' }
  ];

  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]);
    setErrorMessage('');
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!resumeFile) {
      setErrorMessage('Please upload your resume (PDF or Word document).');
      return;
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('position', position);
      formData.append('experience', experience);
      formData.append('coverLetter', coverLetter);
      formData.append('resume', resumeFile);

      const response = await fetch('/api/careers', {
        method: 'POST',
        body: formData, // FormData automatically sets correct headers
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
        // Reset file input
        const fileInput = document.getElementById('career-resume');
        if (fileInput) fileInput.value = '';
        
        setTimeout(() => setIsSuccess(false), 6000);
      } else {
        setErrorMessage(data.message || 'Failed to submit application. Please check your details.');
      }
    } catch (error) {
      console.error('Error submitting career form:', error);
      setErrorMessage('Network connection error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="section animate-fade-in" style={{ backgroundColor: 'var(--bg-main)' }}>
      <div className="container responsive-split-layout">
        
        {/* Left: Job Listings */}
        <div>
          <h1 style={{ fontSize: '2.2rem', marginBottom: '15px' }}>Careers at Niyansh Pharma</h1>
          <p style={{ color: 'var(--text-medium)', marginBottom: '35px', fontSize: '1.05rem', lineHeight: '1.6' }}>
            Join our growing team and build a rewarding career in pharmaceutical distribution. We offer competitive salaries, performance incentives, and a collaborative work environment.
          </p>

          <h2 style={{ fontSize: '1.4rem', marginBottom: '20px' }}>Current Openings</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {positions.map((pos, i) => (
              <div key={i} className="card" style={{ padding: '25px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-blue)' }}>{pos.title}</h3>
                  <span style={{ fontSize: '0.75rem', padding: '4px 10px', backgroundColor: 'rgba(56, 142, 60, 0.1)', color: 'var(--secondary-green)', borderRadius: '20px', fontWeight: '700' }}>
                    {pos.type}
                  </span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', display: 'flex', gap: '15px' }}>
                  <span>Department: <strong>{pos.dept}</strong></span>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-medium)', lineHeight: '1.5' }}>{pos.desc}</p>
                <button 
                  onClick={() => {
                    setPosition(pos.title);
                    document.getElementById('career-form-container')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  style={{ alignSelf: 'flex-start', color: 'var(--primary-blue)', fontWeight: '700', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '5px' }}
                >
                  Apply Now →
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Application Form */}
        <div id="career-form-container" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="card sticky-form-desktop" style={{ padding: '30px', position: 'sticky', top: '100px' }}>
            <h2 style={{ fontSize: '1.4rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Briefcase size={22} color="var(--primary-blue)" /> Submit Application
            </h2>

            {isSuccess ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '15px', textAlign: 'center', padding: '40px 0' }}>
                <CheckCircle2 size={54} color="var(--secondary-green)" />
                <h3 style={{ color: 'var(--secondary-green)' }}>Application Submitted!</h3>
                <p style={{ color: 'var(--text-medium)', fontSize: '0.95rem' }}>
                  Thank you for applying to Niyansh Pharma. Our HR department will review your resume and contact you if your profile matches our requirements.
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
                  <label htmlFor="career-name" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-medium)' }}>Full Name *</label>
                  <input 
                    id="career-name"
                    type="text" 
                    required 
                    placeholder="Enter name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label htmlFor="career-email" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-medium)' }}>Email *</label>
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
                    <label htmlFor="career-phone" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-medium)' }}>Phone Number *</label>
                    <input 
                      id="career-phone"
                      type="tel" 
                      required 
                      placeholder="Enter mobile"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '15px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label htmlFor="career-pos-select" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-medium)' }}>Position Applying For *</label>
                    <select 
                      id="career-pos-select"
                      required
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem', backgroundColor: '#fff' }}
                    >
                      <option value="">Select Position</option>
                      {positions.map((p, idx) => (
                        <option key={idx} value={p.title}>{p.title}</option>
                      ))}
                    </select>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label htmlFor="career-exp-select" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-medium)' }}>Experience *</label>
                    <select 
                      id="career-exp-select"
                      required
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem', backgroundColor: '#fff' }}
                    >
                      <option value="">Select Exp</option>
                      <option value="Freshers">Fresher</option>
                      <option value="1-2 Years">1-2 Years</option>
                      <option value="3+ Years">3+ Years</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label htmlFor="career-cover" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-medium)' }}>Cover Letter / Why should we hire you?</label>
                  <textarea 
                    id="career-cover"
                    rows="3" 
                    placeholder="Briefly introduce yourself..."
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem', resize: 'vertical' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label htmlFor="career-resume" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-medium)' }}>Upload Resume (PDF/Word) *</label>
                  <div style={{
                    border: '2px dashed #cbd5e1', borderRadius: '6px', padding: '15px',
                    textAlign: 'center', cursor: 'pointer', position: 'relative',
                    backgroundColor: '#f8fafc', transition: 'var(--transition-smooth)'
                  }}>
                    <Upload size={20} color="var(--text-light)" style={{ marginBottom: '5px' }} />
                    <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-medium)' }}>
                      {resumeFile ? `Selected: ${resumeFile.name}` : 'Click to select PDF or Doc file'}
                    </span>
                    <input 
                      id="career-resume"
                      type="file" 
                      accept=".pdf,.doc,.docx"
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
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Career;
