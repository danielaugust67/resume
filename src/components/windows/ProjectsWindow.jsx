import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { collection, getDocs, query, where } from 'firebase/firestore'

export default function ProjectsWindow() {
  const [nodes, setNodes] = useState([])
  
  // File explorer state
  const [currentFolderId, setCurrentFolderId] = useState(null)
  const [breadcrumbs, setBreadcrumbs] = useState([{ id: null, name: "Root" }])
  const [activeFile, setActiveFile] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchNodes = async (folderId) => {
    setLoading(true)
    try {
      const q = query(
        collection(db, "projects"),
        where("parentId", "==", folderId)
      )
      const querySnapshot = await getDocs(q)
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      
      // Sort: folders first, then files
      data.sort((a, b) => {
        if (a.type === "folder" && b.type !== "folder") return -1;
        if (a.type !== "folder" && b.type === "folder") return 1;
        return a.name.localeCompare(b.name);
      });
      
      setNodes(data)
    } catch (error) {
      console.error("Error fetching project nodes:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNodes(currentFolderId)
  }, [currentFolderId])

  const navigateToFolder = (folderNode) => {
    setCurrentFolderId(folderNode.id)
    setBreadcrumbs([...breadcrumbs, folderNode])
  }

  const navigateUp = () => {
    if (breadcrumbs.length > 1) {
      const newBreadcrumbs = breadcrumbs.slice(0, -1)
      const targetFolder = newBreadcrumbs[newBreadcrumbs.length - 1]
      setCurrentFolderId(targetFolder.id)
      setBreadcrumbs(newBreadcrumbs)
    }
  }

  const openFile = (fileNode) => {
    setActiveFile(fileNode)
  }

  const closeFile = () => {
    setActiveFile(null)
  }

  // If a file is open, show the details view
  if (activeFile) {
    const p = activeFile
    return (
      <div className="wc-body" style={{ overflowY: 'auto', height: '100%' }}>
        <button 
          className="back-btn" 
          onClick={closeFile}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Folder
        </button>

        <div className="project-detail-header">
          <div className="proj-icon large" style={{ background: p.bg }}>
            {p.icon || '📄'}
          </div>
          <div>
            <div className="wc-title">{p.name}</div>
            <div className="wc-subtitle" style={{ marginBottom: 8 }}>{p.desc}</div>
            <div className="proj-badges">
              {p.tech && p.tech.map(t => (
                <span className="proj-badge" key={t}>{t}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="wc-divider" />

        <div className="wc-section">
          <div className="wc-section-label">Document Details</div>
          <div className="timeline-desc" style={{ color: '#ccc', fontSize: '14px', lineHeight: '1.6' }}>
            {Array.isArray(p.details) ? (
              p.details.length > 0 ? (
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  {p.details.map((detail, idx) => (
                    <li key={idx} style={{ marginBottom: '4px' }}>{detail}</li>
                  ))}
                </ul>
              ) : (
                <div style={{ color: '#888' }}>No details provided.</div>
              )
            ) : p.details ? (
              <div style={{ whiteSpace: 'pre-wrap' }}>{p.details}</div>
            ) : (
              <div style={{ color: '#888' }}>No details provided.</div>
            )}
          </div>
        </div>

        {p.href && p.href !== '#' && (
          <div style={{ marginTop: '20px' }}>
            <a 
              href={p.href} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="resume-download"
            >
              Open External Link
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '6px' }}>
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </a>
          </div>
        )}
      </div>
    )
  }

  // File explorer view
  return (
    <div className="wc-body" style={{ overflowY: 'auto', height: '100%', display: 'flex', flexDirection: 'column' }}>
      
      {/* File Explorer Header & Breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <button 
          onClick={navigateUp}
          disabled={breadcrumbs.length <= 1}
          style={{
            background: 'rgba(255,255,255,0.1)', border: 'none', color: breadcrumbs.length > 1 ? '#fff' : '#555',
            padding: '6px', borderRadius: '6px', cursor: breadcrumbs.length > 1 ? 'pointer' : 'default',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#aaa', overflowX: 'auto', whiteSpace: 'nowrap' }}>
          {breadcrumbs.map((crumb, idx) => (
            <span key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {idx > 0 && <span>/</span>}
              <span style={{ color: idx === breadcrumbs.length - 1 ? '#fff' : '#aaa', fontWeight: idx === breadcrumbs.length - 1 ? 'bold' : 'normal' }}>
                {crumb.name}
              </span>
            </span>
          ))}
        </div>
      </div>

      <div style={{ flex: 1 }}>
        {breadcrumbs.length > 1 && (
          (() => {
            const currentFolder = breadcrumbs[breadcrumbs.length - 1];
            if (!currentFolder.desc && (!currentFolder.tech || currentFolder.tech.length === 0) && (!currentFolder.details || currentFolder.details.length === 0) && !currentFolder.image) {
              return null;
            }
            return (
              <div style={{ marginBottom: '24px', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                {currentFolder.image && (
                  <div style={{ marginBottom: '16px', borderRadius: '8px', overflow: 'hidden' }}>
                    <img src={currentFolder.image} alt={currentFolder.name} style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }} />
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <h3 style={{ margin: 0, color: '#fff', fontSize: '20px' }}>{currentFolder.name}</h3>
                  {currentFolder.href && (
                    <a href={currentFolder.href} target="_blank" rel="noopener noreferrer" style={{ color: '#60a5fa', textDecoration: 'none', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      Open Link
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                    </a>
                  )}
                </div>
                {currentFolder.desc && <p style={{ color: '#aaa', margin: '0 0 12px 0', fontSize: '14px' }}>{currentFolder.desc}</p>}
                
                {currentFolder.tech && currentFolder.tech.length > 0 && (
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
                    {currentFolder.tech.map(t => (
                      <span key={t} style={{ background: 'rgba(59,130,246,0.1)', color: '#60a5fa', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>{t}</span>
                    ))}
                  </div>
                )}

                {currentFolder.details ? (
                  Array.isArray(currentFolder.details) && currentFolder.details.length > 0 ? (
                    <ul style={{ color: '#ccc', margin: 0, paddingLeft: '20px', fontSize: '14px' }}>
                      {currentFolder.details.map((detail, idx) => (
                        <li key={idx} style={{ marginBottom: '4px' }}>{detail}</li>
                      ))}
                    </ul>
                  ) : typeof currentFolder.details === 'string' && currentFolder.details.length > 0 ? (
                    <div style={{ color: '#ccc', fontSize: '14px', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                      {currentFolder.details}
                    </div>
                  ) : null
                ) : null}
              </div>
            )
          })()
        )}
        {loading ? (
          <div style={{ color: '#aaa', textAlign: 'center', marginTop: '40px' }}>Loading...</div>
        ) : nodes.length === 0 ? (
          <div style={{ color: '#666', textAlign: 'center', marginTop: '40px' }}>This folder is empty.</div>
        ) : (
          <div className="projects-grid">
            {nodes.map((node) => (
              <div
                key={node.id}
                className="proj-folder"
                onClick={() => node.type === 'folder' ? navigateToFolder(node) : openFile(node)}
              >
                <div className="proj-folder-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '42px', lineHeight: 1 }}>
                  {node.icon || (node.type === 'folder' ? '📁' : '📄')}
                </div>
                <div className="proj-folder-name" style={{ marginTop: '8px' }}>{node.name}</div>
                {node.desc && <div style={{ fontSize: '11px', color: '#888', marginTop: '4px', textAlign: 'center', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{node.desc}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
