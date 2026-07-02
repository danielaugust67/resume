import { useState } from 'react'
import { db } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

const contacts = [
  {
    icon: '📧', bg: 'rgba(239,68,68,0.15)',
    name: 'Email',
    value: 'danielgirsang67@gmail.com',
    href: 'mailto:danielgirsang67@gmail.com',
    id: 'contact-email',
  },
  {
    icon: '💼', bg: 'rgba(14,165,233,0.15)',
    name: 'LinkedIn',
    value: 'linkedin.com/in/danielaugustian67',
    href: 'https://linkedin.com/in/danielaugustian67',
    id: 'contact-linkedin',
  },
  {
    icon: '📱', bg: 'rgba(34,197,94,0.15)',
    name: 'Phone / WhatsApp',
    value: '+62 812-6059-1970',
    href: 'https://wa.me/6281260591970',
    id: 'contact-whatsapp',
  },
  {
    icon: '🌐', bg: 'rgba(99,102,241,0.15)',
    name: 'Portfolio Website',
    value: 'danielaugust-resume.vercel.app',
    href: 'https://danielaugust-resume.vercel.app/',
    id: 'contact-website',
  },
]

export default function ContactWindow() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle') // idle, submitting, success, error

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.message) return
    
    setStatus('submitting')
    try {
      await addDoc(collection(db, 'messages'), {
        ...form,
        createdAt: serverTimestamp()
      })
      setStatus('success')
      setForm({ name: '', email: '', message: '' })
      setTimeout(() => setStatus('idle'), 5000)
    } catch (error) {
      console.error('Error sending message:', error)
      setStatus('error')
    }
  }

  return (
    <div className="wc-body" style={{ overflowY: 'auto', height: '100%', paddingBottom: '40px' }}>
      <div className="wc-title">Contact</div>
      <div className="wc-subtitle">Hubungi saya melalui platform berikut</div>
      <div className="contact-links">
        {contacts.map((c) => (
          <a
            key={c.id}
            id={c.id}
            className="contact-link-row"
            href={c.href}
            target={c.href.startsWith('mailto') ? '_self' : '_blank'}
            rel="noopener noreferrer"
          >
            <div className="contact-link-icon" style={{ background: c.bg }}>
              {c.icon}
            </div>
            <div className="contact-link-info">
              <div className="contact-link-name">{c.name}</div>
              <div className="contact-link-val">{c.value}</div>
            </div>
            <svg className="contact-link-arrow" width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 11L11 3M11 3H5M11 3v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        ))}
      </div>

      <div className="wc-divider" style={{ margin: '24px 0' }} />
      
      <div className="wc-section">
        <div className="wc-section-label">Send a Message</div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
          <input 
            type="text" 
            placeholder="Your Name" 
            value={form.name}
            onChange={(e) => setForm({...form, name: e.target.value})}
            required
            style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'var(--text)', outline: 'none' }}
          />
          <input 
            type="email" 
            placeholder="Your Email (optional)" 
            value={form.email}
            onChange={(e) => setForm({...form, email: e.target.value})}
            style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'var(--text)', outline: 'none' }}
          />
          <textarea 
            placeholder="Your Message" 
            value={form.message}
            onChange={(e) => setForm({...form, message: e.target.value})}
            required
            style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'var(--text)', outline: 'none', minHeight: '80px', resize: 'vertical' }}
          />
          <button 
            type="submit" 
            disabled={status === 'submitting'}
            style={{ padding: '10px', borderRadius: '8px', border: 'none', background: 'var(--text)', color: 'var(--bg)', fontWeight: 'bold', cursor: status === 'submitting' ? 'default' : 'pointer', opacity: status === 'submitting' ? 0.7 : 1 }}
          >
            {status === 'submitting' ? 'Sending...' : status === 'success' ? 'Message Sent! ✓' : 'Send Message'}
          </button>
          {status === 'error' && <div style={{ color: '#ef4444', fontSize: '13px' }}>Failed to send message. Try again.</div>}
        </form>
      </div>
    </div>
  )
}
