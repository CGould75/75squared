import React, { useState, useContext, useEffect } from 'react';
import { Globe, Lock, ShieldAlert, Award, Link2, ArrowUpRight, Search, Activity, AlertTriangle, CheckCircle2, AlertOctagon } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { GlobalDomainContext } from '../../layouts/AdminLayout';

// MOCK PAYLOADS BY TENANT
// MOCK PAYLOADS BY TENANT
const MOCK_DOMAINS = {
  '75squared.com': {
    overview: { domain_authority: 84, total_backlinks: 14230, organic_traffic: 112000, traffic_value: "$42,500" },
    audit: { health_score: 92, urls_crawled: 14102, healthy_urls: 13801, broken_urls: 42, redirects: 259,
             critical_errors: [
               { id: 1, type: "404 Not Found", path: "/services/old-seo-package", priority: "High" },
               { id: 2, type: "Missing H1 Tag", path: "/blog/marketing-tips-2023", priority: "Medium" }
             ]
    },
    backlinks: [
      { id: 1, source: "forbes.com/business", authority: 92, type: "DoFollow" },
      { id: 2, source: "techcrunch.com/startups", authority: 89, type: "DoFollow" }
    ]
  },
  'goodyslv.com': {
    overview: { domain_authority: 42, total_backlinks: 320, organic_traffic: 8500, traffic_value: "$1,200" },
    audit: { health_score: 85, urls_crawled: 42, healthy_urls: 38, broken_urls: 1, redirects: 3,
             critical_errors: [
               { id: 1, type: "Missing Title Tag", path: "/products/caramel", priority: "High" }
             ]
    },
    backlinks: [
      { id: 1, source: "lasvegasweekly.com/food", authority: 64, type: "NoFollow" },
      { id: 2, source: "yelp.com/biz/goodys", authority: 90, type: "DoFollow" }
    ]
  },
  'lrms.com': {
    overview: { domain_authority: 68, total_backlinks: 4100, organic_traffic: 34000, traffic_value: "$15,400" },
    audit: { health_score: 72, urls_crawled: 850, healthy_urls: 700, broken_urls: 45, redirects: 105,
             critical_errors: [
               { id: 1, type: "Slow TTFB (>3000ms)", path: "/catalog/search", priority: "High" }
             ]
    },
    backlinks: [
      { id: 1, source: "education.org", authority: 88, type: "DoFollow" }
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
  const [userTier, setUserTier] = useState('Pro'); 
  const [activeTab, setActiveTab] = useState('overview');
  const [keywords, setKeywords] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { activeDomain } = useContext(GlobalDomainContext);
  const domainData = MOCK_DOMAINS[activeDomain] || MOCK_DOMAINS['75squared.com'];

  useEffect(() => {
    // Dynamically apply SaaS Tiers based on the logged-in Role
    const role = localStorage.getItem('nexus_role') || 'admin';
    setUserTier(role === 'admin' ? 'Enterprise' : 'Pro');

    const fetchSEOData = async () => {
      // Physically query data scoped specifically to the bound active domain
      const { data } = await supabase.from('seo_keywords').select('*').eq('client_id', activeDomain).order('kd', { ascending: false });
      if (data) setKeywords(data);
      setLoading(false);
    };
    fetchSEOData();
  }, [activeDomain]);

  return (
    <div>
      <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Globe size={36} color="var(--color-blue-main)" /> Intelligence Engine
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>
            Enterprise SEO topology, keyword discovery, and technical crawling.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ padding: '8px 16px', borderRadius: '20px', background: 'rgba(147, 51, 234, 0.1)', color: 'var(--color-purple-dark)', fontWeight: 700, fontSize: '0.85rem' }}>
            Current Tier: {userTier}
          </div>
          <button className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '0.9rem' }}>
            <Award size={16} /> Upgrade
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', background: 'rgba(0,0,0,0.05)', borderRadius: '12px', padding: '4px', marginBottom: '30px', width: 'max-content' }}>
        {['Overview', 'Site Audit', 'Keyword Explorer', 'Trend Catcher'].map(tab => (
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
      {/* TAB 1: OVERVIEW */}
      {/* ========================================== */}
      {activeTab === 'overview' && (
        <div className="fade-in">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
            {Object.entries(domainData.overview).map(([key, value], i) => (
              <div key={i} className="glass-panel" style={{ padding: '24px' }}>
                <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', fontWeight: 600, marginBottom: '12px', textTransform: 'capitalize' }}>{key.replace('_', ' ')}</div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800 }}>{value.toLocaleString()}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px', alignItems: 'start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              <div className="glass-panel" style={{ padding: '30px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '30px' }}>Keyword Trajectory (Algo Updates Mapped)</h3>
                <div style={{ height: '240px', position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', paddingBottom: '20px', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                  {MOCK_TRAJECTORY.map((point, index) => {
                    const heightPercent = 100 - ((point.rank / 20) * 100); 
                    return (
                      <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '40px', position: 'relative' }}>
                        
                        {/* Algorithm Hit Line Overlay Tech */}
                        {point.algo_hit && (
                          <>
                            <div style={{ position: 'absolute', top: -30, height: '120%', width: '2px', background: 'var(--color-red-main)', zIndex: 10 }}></div>
                            <div style={{ position: 'absolute', top: -45, whiteSpace: 'nowrap', background: 'var(--color-red-main)', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, zIndex: 11 }}>
                              {point.algo_name}
                            </div>
                          </>
                        )}

                        <div style={{ 
                          width: '100%', height: `${heightPercent}%`, minHeight: '20px',
                          background: 'linear-gradient(to top, rgba(59, 130, 246, 0.2), rgba(59, 130, 246, 0.8))',
                          borderRadius: '4px 4px 0 0', position: 'relative'
                        }}>
                          <div style={{ position: 'absolute', top: '-25px', left: '50%', transform: 'translateX(-50%)', fontWeight: 700, fontSize: '0.8rem', color: 'var(--color-blue-main)' }}>#{point.rank}</div>
                        </div>
                        <div style={{ marginTop: '10px', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Day {point.day}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '30px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '20px' }}>Recent Discovered Backlinks</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead><tr style={{ borderBottom: '2px solid rgba(0,0,0,0.05)', color: 'var(--color-text-muted)' }}><th style={{ padding: '12px' }}>Source Domain</th><th style={{ padding: '12px' }}>Domain Rating</th><th style={{ padding: '12px' }}>Profile Type</th></tr></thead>
                  <tbody>
                    {domainData.backlinks.map(link => (
                      <tr key={link.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.02)' }}>
                        <td style={{ padding: '16px 12px', fontWeight: 600 }}>{link.source}</td>
                        <td style={{ padding: '16px 12px', fontWeight: 800 }}>{link.authority}</td>
                        <td style={{ padding: '16px 12px' }}>
                          <span style={{ 
                            background: link.type === 'DoFollow' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: link.type === 'DoFollow' ? 'var(--color-green-main)' : 'var(--color-text-muted)',
                            padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 700 
                          }}>{link.type}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              <div className="glass-panel" style={{ padding: '30px', position: 'relative', overflow: 'hidden' }}>
                {userTier !== 'Guru' && userTier !== 'Enterprise' && (
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(8px)', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '30px', textAlign: 'center' }}>
                    <Lock size={32} color="var(--color-text-main)" style={{ marginBottom: '16px' }} />
                    <h4 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Competitor Gap Analysis</h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '20px' }}>Requires Guru Tier Analytics.</p>
                    <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Upgrade</button>
                  </div>
                )}
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '20px', color: 'var(--color-text-muted)' }}>Competitor Matrix</h3>
                <div style={{ opacity: 0.3, minHeight: '100px' }}></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* TAB 2: SITE AUDIT */}
      {/* ========================================== */}
      {activeTab === 'site audit' && (
        <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
          
          <div className="glass-panel" style={{ padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '30px' }}>Overall Health Score</h3>
            
            {/* Custom Radial Health Gauge */}
            <div style={{ position: 'relative', width: '200px', height: '200px', borderRadius: '50%', background: `conic-gradient(var(--color-green-main) ${domainData.audit.health_score}%, rgba(0,0,0,0.05) 0)`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 40px rgba(16, 185, 129, 0.2)' }}>
              <div style={{ position: 'absolute', width: '160px', height: '160px', background: 'white', borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                 <div style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--color-text-main)', lineHeight: '1' }}>{domainData.audit.health_score}</div>
                 <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>/ 100</div>
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', width: '100%', marginTop: '40px' }}>
              <div style={{ background: 'var(--color-bg-light)', padding: '16px', borderRadius: '12px' }}>
                 <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{domainData.audit.urls_crawled.toLocaleString()}</div>
                 <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>URLs Crawled</div>
              </div>
              <div style={{ background: 'var(--color-bg-light)', padding: '16px', borderRadius: '12px' }}>
                 <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-green-main)' }}>{domainData.audit.healthy_urls.toLocaleString()}</div>
                 <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Healthy URLs</div>
              </div>
              <div style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '16px', borderRadius: '12px', color: '#EF4444' }}>
                 <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{domainData.audit.broken_urls}</div>
                 <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Broken Links</div>
              </div>
              <div style={{ background: 'var(--color-bg-light)', padding: '16px', borderRadius: '12px' }}>
                 <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{domainData.audit.redirects}</div>
                 <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>301 Redirects</div>
              </div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '40px' }}>
             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Critical Intervention Target Matrix</h3>
                <button className="btn btn-outline" style={{ background: 'white' }}><Activity size={16}/> Rescan Scope</button>
             </div>
             
             <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
               {domainData.audit.critical_errors.map(err => (
                 <div key={err.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'rgba(0,0,0,0.02)', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      {err.priority === 'High' ? <AlertOctagon color="var(--color-red-main)" /> : <AlertTriangle color="#F59E0B" />}
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{err.type}</div>
                        <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Location: {err.path}</div>
                      </div>
                    </div>
                    <span style={{ 
                        background: err.priority === 'High' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)', color: err.priority === 'High' ? 'var(--color-red-main)' : '#F59E0B',
                        padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 800 
                      }}>{err.priority} Priority</span>
                 </div>
               ))}
             </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* TAB 3: KEYWORD EXPLORER */}
      {/* ========================================== */}
      {activeTab === 'keyword explorer' && (
        <div className="fade-in">
          
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', gap: '16px', marginBottom: '30px' }}>
             <div style={{ position: 'relative', flexGrow: 1 }}>
               <Search style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} size={20} />
               <input type="text" placeholder="Enter a seed keyword (e.g., enterprise saas)" style={{ width: '100%', padding: '16px 16px 16px 48px', fontSize: '1.1rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', background: 'var(--color-bg-light)', outline: 'none' }} />
             </div>
             <button className="btn btn-primary" style={{ padding: '0 30px', fontSize: '1.1rem' }}>Analyze Database</button>
          </div>

          <div className="glass-panel" style={{ padding: '30px' }}>
             <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '20px' }}>Global Search Volumes & Difficulty</h3>
             
             <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid rgba(0,0,0,0.05)', color: 'var(--color-text-muted)' }}>
                    <th style={{ padding: '16px', fontWeight: 600 }}>Keyword</th>
                    <th style={{ padding: '16px', fontWeight: 600 }}>KD (Difficulty 1-100)</th>
                    <th style={{ padding: '16px', fontWeight: 600 }}>Global Volume</th>
                    <th style={{ padding: '16px', fontWeight: 600 }}>Est. Clicks</th>
                    <th style={{ padding: '16px', fontWeight: 600 }}>Avg CPC</th>
                  </tr>
                </thead>
                <tbody>
                  {keywords.map(kw => {
                    let kdColor = "var(--color-green-main)";
                    if (kw.kd > 40) kdColor = "#F59E0B";
                    if (kw.kd > 75) kdColor = "var(--color-red-main)";

                    return (
                      <tr key={kw.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.02)' }}>
                        <td style={{ padding: '20px 16px' }}>
                           <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--color-purple-dark)', marginBottom: '4px' }}>{kw.keyword}</div>
                           <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>Intent: <span style={{ fontWeight: 600 }}>{kw.intent}</span></div>
                        </td>
                        <td style={{ padding: '20px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            {/* Graphic Difficulty Circle */}
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: `conic-gradient(${kdColor} ${kw.kd}%, rgba(0,0,0,0.05) 0)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <div style={{ width: '32px', height: '32px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem', color: 'var(--color-text-main)' }}>
                                {kw.kd}
                              </div>
                            </div>
                            <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>{kw.kd > 70 ? 'Super Hard' : kw.kd > 40 ? 'Possible' : 'Easy'}</span>
                          </div>
                        </td>
                        <td style={{ padding: '20px 16px', fontWeight: 800, fontSize: '1.1rem' }}>{kw.volume}</td>
                        <td style={{ padding: '20px 16px', fontWeight: 600, color: 'var(--color-text-muted)' }}>{kw.clicks}</td>
                        <td style={{ padding: '20px 16px', fontWeight: 800, color: 'var(--color-blue-main)' }}>{kw.cpc}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

          </div>

        </div>
      )}

      {/* ========================================== */}
      {/* TAB 4: TREND CATCHER */}
      {/* ========================================== */}
      {activeTab === 'trend catcher' && (
        <div className="fade-in">
          <div className="glass-panel" style={{ padding: '30px' }}>
             <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '20px' }}>RSS Feed Targeting</h3>
             <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px' }}>Select the industries you want your Autopilot to monitor for breaking news and viral trends.</p>
             
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                {['Technology & SaaS', 'Real Estate', 'Finance & Crypto', 'Local News', 'Health & Wellness', 'E-Commerce', 'Automotive', 'Travel & Hospitality'].map(industry => (
                  <label key={industry} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: 'var(--color-bg-light)', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s' }}
                         onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                         onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
                     <input type="checkbox" defaultChecked={industry === 'Real Estate' || industry === 'Technology & SaaS'} style={{ width: '20px', height: '20px', accentColor: 'var(--color-blue-main)' }} />
                     <span style={{ fontWeight: 600 }}>{industry}</span>
                  </label>
                ))}
             </div>
             
             <div style={{ marginTop: '30px', paddingTop: '30px', borderTop: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>*Selected feeds will be processed by the LLM every 60 minutes.</p>
                <button className="btn btn-primary" style={{ padding: '12px 24px', fontSize: '1rem' }}>Save Feed Preferences</button>
             </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default SeoDashboard;
