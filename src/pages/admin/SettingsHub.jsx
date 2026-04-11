import React, { useState, useContext } from 'react';
import { Settings, Globe, Mail, MousePointerClick, Search, Bell, Shield, CreditCard, Trash2, Plus, ArrowRight, EyeOff, Save, CheckCircle2, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { GlobalDomainContext } from '../../layouts/AdminLayout';

const SettingsHub = () => {
  const navigate = useNavigate();
  const { activeDomain, availableDomains, userRole } = useContext(GlobalDomainContext);
  const [activeTab, setActiveTab] = useState('general');
  const [saveStatus, setSaveStatus] = useState('idle'); // idle, saving, saved
  const [masterAuth, setMasterAuth] = useState(null);
  const [formData, setFormData] = useState({
    companyName: activeDomain.split('.')[0].toUpperCase(),
    contactName: 'System Administrator',
    alertEmail: `admin@${activeDomain}`,
    alertPhone: '(702) 555-0192',
    timezone: 'America/Los_Angeles',
    businessType: 'service'
  });

  React.useEffect(() => {
    const fetchSettings = async () => {
      const { data: authData } = await supabase.auth.getUser();
      const sessionEmail = authData?.user?.email;
      setMasterAuth(sessionEmail);

      const { data } = await supabase.from('nexus_clients').select('*').eq('domain', activeDomain).single();
      if (data) {
        setFormData({
          companyName: data.company_name || activeDomain.split('.')[0].toUpperCase(),
          contactName: data.contact_name || 'System Administrator',
          alertEmail: data.alert_email || sessionEmail || `admin@${activeDomain}`,
          alertPhone: data.alert_phone || '(702) 555-0192',
          timezone: data.timezone || 'America/Los_Angeles',
          businessType: data.business_type || 'service'
        });
      } else {
        setFormData(prev => ({ ...prev, companyName: activeDomain.split('.')[0].toUpperCase(), alertEmail: sessionEmail || `admin@${activeDomain}` }));
      }
    };
    fetchSettings();
  }, [activeDomain]);

  const handleSimulateSave = async () => {
    setSaveStatus('saving');
    await supabase.from('nexus_clients').update({
       company_name: formData.companyName,
       contact_name: formData.contactName,
       alert_email: formData.alertEmail,
       alert_phone: formData.alertPhone,
       timezone: formData.timezone,
       business_type: formData.businessType
    }).eq('domain', activeDomain);

    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2000);
  };

  const tabs = [
    { id: 'general', label: 'General Profile', icon: <Settings size={18} /> },
    { id: 'domains', label: 'Domain Management', icon: <Globe size={18} /> },
    { id: 'email', label: 'Email Engine', icon: <Mail size={18} /> },
    { id: 'thermal', label: 'Thermal Tracking', icon: <MousePointerClick size={18} /> },
    { id: 'seo', label: 'SEO & Discovery', icon: <Search size={18} /> },
    { id: 'billing', label: 'Billing & Plan', icon: <CreditCard size={18} /> }
  ];

  return (
    <div style={{ paddingBottom: '100px' }}>
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Settings size={36} color="var(--color-blue-main)" /> Environment Settings
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem', maxWidth: '800px' }}>
          Configure infrastructure variables, domain routing, and deeply specific module logic across the platform.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
        {/* Left Navigation Tabs */}
        <div style={{ width: '260px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '8px', position: 'sticky', top: '40px' }}>
          {tabs.map(t => {
            const isActive = activeTab === t.id;
            return (
              <button 
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 20px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                  fontWeight: isActive ? 700 : 500, fontSize: '0.95rem', transition: 'all 0.2s ease', textAlign: 'left',
                  background: isActive ? 'linear-gradient(135deg, rgba(147, 51, 234, 0.1), rgba(59, 130, 246, 0.1))' : 'white',
                  color: isActive ? 'var(--color-purple-dark)' : 'var(--color-text-muted)',
                  borderLeft: isActive ? '3px solid var(--color-purple-main)' : '3px solid transparent',
                  boxShadow: isActive ? 'none' : '0 1px 2px rgba(0,0,0,0.02)'
                }}
              >
                {t.icon} {t.label}
              </button>
            )
          })}
        </div>

        {/* Dynamic Content Area */}
        <div className="glass-panel" style={{ flex: 1, minHeight: '600px', padding: '0', overflow: 'hidden' }}>
          
          {/* Header Action Bar */}
          <div style={{ padding: '24px 40px', borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-bg-light)' }}>
             <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
               {tabs.find(t => t.id === activeTab)?.label}
             </h2>
             <button 
               onClick={handleSimulateSave}
               className="btn btn-primary" 
               style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 24px' }}
             >
               {saveStatus === 'idle' && <><Save size={18} /> Save Changes</>}
               {saveStatus === 'saving' && <>Syncing to Edge...</>}
               {saveStatus === 'saved' && <><CheckCircle2 size={18}/> Deployed</>}
             </button>
          </div>

          <div style={{ padding: '40px' }}>
            
            {activeTab === 'general' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <section>
                   <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><Shield size={18} color="var(--color-blue-main)"/> Infrastructure Identity</h3>
                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                     <div>
                       <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px' }}>Company / Organization Name</label>
                       <input type="text" value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)' }}/>
                     </div>
                     <div>
                       <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px' }}>Technical Contact Name</label>
                       <input type="text" value={formData.contactName} onChange={e => setFormData({...formData, contactName: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)' }}/>
                     </div>
                   </div>
                   <div style={{ marginTop: '20px' }}>
                     <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px' }}>Business Archetype (CRM Logic Engine)</label>
                     <select value={formData.businessType} onChange={e => setFormData({...formData, businessType: e.target.value})} style={{ width: '50%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', background: 'white' }}>
                        <option value="ecommerce">E-Commerce Brand</option>
                        <option value="service">Local Service / Trades</option>
                        <option value="b2b">B2B SaaS / Consulting</option>
                     </select>
                   </div>
                </section>

                <div style={{ height: '1px', background: 'rgba(0,0,0,0.05)' }} />

                <section>
                   <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><Bell size={18} color="var(--color-purple-main)"/> Alerts & Routing</h3>
                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                     <div>
                       <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px' }}>Incident Alert Email</label>
                       <input type="email" value={formData.alertEmail} onChange={e => setFormData({...formData, alertEmail: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)' }}/>
                       <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '6px' }}>Receives downtime pings and critical data loss warnings.</p>
                     </div>
                     <div>
                       <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px' }}>SMS / Phone Routing</label>
                       <input type="tel" value={formData.alertPhone} onChange={e => setFormData({...formData, alertPhone: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)' }}/>
                       <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '6px' }}>For immediate PagerDuty or Level 1 SEV intercepts.</p>
                     </div>
                   </div>
                </section>

                <div style={{ height: '1px', background: 'rgba(0,0,0,0.05)' }} />
                
                <section>
                   <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><Clock size={18} color="var(--color-green-main)"/> Region & Sequencing</h3>
                   <div style={{ width: '50%' }}>
                     <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px' }}>Global Marketing Timezone</label>
                     <select value={formData.timezone} onChange={e => setFormData({...formData, timezone: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', background: 'white' }}>
                        <option value="America/Los_Angeles">America/Los_Angeles (Pacific Time)</option>
                        <option value="America/New_York">America/New_York (Eastern Time)</option>
                        <option value="Europe/London">Europe/London (GMT)</option>
                        <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
                     </select>
                     <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '6px' }}>Forces all Broadcast Emails and Social Posts to align with this localized timezone.</p>
                   </div>
                </section>
              </div>
            )}

            {activeTab === 'domains' && (
               <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                 <div style={{ background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)', padding: '20px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <div>
                     {userRole === 'admin' ? (
                       <>
                         <strong style={{ color: 'var(--color-purple-dark)', fontSize: '0.9rem' }}>Enterprise God-Mode Allocation</strong>
                         <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>You have effectively limitless domain routing mapped via your Master Authentication keys.</p>
                       </>
                     ) : (
                       <>
                         <strong style={{ color: 'var(--color-blue-dark)', fontSize: '0.9rem' }}>Standard Node Allocation</strong>
                         <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>You are using 1 of 3 tracked domains physically permitted by your tier.</p>
                       </>
                     )}
                   </div>
                   <button onClick={() => alert("Component Feature arriving in v2.0")} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}><Plus size={16}/> Add Domain</button>
                 </div>

                 <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', borderBottom: '1px solid rgba(0,0,0,0.05)', fontWeight: 800, fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                      <span style={{ flex: 2 }}>DOMAIN NAME</span>
                      <span style={{ flex: 1 }}>STATUS</span>
                      <span style={{ flex: 1, textAlign: 'right' }}>ACTIONS</span>
                    </div>
                    {availableDomains?.map((domainObj) => (
                      <div key={domainObj.id || domainObj.domain} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 16px', borderBottom: '1px solid rgba(0,0,0,0.05)', background: activeDomain === domainObj.domain ? 'rgba(16, 185, 129, 0.02)' : 'white' }}>
                        <div style={{ flex: 2, display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 700 }}>
                          <div style={{ width: '8px', height: '8px', background: activeDomain === domainObj.domain ? '#10B981' : '#94A3B8', borderRadius: '50%' }} /> {domainObj.domain} 
                          {activeDomain === domainObj.domain && <span style={{ background: 'var(--color-bg-light)', padding: '4px 8px', fontSize: '0.65rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.05)'}}>PRIMARY SELECTION</span>}
                        </div>
                        <span style={{ flex: 1, color: '#10B981', fontSize: '0.85rem', fontWeight: 700 }}>SECURED</span>
                        <div style={{ flex: 1, textAlign: 'right' }}>
                          <button onClick={() => alert("Component Feature arriving in v2.0")} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}><Settings size={18}/></button>
                        </div>
                      </div>
                    ))}
                 </div>
               </div>
            )}

            {activeTab === 'email' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <p style={{ color: 'var(--color-text-muted)' }}>Configure strict DMARC, DKIM, and SPF authenticity so your blasts land in the primary inbox.</p>
                <div style={{ border: '1px solid rgba(0,0,0,0.05)', borderRadius: '12px', overflow: 'hidden' }}>
                    <div style={{ padding: '20px', background: 'var(--color-bg-light)', borderBottom: '1px solid rgba(0,0,0,0.05)', fontWeight: 800 }}>Sender Signatures</div>
                    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                       <div>
                         <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px' }}>Reply-To Alias</label>
                         <input type="email" defaultValue={`hello@${activeDomain}`} style={{ width: '50%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)' }}/>
                       </div>
                       <div>
                         <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px' }}>Global Opt-Out Message</label>
                         <textarea defaultValue={`You are receiving this because you opted in at ${activeDomain}. If you no longer wish to receive updates, please click below.`} rows={3} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', fontFamily: 'var(--font-body)', resize: 'vertical' }}/>
                       </div>
                    </div>
                </div>
              </div>
            )}

            {activeTab === 'thermal' && (
               <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-bg-light)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)' }}>
                    <div>
                      <strong style={{ display: 'block', marginBottom: '4px' }}>Strict PII Masking</strong>
                      <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Automatically scrambles all keystrokes and credit card entries before recording reaches our servers.</span>
                    </div>
                    <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '24px' }}>
                      <input type="checkbox" defaultChecked style={{ opacity: 0, width: 0, height: 0 }} />
                      <span style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#10B981', borderRadius: '24px', transition: '.4s' }}></span>
                      <span style={{ position: 'absolute', content: '""', height: '16px', width: '16px', left: '30px', bottom: '4px', backgroundColor: 'white', borderRadius: '50%', transition: '.4s' }}></span>
                    </label>
                 </div>

                 <div>
                   <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px' }}>Traffic Sampling Rate</label>
                   <select style={{ width: '50%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', background: 'white' }}>
                      <option>100% of all visitors</option>
                      <option>50% of all visitors</option>
                      <option>10% (High Volume Sites)</option>
                   </select>
                 </div>
               </div>
            )}

            {activeTab === 'seo' && (
               <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                 <p style={{ color: 'var(--color-text-muted)' }}>Force the Knowledge Graph engine to index against explicit local/global competitors.</p>
                 
                 <div>
                   <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px' }}>Primary Regional Target</label>
                   <select style={{ width: '50%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', background: 'white' }}>
                      <option>United States (Global)</option>
                      <option>Nevada (State Level)</option>
                      <option>Las Vegas (Hyper Local)</option>
                   </select>
                 </div>

                 <div>
                   <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px' }}>Target Benchmark Competitors (URLs)</label>
                   <textarea placeholder="e.g. garrettpopcorn.com&#10;popcornopolis.com" rows={4} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', fontFamily: 'var(--font-body)', resize: 'vertical' }}/>
                   <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '6px' }}>The AI will continuously scrape these domains to find content gaps against your site.</p>
                 </div>
               </div>
            )}

            {activeTab === 'billing' && (
               <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', alignItems: 'center', justifyContent: 'center', padding: '60px 0', textAlign: 'center' }}>
                 <CreditCard size={48} color="var(--color-purple-light)" />
                 <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Billing Managed Externally</h3>
                 <p style={{ color: 'var(--color-text-muted)', maxWidth: '400px', margin: '0 auto' }}>
                   You are currently on a <strong>Standard Node</strong>. To handle license limits, payment methods, and invoices, please contact your account representative.
                 </p>
                 <button onClick={() => navigate('/admin/billing')} className="btn btn-outline" style={{ marginTop: '16px' }}>View Super Admin Capabilities</button>
               </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};

export default SettingsHub;
