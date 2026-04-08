import React, { useState, useEffect } from 'react';
import { Users, Shield, Ghost, Key, CheckCircle2, Lock, Unlock, Eye, Sparkles, Code } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

import { supabase } from '../../lib/supabaseClient';

const ClientManagement = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showGeoModal, setShowGeoModal] = useState(false);
  const [geoTargetClient, setGeoTargetClient] = useState(null);
  const [geoData, setGeoData] = useState({ address: '', city: '', zip: '' });

  // Natively pull from Supabase Vault instead of hardcoded state
  React.useEffect(() => {
    const fetchClients = async () => {
      const { data, error } = await supabase.from('nexus_clients').select('*').order('id', { ascending: true });
      if (data) {
        setClients(data);
      }
      setLoading(false);
    };
    fetchClients();
  }, []);

  const traverseCapabilityToggle = async (clientId, moduleKey) => {
    const targetClient = clients.find(c => c.id === clientId);
    const isCurrentlyEnabled = targetClient.modules[moduleKey];

    // Intercept SEO/GEO activation
    if (moduleKey === 'seo' && !isCurrentlyEnabled) {
       setGeoTargetClient(targetClient);
       setShowGeoModal(true);
       return; // Stop execution to await GEO details
    }

    executeModuleToggle(clientId, moduleKey);
  };

  const executeModuleToggle = async (clientId, moduleKey) => {
    const targetClient = clients.find(c => c.id === clientId);
    const updatedModules = {
      ...targetClient.modules,
      [moduleKey]: !targetClient.modules[moduleKey]
    };

    await supabase.from('nexus_clients').update({ modules: updatedModules }).eq('id', clientId);

    setClients(prev => prev.map(client => {
      if (client.id === clientId) {
        return { ...client, modules: updatedModules };
      }
      return client;
    }));
  };

  const saveGeoAndActivate = async () => {
     // Log GEO context internally (simulated DB push)
     console.log('Saved GEO coordinates for', geoTargetClient.name, geoData);
     
     // Activate the SEO module after successfully parsing data
     await executeModuleToggle(geoTargetClient.id, 'seo');

     // Complete pipeline
     setShowGeoModal(false);
     setGeoTargetClient(null);
     setGeoData({ address: '', city: '', zip: '' });
  };

  const handleAddNewClient = async () => {
     const newId = `CLIENT-NX-${Math.floor(Math.random() * 900) + 100}`;
     const newClient = {
        id: newId,
        name: 'New Client Target',
        domain: 'pending-domain.com',
        status: 'suspended',
        modules: {
          seo: false, heatmaps: false, email: false, content: false, social: false,
          ghostEditor: false, liquidUI: false, constraints: false, systemLogs: false, integrations: false, billing: true
        }
     };

     const { data } = await supabase.from('nexus_clients').insert([newClient]).select();
     if (data && data[0]) {
        setClients([...clients, data[0]]);
     }
  };

  const handleImpersonate = (client) => {
    // 1. Temporarily cache the Super Admin's local context
    localStorage.setItem('nexus_super_admin_active', 'true');
    
    // 2. Mathematically inject the client's context into the global scope
    localStorage.setItem('nexus_role', 'client');
    localStorage.setItem('nexus_client', client.name);
    localStorage.setItem('nexus_client_id', client.id);
    localStorage.setItem('nexus_client_permissions', JSON.stringify(client.modules));
    
    // 3. Force route evaluation and UI refresh
    setTimeout(() => {
      navigate('/admin');
      window.location.reload(); // Hard flush to remount DOM structurally
    }, 300);
  };

  return (
    <div>
      {/* Geo Activation Modal */}
      {showGeoModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
           <div className="glass-panel" style={{ width: '400px', background: 'white', padding: '30px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-blue-main)', marginBottom: '12px' }}>
                 <Code size={24} />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px' }}>Setup Local GEO Grid</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '20px' }}>
                Before activating the engine for <strong>{geoTargetClient?.name}</strong>, enter the physical entity coordinates to build the local rank tracker.
              </p>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '6px' }}>Street Address</label>
                <input type="text" value={geoData.address} onChange={(e) => setGeoData({...geoData, address: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)' }} placeholder="123 Main St" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px', marginBottom: '24px' }}>
                 <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '6px' }}>City</label>
                    <input type="text" value={geoData.city} onChange={(e) => setGeoData({...geoData, city: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)' }} placeholder="Las Vegas" />
                 </div>
                 <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '6px' }}>Zip</label>
                    <input type="text" value={geoData.zip} onChange={(e) => setGeoData({...geoData, zip: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)' }} placeholder="89109" />
                 </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                 <button onClick={() => setShowGeoModal(false)} className="btn hover-lift" style={{ flex: 1, padding: '12px', background: 'var(--color-bg-light)', color: 'var(--color-text-main)', border: 'none', fontWeight: 700, borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                 <button onClick={saveGeoAndActivate} className="btn hover-lift text-gradient" style={{ flex: 2, padding: '12px', color: 'white', border: 'none', fontWeight: 700, borderRadius: '8px', cursor: 'pointer' }}>Save & Activate Engine</button>
              </div>
           </div>
        </div>
      )}

      <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Users size={36} color="var(--color-blue-main)" /> Network Tenants & Workspaces
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>
            Manage client environment bounds, isolate modules, and execute domain impersonation.
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
           <Link to="/admin/users" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', fontSize: '1.05rem', fontWeight: 600, background: 'white' }}>
             <Key size={18} /> Manage Super Users
           </Link>
           <button onClick={handleAddNewClient} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', fontSize: '1.05rem', fontWeight: 600 }}>
             <Sparkles size={18} /> Provision New Client
           </button>
        </div>
      </div>

      <div style={{ marginBottom: '40px' }}>
        <div className="glass-panel" style={{ padding: '24px', background: 'linear-gradient(to right, white, rgba(59, 130, 246, 0.02))' }}>
           <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Code size={20} color="var(--color-blue-main)" /> Active Property Deployments
           </h3>
           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
              {clients.map(client => (
                <div key={`deploy-${client.id}`} style={{ border: '1px solid rgba(0,0,0,0.05)', borderRadius: '12px', padding: '16px', background: 'white' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', alignItems: 'center' }}>
                     <span style={{ fontWeight: 700 }}>{client.name}</span>
                     <span style={{ fontSize: '0.7rem', background: client.status === 'active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: client.status === 'active' ? '#10B981' : '#EF4444', padding: '4px 8px', borderRadius: '12px', fontWeight: 800 }}>
                       {client.status === 'active' ? 'RECEIVING DATA' : 'PENDING INSTALL'}
                     </span>
                   </div>
                   <code style={{ display: 'block', padding: '12px', background: '#1e1e1e', color: '#d4d4d4', borderRadius: '6px', fontSize: '0.8rem', whiteSpace: 'nowrap', overflowX: 'auto' }}>
                     &lt;script src="https://nexus.75squared.com/edge.js" data-property="{client.domain}"&gt;&lt;/script&gt;
                   </code>
                </div>
              ))}
           </div>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '20px' }}>
        {clients.map(client => (
          <div key={client.id} className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
            
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px', borderBottom: '1px solid rgba(0,0,0,0.05)', background: 'var(--color-bg-light)' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{client.name}</h3>
                  {client.status === 'active' ? (
                    <span style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', padding: '4px 8px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 800 }}>MAPPED TO EDGE</span>
                  ) : (
                     <span style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', padding: '4px 8px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 800 }}>OFFLINE</span>
                  )}
                </div>
                <div style={{ fontFamily: 'monospace', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>{client.id} · {client.domain}</div>
              </div>
              
              <button 
                onClick={() => handleImpersonate(client)}
                className="btn btn-primary" 
                style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Eye size={18} /> View as Client
              </button>
            </div>

            {/* Matrix of Module Toggles */}
            <div style={{ padding: '24px', background: 'white' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Key size={14} /> Provisioned Core Modules
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                {Object.entries(client.modules).map(([moduleKey, isEnabled]) => {
                   const labelMap = {
                     seo: 'SEO & GEO Engine',
                     heatmaps: 'Thermal Tracking',
                     email: 'Broadcast Email',
                     content: 'AI Studio',
                     social: 'Social Logistics',
                     ghostEditor: 'Ghost Editor',
                     liquidUI: 'Liquid UI',
                     constraints: 'Master Constraints',
                     systemLogs: 'System SRE Logs',
                     integrations: 'API Ecosystem',
                     billing: 'Billing Dashboard'
                   };
                   
                   return (
                     <button
                       key={moduleKey}
                       onClick={() => traverseCapabilityToggle(client.id, moduleKey)}
                       style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px',
                          border: isEnabled ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(0,0,0,0.05)',
                          borderRadius: '12px', background: isEnabled ? 'rgba(16, 185, 129, 0.05)' : 'var(--color-bg-light)',
                          cursor: 'pointer', transition: 'all 0.2s ease'
                       }}
                     >
                        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: isEnabled ? '#10B981' : 'var(--color-text-muted)' }}>{labelMap[moduleKey]}</span>
                        {isEnabled ? <Unlock size={16} color="#10B981" /> : <Lock size={16} color="var(--color-text-muted)" />}
                     </button>
                   );
                })}
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientManagement;
