import './App.css'

function App() {
  return (
    <>
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">📚 AI Finance Academy</div>
          <ul className="nav-links">
            <li><a href="#courses">Courses</a></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#about">About</a></li>
            <li><button className="signin-btn">Sign In</button></li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Master AI & Finance</h1>
          <p>Learn cutting-edge artificial intelligence applied to financial markets</p>
          <button className="cta-btn primary">Get Started Free</button>
        </div>
        <div className="hero-stats">
          <div className="stat">
            <h3>500+</h3>
            <p>Students</p>
          </div>
          <div className="stat">
            <h3>20+</h3>
            <p>Courses</p>
          </div>
          <div className="stat">
            <h3>95%</h3>
            <p>Success Rate</p>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="courses">
        <h2>Featured Courses</h2>
        <div className="courses-grid">
          <div className="course-card">
            <div className="course-icon">📊</div>
            <h3>AI in Trading</h3>
            <p>Learn machine learning models for automated trading strategies</p>
            <button className="cta-btn secondary">Explore</button>
          </div>
          <div className="course-card">
            <div className="course-icon">🤖</div>
            <h3>Deep Learning Finance</h3>
            <p>Neural networks for financial prediction and analysis</p>
            <button className="cta-btn secondary">Explore</button>
          </div>
          <div className="course-card">
            <div className="course-icon">💰</div>
            <h3>Portfolio Optimization</h3>
            <p>Advanced algorithms for risk management and returns</p>
            <button className="cta-btn secondary">Explore</button>
          </div>
          <div className="course-card">
            <div className="course-icon">📈</div>
            <h3>Market Analysis</h3>
            <p>Data science techniques for market trends and patterns</p>
            <button className="cta-btn secondary">Explore</button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <h2>Why Choose AI Finance Academy?</h2>
        <div className="features-grid">
          <div className="feature">
            <div className="feature-icon">✨</div>
            <h3>Expert Instructors</h3>
            <p>Learn from industry professionals with years of experience</p>
          </div>
          <div className="feature">
            <div className="feature-icon">💻</div>
            <h3>Hands-on Projects</h3>
            <p>Real-world projects to build your portfolio</p>
          </div>
          <div className="feature">
            <div className="feature-icon">🎓</div>
            <h3>Certifications</h3>
            <p>Industry-recognized certificates upon completion</p>
          </div>
          <div className="feature">
            <div className="feature-icon">🌍</div>
            <h3>Global Community</h3>
            <p>Network with learners from around the world</p>
          </div>
          <div className="feature">
            <div className="feature-icon">⏰</div>
            <h3>Learn at Your Pace</h3>
            <p>Flexible learning schedule that fits your lifestyle</p>
          </div>
          <div className="feature">
            <div className="feature-icon">🔒</div>
            <h3>Lifetime Access</h3>
            <p>Access course materials forever after enrollment</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2026 AI Finance Academy. All rights reserved.</p>
      </footer>
    </>
  )
}

export default App
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
