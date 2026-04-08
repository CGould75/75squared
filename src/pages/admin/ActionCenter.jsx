import React, { useState } from 'react';
import { Target, Zap, CheckCircle2, AlertTriangle, ShieldAlert, Cpu, Bot, Search, BarChart3, LineChart } from 'lucide-react';
import SEOHead from '../../components/SEOHead';

export default function ActionCenter() {
  const [autoPilotEnabled, setAutoPilotEnabled] = useState(false);
  const [feed, setFeed] = useState([
     { id: 'act_1', type: 'critical', title: 'Toxic Link Node Detected', description: 'Deep-crawlers found 14 Russian spam domains linking to goodyslv.com, negatively impacting trust metrics by -4.2%.', actionLabel: 'Generate & Submit Disavow List via AI API', solved: false },
     { id: 'act_2', type: 'warning', title: 'API Budget Cap Breached (GlobalConstraints)', description: 'The ContentStudio generative action has been halted. The algorithmic budget cap for the target domain was exceeded by $12.40.', actionLabel: 'Authorize Override & Deploy', solved: false },
     { id: 'act_3', type: 'critical', title: 'Reputation Engine: Pre-Review Gateway Failed', description: 'Claude 3.5 Sonnet detected an off-brand semantic tone in an auto-drafted response to a 1-star Google My Business review. Deployment halted.', actionLabel: 'Manually Revise Reply', solved: false },
     { id: 'act_4', type: 'opportunity', title: 'Missing Schema Target (Competitor Gap)', description: 'Your competitors recently updated their JSON-LD to include Product rating arrays. You are missing out on rich snippets.', actionLabel: 'Inject Counter-Schema to Edge', solved: false }
  ]);

  const [toasts, setToasts] = useState([]);

  const addToast = (msg) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg }]);
    setTimeout(() => {
       setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const handleSolve = (id) => {
    setFeed(feed.map(item => item.id === id ? { ...item, solved: true } : item));
    addToast('Executing autonomous sequence pipeline via API...');
  };

  const toggleAutoPilot = () => {
     if(!autoPilotEnabled) {
        setAutoPilotEnabled(true);
        addToast('WARNING: Autonomous Engine Online. The system will now fix these issues silently in the background.');
        setTimeout(() => {
           setFeed(feed.map(item => ({ ...item, solved: true })));
        }, 1500);
     } else {
        setAutoPilotEnabled(false);
     }
  };

  const [superAdminOverride, setSuperAdminOverride] = useState(false);

  return (
    <div className="fade-in" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <SEOHead title="Action Center" description="Centralized recommendations and 1-Click resolutions." path="/admin/action-center" />
      
      {/* Toast Notifier */}
      <div style={{ position: 'fixed', bottom: '40px', right: '40px', display: 'flex', flexDirection: 'column', gap: '10px', zIndex: 10000 }}>
        {toasts.map(t => (
          <div key={t.id} className="fade-in" style={{ background: '#1e1e1e', color: 'white', padding: '16px 24px', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', gap: '12px', borderLeft: '4px solid var(--color-blue-main)' }}>
            <Bot size={20} color="var(--color-blue-main)" /> {t.msg}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Target size={36} color="var(--color-green-main)" />
            Hive Action Center
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem', maxWidth: '800px' }}>
            Review pending system optimizations and critical vulnerability alerts. Execute mathematically guaranteed AI workflows with a single click.
          </p>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-end' }}>
          <div style={{ background: autoPilotEnabled ? 'rgba(16, 185, 129, 0.1)' : 'rgba(0,0,0,0.05)', padding: '8px 24px', borderRadius: '24px', border: autoPilotEnabled ? '2px solid #10B981' : '1px solid rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '16px', transition: 'all 0.3s' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
               <Cpu size={20} color={autoPilotEnabled ? '#10B981' : 'var(--color-text-muted)'} />
               <div style={{ fontWeight: 800, color: autoPilotEnabled ? '#10B981' : 'var(--color-text-main)' }}>Master AUTO-PILOT</div>
             </div>
             
             {/* Custom Toggle Switch */}
             <div onClick={toggleAutoPilot} style={{ width: '48px', height: '26px', background: autoPilotEnabled ? '#10B981' : '#CBD5E1', borderRadius: '13px', position: 'relative', cursor: 'pointer', transition: 'background 0.3s' }}>
                <div style={{ position: 'absolute', top: '3px', left: autoPilotEnabled ? '25px' : '3px', width: '20px', height: '20px', background: 'white', borderRadius: '50%', boxShadow: '0 2px 5px rgba(0,0,0,0.2)', transition: 'left 0.3s' }}></div>
             </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => {
             setSuperAdminOverride(!superAdminOverride);
             addToast(superAdminOverride ? 'Super-Admin Vault Override disabled.' : 'Super-Admin Vault Override enabled. Hard constraints bypassed.');
          }}>
             <div style={{ width: '32px', height: '18px', background: superAdminOverride ? '#EF4444' : '#CBD5E1', borderRadius: '9px', position: 'relative', transition: 'background 0.3s' }}>
                 <div style={{ position: 'absolute', top: '2px', left: superAdminOverride ? '16px' : '2px', width: '14px', height: '14px', background: 'white', borderRadius: '50%', transition: 'left 0.3s' }}></div>
             </div>
             <span style={{ fontSize: '0.8rem', fontWeight: 800, color: superAdminOverride ? '#EF4444' : 'var(--color-text-muted)', textTransform: 'uppercase' }}>Super-Admin Override</span>
          </div>
        </div>
      </div>

      <div style={{ flexGrow: 1, display: 'grid', gap: '16px', alignContent: 'start' }}>
         {feed.map(item => (
            <div key={item.id} className="glass-panel hover-lift" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '24px', opacity: item.solved ? 0.5 : 1, transition: 'all 0.3s', borderLeft: `6px solid ${item.type === 'critical' ? '#EF4444' : (item.type === 'warning' ? '#F59E0B' : 'var(--color-purple-main)')}` }}>
               <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: item.type === 'critical' ? 'rgba(239, 68, 68, 0.1)' : (item.type === 'warning' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(147, 51, 234, 0.1)'), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {item.type === 'critical' && <ShieldAlert size={28} color="#EF4444" />}
                  {item.type === 'warning' && <AlertTriangle size={28} color="#F59E0B" />}
                  {item.type === 'opportunity' && <LineChart size={28} color="var(--color-purple-main)" />}
               </div>
               
               <div style={{ flexGrow: 1 }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '6px', color: 'var(--color-text-main)', textDecoration: item.solved ? 'line-through' : 'none' }}>{item.title}</h3>
                  <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.5', fontSize: '0.95rem' }}>{item.description}</p>
               </div>

               <div style={{ minWidth: '320px', textAlign: 'right' }}>
                  {item.solved ? (
                     <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', color: '#10B981', fontWeight: 800 }}>
                        <CheckCircle2 size={20} /> Autonomously Mitigated
                     </div>
                  ) : (
                     <button onClick={() => handleSolve(item.id)} className={`btn ${item.type === 'critical' ? 'btn-primary' : 'btn-outline'}`} style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', border: item.type === 'critical' ? 'none' : '1px solid var(--color-purple-main)', background: item.type === 'critical' ? 'black' : 'transparent', color: item.type === 'critical' ? 'white' : 'var(--color-purple-main)' }}>
                        <Zap size={18} /> {item.actionLabel}
                     </button>
                  )}
               </div>
            </div>
         ))}
         
         {feed.every(i => i.solved) && (
            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--color-text-muted)' }}>
               <CheckCircle2 size={48} color="#10B981" style={{ marginBottom: '16px', opacity: 0.5 }} />
               <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Zero Active Vulnerabilities</h3>
               <p>The Hive Mind detects no outstanding anomalies across the network cache.</p>
            </div>
         )}
      </div>
    </div>
  );
}
