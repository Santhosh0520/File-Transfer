import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "./supabase";

export default function SessionPage() {
  const { id } = useParams();

  useEffect(() => {
    async function testConnection() {
      const { data, error } = await supabase.storage.listBuckets();
      console.log("Buckets:", data);
      console.log("Error:", error);
    }
    testConnection();
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h1>Session ID: {id}</h1>
      <p>Check console for Supabase connection</p>
    </div>
  );
}

