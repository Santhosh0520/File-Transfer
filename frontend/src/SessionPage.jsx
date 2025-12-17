import { useParams } from "react-router-dom";
import { useState } from "react";
import { supabase } from "./supabase";

export default function SessionPage() {
  const { id } = useParams();
  const [message, setMessage] = useState("");

  async function uploadFile(file) {
    if (!file) return;

    setMessage("Uploading...");

    const filePath = `sessions/${id}/${Date.now()}_${file.name}`;

    const { error } = await supabase.storage
      .from("File-Transfer")
      .upload(filePath, file, {
        upsert: true,
      });

    if (error) {
      console.error(error);
      setMessage("❌ Upload failed");
      return;
    }

    setMessage("✅ Upload completed");
  }

  return (
    <div style={{ padding: 40 }}>
      <h2>Connected to Session</h2>
      <p>{id}</p>

      <input
        type="file"
        onChange={(e) => uploadFile(e.target.files[0])}
      />

      <p>{message}</p>
    </div>
  );
}

