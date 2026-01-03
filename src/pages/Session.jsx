import { useState } from "react";
import { useParams } from "react-router-dom";

export default function Session() {
  const { id: sessionId } = useParams();
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  const [status, setStatus] = useState(
    isMobile ? "Waiting for file…" : "Select a file to upload"
  );
  const [downloadLink, setDownloadLink] = useState(null);

  const uploadFile = async (file) => {
    if (!file) return;

    setStatus("Uploading...");

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(
      `https://file-transfer-backend-us1y.onrender.com/upload/${sessionId}`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();

    setDownloadLink(
      `https://file-transfer-backend-us1y.onrender.com/download/${data.fileName}`
    );

    setStatus("Upload completed ✅");
  };

  return (
    <div className="container">
      <div className="card">
        <h2>{status}</h2>

        {/* Laptop only */}
        {!isMobile && (
          <input
            type="file"
            onChange={(e) => uploadFile(e.target.files[0])}
          />
        )}

        {/* Phone only */}
        {isMobile && (
          <p style={{ marginTop: "10px" }}>
            Refresh after upload to download
          </p>
        )}

        {/* Download button (after refresh) */}
        {downloadLink && (
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
