import React, { useState } from 'react';
import { Ghost, AlertTriangle, ArrowRight, Zap, CheckCircle2, XCircle, MousePointerClick, Bot, Code2, LineChart, SplitSquareHorizontal, ShieldCheck, FileSearch, Maximize } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';

const GhostEditor = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('feed');
  const [anomalies, setAnomalies] = useState([]);
  const [selectedAnomaly, setSelectedAnomaly] = useState(null);
  const [loading, setLoading] = useState(true);

  // New Telemetry + Actions UI State
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [telemetryModalData, setTelemetryModalData] = useState(null);
  
  // Canary Routing UI State
  const [splitSliderData, setSplitSliderData] = useState(null);
  const [splitWeight, setSplitWeight] = useState(50);
  const [showFullScreenPreview, setShowFullScreenPreview] = useState(false);

  React.useEffect(() => {
    const fetchAnomalies = async () => {
      const { data } = await supabase.from('ab_mutations').select('*').order('id', { ascending: true });
      if (data) {
         // Filter out resolved items so they disappear from active view
         const activeAnomalies = data.filter(a => a.status === 'Awaiting Approval' || a.status === 'A/B Test Running');
         setAnomalies(activeAnomalies);
      }
      setLoading(false);
    };
    fetchAnomalies();
  }, [activeTab]);

  const deployMutationToEdge = async (anomalyId) => {
    const { data } = await supabase.from('ab_mutations').update({ status: 'A/B Test Running' }).eq('id', anomalyId);
    setActiveTab('feed');
  };

  const handleActionDeployWinner = async (id) => {
     await supabase.from('ab_mutations').update({ status: 'Deployed' }).eq('id', id);
     setAnomalies(prev => prev.filter(a => a.id !== id));
     setOpenDropdownId(null);
  };

  const handleActionRollback = async (id) => {
     await supabase.from('ab_mutations').update({ status: 'Rolled Back' }).eq('id', id);
     setAnomalies(prev => prev.filter(a => a.id !== id));
     setOpenDropdownId(null);
  };

  const handleActionHeatmap = (id) => {
     navigate(`/admin/heatmaps?context=ab_test_${id}`);
  };

  const handleActionAdjustSplit = (anomaly) => {
     setSplitSliderData(anomaly);
     setOpenDropdownId(null);
     setSplitWeight(50); 
  };
  
  const saveSplitWeight = () => {
     setSplitSliderData(null);
  };

  // Generate deterministic pseudo-random numbers based on string seed for realistic UX
  const getSimulatedTraffic = (seedStr) => {
     let hash = 0;
     if (!seedStr) return { base: 4204, variantTraffic: 4198, delay: 0.02, risk: 'LOW' };
     const str = String(seedStr);
     for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
     }
     const base = Math.abs(hash % 15000) + 1200; 
     const variantTraffic = base - (Math.abs(hash % 80));
     const delay = (Math.abs(hash % 8) * 0.01 + 0.01).toFixed(2);
     const risk = delay > 0.05 ? 'MEDIUM' : 'LOW';
     return { base, variantTraffic, delay, risk };
  };

  return (
    <div>
      <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Ghost size={36} color="var(--color-purple-main)" /> Ghost Editor
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>
            Autonomous DOM Mutation and A/B Justification Engine.
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '8px', background: 'rgba(0,0,0,0.05)', padding: '4px', borderRadius: '12px' }}>
          <button 
             onClick={() => setActiveTab('feed')}
             style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, background: activeTab === 'feed' ? 'white' : 'transparent', color: activeTab === 'feed' ? 'var(--color-text-main)' : 'var(--color-text-muted)', boxShadow: activeTab === 'feed' ? '0 2px 10px rgba(0,0,0,0.05)' : 'none' }}>
             Anomaly Radar
          </button>
          <button 
             onClick={() => setActiveTab('justification')}
             style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, background: activeTab === 'justification' ? 'white' : 'transparent', color: activeTab === 'justification' ? 'var(--color-text-main)' : 'var(--color-text-muted)', boxShadow: activeTab === 'justification' ? '0 2px 10px rgba(0,0,0,0.05)' : 'none' }}>
             Active Justifications
          </button>
        </div>
      </div>

      {activeTab === 'feed' && (
        <div className="fade-in">
          <div style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.05), rgba(147, 51, 234, 0.05))', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '16px', marginBottom: '30px', display: 'flex', gap: '20px', alignItems: 'center' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertTriangle size={24} color="#EF4444" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#B91C1C', marginBottom: '4px' }}>Autonomous Scanner Active</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>The engine has identified 3 statistical anomalies in the client's current UI architecture based on heatmap thermal data.</p>
            </div>
          </div>

          <div style={{ display: 'grid', gap: '16px' }}>
            {anomalies.map(anomaly => (
              <div key={anomaly.id} className="glass-panel" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: anomaly.urgency === 'high' ? '#EF4444' : '#F59E0B' }}></div>
                    <div>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '4px' }}>{anomaly.element}</h4>
                      <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Failure in {anomaly.metric}</p>
                    </div>
                 </div>

                 <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
                    <div style={{ textAlign: 'right' }}>
                       <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Current Phase</div>
                       <div style={{ fontSize: '1rem', fontWeight: 800, color: anomaly.status === 'A/B Test Running' ? 'var(--color-green-main)' : 'var(--color-purple-main)' }}>{anomaly.status}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                       <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Recorded Metric</div>
                       <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#EF4444' }}>{anomaly.current}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                       <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>AI Expected Target</div>
                       <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-text-main)' }}>{anomaly.benchmark}</div>
                    </div>
                    
                     {anomaly.status === 'Awaiting Approval' ? (
                        <button onClick={() => { setActiveTab('justification'); setSelectedAnomaly(anomaly); }} className="btn btn-primary" style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          View Proposal <ArrowRight size={16}/>
                        </button>
                     ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' }}>
                           <button onClick={() => setTelemetryModalData(anomaly)} className="btn btn-outline" style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '12px' }}>
                             <LineChart size={16}/> Live Telemetry
                           </button>
                           <button 
                             onClick={() => setOpenDropdownId(openDropdownId === anomaly.id ? null : anomaly.id)}
                             style={{ padding: '10px 14px', background: 'var(--color-bg-light)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                           >
                             <SplitSquareHorizontal size={16} color="var(--color-text-muted)" />
                           </button>

                           {/* Dropdown Menu */}
                           {openDropdownId === anomaly.id && (
                             <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, width: '240px', background: 'white', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', border: '1px solid rgba(0,0,0,0.05)', zIndex: 10, overflow: 'hidden' }}>
                                <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(0,0,0,0.05)', background: 'var(--color-bg-light)' }}>
                                   <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>SEO Action Center</span>
                                </div>
                                <button onClick={() => handleActionDeployWinner(anomaly.id)} className="hover-lift" style={{ width: '100%', textAlign: 'left', padding: '12px 16px', background: 'none', border: 'none', borderBottom: '1px solid rgba(0,0,0,0.05)', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600, color: '#10B981', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <CheckCircle2 size={16} /> Deploy Winner (100% Traffic)
                                </button>
                                <button onClick={() => handleActionAdjustSplit(anomaly)} className="hover-lift" style={{ width: '100%', textAlign: 'left', padding: '12px 16px', background: 'none', border: 'none', borderBottom: '1px solid rgba(0,0,0,0.05)', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600, color: '#F59E0B', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <AlertTriangle size={16} /> Adjust Canary Routing
                                </button>
                                <button onClick={() => handleActionHeatmap(anomaly.id)} className="hover-lift" style={{ width: '100%', textAlign: 'left', padding: '12px 16px', background: 'none', border: 'none', borderBottom: '1px solid rgba(0,0,0,0.05)', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-purple-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <MousePointerClick size={16} /> View Thermal Heatmaps
                                </button>
                                <button onClick={() => handleActionRollback(anomaly.id)} className="hover-lift" style={{ width: '100%', textAlign: 'left', padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600, color: '#EF4444', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <XCircle size={16} /> Stop Test & Rollback
                                </button>
                             </div>
                           )}
                        </div>
                    )}
                 </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'justification' && (
        <div className="fade-in">
           <LinkBack onClick={() => setActiveTab('feed')} />
           
           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginTop: '20px' }}>
              
              {/* Left Side: The Proof */}
              <div className="glass-panel" style={{ padding: '30px', display: 'flex', flexDirection: 'column' }}>
                 <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                   <MousePointerClick size={24} color="#EF4444" /> Diagnostic Evidence
                 </h3>
                 
                 <div style={{ width: '100%', height: '240px', background: 'var(--color-bg-light)', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)', position: 'relative', overflow: 'hidden', marginBottom: '24px' }}>
                   {/* Simulated Heatmap View */}
                   <div style={{ position: 'absolute', top: '10%', left: '10%', right: '10%', height: '40px', background: 'rgba(0,0,0,0.05)', borderRadius: '8px' }}></div>
                   <div style={{ position: 'absolute', top: '40%', left: '30%', right: '30%', height: '40px', background: 'rgba(0,0,0,0.05)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Original CTA Button</span>
                   </div>
                   
                   {/* Thermal Cold Spot Simulator */}
                   <div style={{ position: 'absolute', top: '35%', left: '25%', right: '25%', height: '60px', background: 'radial-gradient(ellipse at center, rgba(59, 130, 246, 0.2) 0%, rgba(255,255,255,0) 70%)', pointerEvents: 'none' }}></div>
                 </div>

                 <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.6', fontSize: '1.05rem', marginBottom: '24px' }}>
                   <strong>AI Synopsis:</strong> The primary Hero CTA button is suffering from "Thermal Blindness". Hotjar scroll-depth data indicates 85% of users scroll past this element within 0.3 seconds. The current color contrast ratio (3.2:1) fails WCAG standards, causing it to blend into the background hero image.
                 </p>

                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
                      <span style={{ fontSize: '0.8rem', color: '#B91C1C', fontWeight: 700, textTransform: 'uppercase' }}>Recorded CTR</span>
                      <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#EF4444' }}>0.8%</div>
                    </div>
                    <div style={{ padding: '16px', background: 'var(--color-bg-light)', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Industry Baseline</span>
                      <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>3.5%</div>
                    </div>
                 </div>
              </div>

              {/* Right Side: The Proposal */}
              <div className="glass-panel" style={{ padding: '30px', display: 'flex', flexDirection: 'column' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                   <h3 style={{ fontSize: '1.3rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '12px', margin: 0 }}>
                     <Bot size={24} color="var(--color-purple-main)" /> Mutation Proposal
                   </h3>
                   <button onClick={() => setShowFullScreenPreview(true)} className="btn btn-outline" style={{ padding: '6px 14px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                     <Maximize size={14} /> Full Screen View
                   </button>
                 </div>

                 <div style={{ width: '100%', height: '240px', background: 'var(--color-bg-light)', borderRadius: '12px', border: '1px solid var(--color-purple-main)', position: 'relative', overflow: 'hidden', marginBottom: '24px' }}>
                   {/* Simulated Altered View */}
                   <div style={{ position: 'absolute', top: '10%', left: '10%', right: '10%', height: '40px', background: 'rgba(0,0,0,0.05)', borderRadius: '8px' }}></div>
                   
                   {/* The Proposed Element */}
                   <div style={{ position: 'absolute', top: '25%', left: '30%', right: '30%', height: '48px', background: 'var(--color-purple-main)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 25px rgba(147, 51, 234, 0.3)' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'white' }}>High-Contrast CTA Button</span>
                   </div>
                 </div>

                 <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.6', fontSize: '1.05rem', marginBottom: '24px' }}>
                   <strong>Generated Code:</strong> Extracting the CSS ruleset from the target DOM node `id="checkout-primary"`. Overriding `background-color` and `y-transform`.
                 </p>

                 <div style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '16px', borderRadius: '12px', fontFamily: 'monospace', fontSize: '0.85rem', marginBottom: 'auto' }}>
                    <span style={{ color: '#569cd6' }}>#checkout-primary</span> {'{'} <br/>
                    &nbsp;&nbsp;background-color: <span style={{ color: '#ce9178' }}>#9333ea</span>; <i>// Mutation</i><br/>
                    &nbsp;&nbsp;transform: <span style={{ color: '#ce9178' }}>translateY(-40px)</span>; <i>// Mutation</i><br/>
                    &nbsp;&nbsp;padding: <span style={{ color: '#b5cea8' }}>16px 32px</span>;<br/>
                    {'}'}
                 </div>

                 <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
                    <button className="btn btn-outline" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <XCircle size={18} /> Reject
                    </button>
                    <button onClick={() => deployMutationToEdge(selectedAnomaly?.id)} className="btn btn-primary" style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <Zap size={18} /> Authorize 50/50 Code Injection
                    </button>
                 </div>
              </div>

           </div>
        </div>
      )}

      {/* Telemetry Modal Overlay */}
      {telemetryModalData && (() => {
        const stats = getSimulatedTraffic(telemetryModalData.id);
        return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
           <div className="glass-panel" style={{ width: '800px', maxWidth: '90vw', background: 'white', padding: '0', overflow: 'hidden' }}>
              <div style={{ padding: '24px', borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <div>
                   <h3 style={{ fontSize: '1.4rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                     <LineChart color="var(--color-blue-main)" /> Live Mutation Telemetry
                   </h3>
                   <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Real-time Edge routing stats for <strong style={{ color: '#111' }}>{telemetryModalData.element}</strong></span>
                 </div>
                 <button onClick={() => setTelemetryModalData(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><XCircle size={24} color="var(--color-text-muted)" /></button>
              </div>
              
              <div style={{ padding: '30px', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '20px' }}>
                 <div style={{ background: 'var(--color-bg-light)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Original Control (A)</div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-text-main)' }}>{telemetryModalData.current}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>Based on {stats.base.toLocaleString()} sessions</div>
                 </div>
                 
                 <div style={{ background: 'rgba(16, 185, 129, 0.05)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#10B981', textTransform: 'uppercase', marginBottom: '8px' }}>Variant Winner (B)</div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10B981' }}>{telemetryModalData.benchmark}</div>
                    <div style={{ fontSize: '0.85rem', color: '#10B981', marginTop: '4px' }}>Based on {stats.variantTraffic.toLocaleString()} sessions</div>
                 </div>
              </div>
              
              <div style={{ padding: '0 30px 30px 30px' }}>
                 <div style={{ width: '100%', height: '8px', background: 'var(--color-bg-light)', borderRadius: '4px', overflow: 'hidden', display: 'flex' }}>
                    <div style={{ width: '50%', background: 'var(--color-purple-main)' }}></div>
                    <div style={{ width: '50%', background: '#10B981' }}></div>
                 </div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                    <span>50% Traffic (Control)</span>
                    <span>50% Traffic (Variant)</span>
                 </div>
              </div>
              <div style={{ padding: '0 30px 30px 30px', marginTop: '10px' }}>
                 <div style={{ padding: '20px', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.1)', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '20px' }}>
                    
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                       <div style={{ color: 'var(--color-blue-main)' }}><ShieldCheck size={20} /></div>
                       <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#111', textTransform: 'uppercase', marginBottom: '4px' }}>Core Web Vitals Impact</div>
                          <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: '1.4' }}>Mutation imposes a <strong>+{stats.delay}s</strong> delay on LCP (Largest Contentful Paint). SEO Risk is categorized as <strong style={{ color: stats.risk === 'LOW' ? '#10B981' : '#F59E0B' }}>{stats.risk}</strong>.</div>
                       </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                       <div style={{ color: 'var(--color-blue-main)' }}><FileSearch size={20} /></div>
                       <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#111', textTransform: 'uppercase', marginBottom: '4px' }}>Crawlability & Indexing</div>
                          <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: '1.4' }}>Dynamic variant maintains exact <code>rel="canonical"</code> mirroring the Control tree. <strong>Safe</strong>.</div>
                       </div>
                    </div>

                 </div>
              </div>

           </div>
        </div>
        );
      })()}

      {/* Split Traffic Modal */}
      {splitSliderData && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
           <div className="glass-panel" style={{ width: '500px', maxWidth: '90vw', background: 'white', padding: '30px', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                 <SplitSquareHorizontal size={24} color="#F59E0B" />
                 <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Adjust Canary Routing</h3>
              </div>
              <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', marginBottom: '30px' }}>Safely dial up exposure across the edge nodes instead of an immediate 50/50 injection for <strong>{splitSliderData.element}</strong>.</p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontWeight: 800 }}>
                 <span style={{ color: 'var(--color-purple-main)' }}>{100 - splitWeight}% Control</span>
                 <span style={{ color: '#10B981' }}>{splitWeight}% Variant</span>
              </div>
              
              <input 
                type="range" 
                min="0" max="100" 
                value={splitWeight} 
                onChange={(e) => setSplitWeight(parseInt(e.target.value))}
                style={{ width: '100%', cursor: 'pointer', marginBottom: '40px' }} 
              />
              
              <div style={{ display: 'flex', gap: '12px' }}>
                 <button onClick={() => setSplitSliderData(null)} className="btn hover-lift" style={{ flex: 1, padding: '12px', background: 'var(--color-bg-light)', color: 'var(--color-text-main)', border: 'none', fontWeight: 700, borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                 <button onClick={saveSplitWeight} className="btn hover-lift" style={{ flex: 2, padding: '12px', background: '#F59E0B', color: 'white', border: 'none', fontWeight: 700, borderRadius: '8px', cursor: 'pointer' }}>Set Routing Policy</button>
              </div>
           </div>
        </div>
      )}

      {/* Full Screen Preview Overlay */}
      {showFullScreenPreview && (
        <div className="fade-in" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.9)', zIndex: 10000, display: 'flex', flexDirection: 'column' }}>
           
           {/* Mock Browser Chrome */}
           <div style={{ padding: '16px 24px', background: '#111', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                 <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#EF4444' }}></div>
                 <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#F59E0B' }}></div>
                 <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10B981' }}></div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.1)', padding: '8px 250px', borderRadius: '8px', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}>
                 <ShieldCheck size={14} color="#10B981" /> https://{selectedAnomaly?.element.includes('Hero') ? 'hero-mutation' : 'live-variant'}.75squared.edge
              </div>
              <button onClick={() => setShowFullScreenPreview(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', fontWeight: 600 }}>
                 <XCircle size={18} /> Exit Preview
              </button>
           </div>
           
           <div style={{ flex: 1, background: '#f8fafc', position: 'relative', overflowY: 'auto' }}>
              {/* Contextual Website Frame Mockup */}
              <div style={{ height: '80px', background: 'white', borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', padding: '0 8%', justifyContent: 'space-between' }}>
                 <h2 style={{ fontSize: '1.6rem', fontWeight: 900, letterSpacing: '-0.5px' }}>Nexus SaaS</h2>
                 <div style={{ display: 'flex', gap: '30px', fontWeight: 600, color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
                    <span style={{ cursor: 'pointer' }}>Features</span>
                    <span style={{ cursor: 'pointer' }}>Integrations</span>
                    <span style={{ cursor: 'pointer' }}>Pricing</span>
                 </div>
              </div>
              
              <div style={{ maxWidth: '900px', margin: '100px auto', textAlign: 'center', padding: '0 20px' }}>
                 <h1 style={{ fontSize: '4.5rem', fontWeight: 800, marginBottom: '20px', lineHeight: '1.1', color: '#111' }}>
                    Scale Your Agency With <br/><span className="text-gradient">AI Automation</span>
                 </h1>
                 <p style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)', marginBottom: '50px', maxWidth: '600px', margin: '0 auto 50px auto', lineHeight: '1.6' }}>
                    Stop wasting time on manual SEO tasks. Let our edge routers and AI bots handle your A/B testing autonomously in real-time.
                 </p>
                 
                 {/* The Injected Component Visualized in Full Context */}
                 <div style={{ display: 'inline-block', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '-40px', right: '-30px', background: 'var(--color-purple-main)', color: 'white', padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800, transform: 'rotate(8deg)', boxShadow: '0 8px 20px rgba(147, 51, 234, 0.4)', zIndex: 10 }}>AI Variant B</div>
                    <button className="btn btn-primary hover-lift" style={{ padding: '24px 48px', fontSize: '1.3rem', background: 'var(--color-purple-main)', color: 'white', borderRadius: '40px', boxShadow: '0 20px 40px rgba(147, 51, 234, 0.3)', border: 'none', cursor: 'pointer', fontWeight: 800 }}>
                       Start Your 14-Day Free Trial
                    </button>
                    <p style={{ marginTop: '16px', fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>No credit card required. Cancel anytime.</p>
                 </div>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};

// Helper component for back button
const LinkBack = ({ onClick }) => (
  <button onClick={onClick} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', padding: 0 }}>
     ← Back to Radar
  </button>
);

export default GhostEditor;
