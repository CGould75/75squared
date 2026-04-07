import React, { useState, useEffect } from 'react';
import { Blocks, Key, RefreshCw, UploadCloud, DownloadCloud, CheckCircle2, AlertCircle, Database, Workflow, Mail, MessageSquare } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

const IntegrationsDashboard = () => {
  const [activeTab, setActiveTab] = useState('marketplace');
  const [connectionStatuses, setConnectionStatuses] = useState({});

  useEffect(() => {
    const fetchConnections = async () => {
      const { data } = await supabase.from('api_integrations').select('*');
      if (data) {
        const statuses = {};
        data.forEach(conn => {
          statuses[conn.app_id] = conn.auth_status; // 'connected', 'error', 'available'
        });
        setConnectionStatuses(statuses);
      }
    };
    fetchConnections();
  }, []);

  const integrations = [
    {
      id: 'zapier',
      name: 'Zapier',
      type: 'Automation Hub',
      icon: <Workflow size={24} color="#FF4A00" />,
      color: '#FF4A00',
      status: connectionStatuses['zapier'] || 'available',
      description: 'Route 75 Squared behavioral events to 5,000+ external applications instantly.',
      syncDirection: 'Outbound Only'
    },
    {
      id: 'mailchimp',
      name: 'Mailchimp',
      type: 'Legacy Marketing',
      icon: <Mail size={24} color="#FFE01B" />,
      color: '#FFE01B',
      status: connectionStatuses['mailchimp'] || 'available',
      description: 'Bi-directional sync. Import old subscriber lists, or export our AI-drafted automated sequences.',
      syncDirection: 'Bi-Directional'
    },
    {
      id: 'surfer',
      name: 'Surfer SEO',
      type: 'Content Engine',
      icon: <Database size={24} color="#5321DE" />,
      color: '#5321DE',
      status: connectionStatuses['surfer'] || 'available',
      description: 'Import cached keyword NLP targets into the 75 Squared autonomous editor.',
      syncDirection: 'Inbound Only'
    },
    {
      id: 'salesforce',
      name: 'Salesforce',
      type: 'Enterprise CRM',
      icon: <MessageSquare size={24} color="#00A1E0" />,
      color: '#00A1E0',
      status: connectionStatuses['salesforce'] || 'available',
      description: 'Push high-intent heatmapping data directly into Salesforce Lead profiles.',
      syncDirection: 'Bi-Directional'
    }
  ];

  return (
    <div>
      <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Blocks size={36} color="var(--color-blue-main)" /> Global Integrations Hub
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>
            Bi-directional data synchronization with legacy third-party applications.
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '8px', background: 'rgba(0,0,0,0.05)', padding: '4px', borderRadius: '12px' }}>
          <button 
             onClick={() => setActiveTab('marketplace')}
             style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, background: activeTab === 'marketplace' ? 'white' : 'transparent', color: activeTab === 'marketplace' ? 'var(--color-text-main)' : 'var(--color-text-muted)', boxShadow: activeTab === 'marketplace' ? '0 2px 10px rgba(0,0,0,0.05)' : 'none' }}>
             Connections
          </button>
          <button 
             onClick={() => setActiveTab('sync')}
             style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, background: activeTab === 'sync' ? 'white' : 'transparent', color: activeTab === 'sync' ? 'var(--color-text-main)' : 'var(--color-text-muted)', boxShadow: activeTab === 'sync' ? '0 2px 10px rgba(0,0,0,0.05)' : 'none' }}>
             Active Data Sync
          </button>
        </div>
      </div>

      {activeTab === 'marketplace' && (
        <div className="fade-in">
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}>
             {integrations.map(integration => (
               <div key={integration.id} className="glass-panel" style={{ padding: '30px', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: 'rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {integration.icon}
                    </div>
                    {integration.status === 'connected' && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-green-main)', background: 'rgba(16, 185, 129, 0.1)', padding: '6px 12px', borderRadius: '20px' }}>
                        <CheckCircle2 size={14}/> Active
                      </span>
                    )}
                    {integration.status === 'error' && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700, color: '#EF4444', background: 'rgba(239, 68, 68, 0.1)', padding: '6px 12px', borderRadius: '20px' }}>
                        <AlertCircle size={14}/> Broken Auth
                      </span>
                    )}
                  </div>
                  
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '4px' }}>{integration.name}</h3>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '16px' }}>{integration.type}</div>
                  
                  <p style={{ color: 'var(--color-text-main)', fontSize: '0.95rem', lineHeight: '1.6', flexGrow: 1, marginBottom: '24px' }}>
                    {integration.description}
                  </p>

                  <div style={{ background: 'var(--color-bg-light)', border: '1px solid rgba(0,0,0,0.05)', padding: '12px 16px', borderRadius: '8px', fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                     <span style={{ color: 'var(--color-text-muted)', fontWeight: 600 }}>Data Transfer</span>
                     <span style={{ fontWeight: 700 }}>{integration.syncDirection}</span>
                  </div>

                  {integration.status === 'available' ? (
                     <button className="btn btn-outline" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px' }}>
                       <Key size={16} /> Enter API Key
                     </button>
                  ) : (
                     <button className="btn btn-primary" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', background: integration.status === 'error' ? 'var(--color-bg-light)' : 'var(--color-purple-main)', color: integration.status === 'error' ? 'var(--color-text-main)' : 'white', border: integration.status === 'error' ? '1px solid rgba(0,0,0,0.1)' : 'none' }}>
                       <RefreshCw size={16} /> {integration.status === 'error' ? 'Re-Authenticate' : 'Force Server Sync'}
                     </button>
                  )}
               </div>
             ))}
          </div>

        </div>
      )}

      {activeTab === 'sync' && (
        <div className="fade-in glass-panel" style={{ padding: '40px' }}>
           <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
             <RefreshCw size={24} color="var(--color-purple-main)" /> Sync Operations
           </h2>
           
           <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '40px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                 <div style={{ border: '2px solid var(--color-purple-main)', borderRadius: '12px', padding: '24px', cursor: 'pointer', background: 'rgba(147, 51, 234, 0.02)' }}>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <DownloadCloud size={20} color="var(--color-purple-main)"/> Import Legacy Data
                    </h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Pull data from Mailchimp or Salesforce directly into the Nexus structural database.</p>
                 </div>
                 
                 <div style={{ border: '1px solid rgba(0,0,0,0.1)', borderRadius: '12px', padding: '24px', cursor: 'pointer', background: 'var(--color-bg-light)' }}>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <UploadCloud size={20} color="var(--color-text-muted)"/> Export Intelligence
                    </h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Push 75 Squared analytics metrics and computed AI triggers OUT to legacy tools.</p>
                 </div>
              </div>

              <div style={{ background: 'var(--color-bg-light)', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '16px', padding: '30px' }}>
                 <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '24px' }}>Mailchimp Import Console</h3>
                 
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '30px' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'white', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '8px' }}>
                      <span style={{ fontWeight: 600 }}>Target List</span>
                      <select style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)', outline: 'none' }}>
                        <option>Master Newsletter (4,204 contacts)</option>
                        <option>VIP Clients (110 contacts)</option>
                      </select>
                   </div>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'white', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '8px' }}>
                      <span style={{ fontWeight: 600 }}>Conflict Resolution</span>
                      <select style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)', outline: 'none' }}>
                        <option>Nexus overwrites Mailchimp</option>
                        <option>Mailchimp overwrites Nexus</option>
                      </select>
                   </div>
                 </div>

                 <button className="btn btn-primary" style={{ width: '100%', padding: '16px', fontSize: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px' }}>
                   <Database size={20}/> Execute Database Merge
                 </button>
                 
                 <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                   Note: This action maps to our unified SQL layer. Imported records will permanently bind to your existing tracking IDs.
                 </div>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default IntegrationsDashboard;
