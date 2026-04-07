import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{ background: 'var(--color-bg-light)', borderTop: '1px solid rgba(0, 0, 0, 0.05)', padding: '60px 0 30px' }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '40px',
          marginBottom: '60px'
        }}>
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800, marginBottom: '16px' }}>
              <span className="text-gradient">75²</span><span style={{ marginLeft: '4px', color: 'var(--color-text-main)' }}>Squared</span>
            </div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', maxWidth: '250px', marginBottom: '16px' }}>
              Las Vegas based premium digital agency. Engineering scalable web applications and high-conversion marketing.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.95rem' }}>
              <a href="tel:+17029070932" style={{ textDecoration: 'none', color: 'var(--color-text-main)', fontWeight: 700 }}>(702) 907-0932</a>
              <a href="mailto:chris@75squared.com" style={{ textDecoration: 'none', color: 'var(--color-purple-main)', fontWeight: 600 }}>chris@75squared.com</a>
            </div>
          </div>
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', color: 'var(--color-text-main)' }}>Solutions</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
              <Link to="/services/digital-marketing" style={{ textDecoration: 'none', color: 'inherit' }}>Digital Marketing</Link>
              <Link to="/services/seo-geo-optimization" style={{ textDecoration: 'none', color: 'inherit' }}>SEO Strategies</Link>
              <Link to="/services/custom-websites" style={{ textDecoration: 'none', color: 'inherit' }}>Custom Web Apps</Link>
              <Link to="/services/software-solutions" style={{ textDecoration: 'none', color: 'inherit' }}>Backend Engineering</Link>
            </div>
          </div>
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', color: 'var(--color-text-main)' }}>Agency</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
              <a href="/#about" style={{ textDecoration: 'none', color: 'inherit' }}>Our Approach</a>
              <a href="/#services" style={{ textDecoration: 'none', color: 'inherit' }}>Expertise</a>
              <Link to="/contact" style={{ textDecoration: 'none', color: 'inherit' }}>Careers</Link>
              <Link to="/contact" style={{ textDecoration: 'none', color: 'inherit' }}>Contact Us</Link>
            </div>
          </div>
        </div>
        
        <div style={{ borderTop: '1px solid rgba(0, 0, 0, 0.05)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: 'var(--color-text-muted)', flexWrap: 'wrap', gap: '20px' }}>
          <div>&copy; {new Date().getFullYear()} 75 Squared Agency. All rights reserved.</div>
          <div style={{ display: 'flex', gap: '16px' }}>
             <a href="#privacy">Privacy Policy</a>
             <a href="#terms">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
