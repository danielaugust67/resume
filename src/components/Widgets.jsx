import { useState, useEffect, useRef } from 'react'
import musicCover from '../assets/mp3.webp'

export default function Widgets() {
  const [mounted, setMounted] = useState(false)
  const [time, setTime] = useState(new Date())
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef(null)

  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    audioRef.current = new Audio('/song.mp3')
    audioRef.current.loop = true
    audioRef.current.volume = 0.3
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play().catch(e => console.error("Playback failed:", e))
    }
    setIsPlaying(!isPlaying)
  }

  // Time format
  const hours = mounted ? time.getHours().toString().padStart(2, '0') : '00'
  const minutes = mounted ? time.getMinutes().toString().padStart(2, '0') : '00'
  const dayName = mounted ? time.toLocaleDateString('en-US', { weekday: 'long' }) : 'Loading...'
  const fullDate = mounted ? time.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) : ''

  // Simple calendar math for the widget
  const year = mounted ? time.getFullYear() : 2024
  const month = mounted ? time.getMonth() : 0
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const today = mounted ? time.getDate() : 1

  const daysArray = []
  for (let i = 0; i < firstDay; i++) daysArray.push(null)
  for (let i = 1; i <= daysInMonth; i++) daysArray.push(i)

  return (
    <div className="widgets-container">
      {/* Clock Widget */}
      <div className="widget clock-widget">
        <div className="clock-time-large">
          {hours}<span className="clock-colon">:</span>{minutes}
        </div>
        <div className="clock-date-large">
          {dayName}, {fullDate}
        </div>
      </div>

      {/* Calendar Widget */}
      <div className="widget cal-widget">
        <div className="cal-header">
          {mounted ? time.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Loading...'}
        </div>
        <div className="cal-grid">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
            <div key={`d-${i}`} className="cal-day-name">{d}</div>
          ))}
          {daysArray.map((d, i) => (
            <div
              key={i}
              className={`cal-day-cell ${d === today ? 'today' : ''} ${!d ? 'empty' : ''}`}
            >
              {d || ''}
            </div>
          ))}
        </div>
      </div>

      {/* Music / Now Playing Widget */}
      <div className="widget music-widget">
        <div className="music-cover">
          <img src={musicCover.src} alt="Album Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div className="music-info">
          <div className="music-title">Teh Hijau</div>
          <div className="music-artist">Tulus</div>
        </div>
        <div className="music-controls" onClick={togglePlay} style={{ cursor: 'pointer' }}>
          {isPlaying ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
          )}
        </div>
      </div>
    </div>
  )
}
