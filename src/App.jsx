import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import Auth from './Auth'
import TaskList from './TaskList'

export default function App() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  if (!session) return <Auth />

  return (
    <div>
      <header>
        <p>Hola, {session.user.email}</p>
        <button onClick={() => supabase.auth.signOut()}>Cerrar sesión</button>
      </header>
      <TaskList session={session} />
    </div>
  )
}