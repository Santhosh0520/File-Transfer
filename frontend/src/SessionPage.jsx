import { useState } from "react";
import { supabase } from "./supabase";

export default function SessionPage() {
  const [msg, setMsg] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  async function uploadFile(file) {
    if (!file) return;

    setMsg("Uploading...");
    setIsUploading(true);

    try {
      // Create a unique filename so it doesn't conflict
      const fileName = `${Date.now()}-${file.name}`;

      const { data, error } = await supabase.storage
        .from("File-Transfer")
        .upload(fileName, file);

      if (error) {
        throw error;
      }

      console.log("UPLOAD SUCCESS:", data);
      setMsg("✅ Upload successful!");
    } catch (e) {
      console.error("UPLOAD ERROR:", e);
      // This handles the CORS or Network error
      setMsg("❌ Error: " + (e.message || "Check CORS settings in Supabase"));
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div style={{ padding: 40, color: "white", background: "#020617", minHeight: "100vh" }}>
      <h2>Upload File</h2>
      <input 
        type="file" 
        onChange={e => uploadFile(e.target.files[0])} 
        disabled={isUploading}
      />
      <p style={{ marginTop: "20px", fontWeight: "bold" }}>{msg}</p>
      {isUploading && <div className="spinner">Please wait...</div>}
    </div>
  );
}
