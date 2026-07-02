import { useEffect, useRef } from 'react'

const skillGroups = [
  {
    label: 'Frontend',
    skills: ['React', 'JavaScript', 'TypeScript', 'HTML5', 'CSS3', 'Vite'],
  },
  {
    label: 'Backend',
    skills: ['Node.js', 'Express', 'Python', 'REST API', 'PostgreSQL', 'MongoDB'],
  },
  {
    label: 'Tools & Others',
    skills: ['Git', 'GitHub', 'VS Code', 'Figma', 'Docker', 'Linux'],
  },
]

const stats = [
  { number: '10+', label: 'Projects Selesai' },
  { number: '2+', label: 'Tahun Pengalaman' },
  { number: '5+', label: 'Tech Stack' },
  { number: '∞', label: 'Semangat Belajar' },
]

export default function About() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.animate-on-scroll').forEach((el, i) => {
              setTimeout(() => {
                el.style.opacity = '1'
                el.style.transform = 'translateY(0)'
              }, i * 100)
            })
          }
        })
      },
      { threshold: 0.15 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="about-section" id="about" ref={sectionRef}>
      <div className="section-label">About Me</div>

      <div className="about-grid">
        {/* Left column */}
        <div>
          <h2
            className="about-heading animate-on-scroll"
            style={{ opacity: 0, transform: 'translateY(24px)', transition: 'opacity 0.6s ease, transform 0.6s ease' }}
          >
            Membangun solusi digital yang elegan
          </h2>

          <div
            className="about-body animate-on-scroll"
            style={{ opacity: 0, transform: 'translateY(24px)', transition: 'opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s' }}
          >
            <p>
              Saya adalah seorang Developer & Programmer yang bersemangat dalam menciptakan
              pengalaman digital yang fungsional sekaligus indah. Saya percaya bahwa kode
              yang baik bukan hanya yang bekerja, tapi juga yang mudah dipahami.
            </p>
            <p>
              Dengan pengalaman di berbagai stack teknologi, saya senang menghadapi tantangan
              baru dan terus belajar hal-hal yang membuat dunia digital menjadi tempat yang
              lebih baik.
            </p>
          </div>

          <div
            className="about-stats animate-on-scroll"
            style={{ opacity: 0, transform: 'translateY(24px)', transition: 'opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s' }}
          >
            {stats.map((stat, i) => (
              <div className="stat-card" key={i}>
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column — Skills */}
        <div
          className="skills-block animate-on-scroll"
          style={{ opacity: 0, transform: 'translateY(24px)', transition: 'opacity 0.6s ease 0.3s, transform 0.6s ease 0.3s' }}
        >
          <div className="skills-heading">Tech Stack</div>
          {skillGroups.map((group, i) => (
            <div className="skills-group" key={i}>
              <div className="skills-group-label">{group.label}</div>
              <div className="skills-tags">
                {group.skills.map((skill, j) => (
                  <span className="skill-tag" key={j}>{skill}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
