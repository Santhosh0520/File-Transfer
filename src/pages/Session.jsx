import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io("https://file-transfer-backend-us1y.onrender.com");

export default function Session() {
  const { id: sessionId } = useParams();
  const [status, setStatus] = useState("Connected to session");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    socket.emit("join-session", sessionId);

    let receivedChunks = [];
    let receivedSize = 0;
    let fileSize = 0;
    let fileName = "";

    socket.on("file-start", (data) => {
      fileName = data.fileName;
      fileSize = data.fileSize;
      receivedChunks = [];
      receivedSize = 0;
      setStatus(`Receiving ${fileName}`);
    });

    socket.on("file-chunk", (chunk) => {
      receivedChunks.push(chunk);
      receivedSize += chunk.byteLength;
      setProgress(Math.floor((receivedSize / fileSize) * 100));
    });

    socket.on("file-end", () => {
      const blob = new Blob(receivedChunks);
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();

      setStatus("File received ✅");
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
      </div>
    </div>
  );
}
