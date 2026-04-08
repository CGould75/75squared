import React, { useState, useContext, useEffect } from 'react';
import { Globe, Lock, ShieldAlert, Award, Link2, ArrowUpRight, Search, Activity, AlertTriangle, CheckCircle2, AlertOctagon, Bot, Zap, Target, FileText, Database, Code2, LineChart, Hash, Mail, Share2, MonitorPlay } from 'lucide-react';
import { GlobalDomainContext } from '../../layouts/AdminLayout';

// MOCK PAYLOADS BY TENANT
const MOCK_DOMAINS = {
  '75squared.com': {
    overview: { domain_rating: 84, total_backlinks: 14230, organic_traffic: 112000, traffic_value: "$42,500" },
    audit: { health_score: 92, urls_crawled: 14102, healthy_urls: 13801, broken_urls: 42, redirects: 259,
             critical_errors: [
               { id: 1, type: "404 Not Found", path: "/services/old-seo-package", priority: "High" },
               { id: 2, type: "Missing H1 Tag", path: "/blog/marketing-tips", priority: "Medium" },
               { id: 3, type: "Slow LCP (>3.5s)", path: "/case-studies", priority: "High" }
             ]
    },
    backlinks: [
      { id: 1, source: "forbes.com/business", authority: 92, type: "DoFollow", anchor: "las vegas seo agency" },
      { id: 2, source: "techcrunch.com/startups", authority: 89, type: "DoFollow", anchor: "75 squared app development" },
      { id: 3, source: "lasvegasweekly.com", authority: 66, type: "NoFollow", anchor: "top tech firms" },
      { id: 4, source: "clutch.co/profile/75squared", authority: 84, type: "DoFollow", anchor: "https://75squared.com" }
    ],
    keywords: [
      { id: 1, keyword: "digital marketing agency las vegas", kd: 45, volume: 3200, cpc: "$15.00", intent: "Commercial" },
      { id: 2, keyword: "custom saas development", kd: 72, volume: 1400, cpc: "$35.50", intent: "Transactional" },
      { id: 3, keyword: "edge routing seo meaning", kd: 12, volume: 800, cpc: "$4.00", intent: "Informational" },
      { id: 4, keyword: "b2b lead generation software", kd: 81, volume: 12400, cpc: "$48.00", intent: "Commercial" }
    ],
    competitors: [
      { domain: "neilpatel.com", overlap: "45%", organic_traffic: 2200000 },
      { domain: "ignitevisibility.com", overlap: "22%", organic_traffic: 450000 }
    ],
    top_pages: [
      { id: 1, path: "/pricing", traffic: 45000, friction: 89, trend: "up" },
      { id: 2, path: "/agency/seo-services", traffic: 22000, friction: 12, trend: "up" },
      { id: 3, path: "/blog/what-is-edge-routing", traffic: 18000, friction: 65, trend: "down" }
    ]
  },
  'goodyslv.com': {
    overview: { domain_rating: 42, total_backlinks: 320, organic_traffic: 8500, traffic_value: "$1,200" },
    audit: { health_score: 85, urls_crawled: 42, healthy_urls: 38, broken_urls: 1, redirects: 3,
             critical_errors: [
               { id: 1, type: "Missing Title Tag", path: "/products/caramel", priority: "High" }
             ]
    },
    backlinks: [
      { id: 1, source: "lasvegasweekly.com/food", authority: 64, type: "NoFollow", anchor: "goodys popcorn" },
      { id: 2, source: "yelp.com/biz/goodys", authority: 90, type: "DoFollow", anchor: "https://goodyslv.com" }
    ],
    keywords: [
      { id: 1, keyword: "gourmet popcorn las vegas", kd: 15, volume: 450, cpc: "$1.20", intent: "Transactional" },
      { id: 2, keyword: "corporate gifts las vegas", kd: 35, volume: 1200, cpc: "$4.50", intent: "Commercial" }
    ],
    competitors: [
      { domain: "popcornopolis.com", overlap: "15%", organic_traffic: 120000 },
      { domain: "garrettpopcorn.com", overlap: "12%", organic_traffic: 240000 }
    ],
    top_pages: [
      { id: 1, path: "/products/cheddar", traffic: 3200, friction: 14, trend: "up" },
      { id: 2, path: "/corporate-gifts", traffic: 1800, friction: 72, trend: "down" }
    ]
  }
};

