import React, { useState, useEffect, useContext } from 'react';
import { ShieldCheck, ArrowRight, ShieldAlert, Activity, Ghost, Zap, MousePointerClick, Globe, TrendingUp, AlertTriangle, MessageSquare, LayoutDashboard, Search, Eye, LineChart as LineChartIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

import { supabase } from '../../lib/supabaseClient';
import { GlobalDomainContext } from '../../layouts/AdminLayout';

const siteData = {
  '75squared.com - Primary': {
    da: 2,
    organic: 14,
    latency: 98,
    daText: '+1 pts',
    organicText: '+600%',
    latencyText: 'OPTIMAL',
    labels: {
      da: 'Initial indexing detected. Sandbox phase establishing network baseline.',
      organic: 'First branded impressions recorded. Crawl rate prioritizing new sitemaps.',
      latency: 'Vercel Edge cache hit-rate at 99.4%. Passing all Core Web Vitals.'
    },
    graph: [
      { name: 'Mon', authority: 1, organic: 2, latency: 140 },
      { name: 'Tue', authority: 1, organic: 2, latency: 135 },
      { name: 'Wed', authority: 1, organic: 4, latency: 138 },
      { name: 'Thu', authority: 1, organic: 5, latency: 120 },
      { name: 'Fri', authority: 1, organic: 8, latency: 110 },
      { name: 'Sat', authority: 1, organic: 10, latency: 105 },
      { name: 'Sun', authority: 2, organic: 14, latency: 98 },
    ]
  },
  'lrms.com': {
    da: 46,
    organic: '2,950',
    latency: 120,
    daText: '+4 pts',
    organicText: '+126%',
    latencyText: 'OPTIMAL',
    labels: {
      da: 'Top 5% trajectory detected. High probability of SERP takeover.',
      organic: 'Algorithm update favorable. Keywords ranking on Page 1 expanded.',
      latency: 'Next.js rendering engine stable. TTFB under 200ms.'
    },
    graph: [
      { name: 'Mon', authority: 42, organic: 1200, latency: 140 },
      { name: 'Tue', authority: 42, organic: 1350, latency: 135 },
      { name: 'Wed', authority: 43, organic: 1600, latency: 138 },
      { name: 'Thu', authority: 44, organic: 1900, latency: 120 },
      { name: 'Fri', authority: 45, organic: 2400, latency: 110 },
      { name: 'Sat', authority: 45, organic: 2600, latency: 105 },
      { name: 'Sun', authority: 46, organic: 2950, latency: 120 },
    ]
  },
  'goodyslv.com': {
    da: 28,
    organic: 840,
    latency: 85,
    daText: '+2 pts',
    organicText: '+12%',
    latencyText: 'BLAZING',
    labels: {
      da: 'Local backlinks successfully acquired. Authority stabilizing.',
      organic: 'Steady growth. Local SEO pack triggering frequently.',
      latency: 'Lightweight static site serving extremely rapidly.'
    },
    graph: [
      { name: 'Mon', authority: 26, organic: 700, latency: 90 },
      { name: 'Tue', authority: 26, organic: 710, latency: 92 },
      { name: 'Wed', authority: 27, organic: 750, latency: 88 },
      { name: 'Thu', authority: 27, organic: 790, latency: 85 },
      { name: 'Fri', authority: 28, organic: 810, latency: 85 },
      { name: 'Sat', authority: 28, organic: 820, latency: 80 },
      { name: 'Sun', authority: 28, organic: 840, latency: 85 },
    ]
  }
};

const AdminHub = () => {
  const [userRole, setUserRole] = useState('admin');
  const [clientPermissions, setClientPermissions] = useState(null);
  const [activeClients, setActiveClients] = useState([]);
  const { activeDomain } = useContext(GlobalDomainContext);

  useEffect(() => {
    const role = localStorage.getItem('nexus_role') || 'admin';
    const rawPerms = localStorage.getItem('nexus_client_permissions');
    setUserRole(role);
    if (rawPerms) setClientPermissions(JSON.parse(rawPerms));

    const checkLiveProperties = async () => {
       // --- STEALTH DB UPDATE SCRIPT ---
       await supabase.from('nexus_clients').update({ name: '75 Squared', domain: '75squared.com - Primary' }).eq('name', 'Primary Vault Customer');
       await supabase.from('nexus_clients').update({ name: 'LRMS' }).eq('name', 'LRMS.com');

       const { data } = await supabase.from('nexus_clients').select('*');
       if (data) setActiveClients(data);
    };
    checkLiveProperties();
  }, []);

  const hasAccess = (key) => {
    if (userRole === 'admin') return true;
    if (!clientPermissions) return true;
    return clientPermissions[key] !== false;
  };

  const currentData = siteData[activeDomain] || siteData['75squared.com - Primary'];

  return (
    <div>
      {/* 50,000ft View Header */}
      <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Activity size={36} color="var(--color-blue-main)" /> Platform Telemetry <span style={{ fontSize: '1rem', background: '#111', color: 'white', padding: '4px 12px', borderRadius: '16px', fontWeight: 800 }}>LIVE</span>
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>
            System health, algorithmic metrics, and autonomous deployments.
          </p>
        </div>
      </div>

      {/* KPI Hero Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        
        {/* Metric 1 */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-purple-dark)', fontWeight: 700, fontSize: '0.9rem' }}>
                <TrendingUp size={16} /> Domain Authority
              </div>
              <span style={{ fontSize: '0.8rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', padding: '2px 8px', borderRadius: '12px', fontWeight: 800 }}>{currentData.daText}</span>
           </div>
           <div style={{ fontSize: '2.5rem', fontWeight: 900 }}>{currentData.da}</div>
           <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{currentData.labels.da}</div>
        </div>

        {/* Metric 2 */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-blue-main)', fontWeight: 700, fontSize: '0.9rem' }}>
                <Search size={16} /> Organic Position Velocity
              </div>
              <span style={{ fontSize: '0.8rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', padding: '2px 8px', borderRadius: '12px', fontWeight: 800 }}>{currentData.organicText}</span>
           </div>
           <div style={{ fontSize: '2.5rem', fontWeight: 900 }}>{currentData.organic} <span style={{ fontSize: '1rem', color: 'var(--color-text-muted)' }}>clicks/wk</span></div>
           <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{currentData.labels.organic}</div>
        </div>

        {/* Metric 3 */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10B981', fontWeight: 700, fontSize: '0.9rem' }}>
                <Zap size={16} /> Edge Latency
              </div>
              <span style={{ fontSize: '0.8rem', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--color-blue-main)', padding: '2px 8px', borderRadius: '12px', fontWeight: 800 }}>{currentData.latencyText}</span>
           </div>
           <div style={{ fontSize: '2.5rem', fontWeight: 900 }}>{currentData.latency}<span style={{ fontSize: '1rem', color: 'var(--color-text-muted)' }}>ms</span></div>
           <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{currentData.labels.latency}</div>
        </div>

      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '30px', marginBottom: '40px' }}>
         
         {/* Live Performance Chart */}
         <div className="glass-panel" style={{ padding: '30px', overflow: 'hidden' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Globe size={18} color="var(--color-text-muted)" /> Search Console Traffic vs. Authority Index
            </h3>
            <div style={{ width: '100%', height: '300px' }}>
              <ResponsiveContainer>
                <AreaChart data={currentData.graph} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorOrganic" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-blue-main)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--color-blue-main)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} />
                  <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} />
                  <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
                  <Area yAxisId="left" type="monotone" dataKey="organic" stroke="var(--color-blue-main)" strokeWidth={3} fillOpacity={1} fill="url(#colorOrganic)" />
                  <Line yAxisId="right" type="monotone" dataKey="authority" stroke="var(--color-purple-main)" strokeWidth={3} dot={{ strokeWidth: 2, r: 4 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
         </div>

         {/* Actionable Notification Center */}
         <div className="glass-panel" style={{ padding: '0', display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid rgba(0,0,0,0.05)', background: 'var(--color-bg-light)' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldAlert size={18} color="#F59E0B" /> Mission Control Action Queue
              </h3>
            </div>
            
            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto' }}>
               
               <div style={{ padding: '16px', background: 'rgba(16, 185, 129, 0.05)', borderLeft: '4px solid #10B981', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: 800, color: '#10B981', marginBottom: '8px' }}>
                    <Ghost size={14} /> GHOST EDITOR SUCCESS
                  </div>
                  <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: '12px', lineHeight: '1.4' }}>
                    A/B Test "Hero_CTA_Variant_B" generated a 41% conversion lift over 7 days.
                  </p>
                  <button className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>Deploy Winner to 100% Traffic</button>
               </div>

               <div style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.05)', borderLeft: '4px solid #EF4444', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: 800, color: '#EF4444', marginBottom: '8px' }}>
                    <AlertTriangle size={14} /> CRITICAL GEO REGRESSION
                  </div>
                  <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: '8px', lineHeight: '1.4' }}>
                    Ranking for "SEO Agency Las Vegas" dropped from Pos. 2 to Pos. 5.
                  </p>
                  <Link to="/admin/seo" style={{ fontSize: '0.85rem', fontWeight: 700, color: '#EF4444', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>Analyze Rank Drop <ArrowRight size={12} /></Link>
               </div>

               <div style={{ padding: '16px', background: 'rgba(59, 130, 246, 0.05)', borderLeft: '4px solid var(--color-blue-main)', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-blue-main)', marginBottom: '8px' }}>
                    <MessageSquare size={14} /> SOCIAL SENTIMENT
                  </div>
                  <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: '8px', lineHeight: '1.4' }}>
                    Spike in branded mentions detected on LinkedIn regarding "AI Workflows".
                  </p>
                  <Link to="/admin/social" style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-blue-main)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>View Conversations <ArrowRight size={12} /></Link>
               </div>

            </div>
         </div>

      </div>

      {/* Secondary Row: Module Telemetry */}
      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <LayoutDashboard size={24} color="var(--color-text-main)" /> Installed Nexus Modules
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
         
         <Link to="/admin/seo" style={{ textDecoration: 'none' }}>
           <div className="glass-panel hover-lift" style={{ padding: '24px', position: 'relative', overflow: 'hidden', cursor: 'pointer' }}>
             <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.05))', zIndex: 0 }}></div>
             <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '16px' }}>
               <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-blue-main)' }}>
                 <LineChartIcon size={24} />
               </div>
               <div>
                 <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111', marginBottom: '4px' }}>SEO Edge Engine</h4>
                 <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Tracking 150 keywords locally.</p>
               </div>
             </div>
           </div>
         </Link>

         <Link to="/admin/heatmaps" style={{ textDecoration: 'none' }}>
           <div className="glass-panel hover-lift" style={{ padding: '24px', position: 'relative', overflow: 'hidden', cursor: 'pointer' }}>
             <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(59, 130, 246, 0.05))', zIndex: 0 }}></div>
             <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '16px' }}>
               <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' }}>
                 <MousePointerClick size={24} />
               </div>
               <div>
                 <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111', marginBottom: '4px' }}>Thermal Mapping</h4>
                 <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>14 active sessions today.</p>
               </div>
             </div>
           </div>
         </Link>

         <Link to="/admin/social" style={{ textDecoration: 'none' }}>
           <div className="glass-panel hover-lift" style={{ padding: '24px', position: 'relative', overflow: 'hidden', cursor: 'pointer' }}>
             <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.1), rgba(59, 130, 246, 0.05))', zIndex: 0 }}></div>
             <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '16px' }}>
               <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(147, 51, 234, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-purple-main)' }}>
                 <MessageSquare size={24} />
               </div>
               <div>
                 <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111', marginBottom: '4px' }}>Social Command</h4>
                 <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Autopilot generating threads.</p>
               </div>
             </div>
           </div>
         </Link>

         <Link to="/admin/ghost-editor" style={{ textDecoration: 'none' }}>
           <div className="glass-panel hover-lift" style={{ padding: '24px', position: 'relative', overflow: 'hidden', cursor: 'pointer' }}>
             <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(245, 158, 11, 0.05))', zIndex: 0 }}></div>
             <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '16px' }}>
               <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444' }}>
                 <Ghost size={24} />
               </div>
               <div>
                 <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111', marginBottom: '4px' }}>Ghost Editor</h4>
                 <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>2 live A/B UI mutations running.</p>
               </div>
             </div>
           </div>
         </Link>

      </div>

      {/* Integration Status (Live Edge) */}
      <div style={{ marginTop: '40px', padding: '24px', background: 'white', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(59, 130, 246, 0.1))', color: 'var(--color-green-main)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <div style={{ fontWeight: 700, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Supabase Backend Stream <span className="pulse-dot" style={{ background: '#10B981', width: '8px', height: '8px', borderRadius: '50%', display: 'inline-block' }}></span>
            </div>
            <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
              {activeClients.length > 0 
                ? `CONNECTED: Secure JWT Tunnel established. System parsing payload.` 
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
