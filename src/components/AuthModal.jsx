import { useState } from 'react'
import { FiX } from 'react-icons/fi'

function AuthModal({ onClose, onSubmit, onGuestLogin, onGoogleLogin, onPasswordReset }) {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [resetSent, setResetSent] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!email.includes('@')) {
      setError('Please enter a valid email address.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    const result = await onSubmit({
      email,
      password,
      mode,
    })

    if (result) setError(result)
  }

  const switchMode = () => {
    setMode((currentMode) => (
      currentMode === 'login' ? 'register' : 'login'
    ))
    setError('')
  }

  const handleReset = async () => {
    if (!email.includes('@')) {
      setError('Enter your email first to reset your password.')
      return
    }
    const result = await onPasswordReset(email)
    if (result) setError(result)
    else setResetSent(true)
  }

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
    >
      <section className="auth-modal">
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Close authentication modal"
        >
          <FiX />
        </button>

        <span className="modal-mark">✦</span>

        <h2>
          {mode === 'login'
            ? 'Welcome back'
            : 'Start your journey'}
        </h2>

        <p>
          {mode === 'login'
            ? 'Pick up where you left off.'
            : 'Create an account and make learning a habit.'}
        </p>

        <form onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 6 characters"
            />
          </label>

          {error && (
            <div className="form-error">
              {error}
            </div>
          )}

          {resetSent && <div className="form-success">Password reset email sent.</div>}

          <button className="form-button" type="submit">
            {mode === 'login'
              ? 'Log in'
              : 'Create account'}
          </button>
        </form>

        {mode === 'login' && (
          <button className="text-button" type="button" onClick={handleReset}>
            Forgot password?
          </button>
        )}

        <button className="guest-button" type="button" onClick={async () => {
          const result = await onGoogleLogin()
          if (result) setError(result)
        }}>
          Continue with Google
        </button>

        <button
          className="guest-button"
          type="button"
          onClick={async () => {
            const result = await onGuestLogin()
            if (result) setError(result)
          }}
        >
          Continue as guest
        </button>

        <p className="auth-switch">
          {mode === 'login'
            ? 'New to Summarist?'
            : 'Already have an account?'}

          <button type="button" onClick={switchMode}>
            {mode === 'login'
              ? 'Create account'
              : 'Log in'}
          </button>
        </p>
      </section>
    </div>
  )
}

export default AuthModal