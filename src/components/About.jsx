import React from 'react';

const About = () => {
  return (
    <section id="about" className="section" style={{ background: 'rgba(0,0,0,0.02)' }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '60px',
          alignItems: 'center',
          background: 'rgba(255, 255, 255, 0.6)',
          border: '1px solid rgba(0, 0, 0, 0.05)',
          borderRadius: '32px',
          padding: 'clamp(30px, 5vw, 60px)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.02)'
        }}>
          
          <div>
            <div style={{ color: 'var(--color-green-dark)', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px' }}>
              The 75 Squared Standard
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 800, marginBottom: '24px' }}>
              Enterprise Capability.<br />
              <span className="text-gradient">Uncompromising Precision.</span>
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '1.15rem', marginBottom: '20px' }}>
              Operating out of Las Vegas, <strong>75 Squared</strong> represents the pinnacle of digital excellence. We specialize in scaling high-growth businesses through meticulously engineered software and data-driven marketing.
            </p>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '1.15rem', marginBottom: '32px' }}>
              Our team fuses decades of high-level industry experience with state-of-the-art technical architectures. When you partner with us, you align with a premium agency dedicated to absolute operational superiority, transparent reporting, and exponential measurable results.
            </p>
            
            <button className="btn btn-outline" style={{ borderColor: 'var(--color-purple-main)', color: 'var(--color-purple-main)' }}>
              Explore Our Process
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
             {/* Abstract Representation of the Agency "75 Squared" */}
             <div style={{ position: 'relative', width: '300px', height: '300px' }}>
                <div style={{
                  position: 'absolute',
                  top: '-10px',
                  left: '-10px',
                  width: '200px',
                  height: '200px',
                  borderRadius: '24px',
                  background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.8), transparent)',
                  border: '1px solid rgba(147, 51, 234, 0.3)',
                  backdropFilter: 'blur(10px)',
                  transform: 'rotate(-5deg)',
                  zIndex: 2,
                  boxShadow: '0 10px 30px rgba(147,51,234,0.1)'
                }}></div>
                <div style={{
                  position: 'absolute',
                  bottom: '10px',
                  right: '-10px',
                  width: '220px',
                  height: '220px',
                  borderRadius: '24px',
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.9), transparent)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  backdropFilter: 'blur(10px)',
                  transform: 'rotate(5deg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1,
                  boxShadow: '0 10px 30px rgba(16,185,129,0.1)'
                }}>
                  <div style={{ fontSize: '4rem', fontWeight: 800, color: 'white', textShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                    75<span style={{ fontSize: '2rem', verticalAlign: 'super' }}>2</span>
                  </div>
                </div>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;
