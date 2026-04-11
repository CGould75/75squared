import React, { useState, useEffect } from 'react';
import { ShieldAlert, Users, Server, Database, Activity, RefreshCw, Hexagon, Zap, Key } from 'lucide-react';
import { supabase } from "../../lib/supabaseClient";

const SuperAdminDashboard = () => {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState(null); // Which tenant is actively being provisioned
  
  // Stats
  const globalMRR = 12500; // Simulated $12.5k MRR
  const activeSystems = 4;

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    setLoading(true);
    const { data: clientsData, error } = await supabase.from('nexus_clients').select('*').order('created_at', { ascending: false });
    
    if (clientsData) {
       // We map specific features toggles locally for now until we expand the schema
       const enrichedData = clientsData.map(client => ({
          ...client,
          tier: client.domain === '75squared.com' ? 'Enterprise' : 'Pro',
          status: 'Operational',
          features: {
             aiGenerativeEngine: client.domain === '75squared.com',
             videoPlatform: true,
             advancedLTVAnalytics: client.domain === '75squared.com'
          }
       }));
       setTenants(enrichedData);
    }
    setLoading(false);
  };

  const handleToggleFeature = (tenantId, featureKey) => {
     setTenants(prev => prev.map(t => {
        if (t.id === tenantId) {
           return { ...t, features: { ...t.features, [featureKey]: !t.features[featureKey] } };
        }
        return t;
     }));
  };

  const handleSaveProvisioning = () => {
     alert(`Provisioning matrix successfully updated for API Gateway. Synced to Stripe Billing.`);
     setActiveModal(null);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: "'Inter', sans-serif" }}>
      {/* Top Nav */}
      <nav style={{ padding: '20px 40px', background: '#111', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Hexagon size={28} color="#9333EA" />
            <h1 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase' }}>75squared <span style={{ color: '#9333EA' }}>Core</span></h1>
            <span style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700, marginLeft: '12px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>SUPER ADMIN ONLY</span>
         </div>
         <div style={{ display: 'flex', gap: '20px', fontSize: '0.9rem', color: '#a1a1aa' }}>
            <span><Server size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'text-bottom' }}/> Nodes: Online</span>
            <span><Database size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'text-bottom' }}/> DB: Connected</span>
         </div>
      </nav>

      <main style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto' }}>
         {/* Top Data Row */}
         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '40px' }}>
            <div style={{ background: '#111', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
               <div style={{ color: '#a1a1aa', fontSize: '0.9rem', fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                  Total MRR <Activity size={16} color="#10B981" />
               </div>
               <div style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '12px' }}>${globalMRR.toLocaleString()}</div>
               <div style={{ color: '#10B981', fontSize: '0.8rem', marginTop: '8px', fontWeight: 600 }}>+12% this month</div>
            </div>
            
            <div style={{ background: '#111', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
               <div style={{ color: '#a1a1aa', fontSize: '0.9rem', fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                  Active Tenants <Users size={16} color="#3B82F6" />
               </div>
               <div style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '12px' }}>{tenants.length}</div>
            </div>

            <div style={{ background: '#111', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
               <div style={{ color: '#a1a1aa', fontSize: '0.9rem', fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                  API Throughput <Zap size={16} color="#F59E0B" />
               </div>
               <div style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '12px' }}>1.4M<span style={{ fontSize: '1rem', color: '#a1a1aa', marginLeft: '6px' }}>req/hr</span></div>
            </div>

            <div style={{ background: '#111', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
               <div style={{ color: '#a1a1aa', fontSize: '0.9rem', fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                  System Health <ShieldAlert size={16} color="#10B981" />
               </div>
               <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '12px', color: '#10B981' }}>Optimal</div>
            </div>
         </div>

         {/* Global Tenant Grid */}
         <div style={{ background: '#111', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>Global Tenant Matrix</h2>
               <button onClick={fetchTenants} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                  <RefreshCw size={14} /> Refresh Grid
               </button>
            </div>
            
            <div style={{ overflowX: 'auto' }}>
               <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                     <tr style={{ background: 'rgba(255,255,255,0.02)', color: '#a1a1aa', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                        <th style={{ padding: '16px 24px', fontWeight: 600 }}>Client Domain</th>
                        <th style={{ padding: '16px 24px', fontWeight: 600 }}>Business Type</th>
                        <th style={{ padding: '16px 24px', fontWeight: 600 }}>Billing Tier</th>
                        <th style={{ padding: '16px 24px', fontWeight: 600 }}>Status</th>
                        <th style={{ padding: '16px 24px', fontWeight: 600, textAlign: 'right' }}>Governance</th>
                     </tr>
                  </thead>
                  <tbody>
                     {loading ? (
                        <tr><td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: '#a1a1aa' }}>Querying Core Database...</td></tr>
                     ) : (
                        tenants.map(client => (
                           <tr key={client.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }}>
                              <td style={{ padding: '20px 24px', fontWeight: 600 }}>
                                {client.domain}
                                {client.domain === '75squared.com' && <span style={{ marginLeft: '12px', background: 'rgba(147, 51, 234, 0.2)', color: '#D8B4FE', padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem' }}>INTERNAL</span>}
                              </td>
                              <td style={{ padding: '20px 24px', color: '#a1a1aa', textTransform: 'capitalize' }}>{client.business_type}</td>
                              <td style={{ padding: '20px 24px' }}>
                                 <span style={{ padding: '6px 12px', borderRadius: '20px', background: client.tier === 'Enterprise' ? 'rgba(56, 189, 248, 0.1)' : 'rgba(255,255,255,0.05)', color: client.tier === 'Enterprise' ? '#38BDF8' : '#fff', fontSize: '0.8rem', fontWeight: 700 }}>
                                    {client.tier}
                                 </span>
                              </td>
                              <td style={{ padding: '20px 24px' }}>
                                 <span style={{ color: '#10B981', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }}></div>
                                    {client.status}
                                 </span>
                              </td>
                              <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                                 <button onClick={() => setActiveModal(client)} style={{ background: '#27272a', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                    <Key size={14} color="#9333EA" /> Provision Tier
                                 </button>
                              </td>
                           </tr>
                        ))
                     )}
                  </tbody>
               </table>
            </div>
         </div>
      </main>

      {/* Provisioning Drawer Modal */}
      {activeModal && (
         <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ width: '500px', background: '#111', height: '100%', borderLeft: '1px solid rgba(255,255,255,0.1)', padding: '40px', overflowY: 'auto', animation: 'slideInRight 0.3s ease' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                  <div>
                     <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>Account Provisioning</h2>
                     <div style={{ color: '#9333EA', fontWeight: 700, marginTop: '4px' }}>{activeModal.domain}</div>
                  </div>
                  <button onClick={() => setActiveModal(null)} style={{ background: 'transparent', border: 'none', color: '#a1a1aa', cursor: 'pointer', fontSize: '1.5rem' }}>&times;</button>
               </div>

               <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                  {/* Subscription Controls */}
                  <div style={{ background: '#18181b', padding: '24px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                     <h3 style={{ fontSize: '0.9rem', color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '1px' }}>Stripe Billing Subscription</h3>
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 600 }}>Active Tier</span>
                        <select value={activeModal.tier} onChange={() => {}} style={{ background: '#27272a', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '8px 12px', borderRadius: '6px', outline: 'none' }}>
                           <option value="Basic">Basic ($49/mo)</option>
                           <option value="Pro">Pro ($149/mo)</option>
                           <option value="Enterprise">Enterprise ($999/mo)</option>
                        </select>
                     </div>
                  </div>

                  {/* Feature Topology Toggles */}
                  <div style={{ background: '#18181b', padding: '24px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                     <h3 style={{ fontSize: '0.9rem', color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '1px' }}>Feature Gateway (API Controls)</h3>
                     
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                           <div>
                              <div style={{ fontWeight: 600 }}>Generative AI Engine</div>
                              <div style={{ fontSize: '0.8rem', color: '#a1a1aa', marginTop: '4px' }}>Unlocks Speech/Text prompts in Email Hub</div>
                           </div>
                           <button onClick={() => handleToggleFeature(activeModal.id, 'aiGenerativeEngine')} style={{ width: '44px', height: '24px', borderRadius: '12px', background: activeModal.features.aiGenerativeEngine ? '#10B981' : '#3f3f46', position: 'relative', border: 'none', cursor: 'pointer', transition: 'background 0.2s' }}>
                              <div style={{ width: '18px', height: '18px', background: '#fff', borderRadius: '50%', position: 'absolute', top: '3px', left: activeModal.features.aiGenerativeEngine ? '23px' : '3px', transition: 'left 0.2s' }}></div>
                           </button>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                           <div>
                              <div style={{ fontWeight: 600 }}>Advanced Video Synchronization</div>
                              <div style={{ fontSize: '0.8rem', color: '#a1a1aa', marginTop: '4px' }}>Allows remote-control hooks in Video Platform</div>
                           </div>
                           <button onClick={() => handleToggleFeature(activeModal.id, 'videoPlatform')} style={{ width: '44px', height: '24px', borderRadius: '12px', background: activeModal.features.videoPlatform ? '#10B981' : '#3f3f46', position: 'relative', border: 'none', cursor: 'pointer', transition: 'background 0.2s' }}>
                              <div style={{ width: '18px', height: '18px', background: '#fff', borderRadius: '50%', position: 'absolute', top: '3px', left: activeModal.features.videoPlatform ? '23px' : '3px', transition: 'left 0.2s' }}></div>
                           </button>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                           <div>
                              <div style={{ fontWeight: 600 }}>LTV CRM Analytics</div>
                              <div style={{ fontSize: '0.8rem', color: '#a1a1aa', marginTop: '4px' }}>Deep interaction tracking in the Audience matrix</div>
                           </div>
                           <button onClick={() => handleToggleFeature(activeModal.id, 'advancedLTVAnalytics')} style={{ width: '44px', height: '24px', borderRadius: '12px', background: activeModal.features.advancedLTVAnalytics ? '#10B981' : '#3f3f46', position: 'relative', border: 'none', cursor: 'pointer', transition: 'background 0.2s' }}>
                              <div style={{ width: '18px', height: '18px', background: '#fff', borderRadius: '50%', position: 'absolute', top: '3px', left: activeModal.features.advancedLTVAnalytics ? '23px' : '3px', transition: 'left 0.2s' }}></div>
                           </button>
                        </div>
                     </div>
                  </div>

                  <button onClick={handleSaveProvisioning} style={{ background: '#9333EA', color: 'white', border: 'none', padding: '16px', borderRadius: '8px', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', marginTop: '10px' }}>
                     Compile & Deploy Provisions
                  </button>
               </div>
            </div>
         </div>
      )}

      {/* Global CSS for Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
      `}} />
    </div>
  );
};

export default SuperAdminDashboard;
