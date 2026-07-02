"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function AdminAbout() {
  const [form, setForm] = useState({ 
    name: "", role: "", status: "Available for Work", 
    bio: "", location: "Indonesia 🇮🇩", degree: "", languages: "ID · EN" 
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchAbout = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "about", "profile");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setForm(docSnap.data());
        }
      } catch (error) {
        console.error("Error fetching about:", error);
      }
      setLoading(false);
    };
    fetchAbout();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      await setDoc(doc(db, "about", "profile"), form);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Error saving about:", error);
    }
    setSaving(false);
  };

  const inputClass = "w-full px-4 py-2.5 bg-zinc-950/50 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all";

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">About Me</h1>
          <p className="text-zinc-400 mt-1">Update your personal information and bio</p>
        </div>
      </div>
      
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-xl max-w-3xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1.5">Full Name</label>
              <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className={inputClass} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1.5">Role / Job Title</label>
              <input type="text" value={form.role} onChange={e => setForm({...form, role: e.target.value})} className={inputClass} required />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1.5">Work Status</label>
            <input type="text" value={form.status} onChange={e => setForm({...form, status: e.target.value})} className={inputClass} required />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1.5">Bio (Paragraphs separated by double line breaks)</label>
            <textarea value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} className={`${inputClass} min-h-[200px] resize-y`} required />
          </div>

          <h3 className="text-lg font-semibold text-white mt-4 border-b border-zinc-800 pb-2">Additional Info</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1.5">Location</label>
              <input type="text" value={form.location} onChange={e => setForm({...form, location: e.target.value})} className={inputClass} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1.5">Degree</label>
              <input type="text" value={form.degree} onChange={e => setForm({...form, degree: e.target.value})} className={inputClass} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1.5">Languages</label>
              <input type="text" value={form.languages} onChange={e => setForm({...form, languages: e.target.value})} className={inputClass} required />
            </div>
          </div>

          <div className="flex items-center gap-4 mt-6 pt-6 border-t border-zinc-800">
            <button 
              type="submit" 
              disabled={saving}
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors shadow-lg shadow-indigo-500/20 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Profile"}
            </button>
            
            {saved && (
              <span className="text-emerald-400 flex items-center gap-2 text-sm font-medium bg-emerald-400/10 px-3 py-1.5 rounded-lg border border-emerald-400/20">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Saved successfully!
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
