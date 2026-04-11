import React from 'react';
import { Network, Video, ArrowRight, ShieldCheck, Zap, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';

export default function Products() {
  return (
    <div className="page-transition">
      <SEOHead 
        title="Our Products | 75 Squared Agency"
        description="Explore the premier SaaS platforms and tools developed by 75 Squared."
        path="/products"
      />

      <section className="section-padding" style={{ paddingTop: '160px', background: 'var(--color-bg-light)', minHeight: '100vh' }}>
        <div className="container">
          
          <div className="text-center" style={{ marginBottom: '80px', maxWidth: '800px', margin: '0 auto 80px auto' }}>
            <h1 className="heading-xl" style={{ marginBottom: '24px' }}>
              <span className="text-gradient">Products</span> & Ecosystem
            </h1>
            <p style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
              We build scalable, enterprise-grade software to consolidate your workflows. Access our flagship platforms below.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '30px', maxWidth: '1000px', margin: '0 auto' }}>
            
            {/* Nexus Product Card */}
            <div className="glass-panel" style={{ padding: '40px', borderRadius: '24px', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: 'var(--color-purple-main)', filter: 'blur(100px)', opacity: 0.15, borderRadius: '50%' }}></div>
              
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--color-purple-main)', padding: '10px 16px', borderRadius: '12px', width: 'fit-content', marginBottom: '24px', fontWeight: 800 }}>
                <Network size={20} />
                Nexus SaaS
              </div>
              
              <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '16px' }}>The Hive Mind</h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '32px', flexGrow: 1 }}>
                Our proprietary central operating system. Includes comprehensive tools for ranking tracking, CRM, heatmap analytics, SEO monitoring, global system logs, and directory aggregation.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 600, color: 'var(--color-text-main)' }}>
                  <ShieldCheck size={20} color="#10B981" /> Multi-Tenant Role Isolation
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 600, color: 'var(--color-text-main)' }}>
                  <Globe size={20} color="var(--color-purple-main)" /> 20+ Integrated Modules
                </div>
              </div>

              <Link to="/admin/login" className="btn btn-primary" style={{ width: '100%', padding: '16px', fontSize: '1.1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                Access Nexus Portal <ArrowRight size={20} />
              </Link>
            </div>

            {/* Sync Space Product Card */}
            <div className="glass-panel" style={{ padding: '40px', borderRadius: '24px', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: '#22C55E', filter: 'blur(100px)', opacity: 0.15, borderRadius: '50%' }}></div>
              
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', background: 'rgba(34, 197, 94, 0.1)', color: '#10B981', padding: '10px 16px', borderRadius: '12px', width: 'fit-content', marginBottom: '24px', fontWeight: 800 }}>
                <Video size={20} />
                Sync Space
              </div>
              
              <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '16px' }}>Standalone Video Platform</h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '32px', flexGrow: 1 }}>
                A premium, glassmorphic WebRTC video conferencing engine. Features serverless P2P mass-file transfers, real-time screen control signals, Picture-in-Picture, and built-in data channels.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 600, color: 'var(--color-text-main)' }}>
                  <Zap size={20} color="#F59E0B" /> Unlimited P2P Transfers
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 600, color: 'var(--color-text-main)' }}>
                  <Network size={20} color="#10B981" /> High-FPS OS Control Signalling
                </div>
              </div>

              <a href="http://localhost:8080" target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ width: '100%', padding: '16px', fontSize: '1.1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', border: '2px solid rgba(0,0,0,0.1)' }}>
                Launch Prototype App <ArrowRight size={20} />
              </a>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
