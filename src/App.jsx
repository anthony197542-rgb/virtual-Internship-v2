import { useState } from 'react'
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom'
import Book from './pages/Book'
import ChoosePlan from './pages/ChoosePlan'
import AuthModal from './components/AuthModal'
import ForYou from './pages/ForYou'
import Home from './pages/Home'
import Player from './pages/Player'
import Settings from './pages/Settings'
import Sidebar from './components/Sidebar'
import './App.css'

function App() {
  const [authOpen, setAuthOpen] = useState(false)

  const handleLogin = ({ email }) => {
    localStorage.setItem('summarist-user', JSON.stringify({
      email,
      name: email.split('@')[0],
    }))
    setAuthOpen(false)
  }

  const handleGuestLogin = () => {
    localStorage.setItem('summarist-user', JSON.stringify({
      email: 'guest@gmail.com',
      name: 'Guest User',
    }))
    setAuthOpen(false)
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Home onLogin={() => setAuthOpen(true)} />}
        />
        <Route path="/choose-plan" element={<ChoosePlan />} />
        <Route element={<AppShell onLogin={() => setAuthOpen(true)} />}>
          <Route path="/for-you" element={<ForYou />} />
          <Route path="/book/:id" element={<Book />} />
          <Route path="/player/:id" element={<Player />} />
          <Route path="/settings" element={<Settings />} />
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

function AppShell({ onLogin }) {
  return (
    <div className="app-layout">
      <Sidebar onLogin={onLogin} />
      <div className="page-area">
        <Outlet />
      </div>
    </div>
  )
}

export default App 