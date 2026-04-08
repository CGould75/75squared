import React, { useState, useContext, useEffect } from 'react';
import { Globe, ShieldCheck, MapPin, Clock, Phone, Link2, RefreshCw, Code, Network, Copy, CheckCircle2, Zap, Target, Bot } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GlobalDomainContext } from '../../layouts/AdminLayout';
import SEOHead from '../../components/SEOHead';

const MOCK_SCHEMA_DATA = {
  '75squared.com': {
     name: "75 Squared", url: "https://75squared.com", logo: "https://75squared.com/logo.png", description: "Advanced Digital Marketing and SEO Operations Nexus.", founder: "Chris Gould", telephone: "+1-555-123-4567",
     streetAddress: "123 Technology Drive", addressLocality: "Las Vegas", addressRegion: "NV", postalCode: "89101", addressCountry: "US", priceRange: "$$$", socialLinks: "https://linkedin.com/company/75squared\nhttps://twitter.com/75squared"
  },
  'goodyslv.com': {
     name: "Goodys Popcorn", url: "https://goodyslv.com", logo: "https://goodyslv.com/logo.png", description: "Premium gourmet popcorn and corporate gifts.", founder: "Goodys Team", telephone: "+1-702-555-9999",
     streetAddress: "400 Freemont St", addressLocality: "Las Vegas", addressRegion: "NV", postalCode: "89101", addressCountry: "US", priceRange: "$$", socialLinks: "https://instagram.com/goodyslv"
  },
  'lrms.com': {
     name: "LRMS", url: "https://lrms.com", logo: "https://lrms.com/logo.png", description: "Cloud Library Resource Management System.", founder: "LRMS Inc", telephone: "+1-800-555-0000",
     streetAddress: "700 Library Way", addressLocality: "Boston", addressRegion: "MA", postalCode: "02108", addressCountry: "US", priceRange: "$$$$", socialLinks: "https://linkedin.com/company/lrms"
  }
};

