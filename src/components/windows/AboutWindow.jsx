import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'
import profilePhoto from '../../assets/profile.png'
import Image from 'next/image'


export default function AboutWindow() {
  const [profile, setProfile] = useState({
    name: 'Loading...', role: '', status: '', bio: '', location: '', degree: '', languages: ''
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const docRef = doc(db, 'about', 'profile')
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          setProfile(docSnap.data())
        } else {
          setProfile({
            name: 'Daniel Augustian Girsang', role: 'System Analyst & Software Developer', status: 'Available for Work',
            bio: 'Information Systems graduate...\n\nFamiliar with database management...',
            location: 'Indonesia 🇮🇩', degree: 'Information Systems', languages: 'ID · EN'
          })
        }
      } catch (error) {
        console.error("Error fetching about profile", error)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  // Split bio by double newline
  const bioParagraphs = profile.bio.split('\n\n').filter(p => p.trim() !== '')
  return (
    <div className="wc-body" style={{ overflowY: 'auto', height: '100%' }}>
      <div className="about-hero">
        <Image src={profilePhoto} alt="Profile" className="about-avatar" placeholder="blur" />
        <div>
          <div className="about-name">{profile.name}</div>
          <div className="about-role">{profile.role}</div>
          {profile.status && (
            <div className="about-status">
              <span className="status-dot" />
              {profile.status}
            </div>
          )}
        </div>
      </div>

      <div className="wc-divider" />

      <div className="wc-section">
        <div className="wc-section-label">Bio</div>
        {loading ? <p className="about-bio">Loading...</p> : (
          bioParagraphs.map((p, i) => (
            <p key={i} className="about-bio" style={{ marginBottom: i < bioParagraphs.length - 1 ? '10px' : '0' }}>
              {p}
            </p>
          ))
        )}
      </div>

      <div className="wc-divider" />

      <div className="wc-section">
        <div className="wc-section-label">Info</div>
        <div className="about-info-grid">
          {[
            { k: 'Location', v: profile.location },
            { k: 'Status', v: profile.status },
            { k: 'Degree', v: profile.degree },
            { k: 'Languages', v: profile.languages },
          ].map(({ k, v }) => v ? (
            <div className="info-row" key={k}>
              <span className="info-key">{k}</span>
              <span className="info-val">{v}</span>
            </div>
          ) : null)}
        </div>
      </div>
    </div>
  )
}
