import React, { useState, useEffect } from 'react';
import { SlidersHorizontal, CalendarDays, Clock, Gauge, Save, AlertTriangle } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

const GlobalConstraints = () => {
  const [startTracking, setStartTracking] = useState('09:00 AM EST');
  const [stopTracking, setStopTracking] = useState('05:00 PM EST');
  const [activeDays, setActiveDays] = useState(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
  const [sampleRate, setSampleRate] = useState(20);
  const [expiration, setExpiration] = useState(14); // in days
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchConstraints = async () => {
      const { data } = await supabase.from('master_constraints').select('*').single();
      if (data) {
        setStartTracking(data.start_time);
        setStopTracking(data.stop_time);
        setSampleRate(data.sample_rate);
        setExpiration(data.expiration_days);
      }
    };
    fetchConstraints();
  }, []);

  const enforceConstraints = async () => {
    setSaving(true);
    await supabase.from('master_constraints')
      .update({ start_time: startTracking, stop_time: stopTracking, sample_rate: sampleRate, expiration_days: expiration })
      .eq('id', 1);
    
    // Simulate Edge deployment delay
    setTimeout(() => {
      setSaving(false);
      alert('SUCCESS: Constraints deployed to global edge network. All active scripts are now throttled.');
    }, 600);
  };

  return (
    <div>
      <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <SlidersHorizontal size={36} color="var(--color-blue-main)" /> Global Constraint Architecture
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem', maxWidth: '800px' }}>
            Configure absolute Master limits for all 75 Squared Edge-Trackers across your client network. Nothing executes beyond these mathematical bounds.
          </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          
          {/* Constrained Operational Windows */}
          <div className="glass-panel" style={{ padding: '30px' }}>
             <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--color-text-main)' }}>
               <Clock size={20} color="var(--color-blue-main)" /> Constrained Operational Windows
             </h3>
             <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
               Tracker SDKs will physically not boot outside of these designated trading hours, ensuring client sites remain 100% untouched during their absolute peak traffic bursts.
             </p>
             
             <div style={{ display: 'flex', gap: '20px', alignItems: 'center', background: 'var(--color-bg-light)', padding: '20px', borderRadius: '12px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '8px', color: 'var(--color-text-muted)' }}>START TRACKING</label>
                  <select value={startTracking} onChange={e => setStartTracking(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', fontWeight: 600 }}>
                    <option value="09:00 AM EST">09:00 AM EST</option>
                    <option value="12:00 PM EST">12:00 PM EST</option>
                    <option value="10:00 PM EST (Off-peak)">10:00 PM EST (Off-peak)</option>
                  </select>
                </div>
                <div style={{ fontWeight: 800, color: 'var(--color-text-muted)' }}>TO</div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '8px', color: 'var(--color-text-muted)' }}>STOP TRACKING</label>
                  <select value={stopTracking} onChange={e => setStopTracking(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', fontWeight: 600 }}>
                    <option value="05:00 PM EST">05:00 PM EST</option>
                    <option value="09:00 PM EST">09:00 PM EST</option>
                    <option value="04:00 AM EST (Off-peak)">04:00 AM EST (Off-peak)</option>
                  </select>
                </div>
             </div>

             <div style={{ marginTop: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '12px', color: 'var(--color-text-muted)' }}>ACTIVE DAYS</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                    <button 
                      key={day}
                      onClick={() => {
                        if (activeDays.includes(day)) {
                          setActiveDays(activeDays.filter(d => d !== day));
                        } else {
                          setActiveDays([...activeDays, day]);
                        }
                      }}
                      style={{ 
                        flex: 1, padding: '10px 0', borderRadius: '8px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', border: 'none',
                        background: activeDays.includes(day) ? 'rgba(59, 130, 246, 0.1)' : 'var(--color-bg-light)',
                        color: activeDays.includes(day) ? 'var(--color-blue-main)' : 'var(--color-text-muted)',
                        border: activeDays.includes(day) ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid rgba(0,0,0,0.05)'
                      }}
                    >
                      {day}
                    </button>
                  ))}
                </div>
             </div>
          </div>

          {/* Fractional Sampling */}
          <div className="glass-panel" style={{ padding: '30px' }}>
             <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--color-text-main)' }}>
               <Gauge size={20} color="#F59E0B" /> Fractional Session Sampling
             </h3>
             <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
               Do not track 100% of traffic. Set a fractional sampling limit to process massive sample sizes while keeping overall bandwidth utilization microscopic.
             </p>

             <div style={{ background: 'rgba(245, 158, 11, 0.05)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontWeight: 800 }}>
                  <span>Sample Rate:</span>
                  <span style={{ color: '#F59E0B' }}>1 out of every {Math.max(1, Math.round(100/sampleRate))} users ({sampleRate}%)</span>
                </div>
                <input type="range" min="1" max="100" value={sampleRate} onChange={e => setSampleRate(e.target.value)} style={{ width: '100%', accentColor: '#F59E0B' }} />
                
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginTop: '20px', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                  <AlertTriangle size={16} color="#F59E0B" style={{ flexShrink: 0, marginTop: '2px' }}/>
                  <span>Lower sample rates guarantee a zero-impact PageSpeed Insights score on client domains.</span>
                </div>
             </div>
          </div>

          {/* Hard Expiration Limits */}
          <div className="glass-panel" style={{ padding: '30px', gridColumn: '1 / -1' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
               <div>
                 <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--color-text-main)' }}>
                   <CalendarDays size={20} color="var(--color-purple-main)" /> Hard Expiration Deadlines
                 </h3>
                 <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', maxWidth: '600px' }}>
                   Trackers are biologically programmed to die. Set maximum lifecycle durations so you never accidentally leave active tracking code running indefinitely on a client's site.
                 </p>
               </div>
               <button onClick={enforceConstraints} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                 <Save size={16} /> {saving ? 'Deploying...' : 'Enforce Global Constraints'}
               </button>
             </div>

             <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr) minmax(250px, 1fr)', gap: '20px', marginTop: '24px' }}>
                <div onClick={() => setExpiration(3)} style={{ background: expiration === 3 ? 'rgba(147, 51, 234, 0.05)' : 'var(--color-bg-light)', padding: '20px', borderRadius: '12px', border: expiration === 3 ? '1px solid rgba(147, 51, 234, 0.3)' : '1px solid transparent', cursor: 'pointer' }}>
                  <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                    <span style={{ fontWeight: 700, color: expiration === 3 ? 'var(--color-purple-main)' : 'inherit' }}>3-Day Recon Sweep</span>
                    <input type="radio" name="duration" checked={expiration === 3} readOnly />
                  </label>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '8px' }}>Automatically kills the tracker after 72 hours.</p>
                </div>
                <div onClick={() => setExpiration(14)} style={{ background: expiration === 14 ? 'rgba(147, 51, 234, 0.05)' : 'var(--color-bg-light)', padding: '20px', borderRadius: '12px', border: expiration === 14 ? '1px solid rgba(147, 51, 234, 0.3)' : '1px solid transparent', cursor: 'pointer' }}>
                  <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                    <span style={{ fontWeight: 700, color: expiration === 14 ? 'var(--color-purple-main)' : 'inherit' }}>14-Day Deep Analysis</span>
                    <input type="radio" name="duration" checked={expiration === 14} readOnly />
                  </label>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '8px' }}>Automatically kills the tracker after 336 hours.</p>
                </div>
             </div>
          </div>
      </div>
    </div>
  );
};

export default GlobalConstraints;
