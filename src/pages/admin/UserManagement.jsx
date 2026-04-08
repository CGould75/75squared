import React, { useState } from 'react';
import { Users, Shield, ShieldCheck, Key, Lock, Unlock, Search, Plus, UserPlus, ServerCrash, Command } from 'lucide-react';
import SEOHead from '../../components/SEOHead';

export default function UserManagement() {
  const [users, setUsers] = useState([
    { id: 'usr_1', email: 'chris@75squared.com', role: 'Global Super Admin', domain: 'ALL_DOMAINS', status: 'Active', mfa: true },
    { id: 'usr_2', email: 'client@lrms.com', role: 'Client Admin', domain: 'lrms.com', status: 'Active', mfa: false },
    { id: 'usr_3', email: 'writer@goodyslv.com', role: 'Editor', domain: 'goodyslv.com', status: 'Active', mfa: true },
    { id: 'usr_4', email: 'investor@75squared.com', role: 'Viewer (Read-Only)', domain: 'ALL_DOMAINS', status: 'Suspended', mfa: false }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ email: '', role: 'Viewer (Read-Only)', domain: '' });

  const getRoleBadge = (role) => {
     if(role === 'Global Super Admin') return <span style={{ background: '#10B981', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800 }}><ShieldCheck size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom'}} /> {role}</span>;
     if(role === 'Client Admin') return <span style={{ background: 'var(--color-blue-main)', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800 }}>{role}</span>;
     if(role === 'Editor') return <span style={{ background: 'var(--color-purple-main)', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800 }}>{role}</span>;
     return <span style={{ background: '#E5E7EB', color: 'var(--color-text-muted)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800 }}>{role}</span>;
  };

  const handleAddUser = (e) => {
     e.preventDefault();
     setUsers([{
        id: `usr_${Math.floor(Math.random() * 1000)}`,
        email: formData.email,
        role: formData.role,
        domain: formData.domain || 'none',
        status: 'Pending Invite',
        mfa: false
     }, ...users]);
     setShowModal(false);
     setFormData({ email: '', role: 'Viewer (Read-Only)', domain: '' });
  };

  const deleteUser = (id) => {
     if(window.confirm("Nuclear destructive action. Instantly revoke all tokens and wipe this user?")) {
        setUsers(users.filter(u => u.id !== id));
     }
  };

  return (
    <div className="fade-in" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <SEOHead title="Super User Configuration" description="Manage RBAC and tenant user schemas." path="/admin/users" />
      
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
           <div className="glass-panel" style={{ width: '500px', background: 'white', padding: '40px' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Command size={24} color="var(--color-blue-main)" /> Platform Provisioning
              </h3>
              <form onSubmit={handleAddUser} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                 <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '8px' }}>System Identifying Email</label>
                    <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', background: 'var(--color-bg-light)', outline: 'none' }} placeholder="name@domain.com" />
                 </div>
                 
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '8px' }}>RBAC Hierarchical Role</label>
                        <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', background: 'var(--color-bg-light)', outline: 'none' }}>
                          <option value="Viewer (Read-Only)">Viewer (Read-Only)</option>
                          <option value="Editor">Editor</option>
                          <option value="Client Admin">Client Admin</option>
                          <option value="Global Super Admin">Global Super Admin</option>
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '8px' }}>Tenant Binding Target</label>
                        <select disabled={formData.role === 'Global Super Admin'} value={formData.role === 'Global Super Admin' ? 'ALL_DOMAINS' : formData.domain} onChange={e => setFormData({...formData, domain: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', background: 'var(--color-bg-light)', outline: 'none' }}>
                          <option value="">Select Domain...</option>
                          <option value="lrms.com">lrms.com</option>
                          <option value="goodyslv.com">goodyslv.com</option>
                          <option value="75squared.com">75squared.com</option>
                        </select>
                    </div>
                 </div>

                 <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                    <button type="button" onClick={() => setShowModal(false)} className="btn hover-lift" style={{ flex: 1, padding: '12px', background: 'var(--color-bg-light)', color: 'var(--color-text-main)', border: 'none', fontWeight: 700, borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                    <button type="submit" className="btn btn-primary" style={{ flex: 2, padding: '12px', border: 'none', fontWeight: 700, borderRadius: '8px', cursor: 'pointer' }}>Generate Access Token</button>
                 </div>
              </form>
           </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Users size={36} color="var(--color-purple-main)" />
            Master User Matrix
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem', maxWidth: '800px' }}>
            Absolute control over all physical humans accessing the Nexus Hive architecture. Enforce robust Role-Based Access Control and strict tenant boundary locking.
          </p>
        </div>
        <div>
          <button onClick={() => setShowModal(true)} className="btn btn-primary" style={{ padding: '14px 24px', fontSize: '1.1rem' }}>
             <UserPlus size={20} /> Provision Identity
          </button>
        </div>
      </div>

      <div className="glass-panel" style={{ flexGrow: 1, padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
         <div style={{ padding: '20px', borderBottom: '1px solid rgba(0,0,0,0.05)', background: 'white', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ flexGrow: 1, position: 'relative' }}>
               <Search size={18} color="var(--color-text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }}/>
               <input type="text" placeholder="Search physical identities by email or UUID..." style={{ width: '100%', padding: '12px 12px 12px 48px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', background: 'var(--color-bg-light)', outline: 'none' }} />
            </div>
            <button className="btn btn-outline" style={{ padding: '12px 20px', background: 'white' }}>Filter Network</button>
         </div>

         <div style={{ flexGrow: 1, overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
               <thead>
                  <tr style={{ background: 'var(--color-bg-light)', borderBottom: '2px solid rgba(0,0,0,0.05)', color: 'var(--color-text-muted)' }}>
                     <th style={{ padding: '16px 20px', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase' }}>UUID</th>
                     <th style={{ padding: '16px 20px', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase' }}>Identity (Email)</th>
                     <th style={{ padding: '16px 20px', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase' }}>Hierarchical Role</th>
                     <th style={{ padding: '16px 20px', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase' }}>Tenant Binding</th>
                     <th style={{ padding: '16px 20px', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase' }}>2FA Auth</th>
                     <th style={{ padding: '16px 20px', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase' }}>Status</th>
                     <th style={{ padding: '16px 20px', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', textAlign: 'right' }}>Destructive Actions</th>
                  </tr>
               </thead>
               <tbody>
                  {users.map(u => (
                     <tr key={u.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.02)', transition: 'background 0.2s', background: u.status === 'Suspended' ? 'rgba(239, 68, 68, 0.02)' : 'white' }}>
                        <td style={{ padding: '20px', fontFamily: 'monospace', color: 'var(--color-text-muted)' }}>{u.id}</td>
                        <td style={{ padding: '20px', fontWeight: 700 }}>{u.email}</td>
                        <td style={{ padding: '20px' }}>{getRoleBadge(u.role)}</td>
                        <td style={{ padding: '20px' }}>
                           {u.domain === 'ALL_DOMAINS' ? (
                              <span style={{ color: 'var(--color-purple-main)', fontWeight: 800 }}>UNRESTRICTED</span>
                           ) : (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: 'var(--color-text-main)' }}>
                                 <Lock size={12}/> {u.domain}
                              </span>
                           )}
                        </td>
                        <td style={{ padding: '20px' }}>
                           {u.mfa ? <ShieldCheck size={18} color="#10B981" /> : <Shield size={18} color="var(--color-text-muted)" />}
                        </td>
                        <td style={{ padding: '20px' }}>
                           <span style={{ color: u.status === 'Active' ? '#10B981' : (u.status === 'Suspended' ? '#EF4444' : '#F59E0B'), fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase' }}>
                              {u.status}
                           </span>
                        </td>
                        <td style={{ padding: '20px', textAlign: 'right' }}>
                           {u.role !== 'Global Super Admin' && (
                             <button onClick={() => deleteUser(u.id)} className="hover-lift" style={{ padding: '8px', background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', border: 'none', borderRadius: '8px', cursor: 'pointer' }} title="Terminate Node">
                                <ServerCrash size={16} />
                             </button>
                           )}
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
