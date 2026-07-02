import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { collection, getDocs } from 'firebase/firestore'

const PREDEFINED_CATEGORIES = [
  "Backend & Frameworks",
  "Frontend & Platforms",
  "Database & Tools",
  "Soft Skills",
  "Other"
]

export default function SkillsWindow() {
  const [skillGroups, setSkillGroups] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "skills"))
        const data = querySnapshot.docs.map(doc => doc.data())
        
        // Group them
        const groups = PREDEFINED_CATEGORIES.map(cat => ({
          label: cat,
          skills: data.filter(s => s.category === cat)
        })).filter(g => g.skills.length > 0)
        
        setSkillGroups(groups)
      } catch (error) {
        console.error("Error fetching skills:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchSkills()
  }, [])
  return (
    <div className="wc-body" style={{ overflowY: 'auto', height: '100%' }}>
      <div className="wc-title">Skills &amp; Tech Stack</div>
      <div className="wc-subtitle">Teknologi dan keahlian yang saya miliki</div>
      <div className="skills-os-grid">
        {loading ? <div style={{ color: '#aaa' }}>Loading skills...</div> : skillGroups.length === 0 ? <div style={{ color: '#aaa' }}>No skills added yet.</div> : skillGroups.map((group, i) => (
          <div className="skill-os-group" key={i}>
            <div className="skill-os-label">{group.label}</div>
            <div className="skill-os-tags">
              {group.skills.map((s, j) => (
                <div className="skill-os-tag" key={j}>
                  <span className="skill-icon">{s.icon}</span>
                  {s.name}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
