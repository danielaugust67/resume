"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where, orderBy } from "firebase/firestore";

export default function AdminProjects() {
  const [nodes, setNodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [migrating, setMigrating] = useState(false);
  
  // File explorer state
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [breadcrumbs, setBreadcrumbs] = useState([{ id: null, name: "Root" }]);
  
  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formType, setFormType] = useState("folder"); // 'folder' or 'file'
  
  const [form, setForm] = useState({ 
    name: "", 
    desc: "", 
    href: "", 
    icon: "📁", 
    bg: "rgba(99,102,241,0.18)", 
    tech: "", 
    details: "",
    image: ""
  });

  const fetchNodes = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "projects"),
        where("parentId", "==", currentFolderId)
      );
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Sort: folders first, then files
      data.sort((a, b) => {
        if (a.type === "folder" && b.type !== "folder") return -1;
        if (a.type !== "folder" && b.type === "folder") return 1;
        return a.name.localeCompare(b.name);
      });
      
      setNodes(data);
    } catch (error) {
      console.error("Error fetching nodes:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNodes();
  }, [currentFolderId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const dataToSave = {
      name: form.name,
      type: formType,
      parentId: currentFolderId,
      icon: form.icon || (formType === "folder" ? "📁" : "📄"),
      bg: form.bg || "rgba(99,102,241,0.18)",
      desc: form.desc,
      href: form.href || "",
      image: form.image || "",
      tech: form.tech ? form.tech.split(",").map(t => t.trim()).filter(Boolean) : [],
      details: form.details ? form.details.split("\n").filter(d => d.trim() !== "") : []
    };

    if (editingId) {
      await updateDoc(doc(db, "projects", editingId), dataToSave);
    } else {
      await addDoc(collection(db, "projects"), dataToSave);
    }
    
    closeForm();
    fetchNodes();
  };

  const handleEdit = (node) => {
    setFormType(node.type);
    setForm({
      name: node.name || "",
      desc: node.desc || "",
      href: node.href || "",
      icon: node.icon || "",
      bg: node.bg || "",
      tech: node.tech ? node.tech.join(", ") : "",
      details: node.details ? node.details.join("\n") : "",
      image: node.image || ""
    });
    setEditingId(node.id);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this item? If it's a folder, make sure it's empty!")) {
      await deleteDoc(doc(db, "projects", id));
      fetchNodes();
    }
  };

  const navigateToFolder = (folderId, folderName) => {
    setCurrentFolderId(folderId);
    if (folderId === null) {
      setBreadcrumbs([{ id: null, name: "Root" }]);
    } else {
      setBreadcrumbs([...breadcrumbs, { id: folderId, name: folderName }]);
    }
  };

  const navigateToBreadcrumb = (index) => {
    const target = breadcrumbs[index];
    setCurrentFolderId(target.id);
    setBreadcrumbs(breadcrumbs.slice(0, index + 1));
  };

  const openNewForm = (type) => {
    setFormType(type);
    setEditingId(null);
    setForm({ name: "", desc: "", href: "", icon: type === "folder" ? "📁" : "📄", bg: "rgba(99,102,241,0.18)", tech: "", details: "", image: "" });
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
  };

  const migrateOldProjects = async () => {
    if (!confirm("This will migrate old projects to the new File System format. Continue?")) return;
    setMigrating(true);
    try {
      // Query ALL projects
      const querySnapshot = await getDocs(collection(db, "projects"));
      for (const docSnapshot of querySnapshot.docs) {
        const data = docSnapshot.data();
        if (data.parentId === undefined || data.type === undefined) {
          await updateDoc(doc(db, "projects", docSnapshot.id), {
            parentId: null,
            type: "file"
          });
        }
      }
      fetchNodes();
      alert("Migration complete!");
    } catch (error) {
      console.error(error);
      alert("Error during migration");
    }
    setMigrating(false);
  };

  const inputClass = "w-full px-4 py-2.5 bg-zinc-950/50 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Project Explorer</h1>
          <p className="text-zinc-400 mt-1">Organize your projects into folders and files</p>
        </div>
        
        <div className="flex gap-3">
          <button onClick={migrateOldProjects} disabled={migrating} className="px-4 py-2 bg-orange-600/20 text-orange-400 hover:bg-orange-600/30 font-medium rounded-xl border border-orange-600/30 transition-colors">
            {migrating ? "Migrating..." : "Migrate Old Projects"}
          </button>
          <button onClick={() => openNewForm("folder")} className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-xl border border-zinc-700 transition-colors flex items-center gap-2">
            <span>+</span> New Folder
          </button>
          <button onClick={() => openNewForm("file")} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-lg shadow-indigo-500/20 transition-colors flex items-center gap-2">
            <span>+</span> New File
          </button>
        </div>
      </div>

      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 mb-6 px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl">
        {breadcrumbs.map((crumb, idx) => (
          <div key={idx} className="flex items-center gap-2">
            {idx > 0 && <span className="text-zinc-600">/</span>}
            <button 
              onClick={() => navigateToBreadcrumb(idx)}
              className={`hover:text-indigo-400 transition-colors ${idx === breadcrumbs.length - 1 ? 'text-white font-medium' : 'text-zinc-400'}`}
            >
              {crumb.name}
            </button>
          </div>
        ))}
      </div>
      
      {/* Form Overlay */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 border-b border-zinc-800 pb-4">
              <h3 className="text-xl font-bold text-white">
                {editingId ? `Edit ${formType}` : `Create New ${formType}`}
              </h3>
              <button onClick={closeForm} className="text-zinc-400 hover:text-white text-2xl">&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1.5">{formType === 'folder' ? 'Folder Name' : 'Project/File Name'}</label>
                  <input type="text" placeholder={formType === 'folder' ? "e.g. Loom Framework" : "e.g. Frontend Specs"} value={form.name} onChange={e => setForm({...form, name: e.target.value})} required className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1.5">Short Description</label>
                  <input type="text" placeholder="Short description..." value={form.desc} onChange={e => setForm({...form, desc: e.target.value})} className={inputClass} />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1.5">Icon / Emoji</label>
                  <input type="text" placeholder={formType === 'folder' ? "📁" : "📄"} value={form.icon} onChange={e => setForm({...form, icon: e.target.value})} className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1.5">Background Color (RGBa)</label>
                  <input type="text" placeholder="rgba(99,102,241,0.18)" value={form.bg} onChange={e => setForm({...form, bg: e.target.value})} className={inputClass} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1.5">External URL / Link (Optional)</label>
                  <input type="text" placeholder="https://..." value={form.href} onChange={e => setForm({...form, href: e.target.value})} className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1.5">Image URL (Optional)</label>
                  <input type="text" placeholder="https://imgur.com/..." value={form.image} onChange={e => setForm({...form, image: e.target.value})} className={inputClass} />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1.5">Technologies (Comma separated)</label>
                  <input type="text" placeholder="React, Node.js, Tailwind" value={form.tech} onChange={e => setForm({...form, tech: e.target.value})} className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1.5">Details / Features (One per line)</label>
                  <textarea placeholder="- Designed architecture&#10;- Implemented Auth" value={form.details} onChange={e => setForm({...form, details: e.target.value})} className={`${inputClass} min-h-[100px] resize-y`} />
                </div>
              </div>

              <div className="flex gap-3 mt-4 pt-4 border-t border-zinc-800 justify-end">
                <button type="button" onClick={closeForm} className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-xl border border-zinc-700 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors shadow-lg shadow-indigo-500/20">
                  {editingId ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* File Explorer Grid */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : nodes.length === 0 ? (
          <div className="text-center p-16 bg-zinc-900/50 border border-zinc-800/50 rounded-2xl border-dashed">
            <div className="text-4xl mb-4 text-zinc-600">📭</div>
            <p className="text-zinc-400">This folder is empty. Create a new folder or file to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {nodes.map(node => (
              <div 
                key={node.id} 
                className="group bg-zinc-900 border border-zinc-800 hover:border-zinc-700 p-5 rounded-2xl flex flex-col justify-between transition-all shadow-sm cursor-pointer"
                onClick={() => node.type === 'folder' ? navigateToFolder(node.id, node.name) : null}
              >
                <div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-inner shrink-0" style={{ backgroundColor: node.bg || (node.type === 'folder' ? 'rgba(59,130,246,0.2)' : '#333') }}>
                      {node.icon || (node.type === 'folder' ? '📁' : '📄')}
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="font-bold text-white text-lg truncate group-hover:text-indigo-400 transition-colors">
                        {node.name}
                      </h4>
                      <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mt-1">
                        {node.type}
                      </p>
                    </div>
                  </div>
                  {node.desc && <p className="text-sm text-zinc-400 mt-4 line-clamp-2">{node.desc}</p>}
                </div>
                
                <div className="flex gap-2 mt-6 pt-4 border-t border-zinc-800/50 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                  <button onClick={() => handleEdit(node)} className="flex-1 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-medium rounded-lg transition-colors border border-zinc-700">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(node.id)} className="flex-1 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium rounded-lg transition-colors border border-red-500/20">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
