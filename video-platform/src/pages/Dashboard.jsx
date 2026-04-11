import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'

export default function Dashboard({ session }) {
  const navigate = useNavigate()

  const handleCreateMeeting = async () => {
    // For Phase 2/3 MVP: Just route to meeting room, it will generate a PeerJS ID
    navigate(`/meeting`)
  }

  const handleSignOut = () => {
    supabase.auth.signOut()
  }

  return (
    <div className="app-container p-8 flex flex-col items-center">
      <header className="flex justify-between items-center mb-8 glass-panel w-full max-w-4xl" style={{ padding: '1rem 2rem' }}>
        <div className="flex items-center gap-2">
            <h1 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Sync Space Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
            <span className="text-secondary" style={{ fontSize: '0.875rem' }}>{session.user.email}</span>
            <button className="btn btn-danger" style={{ padding: '0.5rem 1rem' }} onClick={handleSignOut} title="Sign Out">Sign Out</button>
        </div>
      </header>

      <main className="flex gap-4 w-full max-w-4xl" style={{ flexDirection: 'column' }}>
        <div className="glass-panel p-8 text-center flex flex-col items-center justify-center">
            <h2 className="mb-4">Host a Meeting</h2>
            <p className="text-secondary mb-8">Start a new video call or remote control session.</p>
            <button className="btn btn-primary" onClick={handleCreateMeeting} style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>Start New Meeting</button>
        </div>
      </main>
    </div>
  )
}
