import { NavLink, Link } from 'react-router-dom'
import { FiBookOpen, FiBookmark, FiHelpCircle, FiHome, FiLogIn, FiLogOut, FiSearch, FiSettings, FiStar } from 'react-icons/fi'

const navigationItems = [
  { to: '/for-you', label: 'For you', icon: FiHome },
  { to: '/library', label: 'My library', icon: FiBookmark },
  { label: 'Highlights', icon: FiStar },
  { label: 'Search', icon: FiSearch },
  { to: '/settings', label: 'Settings', icon: FiSettings },
  { label: 'Help & support', icon: FiHelpCircle },
]

function Sidebar({ onLogin }) {
  const user = readUser()

  return (
    <aside className="sidebar">
      <Link className="logo" to="/">
        <span>✦</span> summarist
      </Link>

      <nav className="side-nav" aria-label="Main navigation">
        {navigationItems.map(({ to, label, icon: Icon }) => (
          to ? (
            <NavLink
              className={({ isActive }) => isActive ? 'side-link active' : 'side-link'}
              to={to}
              key={label}
            >
              <Icon />
              {label}
            </NavLink>
          ) : (
            <button className="side-link disabled" type="button" key={label}>
              <Icon />
              {label}
            </button>
          )
        ))}
      </nav>

      <div className="side-bottom">
        <div className="side-promo">
          <FiBookOpen />
          <strong>Make reading a habit</strong>
          <span>Explore a world of ideas, one summary at a time.</span>
        </div>

        {user ? (
          <button
            className="side-link logout"
            type="button"
            onClick={() => {
              localStorage.removeItem('summarist-user')
              window.location.reload()
            }}
          >
            <FiLogOut />
            Log out
          </button>
        ) : (
          <button className="side-link" type="button" onClick={onLogin}>
            <FiLogIn />
            Log in
          </button>
        )}
      </div>
    </aside>
  )
}

function readUser() {
  try {
    return JSON.parse(localStorage.getItem('summarist-user'))
  } catch {
    return null
  }
}

export default Sidebar
