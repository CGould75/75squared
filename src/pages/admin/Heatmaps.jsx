import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { MousePointerClick, ArrowRight, Expand, Activity } from 'lucide-react';

const Heatmaps = () => {
  const canvasRef = useRef(null);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

    const moveEvents = events.filter(e => e.event_type === 'move');
    const clickEvents = events.filter(e => e.event_type === 'click');

    // Render smooth 'thermal' radial gradients for standard mouse movements (Blue/Green)
    moveEvents.forEach(point => {
      // Adjust X coordinate dynamically based on the user's viewport vs the recorded viewport width
      // This ensures heatmaps scale properly across different desktop monitors!
      const adjustedX = (point.x_coord / point.viewport_width) * canvas.width;
      
      const gradient = ctx.createRadialGradient(adjustedX, point.y_coord, 0, adjustedX, point.y_coord, 40);
      gradient.addColorStop(0, 'rgba(16, 185, 129, 0.08)'); // High heat center (Green)
      gradient.addColorStop(0.5, 'rgba(59, 130, 246, 0.04)'); // Mid heat (Blue)
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)'); // Fade to transparent
      
      ctx.fillStyle = gradient;
      ctx.fillRect(adjustedX - 40, point.y_coord - 40, 80, 80);
    });

    // Render sharp, aggressive 'Impact' gradients for physical Clicks (Red)
    clickEvents.forEach(point => {
      const adjustedX = (point.x_coord / point.viewport_width) * canvas.width;
      
      const gradient = ctx.createRadialGradient(adjustedX, point.y_coord, 0, adjustedX, point.y_coord, 20);
      gradient.addColorStop(0, 'rgba(239, 68, 68, 0.8)'); // Aggressive click point (Red)
      gradient.addColorStop(1, 'rgba(239, 68, 68, 0)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(adjustedX - 20, point.y_coord - 20, 40, 40);
    });

  }, [events]);

  const [activeTab, setActiveTab] = useState('viewer');

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
             onClick={() => setActiveTab('settings')}
             style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, background: activeTab === 'settings' ? 'white' : 'transparent', color: activeTab === 'settings' ? 'var(--color-text-main)' : 'var(--color-text-muted)', boxShadow: activeTab === 'settings' ? '0 2px 10px rgba(0,0,0,0.05)' : 'none' }}>
             Tracker Configuration
          </button>
        </div>
      </div>

      {activeTab === 'viewer' && (
        <div className="glass-panel fade-in" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Controls */}
          <div style={{ display: 'flex', gap: '20px' }}>
            <select 
              disabled={localStorage.getItem('nexus_role') === 'client'}
              style={{ 
                flexGrow: 1, padding: '12px 16px', borderRadius: '12px', 
                border: localStorage.getItem('nexus_role') === 'client' ? '1px dashed rgba(0,0,0,0.2)' : '1px solid rgba(0,0,0,0.1)', 
                background: localStorage.getItem('nexus_role') === 'client' ? 'rgba(0,0,0,0.02)' : 'var(--color-bg-light)', 
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
            <select style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', background: 'var(--color-bg-light)', outline: 'none' }}>
              <option>Path: /</option>
              <option>Path: /contact</option>
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
          
          <button className="btn btn-primary" style={{ marginTop: '40px' }}>Apply Configuration to Edge Trackers</button>
        </div>
      )}

    </div>
  );
};

export default Heatmaps;
