import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import FileSender from "../components/FileSender";

const socket = io("https://file-transfer-backend-us1y.onrender.com");

export default function Session() {
  const { id: sessionId } = useParams();

  const [status, setStatus] = useState("Connected to session");
  const [progress, setProgress] = useState(0);
  const [isReceiver, setIsReceiver] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);

  useEffect(() => {
    socket.emit("join-session", sessionId);

    let receivedChunks = [];
    let receivedSize = 0;
    let fileSize = 0;
    let fileName = "";

    socket.on("file-start", ({ fileName: name, fileSize: size }) => {
      fileName = name;
      fileSize = size;
      receivedChunks = [];
      receivedSize = 0;

      setIsReceiver(true);
      setStatus(`Receiving ${fileName}`);
      setProgress(0);
    });

    socket.on("file-chunk", (chunk) => {
      receivedChunks.push(chunk);
      receivedSize += chunk.byteLength;

      const percent = Math.floor((receivedSize / fileSize) * 100);
      setProgress(percent);
    });

    socket.on("file-end", () => {
      const blob = new Blob(receivedChunks);
      const url = URL.createObjectURL(blob);

      setDownloadUrl(url);
      setStatus("File ready to download 📥");
      setProgress(100);
    });

    return () => {
      socket.off("file-start");
      socket.off("file-chunk");
      socket.off("file-end");
    };
  }, [sessionId]);

  return (
    <div className="container">
      <div className="card">
        <h2>{status}</h2>

        <progress value={progress} max="100" />
        <p>{progress}%</p>

        {/* Laptop → Sender */}
        {!isReceiver && (
          <FileSender socket={socket} sessionId={sessionId} />
        )}

        {/* Phone → Receiver */}
        {isReceiver && downloadUrl && (
          <a
            href={downloadUrl}
            download
            style={{
              display: "inline-block",
              marginTop: "12px",
              padding: "10px 16px",
              background: "#22c55e",
              color: "#000",
              borderRadius: "10px",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Tap to Download
          </a>
        )}
      </div>
    </div>
  );
}
// 

