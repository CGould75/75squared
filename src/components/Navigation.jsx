import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      padding: scrolled ? '15px 0' : '25px 0',
      transition: 'all 0.3s ease',
      background: scrolled ? 'rgba(255, 255, 255, 0.85)' : 'transparent',
      backdropFilter: scrolled ? 'blur(16px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(0,0,0,0.05)' : 'none',
      boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.02)' : 'none'
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
        {/* Logo */}
        <Link to="/" style={{ fontFamily: 'var(--font-heading)', textDecoration: 'none', fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
          <span className="text-gradient">75²</span>
          <span style={{ marginLeft: '4px', color: 'var(--color-text-main)' }}>Squared</span>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', gap: '30px', alignItems: 'center', color: 'var(--color-text-main)' }} className="desktop-menu">
          <a href="/#services" style={{ fontWeight: 600, textDecoration: 'none' }}>Services</a>
          <a href="/#about" style={{ fontWeight: 600, textDecoration: 'none' }}>Agency</a>
          <Link to="/products" style={{ fontWeight: 600, textDecoration: 'none' }}>Products</Link>
          <Link to="/platform-guide" style={{ fontWeight: 600, textDecoration: 'none', color: 'var(--color-purple-main)' }}>Platform Guide</Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <Link to="/admin/login" style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-purple-main)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
              Client Login
            </Link>
            <a href="tel:+17029070932" style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--color-text-main)', textDecoration: 'none', marginLeft: '10px' }}>
              (702) 907-0932
            </a>
            <Link to="/contact" className="btn btn-primary" style={{ padding: '10px 24px', fontSize: '0.9rem', textDecoration: 'none' }}>
              Get Started
            </Link>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button className="mobile-toggle" style={{ background: 'transparent', border: 'none', color: 'var(--color-text-main)', cursor: 'pointer' }} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      <style>{`
        .desktop-menu { display: flex; }
        .desktop-menu a:hover { color: var(--color-purple-main); }
        .mobile-toggle { display: none; }
        @media (max-width: 768px) {
          .desktop-menu { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>
    </nav>
  );
};

export default Navigation;
