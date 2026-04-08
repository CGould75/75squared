import React, { useState } from 'react';
import { CreditCard, Check, Zap, Shield, Mail, TrendingUp, MousePointerClick, FileText, Cpu, AlertTriangle } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

const Billing = () => {
  const [activeTier, setActiveTier] = useState('starter'); // 'starter' | 'agency' | 'enterprise'
  const [tiers, setTiers] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchBillingPlans = async () => {
      // Pull live pricing and domain quota structures from the database
      const { data } = await supabase.from('nexus_billing_plans').select('*').order('price_int', { ascending: true });
      if (data) {
        setTiers(data);
      }
      setLoading(false);
    };
    fetchBillingPlans();
  }, []);

  return (
    <div>
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <CreditCard size={36} color="var(--color-purple-main)" /> Billing & Subscriptions
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>
          Manage your SaaS tier to unlock structural access to advanced modules.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px' }}>
        {tiers.map((tier) => (
          <div key={tier.id} className="glass-panel" style={{ 
            padding: '40px 30px', 
            position: 'relative', 
            border: tier.highlight ? '2px solid var(--color-purple-main)' : '1px solid rgba(0,0,0,0.05)',
            transform: tier.highlight ? 'translateY(-10px)' : 'none',
            boxShadow: tier.highlight ? '0 20px 40px rgba(147, 51, 234, 0.1)' : '0 10px 30px rgba(0,0,0,0.02)'
          }}>
            {tier.highlight && (
              <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translate(-50%, -50%)', background: 'var(--color-purple-main)', color: 'white', padding: '4px 16px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '1px' }}>
                MOST POPULAR
              </div>
            )}
            
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '8px' }}>{tier.name}</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '24px', height: '40px' }}>{tier.description}</p>
            
            <div style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '30px', display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              {tier.price} <span style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>/mo</span>
            </div>

            <button 
              className={tier.id === activeTier ? 'btn' : tier.highlight ? 'btn btn-primary' : 'btn btn-outline'} 
              style={{ width: '100%', justifyContent: 'center', marginBottom: '40px', background: tier.id === activeTier ? 'rgba(16, 185, 129, 0.1)' : '', color: tier.id === activeTier ? 'var(--color-green-main)' : '', border: tier.id === activeTier ? '1px solid rgba(16, 185, 129, 0.4)' : '' }}
              onClick={() => setActiveTier(tier.id)}
            >
              {tier.id === activeTier ? 'Current Plan' : 'Select Plan'}
            </button>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {tier.features.map((feature, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', color: feature.enabled ? 'var(--color-text-main)' : 'var(--color-text-muted)', opacity: feature.enabled ? 1 : 0.5 }}>
                  <div style={{ marginTop: '2px' }}>
                    {feature.enabled ? <Check size={18} color="var(--color-green-main)" /> : <Shield size={18} color="var(--color-text-muted)" />}
                  </div>
                  <span style={{ fontSize: '0.95rem', fontWeight: feature.enabled ? 600 : 500 }}>{feature.name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Module Access Visualizer */}
      <div className="glass-panel" style={{ marginTop: '40px', padding: '40px' }}>
         <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
           <Zap size={24} color="#eab308" /> Module Access Granted: {activeTier.toUpperCase()}
         </h2>
         <p style={{ color: 'var(--color-text-muted)', marginBottom: '30px' }}>This Stripe webhook simulation shows exactly which dashboards the client has access to under their current subscription tier.</p>
         
         <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ padding: '20px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-green-main)', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 700 }}><Mail size={20} /> Broadcasts Active</div>
            <div style={{ padding: '20px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-green-main)', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 700 }}><MousePointerClick size={20} /> Heatmaps Active</div>
            
            {/* Conditional Modules */}
            <div style={{ padding: '20px', borderRadius: '12px', background: activeTier !== 'starter' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: activeTier !== 'starter' ? 'var(--color-green-main)' : '#ef4444', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 700 }}>
              <TrendingUp size={20} /> 
              {activeTier !== 'starter' ? 'SEO Active' : 'SEO Locked'}
            </div>

            <div style={{ padding: '20px', borderRadius: '12px', background: activeTier === 'enterprise' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: activeTier === 'enterprise' ? 'var(--color-green-main)' : '#ef4444', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 700 }}>
              <FileText size={20} /> 
              {activeTier === 'enterprise' ? 'Content Studio Active' : 'Content Studio Locked'}
            </div>
         </div>
      </div>

      {/* API Consumption Metrix */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', marginTop: '40px' }}>
         <div className="glass-panel" style={{ padding: '40px', borderLeft: '4px solid #F59E0B' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Cpu size={24} color="#F59E0B" /> Autonomous Engine API Consumption
            </h2>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '30px', maxWidth: '800px' }}>
              The Action Center Auto-Pilot is governed by the mathematical limits defined in your Global Constraints. This tracks active Claude/OpenAI payload burn for the current 24-hour window.
            </p>

            <div style={{ background: 'var(--color-bg-light)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontWeight: 800, fontSize: '1.1rem' }}>
                 <span>Current Daily Payload Burn</span>
                 <span style={{ color: '#F59E0B' }}>$3.45 / $5.00 Limit</span>
               </div>
               
               {/* Progress Bar */}
               <div style={{ width: '100%', height: '12px', background: 'rgba(0,0,0,0.1)', borderRadius: '6px', overflow: 'hidden', marginBottom: '16px' }}>
                  <div style={{ width: '69%', height: '100%', background: 'linear-gradient(90deg, #10B981, #F59E0B)', borderRadius: '6px' }}></div>
               </div>

               <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                 <AlertTriangle size={16} color="#F59E0B" style={{ flexShrink: 0, marginTop: '2px' }}/>
                 <span>If the budget hits $5.00, the Auto-Pilot will pause execution operations and route all further anomalies to the manual Action Center Queue.</span>
               </div>
            </div>
         </div>
      </div>

    </div>
  );
};

export default Billing;
