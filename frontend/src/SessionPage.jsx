import { useState } from "react";
import { supabase } from "./supabase";

export default function SessionPage() {
  const [msg, setMsg] = useState("");

  async function uploadFile(file) {
    if (!file) return;

    setMsg("Uploading...");

    console.log("SUPABASE URL:", import.meta.env.VITE_SUPABASE_URL);
    console.log("SUPABASE KEY:", import.meta.env.VITE_SUPABASE_ANON_KEY);

    try {
      const { data, error } = await supabase.storage
        .from("File-Transfer")
        .upload("debug-test.txt", file);

      console.log("UPLOAD DATA:", data);
      console.log("UPLOAD ERROR:", error);

      if (error) {
        setMsg("❌ " + error.message);
        return;
      }

      setMsg("✅ Upload success");
    } catch (e) {
      console.error("CATCH ERROR:", e);
      setMsg("❌ " + e.message);
    }
  }

  return (
    <div style={{ padding: 40 }}>
      <h2>Upload Test</h2>
      <input type="file" onChange={e => uploadFile(e.target.files[0])} />
      <p>{msg}</p>
    </div>
  );
}
