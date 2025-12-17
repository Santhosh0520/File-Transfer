import { useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "./supabase";

export default function SessionPage() {
  const { id } = useParams();
  const [uploading, setUploading] = useState(false);

  async function uploadFile(file) {
    if (!file) return;

    setUploading(true);

    // unique file path (important)
    const filePath = `sessions/${id}/${Date.now()}_${file.name}`;

    const { data, error } = await supabase.storage
      .from("File-Transfer")
      .upload(filePath, file, {
        upsert: true,
      });

    if (error) {
      console.error("Upload error:", error);
      alert("Upload failed ❌");
      setUploading(false);
      return;
    }

    console.log("Upload success:", data);
    alert("File uploaded successfully ✅");
    setUploading(false);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#020617",
        color: "white",
      }}
    >
      <div
        style={{
          background: "#0f172a",
          padding: "30px",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "400px",
          textAlign: "center",
        }}
      >
        <h2>Connected to Session</h2>
        <p style={{ fontSize: "14px", opacity: 0.8 }}>{id}</p>

        <input
          type="file"
          onChange={(e) => uploadFile(e.target.files[0])}
          style={{ marginTop: "20px" }}
        />

        {uploading && (
          <p style={{ marginTop: "15px", color: "#38bdf8" }}>
            Uploading...
          </p>
        )}
      </div>
    </div>
  );
}
