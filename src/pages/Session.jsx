import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Session() {
  const { id: sessionId } = useParams();
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  const [status, setStatus] = useState(
    isMobile ? "Waiting for file…" : "Select a file to upload"
  );
  const [downloadLink, setDownloadLink] = useState(null);

  const backend = "https://file-transfer-backend-us1y.onrender.com";

  // LAPTOP UPLOAD
  const uploadFile = async (file) => {
    if (!file) return;

    setStatus("Uploading...");

    const formData = new FormData();
    formData.append("file", file);

    await fetch(`${backend}/upload/${sessionId}`, {
      method: "POST",
      body: formData,
    });

    setStatus("Upload completed ✅");
  };

  // PHONE CHECKS FOR FILE
  useEffect(() => {
    if (!isMobile) return;

    const checkFile = async () => {
      const res = await fetch(`${backend}/session-file/${sessionId}`);
      const data = await res.json();

      if (data.available) {
        setDownloadLink(`${backend}/download/${data.fileName}`);
        setStatus("File ready to download 📥");
      }
    };

    const interval = setInterval(checkFile, 2000);
    return () => clearInterval(interval);
  }, [isMobile, sessionId]);

  return (
    <div className="container">
      <div className="card">
        <h2>{status}</h2>

        {/* Laptop */}
        {!isMobile && (
          <input type="file" onChange={(e) => uploadFile(e.target.files[0])} />
        )}

        {/* Phone */}
        {isMobile && downloadLink && (
          <a
            href={downloadLink}
            download
            style={{
              display: "block",
              marginTop: "15px",
              padding: "10px",
              background: "#22c55e",
              color: "#000",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Download File
          </a>
        )}
      </div>
    </div>
  );
}
