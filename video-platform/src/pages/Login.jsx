import { useState } from 'react'
import { supabase } from '../supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleMagicLink = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    
    const redirectTo = `${window.location.origin}/dashboard`
    
    const { error } = await supabase.auth.signInWithOtp({ 
        email, 
        options: { emailRedirectTo: redirectTo } 
    })
    
    if (error) {
      setMessage(`Error: ${error.message}`)
    } else {
      setMessage('Check your email inbox for the magic link!')
    }
    setLoading(false)
  }

  const handleOAuth = async (provider) => {
    const redirectTo = `${window.location.origin}/dashboard`
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo }
    })
  }

  return (
    <div className="app-container flex items-center justify-center">
      <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem' }}>
        <h2 className="text-center mb-2" style={{ fontSize: '1.75rem', fontWeight: 700 }}>Sync Space</h2>
        <p className="text-center text-secondary mb-8" style={{ fontSize: '0.9rem' }}>Sign in to join or host meetings.</p>
        
        {message && (
            <div className="mb-6 p-4 rounded-lg bg-black/40 border border-primary/30 text-center" style={{ color: '#fff', fontSize: '0.85rem' }}>
                {message}
            </div>
        )}

        <form onSubmit={handleMagicLink} className="flex flex-col gap-4 mb-8">
            <div>
                <label className="text-secondary mb-2 block" style={{ fontSize: '0.85rem' }}>Email Address</label>
                <input 
                    type="email" 
                    required 
                    className="input-field" 
                    placeholder="Enter your email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <button type="submit" className="btn btn-primary w-full" disabled={loading} style={{ padding: '0.8rem' }}>
                {loading ? 'Sending link...' : 'Send Magic Link'}
            </button>
        </form>

      </div>
    </div>
  )
}
