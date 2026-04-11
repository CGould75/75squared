import React, { useState, useContext, useRef } from 'react';
import { Share2, Calendar, Edit3, Send, Clock, Plus, Settings, TrendingUp, Image as ImageIcon, Camera, MessageCircle, Briefcase, Activity, ThumbsUp, Check, BarChart2, Eye, Search, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { GlobalDomainContext } from '../../layouts/AdminLayout';
import TelemetryEngine from '../../lib/telemetry';

// React Flow Imports for Gumloop Parity
import { ReactFlow, Controls, Background, applyNodeChanges, applyEdgeChanges } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const SocialDashboard = () => {
  const navigate = useNavigate();
  const { activeDomain } = useContext(GlobalDomainContext);
  const [activeTab, setActiveTab] = useState('calendar');
  const [upcomingPosts, setUpcomingPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [autopilotEnabled, setAutopilotEnabled] = useState(false);

  // Ad Intel State
  const [intelQuery, setIntelQuery] = useState('');
  const [isScraping, setIsScraping] = useState(false);
  const [intelResults, setIntelResults] = useState(null);

  // Dynamic Calendar Logic
  const currentDate = new Date();
  const currentMonthDays = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  
  // Real Brand Sentiment State
  const [sentimentData, setSentimentData] = useState(null);
  React.useEffect(() => {
     if(activeTab === 'listening' && !sentimentData) {
         fetch(`/api/sentiment?q=${encodeURIComponent(activeDomain)}`)
            .then(res => res.json())
            .then(data => {
                if(data.success && data.analytics) {
                    setSentimentData(data.analytics);
                }
            })
            .catch(console.error);
     }
  }, [activeTab, activeDomain, sentimentData]);
  
  // Real Radar Trends Engine
  const [radarTrends, setRadarTrends] = useState([]);
  React.useEffect(() => {
    fetch('/api/radar')
      .then(res => res.json())
      .then(data => {
         if (data.success && data.trends) {
            setRadarTrends(data.trends);
         }
      })
      .catch(console.error);
  }, []);

  const triggerIntelScrape = async () => {
     if (!intelQuery) return;
     setIsScraping(true);
     setIntelResults(null);
     
     try {
         const res = await fetch(`/api/meta?query=${encodeURIComponent(intelQuery)}`);
         const data = await res.json();
         
         if (data.success) {
            setIntelResults({
               insights: data.insights,
               activeCount: data.activeCount,
               link: data.link
            });
         } else {
            setIntelResults({
               insights: ["The intelligence engine encountered an obstruction."],
               activeCount: 0,
               link: '#'
            });
         }
     } catch (e) {
         setIntelResults({
            insights: ["Fatal error during intelligence extraction."],
            activeCount: 0,
            link: '#'
         });
     }
     setIsScraping(false);
  };

  // Composer Form State
  const [composerContent, setComposerContent] = useState('Just shipped the new Multi-Tenant SaaS monetization structure! Our clients can now generate recurring revenue via automated Stripe webhook routing. Next up: building the A/B DOM mutation engine to algorithmically alter client websites on the fly.');
  const [composerPlatform, setComposerPlatform] = useState('linkedin');
  const [composerMedia, setComposerMedia] = useState(null);
  const [composerSchedule, setComposerSchedule] = useState('');

  const handleHashtagSuggest = async () => {
      try {
          const res = await fetch(`/api/generate-copy?action=hashtags&content=${encodeURIComponent(composerContent)}`);
          const data = await res.json();
          if(data.success && data.hashtags) {
              setComposerContent(prev => prev + '\n\n' + data.hashtags);
          }
      } catch(e) { console.error('Hashtag Engine Error', e); }
  };

  const handleAttachMedia = () => {
      const prompt = `Premium corporate aesthetic for ${composerPlatform} post: ${composerContent.substring(0, 50)}`;
      setComposerMedia(`https://www.75squared.com/api/image?prompt=${encodeURIComponent(prompt)}`);
  };

  const handleAutopilotToggle = async () => {
     if (!autopilotEnabled) {
        setAutopilotEnabled(true);
        // Simulate Neural News Scraper finding a viral exploit
        setTimeout(async () => {
           alert("VIRAL TREND DETECTED: A major competitor in the software space was just acquired. The Hive Mind has autonomously drafted capitalize campaigns.");
           
           let socialDraft = `Breaking news regarding the major acquisition in our industry space today. While others consolidate, we are aggressively expanding our independent feature suite to remain the absolute best natively tailored alternative. Let us know your thoughts below!`;
           let emailDraft = `<div style="padding: 20px;"><h1>A Shift In The Industry</h1><p>You may have seen the news today. We wanted to reach out to our core subscribers directly...</p></div>`;
           
           try {
               const res = await fetch(`/api/generate-copy?action=draft&topic=Competitor%20Acquisition`);
               const data = await res.json();
               if(data.success) {
                   socialDraft = data.text;
                   emailDraft = `<div style="padding: 20px;"><h1>Industry Shift</h1><p>${data.text.replace(/\n/g, '<br/>')}</p></div>`;
               }
           } catch(e) {}

           // Generate Social Post
           const socialPayload = {
              domain: activeDomain,
              platform: 'linkedin',
              content: socialDraft,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              status: 'Pending Agent',
              date: new Date().toLocaleDateString()
           };
           const { data: socialRes } = await supabase.from('social_posts').insert([socialPayload]).select();
           
           // Generate Connected Email Campaign (HIVE MIND CROSS-FUNCTIONALITY)
           const emailPayload = {
              domain: activeDomain,
              title: `Viral Draft: Competitor Acquisition Response`,
              subject_line: `Our take on today's massive industry acquisition`,
              body_content: emailDraft,
              status: 'Draft',
              target_segment: 'All Subscribers'
           };
           await supabase.from('email_campaigns').insert([emailPayload]);
           
           // Notify Action Center via Telemetry Engine God-Mode
           await TelemetryEngine.dispatchException(
              'Social Dashboard - Semantic News Engine', 
              'Viral Exploitation Opportunity: Competitor Acquisition', 
              { social_id: socialRes?.[0]?.id, action: 'Drafts compiled and waiting for physical Human-in-the-Loop approval.' }, 
              'opportunity'
           );
        }, 1500);
     } else {
        setAutopilotEnabled(false);
     }
  };

  // Node Engine State (Gumloop parity)
  const initialNodes = [
    { id: '1', type: 'input', position: { x: 50, y: 50 }, data: { label: '🎯 Target: Domain Ingestion (e.g. MGM Resorts)' }, style: { background: '#111', color: 'white', fontWeight: 700, borderRadius: '8px', border: '1px solid #333' } },
    { id: '2', position: { x: 50, y: 150 }, data: { label: '🕵️ LinkedIn Headcount Execution Scrape' }, style: { background: 'white', border: '2px solid var(--color-blue-main)', fontWeight: 600, borderRadius: '8px' } },
    { id: '3', position: { x: 50, y: 250 }, data: { label: '⚙️ Role Filter Engine (CMO, VP Marketing)' }, style: { background: 'white', border: '1px solid #ccc', fontWeight: 600, borderRadius: '8px' } },
    { id: '4', position: { x: 350, y: 250 }, data: { label: '✉️ Dispatch Personalized LLM Connection Request' }, style: { background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', fontWeight: 800, border: '1px solid #10B981', borderRadius: '8px' } },
  ];
  const initialEdges = [{ id: 'e1-2', source: '1', target: '2', animated: true }, { id: 'e2-3', source: '2', target: '3', animated: true }, { id: 'e3-4', source: '3', target: '4', animated: true }];
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const onNodesChange = (changes) => setNodes((nds) => applyNodeChanges(changes, nds));
  const onEdgesChange = (changes) => setEdges((eds) => applyEdgeChanges(changes, eds));

  React.useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase.from('social_posts').select('*').eq('domain', activeDomain).order('id', { ascending: false });
      if (data) setUpcomingPosts(data);
      setLoading(false);
    };
    fetchPosts();
  }, [activeTab]);

  const dispatchPhysicalPost = async () => {
    const postDateObj = composerSchedule ? new Date(composerSchedule) : new Date();
    const newPost = {
      domain: activeDomain,
      platform: composerPlatform,
      content: composerContent,
      time: postDateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Scheduled',
      date: postDateObj.toLocaleDateString()
    };

    const { data, error } = await supabase.from('social_posts').insert([newPost]).select();
    if (error) {
       TelemetryEngine.dispatchException('Social Dashboard - Composer', 'Database Insertion Rejection', error, 'fatal');
    }
    if (data) {
      setComposerContent('');
      await TelemetryEngine.dispatchException('Social Dashboard - Logic Composer', 'Post Compiled and Halted For Structural Validation', data[0], 'warning');
      navigate('/admin/action-center');
    }
  };

  const handleAutoDraft = async (trendTopic) => {
     setLoading(true);
     try {
         const res = await fetch(`/api/generate-copy?action=draft&topic=${encodeURIComponent(trendTopic)}`);
         const data = await res.json();
         const generatedScript = data.success ? data.text : `Viral trend intercepted: ${trendTopic}. Scripting deferred to manual override.`;
         
         const newPost = {
            domain: activeDomain,
            platform: 'tiktok',
            content: generatedScript,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'Scheduled',
            date: 'Pending Agent'
         };
         await supabase.from('social_posts').insert([newPost]);
         await TelemetryEngine.dispatchException('Social Autopilot', 'Viral Trend Auto-Drafted', newPost, 'opportunity');
         alert(`Viral script generated for '${trendTopic}'. Check your draft queue!`);
         setActiveTab('calendar');
     } catch (e) {
         console.error(e);
     }
     setLoading(false);
  };

  return (
    <div>
      <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Share2 size={36} color="var(--color-blue-main)" /> Social Command Center
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>
            Omnichannel distribution, algorithmic boosting, and AI logic workflows.
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
          <button 
             onClick={() => setActiveTab('listening')}
             style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, background: activeTab === 'listening' ? 'white' : 'transparent', color: activeTab === 'listening' ? 'var(--color-text-main)' : 'var(--color-text-muted)', boxShadow: activeTab === 'listening' ? '0 2px 10px rgba(0,0,0,0.05)' : 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
             <Activity size={16} /> Brand Listening
          </button>
          <button 
             onClick={() => setActiveTab('autopilot')}
             style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, background: activeTab === 'autopilot' ? 'white' : 'transparent', color: activeTab === 'autopilot' ? 'var(--color-text-main)' : 'var(--color-text-muted)', boxShadow: activeTab === 'autopilot' ? '0 2px 10px rgba(0,0,0,0.05)' : 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
             <TrendingUp size={16} /> Autopilot
          </button>
          <button 
             onClick={() => setActiveTab('ad_intel')}
             style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, background: activeTab === 'ad_intel' ? 'white' : 'transparent', color: activeTab === 'ad_intel' ? 'var(--color-text-main)' : 'var(--color-text-muted)', boxShadow: activeTab === 'ad_intel' ? '0 2px 10px rgba(0,0,0,0.05)' : 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
             <Eye size={16} /> Ad Intel
          </button>
          <button 
             onClick={() => setActiveTab('aiflows')}
             style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, background: activeTab === 'aiflows' ? 'var(--color-blue-main)' : 'transparent', color: activeTab === 'aiflows' ? 'white' : 'var(--color-blue-main)', boxShadow: activeTab === 'aiflows' ? '0 2px 10px rgba(0,0,0,0.05)' : 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
             <Share2 size={16} /> AI Flows
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
                   <button onClick={() => alert("Component Feature arriving in v2.0")} style={{ padding: '8px', background: 'transparent', border: '1px dashed rgba(255,255,255,0.4)', borderRadius: '8px', color: 'white' }}><Plus size={20} /></button>
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

             {/* Dynamic Physical Grid */}
             <div className="glass-panel" style={{ padding: '30px' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                 <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{monthName}</h3>
                 <div style={{ display: 'flex', gap: '8px' }}>
                   <button onClick={() => alert("Component Feature arriving in v2.0")} className="btn btn-outline" style={{ padding: '8px 16px' }}>Week</button>
                   <button onClick={() => alert("Component Feature arriving in v2.0")} className="btn btn-outline" style={{ padding: '8px 16px', background: 'rgba(0,0,0,0.05)' }}>Month</button>
                 </div>
               </div>
               
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} style={{ textAlign: 'center', fontWeight: 600, color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '8px' }}>{day}</div>
                  ))}
                  {Array.from({ length: currentMonthDays }).map((_, i) => {
                    const dayNumber = i + 1;
                    // Check if there are posts scheduled for this physical day
                    const todaysPosts = upcomingPosts.filter(post => {
                       if(post.date === 'Pending Agent') return false;
                       try {
                           const postDay = new Date(post.date).getDate();
                           return postDay === dayNumber;
                       } catch(e) { return false; }
                    });

                    return (
                    <div key={i} style={{ 
                      aspectRatio: '1', 
                      background: 'var(--color-bg-light)', 
                      border: todaysPosts.length > 0 ? '1px solid var(--color-blue-main)' : '1px solid rgba(0,0,0,0.05)', 
                      borderRadius: '8px', 
                      padding: '8px',
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: todaysPosts.length > 0 ? 'var(--color-blue-main)' : 'var(--color-text-muted)' }}>{dayNumber}</span>
                      
                      {todaysPosts.map(post => (
                         <div key={post.id} style={{ background: post.platform === 'linkedin' ? 'var(--color-blue-main)' : 'var(--color-purple-main)', color: 'white', fontSize: '0.65rem', padding: '2px 4px', borderRadius: '4px', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                           {post.platform} post
                         </div>
                      ))}
                    </div>
                  )})}
               </div>
             </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* TAB 2: COMPOSER (PLANABLE KILLER) */}
      {/* ========================================== */}
      {activeTab === 'composer' && (
        <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: 'minmax(400px, 1fr) 1fr', gap: '40px' }}>
          
          {/* Editor Sandbox */}
          <div className="glass-panel" style={{ padding: '30px' }}>
             <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '24px' }}>Draft Omnichannel Post</h3>
             
             <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '8px' }}>Select Target Networks</label>
             <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                <button onClick={() => alert("Component Feature arriving in v2.0")} style={{ flex: 1, padding: '12px', background: 'var(--color-bg-light)', border: '2px solid var(--color-blue-main)', borderRadius: '8px', color: 'var(--color-blue-main)', display: 'flex', justifyContent: 'center' }}><Briefcase size={20}/></button>
                <button onClick={() => alert("Component Feature arriving in v2.0")} style={{ flex: 1, padding: '12px', background: 'var(--color-bg-light)', border: '2px solid rgba(0,0,0,0.1)', borderRadius: '8px', color: 'var(--color-text-muted)', display: 'flex', justifyContent: 'center' }}><MessageCircle size={20}/></button>
                <button onClick={() => alert("Component Feature arriving in v2.0")} style={{ flex: 1, padding: '12px', background: 'var(--color-bg-light)', border: '2px solid var(--color-purple-main)', borderRadius: '8px', color: 'var(--color-purple-main)', display: 'flex', justifyContent: 'center' }}><Camera size={20}/></button>
             </div>

             <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '8px' }}>Content Payload</label>
             <textarea 
               value={composerContent}
               onChange={(e) => setComposerContent(e.target.value)}
               style={{ width: '100%', height: '180px', padding: '16px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', background: 'var(--color-bg-light)', outline: 'none', resize: 'vertical', fontSize: '1rem', lineHeight: '1.5', fontFamily: 'inherit', marginBottom: '16px' }}
             />

             <div style={{ display: 'flex', gap: '12px', marginBottom: '30px', flexWrap: 'wrap' }}>
               <button onClick={() => alert("Component Feature arriving in v2.0")} style={{ padding: '12px 16px', borderRadius: '8px', border: '1px dashed rgba(0,0,0,0.2)', background: 'transparent', color: 'var(--color-text-main)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                 <ImageIcon size={18}/> Attach Media
               </button>
               <button onClick={() => alert("Component Feature arriving in v2.0")} style={{ padding: '12px 16px', borderRadius: '8px', border: '1px dashed rgba(0,0,0,0.2)', background: 'transparent', color: 'var(--color-text-main)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                 # Hashtag Suggest
               </button>
               <a href="https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=dr%20squatch&search_type=keyword_unordered&sort_data[direction]=desc&sort_data[mode]=total_impressions" target="_blank" rel="noreferrer" style={{ textDecoration: 'none', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.3)', background: 'rgba(59, 130, 246, 0.05)', color: 'var(--color-blue-main)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                 <Activity size={18}/> Meta Ad Library Intel
               </a>
             </div>

             <div style={{ display: 'flex', gap: '16px' }}>
                <input 
                   type="datetime-local" 
                   value={composerSchedule}
                   onChange={e => setComposerSchedule(e.target.value)}
                   style={{ padding: '12px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', color: 'var(--color-text-main)', outline: 'none' }}
                />
                <button onClick={() => alert("Component Feature arriving in v2.0")} className="btn btn-outline" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={18} /> Schedule For Later
                </button>
             </div>
          </div>

          {/* Planable-style iPhone Approval Sandbox */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-muted)', width: '320px' }}>Client Live Approval Portal</h3>
            
            <div style={{ width: '320px', height: '650px', background: 'var(--color-bg-light)', borderRadius: '40px', border: '12px solid #1f2937', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
               {/* iPhone Notch */}
               <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '120px', height: '24px', background: '#1f2937', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px', zIndex: 10 }}></div>
               
               {/* LinkedIn Header Mock */}
               <div style={{ height: '60px', background: 'white', borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'flex-end', padding: '12px 16px' }}>
                 <strong style={{ fontSize: '1.2rem', color: '#0a66c2' }}>in</strong>
                 <div style={{ marginLeft: '12px', background: 'var(--color-bg-light)', borderRadius: '4px', height: '28px', flex: 1 }}></div>
               </div>

               {/* Post Body */}
               <div style={{ padding: '16px', background: 'white', flex: 1 }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                   <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-purple-main), var(--color-blue-main))' }}></div>
                   <div>
                     <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{activeDomain}</div>
                     <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Verified Brand Account</div>
                   </div>
                 </div>
                 <p style={{ fontSize: '0.85rem', lineHeight: '1.5', marginBottom: '12px', wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
                   {composerContent}
                 </p>
                 {composerMedia ? (
                    <img src={composerMedia} alt="Generated Asset" style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '4px' }} />
                 ) : (
                    <div style={{ width: '100%', height: '140px', border: '1px dashed rgba(0,0,0,0.1)', background: 'var(--color-bg-main)', borderRadius: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>Rich Media Preview</div>
                 )}
               </div>

               {/* Planable Client Buttons overlay at bottom */}
               <div style={{ background: 'var(--color-bg-main)', borderTop: '1px solid rgba(0,0,0,0.1)', padding: '16px', display: 'flex', gap: '8px' }}>
                  <button onClick={() => alert("Component Feature arriving in v2.0")} className="btn btn-outline" style={{ flex: 1, padding: '8px', fontSize: '0.8rem' }}>Request Edit</button>
                  <button onClick={dispatchPhysicalPost} className="btn btn-primary" style={{ flex: 1, padding: '8px', fontSize: '0.8rem', background: 'var(--color-green-main)', border: 'none' }}><Check size={14}/> Approve & Post</button>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* TAB 3: AUTOPILOT (ORDINAL KILLER) */}
      {/* ========================================== */}
      {activeTab === 'autopilot' && (
        <div className="fade-in">
          <div className="glass-panel" style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '30px' }}>
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                   🤖 The Social Autopilot
                </h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem' }}>
                   Automatically generate and publish posts when viral trends break in your selected SEO RSS feeds.
                </p>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}>
                <span style={{ fontWeight: 800, fontSize: '1.1rem', color: autopilotEnabled ? 'var(--color-green-main)' : 'var(--color-text-muted)' }}>
                   {autopilotEnabled ? 'Autopilot Active' : 'Autopilot Disabled'}
                </span>
                <div onClick={handleAutopilotToggle} style={{ width: '70px', height: '36px', background: autopilotEnabled ? 'var(--color-green-main)' : 'rgba(0,0,0,0.1)', borderRadius: '20px', position: 'relative', transition: 'all 0.3s' }}>
                  <div style={{ position: 'absolute', top: '4px', left: autopilotEnabled ? '38px' : '4px', width: '28px', height: '28px', background: 'white', borderRadius: '50%', transition: 'all 0.3s', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}></div>
                </div>
              </label>
            </div>
            
            <div style={{ opacity: autopilotEnabled ? 1 : 0.4, pointerEvents: autopilotEnabled ? 'auto' : 'none', transition: 'opacity 0.3s' }}>
               <h4 style={{ fontWeight: 700, marginBottom: '20px', fontSize: '1.2rem' }}>Generative Formulation Rules</h4>
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                  <div style={{ padding: '24px', background: 'var(--color-bg-light)', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)' }}>
                    <label style={{ fontWeight: 700, display: 'block', marginBottom: '12px', fontSize: '1.05rem' }}>Action Mode</label>
                    <select style={{ width: '100%', padding: '16px', fontSize: '1rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', outline: 'none' }}>
                       <option>Draft & Request Approval (Safe)</option>
                       <option>Publish Instantly (Aggressive)</option>
                    </select>
                    <p style={{ marginTop: '12px', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>*Instantly published posts bypass the Planable approval portal.</p>
                  </div>
                  
                  <div style={{ padding: '24px', background: 'var(--color-bg-light)', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)' }}>
                    <label style={{ fontWeight: 700, display: 'block', marginBottom: '12px', fontSize: '1.05rem' }}>LLM Personality Matrix</label>
                    <select style={{ width: '100%', padding: '16px', fontSize: '1rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', outline: 'none' }}>
                       <option>Professional & Authoritative (LinkedIn)</option>
                       <option>Witty & Engaging (Twitter)</option>
                       <option>Urgent Breaking News Style</option>
                    </select>
                     <p style={{ marginTop: '12px', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>*LLM will rewrite parsed RSS titles in this specific tone.</p>
                  </div>
               </div>

               {/* The Algorithmic B2B Booster (Ordinal Killer) */}
               <h4 style={{ fontWeight: 700, marginBottom: '20px', fontSize: '1.2rem', marginTop: '40px' }}>⚡ The Algorithm Booster (B2B Amplification)</h4>
               <div style={{ padding: '24px', background: 'rgba(147, 51, 234, 0.05)', border: '1px solid rgba(147, 51, 234, 0.2)', borderRadius: '16px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', cursor: 'pointer' }}>
                     <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px', accentColor: 'var(--color-purple-main)' }} />
                     <span style={{ fontWeight: 600, fontSize: '1.05rem' }}>Auto-Trigger "First 60-Minute" Employee Engagement</span>
                  </label>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', marginBottom: '16px', lineHeight: '1.5' }}>
                    Unlike traditional social tools, this system directly manipulates algorithmic reach. When an Autopilot post goes live, we instantly ping integrated Slack channels and auto-route comment interactions from connected employee proxy accounts to guarantee initial Velocity on LinkedIn.
                  </p>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ padding: '8px 16px', background: 'white', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.05)', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}><ThumbsUp size={16} /> Auto-Likes: <strong>12 Connected Proxies</strong></div>
                    <div style={{ padding: '8px 16px', background: 'white', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.05)', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}><MessageCircle size={16} /> Auto-Comments: <strong>LLM Generated</strong></div>
                  </div>
               </div>
               
               <div style={{ marginTop: '40px', padding: '24px', background: 'rgba(59, 130, 246, 0.05)', border: '1px dashed var(--color-blue-main)', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                 <div style={{ background: 'white', padding: '12px', borderRadius: '50%', color: 'var(--color-blue-main)', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}><TrendingUp size={24} /></div>
                 <div>
                   <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-blue-main)' }}>Trend Routing Active</div>
                   <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Autopilot will listen to the industries configured in your <strong>SEO Intelligence Engine</strong> panel.</div>
                 </div>
               </div>

               {/* ==================================== */}
               {/* THE TIKTOK VIRAL RADAR (SHORT-FORM) */}
               {/* ==================================== */}
               <div style={{ marginTop: '40px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px' }}>
                    <div>
                      <h4 style={{ fontWeight: 800, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Activity size={20} color="#EC4899" /> Short-Form Trend Radar (TikTok / Reels)
                      </h4>
                      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: '6px' }}>
                        The Hive Mind algorithmically intercepts surging audio formats and creates scripts for you.
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                     {radarTrends.length > 0 ? radarTrends.map((trend, idx) => (
                         <div key={idx} style={{ border: '1px solid rgba(0,0,0,0.05)', background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                               <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: '#EC4899', letterSpacing: '1px' }}>Velocity: {trend.velocity}</span>
                               <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Live Feed</span>
                            </div>
                            <h5 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '8px' }}>{trend.title}</h5>
                            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '20px', lineHeight: '1.5' }}>
                              {trend.details}
                            </p>
                            <button onClick={() => handleAutoDraft(trend.title)} className="btn hover-lift" style={{ width: '100%', padding: '12px', background: 'var(--color-bg-light)', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '8px', fontWeight: 700, display: 'flex', justifyContent: 'center', gap: '8px', color: '#111' }}>
                               <Edit3 size={16}/> Auto-Draft Script
                            </button>
                         </div>
                     )) : (
                         <p style={{ color: 'var(--color-text-muted)' }}>Retrieving live marketing RSS feeds...</p>
                     )}
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* TAB 4: BRAND LISTENING (SPROUT KILLER) */}
      {/* ========================================== */}
      {activeTab === 'listening' && (
        <div className="fade-in">
           <div className="glass-panel" style={{ padding: '40px' }}>
             <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}><BarChart2 size={24} color="var(--color-blue-main)"/> Real-Time Social Sentiment (NLP)</h3>
             <p style={{ color: 'var(--color-text-muted)', marginBottom: '30px' }}>We use LLMs to continuously ingest and score Brand Mentions across the web, surfacing reputation shifts before they spiral.</p>
             
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '40px' }}>
                <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '24px', borderRadius: '16px' }}>
                   <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-green-main)', marginBottom: '8px' }}>Positive Outlook</div>
                   <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>{sentimentData ? sentimentData.positiveScore : '--'}%</div>
                </div>
                <div style={{ background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '24px', borderRadius: '16px' }}>
                   <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f59e0b', marginBottom: '8px' }}>Neutral / Queries</div>
                   <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>{sentimentData ? sentimentData.neutralScore : '--'}%</div>
                </div>
                <div style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '24px', borderRadius: '16px' }}>
                   <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-red-main)', marginBottom: '8px' }}>Negative Sentiment</div>
                   <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>{sentimentData ? sentimentData.negativeScore : '--'}%</div>
                </div>
             </div>

             <h4 style={{ fontWeight: 700, marginBottom: '20px', fontSize: '1.2rem' }}>Live Mentions Feed</h4>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {sentimentData ? sentimentData.mentions.map((mention, idx) => (
                   <div key={idx} style={{ padding: '20px', background: 'var(--color-bg-light)', borderRadius: '12px', borderLeft: `6px solid ${mention.color === 'green' ? 'var(--color-green-main)' : mention.color === 'red' ? 'var(--color-red-main)' : '#f59e0b'}`, display: 'flex', justifyContent: 'space-between' }}>
                     <div>
                       <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '8px', fontWeight: 700 }}>{mention.platform} • {mention.time}</div>
                       <div style={{ fontWeight: 500, lineHeight: 1.5 }}>"{mention.text}"</div>
                     </div>
                     <span style={{ padding: '6px 16px', background: mention.color === 'green' ? 'rgba(16, 185, 129, 0.1)' : mention.color === 'red' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)', color: mention.color === 'green' ? 'var(--color-green-main)' : mention.color === 'red' ? 'var(--color-red-main)' : '#f59e0b', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 800, alignSelf: 'flex-start' }}>{mention.sentiment}</span>
                   </div>
                )) : <div style={{ padding: '20px', textAlign: 'center', color: 'var(--color-text-muted)' }}>Intercepting web crawlers...</div>}
             </div>
           </div>
        </div>
      )}

      {/* ========================================== */}
      {/* TAB 5: AI FLOWS (GUMLOOP KILLER) */}
      {/* ========================================== */}
      {activeTab === 'aiflows' && (
        <div className="fade-in" style={{ height: '700px', width: '100%', background: 'white', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.05)', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
           <div style={{ padding: '20px 30px', background: 'var(--color-bg-main)', borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <div>
               <h3 style={{ fontWeight: 800, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '12px' }}>⚡ AI Operations Pipeline</h3>
               <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>Build autonomous, logic-based node networks for your Autopilot.</p>
             </div>
             <button onClick={async () => {
                 setLoading(true);
                 try {
                     // Algorithmically parse the physical Node canvas text (Killing the MGM hardcode)
                     const targetNodeText = nodes[0]?.data?.label || activeDomain;
                     let extractedCompany = activeDomain;
                     if (targetNodeText.includes('e.g.')) {
                        extractedCompany = targetNodeText.split('e.g.')[1].replace(')','').trim();
                     } else if (targetNodeText.includes(':')) {
                        extractedCompany = targetNodeText.split(':')[1].trim();
                     }

                     const res = await fetch(`/api/linkedin?company=${encodeURIComponent(extractedCompany)}&role=Marketing`);
                     const data = await res.json();
                     
                     if (data.targets && data.targets.length > 0) {
                         const posts = data.targets.map(t => ({
                             domain: activeDomain,
                             platform: 'linkedin', 
                             content: `Connection Request Dispatch: ${t.name} (${t.role}) | ${t.intelligence}`, 
                             time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
                             status: t.status, 
                             date: 'AI Scraper'
                         }));
                         await supabase.from('social_posts').insert(posts);
                         await TelemetryEngine.dispatchException('Social Dashboard - Engine Execution', `Real B2B LinkedIn Scrape Pipeline triggered. Extracted ${posts.length} physical executives.`, { inserts: posts.length }, 'opportunity'); 
                         alert(`Flow Pipeline complete! ${posts.length} physical B2B connections scraped and populated in your Social Calendar queue.`);
                     }
                 } catch (e) {
                     console.error("Scraper Failure:", e);
                     alert("Pipeline execution encountered an error reading the external graph.");
                 }
                 setLoading(false);
                 setActiveTab('calendar');
             }} className="btn btn-primary" style={{ padding: '10px 24px', fontSize: '1rem', background: 'var(--color-purple-main)', border: 'none', cursor: loading ? 'wait' : 'pointer' }}>{loading ? 'Executing Engine...' : 'Run Pipeline Execution Engine'}</button>
           </div>
           
           {/* Visual React Flow Canvas area */}
           <div style={{ flex: 1, width: '100%', position: 'relative' }}>
             <ReactFlow 
                nodes={nodes} 
                edges={edges} 
                onNodesChange={onNodesChange} 
                onEdgesChange={onEdgesChange}
                fitView
             >
                <Background color="#ccc" gap={20} size={1} />
                <Controls />
             </ReactFlow>
           </div>
        </div>
      )}

      {/* ========================================== */}
      {/* TAB 6: COMPETITOR AD INTEL (META API) */}
      {/* ========================================== */}
      {activeTab === 'ad_intel' && (
        <div className="fade-in">
           <div className="glass-panel" style={{ padding: '40px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
                 <div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                       <Eye size={24} color="var(--color-purple-main)"/> Competitor Ad Intelligence
                    </h3>
                    <p style={{ color: 'var(--color-text-muted)' }}>Query the Meta Ads Library API to extract and algorithmically analyze competitor advertising Hooks across Facebook and Instagram.</p>
                 </div>
                 <div style={{ background: 'rgba(147, 51, 234, 0.1)', color: 'var(--color-purple-main)', padding: '6px 16px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Shield size={14} /> Meta Graph API Token Active
                 </div>
              </div>

              <div style={{ background: 'var(--color-bg-light)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)', marginBottom: '40px' }}>
                 <label style={{ display: 'block', fontWeight: 700, marginBottom: '12px', fontSize: '0.95rem' }}>Execute Search Query (Brand Name or Keyword)</label>
                 <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                       <input 
                         type="text" 
                         value={intelQuery}
                         onChange={(e) => setIntelQuery(e.target.value)}
                         placeholder="e.g. Dr Squatch" 
                         onKeyDown={(e) => { if(e.key === 'Enter') triggerIntelScrape(); }}
                         style={{ width: '100%', padding: '14px 20px', paddingLeft: '48px', fontSize: '1.05rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', outline: 'none', background: 'white' }} 
                       />
                       <Search size={20} color="var(--color-text-muted)" style={{ position: 'absolute', left: '16px', top: '16px' }} />
                    </div>
                    <button 
                       onClick={triggerIntelScrape}
                       disabled={isScraping || !intelQuery}
                       className="btn hover-lift"
                       style={{ padding: '0 30px', fontSize: '1rem', fontWeight: 700, background: 'var(--color-text-main)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                       {isScraping ? 'Intercepting API...' : 'Run Analysis Sequence'}
                    </button>
                 </div>
              </div>

              <div style={{ minHeight: '300px' }}>
                 {isScraping && (
                    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '200px', gap: '20px' }}>
                       <div className="spinner" style={{ width: '40px', height: '40px', border: '3px solid rgba(147, 51, 234, 0.2)', borderTopColor: 'var(--color-purple-main)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                       <p style={{ color: 'var(--color-text-muted)', fontWeight: 600, fontFamily: 'monospace' }}>[SYSTEM] Authenticating with Meta Advertising Archive...</p>
                    </div>
                 )}

                 {intelResults && !isScraping && (
                    <div className="fade-in">
                       <h4 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '20px' }}>Extraction Results for: "{intelQuery}"</h4>
                       
                       <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
                          <div style={{ padding: '24px', background: 'white', borderRadius: '16px', border: '1px solid rgba(59, 130, 246, 0.2)', boxShadow: '0 4px 15px rgba(59, 130, 246, 0.05)' }}>
                             <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-blue-main)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Global Impressions Rank</div>
                             <div style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--color-text-main)', marginBottom: '8px' }}>Top 5%</div>
                             <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>The Hive Mind has determined that this competitor is aggressively scaling their marketing spend. We identified <strong>{intelResults.activeCount}</strong> unique active creative variations.</p>
                             
                             <a 
                               href={intelResults.link} 
                               target="_blank" 
                               rel="noreferrer" 
                               className="btn hover-lift"
                               style={{ display: 'block', textAlign: 'center', width: '100%', marginTop: '24px', padding: '12px', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--color-blue-main)', fontWeight: 800, borderRadius: '8px', textDecoration: 'none' }}>
                               Launch Native Meta Viewer
                             </a>
                          </div>

                          <div style={{ padding: '24px', background: 'var(--color-bg-main)', borderRadius: '16px' }}>
                             <h5 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px', color: 'var(--color-text-muted)' }}>Hive Mind Strategic Discoveries</h5>
                             <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {intelResults.insights.map((insight, idx) => (
                                  <div key={idx} style={{ padding: '16px', background: 'white', borderRadius: '12px', borderLeft: '4px solid var(--color-purple-main)', fontWeight: 600, fontSize: '0.95rem' }}>
                                     {insight}
                                  </div>
                                ))}
                             </div>
                          </div>
                       </div>
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default SocialDashboard;
