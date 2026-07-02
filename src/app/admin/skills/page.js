"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";

const PREDEFINED_CATEGORIES = [
  "Backend & Frameworks",
  "Frontend & Platforms",
  "Database & Tools",
  "Soft Skills",
  "Other"
];

export default function AdminSkills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", icon: "", category: "Frontend & Platforms" });
  const [editingId, setEditingId] = useState(null);

  const fetchSkills = async () => {
    setLoading(true);
    const querySnapshot = await getDocs(collection(db, "skills"));
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setSkills(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await updateDoc(doc(db, "skills", editingId), form);
    } else {
      await addDoc(collection(db, "skills"), form);
    }
    setForm({ name: "", icon: "", category: "Frontend & Platforms" });
    setEditingId(null);
    fetchSkills();
  };

  const handleEdit = (skill) => {
    setForm({ name: skill.name, icon: skill.icon, category: skill.category });
    setEditingId(skill.id);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this skill?")) {
      await deleteDoc(doc(db, "skills", id));
      fetchSkills();
    }
  };

  const inputClass = "w-full px-4 py-2.5 bg-zinc-950/50 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all";

  // Group skills by category for display
  const groupedSkills = PREDEFINED_CATEGORIES.reduce((acc, cat) => {
    acc[cat] = skills.filter(s => s.category === cat);
    return acc;
  }, {});

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Skills & Tech Stack</h1>
          <p className="text-zinc-400 mt-1">Manage the technologies and skills you know</p>
        </div>
      </div>
      
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl mb-10">
        <h3 className="text-lg font-semibold text-white mb-6 border-b border-zinc-800 pb-4">
          {editingId ? "Edit Skill" : "Add New Skill"}
        </h3>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1.5">Skill Name</label>
              <input type="text" placeholder="e.g. React.js" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1.5">Icon (Emoji)</label>
              <input type="text" placeholder="e.g. ⚛️" value={form.icon} onChange={e => setForm({...form, icon: e.target.value})} required className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1.5">Category</label>
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className={`${inputClass} appearance-none`} required>
                {PREDEFINED_CATEGORIES.map(cat => <option key={cat} value={cat} className="bg-zinc-900">{cat}</option>)}
              </select>
            </div>
          </div>

          <div className="flex gap-3 mt-2">
            <button type="submit" className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors shadow-lg shadow-indigo-500/20">
              {editingId ? "Update Skill" : "Save Skill"}
            </button>
            {editingId && (
              <button 
                type="button" 
                onClick={() => { setEditingId(null); setForm({ name: "", icon: "", category: "Frontend & Platforms" }) }} 
                className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-xl border border-zinc-700 transition-colors"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="space-y-8">
        {loading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : skills.length === 0 ? (
          <div className="text-center p-12 bg-zinc-900/50 border border-zinc-800/50 rounded-2xl border-dashed">
            <p className="text-zinc-500">No skills found. Add your first skill above.</p>
          </div>
        ) : (
          PREDEFINED_CATEGORIES.map(cat => groupedSkills[cat]?.length > 0 && (
            <div key={cat} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
              <div className="bg-zinc-800/50 px-6 py-3 border-b border-zinc-800">
                <h4 className="font-semibold text-white">{cat}</h4>
              </div>
              <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                {groupedSkills[cat].map(skill => (
                  <div key={skill.id} className="flex items-center justify-between p-3 bg-zinc-950/50 border border-zinc-800 rounded-xl group hover:border-zinc-700 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{skill.icon}</span>
                      <span className="text-zinc-200 font-medium text-sm">{skill.name}</span>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                      <button onClick={() => handleEdit(skill)} className="text-indigo-400 hover:text-indigo-300">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                      </button>
                      <button onClick={() => handleDelete(skill.id)} className="text-red-400 hover:text-red-300">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
