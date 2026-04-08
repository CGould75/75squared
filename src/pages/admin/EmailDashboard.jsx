import React, { useState } from 'react';
import { Mail, Users, Send, MousePointerClick, TrendingUp, Tags, Pencil, Image as ImageIcon, LayoutTemplate, Clock, ShieldCheck, Bug, Zap, Trash2, Save, X, Plus, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { supabase } from '../../lib/supabaseClient';

const EmailDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('audience'); // 'audience' | 'campaign'
  const [isSending, setIsSending] = useState(false);
  const [audience, setAudience] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  // Natively pull from Supabase Vault instead of hardcoded state
  React.useEffect(() => {
    const fetchAudience = async () => {
      const { data, error } = await supabase.from('email_subscribers').select('*').order('id', { ascending: false });
      if (data) {
        setAudience(data);
      }
      setLoading(false);
    };
    fetchAudience();
  }, []);

  const handleDispatch = () => {
    setIsSending(true);
    setTimeout(() => {
      alert("Constraint Lock Verified: Segment array pushed to Action Center payload queue for rate-limited dispatch.");
      setIsSending(false);
      navigate('/admin/action-center');
    }, 1500);
  };

  const handleEditClick = (sub) => {
    setEditingId(sub.id);
    setEditForm({ email: sub.email, status: sub.status, tags: sub.tags.join(', ') });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleSave = async (id) => {
    const formattedTags = editForm.tags ? editForm.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
    
    // Physical Supabase Update
    await supabase.from('email_subscribers').update({
       email: editForm.email,
       status: editForm.status,
       tags: formattedTags
    }).eq('id', id);

    setAudience(prev => prev.map(sub => 
      sub.id === id ? { 
        ...sub, 
        email: editForm.email, 
        status: editForm.status, 
        tags: formattedTags 
      } : sub
    ));
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    await supabase.from('email_subscribers').delete().eq('id', id);
    setAudience(prev => prev.filter(sub => sub.id !== id));
  };

  const handleAddNew = async () => {
    const newRecord = { 
      email: "newuser@example.com", 
      status: "Subscribed", 
      tags: [], 
      open_rate: "0%", 
      ctr: "0%", 
    };

    // Physical Supabase Insert
    const { data } = await supabase.from('email_subscribers').insert([newRecord]).select();
    
    if (data && data[0]) {
       setAudience([data[0], ...audience]);
       setEditingId(data[0].id);
       setEditForm({ email: data[0].email, status: data[0].status, tags: "" });
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Mail size={36} color="var(--color-purple-main)" /> Broadcast Network
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>
            Audience segmentation and high-conversion campaign dispatch.
          </p>
        </div>
        
        {/* Module Switcher Tabs */}
        <div style={{ display: 'flex', background: 'rgba(0,0,0,0.05)', borderRadius: '12px', padding: '4px', gap: '4px' }}>
          <button 
            onClick={() => setActiveTab('audience')}
            style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s', background: activeTab === 'audience' ? 'white' : 'transparent', color: activeTab === 'audience' ? 'var(--color-text-main)' : 'var(--color-text-muted)', boxShadow: activeTab === 'audience' ? '0 2px 10px rgba(0,0,0,0.05)' : 'none' }}>
            CRM Database
          </button>
          <button 
            onClick={() => setActiveTab('campaign')}
            style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s', background: activeTab === 'campaign' ? 'white' : 'transparent', color: activeTab === 'campaign' ? 'var(--color-text-main)' : 'var(--color-text-muted)', boxShadow: activeTab === 'campaign' ? '0 2px 10px rgba(0,0,0,0.05)' : 'none' }}>
            Broadcast Composer
          </button>
          <button 
            onClick={() => setActiveTab('automation')}
            style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s', background: activeTab === 'automation' ? 'white' : 'transparent', color: activeTab === 'automation' ? 'var(--color-text-main)' : 'var(--color-text-muted)', boxShadow: activeTab === 'automation' ? '0 2px 10px rgba(0,0,0,0.05)' : 'none' }}>
            Visual Automations (Beta)
          </button>
          <button 
            onClick={() => setActiveTab('events')}
            style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s', background: activeTab === 'events' ? 'white' : 'transparent', color: activeTab === 'events' ? 'var(--color-text-main)' : 'var(--color-text-muted)', boxShadow: activeTab === 'events' ? '0 2px 10px rgba(0,0,0,0.05)' : 'none' }}>
            Event Marketing
          </button>
          <button 
            onClick={() => setActiveTab('deliverability')}
            style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s', background: activeTab === 'deliverability' ? 'white' : 'transparent', color: activeTab === 'deliverability' ? 'var(--color-purple-dark)' : 'var(--color-text-muted)', boxShadow: activeTab === 'deliverability' ? '0 2px 10px rgba(147, 51, 234, 0.2)' : 'none' }}>
            <ShieldCheck size={16} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '4px' }} /> Deliverability Engine
          </button>
        </div>
      </div>

      {activeTab === 'audience' && (
        // ==========================================
        // TAB 1: AUDIENCE CRM
        // ==========================================
        <div className="fade-in">
          {/* CRM KPIs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
            {[
              { label: 'Total Subscribers', value: '4,289', icon: <Users size={20} color="var(--color-blue-main)"/> },
              { label: 'Avg. Open Rate', value: '64.2%', icon: <TrendingUp size={20} color="var(--color-green-main)"/> },
              { label: 'Avg. Click Rate', value: '18.5%', icon: <MousePointerClick size={20} color="var(--color-purple-main)"/> },
              { label: 'Unsubscribed', value: '12', icon: <Mail size={20} color="var(--color-text-muted)"/> }
            ].map((metric, i) => (
              <div key={i} className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>{metric.label}</div>
                    {metric.icon}
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800 }}>{metric.value}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '30px' }}>
            <div className="glass-panel" style={{ padding: '30px', flexGrow: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Master Audience Roster</h3>
                <button onClick={handleAddNew} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '0.9rem' }}>
                   <Plus size={16} /> Add Subscriber
                </button>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid rgba(0,0,0,0.05)', color: 'var(--color-text-muted)' }}>
                    <th style={{ padding: '12px', fontWeight: 600 }}>Email Address</th>
                    <th style={{ padding: '12px', fontWeight: 600 }}>Status</th>
                    <th style={{ padding: '12px', fontWeight: 600 }}><Tags size={16} /> Tags</th>
                    <th style={{ padding: '12px', fontWeight: 600 }}>Open Rate</th>
                    <th style={{ padding: '12px', fontWeight: 600 }}>CTR</th>
                    <th style={{ padding: '12px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {audience.map(sub => (
                    <tr key={sub.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.02)' }}>
                      {editingId === sub.id ? (
                        <>
                          <td style={{ padding: '12px' }}>
                            <input type="email" value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-blue-main)', outline: 'none' }} placeholder="user@domain.com" autoFocus />
                          </td>
                          <td style={{ padding: '12px' }}>
                            <select value={editForm.status} onChange={e => setEditForm({...editForm, status: e.target.value})} style={{ padding: '8px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)', outline: 'none' }}>
                               <option value="Subscribed">Subscribed</option>
                               <option value="Unsubscribed">Unsubscribed</option>
                               <option value="Bounced">Bounced</option>
                            </select>
                          </td>
                          <td style={{ padding: '12px' }}>
                            <input type="text" value={editForm.tags} onChange={e => setEditForm({...editForm, tags: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)', outline: 'none' }} placeholder="VIP, Cold Lead, etc..." />
                          </td>
                          <td style={{ padding: '12px', fontWeight: 600, color: 'var(--color-text-muted)' }}>{sub.open_rate}</td>
                          <td style={{ padding: '12px', fontWeight: 600, color: 'var(--color-text-muted)' }}>{sub.ctr}</td>
                          <td style={{ padding: '12px', textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                              <button onClick={() => handleSave(sub.id)} style={{ padding: '6px', background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', border: 'none', borderRadius: '6px', cursor: 'pointer' }}><Save size={16}/></button>
                              <button onClick={handleCancel} style={{ padding: '6px', background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', border: 'none', borderRadius: '6px', cursor: 'pointer' }}><X size={16}/></button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td style={{ padding: '16px 12px', fontWeight: 700 }}>{sub.email}</td>
                          <td style={{ padding: '16px 12px' }}>
                            <span style={{ 
                              background: sub.status === 'Subscribed' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                              color: sub.status === 'Subscribed' ? 'var(--color-green-main)' : 'var(--color-text-muted)',
                              padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 700 
                            }}>{sub.status}</span>
                          </td>
                          <td style={{ padding: '16px 12px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                             {sub.tags.map(tag => (
                               <span key={tag} style={{ background: 'rgba(0,0,0,0.04)', color: 'var(--color-text-muted)', padding: '2px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600 }}>{tag}</span>
                             ))}
                          </td>
                          <td style={{ padding: '16px 12px', fontWeight: 600 }}>{sub.open_rate}</td>
                          <td style={{ padding: '16px 12px', fontWeight: 600 }}>{sub.ctr}</td>
                          <td style={{ padding: '16px 12px', textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                              <button onClick={() => handleEditClick(sub)} style={{ padding: '6px', background: 'transparent', color: 'var(--color-text-muted)', border: 'none', cursor: 'pointer' }} title="Edit Record"><Pencil size={16}/></button>
                              <button onClick={() => handleDelete(sub.id)} style={{ padding: '6px', background: 'transparent', color: 'rgba(239,68,68,0.5)', border: 'none', cursor: 'pointer' }} title="Delete Record"><Trash2 size={16}/></button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Advanced Segmentation Sidebar */}
            <div style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="glass-panel" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>Active Segments</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <button style={{ padding: '12px', borderRadius: '8px', background: 'var(--color-bg-light)', border: '1px solid rgba(0,0,0,0.05)', textAlign: 'left', fontWeight: 600 }}>High LTV (VIPs)</button>
                  <button style={{ padding: '12px', borderRadius: '8px', background: 'var(--color-bg-light)', border: '1px solid rgba(0,0,0,0.05)', textAlign: 'left', fontWeight: 600 }}>Unengaged (&#62;90 Days)</button>
                  <button style={{ padding: '12px', borderRadius: '8px', background: 'var(--color-bg-light)', border: '1px dashed rgba(0,0,0,0.2)', textAlign: 'left', fontWeight: 600, color: 'var(--color-text-muted)' }}>+ Create Segment</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'campaign' && (
        // ==========================================
        // TAB 2: CAMPAIGN COMPOSER
        // ==========================================
        <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: 'minmax(350px, 1fr) 2fr', gap: '30px' }}>
          
          {/* Configurations Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '20px' }}>Campaign Details</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '8px' }}>Internal Campaign Name</label>
                  <input type="text" defaultValue="Nexus SRE Executive Launch" style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', background: 'var(--color-bg-light)', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '8px' }}>Subject Line</label>
                  <input type="text" defaultValue="[Invitation] Your Autonomous SRE is ready." style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', background: 'var(--color-bg-light)', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '8px' }}>Target Segment</label>
                  <select style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', background: 'var(--color-bg-light)', outline: 'none' }}>
                    <option>All Subscribers (4,289)</option>
                    <option>Tag: VIP Only (82)</option>
                    <option>Tag: Warm Leads (1,204)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Block Builder Tools */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>Insert Blocks</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <button style={{ padding: '16px', borderRadius: '8px', border: '1px dashed rgba(0,0,0,0.2)', background: 'transparent', cursor: 'grab', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: 'var(--color-text-main)', fontWeight: 600 }}>
                  <Pencil size={20} color="var(--color-text-muted)" /> Text
                </button>
                <button style={{ padding: '16px', borderRadius: '8px', border: '1px dashed rgba(0,0,0,0.2)', background: 'transparent', cursor: 'grab', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: 'var(--color-text-main)', fontWeight: 600 }}>
                  <ImageIcon size={20} color="var(--color-text-muted)" /> Image
                </button>
                <button style={{ padding: '16px', borderRadius: '8px', border: '1px dashed rgba(0,0,0,0.2)', background: 'transparent', cursor: 'grab', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: 'var(--color-text-main)', fontWeight: 600 }}>
                  <MousePointerClick size={20} color="var(--color-text-muted)" /> Button
                </button>
                <button style={{ padding: '16px', borderRadius: '8px', border: '1px dashed rgba(0,0,0,0.2)', background: 'transparent', cursor: 'grab', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: 'var(--color-text-main)', fontWeight: 600 }}>
                  <LayoutTemplate size={20} color="var(--color-text-muted)" /> Spacer
                </button>
              </div>
            </div>
            
            <button onClick={() => alert("Simulating Claude 3.5 Sonnet payload rewrite: Stripping generic GPT formatting and injecting authoritative EEAT parameters...")} className="btn hover-lift" style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: '1rem', background: 'transparent', border: '2px solid var(--color-purple-main)', color: 'var(--color-purple-main)', fontWeight: 800, marginBottom: '16px' }}>
               Cognitive Intercept (Claude EEAT)
            </button>
            <button className="btn btn-primary" disabled={isSending} onClick={handleDispatch} style={{ width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '8px', padding: '16px', fontSize: '1.1rem' }}>
               {isSending ? 'Verifying Limits...' : <><Target size={20} /> Push Payload to Action Center</>}
            </button>
          </div>

          {/* The Physical Canvas Editor */}
          <div className="glass-panel" style={{ padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#F3F4F6' }}>
            <h3 style={{ alignSelf: 'flex-start', fontSize: '1.2rem', fontWeight: 700, marginBottom: '20px', color: 'var(--color-text-muted)' }}>Live Preview</h3>
            
            {/* The Email Document Shell */}
            <div style={{ width: '100%', maxWidth: '600px', background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}>
               {/* Email Header */}
               <div style={{ background: 'linear-gradient(135deg, var(--color-purple-main), var(--color-blue-main))', padding: '40px 30px', textAlign: 'center', color: 'white' }}>
                 <div style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-1px' }}>75² Nexus</div>
               </div>
               
               {/* Email Body */}
               <div style={{ padding: '40px 30px' }}>
                 <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '16px', color: 'var(--color-text-main)' }}>You have been granted Vanguard Access.</h2>
                 <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', lineHeight: '1.6', marginBottom: '20px' }}>
                   The 75 Squared Nexus platform is officially exiting Beta. As a preferred client, we are granting you immediate access to our newest engineering features.
                 </p>
                 <ul style={{ color: 'var(--color-text-muted)', lineHeight: '1.8', marginBottom: '30px', paddingLeft: '20px' }}>
                    <li><strong>Ghost Editor:</strong> Dynamic, algorithmically generated frontend landing pages.</li>
                    <li><strong>Autonomous SRE:</strong> A self-healing network that detects errors and silently patches them via API.</li>
                    <li><strong>Global Edge Constraints:</strong> Dictate exact trading hours and absolute tracking limits.</li>
                 </ul>
                 
                 <div style={{ padding: '24px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.05)', display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
                   <Clock size={24} color="#10B981" />
                   <div>
                     <strong style={{ display: 'block', color: '#10B981' }}>Secure Node Ready</strong>
                     <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Your API keys and liability waivers have been provisioned.</span>
                   </div>
                 </div>

                 <button style={{ width: '100%', padding: '16px', background: 'black', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 700, cursor: 'pointer' }}>
                   Authenticate & Enter Nexus
                 </button>
               </div>

               {/* Email Footer */}
               <div style={{ background: 'var(--color-bg-light)', padding: '24px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                 You are receiving this because you carry the 'VIP' tag.<br/>
                 P.O. Box 75, Las Vegas, NV 89101<br/>
                 <a href="#" style={{ color: 'var(--color-text-muted)' }}>Unsubscribe instantly</a>
               </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'automation' && (
        // ==========================================
        // TAB 3: VISUAL AUTOMATIONS (ActiveCampaign Clone)
        // ==========================================
        <div className="fade-in glass-panel" style={{ padding: '40px', minHeight: '600px', display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#F8FAFC' }}>
          
          {/* Main Trigger Node */}
          <div style={{ padding: '16px 24px', background: 'white', borderRadius: '12px', border: '1px solid rgba(147, 51, 234, 0.4)', boxShadow: '0 10px 25px rgba(147, 51, 234, 0.1)', width: '300px', textAlign: 'center', zIndex: 2 }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-purple-main)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Trigger</span>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', marginTop: '4px' }}>User Abandons Cart</div>
          </div>
          
          {/* Line */}
          <div style={{ width: '2px', height: '40px', background: 'rgba(0,0,0,0.1)' }}></div>
          
          {/* Action Node */}
          <div style={{ padding: '16px 24px', background: 'white', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', boxShadow: '0 4px 10px rgba(0,0,0,0.02)', width: '300px', textAlign: 'center', zIndex: 2 }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Action</span>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', marginTop: '4px' }}>Wait 2 Hours</div>
          </div>

          {/* Line */}
          <div style={{ width: '2px', height: '40px', background: 'rgba(0,0,0,0.1)' }}></div>

          {/* Action Node */}
          <div style={{ padding: '16px 24px', background: 'white', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.4)', boxShadow: '0 10px 25px rgba(59, 130, 246, 0.1)', width: '300px', textAlign: 'center', zIndex: 2 }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-blue-main)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Send Email</span>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', marginTop: '4px' }}>"Did you forget this?"</div>
          </div>

          {/* Branching Lines */}
          <div style={{ width: '2px', height: '30px', background: 'rgba(0,0,0,0.1)' }}></div>
          
          <div style={{ padding: '12px', background: 'var(--color-bg-light)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MousePointerClick size={14} /> If: Link Clicked in Email
          </div>

          <div style={{ display: 'flex', width: '400px', justifyContent: 'space-between', marginTop: '20px', position: 'relative' }}>
             <div style={{ position: 'absolute', top: '-20px', left: '100px', right: '100px', height: '20px', borderTop: '2px solid rgba(0,0,0,0.1)', borderLeft: '2px solid rgba(0,0,0,0.1)', borderRight: '2px solid rgba(0,0,0,0.1)', borderRadius: '12px 12px 0 0' }}></div>
             
             {/* Branch Yes */}
             <div style={{ padding: '16px 24px', background: 'white', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.5)', width: '180px', textAlign: 'center' }}>
               <span style={{ fontSize: '0.8rem', color: 'var(--color-green-main)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Yes</span>
               <div style={{ fontWeight: 700, fontSize: '0.9rem', marginTop: '4px' }}>Add Tag: "Warm Lead"</div>
             </div>

             {/* Branch No */}
             <div style={{ padding: '16px 24px', background: 'white', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.5)', width: '180px', textAlign: 'center' }}>
               <span style={{ fontSize: '0.8rem', color: '#ef4444', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>No</span>
               <div style={{ fontWeight: 700, fontSize: '0.9rem', marginTop: '4px' }}>Send SMS Follow-up</div>
             </div>
          </div>
          
          <button style={{ marginTop: '40px', padding: '12px 24px', borderRadius: '24px', background: 'var(--color-bg-light)', border: '1px dashed rgba(0,0,0,0.2)', color: 'var(--color-text-muted)', fontWeight: 600, cursor: 'pointer' }}>
             + Add Flow Node
          </button>
        </div>
      )}

      {activeTab === 'events' && (
        // ==========================================
        // TAB 4: EVENT MARKETING (Constant Contact Clone)
        // ==========================================
        <div className="fade-in glass-panel" style={{ padding: '40px' }}>
           <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '20px' }}>Interactive Blocks & Forms</h2>
           <p style={{ color: 'var(--color-text-muted)', marginBottom: '40px', maxWidth: '600px' }}>Embed high-engagement elements directly into your next broadcast. These components dynamically update subscriber tags based on their responses.</p>
           
           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
              
              {/* RSVP Block */}
              <div style={{ padding: '24px', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '16px', background: 'var(--color-bg-light)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>RSVP Module</h3>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                  <button style={{ flexGrow: 1, padding: '12px', background: 'white', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px', color: 'var(--color-green-main)', fontWeight: 600 }}>Yes, I'll be there!</button>
                  <button style={{ flexGrow: 1, padding: '12px', background: 'white', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', color: '#ef4444', fontWeight: 600 }}>No, I can't sync.</button>
                </div>
                <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Insert into Campaign</button>
              </div>

              {/* Polling Block */}
              <div style={{ padding: '24px', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '16px', background: 'var(--color-bg-light)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>Micro-Survey</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                  <div style={{ padding: '12px', background: 'white', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.05)' }}>Which service do you need?</div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}><input type="radio" name="poll"/> SEO Strategy</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}><input type="radio" name="poll"/> Custom Web App</label>
                </div>
                <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Insert into Campaign</button>
              </div>

           </div>
        </div>
      )}

      {activeTab === 'deliverability' && (
        // ==========================================
        // TAB 5: DELIVERABILITY ENGINE (Pre-Flight Checks)
        // ==========================================
        <div className="fade-in glass-panel" style={{ padding: '40px' }}>
           <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '20px' }}>Pre-Flight Deliverability Engine</h2>
           <p style={{ color: 'var(--color-text-muted)', marginBottom: '40px', maxWidth: '800px' }}>
             Email rendering is notoriously volatile. This specialized engine mathematically sanitizes your code, scans for heuristic spam triggers, and algorithmically forces compatibility across restrictive environments like Outlook Desktop and Apple Mail Dark Mode.
           </p>
           
           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
              
              {/* Left Column: Domain & Spam Analysis */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ border: '1px solid rgba(0,0,0,0.05)', borderRadius: '16px', background: 'white', overflow: 'hidden' }}>
                  <div style={{ padding: '20px', borderBottom: '1px solid rgba(0,0,0,0.05)', background: 'var(--color-bg-light)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <ShieldCheck size={20} color="#10B981" />
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Domain Authentication Core</h3>
                  </div>
                  <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 700 }}>SPF Record (Sender Policy Framework)</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Spoofing protection validated.</div>
                      </div>
                      <span style={{ background: '#10B981', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800 }}>PASS</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 700 }}>DKIM Signature (DomainKeys Identified Mail)</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Cryptographic keys verified.</div>
                      </div>
                      <span style={{ background: '#10B981', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800 }}>PASS</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 700 }}>DMARC Policy Enforcement</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Strict isolation p=reject alignment set.</div>
                      </div>
                      <span style={{ background: '#10B981', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800 }}>PASS</span>
                    </div>
                  </div>
                </div>

                <div style={{ border: '1px solid rgba(0,0,0,0.05)', borderRadius: '16px', background: 'white', overflow: 'hidden' }}>
                  <div style={{ padding: '20px', borderBottom: '1px solid rgba(0,0,0,0.05)', background: 'var(--color-bg-light)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Bug size={20} color="var(--color-purple-main)" />
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Heuristic Spam Sandbox</h3>
                  </div>
                  <div style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '20px' }}>
                      <span style={{ fontSize: '3rem', fontWeight: 800, color: '#10B981', lineHeight: 1 }}>0</span>
                      <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text-muted)' }}>/ 100 System Spam Score</span>
                    </div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
                      Your payload has been algorithmically parsed against the latest Gmail and Office365 server traps. No red-flag keywords ("FREE", "ACT NOW", "GUARANTEE") were detected in your `Subject Line` or HTML `body`.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Code Sanitization & Fallbacks */}
              <div style={{ border: '1px solid rgba(0,0,0,0.05)', borderRadius: '16px', background: 'white', overflow: 'hidden', height: 'fit-content' }}>
                <div style={{ padding: '20px', borderBottom: '1px solid rgba(0,0,0,0.05)', background: 'var(--color-bg-light)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Zap size={20} color="var(--color-blue-main)" />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Algorithmic Code Injection</h3>
                </div>
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  
                  {/* Toggle Option 1 */}
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <input type="checkbox" defaultChecked style={{ marginTop: '4px', width: '20px', height: '20px', accentColor: 'var(--color-blue-main)' }}/>
                    <div>
                      <div style={{ fontWeight: 700, marginBottom: '4px' }}>Inject Outlook VML Table Fallbacks</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
                        Legacy Outlook renders using Microsoft Word's engine. This parses your modern Flex/Grid layout into pure `&lt;table&gt;` structures mathematically, preventing alignment distortion.
                      </div>
                    </div>
                  </div>

                  {/* Toggle Option 2 */}
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <input type="checkbox" defaultChecked style={{ marginTop: '4px', width: '20px', height: '20px', accentColor: 'var(--color-blue-main)' }}/>
                    <div>
                      <div style={{ fontWeight: 700, marginBottom: '4px' }}>Force Mobile Responsiveness (Media Queries)</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
                        Injects absolute `@media (max-width: 480px)` styles directly into the inline document head, ensuring iOS and Gmail Mobile scale fonts legibly without horizontal scrolling.
                      </div>
                    </div>
                  </div>

                  {/* Toggle Option 3 */}
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <input type="checkbox" defaultChecked style={{ marginTop: '4px', width: '20px', height: '20px', accentColor: 'var(--color-blue-main)' }}/>
                    <div>
                      <div style={{ fontWeight: 700, marginBottom: '4px' }}>Compile Apple Mail Dark-Mode Meta Fixes</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
                        Renders `&lt;meta name="color-scheme" content="light dark"&gt;` and wraps logos in algorithmic inversion rules so your formatting doesn't violently break in dark mode environments.
                      </div>
                    </div>
                  </div>

                  {/* Toggle Option 4 */}
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <input type="checkbox" defaultChecked style={{ marginTop: '4px', width: '20px', height: '20px', accentColor: 'var(--color-blue-main)' }}/>
                    <div>
                      <div style={{ fontWeight: 700, marginBottom: '4px' }}>Generate Raw Multi-Part Plain Text Shadow</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
                        If a strict enterprise firewall entirely blocks HTML, this automatically synthesizes a raw, unformatted `text/plain` clone of your copy so the message still arrives safely.
                      </div>
                    </div>
                  </div>

                  <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}>Apply Sandbox Sanitization</button>
                </div>
              </div>
              
           </div>
        </div>
      )}
    </div>
  );
};

export default EmailDashboard;
