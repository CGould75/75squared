import React from 'react';
import { Link } from 'react-router-dom';
import { servicesData } from '../data/services.jsx';

const Services = () => {
  return (
    <section id="services" className="section" style={{ position: 'relative', background: 'rgba(0,0,0,0.01)' }}>
      <div className="container">
        <div className="text-center mb-8">
          <div style={{ color: 'var(--color-purple-main)', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px' }}>
            Our Expertise
          </div>
          <h2 style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', fontWeight: 800 }}>
            Comprehensive Digital <br />
            <span className="text-gradient">Powerhouse</span>
          </h2>
          <p style={{ maxWidth: '600px', margin: '24px auto', color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>
            From high-converting marketing funnels and generative AI to robust backend architectures, we provide end-to-end technology solutions.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '30px',
          marginTop: '60px'
        }}>
          {servicesData.map((service, index) => (
             <Link to={`/services/${service.id}`} key={index} className="glass-panel hover-grow" style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '20px', textDecoration: 'none' }}>
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '16px',
                background: 'rgba(0, 0, 0, 0.03)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '8px',
                color: 'var(--color-text-main)' // fallback
              }}>
                {service.icon}
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text-main)' }}>{service.title}</h3>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
                {service.description}
              </p>
              <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-purple-main)' }}>
                  Explore Capability &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
