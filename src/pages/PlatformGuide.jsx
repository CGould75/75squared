import React, { useState } from 'react';
import { ArrowRight, Share2, MessageCircle, Briefcase, Mail, CheckCircle2, Copy } from 'lucide-react';
import { Link } from 'react-router-dom';

const PlatformGuide = () => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Simulated link copy
  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      {/* Hero Section */}
      <section style={{ padding: '120px 5%', textAlign: 'center', background: 'radial-gradient(circle at top, rgba(147, 51, 234, 0.1), transparent 50%)' }}>
        <div style={{ display: 'inline-block', position: 'relative' }}>
          <h1 style={{ fontSize: '4rem', fontWeight: 800, marginBottom: '24px', letterSpacing: '-1px' }}>
            The 75 Squared <span className="text-gradient">Super App</span>
          </h1>
          <div style={{ position: 'absolute', top: '-20px', right: '-40px', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--color-blue-main)', padding: '6px 16px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 800, transform: 'rotate(12deg)' }}>
            VANGUARD UPDATE
          </div>
        </div>
        <p style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)', maxWidth: '800px', margin: '0 auto 40px', lineHeight: '1.8' }}>
          The only end-to-end agency operating system built with autonomous DOM mutation, NLP-driven execution, and zero-latency thermal analytics. Read the architectural guide below.
        </p>
        
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
          <Link to="/admin/login" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '16px 32px' }}>
            Access Client Hub
          </Link>
          <button onClick={() => setIsShareModalOpen(true)} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem', padding: '16px 32px', background: 'white' }}>
            <Share2 size={20} /> Share Platform Guide
          </button>
        </div>
      </section>

      {/* Guide Content */}
      <section style={{ padding: '0 5% 120px', maxWidth: '1000px', margin: '0 auto' }}>
        <div className="glass-panel" style={{ padding: '60px', borderRadius: '24px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '30px', borderBottom: '2px solid rgba(0,0,0,0.05)', paddingBottom: '20px' }}>Capabilities Overview</h2>
          
          <div style={{ display: 'grid', gap: '40px' }}>
            <div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '16px', color: 'var(--color-purple-main)' }}>1. The Ghost Editor (Algorithmic A/B Testing)</h3>
              <p style={{ color: 'var(--color-text-main)', fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '16px' }}>
                Stop guessing why your landing page isn't converting. Our system tracks millions of micro-interactions via edge-rendered Javascript. When a DOM element fails statistically (e.g. low CTR, high rage-clicks), the AI <strong>automatically writes new layout code</strong> and places it in your approval queue. One click, and it injects the new design live to 50% of your traffic.
              </p>
            </div>

            <div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '16px', color: 'var(--color-purple-main)' }}>2. Nexus Natural Language Command</h3>
              <p style={{ color: 'var(--color-text-main)', fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '16px' }}>
                No more navigating nested menus. The Nexus Hub is powered by an omnipresent NLP command palette. Hit <kbd style={{ background: 'var(--color-bg-light)', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.1)' }}>Cmd+K</kbd> anywhere across the app and type <em>"Draft an abandoned cart email"</em>, and the system mechanically routes and boots the action directly.
              </p>
            </div>

            <div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '16px', color: 'var(--color-purple-main)' }}>3. True Bi-Directional API Sync</h3>
              <p style={{ color: 'var(--color-text-main)', fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '16px' }}>
                We understand legacy tech debt. If you are stuck in an annual contract with Mailchimp or Salesforce, 75 Squared acts as your central brain without forcing you to migrate. You can pull your legacy subscriber lists into our structural DB, run our superior analytics over them, and systematically push the computed triggers backward into your old software via API.
              </p>
            </div>

            <div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '16px', color: 'var(--color-purple-main)' }}>4. Edge-Constrained Throttling</h3>
              <p style={{ color: 'var(--color-text-main)', fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '16px' }}>
                Don't destroy your Google Core Web Vitals with heavy tracking scripts. Our remote trackers only execute during specific operating hours, and can target fractional percentages (e.g. 1 out of every 10 users). This mathematically guarantees your site remains blazing fast while collecting massive data scopes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Share Modal Overlay */}
      {isShareModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="fade-in" style={{ background: 'white', padding: '40px', borderRadius: '24px', width: '100%', maxWidth: '500px', boxShadow: '0 25px 50px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Share Platform Guide</h3>
              <button onClick={() => setIsShareModalOpen(false)} style={{ background: 'var(--color-bg-light)', border: 'none', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '30px' }}>
              <button style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', background: 'rgba(29, 155, 240, 0.05)', border: '1px solid rgba(29, 155, 240, 0.1)', borderRadius: '12px', cursor: 'pointer' }}>
                 <MessageCircle size={24} color="#1DA1F2" />
                 <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Twitter / X</span>
              </button>
              <button style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', background: 'rgba(10, 102, 194, 0.05)', border: '1px solid rgba(10, 102, 194, 0.1)', borderRadius: '12px', cursor: 'pointer' }}>
                 <Briefcase size={24} color="#0A66C2" />
                 <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>LinkedIn</span>
              </button>
              <button style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.1)', borderRadius: '12px', cursor: 'pointer' }}>
                 <Share2 size={24} color="#3B82F6" />
                 <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Facebook</span>
              </button>
              <button style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', background: 'var(--color-bg-light)', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '12px', cursor: 'pointer' }}>
                 <Mail size={24} color="var(--color-text-muted)" />
                 <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Email Friend</span>
              </button>
            </div>

            <div style={{ background: 'var(--color-bg-light)', padding: '12px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid rgba(0,0,0,0.05)' }}>
               <div style={{ flexGrow: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--color-text-muted)', fontSize: '0.9rem', fontFamily: 'monospace' }}>
                 https://75squared.com/platform-guide
               </div>
               <button onClick={handleCopy} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                 {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />} 
                 {copied ? 'Copied!' : 'Copy'}
               </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PlatformGuide;
