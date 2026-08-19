import { useEffect, useState } from 'react'
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom'
import Book from './pages/Book'
import ChoosePlan from './pages/ChoosePlan'
import AuthModal from './components/AuthModal'
import ForYou from './pages/ForYou'
import Home from './pages/Home'
import Player from './pages/Player'
import Settings from './pages/Settings'
import Search from './pages/Search'
import Sidebar from './components/Sidebar'
import './App.css'
import Header from './components/Header'
import Library from './pages/Library'
import { firebaseConfigured } from './services/firebase'
import { loginAsGuest, loginWithEmail, logout, registerWithEmail, watchAuth } from './services/auth'

function App() {
  const [authOpen, setAuthOpen] = useState(false)
  const [library, setLibrary] = useState(() => readLibrary())
  const [user, setUser] = useState(() => readUser())
  const [subscription, setSubscription] = useState(() => localStorage.getItem('summarist-plan') || 'basic')

  useEffect(() => {
    localStorage.setItem('summarist-library', JSON.stringify(library))
  }, [library])

  useEffect(() => watchAuth((firebaseUser) => {
    if (!firebaseUser) {
      setUser(null)
      localStorage.removeItem('summarist-user')
      return
    }

    const nextUser = {
      email: firebaseUser.email || 'guest account',
      name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Guest User',
    }
    setUser(nextUser)
    localStorage.setItem('summarist-user', JSON.stringify(nextUser))
  }), [])

  const toggleLibrary = (book) => {
    setLibrary((current) => current.some((item) => item.id === book.id)
      ? current.filter((item) => item.id !== book.id)
      : [...current, book])
  }

  const handleLogin = async ({ email, password, mode }) => {
    try {
      if (firebaseConfigured) {
        if (mode === 'register') await registerWithEmail(email, password)
        else await loginWithEmail(email, password)
      } else {
        const nextUser = { email, name: email.split('@')[0] }
        setUser(nextUser)
        localStorage.setItem('summarist-user', JSON.stringify(nextUser))
      }
      setAuthOpen(false)
      return ''
    } catch (error) {
      return getAuthError(error)
    }
  }

  const handleGuestLogin = async () => {
    try {
      if (firebaseConfigured) await loginAsGuest()
      else {
        const guest = { email: 'guest@gmail.com', name: 'Guest User' }
        setUser(guest)
        localStorage.setItem('summarist-user', JSON.stringify(guest))
      }
      setAuthOpen(false)
      return ''
    } catch (error) {
      return getAuthError(error)
    }
  }

  const handleLogout = async () => {
    await logout()
    setUser(null)
    localStorage.removeItem('summarist-user')
  }

  const handlePlanChange = (plan) => {
    setSubscription(plan)
    localStorage.setItem('summarist-plan', plan)
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Home onLogin={() => setAuthOpen(true)} />}
        />
        <Route path="/choose-plan" element={<ChoosePlan subscription={subscription} onPlanChange={handlePlanChange} />} />
        <Route element={<AppShell onLogin={() => setAuthOpen(true)} onLogout={handleLogout} user={user} />}>
          <Route path="/for-you" element={<ForYou />} />
          <Route
            path="/book/:id"
            element={<Book user={user} subscription={subscription} onLogin={() => setAuthOpen(true)} library={library} onToggleLibrary={toggleLibrary} />}
          />
          <Route path="/player/:id" element={<Player />} />
          <Route path="/library" element={<Library books={library} />} />
          <Route path="/search" element={<Search />} />
          <Route path="/settings" element={<Settings user={user} subscription={subscription} onLogin={() => setAuthOpen(true)} />} />
        </Route>
      </Routes>

      {authOpen && (
        <AuthModal
          onClose={() => setAuthOpen(false)}
          onSubmit={handleLogin}
          onGuestLogin={handleGuestLogin}
        />
      )}
    </BrowserRouter>
  )
}

function readLibrary() {
  try {
    return JSON.parse(localStorage.getItem('summarist-library')) || []
  } catch {
    return []
  }
}

function readUser() {
  try {
    return JSON.parse(localStorage.getItem('summarist-user'))
  } catch {
    return null
  }
}

function getAuthError(error) {
  const messages = {
    'auth/email-already-in-use': 'That email is already registered.',
    'auth/invalid-credential': 'The email or password is incorrect.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/weak-password': 'Password must be at least 6 characters.',
  }
  return messages[error.code] || error.message || 'Authentication failed.'
}

function AppShell({ onLogin, onLogout, user }) {
  return (
    <div className="app-layout">
      <Sidebar onLogin={onLogin} onLogout={onLogout} user={user} />
      <div className="page-area">
        <Header user={user} />
        <Outlet />
      </div>
    </div>
  )
}

export default App 