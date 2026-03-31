import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Cpu } from 'lucide-react';
import { servicesData } from '../data/services.jsx';

const FloatingBadge = ({ serviceKeys, id, position, delay, zIndex }) => {
  const [isHovered, setIsHovered] = useState(false);
  const service = servicesData.find(s => s.id === id);
  if (!service) return null;

  return (
    <div 
      className="glass-panel animate-float"
      style={{
        position: 'absolute',
        ...position,
        animationDelay: delay,
        zIndex: isHovered ? 50 : zIndex,
        cursor: 'pointer'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{
        padding: '12px 20px',
        borderRadius: '99px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        position: 'relative'
      }}>
        <div style={{ background: service.colorHover, borderRadius: '50%', padding: '8px', display: 'flex' }}>
          {service.icon}
        </div>
        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text-main)', whiteSpace: 'nowrap' }}>
          {service.title}
        </div>
      </div>

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            style={{
              position: 'absolute',
              top: '120%',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(0,0,0,0.05)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
              borderRadius: '24px',
              padding: '24px',
              width: '320px',
              pointerEvents: 'auto',
              zIndex: 100
            }}
          >
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-purple-main)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
              Our Unique Approach
            </div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '16px' }}>
              {service.description}
            </p>
            <Link to={`/services/${service.id}`} style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'linear-gradient(135deg, var(--color-purple-main), var(--color-blue-main))',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '99px',
              fontWeight: 700,
              fontSize: '0.85rem',
              textDecoration: 'none',
              boxShadow: '0 4px 15px rgba(147, 51, 234, 0.2)'
            }}>
              Explore Capability <ArrowRight size={14} />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Hero = () => {
  return (
    <section style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      paddingTop: '80px',
      position: 'relative'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '60px',
          alignItems: 'center'
        }}>
          
          {/* Text Content */}
          <div style={{ maxWidth: '600px', zIndex: 20 }}>
            <h1 style={{
              fontSize: 'clamp(3rem, 5vw, 4.5rem)',
              marginBottom: '24px',
              fontWeight: 800,
              letterSpacing: '-1px'
            }}>
              Accelerate Your <br />
              <span className="text-gradient">Growth</span> through <br />
              Digital Innovation.
            </h1>
            
            <p style={{
              fontSize: '1.2rem',
              color: 'var(--color-text-muted)',
              marginBottom: '40px',
              maxWidth: '500px'
            }}>
              We fuse advanced <strong style={{ color: 'var(--color-text-main)', fontWeight: 700 }}>Software Development</strong> with powerful <strong style={{ color: 'var(--color-text-main)', fontWeight: 700 }}>Digital Marketing</strong> for unparalleled agency success. Engineered from Las Vegas for global impact.
            </p>

            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <a href="#services" className="btn btn-primary" style={{ textDecoration: 'none' }}>
                Our Services <Play size={18} fill="currentColor" />
              </a>
              <Link to="/contact" className="btn btn-outline" style={{ textDecoration: 'none' }}>
                Request a Proposal <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          {/* Interactive Visual Elements */}
          <div style={{ position: 'relative', height: '540px' }}>
            
            {/* Center Node (Always behind the floaters but glowing) */}
            <div className="glass-panel animate-pulse" style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              padding: '24px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--color-purple-main), var(--color-purple-dark))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animationDelay: '0.5s',
              zIndex: 1
            }}>
              <Cpu size={36} color="white" />
            </div>

            <FloatingBadge 
              id="digital-marketing"
              position={{ top: '25%', right: '-10%' }}
              delay="0s"
              zIndex={5}
            />

            <FloatingBadge 
              id="custom-websites"
              position={{ bottom: '5%', left: '-5%' }}
              delay="1.5s"
              zIndex={6}
            />

            <FloatingBadge 
              id="seo-geo-optimization"
              position={{ top: '5%', left: '0%' }}
              delay="0.8s"
              zIndex={7}
            />

            <FloatingBadge 
              id="software-solutions"
              position={{ bottom: '15%', right: '-5%' }}
              delay="1.2s"
              zIndex={8}
            />

            <FloatingBadge 
              id="email-marketing"
              position={{ top: '40%', left: '-20%' }}
              delay="2.0s"
              zIndex={9}
            />

            <FloatingBadge 
              id="ai-integration"
              position={{ top: '-10%', right: '-5%' }}
              delay="2.5s"
              zIndex={10}
            />

            <FloatingBadge 
              id="enterprise-dashboards"
              position={{ top: '15%', left: '-15%' }}
              delay="2.2s"
              zIndex={4}
            />

            <FloatingBadge 
              id="database-modernization"
              position={{ bottom: '-15%', left: '15%' }}
              delay="1.7s"
              zIndex={8}
            />

          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
