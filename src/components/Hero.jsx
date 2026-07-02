import profilePhoto from '../assets/img (2).png'

const floatingCards = [
  {
    icon: '⚡',
    iconBg: 'rgba(251,191,36,0.15)',
    label: 'React Developer',
    sub: 'Frontend Expert',
  },
  {
    icon: '🛠️',
    iconBg: 'rgba(99,102,241,0.15)',
    label: 'Full Stack Dev',
    sub: 'Node · Python',
  },
  {
    icon: '🎯',
    iconBg: 'rgba(239,68,68,0.15)',
    label: 'Problem Solver',
    sub: 'Clean Code',
  },
  {
    icon: '🚀',
    iconBg: 'rgba(34,197,94,0.15)',
    label: 'Open Source',
    sub: 'GitHub Active',
  },
  {
    icon: '💡',
    iconBg: 'rgba(14,165,233,0.15)',
    label: 'UI Craftsman',
    sub: 'Design-Minded',
  },
]

export default function Hero() {
  return (
    <section className="hero-section" id="hero">
      <div className="hero-image">
        <div className="hero-blob" />
        <img
          src={profilePhoto.src}
          alt="Daniel Augustian Girsang"
          className="hero-avatar"
        />
      </div>

      {/* Overlay gradient */}
      <div className="hero-overlay" />

      {/* Floating cards */}
      <div className="floating-cards" aria-hidden="true">
        {floatingCards.map((card, i) => (
          <div className="float-card" key={i}>
            <div className="float-card-inner">
              <div
                className="float-card-icon"
                style={{ background: card.iconBg }}
              >
                {card.icon}
              </div>
              <div className="float-card-text">
                <span className="float-card-label">{card.label}</span>
                <span className="float-card-sub">{card.sub}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="hero-content">
        <div className="hero-badge">
          <span className="hero-badge-dot" />
          Available for Work
        </div>

        <h1 className="hero-name">
          Your Name
        </h1>

        <p className="hero-title">
          Developer &amp; Programmer
        </p>

        <div className="hero-cta-group">
          <a href="#projects" className="btn-primary" id="hero-cta-projects">
            Lihat Projects
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
          <a href="#about" className="btn-secondary" id="hero-cta-about">
            Tentang Saya
          </a>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="hero-scroll-hint" aria-hidden="true">
        <div className="scroll-line" />
        <span className="scroll-label">Scroll</span>
      </div>
    </section>
  )
}
