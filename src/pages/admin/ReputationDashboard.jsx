import React, { useState, useEffect, useContext } from 'react';
import { MessageSquare, Star, Reply, Zap, Settings, Globe, Shield, Activity, Smartphone, Mail, Settings2, ShieldAlert, Sparkles } from 'lucide-react';
import SEOHead from '../../components/SEOHead';
import { supabase } from '../../lib/supabaseClient';
import { GlobalDomainContext } from '../../layouts/AdminLayout';

export default function ReputationDashboard() {
  const [activeTab, setActiveTab] = useState('inbox');
  const [reviews, setReviews] = useState([]);
  const { activeDomain } = useContext(GlobalDomainContext);

  useEffect(() => {
    const fetchReviews = async () => {
      const { data } = await supabase.from('reputation_reviews')
        .select('*')
        .eq('client_id', activeDomain)
        .order('id', { ascending: false });
      if (data) setReviews(data);
    };
    fetchReviews();
  }, [activeDomain]);

  return (
    <div className="fade-in">
      <SEOHead title="Omnichannel & Reviews" description="Unified communications and reputation API engine." path="/admin/reputation" />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <MessageSquare size={36} color="var(--color-blue-main)" />
            Omnichannel Engine
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem', maxWidth: '600px' }}>
            Unified API layer syncing Trustpilot, Google, Yelp, Webchat, and SMS channels into a single mathematical command center.
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-outline" style={{ background: 'white' }}><Settings size={18} /> Provider Config</button>
          <button className="btn btn-primary"><Zap size={18} /> Launch Generation Campaign</button>
        </div>
      </div>

      {/* Primary Analytics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '40px' }}>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>Global Rating (30d)</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            4.8 <Star size={24} color="#F59E0B" fill="#F59E0B" />
          </div>
          <div style={{ color: 'var(--color-green-main)', fontSize: '0.9rem', fontWeight: 600, marginTop: '8px' }}>↑ 0.2 vs last month</div>
        </div>
        
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>Net Reviews Harvested</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-purple-dark)' }}>294</div>
          <div style={{ color: 'var(--color-green-main)', fontSize: '0.9rem', fontWeight: 600, marginTop: '8px' }}>↑ 14% via SMS Campaigns</div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>Pending Triage</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-text-main)' }}>12</div>
          <div style={{ color: '#EF4444', fontSize: '0.9rem', fontWeight: 600, marginTop: '8px' }}>2 Critical Interventions</div>
        </div>

        <div className="glass-panel" style={{ padding: '24px', background: 'linear-gradient(135deg, var(--color-blue-main), var(--color-purple-main))', color: 'white' }}>
          <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>Automated SLA</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>98.2%</div>
          <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.9rem', fontWeight: 600, marginTop: '8px' }}>AI Reply Accuracy</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '16px' }}>
        <button onClick={() => setActiveTab('inbox')} style={{ background: 'none', border: 'none', padding: '8px 16px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', color: activeTab === 'inbox' ? 'var(--color-purple-dark)' : 'var(--color-text-muted)', borderBottom: activeTab === 'inbox' ? '2px solid var(--color-purple-dark)' : '2px solid transparent' }}>
          Unified Inbox
        </button>
        <button onClick={() => setActiveTab('campaigns')} style={{ background: 'none', border: 'none', padding: '8px 16px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', color: activeTab === 'campaigns' ? 'var(--color-purple-dark)' : 'var(--color-text-muted)', borderBottom: activeTab === 'campaigns' ? '2px solid var(--color-purple-dark)' : '2px solid transparent' }}>
          Generation Campaigns
        </button>
        <button onClick={() => setActiveTab('settings')} style={{ background: 'none', border: 'none', padding: '8px 16px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', color: activeTab === 'settings' ? 'var(--color-purple-dark)' : 'var(--color-text-muted)', borderBottom: activeTab === 'settings' ? '2px solid var(--color-purple-dark)' : '2px solid transparent' }}>
          Alert Settings
        </button>
      </div>

      {activeTab === 'inbox' && (
        <div className="glass-panel" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FAFAFA' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Priority Stream</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
               <span style={{ padding: '6px 12px', background: 'white', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}><ShieldAlert size={14} color="#EF4444"/> 1-Star Only</span>
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {reviews.map(review => (
               <div key={review.id} style={{ padding: '24px', borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', gap: '24px', transition: 'background 0.2s' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: review.rating < 3 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                     <Star size={20} color={review.rating < 3 ? '#EF4444' : '#10B981'} fill={review.rating < 3 ? '#EF4444' : '#10B981'} />
                  </div>
                  <div style={{ flexGrow: 1 }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{review.author}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>{review.date} via {review.platform}</div>
                     </div>
                     <p style={{ color: 'var(--color-text-main)', fontSize: '1rem', lineHeight: '1.6', marginBottom: '16px' }}>"{review.content}"</p>
                     
                     <div style={{ display: 'flex', gap: '12px' }}>
                        <button className="btn btn-outline" style={{ background: 'white', padding: '8px 16px', fontSize: '0.85rem' }}><Reply size={14}/> Fast Reply</button>
                        <button className="btn btn-outline" style={{ background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)', color: 'var(--color-blue-main)', padding: '8px 16px', fontSize: '0.85rem' }}><Sparkles size={14}/> Draft via AI</button>
                        {review.rating === 1 && (
                            <button className="btn btn-outline" style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#EF4444', padding: '8px 16px', fontSize: '0.85rem' }}><Activity size={14}/> Push SRE Alert</button>
                        )}
                     </div>
                  </div>
               </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'campaigns' && (
         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div className="glass-panel" style={{ padding: '30px' }}>
               <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(147, 51, 234, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                  <Smartphone size={24} color="var(--color-purple-main)" />
               </div>
               <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '12px' }}>SMS Review Generation</h3>
               <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px', lineHeight: '1.6' }}>Design automated text message drips triggering right after a client interaction.</p>
               
               <div style={{ background: '#FAFAFA', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '8px' }}>Template Body</div>
                  <div style={{ border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', padding: '16px', background: 'white', minHeight: '100px', fontSize: '0.95rem', color: '#111' }}>
                     Hi {'{{first_name}}'}, thanks for choosing {'{{business_name}}'}! How did we do? Click here to drop a quick review: {'{{review_link}}'}
                  </div>
               </div>
               <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}><Settings2 size={16}/> Configure Twilio Webhook</button>
            </div>

            <div className="glass-panel" style={{ padding: '30px' }}>
               <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                  <Mail size={24} color="var(--color-blue-main)" />
               </div>
               <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '12px' }}>Email Review Generation</h3>
               <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px', lineHeight: '1.6' }}>Slower impact, but excellent for capturing complex B2B feedback loops.</p>
               
               <div style={{ background: '#FAFAFA', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '12px', padding: '20px', marginBottom: '20px', opacity: 0.7 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '8px' }}>Template Configured</div>
                  <div style={{ border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', padding: '16px', background: 'white', fontSize: '0.95rem' }}>
                     [Standard Liquid UI Layout Applied]
                  </div>
               </div>
               <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', background: 'white' }}><Settings2 size={16}/> Edit Matrix</button>
            </div>
         </div>
      )}

      {activeTab === 'settings' && (
         <div className="glass-panel" style={{ padding: '30px', maxWidth: '800px' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '24px' }}>Notification & Alert Thresholds</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
               <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '12px', background: '#FAFAFA' }}>
                  <div>
                     <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '4px' }}>Critical 1-Star Alert (SMS)</div>
                     <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Instantly text the admin phone when a 1-star review hits Trustpilot or Google.</div>
                  </div>
                  <div style={{ width: '48px', height: '26px', background: '#10B981', borderRadius: '13px', position: 'relative', cursor: 'pointer' }}>
                     <div style={{ width: '22px', height: '22px', background: 'white', borderRadius: '50%', position: 'absolute', right: '2px', top: '2px', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}></div>
                  </div>
               </div>

               <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '12px', background: '#FAFAFA' }}>
                  <div>
                     <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '4px' }}>All 5-Star Alerts (Email)</div>
                     <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Send a daily digest of positive reputation growth to the admin email.</div>
                  </div>
                  <div style={{ width: '48px', height: '26px', background: '#10B981', borderRadius: '13px', position: 'relative', cursor: 'pointer' }}>
                     <div style={{ width: '22px', height: '22px', background: 'white', borderRadius: '50%', position: 'absolute', right: '2px', top: '2px', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}></div>
                  </div>
               </div>
               
               <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '12px', background: '#FAFAFA' }}>
                  <div>
                     <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '4px' }}>Supabase Firehose SRE Push</div>
                     <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Automatically write critical API errors into the SRE System Database.</div>
                  </div>
                  <div style={{ width: '48px', height: '26px', background: '#10B981', borderRadius: '13px', position: 'relative', cursor: 'pointer' }}>
                     <div style={{ width: '22px', height: '22px', background: 'white', borderRadius: '50%', position: 'absolute', right: '2px', top: '2px', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}></div>
                  </div>
               </div>
            </div>
         </div>
      )}

    </div>
  );
}
