import { useState, useRef, useCallback } from 'react'

export default function DesktopIcon({ label, icon, initialX, initialY, onOpen }) {
  const [pos, setPos] = useState({ x: initialX, y: initialY })
  const [selected, setSelected] = useState(false)
  const draggedRef = useRef(false)
  const clickCountRef = useRef(0)
  const clickTimerRef = useRef(null)

  const handleMouseDown = useCallback((e) => {
    if (e.button !== 0) return
    e.preventDefault()
    e.stopPropagation()

    const startX = e.clientX - pos.x
    const startY = e.clientY - pos.y
    draggedRef.current = false

    const onMove = (me) => {
      const dx = Math.abs(me.clientX - e.clientX)
      const dy = Math.abs(me.clientY - e.clientY)
      if (dx > 5 || dy > 5) draggedRef.current = true
      setPos({
        x: Math.max(0, me.clientX - startX),
        y: Math.max(0, me.clientY - startY),
      })
    }

    const onUp = () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }, [pos])

  const handleClick = (e) => {
    e.stopPropagation()
    if (draggedRef.current) return
    setSelected(true)
    clickCountRef.current += 1

    if (clickCountRef.current === 1) {
      clickTimerRef.current = setTimeout(() => {
        clickCountRef.current = 0
      }, 280)
    } else if (clickCountRef.current >= 2) {
      clearTimeout(clickTimerRef.current)
      clickCountRef.current = 0
      onOpen()
    }
  }

  return (
    <div
      className={`desktop-icon${selected ? ' selected' : ''}`}
      style={{ left: pos.x, top: pos.y }}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
    >
      <div className="icon-img">
        {icon}
      </div>
      <span className="icon-label">{label}</span>
    </div>
  )
}
