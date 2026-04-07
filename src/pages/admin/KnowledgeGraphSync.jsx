import React from 'react';
import { Globe, ShieldCheck, MapPin, Clock, Phone, Link2, RefreshCw } from 'lucide-react';
import SEOHead from '../../components/SEOHead';

export default function KnowledgeGraphSync() {
  return (
    <div className="fade-in">
      <SEOHead title="Local Listings Sync" description="Yext-style Knowledge Graph API synchronizer." path="/admin/directory-sync" />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Globe size={36} color="var(--color-blue-main)" />
            Knowledge Graph Sync
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem', maxWidth: '600px' }}>
            Modify your master business metadata below. Changes will be mathematically replicated across Google, Yelp, Bing, Apple Maps, and 85+ minor directories instantly.
          </p>
        </div>
        
        <div>
          <button className="btn btn-primary" style={{ padding: '12px 24px', fontSize: '1.1rem' }}>
             <RefreshCw size={18} /> Launch Global Sync
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '40px' }}>
        {/* Left Column: Editor */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
           <div className="glass-panel" style={{ padding: '30px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={18} color="var(--color-purple-main)" /> Geographic Origin</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Street Address</label>
                    <input type="text" defaultValue="123 Technology Drive" style={{ padding: '12px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', background: '#FAFAFA' }} />
                 </div>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>City, State, Zip</label>
                    <input type="text" defaultValue="Austin, TX 78701" style={{ padding: '12px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', background: '#FAFAFA' }} />
                 </div>
              </div>
           </div>

           <div className="glass-panel" style={{ padding: '30px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}><Clock size={18} color="var(--color-purple-main)" /> Operating Matrix</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                 {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
                    <div key={day} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                       <div style={{ width: '100px', fontWeight: 600 }}>{day}</div>
                       <input type="time" defaultValue="09:00" style={{ padding: '8px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '6px', background: '#FAFAFA' }} />
                       <span style={{ color: 'var(--color-text-muted)' }}>to</span>
                       <input type="time" defaultValue="17:00" style={{ padding: '8px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '6px', background: '#FAFAFA' }} />
                    </div>
                 ))}
              </div>
           </div>

           <div className="glass-panel" style={{ padding: '30px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}><Phone size={18} color="var(--color-purple-main)" /> Contact Logistics</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Master Phone Line</label>
                    <input type="text" defaultValue="(555) 123-4567" style={{ padding: '12px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', background: '#FAFAFA' }} />
                 </div>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Support Email Node</label>
                    <input type="text" defaultValue="support@75squared.com" style={{ padding: '12px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', background: '#FAFAFA' }} />
                 </div>
              </div>
           </div>
        </div>

        {/* Right Column: Connection Status */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
           <div className="glass-panel" style={{ padding: '30px', background: '#FAFAFA' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '24px' }}>API Health Status</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '8px', background: 'white' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 600 }}>
                       <img src="https://www.google.com/favicon.ico" alt="Google" style={{ width: '20px' }}/> Google Hub
                    </div>
                    <div style={{ color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', fontWeight: 700 }}><ShieldCheck size={14} /> ACTIVE</div>
                 </div>

                 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '8px', background: 'white' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 600 }}>
                       <img src="https://www.yelp.com/favicon.ico" alt="Yelp" style={{ width: '20px' }}/> Yelp Engine
                    </div>
                    <div style={{ color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', fontWeight: 700 }}><ShieldCheck size={14} /> ACTIVE</div>
                 </div>

                 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '8px', background: 'white' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 600 }}>
                       <div style={{ width: '20px', height: '20px', background: '#CCC', borderRadius: '4px' }}></div> Apple Maps
                    </div>
                    <div style={{ color: '#F59E0B', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', fontWeight: 700 }}><Link2 size={14} /> PENDING</div>
                 </div>

                 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '8px', background: 'white' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 600 }}>
                       <div style={{ width: '20px', height: '20px', background: '#CCC', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '10px', fontWeight: 800 }}>82</div> Minor Nodes
                    </div>
                    <div style={{ color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', fontWeight: 700 }}><ShieldCheck size={14} /> ACTIVE</div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
