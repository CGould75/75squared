import React, { useState } from 'react';
import { Ghost, AlertTriangle, ArrowRight, Zap, CheckCircle2, XCircle, MousePointerClick, Bot, Code2, LineChart, SplitSquareHorizontal } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

const GhostEditor = () => {
  const [activeTab, setActiveTab] = useState('feed');
  const [anomalies, setAnomalies] = useState([]);
  const [selectedAnomaly, setSelectedAnomaly] = useState(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchAnomalies = async () => {
      const { data } = await supabase.from('ab_mutations').select('*').order('id', { ascending: true });
      if (data) setAnomalies(data);
      setLoading(false);
    };
    fetchAnomalies();
  }, [activeTab]);

  const deployMutationToEdge = async (anomalyId) => {
    // Physically alter the Supabase database reality
    const { data } = await supabase.from('ab_mutations').update({ status: 'A/B Test Running' }).eq('id', anomalyId);
    
    // Fallback to radar UI
    setActiveTab('feed');
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
                       <button onClick={() => alert('The Live Edge Router is currently tracking statistical significance. 204 users have been exposed to this mutation so far! You can set reporting durations in the Billing module.')} className="btn btn-outline" style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                         <LineChart size={16}/> Live Dashboard
                       </button>
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
                 <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                   <Bot size={24} color="var(--color-purple-main)" /> Mutation Proposal
                 </h3>

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
