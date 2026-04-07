import React, { useState, useEffect } from 'react';
import { LineChart, MousePointerClick, Mail, ArrowRight, ShieldCheck, Zap, Share2, CreditCard, Ghost, Blocks, ShieldAlert, Activity, Code, Sparkles, SlidersHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';

import { supabase } from '../../lib/supabaseClient';

const AdminHub = () => {
  const [userRole, setUserRole] = useState('admin');
  const [clientPermissions, setClientPermissions] = useState(null);
  const [activeClients, setActiveClients] = useState([]);

  useEffect(() => {
    const role = localStorage.getItem('nexus_role') || 'admin';
    const rawPerms = localStorage.getItem('nexus_client_permissions');
    setUserRole(role);
    if (rawPerms) setClientPermissions(JSON.parse(rawPerms));

    const checkLiveProperties = async () => {
       // --- ONE OFF DB UPDATE TO RENAME CLIENTS ENFORCING RLS ---
       await supabase.from('nexus_clients').update({ name: '75 Squared', domain: '75squared.com - Primary' }).eq('name', 'Primary Vault Customer');
       await supabase.from('nexus_clients').update({ name: 'LRMS' }).eq('name', 'LRMS.com');
       
       const { data } = await supabase.from('nexus_clients').select('*');
       if (data) setActiveClients(data);
    };
    checkLiveProperties();
  }, []);

  // Helper macro
  const hasAccess = (key) => {
    if (userRole === 'admin') return true;
    if (!clientPermissions) return true;
    return clientPermissions[key] !== false;
  };

  return (
    <div>
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px' }}>Workspace Overview</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>Welcome to 75 Squared Nexus. Select a module to analyze your digital performance.</p>
      </div>

      {/* Property Deployment Zone (Super Admin Only) */}
      {userRole === 'admin' && (
        <div className="glass-panel" style={{ padding: '24px', marginBottom: '40px', background: 'linear-gradient(to right, white, rgba(59, 130, 246, 0.02))' }}>
           <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Code size={18} color="var(--color-purple-main)" /> Active Property Deployments
           </h3>
           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              {activeClients.map(client => (
                <div key={client.id} style={{ border: '1px solid rgba(0,0,0,0.05)', borderRadius: '12px', padding: '16px', background: 'white' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', alignItems: 'center' }}>
                     <span style={{ fontWeight: 700 }}>{client.name}</span>
                     <span style={{ fontSize: '0.7rem', background: client.status === 'active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: client.status === 'active' ? '#10B981' : '#EF4444', padding: '4px 8px', borderRadius: '12px', fontWeight: 800 }}>
                       {client.status === 'active' ? 'RECEIVING DATA' : 'PENDING INSTALL'}
                     </span>
                   </div>
                   <code style={{ display: 'block', padding: '12px', background: '#1e1e1e', color: '#d4d4d4', borderRadius: '6px', fontSize: '0.8rem', whiteSpace: 'nowrap', overflowX: 'auto' }}>
                     &lt;script src="https://nexus.75squared.com/edge.js" data-property="{client.domain}"&gt;&lt;/script&gt;
                   </code>
                   {client.status !== 'active' && (
                     <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '8px' }}>Copy this tag into the <code>&lt;head&gt;</code> of {client.domain} to instantly begin tracking.</p>
                   )}
                </div>
              ))}
           </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>

        {/* Security Ops (Always Visible to Admin, or if client role) */}
        <div className="glass-panel" style={{ padding: '30px', position: 'relative', overflow: 'hidden', borderLeft: '4px solid #EF4444' }}>
           <div style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(239, 68, 68, 0.1)', padding: '4px 12px', borderRadius: '12px', color: '#EF4444', fontSize: '0.7rem', fontWeight: 800 }}>PRIORITY ZERO</div>
           <div style={{ position: 'absolute', top: '-20px', right: '-20px', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '50%', width: '150px', height: '150px', zIndex: 0 }}></div>
           <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(147, 51, 234, 0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444', marginBottom: '20px' }}>
                <ShieldAlert size={28} />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '12px' }}>Security & Liability</h3>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px', lineHeight: '1.6' }}>
                Zero-Trust Architectural Defenses. Configure PII scrubbers, algorithmic circuit breakers, and enforce client liability waivers.
              </p>
              
              <Link to="/admin/security" className="btn btn-outline" style={{ marginTop: 'auto', alignSelf: 'flex-start', textDecoration: 'none' }}>
                Audit Compliance <ArrowRight size={16} />
              </Link>
           </div>
        </div>

        {/* Autonomous SRE */}
        {hasAccess('systemLogs') && (
        <div className="glass-panel" style={{ padding: '30px', position: 'relative', overflow: 'hidden' }}>
           <div style={{ position: 'absolute', top: '20px', right: '20px', background: 'linear-gradient(135deg, var(--color-blue-main), var(--color-green-main))', padding: '4px 12px', borderRadius: '12px', color: 'white', fontSize: '0.7rem', fontWeight: 800 }}>AUTO-HEALING</div>
           <div style={{ position: 'absolute', top: '-20px', right: '-20px', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '50%', width: '150px', height: '150px', zIndex: 0 }}></div>
           <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(16, 185, 129, 0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-blue-main)', marginBottom: '20px' }}>
                <Activity size={28} />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '12px' }}>Platform Telemetry</h3>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px', lineHeight: '1.6' }}>
                God-Mode Error Management. Connects client stack traces directly to the Autonomous SRE for algorithmic self-healing.
              </p>
              
              <Link to="/admin/system-logs" className="btn btn-primary" style={{ marginTop: 'auto', alignSelf: 'flex-start', textDecoration: 'none' }}>
                View Incident Queue <ArrowRight size={16} />
              </Link>
           </div>
        </div>
        )}

        {/* Generative Liquid UI (Phase 18) */}
        {hasAccess('liquidUI') && (
        <div className="glass-panel" style={{ padding: '30px', position: 'relative', overflow: 'hidden' }}>
           <div style={{ position: 'absolute', top: '20px', right: '20px', background: 'linear-gradient(135deg, #F59E0B, #EF4444)', padding: '4px 12px', borderRadius: '12px', color: 'white', fontSize: '0.7rem', fontWeight: 800 }}>GENERATIVE</div>
           <div style={{ position: 'absolute', top: '-20px', right: '-20px', background: 'rgba(245, 158, 11, 0.05)', borderRadius: '50%', width: '150px', height: '150px', zIndex: 0 }}></div>
           <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(239, 68, 68, 0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F59E0B', marginBottom: '20px' }}>
                <Sparkles size={28} />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '12px' }}>Liquid UI Rules</h3>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px', lineHeight: '1.6' }}>
                Configure rulesets that utilize LLMs to dynamically generate bespoke front-end layouts customized to a user's inbound psychological intent.
              </p>
              
              <Link to="/admin/liquid-ui" className="btn btn-outline" style={{ marginTop: 'auto', alignSelf: 'flex-start', textDecoration: 'none' }}>
                Map Intent Schemas <ArrowRight size={16} />
              </Link>
           </div>
        </div>
        )}

        {/* Master Constraints (Phase 19) */}
        {hasAccess('constraints') && (
        <div className="glass-panel" style={{ padding: '30px', position: 'relative', overflow: 'hidden' }}>
           <div style={{ position: 'absolute', top: '-20px', right: '-20px', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '50%', width: '150px', height: '150px', zIndex: 0 }}></div>
           <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-blue-main)', marginBottom: '20px' }}>
                <SlidersHorizontal size={28} />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '12px' }}>Master Constraints</h3>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px', lineHeight: '1.6' }}>
                Globally throttle tracker cadence. Control operating hours, fractional traffic indexing, and biologically programmed script expiration.
              </p>
              
              <Link to="/admin/constraints" className="btn btn-outline" style={{ marginTop: 'auto', alignSelf: 'flex-start', textDecoration: 'none' }}>
                Configure Hardware <ArrowRight size={16} />
              </Link>
           </div>
        </div>
        )}

        {/* Ghost Editor (Phase 12) */}
        {hasAccess('ghostEditor') && (
        <div className="glass-panel" style={{ padding: '30px', position: 'relative', overflow: 'hidden' }}>
           <div style={{ position: 'absolute', top: '20px', right: '20px', background: 'linear-gradient(135deg, var(--color-purple-main), var(--color-blue-main))', padding: '4px 12px', borderRadius: '12px', color: 'white', fontSize: '0.7rem', fontWeight: 800 }}>VANGUARD</div>
           <div style={{ position: 'absolute', top: '-20px', right: '-20px', background: 'rgba(147, 51, 234, 0.05)', borderRadius: '50%', width: '150px', height: '150px', zIndex: 0 }}></div>
           <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.1), rgba(59, 130, 246, 0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-purple-main)', marginBottom: '20px' }}>
                <Ghost size={28} />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '12px' }}>Ghost Editor</h3>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px', lineHeight: '1.6' }}>
                Autonomous DOM Mutation. Systematize A/B frontend code injection derived strictly from Thermal Failure Analysis.
              </p>
              
              <Link to="/admin/ghost-editor" className="btn btn-primary" style={{ marginTop: 'auto', alignSelf: 'flex-start', textDecoration: 'none' }}>
                Verify Anomalies <ArrowRight size={16} />
              </Link>
           </div>
        </div>
        )}

        {/* Integrations Hub (Phase 15) */}
        {hasAccess('integrations') && (
        <div className="glass-panel" style={{ padding: '30px', position: 'relative', overflow: 'hidden' }}>
           <div style={{ position: 'absolute', top: '-20px', right: '-20px', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '50%', width: '150px', height: '150px', zIndex: 0 }}></div>
           <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(147, 51, 234, 0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-green-main)', marginBottom: '20px' }}>
                <Blocks size={28} />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '12px' }}>API Integrations</h3>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px', lineHeight: '1.6' }}>
                Third-Party Ecosystem. Bi-directional sync with legacy apps like Mailchimp, Salesforce, and Zapier for omni-channel routing.
              </p>
              
              <Link to="/admin/integrations" className="btn btn-outline" style={{ marginTop: 'auto', alignSelf: 'flex-start', textDecoration: 'none' }}>
                Manage Keys <ArrowRight size={16} />
              </Link>
           </div>
        </div>
        )}

        {/* SEO & Analytics Module */}
        {hasAccess('seo') && (
        <div className="glass-panel" style={{ padding: '30px', position: 'relative', overflow: 'hidden' }}>
           <div style={{ position: 'absolute', top: '-20px', right: '-20px', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '50%', width: '150px', height: '150px', zIndex: 0 }}></div>
           <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-blue-main)', marginBottom: '20px' }}>
                <LineChart size={28} />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '12px' }}>SEO Edge Engine</h3>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px', lineHeight: '1.6' }}>
                Analyze deep backlink profiles, track local keyword rankings, and monitor domain authority metrics across your competitive landscape.
              </p>
              
              <Link to="/admin/seo" className="btn btn-outline" style={{ marginTop: 'auto', alignSelf: 'flex-start', textDecoration: 'none' }}>
                Launch SEO Suite <ArrowRight size={16} />
              </Link>
           </div>
        </div>
        )}

        {/* Behavior Tracking Module */}
        {hasAccess('heatmaps') && (
        <div className="glass-panel" style={{ padding: '30px', position: 'relative', overflow: 'hidden' }}>
           <div style={{ position: 'absolute', top: '-20px', right: '-20px', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '50%', width: '150px', height: '150px', zIndex: 0 }}></div>
           <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(59, 130, 246, 0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-green-main)', marginBottom: '20px' }}>
                <MousePointerClick size={28} />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '12px' }}>Thermal Mapping</h3>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px', lineHeight: '1.6' }}>
                Visualize live user behavior. Analyze deep-scroll mechanics and interactive click heatmaps instantly rendered over your domain architecture.
              </p>
              
              <Link to="/admin/heatmaps" className="btn btn-outline" style={{ marginTop: 'auto', alignSelf: 'flex-start', textDecoration: 'none' }}>
                Launch Tracker <ArrowRight size={16} />
              </Link>
           </div>
        </div>
        )}

        {/* Email Marketing Module */}
        {hasAccess('email') && (
        <div className="glass-panel" style={{ padding: '30px', position: 'relative', overflow: 'hidden' }}>
           <div style={{ position: 'absolute', top: '-20px', right: '-20px', background: 'rgba(147, 51, 234, 0.05)', borderRadius: '50%', width: '150px', height: '150px', zIndex: 0 }}></div>
           <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.1), rgba(16, 185, 129, 0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-purple-main)', marginBottom: '20px' }}>
                <Mail size={28} />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '12px' }}>Broadcast Network</h3>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px', lineHeight: '1.6' }}>
                Construct highly-persuasive email campaigns physically dispatched via our secure backend. Track real-time open rates and conversion throughput.
              </p>
              
              <Link to="/admin/email" className="btn btn-outline" style={{ marginTop: 'auto', alignSelf: 'flex-start', textDecoration: 'none' }}>
                Launch Broadcast <ArrowRight size={16} />
              </Link>
           </div>
        </div>
        )}

        {/* AI Content Module */}
        {hasAccess('content') && (
        <div className="glass-panel" style={{ padding: '30px', position: 'relative', overflow: 'hidden' }}>
           <div style={{ position: 'absolute', top: '-20px', right: '-20px', background: 'rgba(234, 179, 8, 0.05)', borderRadius: '50%', width: '150px', height: '150px', zIndex: 0 }}></div>
           <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.1), rgba(239, 68, 68, 0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#eab308', marginBottom: '20px' }}>
                <MousePointerClick size={28} />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '12px' }}>AI Content Studio</h3>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px', lineHeight: '1.6' }}>
                Generative NLP optimization engine. Analyze semantic keyword density and calculate competitor SERP thresholds in real-time as you write.
              </p>
              
              <Link to="/admin/content" className="btn btn-outline" style={{ marginTop: 'auto', alignSelf: 'flex-start', textDecoration: 'none' }}>
                Launch Studio <ArrowRight size={16} />
              </Link>
           </div>
        </div>
        )}

        {/* Social Logistics Module */}
        {hasAccess('social') && (
        <div className="glass-panel" style={{ padding: '30px', position: 'relative', overflow: 'hidden' }}>
           <div style={{ position: 'absolute', top: '-20px', right: '-20px', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '50%', width: '150px', height: '150px', zIndex: 0 }}></div>
           <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(16, 185, 129, 0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-blue-main)', marginBottom: '20px' }}>
                <Share2 size={28} />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '12px' }}>Social Command Center</h3>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px', lineHeight: '1.6' }}>
                Manage omnichannel brand distribution. Queue visual payloads across Instagram, LinkedIn, and X through predictive scheduling.
              </p>
              
              <Link to="/admin/social" className="btn btn-outline" style={{ marginTop: 'auto', alignSelf: 'flex-start', textDecoration: 'none' }}>
                Launch Command <ArrowRight size={16} />
              </Link>
           </div>
        </div>
        )}

        {/* Billing Module */}
        {hasAccess('billing') && (
        <div className="glass-panel" style={{ padding: '30px', position: 'relative', overflow: 'hidden' }}>
           <div style={{ position: 'absolute', top: '-20px', right: '-20px', background: 'rgba(0,0,0,0.05)', borderRadius: '50%', width: '150px', height: '150px', zIndex: 0 }}></div>
           <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(0,0,0,0.05), rgba(0,0,0,0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-main)', marginBottom: '20px' }}>
                <CreditCard size={28} />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '12px' }}>Billing & SaaS Limits</h3>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px', lineHeight: '1.6' }}>
                Upgrade your Multi-Tenant SaaS tier via Stripe to unlock global features.
              </p>
              
              <Link to="/admin/billing" className="btn btn-outline" style={{ marginTop: 'auto', alignSelf: 'flex-start', textDecoration: 'none' }}>
                Manage Account <ArrowRight size={16} />
              </Link>
           </div>
        </div>
        )}

      </div>

      {/* Integration Status (Live Edge) */}
      <div style={{ marginTop: '40px', padding: '24px', background: 'white', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(59, 130, 246, 0.1))', color: 'var(--color-green-main)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <div style={{ fontWeight: 700, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Supabase Auth Endpoint <span style={{ background: '#10B981', width: '8px', height: '8px', borderRadius: '50%' }}></span>
            </div>
            <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
              {activeClients.length > 0 
                ? `CONNECTED: Secure JWT Tunnel established. ${activeClients.length} properties managed.` 
                : 'Pinging Supabase REST API...'}
            </div>
          </div>
        </div>
        <div style={{ padding: '8px 16px', fontSize: '0.9rem', color: '#10B981', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)', fontWeight: 600 }}>
           Cloud Synchronized
        </div>
      </div>

    </div>
  );
};

export default AdminHub;