const MOCK_TRAJECTORY = [
  { day: "01", rank: 14, algo_hit: false },
  { day: "05", rank: 11, algo_hit: false },
  { day: "12", rank: 8,  algo_hit: true, algo_name: "Google Spam Update Core" },
  { day: "18", rank: 4,  algo_hit: false },
  { day: "24", rank: 3,  algo_hit: false },
  { day: "30", rank: 1,  algo_hit: false }
];

const SeoDashboard = () => {
  const [userTier, setUserTier] = useState('Enterprise'); 
  const [activeTab, setActiveTab] = useState('site explorer');
  
  const { activeDomain } = useContext(GlobalDomainContext);
  const domainData = MOCK_DOMAINS[activeDomain] || MOCK_DOMAINS['75squared.com'];

  const [toastMessage, setToastMessage] = useState('');

  const triggerBackgroundBot = (message) => {
     setToastMessage(message);
     setTimeout(() => setToastMessage(''), 5000);
  };

  return (
    <div>
      {/* Header Array */}
      <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Globe size={36} color="var(--color-blue-main)" /> Intelligence Engine
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem', marginBottom: '16px' }}>
            Ahrefs-grade API telemetry, technical auditing, and keyword opportunity discovery.
          </p>

          <div style={{ padding: '8px 16px', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--color-green-main)', textTransform: 'uppercase', letterSpacing: '1px' }}>The One Goal:</span>
            <span style={{ fontSize: '0.95rem', color: '#111', fontWeight: 800 }}>Make the company the best it can be through using our marketing tools.</span>
          </div>

        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ padding: '8px 16px', borderRadius: '20px', background: 'rgba(147, 51, 234, 0.1)', color: 'var(--color-purple-dark)', fontWeight: 700, fontSize: '0.85rem' }}>
            Target Platform: {activeDomain}
          </div>
          <button className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '0.9rem' }}>
            <Award size={16} /> Tier: {userTier}
          </button>
        </div>
      </div>

      {/* Ahrefs-style Navigation Tabs */}
      <div style={{ display: 'flex', background: 'rgba(0,0,0,0.05)', borderRadius: '12px', padding: '6px', marginBottom: '40px', width: 'max-content' }}>
        {['Site Explorer', 'Keywords Explorer', 'Site Audit', 'Rank Tracker'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab.toLowerCase())}
            style={{ 
              padding: '10px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 700, transition: 'all 0.2s', 
              background: activeTab === tab.toLowerCase() ? 'white' : 'transparent', 
              color: activeTab === tab.toLowerCase() ? 'var(--color-blue-main)' : 'var(--color-text-muted)', 
              boxShadow: activeTab === tab.toLowerCase() ? '0 2px 10px rgba(0,0,0,0.05)' : 'none' 
            }}>
            {tab}
          </button>
        ))}
      </div>

      {/* ========================================== */}
      {/* TAB 1: SITE EXPLORER */}
      {/* ========================================== */}
      {activeTab === 'site explorer' && (
        <div className="fade-in">
          {/* Top Level Ahrefs Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
            {Object.entries(domainData.overview).map(([key, value], i) => (
              <div key={i} className="glass-panel" style={{ padding: '30px' }}>
                <div style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', fontWeight: 700, marginBottom: '12px', textTransform: 'uppercase' }}>{key.replace('_', ' ')}</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--color-text-main)', letterSpacing: '-1px' }}>{value.toLocaleString()}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px', alignItems: 'start' }}>
            {/* Backlink Profile */}
            <div className="glass-panel" style={{ padding: '40px' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}><Link2 size={20} color="var(--color-blue-main)" /> Backlink Profile Matrix</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid rgba(0,0,0,0.05)', color: 'var(--color-text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '16px' }}>Referring Page</th>
                    <th style={{ padding: '16px' }}>DR</th>
                    <th style={{ padding: '16px' }}>Anchor Text</th>
                    <th style={{ padding: '16px' }}>Equity Type</th>
                  </tr>
                </thead>
                <tbody>
                  {domainData.backlinks.map(link => (
                    <tr key={link.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.02)' }}>
                      <td style={{ padding: '20px 16px', fontWeight: 600, color: 'var(--color-blue-main)', display: 'flex', alignItems: 'center', gap: '6px' }}><ArrowUpRight size={14}/> {link.source}</td>
                      <td style={{ padding: '20px 16px', fontWeight: 900 }}>{link.authority}</td>
                      <td style={{ padding: '20px 16px', fontWeight: 500, color: 'var(--color-text-muted)' }}>"{link.anchor}"</td>
                      <td style={{ padding: '20px 16px' }}>
                        <span style={{ 
                          background: link.type === 'DoFollow' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: link.type === 'DoFollow' ? 'var(--color-green-main)' : 'var(--color-text-muted)',
                          padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 800 
                        }}>{link.type}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
               {/* Competitor Gap & Email Synergy */}
               <div className="glass-panel" style={{ padding: '40px' }}>
                 <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}><Target size={20} color="var(--color-purple-main)" /> Content Gap Analysis</h3>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {domainData.competitors.map((comp, i) => (
                       <div key={i} style={{ padding: '20px', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '12px', background: 'var(--color-bg-light)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                             <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{comp.domain}</h4>
                             <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#F59E0B', background: 'rgba(245, 158, 11, 0.1)', padding: '4px 8px', borderRadius: '6px' }}>Overlap: {comp.overlap}</span>
                          </div>
                          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>This competitor outranks you on <strong style={{ color: '#111' }}>{comp.organic_traffic.toLocaleString()}</strong> organic keywords.</p>
                          <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                             <button className="btn hover-lift" style={{ flex: 1, padding: '10px', background: 'white', border: '1px solid rgba(0,0,0,0.1)', fontWeight: 700, borderRadius: '8px', cursor: 'pointer' }}>View Keyword Gap</button>
                             <button onClick={() => triggerBackgroundBot(`Email Pipeline: Generating outreach drip campaign to ${comp.domain} referring domains.`)} className="btn hover-lift" style={{ flex: 1, padding: '10px', background: 'var(--color-purple-main)', color: 'white', border: 'none', fontWeight: 700, borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}><Mail size={16}/> Launch Link Outreach</button>
                          </div>
                       </div>
                    ))}
                 </div>
               </div>

               {/* Top UI Pages & Thermal Synergy */}
               <div className="glass-panel" style={{ padding: '40px' }}>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}><Activity size={20} color="#10B981" /> Top Organic Pages (Thermal Sync)</h3>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                     <thead>
                        <tr style={{ borderBottom: '2px solid rgba(0,0,0,0.05)', color: 'var(--color-text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                           <th style={{ padding: '16px' }}>URL Path</th>
                           <th style={{ padding: '16px' }}>Traffic</th>
                           <th style={{ padding: '16px' }}>Thermal Risk</th>
                        </tr>
                     </thead>
                     <tbody>
                        {domainData.top_pages.map(page => (
                           <tr key={page.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.02)' }}>
                              <td style={{ padding: '20px 16px', fontWeight: 600 }}>{page.path}</td>
                              <td style={{ padding: '20px 16px', fontWeight: 800 }}>{page.traffic.toLocaleString()}</td>
                              <td style={{ padding: '20px 16px' }}>
                                 <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <span style={{ 
                                       background: page.friction > 60 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', color: page.friction > 60 ? '#EF4444' : '#10B981',
                                       padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 800 
                                    }}>Friction: {page.friction}%</span>
                                    {page.friction > 60 && (
                                       <button onClick={() => triggerBackgroundBot(`Thermal Sync: Opening Session Replays for ${page.path}.`)} className="hover-lift" style={{ background: '#EF4444', color: 'white', border: 'none', borderRadius: '4px', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} title="Watch Session Replays">
                                          <MonitorPlay size={14} />
                                       </button>
                                    )}
                                 </div>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* TAB 2: KEYWORDS EXPLORER */}
      {/* ========================================== */}
      {activeTab === 'keywords explorer' && (
        <div className="fade-in glass-panel" style={{ padding: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
             <h3 style={{ fontSize: '1.5rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '12px' }}><Hash size={24} color="#10B981" /> Organic Keyword Matrix</h3>
             <button className="btn btn-primary" style={{ padding: '12px 24px', background: 'var(--color-purple-main)' }}><Search size={16} /> Research New Seed Keywords</button>
          </div>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
             <thead>
                <tr style={{ background: 'var(--color-bg-light)', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                  <th style={{ padding: '20px', fontSize: '0.85rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Keyword</th>
                  <th style={{ padding: '20px', fontSize: '0.85rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Intent Layer</th>
                  <th style={{ padding: '20px', fontSize: '0.85rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>KD (Difficulty)</th>
                  <th style={{ padding: '20px', fontSize: '0.85rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Search Volume</th>
                  <th style={{ padding: '20px', fontSize: '0.85rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>CPC</th>
                  <th style={{ padding: '20px', fontSize: '0.85rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Strategic Action</th>
                </tr>
             </thead>
             <tbody>
                {domainData.keywords.map(kw => (
                   <tr key={kw.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', background: 'white' }}>
                      <td style={{ padding: '20px', fontWeight: 700, fontSize: '1.05rem', color: '#111' }}>{kw.keyword}</td>
                      <td style={{ padding: '20px' }}>
                         <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-text-muted)', background: 'var(--color-bg-light)', padding: '6px 10px', borderRadius: '6px' }}>{kw.intent}</span>
                      </td>
                      <td style={{ padding: '20px' }}>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: kw.kd > 60 ? 'rgba(239, 68, 68, 0.1)' : kw.kd > 30 ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)', color: kw.kd > 60 ? '#EF4444' : kw.kd > 30 ? '#F59E0B' : '#10B981', fontWeight: 900, fontSize: '0.85rem' }}>{kw.kd}</div>
                         </div>
                      </td>
                      <td style={{ padding: '20px', fontWeight: 700 }}>{kw.volume.toLocaleString()}</td>
                      <td style={{ padding: '20px', fontWeight: 700 }}>{kw.cpc}</td>
                      <td style={{ padding: '20px' }}>
                         <button onClick={() => triggerBackgroundBot(`Content Studio activated. Drafting 2,000 word pillar article for "${kw.keyword}"`)} className="btn hover-lift" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: 'var(--color-purple-main)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', boxShadow: '0 4px 15px rgba(147, 51, 234, 0.3)' }}>
                            <FileText size={16} /> Send to AI Blog Writer
                         </button>
                      </td>
                   </tr>
                ))}
             </tbody>
          </table>
        </div>
      )}

      {/* ========================================== */}
      {/* TAB 3: SITE AUDIT */}
      {/* ========================================== */}
      {activeTab === 'site audit' && (
        <div className="fade-in">
           <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 2fr)', gap: '30px' }}>
              
              {/* Health Score Overview */}
              <div className="glass-panel" style={{ padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                 <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '30px' }}>Domain Health Score</h3>
                 <div style={{ width: '180px', height: '180px', borderRadius: '50%', background: 'conic-gradient(#10B981 92%, rgba(0,0,0,0.05) 0)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 0 0 20px white, 0 10px 30px rgba(0,0,0,0.05)', position: 'relative' }}>
                    <span style={{ fontSize: '3rem', fontWeight: 900, color: '#111' }}>{domainData.audit.health_score}</span>
                 </div>
                 <div style={{ display: 'flex', gap: '20px', marginTop: '40px', width: '100%', justifyContent: 'space-between', padding: '20px', background: 'var(--color-bg-light)', borderRadius: '12px' }}>
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Crawled</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{domainData.audit.urls_crawled.toLocaleString()}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Redirects</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{domainData.audit.redirects.toLocaleString()}</div>
                    </div>
                 </div>
              </div>

              {/* Critical Errors & Handoff */}
              <div className="glass-panel" style={{ padding: '40px' }}>
                 <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}><AlertOctagon size={24} color="#EF4444" /> Crawl Diagnostics</h3>
                 <p style={{ color: 'var(--color-text-muted)', marginBottom: '30px', fontSize: '1rem' }}>Technical issues detected during latest DOM trace. These structurally harm your indexing capability.</p>
                 
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {domainData.audit.critical_errors.map(error => (
                       <div key={error.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', border: '1px solid rgba(239, 68, 68, 0.2)', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '12px' }}>
                          <div>
                             <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                <span style={{ padding: '4px 8px', background: '#EF4444', color: 'white', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>{error.priority} Risk</span>
                                <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#111' }}>{error.type}</h4>
                             </div>
                             <div style={{ fontSize: '0.9rem', color: '#EF4444', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                                <Code2 size={16} /> Edge Path: {error.path}
                             </div>
                          </div>
                          
                          <button onClick={() => triggerBackgroundBot(`Technical Audit Sync: Generating DOM mutation to autonomously fix '${error.type}' on ${error.path}.`)} className="btn hover-lift" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 24px', background: 'white', border: '2px solid var(--color-purple-main)', color: 'var(--color-purple-main)', fontWeight: 800, borderRadius: '8px', cursor: 'pointer' }}>
                             <Bot size={18} /> Send to Ghost Editor Auto-Fix
                          </button>
                       </div>
                    ))}
                 </div>
              </div>

           </div>
        </div>
      )}

      {/* ========================================== */}
      {/* TAB 4: RANK TRACKER */}
      {/* ========================================== */}
      {activeTab === 'rank tracker' && (
        <div className="fade-in glass-panel" style={{ padding: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
             <h3 style={{ fontSize: '1.4rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '12px' }}><LineChart size={24} color="var(--color-blue-main)" /> Top Keywords Trajectory</h3>
             <button onClick={() => triggerBackgroundBot(`Social Engine Action: Aggregating dropped keywords and scheduling X, LinkedIn, and Facebook auto-posts to surge traffic signals.`)} className="btn hover-lift" style={{ padding: '12px 24px', background: '#3B82F6', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem', cursor: 'pointer', boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)' }}><Share2 size={18} /> Distribute Declines to Social Engine</button>
          </div>
          
          <div style={{ height: '350px', position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', paddingBottom: '30px', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
            {MOCK_TRAJECTORY.map((point, index) => {
              const heightPercent = 100 - ((point.rank / 20) * 100); 
              return (
                <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '40px', position: 'relative' }}>
                  
                  {/* Algorithm Spam Update Identifier */}
                  {point.algo_hit && (
                    <>
                      <div style={{ position: 'absolute', top: -50, height: '140%', width: '2px', background: 'var(--color-red-main)', zIndex: 10 }}></div>
                      <div className="pulse-dot" style={{ position: 'absolute', top: -60, background: 'var(--color-red-main)', color: 'white', padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 800, zIndex: 11, whiteSpace: 'nowrap' }}>
                         ⚠️ {point.algo_name} Detected
                      </div>
                    </>
                  )}

                  <div style={{ 
                    width: '100%', height: `${heightPercent}%`, minHeight: '30px',
                    background: 'linear-gradient(to top, rgba(59, 130, 246, 0.2), rgba(59, 130, 246, 0.9))',
                    borderRadius: '8px 8px 0 0', position: 'relative', boxShadow: '0 4px 10px rgba(59, 130, 246, 0.2)'
                  }}>
                    <div style={{ position: 'absolute', top: '-35px', left: '50%', transform: 'translateX(-50%)', fontWeight: 900, fontSize: '1.1rem', color: 'var(--color-blue-main)' }}>#{point.rank}</div>
                  </div>
                  <div style={{ marginTop: '16px', fontSize: '0.9rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Day {point.day}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Global Bot Telemetry Toast */}
      {toastMessage && (
         <div className="fade-in" style={{ position: 'fixed', bottom: '40px', right: '40px', background: '#111', color: 'white', padding: '20px 30px', borderRadius: '16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', zIndex: 10001, border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '20px', background: 'rgba(147, 51, 234, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <Database size={24} color="#C084FC" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
               <span style={{ fontSize: '0.85rem', color: '#C084FC', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 800 }}>API Pipeline Link Secured</span>
               <span style={{ fontSize: '1rem', marginTop: '4px' }}>{toastMessage}</span>
            </div>
         </div>
      )}

    </div>
  );
};

export default SeoDashboard;
