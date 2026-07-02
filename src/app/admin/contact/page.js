"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, deleteDoc, doc, orderBy, query } from "firebase/firestore";

export default function AdminContact() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this message?")) {
      await deleteDoc(doc(db, "messages", id));
      fetchMessages();
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Contact Messages</h1>
          <p className="text-zinc-400 mt-1">Read messages from your portfolio visitors</p>
        </div>
      </div>
      
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center p-12 bg-zinc-900/50 border border-zinc-800/50 rounded-2xl border-dashed">
            <div className="text-4xl mb-4">📬</div>
            <h3 className="text-lg font-medium text-zinc-300">No messages yet</h3>
            <p className="text-zinc-500 mt-1">When someone contacts you, their message will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {messages.map(msg => (
              <div key={msg.id} className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-start justify-between gap-6 hover:border-zinc-700 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-bold text-white text-lg">{msg.name}</h4>
                    <span className="text-zinc-600 text-sm">•</span>
                    <a href={`mailto:${msg.email}`} className="text-indigo-400 hover:text-indigo-300 text-sm">
                      {msg.email}
                    </a>
                  </div>
                  
                  <div className="bg-zinc-950/50 border border-zinc-800/50 p-4 rounded-xl mt-3">
                    <p className="text-zinc-300 whitespace-pre-wrap">{msg.message}</p>
                  </div>
                  
                  {msg.createdAt && (
                    <div className="mt-4 text-xs text-zinc-500">
                      Received: {new Date(msg.createdAt?.seconds * 1000).toLocaleString()}
                    </div>
                  )}
                </div>
                
                <div>
                  <button 
                    onClick={() => handleDelete(msg.id)} 
                    className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-medium rounded-xl transition-colors border border-red-500/20"
                  >
                    Delete Message
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
