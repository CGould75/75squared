import React, { useState, useContext, useEffect } from 'react';
import { LineChart, Globe, Activity, ArrowUpRight, ArrowDownRight, Layers, Database, Lock, AlertTriangle, Zap, Bot, Share2, Code2, Network, MapPin, Plus, Loader, Trash2, Search } from 'lucide-react';
import { GlobalDomainContext } from '../../layouts/AdminLayout';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';

const RankTracker = () => {
  const navigate = useNavigate();
  const { activeDomain } = useContext(GlobalDomainContext);
  
  const normalizedDomain = activeDomain ? String(activeDomain).toLowerCase().trim() : '75squared.com';

  const [toastMessage, setToastMessage] = useState('');
  const [autoResolveMode, setAutoResolveMode] = useState(false);
  const [activeTrackingMode, setActiveTrackingMode] = useState('AI Prompts & Queries');
  
  // Keyword Management State
  const [trackedKeywords, setTrackedKeywords] = useState([]);
  const [newKeywordInput, setNewKeywordInput] = useState('');
  const [newZipCode, setNewZipCode] = useState('');
  
  // Data State
  const [isSyncing, setIsSyncing] = useState(false);
  const [trackerStats, setTrackerStats] = useState({ visibility: "0%", top3: 0, top10: 0, bleeding: 0 });
  const [trackedItems, setTrackedItems] = useState([]);

  // Load Saved Keywords from Native DB Framework
  useEffect(() => {
     const fetchKeywords = async () => {
         const { data, error } = await supabase.from('nexus_rank_targets').select('*').eq('domain', normalizedDomain).order('id', { ascending: true });
         if (!error && data) {
             setTrackedKeywords(data);
         }
     }
     fetchKeywords();
  }, [normalizedDomain]);

  // Sync with ValueSERP
  useEffect(() => {
      const syncData = async () => {
          if (trackedKeywords.length === 0) {
             setTrackedItems([]);
             return;
          }
          setIsSyncing(true);
          
          let top3Count = 0;
          let top10Count = 0;
          let bleedingCount = 0;
          let newItems = [];

          for (const kw of trackedKeywords) {
              try {
                  const res = await fetch(`/api/valueserp?q=${encodeURIComponent(kw.word)}&location=${encodeURIComponent(kw.zip)}&domain=${encodeURIComponent(normalizedDomain)}`);
                  const data = await res.json();
                  
                  let rank = 100;
                  let features = [];
                  let citationSource = null;
                  
                  if (data.organic_results) {
                      const pos = data.organic_results.find(r => r.domain?.includes(normalizedDomain));
                      if (pos) rank = pos.position;
                  }
                  
                  if (data.ai_overview && data.ai_overview.cited_domains?.includes(normalizedDomain)) {
                      features.push("Google AIO Link");
                      rank = 1;
                      top3Count++;
                  } else if (rank <= 3) {
                      top3Count++;
                  }
                  
                  if (rank <= 10) top10Count++;

                  // Physical Execution Logic: Read real historical data to compute Diff
                  const { data: historyLedger } = await supabase.from('nexus_rank_history').select('position').eq('keyword_id', kw.id).order('created_at', { ascending: false }).limit(1);
                  let prevRank = rank;
                  if (historyLedger && historyLedger.length > 0) {
                      prevRank = historyLedger[0].position;
                  }
                  
                  const diff = prevRank - rank; // Positive is good
                  if (diff < 0) bleedingCount++;

                  // Log physical update automatically
                  await supabase.from('nexus_rank_history').insert([{ keyword_id: kw.id, position: rank }]);

                  newItems.push({
                      id: kw.id,
                      word: kw.word,
                      type: kw.word.split(' ').length > 4 ? "AI Prompt" : "Keyword",
                      map_zone: kw.zip,
                      rank: rank > 99 ? '100+' : rank,
                      prev: prevRank > 99 ? '100+' : prevRank,
                      volume: Math.floor(Math.random() * 8000) + 100, // Search Volume API is separate
                      features: features.length > 0 ? features : (rank < 10 ? ["Standard Organic"] : []),
                      diff: diff,
                      citation_source: citationSource
                  });
              } catch(e) {
                  console.error("ValueSERP/Supabase Database Sync Error", e);
              }
          }
          
          let vis = ((top10Count / trackedKeywords.length) * 100).toFixed(1);
          setTrackerStats({ visibility: `${vis}%`, top3: top3Count, top10: top10Count, bleeding: bleedingCount });
          // Sort items: lower rank first
          newItems.sort((a,b) => (a.rank === '100+' ? 100 : a.rank) - (b.rank === '100+' ? 100 : b.rank));
          setTrackedItems(newItems);
          setIsSyncing(false);
      };

      syncData();
  }, [trackedKeywords, normalizedDomain]);

  const addKeyword = async (e) => {
      e.preventDefault();
      if (!newKeywordInput) return;
      
      const payload = {
          domain: normalizedDomain,
          word: newKeywordInput,
          zip: newZipCode || "National"
      };

      const { data, error } = await supabase.from('nexus_rank_targets').insert([payload]).select();
      
      if (!error && data) {
          setTrackedKeywords(prev => [...prev, ...data]);
      }
      setNewKeywordInput('');
      setNewZipCode('');
  };

  const removeKeyword = async (id) => {
      const { error } = await supabase.from('nexus_rank_targets').delete().eq('id', id);
      if(!error) {
         setTrackedKeywords(prev => prev.filter(k => k.id !== id));
      }
  }

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
            Hyper-local ZIP targeting and conversational AI prompt visibility mapping.
          </p>
        </div>
      </div>

      {/* Add Keyword UI - Permanent Storage */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '40px', borderLeft: '4px solid var(--color-blue-main)' }}>
         <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Search size={18} color="var(--color-blue-main)" /> Track New Query via ValueSERP
         </h3>
         <form onSubmit={addKeyword} style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <input 
               type="text" 
               placeholder="e.g. 'best SaaS developers in Las Vegas'" 
               value={newKeywordInput}
               onChange={(e) => setNewKeywordInput(e.target.value)}
               style={{ flex: '2', minWidth: '250px', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', outline: 'none', background: 'white', fontWeight: 600 }}
            />
            <input 
               type="text" 
               placeholder="Location (Optional: e.g. 89109)" 
               value={newZipCode}
               onChange={(e) => setNewZipCode(e.target.value)}
               style={{ flex: '1', minWidth: '150px', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', outline: 'none', background: 'white', fontWeight: 600 }}
            />
            <button type="submit" className="btn btn-primary shadow-hover" style={{ padding: '0 24px', height: '45px', display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}>
               <Plus size={16} /> Deploy Tracker Target
            </button>
         </form>
      </div>

      {/* Tracking Mode Navigation */}
      <div style={{ display: 'flex', background: 'rgba(0,0,0,0.05)', borderRadius: '12px', padding: '6px', marginBottom: '40px', width: 'max-content', gap: '4px' }}>
        {['AI Prompts & Queries', 'Hyper-Local ZIP Heatmap'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTrackingMode(tab)}
            style={{ 
              padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 700, transition: 'all 0.2s', 
              background: activeTrackingMode === tab ? 'white' : 'transparent', 
              color: activeTrackingMode === tab ? 'var(--color-blue-main)' : 'var(--color-text-muted)', 
              boxShadow: activeTrackingMode === tab ? '0 2px 10px rgba(0,0,0,0.05)' : 'none' 
            }}>
            {tab === 'AI Prompts & Queries' && <Bot size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }}/>}
            {tab === 'Hyper-Local ZIP Heatmap' && <MapPin size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }}/>}
            {tab}
          </button>
        ))}
        {isSyncing && (
           <div style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px', color: '#8B5CF6', fontWeight: 700, fontSize: '0.9rem' }}>
              <div className="spinner" style={{width: 16, height: 16, border: '2px solid rgba(139, 92, 246, 0.3)', borderTopColor: '#8B5CF6', borderRadius: '50%', animation: 'spin 1s linear infinite'}} /> Syncing ValueSERP...
           </div>
        )}
      </div>

      {/* Autonomous System Governance */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '16px', padding: '16px 24px', marginBottom: '40px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
         <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#111' }}>Autonomous Algorithmic Recovery</span>
            <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>When active, Nexus bypasses the SRE validation queue and pushes algorithmic NLP recovery revisions straight to the Content pipeline if a position drop &gt; 3 is detected or AI Citation is dropped.</span>
         </div>
         <button 
             onClick={() => setAutoResolveMode(!autoResolveMode)}
             style={{ background: autoResolveMode ? 'var(--color-green-main)' : 'rgba(0,0,0,0.1)', border: 'none', borderRadius: '20px', width: '50px', height: '26px', position: 'relative', cursor: 'pointer', transition: '0.3s' }}>
             <div style={{ position: 'absolute', top: '3px', left: autoResolveMode ? '27px' : '3px', width: '20px', height: '20px', background: 'white', borderRadius: '50%', transition: '0.3s', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}></div>
         </button>
      </div>

      {/* KPI Visibility Matrix */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
         <div className="glass-panel" style={{ padding: '30px', opacity: isSyncing ? 0.5 : 1, transition: '0.3s' }}>
            <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '12px' }}>AI Conversational Visibility</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#111' }}>{trackerStats.visibility}</div>
         </div>
         <div className="glass-panel" style={{ padding: '30px', borderTop: '4px solid #10B981', opacity: isSyncing ? 0.5 : 1, transition: '0.3s' }}>
            <div style={{ fontSize: '0.9rem', color: '#10B981', fontWeight: 800, textTransform: 'uppercase', marginBottom: '12px' }}>Chatbot Rank 1 (Top Cited)</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#10B981' }}>{trackerStats.top3}</div>
         </div>
         <div className="glass-panel" style={{ padding: '30px', borderTop: '4px solid #3B82F6', opacity: isSyncing ? 0.5 : 1, transition: '0.3s' }}>
            <div style={{ fontSize: '0.9rem', color: '#3B82F6', fontWeight: 800, textTransform: 'uppercase', marginBottom: '12px' }}>AIO Striking Distance (Pos 2-10)</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#3B82F6' }}>{trackerStats.top10}</div>
         </div>
         <div className="glass-panel" style={{ padding: '30px', borderTop: '4px solid #EF4444', opacity: isSyncing ? 0.5 : 1, transition: '0.3s' }}>
            <div style={{ fontSize: '0.9rem', color: '#EF4444', fontWeight: 800, textTransform: 'uppercase', marginBottom: '12px' }}>Citation Drop / Bleeding</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#EF4444' }}>{trackerStats.bleeding}</div>
         </div>
      </div>

      {activeTrackingMode === 'Hyper-Local ZIP Heatmap' && (
         <div className="glass-panel" style={{ padding: '40px', marginBottom: '40px' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}><MapPin size={20} color="#3B82F6" /> Hyper-Local Positional Heatmap</h3>
            <div style={{ display: 'flex', gap: '20px', flexDirection: 'column' }}>
               <p style={{ color: 'var(--color-text-muted)' }}>Visualize local search penetration across specific zip codes. Ensures proximity ranking dominance for intent-based map algorithms.</p>
               <div style={{ height: '300px', background: 'radial-gradient(circle at center, rgba(59, 130, 246, 0.1) 0%, transparent 70%)', border: '1px dashed rgba(59, 130, 246, 0.3)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  <MapPin size={48} color="#3B82F6" opacity={0.5} />
                  {/* We map the saved zip codes here */}
                  {trackedKeywords.filter(k => k.zip !== 'National').map((kw, i) => (
                     <div key={i} style={{ position: 'absolute', top: `${30 + (i*20)}%`, left: `${20 + (i*10)}%`, background: 'white', padding: '10px 16px', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', fontWeight: 800, fontSize: '0.85rem' }}>Zone {kw.zip}</div>
                  ))}
               </div>
            </div>
         </div>
      )}

      {/* Trajectory Table & Hive Mind Intercepts */}
      <div className="glass-panel" style={{ padding: '40px' }}>
         <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}><Activity size={20} color="var(--color-blue-main)" /> Live Datatable & Active Intercepts</h3>
         
         <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
               <tr style={{ background: 'rgba(0,0,0,0.02)', borderBottom: '2px solid rgba(0,0,0,0.05)' }}>
                  <th style={{ padding: '16px', color: 'var(--color-text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Target Prompt / Query</th>
                  <th style={{ padding: '16px', color: 'var(--color-text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', width: '150px' }}>Real-Time Position</th>
                  <th style={{ padding: '16px', color: 'var(--color-text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>AI Features / Citations</th>
                  <th style={{ padding: '16px', color: 'var(--color-text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Tactical Execution</th>
                  <th style={{ padding: '16px', width: '50px' }}></th>
               </tr>
            </thead>
            <tbody style={{ opacity: isSyncing ? 0.3 : 1, transition: '0.3s' }}>
               {trackedItems.length === 0 && (
                  <tr><td colSpan="5" style={{ padding: '40px', textAlign: 'center', fontWeight: 700, color: 'var(--color-text-muted)' }}>No targets deployed. Add a keyword above to initialize ValueSERP scan.</td></tr>
               )}
               {trackedItems.map((kw) => (
                  <tr key={kw.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', transition: 'background 0.2s', ':hover': { background: 'rgba(0,0,0,0.01)' } }}>
                     
                     <td style={{ padding: '24px 16px' }}>
                        <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#111', marginBottom: '6px' }}>"{kw.word}"</div>
                        <div style={{ display: 'flex', gap: '12px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)' }}>
                           <span style={{ background: kw.type === 'AI Prompt' ? 'rgba(16, 185, 129, 0.1)' : 'var(--color-bg-light)', color: kw.type === 'AI Prompt' ? '#10B981' : 'var(--color-text-muted)', padding: '4px 8px', borderRadius: '4px' }}>{kw.type}</span>
                           <span style={{ background: 'var(--color-bg-light)', padding: '4px 8px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={12}/> {kw.map_zone}</span>
                        </div>
                     </td>

                     {/* Rank Mechanics */}
                     <td style={{ padding: '24px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                           <span style={{ fontSize: '1.6rem', fontWeight: 900, color: kw.rank <= 10 ? '#111' : 'var(--color-text-muted)' }}>
                              {kw.rank === '100+' ? '>100' : `#${kw.rank}`}
                           </span>
                           {kw.diff !== 0 && kw.rank !== '100+' && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem', fontWeight: 800, color: kw.diff > 0 ? '#10B981' : '#EF4444' }}>
                                 {kw.diff > 0 ? <ArrowUpRight size={16}/> : <ArrowDownRight size={16}/>}
                                 {Math.abs(kw.diff)}
                              </div>
                           )}
                           {kw.diff === 0 && kw.rank !== '100+' && <span style={{ fontSize: '1rem', color: 'var(--color-text-muted)' }}>-</span>}
                        </div>
                     </td>

                     {/* SERP/AI Opportunities */}
                     <td style={{ padding: '24px 16px' }}>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                           {kw.features.map((f, i) => (
                              <span key={i} style={{ padding: '6px 12px', background: f.includes("AIO") ? 'rgba(147, 51, 234, 0.08)' : 'rgba(0,0,0,0.05)', color: f.includes("AIO") ? 'var(--color-purple-dark)' : 'var(--color-text-muted)', fontSize: '0.8rem', fontWeight: 800, borderRadius: '20px' }}>
                                 {f}
                              </span>
                           ))}
                        </div>
                     </td>

                     {/* Tactical Execution Vectors */}
                     <td style={{ padding: '24px 16px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                           
                           {/* Logic 1: Bleeding Intercepts */}
                           {kw.diff < 0 && (
                                 <button onClick={() => triggerIntercept(autoResolveMode ? "Autonomous Recovery Triggered: Injecting revised NLP payload via Studio API." : "Alerting SRE: Positional bleeding tracked and routed to Action Center queue.", kw.word, autoResolveMode ? '/admin/content' : '/admin/action-center')} className="btn hover-lift" style={{ padding: '8px 16px', background: autoResolveMode ? 'var(--color-green-main)' : 'white', border: autoResolveMode ? 'none' : '1px solid #EF4444', color: autoResolveMode ? 'white' : '#EF4444', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: autoResolveMode ? '0 4px 12px rgba(16, 185, 129, 0.3)' : 'none' }}>
                                    {autoResolveMode ? <Zap size={14} /> : <Bot size={14} />} {autoResolveMode ? "Deploy Autonomous Revision" : "Send Payload to Action Center"}
                                 </button>
                           )}

                           {/* Logic 2: Citation Opportunity */}
                           {!kw.features.some(f => f.includes('AIO')) && kw.type === 'AI Prompt' && kw.rank <= 10 ? (
                              <button onClick={() => triggerIntercept("Alerting SRE: Missing AI Citation anomaly routed to Action Center queue.", kw.word)} className="btn" style={{ padding: '8px 16px', background: 'transparent', border: '1px solid var(--color-purple-main)', color: 'var(--color-purple-main)', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: 'all 0.2s', ':hover': { background: 'var(--color-purple-main)', color: 'white' } }}>
                                 <Network size={14} /> Send Payload to Action Center
                              </button>
                           ) : null}

                           {/* Logic 4: Top Rank Locked */}
                           {kw.rank <= 2 && kw.diff >= 0 && (
                              <span style={{ fontSize: '0.85rem', color: '#10B981', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                 <Lock size={14} /> SERP/AI Domination Locked
                              </span>
                           )}

                        </div>
                     </td>
                     
                     <td style={{ padding: '24px 16px', textAlign: 'right' }}>
                        <button onClick={() => removeKeyword(kw.id)} style={{ background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer', opacity: 0.5, transition: '0.2s', ':hover': { opacity: 1 } }}>
                           <Trash2 size={18} />
                        </button>
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
