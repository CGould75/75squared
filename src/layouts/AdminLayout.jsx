import React, { useState, useEffect, createContext } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, LineChart, MousePointerClick, Mail, Settings, LogOut, Search, PanelLeftClose, PanelLeftOpen, Shield, User, FileText, CreditCard, Share2, Ghost, Sparkles, Command, Blocks, ShieldAlert, Activity, SlidersHorizontal, Users, AlertTriangle, MessageSquare, Globe, Network } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export const GlobalDomainContext = createContext();

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userRole, setUserRole] = useState('admin');
  const [clientName, setClientName] = useState('75 Squared');
  const [isSuperAdminImpersonating, setIsSuperAdminImpersonating] = useState(false);
  const [clientPermissions, setClientPermissions] = useState(null);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Phase 14: Global Domain Sub-Routing Architectures
  const [activeDomain, setActiveDomain] = useState('75squared.com - Primary');
  const [availableDomains, setAvailableDomains] = useState([]);

  useEffect(() => {
    const fetchDomains = async () => {
      const { data } = await supabase.from('nexus_clients').select('*');
      if (data) setAvailableDomains(data);
    };
    fetchDomains();

    // 1. Establish Secure Connection with Supabase Vault
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.warn('Invalid cryptographic session. Redirecting to Login vault.');
        navigate('/admin/login');
      }
    };
    checkSession();

    // 2. Hydrate local UI permission overrides
    const role = localStorage.getItem('nexus_role') || 'admin';
    const cName = localStorage.getItem('nexus_client') || '75 Squared';
    const isImpersonating = localStorage.getItem('nexus_super_admin_active') === 'true';
    const rawPerms = localStorage.getItem('nexus_client_permissions');
    
    setUserRole(role);
    setClientName(cName);
    setIsSuperAdminImpersonating(isImpersonating);
    if (rawPerms) {
      setClientPermissions(JSON.parse(rawPerms));
    }

    // 3. Mount Global Command/NLP Listener
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsCommandOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // 4. Mount Supabase Auth State Change Listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        navigate('/admin/login');
      }
    });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('nexus_role');
    localStorage.removeItem('nexus_client');
    localStorage.removeItem('nexus_super_admin_active');
    localStorage.removeItem('nexus_client_permissions');
    navigate('/admin/login');
  };
  const handleRestoreGodMode = () => {
    localStorage.setItem('nexus_role', 'admin');
    localStorage.setItem('nexus_client', '75 Squared (Master)');
    localStorage.removeItem('nexus_super_admin_active');
    localStorage.removeItem('nexus_client_permissions');
    window.location.reload();
  };

  const navItems = [
    { name: 'Dashboard Home', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Client Management', path: '/admin/clients', icon: <Users size={20} />, adminOnly: true },
    { name: 'Security Center', path: '/admin/security', icon: <ShieldAlert size={20} />, adminOnly: true },
    { name: 'System Errors & Logs', path: '/admin/system-logs', icon: <Activity size={20} />, key: 'systemLogs' },
    { name: 'Website Editor', path: '/admin/ghost-editor', icon: <Ghost size={20} />, key: 'ghostEditor' },
    { name: 'Dynamic UI Engine', path: '/admin/liquid-ui', icon: <Sparkles size={20} />, key: 'liquidUI' },
    { name: 'Global Settings', path: '/admin/constraints', icon: <SlidersHorizontal size={20} />, key: 'constraints' },
    { name: 'Omnichannel & Reviews', path: '/admin/reputation', icon: <MessageSquare size={20} />, key: 'reputation' },
    { name: 'Local Listings Sync', path: '/admin/directory-sync', icon: <Globe size={20} />, key: 'directory' },
    { name: 'SEO & Analytics', path: '/admin/seo', icon: <LineChart size={20} />, key: 'seo' },
    { name: 'Rank Tracker Engine', path: '/admin/rank-tracker', icon: <Activity size={20} />, key: 'rank-tracker' },
    { name: 'AI Blog Writer', path: '/admin/content', icon: <FileText size={20} />, key: 'content' },
    { name: 'Heatmaps & Replays', path: '/admin/heatmaps', icon: <MousePointerClick size={20} />, key: 'heatmaps' },
    { name: 'Email Marketing', path: '/admin/email', icon: <Mail size={20} />, key: 'email' },
    { name: 'Social Media Planner', path: '/admin/social', icon: <Share2 size={20} />, key: 'social' },
    { name: 'App Integrations', path: '/admin/integrations', icon: <Blocks size={20} />, key: 'integrations' },
    { name: 'Billing & Subscriptions', path: '/admin/billing', icon: <CreditCard size={20} />, key: 'billing' },
  ];

  // Mathematical DOM restriction
  const filteredNavItems = navItems.filter(item => {
    if (userRole === 'client') {
      if (item.adminOnly) return false;
      if (item.key && clientPermissions && clientPermissions[item.key] === false) return false;
    }
    return true;
  });

  const handleSimulateNLPExecution = (route) => {
    setIsCommandOpen(false);
    navigate(route);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Impersonation Banner */}
      {isSuperAdminImpersonating && (
        <div style={{ background: '#F59E0B', color: 'white', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', fontWeight: 700, zIndex: 9999 }}>
          <AlertTriangle size={18} />
          <span>[!] Action Required: You are currently impersonating {clientName} and viewing their mathematically restricted dashboard.</span>
          <button onClick={handleRestoreGodMode} style={{ marginLeft: '16px', background: 'white', color: '#F59E0B', border: 'none', padding: '6px 16px', borderRadius: '20px', fontWeight: 800, cursor: 'pointer' }}>
            Restore Super Admin God-Mode
          </button>
        </div>
      )}

      <div style={{ display: 'flex', flexGrow: 1, background: 'var(--color-bg-light)', overflowX: 'hidden' }}>
      
      {/* NLP Command Bar Modal Overlay */}
      {isCommandOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '15vh' }}>
           <div className="fade-in" style={{ width: '100%', maxWidth: '650px', background: 'white', borderRadius: '16px', boxShadow: '0 25px 50px rgba(0,0,0,0.25)', overflow: 'hidden' }}>
              <div style={{ padding: '24px', display: 'flex', gap: '16px', alignItems: 'center', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                 <Sparkles size={24} color="var(--color-blue-main)" />
                 <input 
                   autoFocus
                   type="text" 
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   placeholder="Ask Nexus in natural language..." 
                   style={{ width: '100%', fontSize: '1.2rem', border: 'none', outline: 'none', background: 'transparent' }}
                 />
                 <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)', background: 'rgba(0,0,0,0.05)', padding: '4px 8px', borderRadius: '6px' }}>ESC</div>
              </div>
              
              <div style={{ padding: '24px', background: 'var(--color-bg-light)' }}>
                 <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '16px' }}>Suggested Actions</div>
                 
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <button onClick={() => handleSimulateNLPExecution('/admin/heatmaps')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'white', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '12px', cursor: 'pointer', textAlign: 'left' }}>
                       <span style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.95rem', fontWeight: 500 }}><MousePointerClick size={18} color="var(--color-green-main)"/> "Turn off the heatmap tracker for Goodys Popcorn"</span>
                       <ArrowRight size={16} color="var(--color-text-muted)"/>
                    </button>
                    <button onClick={() => handleSimulateNLPExecution('/admin/email')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'white', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '12px', cursor: 'pointer', textAlign: 'left' }}>
                       <span style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.95rem', fontWeight: 500 }}><Mail size={18} color="var(--color-purple-main)"/> "Draft an email to all users who opened the last broadcast"</span>
                       <ArrowRight size={16} color="var(--color-text-muted)"/>
                    </button>
                    <button onClick={() => handleSimulateNLPExecution('/admin/ghost-editor')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'white', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '12px', cursor: 'pointer', textAlign: 'left' }}>
                       <span style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.95rem', fontWeight: 500 }}><Ghost size={18} color="var(--color-blue-main)"/> "Are there any newly flagged failing metrics on the landing page?"</span>
                       <ArrowRight size={16} color="var(--color-text-muted)"/>
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside style={{
        width: '280px',
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(16px)',
        borderRight: '1px solid rgba(0,0,0,0.05)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0, bottom: 0, left: sidebarOpen ? 0 : '-280px',
        zIndex: 100,
        transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        <div style={{ padding: '30px 24px', borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800 }}>
              <span className="text-gradient">75²</span>
              <span style={{ marginLeft: '4px', color: 'var(--color-text-main)' }}>Nexus</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '4px', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{clientName} Workspace</div>
          </div>
          <button onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}>
             <PanelLeftClose size={20} />
          </button>
        </div>

        <nav style={{ padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '8px', flexGrow: 1 }}>
          {filteredNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.name} to={item.path} 
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', textDecoration: 'none',
                  background: isActive ? 'linear-gradient(135deg, rgba(147, 51, 234, 0.1), rgba(59, 130, 246, 0.1))' : 'transparent',
                  color: isActive ? 'var(--color-purple-dark)' : 'var(--color-text-muted)',
                  fontWeight: isActive ? 600 : 500, transition: 'all 0.2s ease'
                }}
              >
                {item.icon} {item.name}
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: '24px 16px', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', fontWeight: 500 }} onClick={handleLogout}>
            <LogOut size={20} /> Sign Out Domain
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ 
        flexGrow: 1, 
        marginLeft: sidebarOpen ? '280px' : '0', 
        padding: '40px',
        transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        width: '100%'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {!sidebarOpen && (
              <button onClick={() => setSidebarOpen(true)} style={{ background: 'white', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '12px', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <PanelLeftOpen size={20} color="var(--color-text-main)" />
              </button>
            )}
            
            {/* The entrypoint to the NLP Command Bar */}
            <div 
              onClick={() => setIsCommandOpen(true)}
              style={{ position: 'relative', width: '400px', background: 'white', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '12px', padding: '12px 16px', display: 'flex', alignItems: 'center', cursor: 'text', gap: '12px' }}
            >
              <Sparkles size={18} color="var(--color-blue-main)" />
              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>Ask Nexus anything...</span>
              <div style={{ position: 'absolute', right: '12px', display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(0,0,0,0.05)', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)' }}>
                <Command size={12} /> K
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            
            {/* Global Context Switcher */}
            <div style={{ borderRight: '1px solid rgba(0,0,0,0.1)', paddingRight: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
               <Network size={16} color="var(--color-text-muted)" />
               <select 
                 value={activeDomain}
                 onChange={(e) => setActiveDomain(e.target.value)}
                 style={{ background: 'transparent', border: 'none', fontWeight: 800, fontSize: '0.9rem', color: 'var(--color-text-main)', outline: 'none', cursor: 'pointer' }}
               >
                 {availableDomains.map(d => (
                   <option key={d.id} value={d.domain}>{d.name} ({d.domain})</option>
                 ))}
               </select>
            </div>

            {userRole === 'admin' ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(147, 51, 234, 0.1)', padding: '8px 16px', borderRadius: '20px', color: 'var(--color-purple-dark)', fontWeight: 700, fontSize: '0.85rem' }}>
                <Shield size={16} /> Super Admin
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(59, 130, 246, 0.1)', padding: '8px 16px', borderRadius: '20px', color: 'var(--color-blue-main)', fontWeight: 700, fontSize: '0.85rem' }}>
                <User size={16} /> Multi-Tenant Client
              </div>
            )}
            <button style={{ background: 'white', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '12px', padding: '10px' }}><Settings size={20} color="var(--color-text-muted)" /></button>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-purple-main), var(--color-blue-main))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>{userRole === 'admin' ? 'CG' : clientName.substring(0, 2).toUpperCase()}</div>
          </div>
        </div>

        {/* Dynamic Outlet bounded by Global Context */}
        <GlobalDomainContext.Provider value={{ activeDomain, setActiveDomain }}>
           <Outlet />
        </GlobalDomainContext.Provider>
      </main>
      </div>
    </div>
  );
};

export default AdminLayout;
