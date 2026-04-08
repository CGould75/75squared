import React, { useState, useEffect, useContext } from 'react';
import { Sparkles, Layers, ArrowRightLeft, Smartphone, Monitor, Target, CheckCircle2, Save, AlertTriangle } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { GlobalDomainContext } from '../../layouts/AdminLayout';

const LiquidUI = () => {
  const [activeRule, setActiveRule] = useState(null);
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const { activeDomain } = useContext(GlobalDomainContext);

  useEffect(() => {
    const fetchRules = async () => {
      const { data } = await supabase.from('liquid_rules')
        .select('*')
        .eq('client_id', activeDomain)
        .order('id', { ascending: true });
      if (data && data.length > 0) {
        setRules(data);
        setActiveRule(data[0].id);
      } else {
        setRules([]);
        setActiveRule(null);
      }
      setLoading(false);
    };
    fetchRules();
  }, [activeDomain]);

  return (
    <div>
       <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Sparkles size={36} color="var(--color-purple-main)" /> Generative UI Engine
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem', maxWidth: '800px' }}>
            Transcend A/B testing. Design liquid psychological layouts that physically generate on the fly based on the user's inbound intent and biomechanics.
          </p>
       </div>

       <div style={{ display: 'grid', gridTemplateColumns: 'minmax(350px, 1fr) 2fr', gap: '30px' }}>
          
          {/* Rules List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
             <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>Active Rulesets</h3>
             {rules.map(rule => (
                <div 
                  key={rule.id} 
                  onClick={() => setActiveRule(rule.id)}
                  style={{ 
                    padding: '20px', 
                    background: activeRule === rule.id ? 'white' : 'var(--color-bg-light)', 
                    border: activeRule === rule.id ? '2px solid var(--color-purple-main)' : '1px solid rgba(0,0,0,0.05)', 
                    borderRadius: '12px', 
                    cursor: 'pointer',
                    boxShadow: activeRule === rule.id ? '0 10px 25px rgba(147, 51, 234, 0.1)' : 'none'
                  }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                     <h4 style={{ fontWeight: 800, fontSize: '1.05rem', color: activeRule === rule.id ? 'var(--color-purple-main)' : 'var(--color-text-main)' }}>{rule.name}</h4>
                     {rule.status === 'active' ? (
                       <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10B981' }}></span>
                     ) : (
                       <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#F59E0B' }}></span>
                     )}
                   </div>
                   <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>
                     {rule.condition.substring(0, 40)}...
                   </div>
                </div>
             ))}
             <button className="btn btn-outline" style={{ marginTop: '16px', borderStyle: 'dashed' }}>
               + Create New Liquid Rule
             </button>
          </div>

          {/* Canvas Configuration */}
          <div className="glass-panel" style={{ padding: '40px' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
               <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Rule Configuration Node</h2>
               <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                 <Save size={16} /> Deploy to Edge
               </button>
             </div>

             {/* Condition Builder */}
             <div style={{ background: 'var(--color-bg-light)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)', marginBottom: '30px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Target size={18} /> IF (Inbound Intent)
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                   <div>
                     <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>Traffic Source</label>
                     <select style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', outline: 'none' }}>
                       <option>UTM Source = tiktok</option>
                       <option>UTM Source = linkedin</option>
                       <option>Direct Traffic</option>
                     </select>
                   </div>
                   <div>
                     <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>Device / Hardware</label>
                     <select style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', outline: 'none' }}>
                       <option>Mobile (Gyroscope Active)</option>
                       <option>Desktop (Hover-States Active)</option>
                     </select>
                   </div>
                </div>
             </div>

             <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px', color: 'var(--color-text-muted)' }}>
               <ArrowRightLeft size={32} style={{ transform: 'rotate(90deg)' }} />
             </div>

             {/* Action Builder */}
             <div style={{ background: 'rgba(147, 51, 234, 0.03)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(147, 51, 234, 0.2)' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-purple-main)', textTransform: 'uppercase', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Layers size={18} /> THEN (Generative Action)
                </h3>
                <div style={{ marginBottom: '20px' }}>
                   <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>LLM Layout Schema</label>
                   <select style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(147, 51, 234, 0.3)', outline: 'none', background: 'white' }}>
                     <option>High-Friction / Punchy (Optimized for Gen-Z)</option>
                     <option>Deep-Read / Whitepaper (Optimized for C-Suite)</option>
                     <option>High Urgency (Countdown + Discount)</option>
                   </select>
                </div>
                
                <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.05)' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>Computed Result</div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
                    When users matching the above constraints visit the site, the edge node will intercept the physical HTML `&lt;body&gt;` payload and use LLM rendering to inject the <strong>High-Friction</strong> typography and layout scheme before the browser renders the first paint.
                  </p>
                </div>
                
                {/* Global CSS Theme Engine Warning */}
                <div style={{ marginTop: '20px', padding: '16px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                   <AlertTriangle size={20} color="#EF4444" style={{ flexShrink: 0, marginTop: '2px' }} />
                   <div>
                       <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#B91C1C', marginBottom: '4px' }}>Global Constraints Protocol</div>
                       <div style={{ fontSize: '0.85rem', color: '#B91C1C', lineHeight: '1.5' }}>
                           Variant Generation will be hard-constrained to the core brand token CSS (colors, generic fonts). The engine will reject any payload attempting to inject unapproved structural anomalies or off-brand assets in order to maintain universal brand parity.
                       </div>
                   </div>
                </div>
             </div>

          </div>

       </div>
    </div>
  );
};

export default LiquidUI;
