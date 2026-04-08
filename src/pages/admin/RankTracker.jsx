import React, { useState, useContext } from 'react';
import { LineChart, Globe, Activity, ArrowUpRight, ArrowDownRight, Layers, Database, Lock, AlertTriangle, Zap, Bot, Share2, Code2, Network } from 'lucide-react';
import { GlobalDomainContext } from '../../layouts/AdminLayout';
import { useNavigate } from 'react-router-dom';

const MOCK_TRACKING_DATA = {
  '75squared.com': {
    visibility: "0%",
    top3: 0,
    top10: 0,
    bleeding: 0,
    keywords: [
      { id: 1, word: "75 squared digital marketing", intent: "Navigational", rank: 1, prev: 1, volume: 10, features: ["Site Links"], diff: 0 }
    ]
  },
  'goodyslv.com': {
    visibility: "14.2%",
    top3: 12,
    top10: 45,
    bleeding: 8,
    keywords: [
      { id: 1, word: "buy gourmet popcorn online", intent: "Transactional", rank: 2, prev: 4, volume: 8400, features: ["Shopping", "Reviews"], diff: 2 },
      { id: 2, word: "custom corporate gifts las vegas", intent: "Commercial", rank: 5, prev: 1, volume: 3200, features: ["Local Pack"], diff: -4 },
      { id: 3, word: "best cheddar popcorn", intent: "Informational", rank: 8, prev: 8, volume: 12500, features: ["Featured Snippet", "FAQ"], diff: 0 },
      { id: 4, word: "bulk popcorn tins", intent: "Transactional", rank: 14, prev: 11, volume: 6800, features: ["Shopping"], diff: -3 },
      { id: 5, word: "caramel popcorn recipe", intent: "Informational", rank: 22, prev: 15, volume: 45000, features: ["Recipe Card", "Video"], diff: -7 }
    ]
  },
  'lrms.com': {
    visibility: "42.8%",
    top3: 15,
    top10: 84,
    bleeding: 2,
    keywords: [
      { id: 1, word: "cloud library management system", intent: "Commercial", rank: 2, prev: 4, volume: 8400, features: ["Site Links", "Reviews"], diff: 2 },
      { id: 2, word: "automated opac catalog", intent: "Transactional", rank: 1, prev: 1, volume: 3200, features: ["Local Pack"], diff: 0 },
      { id: 3, word: "k-12 library database software", intent: "Commercial", rank: 8, prev: 5, volume: 12500, features: ["FAQ"], diff: -3 }
    ]
  }
};

