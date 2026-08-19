import { Link } from 'react-router-dom'
import { FiLogIn, FiUser } from 'react-icons/fi'

function Settings({ user, subscription = 'basic', onLogin }) {
  const plan = subscription

  if (!user) {
    return (
      <main className="content">
        <div className="settings-login">
          <div className="settings-art"><FiUser /></div>
          <h1>Your account, your pace.</h1>
          <p>Log in to see your subscription and account details.</p>
          <button className="dark-button" type="button" onClick={onLogin}>
            Log in <FiLogIn />
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="content settings">
      <div className="content-heading">
        <p className="kicker">ACCOUNT</p>
        <h1>Settings</h1>
        <p>Manage your Summarist experience.</p>
      </div>

      <section className="settings-card">
        <div className="settings-profile">
          <div className="large-avatar">{user.name.slice(0, 2).toUpperCase()}</div>
          <div>
            <h2>{user.name}</h2>
            <p>{user.email}</p>
          </div>
        </div>

        <div className="setting-row">
          <div>
            <span>Current plan</span>
            <strong className="plan-status">{plan}</strong>
          </div>
          <Link className="outline-button" to="/choose-plan">
            Upgrade plan
          </Link>
        </div>

        <div className="setting-row">
          <div>
            <span>Email address</span>
            <strong>{user.email}</strong>
          </div>
          <button className="outline-button" type="button">
            Edit email
          </button>
        </div>
      </section>
    </main>
  )
}

export default Settings
