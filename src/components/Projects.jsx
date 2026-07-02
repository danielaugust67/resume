import { useEffect, useRef } from 'react'

const projects = [
  {
    number: '01',
    icon: '🌐',
    iconBg: 'rgba(99,102,241,0.15)',
    name: 'Web App Portfolio',
    desc: 'Website portofolio personal yang dibangun dengan React dan Vite. Menampilkan desain modern dengan animasi halus dan pengalaman pengguna yang intuitif.',
    tech: ['React', 'Vite', 'CSS3'],
    link: '#',
    featured: true,
  },
  {
    number: '02',
    icon: '🛒',
    iconBg: 'rgba(34,197,94,0.15)',
    name: 'E-Commerce Platform',
    desc: 'Platform belanja online full-stack dengan fitur autentikasi, keranjang belanja, dan payment gateway terintegrasi.',
    tech: ['Node.js', 'React', 'MongoDB'],
    link: '#',
    featured: false,
  },
  {
    number: '03',
    icon: '📊',
    iconBg: 'rgba(251,191,36,0.15)',
    name: 'Dashboard Analytics',
    desc: 'Aplikasi dashboard real-time untuk visualisasi data bisnis dengan chart interaktif dan filter dinamis.',
    tech: ['React', 'Chart.js', 'REST API'],
    link: '#',
    featured: false,
  },
  {
    number: '04',
    icon: '🤖',
    iconBg: 'rgba(239,68,68,0.15)',
    name: 'AI Chat Assistant',
    desc: 'Chatbot berbasis AI yang terintegrasi dengan model bahasa besar (LLM) untuk menjawab pertanyaan pengguna secara cerdas.',
    tech: ['Python', 'FastAPI', 'OpenAI'],
    link: '#',
    featured: false,
  },
  {
    number: '05',
    icon: '📱',
    iconBg: 'rgba(14,165,233,0.15)',
    name: 'Task Manager App',
    desc: 'Aplikasi manajemen tugas dengan fitur drag-and-drop, notifikasi, dan sinkronisasi real-time antar perangkat.',
    tech: ['React', 'TypeScript', 'Firebase'],
    link: '#',
    featured: false,
  },
]

export default function Projects() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.project-card').forEach((el, i) => {
              setTimeout(() => {
                el.style.opacity = '1'
                el.style.transform = 'translateY(0)'
              }, i * 80)
            })
          }
        })
      },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="projects-section" id="projects" ref={sectionRef}>
      <div className="section-label">Projects</div>

      <div className="projects-header">
        <h2 className="projects-heading">Karya Terpilih</h2>
        <span className="projects-count">{projects.length} projects</span>
      </div>

      <div className="projects-grid">
        {projects.map((project, i) => (
          <div
            className={`project-card ${project.featured ? 'featured' : ''}`}
            key={i}
            style={{
              opacity: 0,
              transform: 'translateY(30px)',
              transition: `opacity 0.5s ease, transform 0.5s ease, border-color 0.3s ease, box-shadow 0.3s ease, background 0.3s ease`,
            }}
          >
            <div className="project-number">{project.number}</div>
            <div
              className="project-icon-wrap"
              style={{ background: project.iconBg }}
            >
              {project.icon}
            </div>
            <h3 className="project-name">{project.name}</h3>
            <p className="project-desc">{project.desc}</p>
            <div className="project-tech">
              {project.tech.map((t, j) => (
                <span className="tech-badge" key={j}>{t}</span>
              ))}
            </div>
            <a
              href={project.link}
              className="project-link"
              id={`project-link-${i + 1}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Lihat Project
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 10L10 2M10 2H4M10 2v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
        ))}
      </div>
    </section>
  )
}
