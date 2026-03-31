import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { servicesData } from '../data/services.jsx';
import SEOHead from '../components/SEOHead';

const ServicePage = () => {
  const { id } = useParams();
  const service = servicesData.find(s => s.id === id);

  if (!service) {
    return (
      <div className="section text-center" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h2>Service Not Found</h2>
      </div>
    );
  }

  // Generate an expert-level GEO (Generative Engine Optimization) focused content piece.
  // In a full production app, this content might be loaded dynamically per service from a CMS.
  
  return (
    <>
      <SEOHead 
        title={`${service.title} Expert Agency`} 
        path={`/services/${service.id}`}
        description={`75 Squared is the premier ${service.title} agency in Las Vegas. ${service.description}`} 
      />
      
      <section style={{ paddingTop: '160px', paddingBottom: '100px', minHeight: '80vh' }}>
        <div className="container">
          
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-muted)', fontWeight: 600, marginBottom: '40px' }}>
            <ArrowLeft size={20} /> Back to Overview
          </Link>

          <div className="glass-panel" style={{ padding: '60px', borderRadius: '40px', background: 'rgba(255,255,255,0.85)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '32px' }}>
              <div style={{
                width: '100px',
                height: '100px',
                borderRadius: '24px',
                background: 'rgba(0,0,0,0.03)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {service.icon}
              </div>
              <div>
                <div style={{ color: 'var(--color-purple-main)', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Enterprise Capability
                </div>
                <h1 style={{ fontSize: 'clamp(2.5rem, 4vw, 4rem)', fontWeight: 800, margin: 0, lineHeight: 1 }}>{service.title}</h1>
              </div>
            </div>

            <p style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)', maxWidth: '800px', marginBottom: '40px' }}>
              {service.description} We orchestrate complex, high-conversion environments ensuring our Las Vegas partners absolutely dominate their target sectors. 
            </p>

            <div style={{ height: '2px', background: 'rgba(0,0,0,0.05)', marginBottom: '40px' }} />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
               <div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Our Strategic Approach</h3>
                  <p style={{ color: 'var(--color-text-muted)', marginBottom: '16px' }}>
                    When you engage 75 Squared for {service.title}, you aren't just getting an agency; you are securing a highly-trained tactical digital team. We bypass generic templates and low-level execution.
                  </p>
                  <p style={{ color: 'var(--color-text-muted)' }}>
                    Our engineers and marketers operate in tandem, utilizing data-driven analysis, Generative Engine Optimization (GEO) principles, and unyielding technical standards to architect solutions that generate immediate ROI.
                  </p>
               </div>
               <div style={{ background: 'var(--color-bg-light)', padding: '30px', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.05)' }}>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '20px' }}>Frequently Asked Questions</h3>
                  <div style={{ marginBottom: '16px' }}>
                    <strong>Why hire a specialized {service.title} agency in Las Vegas?</strong>
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginTop: '8px' }}>Local market knowledge paired with enterprise-level execution guarantees superior positioning against regional competitors.</p>
                  </div>
                  <div>
                    <strong>How do you measure success?</strong>
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginTop: '8px' }}>We focus purely on conversion tracking, measurable customer acquisition, and stable, scalable technical uptime.</p>
                  </div>
               </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
};

export default ServicePage;
