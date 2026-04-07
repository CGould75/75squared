import React, { useState } from 'react';
import { Share2, Calendar, Edit3, Send, Clock, Plus, Settings, TrendingUp, Image as ImageIcon, Camera, MessageCircle, Briefcase } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

const SocialDashboard = () => {
  const [activeTab, setActiveTab] = useState('calendar');
  const [upcomingPosts, setUpcomingPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Composer Form State
  const [composerContent, setComposerContent] = useState('Just shipped the new Multi-Tenant SaaS monetization structure! Our clients can now generate recurring revenue via automated Stripe webhook routing. Next up: building the A/B DOM mutation engine to algorithmically alter client websites on the fly.');
  const [composerPlatform, setComposerPlatform] = useState('linkedin');

  React.useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase.from('social_posts').select('*').order('id', { ascending: false });
      if (data) setUpcomingPosts(data);
      setLoading(false);
    };
    fetchPosts();
  }, [activeTab]);

  const dispatchPhysicalPost = async () => {
    const newPost = {
      platform: composerPlatform,
      content: composerContent,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Scheduled',
      date: 'Pending Agent'
    };

    const { data } = await supabase.from('social_posts').insert([newPost]).select();
    if (data) {
      setComposerContent('');
      setActiveTab('calendar');
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Share2 size={36} color="var(--color-blue-main)" /> Social Command Center
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>
            Manage omnichannel brand distribution and scheduling.
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '8px', background: 'rgba(0,0,0,0.05)', padding: '4px', borderRadius: '12px' }}>
          <button 
             onClick={() => setActiveTab('calendar')}
             style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, background: activeTab === 'calendar' ? 'white' : 'transparent', color: activeTab === 'calendar' ? 'var(--color-text-main)' : 'var(--color-text-muted)', boxShadow: activeTab === 'calendar' ? '0 2px 10px rgba(0,0,0,0.05)' : 'none' }}>
             Editorial Calendar
          </button>
          <button 
             onClick={() => setActiveTab('composer')}
             style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, background: activeTab === 'composer' ? 'white' : 'transparent', color: activeTab === 'composer' ? 'var(--color-text-main)' : 'var(--color-text-muted)', boxShadow: activeTab === 'composer' ? '0 2px 10px rgba(0,0,0,0.05)' : 'none' }}>
             Post Composer
          </button>
        </div>
      </div>

      {activeTab === 'calendar' && (
        <div className="fade-in">
          {/* Top KPI Dash */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
             <div className="glass-panel" style={{ padding: '24px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Posts Dispatched This Week</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>14 <TrendingUp size={20} color="var(--color-green-main)"/></div>
             </div>
             <div className="glass-panel" style={{ padding: '24px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Total Audience Reach</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '8px' }}>84.2K</div>
             </div>
             <div className="glass-panel" style={{ padding: '24px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Avg Engagement Rate</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '8px' }}>6.1%</div>
             </div>
             <div className="glass-panel" style={{ padding: '24px', background: 'var(--color-blue-main)', color: 'white' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, opacity: 0.8 }}>Connected Networks</span>
                <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                   <div style={{ padding: '8px', background: 'rgba(255,255,255,0.2)', borderRadius: '8px' }}><Camera size={20} /></div>
                   <div style={{ padding: '8px', background: 'rgba(255,255,255,0.2)', borderRadius: '8px' }}><MessageCircle size={20} /></div>
                   <div style={{ padding: '8px', background: 'rgba(255,255,255,0.2)', borderRadius: '8px' }}><Briefcase size={20} /></div>
                   <button style={{ padding: '8px', background: 'transparent', border: '1px dashed rgba(255,255,255,0.4)', borderRadius: '8px', color: 'white' }}><Plus size={20} /></button>
                </div>
             </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '30px' }}>
             {/* Queue sidebar */}
             <div className="glass-panel" style={{ padding: '24px' }}>
               <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}><Clock size={20}/> Dispatch Queue</h3>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                 {upcomingPosts.map(post => (
                   <div key={post.id} style={{ padding: '16px', background: 'var(--color-bg-light)', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{post.date}</span>
                        <span style={{ fontSize: '0.75rem', background: post.status === 'Scheduled' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)', color: post.status === 'Scheduled' ? 'var(--color-green-main)' : '#f59e0b', padding: '4px 8px', borderRadius: '12px', fontWeight: 700 }}>{post.status}</span>
                      </div>
                      <p style={{ fontSize: '0.95rem', color: 'var(--color-text-main)', marginBottom: '12px', lineHeight: '1.4' }}>{post.content}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                        <span style={{ textTransform: 'capitalize' }}>{post.platform} • {post.time}</span>
                        <Edit3 size={14} style={{ cursor: 'pointer' }}/>
                      </div>
                   </div>
                 ))}
               </div>
             </div>

             {/* Mock Calendar Grid */}
             <div className="glass-panel" style={{ padding: '30px' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                 <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>October 2026</h3>
                 <div style={{ display: 'flex', gap: '8px' }}>
                   <button className="btn btn-outline" style={{ padding: '8px 16px' }}>Week</button>
                   <button className="btn btn-outline" style={{ padding: '8px 16px', background: 'rgba(0,0,0,0.05)' }}>Month</button>
                 </div>
               </div>
               
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} style={{ textAlign: 'center', fontWeight: 600, color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '8px' }}>{day}</div>
                  ))}
                  {Array.from({ length: 31 }).map((_, i) => (
                    <div key={i} style={{ 
                      aspectRatio: '1', 
                      background: 'var(--color-bg-light)', 
                      border: '1px solid rgba(0,0,0,0.05)', 
                      borderRadius: '8px', 
                      padding: '8px',
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>{i + 1}</span>
                      {i === 27 && (
                        <div style={{ background: 'var(--color-purple-main)', color: 'white', fontSize: '0.65rem', padding: '2px 4px', borderRadius: '4px', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>IG Launch</div>
                      )}
                      {i === 28 && (
                        <div style={{ background: 'var(--color-blue-main)', color: 'white', fontSize: '0.65rem', padding: '2px 4px', borderRadius: '4px', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>LI Guide</div>
                      )}
                    </div>
                  ))}
               </div>
             </div>
          </div>
        </div>
      )}

      {activeTab === 'composer' && (
        <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: 'minmax(400px, 1fr) 1fr', gap: '40px' }}>
          
          {/* Editor Sandbox */}
          <div className="glass-panel" style={{ padding: '30px' }}>
             <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '24px' }}>Draft Omnichannel Post</h3>
             
             <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '8px' }}>Select Target Networks</label>
             <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                <button style={{ flex: 1, padding: '12px', background: 'var(--color-bg-light)', border: '2px solid var(--color-blue-main)', borderRadius: '8px', color: 'var(--color-blue-main)', display: 'flex', justifyContent: 'center' }}><Briefcase size={20}/></button>
                <button style={{ flex: 1, padding: '12px', background: 'var(--color-bg-light)', border: '2px solid rgba(0,0,0,0.1)', borderRadius: '8px', color: 'var(--color-text-muted)', display: 'flex', justifyContent: 'center' }}><MessageCircle size={20}/></button>
                <button style={{ flex: 1, padding: '12px', background: 'var(--color-bg-light)', border: '2px solid var(--color-purple-main)', borderRadius: '8px', color: 'var(--color-purple-main)', display: 'flex', justifyContent: 'center' }}><Camera size={20}/></button>
             </div>

             <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '8px' }}>Content Payload</label>
             <textarea 
               value={composerContent}
               onChange={(e) => setComposerContent(e.target.value)}
               style={{ width: '100%', height: '180px', padding: '16px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', background: 'var(--color-bg-light)', outline: 'none', resize: 'vertical', fontSize: '1rem', lineHeight: '1.5', fontFamily: 'inherit', marginBottom: '16px' }}
             />

             <div style={{ display: 'flex', gap: '12px', marginBottom: '30px' }}>
               <button style={{ padding: '12px 16px', borderRadius: '8px', border: '1px dashed rgba(0,0,0,0.2)', background: 'transparent', color: 'var(--color-text-main)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                 <ImageIcon size={18}/> Attach Media
               </button>
               <button style={{ padding: '12px 16px', borderRadius: '8px', border: '1px dashed rgba(0,0,0,0.2)', background: 'transparent', color: 'var(--color-text-main)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                 # Hashtag Suggest
               </button>
             </div>

             <div style={{ display: 'flex', gap: '16px' }}>
                <button className="btn btn-outline" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={18} /> Schedule
                </button>
                <button onClick={dispatchPhysicalPost} className="btn btn-primary" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                  <Send size={18} /> Dispatch Now
                </button>
             </div>
          </div>

          {/* Device Mockups */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-muted)' }}>Live Platform Previews</h3>
            
            <div style={{ padding: '24px', background: 'white', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '16px', marginBottom: '16px' }}>
                 <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-purple-main), var(--color-blue-main))' }}></div>
                 <div>
                   <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>75 Squared</div>
                   <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Just now • <Briefcase size={12} style={{ display: 'inline', marginLeft: '4px' }}/></div>
                 </div>
               </div>
               <p style={{ fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '16px' }}>
                 Just shipped the new Multi-Tenant SaaS monetization structure! Our clients can now generate recurring revenue via automated Stripe webhook routing.<br/><br/>Next up: building the A/B DOM mutation engine.
               </p>
               <div style={{ width: '100%', height: '180px', background: 'var(--color-bg-light)', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                 [Link Preview metadata will render here]
               </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default SocialDashboard;
