import React, { useState, useContext, useEffect } from 'react';
import { Globe, Lock, ShieldAlert, Award, Link2, ArrowUpRight, Search, Activity, AlertTriangle, CheckCircle2, AlertOctagon, Bot, Zap, Target, FileText, Database, Code2, LineChart, Hash, Mail, Share2, MonitorPlay, Shield, Crosshair, DollarSign, Layers, Printer, Radar } from 'lucide-react';
import { GlobalDomainContext } from '../../layouts/AdminLayout';
import { Link, useNavigate } from 'react-router-dom';
import TelemetryEngine from '../../lib/telemetry';

// MOCK PAYLOADS BY TENANT
const MOCK_DOMAINS = {
  '75squared.com': {
    overview: { domain_rating: 1, total_backlinks: 2, organic_traffic: 0, traffic_value: "$0" },
    audit: { health_score: 98, urls_crawled: 12, healthy_urls: 10, broken_urls: 0, redirects: 2,
             critical_errors: [
               { id: 1, type: "Missing Sitemap.xml", path: "/sitemap.xml", priority: "High" },
               { id: 2, type: "No Google Search Console Link", path: "Global", priority: "Medium" }
             ]
    },
    backlinks: [
      { id: 1, source: "twitter.com/75squared", authority: 98, type: "NoFollow", anchor: "https://75squared.com" },
      { id: 2, source: "linkedin.com/company/75-squared", authority: 98, type: "NoFollow", anchor: "75 Squared Digital" }
    ],
    toxic_links: [],
    keywords: [
      { id: 1, keyword: "75 squared digital marketing", kd: 2, volume: 10, cpc: "$0.00", intent: "Navigational" }
    ],
    keyword_clusters: [],
    competitors: [
      { domain: "vegasmarketing.com", overlap: "0%", organic_traffic: 52000 },
      { domain: "national-digital.io", overlap: "0%", organic_traffic: 450000 }
    ],
    top_pages: [
      { id: 1, path: "/", traffic: 12, friction: 0, trend: "up" }
    ],
    ppc_ads: [
      { id: 1, competitor: "vegasmarketing.com", ad_copy: "Rank #1 on Google in 30 Days. Voted #1 Vegas Agency.", cpc: "$45.00", traffic: 2200 }
    ],
    link_intersect: [
      { competitor: "vegasmarketing.com", connecting_domains: ["clutch.co", "yelp.com", "vegas-chamber.org"] }
    ],
    competitor_gap: [
      { id: 1, keyword: "b2b saas marketing playbook", search_volume: 4200, kd: 35, present_on: ["vegasmarketing.com"] },
      { id: 2, keyword: "digital transformation agency", search_volume: 8500, kd: 65, present_on: ["national-digital.io", "vegasmarketing.com"] }
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
    toxic_links: [
      { id: 1, source: "cheap-seo-links-ru.com", score: 99, status: "Active Attack" },
      { id: 2, source: "buy-followers-now.info", score: 85, status: "High Risk" }
    ],
    keywords: [
      { id: 1, keyword: "gourmet popcorn las vegas", kd: 15, volume: 450, cpc: "$1.20", intent: "Transactional" },
      { id: 2, keyword: "corporate gifts las vegas", kd: 35, volume: 1200, cpc: "$4.50", intent: "Commercial" }
    ],
    keyword_clusters: [
      { parent: "Gourmet Popcorn", volume: 15000, children: ["gourmet popcorn las vegas", "caramel popcorn delivery", "cheese popcorn bulk"] },
      { parent: "Corporate Gifts", volume: 45000, children: ["client present boxes", "bulk event snacks", "custom tin popcorn"] }
    ],
    competitors: [
      { domain: "popcornopolis.com", overlap: "15%", organic_traffic: 120000 },
      { domain: "garrettpopcorn.com", overlap: "12%", organic_traffic: 240000 }
    ],
    top_pages: [
      { id: 1, path: "/products/cheddar", traffic: 3200, friction: 14, trend: "up" },
      { id: 2, path: "/corporate-gifts", traffic: 1800, friction: 72, trend: "down" }
    ],
    ppc_ads: [
      { id: 1, competitor: "popcornopolis.com", ad_copy: "World Famous Gourmet Popcorn. Order Now for 20% Off Your First Tin.", cpc: "$2.40", traffic: 45000 }
    ],
    link_intersect: [
      { competitor: "garrettpopcorn.com", connecting_domains: ["foodnetwork.com", "eater.com", "timeout.com"] },
      { competitor: "popcornopolis.com", connecting_domains: ["buzzfeed.com", "thrillist.com"] }
    ],
    competitor_gap: [
      { id: 1, keyword: "cheese and caramel popcorn mix", search_volume: 12400, kd: 12, present_on: ["garrettpopcorn.com", "popcornopolis.com"] }
    ]
  },
  'lrms.com': {
    overview: { domain_rating: 64, total_backlinks: 840, organic_traffic: 12500, traffic_value: "$4,200" },
    audit: { health_score: 92, urls_crawled: 154, healthy_urls: 148, broken_urls: 2, redirects: 4,
             critical_errors: [
               { id: 1, type: "Orphaned CSS Node", path: "/admin/dashboard", priority: "Medium" }
             ]
    },
    backlinks: [
      { id: 1, source: "libraryjournal.com/tech", authority: 88, type: "DoFollow", anchor: "lrms SaaS platform" },
      { id: 2, source: "techcrunch.com/lrms", authority: 92, type: "DoFollow", anchor: "innovative opac" }
    ],
    toxic_links: [
      { id: 1, source: "low-quality-directory.info", score: 82, status: "Active Attack" }
    ],
    keywords: [
      { id: 1, keyword: "library management system", kd: 45, volume: 12000, cpc: "$8.50", intent: "Commercial" },
      { id: 2, keyword: "opac integration software", kd: 20, volume: 1800, cpc: "$4.10", intent: "Commercial" }
    ],
    keyword_clusters: [
      { parent: "Library Software", volume: 45000, children: ["library software", "cloud lms", "library database system"] }
    ],
    competitors: [
      { domain: "follettlearning.com", overlap: "45%", organic_traffic: 210000 },
      { domain: "insigniasoftware.com", overlap: "22%", organic_traffic: 85000 }
    ],
    top_pages: [
      { id: 1, path: "/features", traffic: 4200, friction: 8, trend: "up" },
      { id: 2, path: "/demo-request", traffic: 1200, friction: 12, trend: "up" }
    ],
    ppc_ads: [
      { id: 1, competitor: "follettlearning.com", ad_copy: "Next Gen Library Automation.", cpc: "$6.50", traffic: 12500 }
    ],
    link_intersect: [
      { competitor: "follettlearning.com", connecting_domains: ["ala.org", "edtechmagazine.com"] }
    ],
    competitor_gap: [
      { id: 1, keyword: "how to migrate library software", search_volume: 2400, kd: 18, present_on: ["follettlearning.com"] },
      { id: 2, keyword: "rfid tags for library catalog", search_volume: 5600, kd: 22, present_on: ["follettlearning.com", "insigniasoftware.com"] }
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
  const navigate = useNavigate();
  const [userTier, setUserTier] = useState('Enterprise'); 
  const [activeTab, setActiveTab] = useState('brand radar & ai');
  
  const [expandedAio, setExpandedAio] = useState(null);
  
  const [activePersona, setActivePersona] = useState('Gen-Z Tech Shopper');
  const [activeLLM, setActiveLLM] = useState('Perplexity Pro');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);

  const runPersonaPrompt = () => {
     setIsGeneratingPrompt(true);
     setGeneratedPrompt('');
     setTimeout(() => {
        setIsGeneratingPrompt(false);
        setGeneratedPrompt(`"Act as a ${activePersona}. I need to find the absolute best options for ${domainKey} products right now. What are the top 3 brands and why?"`);
     }, 1500);
  };
  
  const { activeDomain } = useContext(GlobalDomainContext);
  
  // Safe resolution logic to prevent data collisions from UI states
  const normalizedDomain = activeDomain ? String(activeDomain).toLowerCase().trim() : '';
  const domainKey = ['goodyslv.com', 'lrms.com'].find(key => normalizedDomain.includes(key)) || '75squared.com';
  
  const [domainData, setDomainData] = useState(MOCK_DOMAINS[domainKey]);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
     let isMounted = true;
     const fetchData = async () => {
         setIsSyncing(true);
         try {
             // Fetch high-level Backlink & DR metrics from DataForSEO
             const res = await fetch(`/api/dataforseo?domain=${encodeURIComponent(normalizedDomain || '75squared.com')}&action=backlinks`);
             const json = await res.json();
             
             if (isMounted && json.tasks && json.tasks[0].result && json.tasks[0].result[0]) {
                 const stats = json.tasks[0].result[0];
                 setDomainData(prev => ({
                     ...MOCK_DOMAINS[domainKey], // Fallback for other mock modules (Audit, Keywords)
                     overview: {
                         ...MOCK_DOMAINS[domainKey].overview,
                         domain_rating: stats.rank || MOCK_DOMAINS[domainKey].overview.domain_rating,
                         total_backlinks: stats.backlinks || MOCK_DOMAINS[domainKey].overview.total_backlinks,
                     }
                 }));
             } else {
                 setDomainData(MOCK_DOMAINS[domainKey]);
             }
         } catch(e) {
             console.error("DataForSEO Fetch Error:", e);
             if (isMounted) setDomainData(MOCK_DOMAINS[domainKey]);
         }
         if (isMounted) setIsSyncing(false);
     };

     fetchData();

     return () => { isMounted = false; }
  }, [normalizedDomain, domainKey]);

  const [toastMessage, setToastMessage] = useState('');

  const triggerBackgroundBot = async (message, severity = 'opportunity') => {
     await TelemetryEngine.dispatchException('Intelligence Engine', message, { activeDomain }, severity);
     navigate('/admin/action-center');
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
            Elite API telemetry, technical auditing, and keyword opportunity discovery.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          {isSyncing && (
             <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10B981', fontWeight: 700, fontSize: '0.85rem' }}>
                <div className="spinner" style={{width: 14, height: 14, border: '2px solid rgba(16, 185, 129, 0.3)', borderTopColor: '#10B981', borderRadius: '50%', animation: 'spin 1s linear infinite'}} /> DataForSEO Sync Active
             </div>
          )}
          <div style={{ padding: '8px 16px', borderRadius: '20px', background: 'rgba(147, 51, 234, 0.1)', color: 'var(--color-purple-dark)', fontWeight: 700, fontSize: '0.85rem' }}>
            Target Platform: {activeDomain || '75squared.com'}
          </div>
          <button onClick={() => window.print()} className="btn btn-outline" style={{ padding: '10px 20px', fontSize: '0.9rem', background: 'white' }}>
            <Printer size={16} /> Export PDF Report
          </button>
          <button onClick={() => alert("Billing Management arriving in v2.0")} className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '0.9rem' }}>
            <Award size={16} /> Tier: {userTier}
          </button>
        </div>
      </div>

      {/* Ahrefs/SEMrush-style Navigation Tabs */}
      <div style={{ display: 'flex', background: 'rgba(0,0,0,0.05)', borderRadius: '12px', padding: '6px', marginBottom: '40px', width: 'max-content', gap: '4px', flexWrap: 'wrap' }}>
        {['Competitor Recon', 'Brand Radar & AI', 'Keywords Explorer', 'Site Explorer', 'Competitor Gap', 'Site Audit', 'Persona Sandbox'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab.toLowerCase())}
            style={{ 
              padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 700, transition: 'all 0.2s', 
              background: activeTab === tab.toLowerCase() ? 'white' : 'transparent', 
              color: activeTab === tab.toLowerCase() ? 'var(--color-blue-main)' : 'var(--color-text-muted)', 
              boxShadow: activeTab === tab.toLowerCase() ? '0 2px 10px rgba(0,0,0,0.05)' : 'none' 
            }}>
            {tab === 'Brand Radar & AI' ? <span style={{display: 'flex', gap: '6px', alignItems: 'center'}}><Radar size={16} color="#8B5CF6"/> {tab}</span> : null}
            {tab === 'Competitor Recon' ? <span style={{display: 'flex', gap: '6px', alignItems: 'center'}}><Crosshair size={16} color="#EF4444"/> {tab}</span> : null}
            {tab === 'Persona Sandbox' ? <span style={{display: 'flex', gap: '6px', alignItems: 'center'}}><Bot size={16} color="#8B5CF6"/> {tab}</span> : null}
            {tab !== 'Brand Radar & AI' && tab !== 'Competitor Recon' && tab !== 'Persona Sandbox' ? tab : null}
          </button>
        ))}
      </div>

      {/* ========================================== */}
      {/* TAB: BRAND RADAR & AI (PHASE 6 & 8)         */}
      {/* ========================================== */}
      {activeTab === 'brand radar & ai' && (
         <div className="fade-in">
            <div className="glass-panel" style={{ padding: '40px', marginBottom: '30px' }}>
               <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}><Bot size={20} color="#10B981" /> AI Overviews (AIO) & Chatbot Citations</h3>
               <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                     <tr style={{ borderBottom: '2px solid rgba(0,0,0,0.05)', color: 'var(--color-text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                        <th style={{ padding: '16px' }}>Target Prompt / Query</th>
                        <th style={{ padding: '16px' }}>AI Source</th>
                        <th style={{ padding: '16px' }}>Visibility Status</th>
                        <th style={{ padding: '16px' }}>AI Analytics Yield</th>
                     </tr>
                  </thead>
                  <tbody>
                     {((domainData.brand_radar && domainData.brand_radar.ai_overviews) || [
                        { id: 1, query: "top 10 agencies in las vegas", source: "Google AI Overviews", status: "Cited", traffic_yield: 420 },
                        { id: 2, query: "best SEO agencies near 89123", source: "Perplexity Pro", status: "Cited", traffic_yield: 85 }
                     ]).map(aio => (
                        <React.Fragment key={aio.id}>
                           <tr style={{ borderBottom: expandedAio === aio.id ? 'none' : '1px solid rgba(0,0,0,0.02)' }}>
                              <td style={{ padding: '20px 16px', fontWeight: 700, color: '#111' }}>
                                 <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    "{aio.query}"
                                    <button onClick={() => setExpandedAio(expandedAio === aio.id ? null : aio.id)} className="hover-lift" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8B5CF6', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 800 }}>Fan-Out Analysis</button>
                                 </div>
                              </td>
                              <td style={{ padding: '20px 16px', fontWeight: 600 }}>{aio.source}</td>
                              <td style={{ padding: '20px 16px' }}>
                                 <span style={{ 
                                    background: aio.status === 'Cited' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: aio.status === 'Cited' ? '#10B981' : '#EF4444',
                                    padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 800 
                                 }}>{aio.status}</span>
                              </td>
                              <td style={{ padding: '20px 16px', fontWeight: 900 }}>{aio.traffic_yield > 0 ? `+${aio.traffic_yield}` : '-' }</td>
                           </tr>
                           {expandedAio === aio.id && (
                             <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', background: 'rgba(0,0,0,0.01)' }}>
                                <td colSpan="4" style={{ padding: '0 16px 24px 16px' }}>
                                   <div className="fade-in" style={{ padding: '16px', background: 'white', borderRadius: '12px', border: '1px dashed rgba(139, 92, 246, 0.4)' }}>
                                      <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#8B5CF6', marginBottom: '12px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}><Share2 size={14}/> Reverse-Engineered Parent Semantic Signals</div>
                                      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                         <span style={{ padding: '6px 12px', background: 'var(--color-bg-light)', borderRadius: '16px', fontSize: '0.85rem', fontWeight: 600, border: '1px solid rgba(0,0,0,0.05)' }}>Query: "{aio.query.split(' ')[0]} near me" (42% match)</span>
                                         <span style={{ padding: '6px 12px', background: 'var(--color-bg-light)', borderRadius: '16px', fontSize: '0.85rem', fontWeight: 600, border: '1px solid rgba(0,0,0,0.05)' }}>Query: "best {aio.query.split(' ')[1] || 'options'}" (38% match)</span>
                                         <span style={{ padding: '6px 12px', background: 'rgba(239, 68, 68, 0.05)', color: '#EF4444', borderRadius: '16px', fontSize: '0.85rem', fontWeight: 600, border: '1px solid rgba(239, 68, 68, 0.2)' }}>Thread: Reddit /r/AskReddit (12% index)</span>
                                      </div>
                                   </div>
                                </td>
                             </tr>
                           )}
                        </React.Fragment>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      )}

      {/* ========================================== */}
      {/* TAB: COMPETITOR RECON (PHASE 6)            */}
      {/* ========================================== */}
      {activeTab === 'competitor recon' && (
         <div className="fade-in glass-panel" style={{ padding: '40px' }}>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px', color: '#111' }}>
               <Crosshair size={24} color="#EF4444" /> Target Acquisition Matrix (G2 / Social)
            </h3>
            <p style={{ fontSize: '1.05rem', color: 'var(--color-text-muted)', margin: '0 0 30px 0' }}>
               Deploy sentiment scrapers across major review platforms to identify critical vulnerabilities in competitor offerings.
            </p>
         </div>
      )}

      {/* ========================================== */}
      {/* TAB: PERSONA SANDBOX (PHASE 8)             */}
      {activeTab === 'site explorer' && (
        <div className="fade-in">
          {/* Top Level Ahrefs Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
            {Object.entries(domainData.overview).map(([key, value], i) => (
              <div key={i} className="glass-panel" style={{ padding: '30px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <div style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', fontWeight: 700, marginBottom: '12px', textTransform: 'uppercase' }}>{key.replace('_', ' ')}</div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--color-text-main)', letterSpacing: '-1px' }}>{value.toLocaleString()}</div>
                </div>
                {/* SVG Trend Line / Historical Evolution (SpyFu Parity) */}
                <svg style={{ position: 'absolute', bottom: '-10px', left: 0, width: '100%', height: '60px', zIndex: 1 }} preserveAspectRatio="none" viewBox="0 0 100 100">
                  <path d={i % 2 === 0 ? "M0,100 L0,50 Q25,20 50,60 T100,20 L100,100 Z" : "M0,100 L0,80 Q25,90 50,40 T100,10 L100,100 Z"} fill="rgba(16, 185, 129, 0.05)" />
                  <path d={i % 2 === 0 ? "M0,50 Q25,20 50,60 T100,20" : "M0,80 Q25,90 50,40 T100,10"} fill="none" stroke="#10B981" strokeWidth="3" vectorEffect="non-scaling-stroke" />
                </svg>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px', alignItems: 'start' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
               {/* Backlink Profile */}
               <div className="glass-panel" style={{ padding: '40px' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                   <h3 style={{ fontSize: '1.4rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '12px' }}><Link2 size={20} color="var(--color-blue-main)" /> Backlink Profile Matrix</h3>
                   
                   {/* SpyFu Backlink Anatomy Chart */}
                   <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                     <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Link Anatomy</div>
                     <div style={{ display: 'flex', height: '12px', width: '200px', borderRadius: '6px', overflow: 'hidden' }}>
                        <div style={{ background: '#3B82F6', width: '45%' }} title="Editorial/News"></div>
                        <div style={{ background: '#10B981', width: '35%' }} title="Directories"></div>
                        <div style={{ background: '#F59E0B', width: '20%' }} title="Forums/Web2.0"></div>
                     </div>
                     <div style={{ display: 'flex', gap: '8px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '8px', height: '8px', background: '#3B82F6', borderRadius: '2px' }}></div> Edit. (45%)</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '8px', height: '8px', background: '#10B981', borderRadius: '2px' }}></div> Dir (35%)</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '8px', height: '8px', background: '#F59E0B', borderRadius: '2px' }}></div> UGC (20%)</span>
                     </div>
                   </div>
                 </div>
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

               {/* Toxic Links Disavow Engine */}
               <div className="glass-panel" style={{ padding: '40px', borderLeft: '4px solid #EF4444' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                     <h3 style={{ fontSize: '1.4rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '12px' }}><ShieldAlert size={20} color="#EF4444" /> Toxic SEO Attacks (Disavow Protocol)</h3>
                     <button onClick={() => triggerBackgroundBot("Alerting SRE: Toxic Link Node appended to Action Center queue.")} className="btn hover-lift" style={{ padding: '10px 20px', background: '#EF4444', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Target size={16}/> Push Payload to Action Center
                     </button>
                  </div>
                  
                  {domainData.toxic_links.length === 0 ? (
                     <div style={{ padding: '20px', background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', borderRadius: '8px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CheckCircle2 size={18}/> No active spam domains or negative SEO attacks detected. Data remains clean.
                     </div>
                  ) : (
                     <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                           <tr style={{ background: '#fef2f2' }}>
                              <th style={{ padding: '16px', color: '#EF4444', fontSize: '0.85rem', textTransform: 'uppercase' }}>Malicious Domain</th>
                              <th style={{ padding: '16px', color: '#EF4444', fontSize: '0.85rem', textTransform: 'uppercase' }}>Toxic Probability</th>
                              <th style={{ padding: '16px', color: '#EF4444', fontSize: '0.85rem', textTransform: 'uppercase' }}>Attack Vector</th>
                           </tr>
                        </thead>
                        <tbody>
                           {domainData.toxic_links.map(link => (
                              <tr key={link.id} style={{ borderBottom: '1px solid rgba(239, 68, 68, 0.1)' }}>
                                 <td style={{ padding: '16px', fontWeight: 700, color: '#111' }}>{link.source}</td>
                                 <td style={{ padding: '16px', fontWeight: 900, color: '#EF4444' }}>{link.score}%</td>
                                 <td style={{ padding: '16px', fontWeight: 600 }}>{link.status}</td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  )}
               </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
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
                              <td style={{ padding: '20px 16px', fontWeight: 600 }}>
                                 <Link to="/admin/content" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-blue-main)', textDecoration: 'none' }}>
                                    <ArrowUpRight size={14}/> {page.path}
                                 </Link>
                              </td>
                              <td style={{ padding: '20px 16px', fontWeight: 800 }}>{page.traffic.toLocaleString()}</td>
                              <td style={{ padding: '20px 16px' }}>
                                 <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <span style={{ 
                                       background: page.friction > 60 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', color: page.friction > 60 ? '#EF4444' : '#10B981',
                                       padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 800 
                                    }}>Friction: {page.friction}%</span>
                                    
                                    <button onClick={() => navigate('/admin/content')} className="hover-lift" style={{ background: '#3B82F6', color: 'white', border: 'none', borderRadius: '4px', height: '28px', padding: '0 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }} title="Optimize with Content Studio">
                                       <Crosshair size={14} style={{ marginRight: '6px' }} /> Optimize
                                    </button>

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
      {/* TAB 2: KEYWORDS EXPLORER & CLUSTERING */}
      {/* ========================================== */}
      {activeTab === 'keywords explorer' && (
        <div className="fade-in glass-panel" style={{ padding: '40px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
             <h3 style={{ fontSize: '1.5rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '12px' }}><Layers size={24} color="#10B981" /> Semantic Topic Clustering</h3>
          </div>
          
          {/* Semrush Keyword Magic Filters */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '30px', padding: '16px', background: 'var(--color-bg-light)', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)' }}>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Search Intent</span>
                <select style={{ padding: '10px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', outline: 'none' }}>
                   <option>All Intents</option>
                   <option>Transactional</option>
                   <option>Commercial</option>
                   <option>Informational</option>
                   <option>Navigational</option>
                </select>
             </div>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Volume Range</span>
                <select style={{ padding: '10px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', outline: 'none' }}>
                   <option>Any Volume</option>
                   <option>1,000 - 10,000</option>
                   <option>10,001 - 100,000</option>
                   <option>100,000+</option>
                </select>
             </div>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Keyword Difficulty (KD)</span>
                <select style={{ padding: '10px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', outline: 'none' }}>
                   <option>All Difficulties</option>
                   <option>Easy (0-30)</option>
                   <option>Possible (31-60)</option>
                   <option>Hard (61-100)</option>
                </select>
             </div>
             <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button onClick={() => alert("Advanced Data Filters arriving in v2.0")} className="btn btn-primary" style={{ height: '40px', padding: '0 20px', display: 'flex', alignItems: 'center', gap: '8px' }}><Target size={16}/> Apply Filters</button>
             </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px' }}>
             {domainData.keyword_clusters.length === 0 ? (
                <div style={{ padding: '30px', textAlign: 'center', color: 'var(--color-text-muted)', background: 'rgba(0,0,0,0.02)', borderRadius: '12px' }}>Awaiting enough data density to compute parent clusters.</div>
             ) : (
                domainData.keyword_clusters.map((cluster, i) => (
                   <div key={i} style={{ border: '1px solid rgba(0,0,0,0.1)', borderRadius: '12px', overflow: 'hidden' }}>
                      <div style={{ background: 'var(--color-bg-light)', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                         <h4 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Topic Silo Overview: {cluster.parent}</h4>
                         <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-blue-main)' }}>Aggregated Volume: {cluster.volume.toLocaleString()}</span>
                      </div>
                      <div style={{ padding: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                         {cluster.children.map((child, j) => (
                            <span key={j} style={{ padding: '6px 12px', background: 'white', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600 }}>{child}</span>
                         ))}
                      </div>
                   </div>
                ))
             )}
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
             <thead>
                <tr style={{ background: 'var(--color-bg-light)', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                  <th style={{ padding: '20px', fontSize: '0.85rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Keyword</th>
                  <th style={{ padding: '20px', fontSize: '0.85rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Intent Layer</th>
                  <th style={{ padding: '20px', fontSize: '0.85rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>KD (Difficulty)</th>
                  <th style={{ padding: '20px', fontSize: '0.85rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Search Volume</th>
                  <th style={{ padding: '20px', fontSize: '0.85rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Strategic Action (Hive Mind)</th>
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
                      <td style={{ padding: '20px' }}>
                         <button onClick={() => triggerBackgroundBot(`Content Studio activated. Drafting pillar outline for "${kw.keyword}"`)} className="btn hover-lift" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: 'var(--color-purple-main)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', boxShadow: '0 4px 15px rgba(147, 51, 234, 0.3)' }}>
                            <FileText size={16} /> Send to AI Content Studio
                         </button>
                      </td>
                   </tr>
                ))}
             </tbody>
          </table>
        </div>
      )}

      {/* ========================================== */}
      {/* TAB 3: LINK INTERSECT */}
      {/* ========================================== */}
      {activeTab === 'link intersect' && (
         <div className="fade-in glass-panel" style={{ padding: '40px' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}><Crosshair size={24} color="#8B5CF6" /> Link Intersect Matrix</h3>
            <p style={{ fontSize: '1rem', color: 'var(--color-text-muted)', marginBottom: '30px' }}>Mapping domains that link to competitors but not to {activeDomain}. These are your highest-probability link building targets.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' }}>
               {domainData.link_intersect.map((intersect, i) => (
                  <div key={i} style={{ border: '1px solid rgba(0,0,0,0.1)', borderRadius: '12px', background: 'white' }}>
                     <div style={{ padding: '20px', background: 'rgba(139, 92, 246, 0.05)', borderBottom: '1px solid rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#111' }}>Lost to: {intersect.competitor}</h4>
                     </div>
                     <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', flexGrow: 1 }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Intersecting Domains You Are Missing</div>
                        <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                           {intersect.connecting_domains.map((dom, j) => (
                              <li key={j} style={{ fontWeight: 600, color: 'var(--color-blue-main)', display: 'flex', alignItems: 'center', gap: '8px' }}><ArrowUpRight size={14}/> {dom}</li>
                           ))}
                        </ul>
                        <button onClick={() => triggerBackgroundBot("Alerting SRE: Missing Link Domain payload appended to Action Center queue for outreach validation.")} className="btn hover-lift" style={{ marginTop: 'auto', padding: '10px', background: '#8B5CF6', color: 'white', borderRadius: '8px', border: 'none', fontWeight: 800, cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: '8px' }}><Target size={16}/> Push Payload</button>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      )}

      {/* ========================================== */}
      {/* TAB 3B: COMPETITOR GAP */}
      {/* ========================================== */}
      {activeTab === 'competitor gap' && (
         <div className="fade-in glass-panel" style={{ padding: '40px' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}><Hash size={24} color="var(--color-blue-main)" /> Competitor Topic Gap Analysis</h3>
            <p style={{ fontSize: '1rem', color: 'var(--color-text-muted)', marginBottom: '30px' }}>Keywords that your competitors rank for, but <strong>{activeDomain}</strong> is missing.</p>

            {/* SpyFu Kombat Venn Diagram Parity */}
            <div style={{ position: 'relative', width: '300px', height: '300px', margin: '0 auto', marginBottom: '40px' }}>
               <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.4)', mixBlendMode: 'multiply', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ position: 'absolute', top: '-25px', width: '100%', textAlign: 'center', fontWeight: 800, color: '#1d4ed8' }}>{activeDomain}</span>
               </div>
               <div style={{ position: 'absolute', bottom: '20px', left: 0, width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.4)', mixBlendMode: 'multiply', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ position: 'absolute', bottom: '-25px', width: '100%', textAlign: 'center', fontWeight: 800, color: '#047857' }}>{domainData.competitors[0]?.domain || 'Competitor 1'}</span>
               </div>
               <div style={{ position: 'absolute', bottom: '20px', right: 0, width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.4)', mixBlendMode: 'multiply', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ position: 'absolute', bottom: '-25px', width: '100%', textAlign: 'center', fontWeight: 800, color: '#b45309' }}>{domainData.competitors[1]?.domain || 'Competitor 2'}</span>
               </div>
               {/* Core Overlap */}
               <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontWeight: 900, zIndex: 10, color: '#111', fontSize: '1.2rem', background: 'white', padding: '4px 8px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', whiteSpace: 'nowrap' }}>
                  Shared: 2,401
               </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
               <thead>
                  <tr style={{ background: 'var(--color-bg-light)', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                    <th style={{ padding: '20px', fontSize: '0.85rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Missing Topic / Keyword</th>
                    <th style={{ padding: '20px', fontSize: '0.85rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Present On</th>
                    <th style={{ padding: '20px', fontSize: '0.85rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Volume</th>
                    <th style={{ padding: '20px', fontSize: '0.85rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>KD</th>
                    <th style={{ padding: '20px', fontSize: '0.85rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Hive Mind Automation</th>
                  </tr>
               </thead>
               <tbody>
                  {domainData.competitor_gap && domainData.competitor_gap.map(gap => (
                     <tr key={gap.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', background: 'white' }}>
                        <td style={{ padding: '20px', fontWeight: 700, fontSize: '1.05rem', color: '#EF4444' }}>{gap.keyword}</td>
                        <td style={{ padding: '20px' }}>
                           <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                             {gap.present_on.map((comp, i) => (
                                <span key={i} style={{ fontSize: '0.75rem', fontWeight: 700, background: 'rgba(0,0,0,0.05)', padding: '4px 8px', borderRadius: '4px' }}>{comp}</span>
                             ))}
                           </div>
                        </td>
                        <td style={{ padding: '20px', fontWeight: 700 }}>{gap.search_volume.toLocaleString()}</td>
                        <td style={{ padding: '20px' }}>
                           <div style={{ width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: gap.kd > 60 ? 'rgba(239, 68, 68, 0.1)' : gap.kd > 30 ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)', color: gap.kd > 60 ? '#EF4444' : gap.kd > 30 ? '#F59E0B' : '#10B981', fontWeight: 900, fontSize: '0.85rem' }}>{gap.kd}</div>
                        </td>
                        <td style={{ padding: '20px' }}>
                           <button onClick={() => triggerBackgroundBot(`Alerting SRE: Pipeline constrained. Gap Topic "${gap.keyword}" pushed to Content Studio array for Claude 3.5 synthesis.`)} className="btn hover-lift" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: 'var(--color-purple-main)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', boxShadow: '0 4px 15px rgba(147, 51, 234, 0.3)' }}>
                              <Bot size={16} /> Auto-Draft Gap Content
                           </button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      )}

      {/* ========================================== */}
      {/* TAB 4: PPC SPYGLASS */}
      {/* ========================================== */}
      {activeTab === 'ppc spyglass' && (
         <div className="fade-in glass-panel" style={{ padding: '40px' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}><DollarSign size={24} color="#10B981" /> Paid Search Network Spyglass</h3>
            <p style={{ fontSize: '1rem', color: 'var(--color-text-muted)', marginBottom: '30px' }}>Reverse-engineering active competitor Google Ads, estimated CPC auctions, and ad copy.</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
               {domainData.ppc_ads.map((ad, i) => (
                  <div key={i} style={{ border: '1px solid rgba(0,0,0,0.1)', borderRadius: '12px', padding: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white' }}>
                     <div style={{ width: '60%' }}>
                        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 700, marginBottom: '8px' }}>Ad Target: <span style={{ color: 'var(--color-blue-main)' }}>{ad.competitor}</span></div>
                        <h4 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#111', lineHeight: '1.4', fontStyle: 'italic' }}>"{ad.ad_copy}"</h4>
                     </div>
                     <div style={{ display: 'flex', gap: '40px' }}>
                        <div>
                           <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Avg CPC Cost</div>
                           <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#10B981' }}>{ad.cpc}</div>
                        </div>
                        <div>
                           <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Paid Traffic Yield</div>
                           <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#111' }}>{ad.traffic.toLocaleString()}</div>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      )}

      {/* ========================================== */}
      {/* TAB 5: SITE AUDIT */}
      {/* ========================================== */}
      {activeTab === 'site audit' && (
         <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 2fr)', gap: '30px', alignItems: 'start' }}>
            <div className="glass-panel" style={{ padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
               <div style={{ position: 'relative', width: '200px', height: '200px', flexShrink: 0 }}>
                  <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%' }}>
                     <path strokeDasharray="100, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="3" />
                     <path strokeDasharray={`${domainData.audit.health_score}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#10B981" strokeWidth="3" style={{ strokeLinecap: 'round' }} />
                  </svg>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                     <span style={{ fontSize: '3.5rem', fontWeight: 900, color: '#10B981', lineHeight: '1' }}>{domainData.audit.health_score}</span>
                  </div>
               </div>
               <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginTop: '24px' }}>Excellent Health</h3>
               <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: '8px' }}>Based on {domainData.audit.urls_crawled.toLocaleString()} crawled pages.</p>
            </div>

            <div className="glass-panel" style={{ padding: '30px' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '8px' }}><ShieldAlert size={18} color="#EF4444" /> Technical Errors & Warnings</h3>
                  <button onClick={() => alert("Jira Integration arriving in v2.0")} className="btn btn-primary shadow-hover" style={{ padding: '8px 16px', fontSize: '0.85rem' }}><Code2 size={16}/> Export Dev Tickets</button>
               </div>

               <div style={{ display: 'flex', gap: '16px', marginBottom: '30px' }}>
                  <div style={{ flex: 1, padding: '16px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                     <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#EF4444', textTransform: 'uppercase' }}>Broken URLs</div>
                     <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#EF4444' }}>{domainData.audit.broken_urls}</div>
                  </div>
                  <div style={{ flex: 1, padding: '16px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                     <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#F59E0B', textTransform: 'uppercase' }}>Redirect Chains</div>
                     <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#F59E0B' }}>{domainData.audit.redirects}</div>
                  </div>
               </div>

               <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                     <tr style={{ background: 'rgba(0,0,0,0.02)', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                        <th style={{ padding: '12px 16px', fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Issue Type</th>
                        <th style={{ padding: '12px 16px', fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Top Affected Path</th>
                     </tr>
                  </thead>
                  <tbody>
                     {domainData.audit.critical_errors.map((err, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid rgba(0,0,0,0.03)' }}>
                           <td style={{ padding: '16px', fontWeight: 700, color: '#EF4444' }}>{err.type}</td>
                           <td style={{ padding: '16px', fontWeight: 600, color: 'var(--color-text-muted)' }}>{err.path}</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      )}

      {/* ========================================== */}
      {/* TAB: PERSONA SANDBOX (PHASE 8 CONTINUATION)*/}
      {/* ========================================== */}
      {activeTab === 'persona sandbox' && (
         <div className="fade-in glass-panel" style={{ padding: '40px' }}>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px', color: '#111' }}>
               <Bot size={24} color="#8B5CF6" /> Persona-Based Prompt Generation
            </h3>
            <p style={{ fontSize: '1.05rem', color: 'var(--color-text-muted)', margin: '0 0 30px 0' }}>
               Simulate exactly how different consumer demographics interact with AI engines. Generate engineered prompts to deploy live tests.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
               <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 800, marginBottom: '8px', color: 'var(--color-text-main)' }}>Target Persona Archetype</label>
                  <select 
                     value={activePersona} 
                     onChange={(e) => setActivePersona(e.target.value)}
                     style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', background: 'var(--color-bg-light)', fontSize: '1rem', fontWeight: 600, outline: 'none' }}>
                     <option>Gen-Z Tech Shopper</option>
                     <option>B2B Enterprise CTO</option>
                     <option>Local Discount Hunter</option>
                     <option>Academic Researcher</option>
                  </select>
               </div>
               <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 800, marginBottom: '8px', color: 'var(--color-text-main)' }}>Target AI Engine</label>
                  <select 
                     value={activeLLM} 
                     onChange={(e) => setActiveLLM(e.target.value)}
                     style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', background: 'var(--color-bg-light)', fontSize: '1rem', fontWeight: 600, outline: 'none' }}>
                     <option>Perplexity Pro</option>
                     <option>ChatGPT-4o</option>
                     <option>Claude 3.5 Sonnet</option>
                     <option>Google AI Overviews</option>
                  </select>
               </div>
            </div>

            <button 
               onClick={runPersonaPrompt}
               className="btn hover-lift" 
               style={{ background: '#8B5CF6', color: 'white', padding: '16px 30px', fontSize: '1.05rem', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 800, display: 'flex', gap: '10px', alignItems: 'center' }}>
               {isGeneratingPrompt ? <div className="spinner" style={{width: 18, height: 18, border: '3px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite'}} /> : <Zap size={20} />}
               {isGeneratingPrompt ? 'Synthesizing Prompt...' : 'Generate Zero-Click Prompt'}
            </button>

            {generatedPrompt && (
               <div className="fade-in" style={{ marginTop: '40px', padding: '30px', background: 'rgba(139, 92, 246, 0.05)', border: '1px dashed rgba(139, 92, 246, 0.3)', borderRadius: '16px' }}>
                  <div style={{ fontSize: '0.85rem', color: '#8B5CF6', fontWeight: 800, textTransform: 'uppercase', marginBottom: '12px' }}>Engineered Result</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 600, color: '#111', fontStyle: 'italic', lineHeight: '1.5' }}>
                     {generatedPrompt}
                  </div>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                     <button onClick={() => { navigator.clipboard.writeText(generatedPrompt); alert("Copied to clipboard!"); }} className="btn" style={{ background: '#111', color: 'white', padding: '10px 20px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 700, border: 'none', cursor: 'pointer' }}>Copy Prompt</button>
                     <button onClick={() => alert("Live Execution Sandbox arriving in v2.0")} className="btn" style={{ background: 'white', color: '#111', border: '1px solid rgba(0,0,0,0.1)', padding: '10px 20px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer' }}>Execute in Sandbox</button>
                  </div>
               </div>
            )}
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
