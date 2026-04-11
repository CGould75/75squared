import React, { useState } from 'react';
import { Lock, ArrowRight, Shield, Eye, EyeOff, LayoutDashboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SEOHead from '../../components/SEOHead';

import { supabase } from '../../lib/supabaseClient';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(true);
  const navigate = useNavigate();
  
  // URL Parameter Detection for Email Campaigns
  const urlParams = new URLSearchParams(window.location.search);
  const isVipInvite = urlParams.get('invite') === 'vip';

  React.useEffect(() => {
     if (isVipInvite) {
        setIsLoginMode(false); // Force default to Signup mode
     }
  }, [isVipInvite]);

  const handleAuthPayload = async (e) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setAuthError('');
    
    if (isLoginMode) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setAuthError(error.message);
        setIsAuthenticating(false);
      } else {
        // Extrapolate dynamic metadata from Supabase
        const meta = data?.user?.user_metadata || {};
        
        let role = meta.role || 'client';
        let clientName = meta.tenant_name;
        
        // Critical Security Failsafe:
        // Prevent earlier VIP signups (which were given 'admin' in metadata) from gaining Global Super Admin rights.
        if (role === 'admin' && !email.toLowerCase().includes('75squared.com')) {
           role = 'client'; 
        }

        if (email.toLowerCase() === 'chris@75squared.com' || email.includes('admin@75squared.com')) {
           role = 'admin';
           clientName = '75 Squared (Master)';
        }

        if (!clientName) {
           const prefix = email.split('@')[0];
           clientName = prefix.charAt(0).toUpperCase() + prefix.slice(1) + ' Workspace';
        }

        localStorage.setItem('nexus_role', role);
        localStorage.setItem('nexus_client', clientName);
        navigate('/admin');
      }
    } else {
      // Signup Mode Logic
      const prefix = email.split('@')[0];
      const generatedTenantName = prefix.charAt(0).toUpperCase() + prefix.slice(1) + ' Workspace';
      
      const signUpPayload = { email, password };
      
      signUpPayload.options = {
         data: {
            tenant_name: generatedTenantName,
            source: isVipInvite ? 'vip_beta_email' : 'organic_signup',
            tier: isVipInvite ? 'enterprise' : 'starter',
            role: 'client' // Strictly enforce client role for all non-manual overrides
         }
      };

      const { data, error } = await supabase.auth.signUp(signUpPayload);
      if (error) {
        setAuthError(error.message);
        setIsAuthenticating(false);
      } else {
        if (isVipInvite) {
           setAuthError("VIP Registration successful! You have been granted Enterprise tier access. Check your email to verify your account.");
        } else {
           setAuthError("Registration successful! Check your email to verify your account before logging in.");
        }
        setIsAuthenticating(false);
        setIsLoginMode(true);
      }
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg-light)', padding: '20px' }}>
      <SEOHead title="Nexus Portal Login" description="Secure access to the 75 Squared Nexus analytics and marketing engine." path="/admin/login" />
      
      <div className="glass-panel" style={{ width: '100%', maxWidth: '440px', padding: '40px' }}>
        <div style={{ textAlign: 'left', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
             <LayoutDashboard size={28} color="var(--color-text-main)" />
             <span style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>75² Nexus</span>
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '12px' }}>{isLoginMode ? 'Sign in' : 'Create Account'}</h1>
          <p style={{ color: 'var(--color-text-main)', fontSize: '0.95rem' }}>
            {isLoginMode ? 'New to Nexus? ' : 'Already have an account? '}
            <button 
              onClick={() => { setIsLoginMode(!isLoginMode); setAuthError(''); }}
              style={{ background: 'none', border: 'none', padding: 0, color: 'var(--color-text-main)', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.95rem' }}
            >
              {isLoginMode ? 'Create an Account' : 'Sign In'}
            </button>
          </p>
        </div>

        <div style={{ background: '#F8F8F8', borderRadius: '8px', padding: '16px', marginBottom: '24px' }}>
           <p style={{ fontSize: '0.9rem', color: 'var(--color-text-main)', lineHeight: '1.5', margin: 0 }}>
             By clicking "{isLoginMode ? 'Sign In' : 'Sign Up'}" below, you agree to Nexus's Universal <a href="#" style={{ color: 'var(--color-text-main)', textDecoration: 'underline' }}>Terms of Service</a> (updated Feb 2, 2026) and <a href="#" style={{ color: 'var(--color-text-main)', textDecoration: 'underline' }}>Privacy Policy</a>.
           </p>
        </div>

        {isVipInvite && !isLoginMode && (
          <div style={{ padding: '16px', borderRadius: '8px', background: 'rgba(147, 51, 234, 0.1)', border: '1px solid rgba(147, 51, 234, 0.3)', marginBottom: '24px', display: 'flex', gap: '12px', alignItems: 'center' }}>
            <Shield size={24} color="var(--color-purple-main)" />
            <div style={{ fontSize: '0.9rem', color: '#111', fontWeight: 600 }}>
               VIP Invite Recognized. Creating this account will automatically unlock Top-Tier Enterprise access inside the Nexus platform.
            </div>
          </div>
        )}

          <form onSubmit={handleAuthPayload} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            <div style={{ position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '4px' }}>
                 <span style={{ fontSize: '0.85rem', color: '#111', textDecoration: 'underline', cursor: 'pointer' }}>Use email</span>
              </div>
              <div style={{ position: 'relative', border: '1px solid #999', borderRadius: '4px', background: 'white' }}>
                 <input 
                   type="text" 
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   placeholder="Username or Customer # *"
                   required
                   style={{ width: '100%', padding: '18px 16px', border: 'none', background: 'transparent', outline: 'none', fontSize: '1rem', color: '#111' }} 
                 />
              </div>
            </div>

            <div>
              <div style={{ position: 'relative', border: '1px solid #999', borderRadius: '4px', background: 'white', display: 'flex', alignItems: 'center' }}>
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password *"
                  required
                  style={{ width: '100%', padding: '18px 16px', paddingRight: '60px', border: 'none', background: 'transparent', outline: 'none', fontSize: '1rem', color: '#111' }} 
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '16px', background: 'transparent', border: 'none', color: '#111', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.9rem' }}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {isLoginMode && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
                 <input type="checkbox" id="remember" style={{ accentColor: '#10B981', width: '18px', height: '18px', borderRadius: '4px' }} />
                 <label htmlFor="remember" style={{ fontSize: '0.95rem', color: '#111', cursor: 'pointer' }}>Keep me signed in on this device</label>
              </div>
            )}

            {authError && (
              <div style={{ padding: '12px', borderRadius: '8px', background: authError.includes('successful') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: authError.includes('successful') ? '#10B981' : '#EF4444', fontSize: '0.85rem', fontWeight: 600, textAlign: 'left' }}>
                {authError}
              </div>
            )}

            <button 
              type="submit"
              disabled={isAuthenticating}
              style={{ width: '100%', padding: '18px', marginTop: '8px', fontSize: '1.05rem', fontWeight: 600, background: '#111', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', transition: 'background 0.2s' }}
              onMouseOver={(e) => e.target.style.background = '#333'}
              onMouseOut={(e) => e.target.style.background = '#111'}
            >
              {isAuthenticating ? 'Authenticating...' : (isLoginMode ? 'Sign In' : 'Sign Up')}
            </button>
          </form>

        <div style={{ textAlign: 'center', fontSize: '0.95rem', color: '#111', marginTop: '30px' }}>
           Need to find <a href="#" style={{ color: '#111', textDecoration: 'underline' }}>your username</a> or <a href="#" style={{ color: '#111', textDecoration: 'underline' }}>your password</a>?
        </div>

        <div style={{ marginTop: '30px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
          <Shield size={14} /> End-to-end encrypted by Supabase
        </div>
      </div>
    </div>
  );
};

export default Login;
