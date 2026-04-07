import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import SEOHead from '../components/SEOHead';

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      e.target.reset();
    }, 1200);
  };

  return (
    <>
      <SEOHead 
        title="Contact & Request Proposal" 
        path="/contact"
        description="Get in touch with 75 Squared in Las Vegas. Request a custom proposal for digital marketing, SEO optimization, or enterprise application development."
      />
      
      <section style={{ paddingTop: '160px', paddingBottom: '100px', minHeight: '80vh' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <div style={{ color: 'var(--color-green-main)', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px' }}>
              Initiate Project
            </div>
            <h1 style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', fontWeight: 800 }}>
              Let's Build Something <br />
              <span className="text-gradient">Extraordinary</span>
            </h1>
            <p style={{ maxWidth: '600px', margin: '24px auto', color: 'var(--color-text-muted)', fontSize: '1.2rem' }}>
              Whether you need elite digital marketing or custom software architecture, our Las Vegas team is ready to scale your operations.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px', maxWidth: '1000px', margin: '0 auto' }}>
            
            {/* Contact Information */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              <div className="glass-panel" style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '10px' }}>Direct Contact</h3>
                
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{ padding: '12px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', color: 'var(--color-blue-main)' }}>
                    <MapPin size={24} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, marginBottom: '4px' }}>Headquarters</div>
                    <div style={{ color: 'var(--color-text-muted)' }}>Las Vegas, NV<br/>United States</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{ padding: '12px', background: 'rgba(147, 51, 234, 0.1)', borderRadius: '12px', color: 'var(--color-purple-main)' }}>
                    <Mail size={24} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, marginBottom: '4px' }}>Email Inquiries</div>
                    <a href="mailto:hello@75squared.com" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>hello@75squared.com</a>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', color: 'var(--color-green-main)' }}>
                    <Phone size={24} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, marginBottom: '4px' }}>Phone</div>
                    <a href="tel:+17029070932" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>(702) 907-0932</a>
                  </div>
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '40px', background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.05), rgba(59, 130, 246, 0.05))' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '10px' }}>Our Commitment</h3>
                <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
                  We operate with strict confidentiality and uncompromising technical standards. All proposals are custom-built after careful analysis of your digital infrastructure and market ceiling.
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="glass-panel" style={{ padding: '40px' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px' }}>Request a Proposal</h3>
              
              {submitStatus === 'success' ? (
                <div style={{ padding: '24px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '16px', color: 'var(--color-green-dark)' }}>
                  <div style={{ fontWeight: 700, marginBottom: '8px' }}>Transmission Successful</div>
                  <div>Thank you. A 75 Squared strategist will review your inquiry and contact you within 24 hours.</div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px', color: 'var(--color-text-main)' }}>Full Name</label>
                      <input type="text" required placeholder="John Doe" style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', background: 'var(--color-bg-light)', outline: 'none' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px', color: 'var(--color-text-main)' }}>Email Address</label>
                      <input type="email" required placeholder="john@company.com" style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', background: 'var(--color-bg-light)', outline: 'none' }} />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px', color: 'var(--color-text-main)' }}>Primary Interest</label>
                    <select required style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', background: 'var(--color-bg-light)', outline: 'none', color: 'var(--color-text-main)' }}>
                      <option value="" disabled selected>Select a Service</option>
                      <option value="marketing">Digital Marketing & SEO</option>
                      <option value="software">Custom Software & Apps</option>
                      <option value="ai">AI Integration</option>
                      <option value="comprehensive">Comprehensive Agency Record</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px', color: 'var(--color-text-main)' }}>Project Details</label>
                    <textarea required placeholder="Tell us about your goals, current bottlenecks, and timeline..." rows="4" style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', background: 'var(--color-bg-light)', outline: 'none', resize: 'vertical' }}></textarea>
                  </div>

                  <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}>
                    {isSubmitting ? 'Transmitting...' : (
                      <>Send Inquiry <Send size={18} /></>
                    )}
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
