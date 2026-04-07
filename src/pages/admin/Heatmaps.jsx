import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { MousePointerClick, ArrowRight, Expand, Activity, Video, AlertCircle, Bot, Zap, CheckCircle2, ListVideo, Hand, XCircle } from 'lucide-react';

const Heatmaps = () => {
  const canvasRef = useRef(null);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [activeLayer, setActiveLayer] = useState('mouse');
  const [activeTab, setActiveTab] = useState('viewer');
  
  const [selectedSession, setSelectedSession] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Fake AI Session Data
  const MOCK_SESSIONS = [
    { id: 'sess_908a1', source: 'Google Organic', duration: '0m 42s', pages: 1, friction: 'High', device: 'Desktop - Mac', action: 'Rage Click Detected', summary: 'User dwelled on the primary pricing grid for 14 seconds. Triggered 5 rapid "Rage Clicks" on the inactive "Start Trial" button area before abandoning.' },
    { id: 'sess_908b2', source: 'Direct', duration: '2m 14s', pages: 3, friction: 'Low', device: 'Mobile - iOS', action: 'Checkout Reached', summary: 'Clean navigation path from Home -> Features -> Checkout. No friction detected. Conversion successful.' },
    { id: 'sess_908c3', source: 'Meta Ads', duration: '0m 12s', pages: 1, friction: 'Medium', device: 'Desktop - Win', action: 'Scroll Abandonment', summary: 'User scrolled 30% of the page. Hesitated on the feature list contrast. Bounced quickly.' },
    { id: 'sess_908d4', source: 'Google Organic', duration: '1m 05s', pages: 2, friction: 'High', device: 'Mobile - Android', action: 'Form Abandonment', summary: 'User attempted to fill out the contact form but the zip code field validation error caused aggressive scrolling and immediate drop-off.' }
  ];

  useEffect(() => {
    // 1. Instantly pull massive array of tracking coordinates from Supabase
    const fetchEventData = async () => {
      const { data, error } = await supabase
        .from('tracking_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3000); // Throttle render to last 3k events to prevent browser crash

      if (error) {
        console.error("Error pulling tracking data:", error);
      } else if (data) {
        setEvents(data);
      }
      setIsLoading(false);
    };

    fetchEventData();
  }, []);

  // 2. The Complex Canvas Rendering Engine
  useEffect(() => {
    if (!canvasRef.current || events.length === 0) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set Canvas native resolution to high fidelity
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (activeLayer === 'scroll') {
      // Algorithmic Scroll Density mapping (Hot top, cold bottom)
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, 'rgba(239, 68, 68, 0.7)'); // Hot Red
      gradient.addColorStop(0.3, 'rgba(245, 158, 11, 0.5)'); // Yellow Warmth
      gradient.addColorStop(0.6, 'rgba(16, 185, 129, 0.3)'); // Green Fade
      gradient.addColorStop(0.9, 'rgba(59, 130, 246, 0.1)'); // Blue Cold Tail
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
      const toRender = activeLayer === 'mouse' ? events.filter(e => e.event_type === 'move') : events.filter(e => e.event_type === 'click');

      toRender.forEach(point => {
        const adjustedX = (point.x_coord / point.viewport_width) * canvas.width;
        
        if (activeLayer === 'mouse') {
          // Render smooth 'thermal' radial gradients
          const gradient = ctx.createRadialGradient(adjustedX, point.y_coord, 0, adjustedX, point.y_coord, 40);
          gradient.addColorStop(0, 'rgba(16, 185, 129, 0.08)'); 
          gradient.addColorStop(0.5, 'rgba(59, 130, 246, 0.04)'); 
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = gradient;
          ctx.fillRect(adjustedX - 40, point.y_coord - 40, 80, 80);
        } else {
          // Render sharp, aggressive 'Impact' gradients for Clicks
          const gradient = ctx.createRadialGradient(adjustedX, point.y_coord, 0, adjustedX, point.y_coord, 20);
          gradient.addColorStop(0, 'rgba(239, 68, 68, 0.8)'); 
          gradient.addColorStop(1, 'rgba(239, 68, 68, 0)');
          ctx.fillStyle = gradient;
          ctx.fillRect(adjustedX - 20, point.y_coord - 20, 40, 40);
        }
      });
    }

  }, [events, activeLayer]);

  return (
    <div>
      <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <MousePointerClick size={36} color="var(--color-green-main)" /> Thermal Mapping
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>
            Visualizing real-time behavioral user data.
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '8px', background: 'rgba(0,0,0,0.05)', padding: '4px', borderRadius: '12px' }}>
          <button 
             onClick={() => setActiveTab('viewer')}
             style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, background: activeTab === 'viewer' ? 'white' : 'transparent', color: activeTab === 'viewer' ? 'var(--color-text-main)' : 'var(--color-text-muted)', boxShadow: activeTab === 'viewer' ? '0 2px 10px rgba(0,0,0,0.05)' : 'none' }}>
             Data Viewer
          </button>
          <button 
             onClick={() => setActiveTab('replays')}
             style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, background: activeTab === 'replays' ? 'white' : 'transparent', color: activeTab === 'replays' ? 'var(--color-text-main)' : 'var(--color-text-muted)', boxShadow: activeTab === 'replays' ? '0 2px 10px rgba(0,0,0,0.05)' : 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
             <ListVideo size={16} /> Session Replays
          </button>
          <button 
             onClick={() => setActiveTab('settings')}
             style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, background: activeTab === 'settings' ? 'white' : 'transparent', color: activeTab === 'settings' ? 'var(--color-text-main)' : 'var(--color-text-muted)', boxShadow: activeTab === 'settings' ? '0 2px 10px rgba(0,0,0,0.05)' : 'none' }}>
             Tracker Configuration
          </button>
        </div>
      </div>

      {activeTab === 'viewer' && (
        <div className="glass-panel fade-in" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Controls */}
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>

            <div style={{ display: 'flex', gap: '8px', background: 'var(--color-bg-light)', padding: '6px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)' }}>
               <button onClick={() => setActiveLayer('mouse')} className="hover-lift" style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: activeLayer === 'mouse' ? 'white' : 'transparent', color: activeLayer === 'mouse' ? '#111' : 'var(--color-text-muted)', boxShadow: activeLayer === 'mouse' ? '0 4px 12px rgba(16, 185, 129, 0.2)' : 'none', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}><Hand size={16} color={activeLayer === 'mouse' ? '#10B981' : 'currentColor'}/> Mouse Motion</button>
               <button onClick={() => setActiveLayer('clicks')} className="hover-lift" style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: activeLayer === 'clicks' ? 'white' : 'transparent', color: activeLayer === 'clicks' ? '#111' : 'var(--color-text-muted)', boxShadow: activeLayer === 'clicks' ? '0 4px 12px rgba(239, 68, 68, 0.2)' : 'none', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}><MousePointerClick size={16} color={activeLayer === 'clicks' ? '#EF4444' : 'currentColor'}/> Click Density</button>
               <button onClick={() => setActiveLayer('scroll')} className="hover-lift" style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: activeLayer === 'scroll' ? 'white' : 'transparent', color: activeLayer === 'scroll' ? '#111' : 'var(--color-text-muted)', boxShadow: activeLayer === 'scroll' ? '0 4px 12px rgba(245, 158, 11, 0.2)' : 'none', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}><Activity size={16} color={activeLayer === 'scroll' ? '#F59E0B' : 'currentColor'}/> Scroll Depth</button>
            </div>

            <select 
              disabled={localStorage.getItem('nexus_role') === 'client'}
              style={{ 
                flexGrow: 1, padding: '12px 16px', borderRadius: '12px', 
                border: localStorage.getItem('nexus_role') === 'client' ? '1px dashed rgba(0,0,0,0.2)' : '1px solid rgba(0,0,0,0.1)', 
                background: localStorage.getItem('nexus_role') === 'client' ? 'rgba(0,0,0,0.02)' : 'white', 
                outline: 'none', color: localStorage.getItem('nexus_role') === 'client' ? 'var(--color-text-muted)' : 'var(--color-text-main)',
                cursor: localStorage.getItem('nexus_role') === 'client' ? 'not-allowed' : 'pointer'
              }}
            >
              {localStorage.getItem('nexus_role') === 'client' ? (
                <option>Project: Goodys Popcorn (Locked)</option>
              ) : (
                <>
                  <option>Project: 75 Squared Agency (localhost)</option>
                  <option>Project: Client Demo Store</option>
                  <option>Project: Goodys Popcorn</option>
                </>
              )}
            </select>
            <select style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', background: 'white', outline: 'none' }}>
              <option>Path: /</option>
              <option>Path: /pricing</option>
            </select>
            <div style={{ padding: '12px 24px', borderRadius: '12px', background: 'var(--color-bg-light)', border: '1px solid rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
              <span style={{ color: 'var(--color-green-main)' }}>●</span> Live Data: {events.length.toLocaleString()} pts
            </div>
          </div>

          {/* Workspace Renderer - This is where the magic happens */}
          <div style={{ 
            position: 'relative', 
            width: '100%', 
            height: '700px', 
            background: 'var(--color-bg-light)', 
            borderRadius: '16px', 
            border: '1px solid rgba(0,0,0,0.05)',
            overflow: 'hidden'
          }}>
            {isLoading && (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.8)', zIndex: 10 }}>
                 <h2>Syncing with Supabase...</h2>
              </div>
            )}

            <iframe 
              src="http://localhost:5173" 
              title="Heatmap Target Canvas"
              style={{ width: '100%', height: '100%', border: 'none', pointerEvents: 'none' }}
            />

            <canvas 
              ref={canvasRef}
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.8 }}
            />
          </div>
        </div>
      )}

      {activeTab === 'replays' && (
        <div className="glass-panel fade-in" style={{ padding: '30px' }}>
           <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Video size={24} color="var(--color-purple-main)" /> AI-Audited Session Replays
           </h2>
           <p style={{ color: 'var(--color-text-muted)', marginBottom: '30px', maxWidth: '800px', lineHeight: '1.6' }}>
              Nexus AI automatically reviews every single heatmap session, categorizing friction drops and automatically flagging UI design failures for Ghost Editor autonomous remediation.
           </p>
           
           <div style={{ width: '100%', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '12px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: 'var(--color-bg-light)', borderBottom: '1px solid rgba(0,0,0,0.05)', color: 'var(--color-text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '16px' }}>Session ID</th>
                    <th style={{ padding: '16px' }}>Traffic Source</th>
                    <th style={{ padding: '16px' }}>Duration</th>
                    <th style={{ padding: '16px' }}>Friction Score</th>
                    <th style={{ padding: '16px' }}>AI Trigger</th>
                    <th style={{ padding: '16px' }}>Audit</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_SESSIONS.map(sess => (
                    <tr key={sess.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', background: 'white' }}>
                       <td style={{ padding: '16px', fontWeight: 600 }}>{sess.id}</td>
                       <td style={{ padding: '16px', color: 'var(--color-purple-main)', fontWeight: 600 }}>{sess.source}</td>
                       <td style={{ padding: '16px', color: 'var(--color-text-muted)' }}>{sess.duration} ({sess.pages} pages)</td>
                       <td style={{ padding: '16px' }}>
                          <span style={{ display: 'inline-block', padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 800, background: sess.friction === 'High' ? 'rgba(239,68,68,0.1)' : sess.friction === 'Medium' ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)', color: sess.friction === 'High' ? '#EF4444' : sess.friction === 'Medium' ? '#F59E0B' : '#10B981' }}>{sess.friction} Risk</span>
                       </td>
                       <td style={{ padding: '16px', color: 'var(--color-text-main)', fontSize: '0.9rem', fontWeight: 600 }}>{sess.action}</td>
                       <td style={{ padding: '16px' }}>
                          <button onClick={() => setSelectedSession(sess)} className="btn btn-primary hover-lift" style={{ padding: '8px 16px', fontSize: '0.8rem', borderRadius: '6px' }}>Play AI Audit</button>
                       </td>
                    </tr>
                  ))}
                </tbody>
              </table>
           </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="fade-in glass-panel" style={{ padding: '40px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '8px' }}>Performance Throttling (Phase 10)</h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '40px', maxWidth: '800px', lineHeight: '1.6' }}>
            Configure exactly how your embedded trackers behave on client websites. Use these parameters to dramatically reduce browser CPU consumption and guarantee your client's web vitals (paint speed) are never harmed.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px' }}>
             
             {/* Throttling: Time Bound */}
             <div>
               <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '20px' }}>Operating Hours</h3>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                 <div style={{ padding: '20px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', background: 'var(--color-bg-light)' }}>
                   <label style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1rem', fontWeight: 600 }}>
                     <input type="radio" name="hours" defaultChecked /> Always On (24/7)
                   </label>
                 </div>
                 
                 <div style={{ padding: '20px', borderRadius: '12px', border: '2px solid var(--color-purple-main)', background: 'rgba(147, 51, 234, 0.02)' }}>
                   <label style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1rem', fontWeight: 600 }}>
                     <input type="radio" name="hours" /> Constrained Window
                   </label>
                   <p style={{ marginTop: '8px', fontSize: '0.85rem', color: 'var(--color-text-muted)', paddingLeft: '28px', marginBottom: '16px' }}>Destroy event listeners outside these hours.</p>
                   
                   <div style={{ paddingLeft: '28px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                     <input type="time" defaultValue="09:00" style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)', outline: 'none' }} />
                     <span style={{ color: 'var(--color-text-muted)', fontWeight: 600 }}>to</span>
                     <input type="time" defaultValue="17:00" style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)', outline: 'none' }} />
                   </div>
                 </div>
               </div>
             </div>

             {/* Throttling: Duration */}
             <div>
               <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '20px' }}>Campaign Duration</h3>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                 <div style={{ padding: '20px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', background: 'var(--color-bg-light)' }}>
                   <label style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1rem', fontWeight: 600 }}>
                     <input type="radio" name="duration" defaultChecked /> Infinite Duration
                   </label>
                 </div>
                 
                 <div style={{ padding: '20px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', background: 'var(--color-bg-light)' }}>
                   <label style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1rem', fontWeight: 600 }}>
                     <input type="radio" name="duration" /> Specific Timeframe
                   </label>
                   
                   <div style={{ paddingLeft: '28px', display: 'flex', gap: '12px', alignItems: 'center', marginTop: '16px' }}>
                     <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Auto-disable after</span>
                     <select style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)', outline: 'none', background: 'white' }}>
                       <option>3 days</option>
                       <option>7 days</option>
                       <option>14 days</option>
                       <option>30 days</option>
                     </select>
                   </div>
                 </div>
               </div>
             </div>

             {/* Throttling: Sampling */}
             <div>
               <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '20px' }}>Traffic Sampling</h3>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                 <div style={{ padding: '20px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', background: 'var(--color-bg-light)' }}>
                   <label style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1rem', fontWeight: 600 }}>
                     <input type="radio" name="sample" defaultChecked /> 100% Tracking
                   </label>
                 </div>
                 
                 <div style={{ padding: '20px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', background: 'var(--color-bg-light)' }}>
                   <label style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1rem', fontWeight: 600 }}>
                     <input type="radio" name="sample" /> Fractional Target
                   </label>
                   
                   <div style={{ paddingLeft: '28px', display: 'flex', gap: '12px', alignItems: 'center', marginTop: '16px' }}>
                     <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Track 1 /</span>
                     <select style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)', outline: 'none', background: 'white' }}>
                       <option>5 visitors</option>
                       <option>10 visitors</option>
                       <option>100 visitors</option>
                     </select>
                   </div>
                 </div>
               </div>
             </div>

          </div>
          
          <button className="btn btn-primary hover-lift" style={{ marginTop: '40px' }}>Apply Configuration to Edge Trackers</button>
        </div>
      )}

      {/* Session Replay Modal */}
      {selectedSession && (
        <div className="fade-in" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' }}>
           <div className="glass-panel" style={{ width: '1200px', maxWidth: '95vw', background: 'white', padding: '0', overflow: 'hidden', display: 'flex', height: '75vh', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.2)' }}>
              
              {/* Fake Video Player area representing the Session */}
              <div style={{ flex: 2, background: '#09090b', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', borderRight: '1px solid rgba(0,0,0,0.1)' }}>
                 <div style={{ position: 'absolute', top: '24px', left: '24px', background: 'rgba(255,255,255,0.1)', color: 'white', padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700, display: 'flex', gap: '8px', zIndex: 10, backdropFilter: 'blur(10px)' }}>
                    <div className="pulse-dot" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444', marginTop: '5px' }}></div> 
                    Session Playback Active
                 </div>
                 
                 <div style={{ width: '80%', height: '65%', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
                    {/* Placeholder content for "video" */}
                    <div style={{ height: '40px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '8px', padding: '0 16px', alignItems: 'center' }}>
                       <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }}></div>
                       <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }}></div>
                       <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }}></div>
                    </div>
                    <div style={{ padding: '60px', color: 'rgba(255,255,255,0.8)', textAlign: 'center', fontSize: '2.5rem', fontWeight: 900, opacity: 0.5 }}>75² Nexus Viewport</div>
                    
                    {/* Fake rage click ripple */}
                    {selectedSession.friction === 'High' && (
                       <div style={{ position: 'absolute', top: '55%', left: '50%', width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(239,68,68,0.2)', transform: 'translate(-50%, -50%)', border: '3px solid rgba(239, 68, 68, 0.8)', animation: 'pulse 1.5s infinite' }}></div>
                    )}
                 </div>

                 {/* Video controls bottom bar */}
                 <div style={{ position: 'absolute', bottom: '30px', left: '40px', right: '40px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ color: 'white', fontWeight: 600, fontSize: '0.9rem' }}>0:12</div>
                    <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', position: 'relative' }}>
                       <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: '45%', background: 'var(--color-purple-main)', borderRadius: '3px' }}></div>
                       {selectedSession.friction === 'High' && (
                         <div style={{ position: 'absolute', left: '44%', top: '-2px', height: '10px', width: '4px', background: '#EF4444', borderRadius: '2px' }}></div>
                       )}
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 600, fontSize: '0.9rem' }}>{selectedSession.duration}</div>
                 </div>
              </div>

              {/* AI Auditor Analysis Pane */}
              <div style={{ flex: 1, background: '#f8fafc', padding: '40px', display: 'flex', flexDirection: 'column' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '10px' }}><Bot size={24} color="var(--color-purple-main)" /> Auditor Summary</h3>
                    <button onClick={() => setSelectedSession(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }} className="hover-lift"><XCircle size={24} /></button>
                 </div>
                 
                 <div style={{ padding: '24px', background: 'white', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)', marginBottom: '24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', gap: '20px', paddingBottom: '16px', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                       <div>
                          <span style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Source Node</span>
                          <strong style={{ color: '#111', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}><Activity size={14} color="var(--color-purple-main)"/> {selectedSession.source}</strong>
                       </div>
                       <div>
                          <span style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Client Device</span>
                          <strong style={{ color: '#111', fontSize: '1rem' }}>{selectedSession.device}</strong>
                       </div>
                    </div>
                    
                    <div style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                       <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: selectedSession.friction === 'High' ? '#EF4444' : '#111', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {selectedSession.friction === 'High' && <AlertCircle size={18} />}
                          {selectedSession.action}
                       </h4>
                       <p style={{ fontSize: '1.05rem', color: 'var(--color-text-muted)', lineHeight: '1.7' }}>"{selectedSession.summary}"</p>
                    </div>
                 </div>

                 {/* The Bridge to Ghost Editor */}
                 {selectedSession.friction === 'High' && (
                    <button 
                       onClick={() => {
                          setSelectedSession(null);
                          setToastMessage('SEO Sync: Context uploaded. Background Ghost Editor process queued for autonomous DOM remediation.');
                          setTimeout(() => setToastMessage(''), 5000);
                       }}
                       className="btn hover-lift" style={{ width: '100%', padding: '20px', background: 'var(--color-purple-main)', color: 'white', border: 'none', fontWeight: 800, borderRadius: '16px', fontSize: '1.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', boxShadow: '0 10px 30px rgba(147, 51, 234, 0.4)' }}>
                       <Zap size={22} fill="currentColor" /> Hand to Ghost Editor for Auto-Fix
                    </button>
                 )}
                 {selectedSession.friction !== 'High' && (
                    <div style={{ textAlign: 'center', padding: '20px', color: '#10B981', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', border: '2px dashed rgba(16,185,129,0.3)', borderRadius: '16px', background: 'rgba(16,185,129,0.05)', fontSize: '1.1rem' }}>
                       <CheckCircle2 size={22} /> Metric Healthy. No Mutation Required.
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}

      {/* Cross-Tool Toast Notification */}
      {toastMessage && (
         <div className="fade-in" style={{ position: 'fixed', bottom: '40px', right: '40px', background: '#111', color: 'white', padding: '20px 30px', borderRadius: '16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', zIndex: 10001, border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '20px', background: 'rgba(147, 51, 234, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <Bot size={24} color="#C084FC" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
               <span style={{ fontSize: '0.85rem', color: '#C084FC', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 800 }}>Nexus Background Process</span>
               <span style={{ fontSize: '1rem' }}>{toastMessage}</span>
            </div>
         </div>
      )}

    </div>
  );
};

export default Heatmaps;
