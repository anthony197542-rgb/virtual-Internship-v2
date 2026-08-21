import { Link } from 'react-router-dom'
import { FiArrowLeft, FiBookOpen, FiCheck, FiClock, FiHeadphones, FiStar } from 'react-icons/fi'

function Home({ onLogin = () => { } }) {
  return (
    <main className="home">
      <nav className="home-nav">
        <Link className="logo" to="/"><span>✦</span> summarist</Link>
        <div>
          <a href="#how-it-works">How it works</a>
          <a href="#reviews">Reviews</a>
          <button className="home-login" onClick={onLogin}>Log in</button>
        </div>
      </nav>

      <section className="home-hero">
        <div className="hero-copy">
          <p className="kicker">THE SMARTER WAY TO READ</p>
          <h1>Gain more knowledge<br />in <em>less time.</em></h1>
          <p className="hero-text">Great summaries for busy people, individuals who barely have time to read, and even people who don't like to read.</p>
          <button className="hero-button" onClick={onLogin}>Get started <FiArrowLeft /></button>
          <div className="hero-note">
            <div className="mini-avatars"><span>AT</span><span>JS</span><span>RK</span></div>
            <span>Join 3 million curious minds</span>
          </div>
        </div>

        <div className="hero-visual">
          <div className="visual-glow"></div>
          <div className="book-stack">
            <div className="book book-back">MAKE TIME</div>
            <div className="book book-mid">THE<br />CREATIVE<br />ACT</div>
            <div className="book book-front">THE<br /><strong>POWER</strong><br />OF NOW</div>
          </div>
          <div className="float-note note-one"><FiClock /> 15 min reads</div>
          <div className="float-note note-two"><FiCheck /> Ideas that stick</div>
        </div>
      </section>

      <section className="feature-strip" id="how-it-works">
        <div><span className="feature-icon coral"><FiBookOpen /></span><strong>Understand books</strong><p>Get the core ideas from the best books in a few minutes.</p></div>
        <div><span className="feature-icon yellow"><FiHeadphones /></span><strong>Read or listen</strong><p>Choose the format that fits the way you learn.</p></div>
        <div><span className="feature-icon blue"><FiStar /></span><strong>Find your next read</strong><p>Explore book lists and personalized recommendations.</p></div>
      </section>

      <section className="proof" id="reviews">
        <p className="kicker">A BETTER WAY TO LEARN</p>
        <h2>Small summaries.<br /><em>Big changes.</em></h2>
        <p>Make time for the ideas that move your life forward.</p>
        <div className="quote">“This app has been a game-changer for me. It saved me time and made reading a habit again.”<strong>— David B., Summarist member</strong></div>
      </section>

      <footer className="home-footer"><span>© 2026 Summarist</span><span>Read better. Live more.</span></footer>
    </main>
  )
}

export default Home
