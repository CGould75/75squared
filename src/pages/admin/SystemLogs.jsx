import React, { useState, useContext } from 'react';
import { Terminal, Activity, ServerCrash, Bot, RefreshCcw, CheckCircle2, ChevronRight, Copy, AlertTriangle, X, User } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { Link } from 'react-router-dom';
import { GlobalDomainContext } from '../../layouts/AdminLayout';

const SystemLogs = () => {
  const { activeDomain } = useContext(GlobalDomainContext);
  const [activeTab, setActiveTab] = useState('sre');
  const [copiedId, setCopiedId] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Natively pull from Supabase Vault instead of hardcoded state
  React.useEffect(() => {
    const fetchLogs = async () => {
      const { data, error } = await supabase.from('sre_logs').select('*').neq('status', 'archived').eq('domain', activeDomain).order('id', { ascending: false });
      if (data) {
        setLogs(data);
      }
      setLoading(false);
    };
    fetchLogs();
  }, [activeDomain]);

  const handleCopy = (payload, id) => {
    navigator.clipboard.writeText(payload).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  };

  const markResolved = async (id) => {
    // Physical Supabase Update
    await supabase.from('sre_logs').update({
       status: 'resolved',
       sre_action: 'Resolution mathematically overridden and validated by Super Admin Antigravity link.'
    }).eq('id', id);

    setLogs(prev => prev.map(log => 
      log.id === id 
        ? { ...log, status: 'resolved', sre_action: 'Resolution mathematically overridden and validated by Super Admin Antigravity link.' } 
        : log
    ));
  };

  const archiveLog = async (id) => {
    // Physical Supabase Update (Soft Delete via Status)
    await supabase.from('sre_logs').update({ status: 'archived' }).eq('id', id);
    setLogs(prev => prev.filter(log => log.id !== id));
  };

  return (
    <div>
      <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Activity size={36} color="var(--color-blue-main)" /> Platform Telemetry
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>
            God-Mode System Logs & Autonomous SRE Resolution queue. Fatal anomalies are automatically pushed to the <Link to="/admin/action-center" style={{ color: 'var(--color-blue-main)', fontWeight: 700, textDecoration: 'none' }}>Action Center Feed</Link>.
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '8px', background: 'rgba(0,0,0,0.05)', padding: '4px', borderRadius: '12px' }}>
          <button 
             onClick={() => setActiveTab('sre')}
             style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, background: activeTab === 'sre' ? 'white' : 'transparent', color: activeTab === 'sre' ? 'var(--color-text-main)' : 'var(--color-text-muted)', boxShadow: activeTab === 'sre' ? '0 2px 10px rgba(0,0,0,0.05)' : 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
             <Bot size={16}/> SRE Auto-Healing
          </button>
          <button 
             onClick={() => setActiveTab('logs')}
             style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, background: activeTab === 'logs' ? 'white' : 'transparent', color: activeTab === 'logs' ? 'var(--color-text-main)' : 'var(--color-text-muted)', boxShadow: activeTab === 'logs' ? '0 2px 10px rgba(0,0,0,0.05)' : 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
             <Terminal size={16}/> Raw Stack Traces
          </button>
        </div>
      </div>

      {activeTab === 'sre' && (
        <div className="fade-in">
          
          {/* Active Polling Status */}
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderLeft: '4px solid #10B981' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ position: 'relative', width: '20px', height: '20px' }}>
                   <div style={{ width: '100%', height: '100%', background: '#10B981', borderRadius: '50%', position: 'absolute' }}></div>
                   <div style={{ width: '100%', height: '100%', background: '#10B981', borderRadius: '50%', position: 'absolute', animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite' }}></div>
                </div>
                <div>
                   <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Autonomous SRE Online</h3>
                   <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Polling cross-client edge tracker network every 300 seconds.</span>
                </div>
             </div>
             <div style={{ display: 'flex', gap: '24px', textAlign: 'right' }}>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-purple-main)' }}>{logs.filter(log => log.status === 'resolved').length}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Resolved</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#EF4444' }}>{logs.filter(log => log.status !== 'resolved').length}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Queued</div>
                </div>
             </div>
          </div>

          <div style={{ display: 'grid', gap: '16px' }}>
             {logs.map(log => (
               <div key={log.id} style={{ background: 'white', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                  
                  {/* Top Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid rgba(0,0,0,0.05)', background: 'var(--color-bg-light)' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                       <span style={{ fontSize: '0.85rem', fontFamily: 'monospace', fontWeight: 600, color: 'var(--color-text-muted)' }}>{log.log_id}</span>
                       <span style={{ fontSize: '0.85rem', background: 'rgba(0,0,0,0.05)', padding: '4px 8px', borderRadius: '4px', fontWeight: 600 }}>{log.domain}</span>
                     </div>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                       <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>{log.timestamp}</span>
                       <button onClick={() => archiveLog(log.id)} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }} title="Archive & Clear Log">
                         <X size={16} />
                       </button>
                     </div>
                  </div>

                  {/* Body Context */}
                  <div style={{ display: 'flex' }}>
                     
                     {/* Left: The Crash */}
                     <div style={{ flex: 1, padding: '24px', borderRight: '1px solid rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                           <ServerCrash size={18} color={log.severity === 'fatal' ? '#EF4444' : log.severity === 'critical' ? '#F59E0B' : 'var(--color-text-muted)'}/>
                           <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>{log.source}</span>
                        </div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 600, color: log.severity === 'fatal' ? '#EF4444' : 'var(--color-text-main)', marginBottom: '16px' }}>
                          {log.message}
                        </div>
                        
                        {/* Redundancy Button for Antigravity */}
                        {log.status === 'resolved' ? (
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '0.85rem', color: '#10B981', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '6px', fontWeight: 600 }}>
                            <CheckCircle2 size={16} /> Autonomous Resolution Verified
                          </div>
                        ) : log.status === 'escalated' ? (
                          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '0.85rem', color: '#EF4444', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '6px', fontWeight: 600 }}>
                              <AlertTriangle size={16} /> Client Notified via Webhook
                            </div>
                            <button onClick={() => archiveLog(log.id)} className="btn hover-effect" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '0.85rem', background: 'white', color: 'var(--color-text-main)', border: '1px solid rgba(0,0,0,0.1)', cursor: 'pointer', borderRadius: '6px', fontWeight: 600, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                              <X size={16} /> Archive Issue (Clear)
                            </button>
                            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>No agency action required.</span>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', gap: '12px' }}>
                            <button onClick={() => handleCopy(log.payload, log.id)} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '0.85rem' }}>
                              {copiedId === log.id ? <CheckCircle2 size={16} color="#10B981" /> : <Copy size={16} />}
                              {copiedId === log.id ? 'Copied to Clipboard' : 'Copy Payload for Antigravity'}
                            </button>
                            <button onClick={() => markResolved(log.id)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '0.85rem', background: 'rgba(16,185,129,0.1)', color: '#10B981', border: '1px solid transparent', cursor: 'pointer', borderRadius: '6px', fontWeight: 600 }}>
                              <CheckCircle2 size={16} /> Mark as Resolved
                            </button>
                          </div>
                        )}
                     </div>

                     {/* Right: The SRE Auto-Healing */}
                     <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', background: log.status === 'escalated' ? 'rgba(239, 68, 68, 0.02)' : 'rgba(147, 51, 234, 0.02)' }}>
                        {(() => {
                           const isHuman = log.sre_action?.includes('Super Admin') || log.sre_action?.includes('Human');
                           return (
                             <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                {isHuman ? <User size={18} color="var(--color-blue-main)"/> : <Bot size={18} color="var(--color-purple-main)"/>}
                                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: isHuman ? 'var(--color-blue-main)' : 'var(--color-purple-main)' }}>{isHuman ? 'Human SRE Validate' : 'Nexus SRE Agent'}</span>
                                <div style={{ background: isHuman ? 'rgba(59, 130, 246, 0.2)' : 'rgba(147, 51, 234, 0.2)', color: isHuman ? 'var(--color-blue-main)' : 'var(--color-purple-main)', fontSize: '0.65rem', padding: '3px 8px', borderRadius: '4px', textTransform: 'uppercase', fontWeight: 900 }}>{isHuman ? 'Human' : 'Agentic'}</div>
                             </div>
                           );
                        })()}
                        <div style={{ fontSize: '1rem', lineHeight: '1.6', flexGrow: 1, fontWeight: 500 }}>
                          {log.sre_action}
                        </div>

                        {/* Status Badge */}
                        <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                           {log.status === 'auto-healing' && (
                             <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700, color: '#F59E0B', background: 'rgba(245, 158, 11, 0.1)', padding: '6px 12px', borderRadius: '20px' }}><RefreshCcw size={14}/> Generating Patch</span>
                           )}
                           {log.status === 'resolved' && (
                             <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700, color: '#10B981', background: 'rgba(16, 185, 129, 0.1)', padding: '6px 12px', borderRadius: '20px' }}><CheckCircle2 size={14}/> Issue Resolved</span>
                           )}
                           {log.status === 'escalated' && (
                             <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700, color: '#EF4444', background: 'rgba(239, 68, 68, 0.1)', padding: '6px 12px', borderRadius: '20px' }}><AlertTriangle size={14}/> Escalated to Client</span>
                           )}
                        </div>
                     </div>

                  </div>
               </div>
             ))}
          </div>
        </div>
      )}

      {activeTab === 'logs' && (
        <div className="fade-in glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
           <div style={{ background: '#1E1E1E', padding: '20px', borderBottom: '1px solid #333', display: 'flex', gap: '16px', alignItems: 'center' }}>
             <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#EF4444' }}></div>
             <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#F59E0B' }}></div>
             <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10B981' }}></div>
             <span style={{ color: '#888', marginLeft: '12px', fontFamily: 'monospace', fontSize: '0.9rem' }}>/var/log/nexus_telemetry.json</span>
           </div>
           
           <div style={{ padding: '30px', background: '#1e1e1e', color: '#d4d4d4', fontFamily: 'monospace', fontSize: '0.9rem', lineHeight: '1.6', overflowX: 'auto' }}>
             {logs.map(log => (
               <div key={`raw-${log.id}`} style={{ marginBottom: '24px' }}>
                 <span style={{ color: '#569cd6' }}>[{log.timestamp}]</span> <span style={{ color: log.severity === 'fatal' ? '#f44747' : '#ce9178' }}>[SEVERITY: {log.severity.toUpperCase()}]</span> [{log.domain}]<br/>
                 &nbsp;&nbsp;message: "{log.message}"<br/>
                 &nbsp;&nbsp;payload: {log.payload}<br/>
               </div>
             ))}
           </div>
        </div>
      )}

    </div>
  );
};

export default SystemLogs;
