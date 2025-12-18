import { useState } from "react";
import { supabase } from "./supabase";

export default function SessionPage() {
  const [msg, setMsg] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  async function uploadFile(file) {
    if (!file) return;

    setMsg("Starting Supabase upload...");
    setIsUploading(true);

    try {
      // 1. Create a truly unique name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.floor(Math.random() * 1000)}.${fileExt}`;

      // 2. Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from("File-Transfer") 
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      console.log("SUCCESS:", data);
      setMsg("✅ File uploaded successfully to Supabase!");
      
    } catch (err) {
      console.error("UPLOAD FAILED:", err);
      // Detailed error message to help you debug CORS vs Permissions
      setMsg(`❌ Error: ${err.message || "Connection failed. Check Supabase CORS settings."}`);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div style={{ padding: 40, color: "white", background: "#020617", minHeight: "100vh" }}>
      <h2 style={{ borderBottom: "1px solid #334155", paddingBottom: "10px" }}>Secure File Upload</h2>
      <div style={{ marginTop: "20px" }}>
        <input 
          type="file" 
          onChange={e => uploadFile(e.target.files[0])} 
          disabled={isUploading}
          style={{ padding: "10px", background: "#1e293b", borderRadius: "5px", color: "white" }}
        />
      </div>
      <div style={{ 
        marginTop: "30px", 
        padding: "15px", 
        borderRadius: "8px", 
        backgroundColor: isUploading ? "#1e293b" : "#0f172a",
        border: "1px solid #334155"
      }}>
        <strong>Status:</strong> {msg}
      </div>
    </div>
  );
}
