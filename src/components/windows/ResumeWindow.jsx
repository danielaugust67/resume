const experience = [
  { 
    icon: '💻', 
    title: 'Go Backend Dev Bootcamp', 
    sub: 'Code ID', 
    year: 'Jan 2026 — Mar 2026',
    desc: [
      'Developed RESTful APIs with structured architecture for scalability',
      'Implemented authentication systems (JWT-based)',
      'Built CRUD operations integrated with databases',
      'Performed API testing using Postman',
      'Learned best practices in backend development and system design',
    ]
  },
  { 
    icon: '🏢', 
    title: 'Software Engineer Intern', 
    sub: 'PT Telkom Indonesia', 
    year: 'Aug 2024 — Dec 2024',
    desc: [
      'Developed a Node.js application to process k6 performance test results into readable HTML reports',
      'Containerized the application using Docker for consistent deployment across environments',
      'Implemented dynamic configuration to eliminate hardcoded test parameters',
      'Improved efficiency of performance testing workflows across teams',
    ]
  },
  { 
    icon: '📊', 
    title: 'System Analyst Intern', 
    sub: 'PT Sangkuriang Internasional', 
    year: 'Jun 2024 — Aug 2024',
    desc: [
      'Designed user flow diagrams for SP4N Lapor system to support system development',
      'Conducted testing and identified bugs in mobile and web applications',
      'Collaborated with developers to improve system functionality and user experience',
    ]
  },
  { 
    icon: '👨‍🏫', 
    title: 'Assistant Lecturer', 
    sub: 'Institut Teknologi Del', 
    year: 'Jan 2024 — May 2024',
    desc: [
      'Conducting tutoring sessions for students enrolled in the Procedural Programming course, covering a Programming Case in the C Language',
      'Directly communicating with the main lecturer regarding students\' progress to ensure transparency in evaluation',
      'Providing constructive feedback and solutions to enhance students\' understanding of probability and statistics concepts, actively participating in discussions during review sessions to address challenges, and explaining students\' questions about course material',
    ]
  },
]

const education = [
  { 
    icon: '🎓', 
    title: 'Bachelor of Information System', 
    sub: 'Del Institute of Technology (3.15/4.00)', 
    year: 'Aug 2021 — Aug 2025',
    desc: []
  }
]

export default function ResumeWindow() {
  return (
    <div className="wc-body" style={{ overflowY: 'auto', height: '100%' }}>
      {/* Header */}
      <div className="resume-header">
        <div>
          <div className="resume-name">Daniel Augustian Girsang</div>
          <div className="resume-role">Information Systems Graduate</div>
        </div>
        <a href="/src/assets/Daniel Augustian Girsang-resume.pdf" download className="resume-download" id="resume-download-btn">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M6.5 1v8M3 6.5l3.5 3.5 3.5-3.5M1.5 12h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Download CV
        </a>
      </div>

      {/* Experience */}
      <div className="wc-section">
        <div className="wc-section-label">Experience</div>
        <div className="timeline">
          {experience.map((item, i) => (
            <div className="timeline-item" key={i}>
              <div className="timeline-dot">{item.icon}</div>
              <div className="timeline-content">
                <div className="timeline-title">{item.title}</div>
                <div className="timeline-sub">{item.sub}</div>
                <div className="timeline-year">{item.year}</div>
                {item.desc && item.desc.length > 0 && (
                  <ul className="timeline-desc">
                    {item.desc.map((point, j) => (
                      <li key={j}>{point}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="wc-divider" />

      {/* Education */}
      <div className="wc-section">
        <div className="wc-section-label">Education</div>
        <div className="timeline">
          {education.map((item, i) => (
            <div className="timeline-item" key={i}>
              <div className="timeline-dot">{item.icon}</div>
              <div className="timeline-content">
                <div className="timeline-title">{item.title}</div>
                <div className="timeline-sub">{item.sub}</div>
                <div className="timeline-year">{item.year}</div>
                {item.desc && item.desc.length > 0 && (
                  <ul className="timeline-desc">
                    {item.desc.map((point, j) => (
                      <li key={j}>{point}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
