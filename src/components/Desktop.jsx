import { useState, useCallback } from 'react'
import DesktopIcon from './DesktopIcon'
import Window from './Window'
import Taskbar from './Taskbar'
import AboutWindow from './windows/AboutWindow'
import ProjectsWindow from './windows/ProjectsWindow'
import SkillsWindow from './windows/SkillsWindow'
import ContactWindow from './windows/ContactWindow'
import Widgets from './Widgets'
import profilePhoto from '../assets/profile.png'

const FolderSVG = (
  <svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%">
    <path d="M10.4 4h9.6c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2h4.4l2 2z"/>
  </svg>
)

const ICONS = [
  {
    id: 'about',
    label: 'About Me',
    icon: FolderSVG,
    initialX: 60,
    initialY: 60,
  },
  {
    id: 'projects',
    label: 'Projects',
    icon: FolderSVG,
    initialX: 180,
    initialY: 160,
  },
  {
    id: 'skills',
    label: 'Skills',
    icon: FolderSVG,
    initialX: 200,
    initialY: 380,
  },
  {
    id: 'contact',
    label: 'Contact',
    icon: FolderSVG,
    initialX: 80,
    initialY: 500,
  },
]

const WINDOW_CONFIG = {
  about:    { title: 'About Me',          icon: '👤', width: 520, height: 500, x: 140, y: 50,  Component: AboutWindow },
  projects: { title: 'Projects',          icon: '📁', width: 680, height: 510, x: 180, y: 40,  Component: ProjectsWindow },
  skills:   { title: 'Skills & Tech',     icon: '💻', width: 560, height: 480, x: 200, y: 55,  Component: SkillsWindow },
  contact:  { title: 'Contact',           icon: '📬', width: 500, height: 450, x: 220, y: 45,  Component: ContactWindow },
}

export default function Desktop() {
  const [windowStates, setWindowStates] = useState({})
  const [maxZ, setMaxZ] = useState(10)

  const getNextZ = useCallback(() => {
    const next = maxZ + 1
    setMaxZ(next)
    return next
  }, [maxZ])

  const openWindow = (id) => {
    const z = maxZ + 1
    setMaxZ(z)
    setWindowStates(prev => ({
      ...prev,
      [id]: { isOpen: true, isMinimized: false, zIndex: z },
    }))
  }

  const closeWindow = (id) => {
    setWindowStates(prev => ({
      ...prev,
      [id]: { ...prev[id], isOpen: false },
    }))
  }

  const minimizeWindow = (id) => {
    setWindowStates(prev => ({
      ...prev,
      [id]: { ...prev[id], isMinimized: true },
    }))
  }

  const restoreWindow = (id) => {
    const z = maxZ + 1
    setMaxZ(z)
    setWindowStates(prev => ({
      ...prev,
      [id]: { ...prev[id], isMinimized: false, zIndex: z },
    }))
  }

  const focusWindow = (id) => {
    const z = maxZ + 1
    setMaxZ(z)
    setWindowStates(prev => ({
      ...prev,
      [id]: { ...prev[id], zIndex: z },
    }))
  }

  const handleDesktopClick = () => {
    // deselect icons — handled by icon components
  }

  return (
    <>
      {/* Desktop area */}
      <div className="desktop" onClick={handleDesktopClick}>
        {/* Wallpaper */}
        <img src={profilePhoto.src} className="wallpaper" alt="" aria-hidden="true" />
        <div className="wallpaper-overlay" aria-hidden="true" />

        {/* Widgets on the side */}
        <Widgets />

        {/* Desktop icons */}
        {ICONS.map(icon => (
          <DesktopIcon
            key={icon.id}
            label={icon.label}
            icon={icon.icon}
            color={icon.color}
            initialX={icon.initialX}
            initialY={icon.initialY}
            onOpen={() => openWindow(icon.id)}
          />
        ))}

        {/* Windows */}
        {Object.entries(WINDOW_CONFIG).map(([id, cfg]) => {
          const state = windowStates[id]
          if (!state?.isOpen) return null
          const { Component } = cfg
          return (
            <Window
              key={id}
              title={cfg.title}
              icon={cfg.icon}
              isOpen={state.isOpen}
              isMinimized={state.isMinimized}
              zIndex={state.zIndex}
              initialX={cfg.x}
              initialY={cfg.y}
              initialWidth={cfg.width}
              initialHeight={cfg.height}
              onClose={() => closeWindow(id)}
              onMinimize={() => minimizeWindow(id)}
              onFocus={() => focusWindow(id)}
            >
              <Component />
            </Window>
          )
        })}
      </div>

      {/* Taskbar */}
      <Taskbar
        openWindows={windowStates}
        onRestoreWindow={restoreWindow}
      />
    </>
  )
}
