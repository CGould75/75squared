import React, { useState } from 'react';
import { ShieldAlert, Lock, AlertOctagon, FileText, CheckCircle2, ToggleLeft, ToggleRight, Fingerprint, RefreshCcw, PowerOff, ShieldCheck } from 'lucide-react';

const SecurityCenter = () => {
  const [tosSigned, setTosSigned] = useState(false);
  const [piiScrubber, setPiiScrubber] = useState(true);
  const [circuitBreaker, setCircuitBreaker] = useState(true);
  const [sreSystemStatus, setSreSystemStatus] = useState('online');

  const triggerSystemToggle = () => {
    if (sreSystemStatus === 'online') {
      if (window.confirm("CRITICAL WARNING: This will instantly sever all AI edge connections across the global network. All client sites will revert to their static DOM state. Proceed?")) {
        setSreSystemStatus('offline');
      }
    } else {
      if (window.confirm("SYSTEM OVERRIDE: Re-engaging the Autonomous SRE. AI mutation operations will resume synchronously across all active clients. Proceed?")) {
        setSreSystemStatus('online');
      }
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '16px', color: '#EF4444' }}>
            <ShieldAlert size={36} color="#EF4444" /> Security & Liability Center
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem', maxWidth: '800px' }}>
            Mission-critical compliance safeguards. By modifying third-party DOM architecture via edge trackers, 75 Squared Nexus inherits severe risk. Ensure all anti-liability protocols below are active.
          </p>
        </div>
        
        <button 
          onClick={triggerSystemToggle}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 24px', borderRadius: '12px', fontSize: '1rem', fontWeight: 800, cursor: 'pointer', background: sreSystemStatus === 'offline' ? '#10B981' : '#EF4444', color: 'white', border: 'none', boxShadow: sreSystemStatus === 'offline' ? '0 10px 25px rgba(16, 185, 129, 0.4)' : '0 10px 25px rgba(239, 68, 68, 0.4)', transition: 'all 0.2s', animation: sreSystemStatus === 'offline' ? 'pulse 2s infinite' : 'none' }}>
          {sreSystemStatus === 'offline' ? <ShieldCheck size={24} /> : <PowerOff size={24} />} 
          {sreSystemStatus === 'offline' ? 'RE-ENGAGE SYSTEM CORE' : 'NUCLEAR GLOBAL KILL SWITCH'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '40px' }}>
         
         {/* System Lockout Panel */}
         <div className="glass-panel" style={{ padding: '30px', display: 'flex', flexDirection: 'column', border: tosSigned ? '1px solid rgba(16, 185, 129, 0.3)' : '2px solid #EF4444' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <FileText size={20} color={tosSigned ? '#10B981' : '#EF4444'} /> Client Liability Waiver
            </h3>
            
            <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.6', fontSize: '0.95rem', marginBottom: '24px' }}>
              The Ghost Editor and Autonomous SRE are currently physically locked. The client must cryptographically sign the liability acknowledgement before executing automated DOM injection on their domain. 
            </p>

            <div style={{ background: 'var(--color-bg-light)', padding: '16px', borderRadius: '12px', fontSize: '0.85rem', fontFamily: 'monospace', color: 'var(--color-text-main)', marginBottom: '24px', overflowY: 'auto', maxHeight: '200px' }}>
              By engaging the Nexus Autonomous SRE and Ghost Editor, the user ("Client") authorizes 75 Squared ("Agency") to execute asynchronous Javascript insertion on the Client's domain. Client holds Agency harmless for any temporary UI degradation, conversion rate drops, or infinite-loop render panics. Agency liability is strictly limited to $0.00.
            </div>

            {tosSigned ? (
               <div style={{ padding: '16px', background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 700, marginTop: 'auto' }}>
                 <CheckCircle2 size={20}/> Cryptographic Signature Verified
               </div>
            ) : (
               <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <label style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', fontSize: '0.9rem', cursor: 'pointer' }}>
                    <input type="checkbox" style={{ marginTop: '4px' }} onChange={(e) => setTosSigned(e.target.checked)} />
                    <span>I acknowledge the sheer power of this system and absolve 75 Squared of all liability related to automated DOM mutations.</span>
                  </label>
               </div>
            )}
         </div>

         {/* Technical Safeguards */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            <div className="glass-panel" style={{ padding: '30px', borderLeft: '4px solid var(--color-blue-main)' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Fingerprint size={20} color="var(--color-blue-main)" /> Zero-Trust PII Scrubber
                    </h3>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>Defend against GDPR/CCPA litigation by dropping sensitive keystrokes at the edge node.</p>
                  </div>
                  <button onClick={() => setPiiScrubber(!piiScrubber)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    {piiScrubber ? <ToggleRight size={36} color="#10B981" /> : <ToggleLeft size={36} color="var(--color-text-muted)" />}
                  </button>
               </div>
               
               <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                 <span style={{ fontSize: '0.8rem', background: 'var(--color-bg-light)', padding: '6px 12px', borderRadius: '20px', fontWeight: 600 }}>type="password"</span>
                 <span style={{ fontSize: '0.8rem', background: 'var(--color-bg-light)', padding: '6px 12px', borderRadius: '20px', fontWeight: 600 }}>type="credit-card"</span>
                 <span style={{ fontSize: '0.8rem', background: 'var(--color-bg-light)', padding: '6px 12px', borderRadius: '20px', fontWeight: 600 }}>data-nexus-sensitive</span>
               </div>
            </div>

            <div className="glass-panel" style={{ padding: '30px', borderLeft: '4px solid #F59E0B' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <RefreshCcw size={20} color="#F59E0B" /> Mutation Circuit Breakers
                    </h3>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>Prevent infinite re-render loops from destroying the client's web vitals.</p>
                  </div>
                  <button onClick={() => setCircuitBreaker(!circuitBreaker)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    {circuitBreaker ? <ToggleRight size={36} color="#10B981" /> : <ToggleLeft size={36} color="var(--color-text-muted)" />}
                  </button>
               </div>
               
               <p style={{ color: 'var(--color-text-main)', fontSize: '0.95rem' }}>
                 If the AI tracker attempts an architectural edit and detects an identical DOM crash within 500ms, the remote tracker mathematically severs its own websocket connection for 24 hours. The client's site immediately falls back to original state.
               </p>
            </div>

         </div>
      </div>
    </div>
  );
};

export default SecurityCenter;
