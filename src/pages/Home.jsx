import { useNavigate } from "react-router-dom";
import QRCard from "../components/QRCard";

export default function Home() {
  const sessionId = Math.random().toString(36).substring(2, 10);
  const sessionUrl = `${window.location.origin}/#/session/${sessionId}`;

  return (
    <div className="container">
      <div className="card">
        <h1>📤 File Transfer</h1>
        <p style={{ opacity: 0.8, margin: "10px 0 20px" }}>
          Scan QR to connect phone & laptop
        </p>

        <QRCard url={sessionUrl} />

        <button
          style={{ marginTop: "20px" }}
          onClick={() => window.location.href = sessionUrl}
        >
          Continue on this device
        </button>
      </div>
    </div>
  );
}

