import { useParams } from "react-router-dom";
import { useState } from "react";

export default function SessionPage() {
  const { id } = useParams();
  const [message, setMessage] = useState("");

  async function uploadFile(file) {
    if (!file) return;

    alert("Upload started");
    setMessage("Uploading...");

    const filePath = `sessions/${id}/${Date.now()}_${file.name}`;

    try {
      const response = await fetch(
        "https://yfztfyhemmrxyvhjcoat.supabase.co/storage/v1/object/File-Transfer/" + filePath,
        {
          method: "POST",
          headers: {
            Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlmenRmeWhlbW1yeHl2aGpjb2F0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5NjQ4MjcsImV4cCI6MjA4MTU0MDgyN30.CCx5iztz9rmJEtFVP25aLgjGZEUCLeZVglrVx_6ppEE",
          },
          body: file,
        }
      );

      alert("Response status: " + response.status);

      if (!response.ok) {
        setMessage("❌ Upload blocked");
        return;
      }

      setMessage("✅ Upload success");
    } catch (err) {
      console.error(err);
      alert("Network error");
      setMessage("❌ Network error");
    }
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

