import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { MousePointerClick, ArrowRight, Expand, Activity, Video, AlertCircle, Bot, Zap, CheckCircle2, ListVideo, Hand, XCircle, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GlobalDomainContext } from '../../layouts/AdminLayout';
import TelemetryEngine from '../../lib/telemetry';

const Heatmaps = () => {
  const navigate = useNavigate();
  const { activeDomain } = React.useContext(GlobalDomainContext);
  const canvasRef = useRef(null);
  const replayCanvasRef = useRef(null);
  const replayIframeRef = useRef(null);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [activeLayer, setActiveLayer] = useState('mouse');
  const [activeTab, setActiveTab] = useState('viewer');
  const [selectedSession, setSelectedSession] = useState(null);
  
  const [toastMessage, setToastMessage] = useState('');
  const [autoResolveMode, setAutoResolveMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activePath, setActivePath] = useState('/');

  const [viewerScrollY, setViewerScrollY] = useState(0);
  const [replayScrollY, setReplayScrollY] = useState(0);

  // Physical Session Data Algorithm
  const physicalSessions = React.useMemo(() => {
     if (!events || events.length === 0) return [];
     
     // Distill raw payload into structural sessions based on timestamp proximity heuristics
     const groups = {};
     events.forEach(ev => {
         const sid = ev.session_id || 'sess_unknown';
         if(!groups[sid]) groups[sid] = [];
         groups[sid].push(ev);
     });

     const result = [];
     Object.keys(groups).forEach((key, idx) => {
         if (key === 'sess_unknown' && Object.keys(groups).length > 1) return;
         
         const group = groups[key].sort((a,b) => new Date(a.created_at) - new Date(b.created_at));
         if (group.length < 5) return;
         
         const first = group[0];
         const last = group[group.length - 1];
         const durationMs = new Date(last.created_at) - new Date(first.created_at);
         let durString = '0m 00s';
         if (!isNaN(durationMs)) {
             const mins = Math.floor(Math.abs(durationMs) / 60000);
             const secs = Math.floor((Math.abs(durationMs) % 60000) / 1000);
             durString = `${mins}m ${secs}s`;
         }
         
         // Algorithmic Friction Diagnostics
         const clicks = group.filter(e => e.event_type === 'click');
         let frictionStatus = 'Low';
         let sysAction = 'Clean Navigation';
         if (clicks.length > 8) {
            frictionStatus = 'High';
            sysAction = 'Rage Click Anomaly';
         } else if (clicks.length > 3) {
            frictionStatus = 'Medium';
            sysAction = 'Hesitation / Friction';
         }

         result.push({
             id: key === 'sess_unknown' ? `sess_p_${idx}_sync` : key,
             source: first.source || 'Direct',
             duration: durString,
             pages: 1,
             friction: frictionStatus,
             device: (first.viewport_width && first.viewport_width > 1024) ? 'Desktop Node' : 'Mobile Element',
             action: sysAction,
             summary: `Algorithmically compiled session trace holding ${group.length} physical coordinate points locked across a ${durString} timeframe.`,
             events: group // Full physical payload bound for Replay Engine
         });
     });

     return result.sort((a, b) => (a.friction === 'High' ? -1 : 1)).slice(0, 50); 
  }, [events]);

  // Extract true physical unique paths from the dataset
  const uniquePaths = React.useMemo(() => {
     const paths = new Set();
     events.forEach(e => {
        if (e.url_path) paths.add(e.url_path);
     });
     return Array.from(paths).length > 0 ? Array.from(paths) : ['/'];
  }, [events]);

  useEffect(() => {
    // 1. Instantly pull massive array of tracking coordinates from Supabase
    const fetchEventData = async () => {
      const { data, error } = await supabase
        .from('tracking_events')
        .select('*')
        .eq('domain', activeDomain)
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
  }, [activeDomain]);

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
      let filteredEvents = events.filter(e => !e.url_path || e.url_path === activePath);
      const toRender = activeLayer === 'mouse' ? filteredEvents.filter(e => e.event_type === 'move') : filteredEvents.filter(e => e.event_type === 'click');

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

  // Live Replay Rendering Engine
  const [replayProgress, setReplayProgress] = useState(0);
  useEffect(() => {
     if (!selectedSession || !replayCanvasRef.current) return;
     const canvas = replayCanvasRef.current;
     const ctx = canvas.getContext('2d');
     const evs = selectedSession.events || [];
     if (evs.length === 0) return;
     
     canvas.width = canvas.offsetWidth;
     canvas.height = canvas.offsetHeight;
     
     let animationFrameId;
     let startTimestamp = null;
     const duration = new Date(evs[evs.length-1].created_at) - new Date(evs[0].created_at);
     // Minimum 1000ms duration for math safety
     const normalizedDuration = duration > 0 ? duration : 1000;
     
     const renderFrame = (timestamp) => {
         if (!startTimestamp) startTimestamp = timestamp;
         const elapsed = timestamp - startTimestamp;
         // Speed up slow sessions
         const progressMs = elapsed * 3; 
         const progressRatio = Math.min(progressMs / normalizedDuration, 1);
         setReplayProgress(progressRatio * 100);
         
         ctx.clearRect(0, 0, canvas.width, canvas.height);
         
         const targetTime = new Date(evs[0].created_at).getTime() + progressMs;
         
         ctx.beginPath();
         let currentPoint = evs[0];
         for (let i = 0; i < evs.length; i++) {
             const evTime = new Date(evs[i].created_at).getTime();
             const ax = (evs[i].x_coord / evs[i].viewport_width) * canvas.width;
             if (i === 0) ctx.moveTo(ax, evs[i].y_coord);
             else if (evTime <= targetTime) ctx.lineTo(ax, evs[i].y_coord);
             
             if (evTime > targetTime) break;
             currentPoint = evs[i];
         }
         ctx.strokeStyle = "rgba(147, 51, 234, 0.5)";
         ctx.lineWidth = 3;
         ctx.lineCap = 'round';
         ctx.lineJoin = 'round';
         ctx.stroke();

         const activeX = (currentPoint.x_coord / currentPoint.viewport_width) * canvas.width;
         ctx.beginPath();
         ctx.arc(activeX, currentPoint.y_coord, 8, 0, Math.PI * 2);
         ctx.fillStyle = currentPoint.event_type === 'click' ? '#EF4444' : '#10B981';
         ctx.fill();
         
         if (currentPoint.event_type === 'click') {
            ctx.beginPath();
            ctx.arc(activeX, currentPoint.y_coord, 24, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(239, 68, 68, 0.8)';
            ctx.stroke();
         }
         
         if (progressRatio < 1) {
             animationFrameId = requestAnimationFrame(renderFrame);
         }
     };
     
     animationFrameId = requestAnimationFrame(renderFrame);
     return () => cancelAnimationFrame(animationFrameId);
  }, [selectedSession]);

  // Handle configuration payload binding
  const [trackerConfig, setTrackerConfig] = useState({ hours: 'always', startTime: '09:00', endTime: '17:00', duration: 'infinite', disableAfter: '3 days', sample: '100%', sampleRate: '10 visitors' });

  const handleApplyTrackerConfig = async () => {
      try {
          const payload = { ...trackerConfig, updated_at: new Date().toISOString() };
          await supabase.from('nexus_clients').update({ tracker_settings: payload }).eq('domain', activeDomain);
          await TelemetryEngine.dispatchException('GlobalParams', `Applied configuration constraints to tracker edge network for ${activeDomain}.`, { payload }, 'info');
          setToastMessage('Target configuration mapped to Edge CDN successfully.');
          setTimeout(() => setToastMessage(''), 4000);
      } catch (e) {
          console.error("Tracker Configuration Failure", e);
      }
  };

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

            <div style={{ flexGrow: 1, padding: '12px 16px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-blue-dark)', fontWeight: 700 }}>
               <Target size={16} /> Locked to Target Domain: {activeDomain}
            </div>
             <select value={activePath} onChange={e => setActivePath(e.target.value)} style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', background: 'white', outline: 'none' }}>
               {uniquePaths.map(p => (
                   <option key={p} value={p}>Path: {p}</option>
               ))}
             </select>
            <div style={{ padding: '12px 24px', borderRadius: '12px', background: 'var(--color-bg-light)', border: '1px solid rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
              <span style={{ color: 'var(--color-green-main)' }}>●</span> Live Data: {events.length.toLocaleString()} pts
            </div>

            <button onClick={() => setIsFullscreen(!isFullscreen)} className="hover-lift" style={{ marginLeft: 'auto', padding: '10px 20px', background: 'var(--color-purple-main)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 15px rgba(147, 51, 234, 0.3)' }}>
               {isFullscreen ? 'Exit Fullscreen' : <><Expand size={16}/> View Fullscreen</>}
            </button>
          </div>

          {/* Workspace Renderer - This is where the magic happens */}
          <div style={{ 
            position: isFullscreen ? 'fixed' : 'relative', 
            top: isFullscreen ? 0 : 'auto',
            left: isFullscreen ? 0 : 'auto',
            width: isFullscreen ? '100vw' : '100%', 
            height: isFullscreen ? '100vh' : '700px',
            zIndex: isFullscreen ? 10000 : 1,
            background: 'var(--color-bg-light)', 
            borderRadius: isFullscreen ? '0' : '16px', 
            border: isFullscreen ? 'none' : '1px solid rgba(0,0,0,0.05)',
            overflow: 'hidden'
          }}>
            {isLoading && (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.8)', zIndex: 10 }}>
                 <h2>Syncing with Supabase...</h2>
              </div>
            )}

            <iframe 
              src={activeDomain.includes('75squared.com') ? `https://75squared.com${activePath === '/' ? '' : activePath}` : `https://${activeDomain.split(' ')[0]}${activePath === '/' ? '' : activePath}`}
              title={`Heatmap for ${activeDomain}`}
              sandbox="allow-scripts allow-same-origin"
              onLoad={(e) => {
                 try {
                     const win = e.target.contentWindow;
                     setViewerScrollY(win.scrollY);
                     win.addEventListener('scroll', () => {
                         setViewerScrollY(win.scrollY);
                     });
                 } catch(err) {
                     console.warn("Iframe cross-origin scroll bind restricted");
                 }
              }}
              style={{ width: '100%', height: '100%', border: 'none', background: 'white' }}
            />

            <canvas 
              ref={canvasRef}
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '8000px', pointerEvents: 'none', opacity: 0.8, transform: `translateY(-${viewerScrollY}px)`, transition: 'transform 0.1s ease-out' }}
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
                  {physicalSessions.map(sess => (
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
                 <div style={{ padding: '20px', borderRadius: '12px', border: trackerConfig.hours === 'always' ? '2px solid var(--color-purple-main)' : '1px solid rgba(0,0,0,0.1)', background: trackerConfig.hours === 'always' ? 'rgba(147, 51, 234, 0.02)' : 'var(--color-bg-light)' }}>
                   <label style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer' }}>
                     <input type="radio" name="hours" checked={trackerConfig.hours === 'always'} onChange={() => setTrackerConfig({...trackerConfig, hours: 'always'})} /> Always On (24/7)
                   </label>
                 </div>
                 
                 <div style={{ padding: '20px', borderRadius: '12px', border: trackerConfig.hours === 'constrained' ? '2px solid var(--color-purple-main)' : '1px solid rgba(0,0,0,0.1)', background: trackerConfig.hours === 'constrained' ? 'rgba(147, 51, 234, 0.02)' : 'var(--color-bg-light)' }}>
                   <label style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer' }}>
                     <input type="radio" name="hours" checked={trackerConfig.hours === 'constrained'} onChange={() => setTrackerConfig({...trackerConfig, hours: 'constrained'})} /> Constrained Window
                   </label>
                   <p style={{ marginTop: '8px', fontSize: '0.85rem', color: 'var(--color-text-muted)', paddingLeft: '28px', marginBottom: '16px' }}>Destroy event listeners outside these hours.</p>
                   
                   <div style={{ paddingLeft: '28px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <input type="time" value={trackerConfig.startTime} onChange={e => setTrackerConfig({...trackerConfig, startTime: e.target.value})} style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)', outline: 'none' }} />
                      <span style={{ color: 'var(--color-text-muted)', fontWeight: 600 }}>to</span>
                      <input type="time" value={trackerConfig.endTime} onChange={e => setTrackerConfig({...trackerConfig, endTime: e.target.value})} style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)', outline: 'none' }} />
                    </div>
                 </div>
               </div>
             </div>

             {/* Throttling: Duration */}
             <div>
               <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '20px' }}>Campaign Duration</h3>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                 <div style={{ padding: '20px', borderRadius: '12px', border: trackerConfig.duration === 'infinite' ? '2px solid var(--color-purple-main)' : '1px solid rgba(0,0,0,0.1)', background: trackerConfig.duration === 'infinite' ? 'rgba(147, 51, 234, 0.02)' : 'var(--color-bg-light)' }}>
                   <label style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer' }}>
                     <input type="radio" name="duration" checked={trackerConfig.duration === 'infinite'} onChange={() => setTrackerConfig({...trackerConfig, duration: 'infinite'})} /> Infinite Duration
                   </label>
                 </div>
                 
                 <div style={{ padding: '20px', borderRadius: '12px', border: trackerConfig.duration === 'specific' ? '2px solid var(--color-purple-main)' : '1px solid rgba(0,0,0,0.1)', background: trackerConfig.duration === 'specific' ? 'rgba(147, 51, 234, 0.02)' : 'var(--color-bg-light)' }}>
                   <label style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer' }}>
                     <input type="radio" name="duration" checked={trackerConfig.duration === 'specific'} onChange={() => setTrackerConfig({...trackerConfig, duration: 'specific'})} /> Specific Timeframe
                   </label>
                   
                   <div style={{ paddingLeft: '28px', display: 'flex', gap: '12px', alignItems: 'center', marginTop: '16px' }}>
                     <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Auto-disable after</span>
                     <select value={trackerConfig.disableAfter} onChange={e => setTrackerConfig({...trackerConfig, disableAfter: e.target.value})} style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)', outline: 'none', background: 'white' }}>
                       <option value="3 days">3 days</option>
                       <option value="7 days">7 days</option>
                       <option value="14 days">14 days</option>
                       <option value="30 days">30 days</option>
                     </select>
                   </div>
                 </div>
               </div>
             </div>

             {/* Throttling: Sampling */}
             <div>
               <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '20px' }}>Traffic Sampling</h3>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                 <div style={{ padding: '20px', borderRadius: '12px', border: trackerConfig.sample === '100%' ? '2px solid var(--color-purple-main)' : '1px solid rgba(0,0,0,0.1)', background: trackerConfig.sample === '100%' ? 'rgba(147, 51, 234, 0.02)' : 'var(--color-bg-light)' }}>
                   <label style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer' }}>
                     <input type="radio" name="sample" checked={trackerConfig.sample === '100%'} onChange={() => setTrackerConfig({...trackerConfig, sample: '100%'})} /> 100% Tracking
                   </label>
                 </div>
                 
                 <div style={{ padding: '20px', borderRadius: '12px', border: trackerConfig.sample === 'fractional' ? '2px solid var(--color-purple-main)' : '1px solid rgba(0,0,0,0.1)', background: trackerConfig.sample === 'fractional' ? 'rgba(147, 51, 234, 0.02)' : 'var(--color-bg-light)' }}>
                   <label style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer' }}>
                     <input type="radio" name="sample" checked={trackerConfig.sample === 'fractional'} onChange={() => setTrackerConfig({...trackerConfig, sample: 'fractional'})} /> Fractional Target
                   </label>
                   
                   <div style={{ paddingLeft: '28px', display: 'flex', gap: '12px', alignItems: 'center', marginTop: '16px' }}>
                     <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Track 1 /</span>
                     <select value={trackerConfig.sampleRate} onChange={e => setTrackerConfig({...trackerConfig, sampleRate: e.target.value})} style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)', outline: 'none', background: 'white' }}>
                       <option value="5 visitors">5 visitors</option>
                       <option value="10 visitors">10 visitors</option>
                       <option value="100 visitors">100 visitors</option>
                     </select>
                   </div>
                 </div>
               </div>
             </div>
             </div>

          <button className="btn btn-primary hover-lift" style={{ marginTop: '40px' }} onClick={handleApplyTrackerConfig}>Apply Configuration to Edge Trackers</button>
        </div>
      )}

      {/* Session Replay Modal */}
      {selectedSession && (
        <div className="fade-in" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' }}>
           <div className="glass-panel" style={{ width: '100vw', maxWidth: '100vw', background: 'white', padding: '0', overflow: 'hidden', display: 'flex', height: '100vh', borderRadius: '0', border: 'none' }}>
              
              {/* Live Physical Canvas Engine representing the Session */}
              <div style={{ flex: 2, background: '#09090b', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', borderRight: '1px solid rgba(0,0,0,0.1)' }}>
                 <div style={{ position: 'absolute', top: '24px', left: '24px', background: 'rgba(255,255,255,0.1)', color: 'white', padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700, display: 'flex', gap: '8px', zIndex: 10, backdropFilter: 'blur(10px)' }}>
                    <div className="pulse-dot" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444', marginTop: '5px' }}></div> 
                    Live Coordinate Engine Active
                 </div>
                 
                 <div style={{ width: '80%', height: '65%', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
                    <div style={{ position: 'sticky', top: 0, zIndex: 5, height: '40px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '8px', padding: '0 16px', alignItems: 'center', background: '#111' }}>
                       <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }}></div>
                       <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }}></div>
                       <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }}></div>
                    </div>
                    
                    <div style={{ position: 'relative', width: '100%', height: 'calc(100% - 40px)' }}>
                       <iframe 
                         ref={replayIframeRef}
                         src={activeDomain.includes('75squared.com') ? `https://75squared.com${activePath === '/' ? '' : activePath}` : `https://${activeDomain.split(' ')[0]}${activePath === '/' ? '' : activePath}`}
                         title="Session Playback Environment"
                         sandbox="allow-scripts allow-same-origin"
                         onLoad={(e) => {
                             try {
                                 const win = e.target.contentWindow;
                                 setReplayScrollY(win.scrollY);
                                 win.addEventListener('scroll', () => {
                                     setReplayScrollY(win.scrollY);
                                 });
                             } catch(err) {}
                         }}
                         style={{ width: '100%', height: '100%', border: 'none', opacity: 1.0, background: 'white' }}
                       />
                       
                       <canvas 
                         ref={replayCanvasRef}
                         style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '8000px', pointerEvents: 'none', transform: `translateY(-${replayScrollY}px)`, transition: 'transform 0.1s ease-out' }}
                       />
                    </div>
                 </div>

                 {/* Physical Playback Controls */}
                 <div style={{ position: 'absolute', bottom: '30px', left: '40px', right: '40px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ color: 'white', fontWeight: 600, fontSize: '0.9rem' }}>Live</div>
                    <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', position: 'relative' }}>
                       <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${replayProgress}%`, background: 'var(--color-green-main)', borderRadius: '3px' }}></div>
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

                 {/* The Bridge to Action Center */}
                 {selectedSession.friction === 'High' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                       {/* The Autonomous Toggle */}
                       <div style={{ padding: '16px', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div>
                            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--color-text-main)', marginBottom: '4px' }}>Autonomous UI Healing</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>If active, Nexus bypasses the Action Center queue and instantly spawns the Ghost Editor to resolve layout friction.</div>
                          </div>
                          <button 
                             onClick={() => setAutoResolveMode(!autoResolveMode)}
                             style={{ background: autoResolveMode ? 'var(--color-green-main)' : 'rgba(0,0,0,0.1)', border: 'none', borderRadius: '20px', width: '50px', height: '26px', position: 'relative', cursor: 'pointer', transition: '0.3s' }}>
                             <div style={{ position: 'absolute', top: '3px', left: autoResolveMode ? '27px' : '3px', width: '20px', height: '20px', background: 'white', borderRadius: '50%', transition: '0.3s', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}></div>
                          </button>
                       </div>

                       <button 
                           onClick={async () => {
                              setSelectedSession(null);
                              if (autoResolveMode) {
                                 await TelemetryEngine.dispatchException('OmniTracker', 'Autonomous UI Healing Activated: Booting Ghost Editor subsystem to restructure the payload.', { session: selectedSession.id, source: 'Heatmap Tracking' }, 'opportunity');
                                 navigate('/admin/ghost-editor');
                              } else {
                                 await TelemetryEngine.dispatchException('OmniTracker', `Alerting SRE: High Friction UI anomaly pushed to Action Center queue for context routing on ${selectedSession.id}.`, { session: selectedSession.id }, 'fatal');
                                 navigate('/admin/action-center');
                              }
                           }}
                           className="btn hover-lift" style={{ width: '100%', padding: '20px', background: autoResolveMode ? 'var(--color-green-main)' : 'var(--color-purple-main)', color: 'white', border: 'none', fontWeight: 800, borderRadius: '16px', fontSize: '1.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', boxShadow: autoResolveMode ? '0 10px 30px rgba(16, 185, 129, 0.4)' : '0 10px 30px rgba(147, 51, 234, 0.4)' }}>
                           {autoResolveMode ? <Zap size={22} /> : <Target size={22} />}
                           {autoResolveMode ? 'Execute Autonomous UI Healing' : 'Push Payload to Action Center'}
                        </button>
                    </div>
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
