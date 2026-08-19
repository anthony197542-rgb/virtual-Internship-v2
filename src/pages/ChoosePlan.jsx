import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiCheck, FiChevronDown } from 'react-icons/fi'

function ChoosePlan() {
  const navigate = useNavigate()
  const [yearly, setYearly] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(() => localStorage.getItem('summarist-plan') || 'basic')

  const choosePlan = (plan) => {
    setSelectedPlan(plan)
    localStorage.setItem('summarist-plan', plan)
    navigate('/settings')
  }

  return (
    <main className="plans-page">
      <nav className="home-nav">
        <Link className="logo" to="/">
          <span>✦</span> summarist
        </Link>
        <Link className="plain-link" to="/for-you">Back to app</Link>
      </nav>

      <div className="plans-intro">
        <p className="kicker">READ MORE. LIVE MORE.</p>
        <h1>Choose your way<br />to <em>grow.</em></h1>
        <p>Unlock the full Summarist library and make every minute count.</p>

        <div className="plan-toggle">
          <button className={!yearly ? 'selected' : ''} onClick={() => setYearly(false)}>
            Monthly
          </button>
          <button className={yearly ? 'selected' : ''} onClick={() => setYearly(true)}>
            Yearly <span>Save 30%</span>
          </button>
        </div>
      </div>

      <div className="plans-grid">
        <PlanCard
          title="Basic"
          price="$0"
          description="Try the essentials and see what Summarist can do."
          features={['Daily selected summary', 'Limited book library', 'Read summaries']}
          button="Current plan"
          muted
          selected={selectedPlan === 'basic'}
          onClick={() => choosePlan('basic')}
        />
        <PlanCard
          title={yearly ? 'Premium Plus' : 'Premium'}
          price={yearly ? '$6.99' : '$9.99'}
          period="/ month"
          description="For curious minds who want the whole library."
          features={['Unlimited book summaries', 'Audio briefcasts', 'Save to your library', 'Personalized recommendations']}
          button={selectedPlan === (yearly ? 'premium-plus' : 'premium') ? 'Current plan' : 'Start learning'}
          featured
          selected={selectedPlan === (yearly ? 'premium-plus' : 'premium')}
          onClick={() => choosePlan(yearly ? 'premium-plus' : 'premium')}
        />
        <PlanCard
          title="Team"
          price="$19"
          period="/ month"
          description="Help your team learn and grow together."
          features={['Everything in Premium', 'Shared team library', 'Team progress insights']}
          button="Talk to us"
          muted
        />
      </div>

      <div className="plans-faq">
        <h2>Questions, answered.</h2>
        <details open>
          <summary>Can I cancel anytime? <FiChevronDown /></summary>
          <p>You can cancel your plan whenever you like and keep access until the end of your billing period.</p>
        </details>
        <details>
          <summary>What is included in the free plan? <FiChevronDown /></summary>
          <p>Free members get a daily selected summary and access to a rotating selection of titles.</p>
        </details>
      </div>
    </main>
  )
}

function PlanCard({ title, price, period, description, features, button, featured, muted, selected, onClick }) {
  return (
    <article className={featured ? 'plan-card featured' : 'plan-card'}>
      {featured && <span className="popular">MOST POPULAR</span>}
      <h2>{title}</h2>
      <p>{description}</p>
      <strong className="plan-price">{price}<small>{period}</small></strong>
      <ul>
        {features.map((feature) => (
          <li key={feature}><FiCheck />{feature}</li>
        ))}
      </ul>
      <button className={muted ? 'plan-button muted-button' : 'plan-button'} onClick={onClick}>
        {selected ? 'Current plan' : button}
      </button>
    </article>
  )
}

export default ChoosePlan
