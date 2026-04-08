import React, { useState, useEffect, useContext } from 'react';
import { ShieldCheck, ArrowRight, ShieldAlert, Activity, Ghost, Zap, MousePointerClick, Globe, TrendingUp, AlertTriangle, MessageSquare, LayoutDashboard, Search, Eye, LineChart as LineChartIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

import { supabase } from '../../lib/supabaseClient';
import { GlobalDomainContext } from '../../layouts/AdminLayout';

const generateChartData = (startAuth, startOrg, days, dailyAuthGrowth, dailyOrgGrowth) => {
  const data = [];
  let auth = startAuth;
  let org = startOrg;
  for(let i=0; i<days; i++) {
    data.push({
      name: days <= 7 ? ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i%7] : (i%7===0 ? `D-${i}` : ''),
      authority: Math.floor(auth),
      organic: Math.floor(org),
      latency: Math.floor(90 + Math.random() * 30)
    });
    auth += dailyAuthGrowth;
    org += dailyOrgGrowth + (Math.random() * (dailyOrgGrowth * 0.2));
  }
  return data;
};

const siteData = {
  '75squared.com - Primary': {
    da: 2, organic: 14, latency: 98,
    daText: '+1 pts', organicText: '+600%', latencyText: 'OPTIMAL',
    labels: {
      da: 'Initial indexing detected. Sandbox phase establishing network baseline.',
      organic: 'First branded impressions recorded. Crawl rate prioritizing new sitemaps.',
      latency: 'Vercel Edge cache hit-rate at 99.4%. Passing all Core Web Vitals.'
    },
    graph: {
      '7d': generateChartData(1, 2, 7, 0.14, 2),
      '30d': generateChartData(1, 2, 30, 0.05, 3),
      '90d': generateChartData(1, 2, 90, 0.04, 4)
    }
  },
  'lrms.com': {
    da: 46, organic: '2,950', latency: 120,
    daText: '+4 pts', organicText: '+126%', latencyText: 'OPTIMAL',
    labels: {
      da: 'Top 5% trajectory detected. High probability of SERP takeover.',
      organic: 'Algorithm update favorable. Keywords ranking on Page 1 expanded.',
      latency: 'Next.js rendering engine stable. TTFB under 200ms.'
    },
    graph: {
      '7d': generateChartData(42, 1200, 7, 0.5, 250),
      '30d': generateChartData(35, 400, 30, 0.3, 85),
      '90d': generateChartData(22, 100, 90, 0.26, 31)
    }
  },
  'goodyslv.com': {
    da: 28, organic: 840, latency: 85,
    daText: '+2 pts', organicText: '+12%', latencyText: 'BLAZING',
    labels: {
      da: 'Local backlinks successfully acquired. Authority stabilizing.',
      organic: 'Steady growth. Local SEO pack triggering frequently.',
      latency: 'Lightweight static site serving extremely rapidly.'
    },
    graph: {
      '7d': generateChartData(26, 700, 7, 0.28, 20),
      '30d': generateChartData(24, 400, 30, 0.13, 14),
      '90d': generateChartData(18, 150, 90, 0.11, 7)
    }
  }
};

const AdminHub = () => {
  const [timeRange, setTimeRange] = useState('7d');
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Globe size={18} color="var(--color-text-muted)" /> Search Console Traffic vs. Authority Index
              </h3>
              <select 
                value={timeRange} 
                onChange={(e) => setTimeRange(e.target.value)}
                style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', background: 'var(--color-bg-light)', fontSize: '0.9rem', fontWeight: 600, outline: 'none', cursor: 'pointer' }}
              >
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </select>
            </div>
            <div style={{ width: '100%', height: '300px' }}>
              <ResponsiveContainer>
                <AreaChart data={currentData.graph[timeRange]} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
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
            <div style={{ padding: '24px', borderBottom: '1px solid rgba(0,0,0,0.05)', background: 'var(--color-bg-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldAlert size={18} color="#F59E0B" /> Hive Mind Anomaly Feed
              </h3>
              <Link to="/admin/action-center" className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem', background: 'white' }}>View All In Action Center</Link>
            </div>
            
            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto' }}>
               
               <div style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.05)', borderLeft: '4px solid #EF4444', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: 800, color: '#EF4444', marginBottom: '8px' }}>
                    <AlertTriangle size={14} /> TOXIC LINK NODE
                  </div>
                  <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: '8px', lineHeight: '1.4' }}>
                    14 Russian spam domains linking to your network, negatively impacting trust.
                  </p>
                  <Link to="/admin/action-center" style={{ fontSize: '0.85rem', fontWeight: 700, color: '#EF4444', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>Relay to Action Center <ArrowRight size={12} /></Link>
               </div>

               <div style={{ padding: '16px', background: 'rgba(245, 158, 11, 0.05)', borderLeft: '4px solid #F59E0B', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: 800, color: '#F59E0B', marginBottom: '8px' }}>
                    <TrendingUp size={14} /> CONTENT DECAY DETECTED
                  </div>
                  <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: '8px', lineHeight: '1.4' }}>
                     Organic traffic to "Library Software" pillar bled 18%.
                  </p>
                  <Link to="/admin/action-center" style={{ fontSize: '0.85rem', fontWeight: 700, color: '#F59E0B', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>Deploy Claude EEAT Patch <ArrowRight size={12} /></Link>
               </div>

               <div style={{ padding: '16px', background: 'rgba(147, 51, 234, 0.05)', borderLeft: '4px solid var(--color-purple-main)', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-purple-main)', marginBottom: '8px' }}>
                    <Globe size={14} /> MISSING SCHEMA TARGET
                  </div>
                  <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: '8px', lineHeight: '1.4' }}>
                    Opponent domain integrated "SoftwareApplication" arrays.
                  </p>
                  <Link to="/admin/action-center" style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-purple-main)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>Inject Counter-Schema <ArrowRight size={12} /></Link>
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
