import { useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "./supabase";

export default function SessionPage() {
  const { id } = useParams();
  const [status, setStatus] = useState("");

  async function uploadFile(file) {
    if (!file) return;

    setStatus("Uploading...");

    const filePath = `sessions/${id}/${Date.now()}_${file.name}`;

    try {
      const { data, error } = await supabase.storage
        .from("file-transfer")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (error) {
        console.error("Supabase error:", error);
        setStatus("❌ Upload failed: " + error.message);
        return;
      }

      console.log("Upload success:", data);
      setStatus("✅ Upload completed!");
    } catch (err) {
      console.error("Unexpected error:", err);
      setStatus("❌ Unexpected error");
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#020617",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
      }}
    >
      <div
        style={{
          background: "#0f172a",
          padding: 30,
          borderRadius: 16,
          width: "100%",
          maxWidth: 400,
          textAlign: "center",
        }}
      >
        <h2>Connected to Session</h2>
        <p style={{ fontSize: 12, opacity: 0.7 }}>{id}</p>

        <input
          type="file"
          onChange={(e) => uploadFile(e.target.files[0])}
          style={{ marginTop: 20 }}
        />

        <p style={{ marginTop: 15 }}>{status}</p>
      </div>
    </div>
  );
}