export default function KnowledgeGraphSync() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('directory'); // 'directory' | 'schema'
  
  const { activeDomain } = useContext(GlobalDomainContext);
  const normalizedDomain = activeDomain ? String(activeDomain).toLowerCase().trim() : '';
  const domainKey = ['goodyslv.com', 'lrms.com'].find(key => normalizedDomain.includes(key)) || '75squared.com';

  // Schema Architecture State
  const [schemaEntity, setSchemaEntity] = useState('Organization');
  const [schemaData, setSchemaData] = useState(MOCK_SCHEMA_DATA[domainKey]);
  const [autoResolveMode, setAutoResolveMode] = useState(false);

  // Sync state if context changes
  useEffect(() => {
     setSchemaData(MOCK_SCHEMA_DATA[domainKey]);
  }, [domainKey]);

  const [copied, setCopied] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);

  const handleDataChange = (e) => {
    setSchemaData({ ...schemaData, [e.target.name]: e.target.value });
  };

  const generateSchema = () => {
     const links = schemaData.socialLinks.split('\n').map(l => l.trim()).filter(Boolean);
     
     let baseSchema = {
        "@context": "https://schema.org",
        "@type": schemaEntity,
        "name": schemaData.name,
        "url": schemaData.url,
        "logo": schemaData.logo,
        "description": schemaData.description,
     };

     if(schemaEntity === "LocalBusiness" || schemaEntity === "Organization") {
        baseSchema.telephone = schemaData.telephone;
        baseSchema.address = {
           "@type": "PostalAddress",
           "streetAddress": schemaData.streetAddress,
           "addressLocality": schemaData.addressLocality,
           "addressRegion": schemaData.addressRegion,
           "postalCode": schemaData.postalCode,
           "addressCountry": schemaData.addressCountry
        };
     }

     if(schemaEntity === "Organization") {
        baseSchema.founder = {
           "@type": "Person",
           "name": schemaData.founder
        };
     }

     if(schemaEntity === "LocalBusiness") {
        baseSchema.priceRange = schemaData.priceRange;
     }

     if(links.length > 0) {
        baseSchema.sameAs = links;
     }

     return `<script type="application/ld+json">\n${JSON.stringify(baseSchema, null, 2)}\n</script>`;
  };

  const handleCopy = () => {
     navigator.clipboard.writeText(generateSchema());
     setCopied(true);
     setTimeout(() => setCopied(false), 2000);
  };

  const handleDeploy = () => {
     setIsDeploying(true);
     setTimeout(() => {
        alert("Alerting SRE: JSON-LD Graph Payload appended to Action Center queue for Edge injection.");
        setIsDeploying(false);
        navigate('/admin/action-center');
     }, 1500);
  };

  return (
    <div className="fade-in">
      <SEOHead title="Knowledge Graph Sync" description="Yext-style synchronization and JSON-LD schema builder." path="/admin/directory-sync" />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Network size={36} color="var(--color-blue-main)" />
            Knowledge Graph Architect
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem', maxWidth: '600px' }}>
            Dominate entity search by algorithmically formatting and deploying corporate schema targets across the grid.
          </p>
        </div>
        
        {/* Module Switcher Tabs */}
        <div style={{ display: 'flex', background: 'rgba(0,0,0,0.05)', borderRadius: '12px', padding: '4px', gap: '4px' }}>
          <button 
            onClick={() => setActiveTab('directory')}
            style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s', background: activeTab === 'directory' ? 'white' : 'transparent', color: activeTab === 'directory' ? 'var(--color-text-main)' : 'var(--color-text-muted)', boxShadow: activeTab === 'directory' ? '0 2px 10px rgba(0,0,0,0.05)' : 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Globe size={16} /> Global Directory Sync
          </button>
          <button 
            onClick={() => setActiveTab('schema')}
            style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s', background: activeTab === 'schema' ? 'white' : 'transparent', color: activeTab === 'schema' ? 'var(--color-purple-main)' : 'var(--color-text-muted)', boxShadow: activeTab === 'schema' ? '0 2px 10px rgba(0,0,0,0.05)' : 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Code size={16} /> JSON-LD Architect
          </button>
        </div>
      </div>

      {activeTab === 'directory' && (
        <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '40px' }}>
          {/* Left Column: Editor */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
             <div className="glass-panel" style={{ padding: '30px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={18} color="var(--color-blue-main)" /> Geographic Origin</h3>
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
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}><Clock size={18} color="var(--color-blue-main)" /> Operating Matrix</h3>
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
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}><Phone size={18} color="var(--color-blue-main)" /> Contact Logistics</h3>
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
             
             <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
                <div style={{ padding: '16px', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                   <div>
                     <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--color-text-main)', marginBottom: '4px' }}>Autonomous Push Sync</div>
                     <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>If active, Nexus bypassing the SRE validation queue and force maps this directory data straight via Edge API to Yext equivalents.</div>
                   </div>
                   <button 
                      onClick={() => setAutoResolveMode(!autoResolveMode)}
                      style={{ background: autoResolveMode ? 'var(--color-green-main)' : 'rgba(0,0,0,0.1)', border: 'none', borderRadius: '20px', width: '50px', height: '26px', position: 'relative', cursor: 'pointer', transition: '0.3s' }}>
                      <div style={{ position: 'absolute', top: '3px', left: autoResolveMode ? '27px' : '3px', width: '20px', height: '20px', background: 'white', borderRadius: '50%', transition: '0.3s', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}></div>
                   </button>
                </div>
                
                <button 
                  onClick={() => {
                     if (autoResolveMode) {
                        alert("Autonomous Force Sync Executed: Pinged 82 minor nodes.");
                     } else {
                        alert("Alerting SRE: Sync payload safely transmitted to Action Center for Validation.");
                        navigate('/admin/action-center');
                     }
                  }}
                  className="btn btn-primary" style={{ padding: '16px', fontSize: '1.1rem', justifyContent: 'center', background: autoResolveMode ? 'var(--color-green-main)' : 'var(--color-purple-main)', border: 'none' }}>
                   {autoResolveMode ? <Zap size={20} /> : <RefreshCw size={20} />} 
                   {autoResolveMode ? 'Trigger Edge API Sync (Autonomous)' : 'Submit Sync Payload to Action Center'}
                </button>
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
      )}

      {activeTab === 'schema' && (
        <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1.8fr)', gap: '40px' }}>
          
          {/* Left Variables Config */}
          <div className="glass-panel" style={{ padding: '30px' }}>
             <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '24px' }}>Entity Definition</h3>
             
             <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                   <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '8px' }}>Google Primary Graph Type</label>
                   <select 
                     value={schemaEntity}
                     onChange={(e) => setSchemaEntity(e.target.value)}
                     style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', background: 'var(--color-bg-light)', fontWeight: 600, outline: 'none' }}>
                     <option value="Organization">Corporate Organization (Default)</option>
                     <option value="LocalBusiness">Local Business Database</option>
                     <option value="SoftwareApplication">SaaS / Software Application</option>
                   </select>
                </div>

                <div>
                   <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '8px' }}>Core Brand Parameters</label>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                     <input type="text" name="name" value={schemaData.name} onChange={handleDataChange} placeholder="Brand Name" style={{ padding: '10px 14px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)', background: 'var(--color-bg-light)', outline: 'none' }} />
                     <input type="text" name="founder" value={schemaData.founder} onChange={handleDataChange} placeholder="Founder Name(s)" style={{ padding: '10px 14px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)', background: 'var(--color-bg-light)', outline: 'none' }} />
                     <input type="url" name="url" value={schemaData.url} onChange={handleDataChange} placeholder="Root Domain URL" style={{ padding: '10px 14px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)', background: 'var(--color-bg-light)', outline: 'none' }} />
                     <input type="text" name="description" value={schemaData.description} onChange={handleDataChange} placeholder="Semantic Description" style={{ padding: '10px 14px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)', background: 'var(--color-bg-light)', outline: 'none' }} />
                   </div>
                </div>

                <div>
                   <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '8px' }}>SameAs Entity Linking (Knowledge Panel Inject)</label>
                   <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '8px', lineHeight: '1.4' }}>Pasting social URLs here mathematically forces Google to cluster them into your corporate Knowledge Panel.</p>
                   <textarea name="socialLinks" value={schemaData.socialLinks} onChange={handleDataChange} rows="3" style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)', background: 'var(--color-bg-light)', outline: 'none', resize: 'vertical' }}></textarea>
                </div>

             </div>
          </div>

          {/* Right Terminal Output */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
             <div style={{ background: '#1E1E1E', borderRadius: '16px', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', border: '1px solid #333', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
                {/* Terminal Header */}
                <div style={{ background: '#2D2D2D', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #111' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                       <span style={{ color: '#10B981' }}><Code size={18} /></span>
                       <span style={{ color: '#E5E5E5', fontWeight: 600, fontSize: '0.9rem', fontFamily: 'monospace' }}>compiler.jsonld</span>
                    </div>
                    <button onClick={handleCopy} style={{ background: 'transparent', border: 'none', color: copied ? '#10B981' : '#A3A3A3', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600, transition: 'color 0.2s' }}>
                       {copied ? <><CheckCircle2 size={16}/> Copied Code</> : <><Copy size={16}/> Copy Code</>}
                    </button>
                </div>
                
                {/* Raw Live Code Base */}
                <div style={{ padding: '24px', overflowY: 'auto', flexGrow: 1 }}>
                   <pre style={{ fontFamily: '"Fira Code", monospace', fontSize: '0.9rem', color: '#D4D4D4', lineHeight: '1.5', margin: 0 }}>
                     <span style={{ color: '#808080' }}>// Real-time parsed output tailored for Google NLP Crawlers</span><br/><br/>
                     {generateSchema()}
                   </pre>
                </div>
             </div>

             <div style={{ display: 'flex', gap: '16px' }}>
                <button className="btn hover-lift" onClick={handleDeploy} disabled={isDeploying} style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', fontSize: '1.1rem', background: 'var(--color-purple-main)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 800, cursor: 'pointer', boxShadow: '0 8px 25px rgba(147, 51, 234, 0.4)' }}>
                   {isDeploying ? 'Packaging Schema for SRE...' : <><Target size={20} /> Push Compiled Schema to Action Center</>}
                </button>
             </div>
          </div>
          
        </div>
      )}
    </div>
  );
}
