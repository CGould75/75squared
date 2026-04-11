import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './supabase'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import MeetingRoom from './pages/MeetingRoom'

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return <div className="app-container flex items-center justify-center text-secondary">Loading...</div>
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={session ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/dashboard" element={session ? <Dashboard session={session} /> : <Navigate to="/" />} />
        <Route path="/meeting" element={session ? <MeetingRoom session={session} /> : <Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