const RankTracker = () => {
  const navigate = useNavigate();
  const { activeDomain } = useContext(GlobalDomainContext);
  
  // Safe resolution logic to prevent data collisions from UI states
  const normalizedDomain = activeDomain ? String(activeDomain).toLowerCase().trim() : '';
  const domainKey = ['goodyslv.com', 'lrms.com'].find(key => normalizedDomain.includes(key)) || '75squared.com';
  const data = MOCK_TRACKING_DATA[domainKey] || MOCK_TRACKING_DATA['75squared.com'];

  const [toastMessage, setToastMessage] = useState('');
  const [autoResolveMode, setAutoResolveMode] = useState(false);

  const triggerIntercept = (action, keyword, path = '/admin/action-center') => {
    setToastMessage(`[${keyword}] - ${action}`);
    setTimeout(() => {
       setToastMessage('');
       navigate(path);
    }, 1500);
  };

  return (
    <div style={{ paddingBottom: '100px' }}>
      
      {/* Header Array */}
      <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <LineChart size={36} color="var(--color-blue-main)" /> Rank Tracking Engine
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>
            Daily positional trajectory mapping and autonomous tactical intercept sequencing.
          </p>
        </div>
      </div>

      {/* Autonomous System Governance */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '16px', padding: '16px 24px', marginBottom: '40px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
         <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#111' }}>Autonomous Algorithmic Recovery</span>
            <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>When active, Nexus bypasses the SRE validation queue and pushes algorithmic NLP recovery revisions straight to the Content pipeline if a position drop &gt; 3 is detected.</span>
         </div>
         <button 
             onClick={() => setAutoResolveMode(!autoResolveMode)}
             style={{ background: autoResolveMode ? 'var(--color-green-main)' : 'rgba(0,0,0,0.1)', border: 'none', borderRadius: '20px', width: '50px', height: '26px', position: 'relative', cursor: 'pointer', transition: '0.3s' }}>
             <div style={{ position: 'absolute', top: '3px', left: autoResolveMode ? '27px' : '3px', width: '20px', height: '20px', background: 'white', borderRadius: '50%', transition: '0.3s', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}></div>
         </button>
      </div>

      {/* KPI Visibility Matrix */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
         <div className="glass-panel" style={{ padding: '30px' }}>
            <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '12px' }}>Visibility Index (Share of Voice)</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#111' }}>{data.visibility}</div>
         </div>
         <div className="glass-panel" style={{ padding: '30px', borderTop: '4px solid #10B981' }}>
            <div style={{ fontSize: '0.9rem', color: '#10B981', fontWeight: 800, textTransform: 'uppercase', marginBottom: '12px' }}>Top 3 Rankings</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#10B981' }}>{data.top3}</div>
         </div>
         <div className="glass-panel" style={{ padding: '30px', borderTop: '4px solid #3B82F6' }}>
            <div style={{ fontSize: '0.9rem', color: '#3B82F6', fontWeight: 800, textTransform: 'uppercase', marginBottom: '12px' }}>Positions 4-10 (Striking Distance)</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#3B82F6' }}>{data.top10}</div>
         </div>
         <div className="glass-panel" style={{ padding: '30px', borderTop: '4px solid #EF4444' }}>
            <div style={{ fontSize: '0.9rem', color: '#EF4444', fontWeight: 800, textTransform: 'uppercase', marginBottom: '12px' }}>Bleeding (Drop &gt; 3 Spots)</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#EF4444' }}>{data.bleeding}</div>
         </div>
      </div>

      {/* Trajectory Table & Hive Mind Intercepts */}
      <div className="glass-panel" style={{ padding: '40px' }}>
         <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}><Activity size={20} color="var(--color-blue-main)" /> Positional Datatable & Active Intercepts</h3>
         
         <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
               <tr style={{ background: 'rgba(0,0,0,0.02)', borderBottom: '2px solid rgba(0,0,0,0.05)' }}>
                  <th style={{ padding: '16px', color: 'var(--color-text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Keyword Entity</th>
                  <th style={{ padding: '16px', color: 'var(--color-text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Current Position</th>
                  <th style={{ padding: '16px', color: 'var(--color-text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Active SERP Features</th>
                  <th style={{ padding: '16px', color: 'var(--color-text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Hive Mind Tactical Intercept</th>
               </tr>
            </thead>
            <tbody>
               {data.keywords.map(kw => (
                  <tr key={kw.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', transition: 'background 0.2s', ':hover': { background: 'rgba(0,0,0,0.01)' } }}>
                     
                     {/* Keyword details */}
                     <td style={{ padding: '24px 16px' }}>
                        <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#111', marginBottom: '6px' }}>{kw.word}</div>
                        <div style={{ display: 'flex', gap: '12px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)' }}>
                           <span style={{ background: 'var(--color-bg-light)', padding: '4px 8px', borderRadius: '4px' }}>Vol: {kw.volume.toLocaleString()}</span>
                           <span style={{ background: 'var(--color-bg-light)', padding: '4px 8px', borderRadius: '4px' }}>{kw.intent}</span>
                        </div>
                     </td>

                     {/* Rank Mechanics */}
                     <td style={{ padding: '24px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                           <span style={{ fontSize: '1.6rem', fontWeight: 900, color: '#111' }}>#{kw.rank}</span>
                           {kw.diff !== 0 && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem', fontWeight: 800, color: kw.diff > 0 ? '#10B981' : '#EF4444' }}>
                                 {kw.diff > 0 ? <ArrowUpRight size={16}/> : <ArrowDownRight size={16}/>}
                                 {Math.abs(kw.diff)}
                              </div>
                           )}
                           {kw.diff === 0 && <span style={{ fontSize: '1rem', color: 'var(--color-text-muted)' }}>-</span>}
                        </div>
                     </td>

                     {/* SERP Opportunities */}
                     <td style={{ padding: '24px 16px' }}>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                           {kw.features.map((f, i) => (
                              <span key={i} style={{ padding: '6px 12px', background: 'rgba(147, 51, 234, 0.08)', color: 'var(--color-purple-dark)', fontSize: '0.8rem', fontWeight: 800, borderRadius: '20px', border: '1px solid rgba(147, 51, 234, 0.2)' }}>
                                 {f}
                              </span>
                           ))}
                        </div>
                     </td>

                     {/* Tactical Execution Vectors */}
                     <td style={{ padding: '24px 16px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                           
                           {/* Logic 1: Bleeding Keyword Intercepts */}
                           {kw.diff <= -3 && (
                                 <button onClick={() => triggerIntercept(autoResolveMode ? "Autonomous Recovery Triggered: Injecting revised NLP payload via Studio API." : "Alerting SRE: Positional bleeding tracked and routed to Action Center queue.", kw.word, autoResolveMode ? '/admin/content' : '/admin/action-center')} className="btn hover-lift" style={{ padding: '8px 16px', background: autoResolveMode ? 'var(--color-green-main)' : 'white', border: autoResolveMode ? 'none' : '1px solid #EF4444', color: autoResolveMode ? 'white' : '#EF4444', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: autoResolveMode ? '0 4px 12px rgba(16, 185, 129, 0.3)' : 'none' }}>
                                    {autoResolveMode ? <Zap size={14} /> : <Bot size={14} />} {autoResolveMode ? "Deploy Autonomous Revision" : "Send Payload to Action Center"}
                                 </button>
                           )}

                           {/* Logic 2: Featured Snippet / Schema Opportunity */}
                           {kw.features.includes("Featured Snippet") || kw.features.includes("FAQ") || kw.features.includes("Recipe Card") ? (
                              <button onClick={() => triggerIntercept("Alerting SRE: SERP Schema anomaly routed to Action Center queue.", kw.word)} className="btn" style={{ padding: '8px 16px', background: 'transparent', border: '1px solid var(--color-purple-main)', color: 'var(--color-purple-main)', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: 'all 0.2s', ':hover': { background: 'var(--color-purple-main)', color: 'white' } }}>
                                 <Network size={14} /> Send Payload to Action Center
                              </button>
                           ) : null}

                           {/* Logic 3: Top Rank Locked */}
                           {kw.rank <= 3 && kw.diff >= 0 && (
                              <span style={{ fontSize: '0.85rem', color: '#10B981', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                 <Lock size={14} /> SERP Domination Locked
                              </span>
                           )}

                        </div>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>

      {/* Global Bot Telemetry Toast */}
      {toastMessage && (
         <div className="fade-in" style={{ position: 'fixed', bottom: '40px', right: '40px', background: '#111', color: 'white', padding: '20px 30px', borderRadius: '16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', zIndex: 10001, border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '20px', background: 'rgba(147, 51, 234, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <Database size={24} color="#C084FC" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
               <span style={{ fontSize: '0.85rem', color: '#C084FC', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 800 }}>Hive Mind Execution Confirmed</span>
               <span style={{ fontSize: '0.95rem', marginTop: '4px' }}>{toastMessage}</span>
            </div>
         </div>
      )}

    </div>
  );
};

export default RankTracker;
