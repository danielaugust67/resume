import { useState, useRef } from 'react'

export default function Window({
  title, icon,
  isOpen, isMinimized, zIndex,
  initialX = 120, initialY = 60,
  initialWidth = 680, initialHeight = 480,
  onClose, onMinimize, onFocus,
  children,
}) {
  const [pos, setPos] = useState({ x: initialX, y: initialY })
  const [isMaximized, setIsMaximized] = useState(false)

  const handleTitleMouseDown = (e) => {
    if (e.button !== 0) return
    if (e.target.closest('.win-controls')) return
    if (isMaximized) return
    e.preventDefault()

    const startX = e.clientX - pos.x
    const startY = e.clientY - pos.y

    const onMove = (me) => {
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
  }

  if (!isOpen) return null

  const windowStyle = isMaximized
    ? { position: 'fixed', top: 0, left: 0, right: 0, bottom: 56, width: '100%', height: 'calc(100vh - 56px)', zIndex, borderRadius: 0 }
    : { position: 'fixed', left: pos.x, top: pos.y, width: initialWidth, height: initialHeight, zIndex }

  return (
    <div
      className={`window${isMinimized ? ' minimized' : ''}${isMaximized ? ' maximized' : ''}`}
      style={windowStyle}
      onMouseDown={onFocus}
    >
      {/* Title bar */}
      <div className="win-titlebar" onMouseDown={handleTitleMouseDown}>
        <div className="win-controls">
          <button
            className="win-btn win-btn-close"
            onClick={(e) => { e.stopPropagation(); onClose() }}
            title="Close"
          />
          <button
            className="win-btn win-btn-min"
            onClick={(e) => { e.stopPropagation(); onMinimize() }}
            title="Minimize"
          />
          <button
            className="win-btn win-btn-max"
            onClick={(e) => { e.stopPropagation(); setIsMaximized(m => !m) }}
            title="Maximize"
          />
        </div>
        <div className="win-title">
          <span>{icon}</span>
          {title}
        </div>
      </div>

      {/* Content */}
      <div className="win-content">
        {children}
      </div>
    </div>
  )
}
