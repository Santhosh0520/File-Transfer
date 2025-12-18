import { useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "./supabase";

export default function SessionPage() {
  const { id } = useParams();
  const [msg, setMsg] = useState("");

  console.log("SUPABASE CLIENT:", supabase);

  async function uploadFile(file) {
    if (!file) return;

    setMsg("Uploading...");

    console.log("Bucket test starting...");

    const { data, error } = await supabase
      .storage
      .from("File-Transfer")
      .upload(`test-${Date.now()}.txt`, file);

    console.log("DATA:", data);
    console.log("ERROR:", error);

    if (error) {
      setMsg("❌ " + error.message);
      return;
    }

    setMsg("✅ Upload success");
  }

  return (
    <div style={{ padding: 40 }}>
      <h2>Session {id}</h2>
      <input type="file" onChange={e => uploadFile(e.target.files[0])} />
      <p>{msg}</p>
    </div>
  );
}

