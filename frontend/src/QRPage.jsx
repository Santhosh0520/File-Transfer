
import { QRCodeSVG } from "qrcode.react";

export default function QRPage() {
  const sessionId = Math.random().toString(36).substring(2, 10);
  // Use the hash route correctly
  const sessionUrl = `https://file-transfer.vercel.app/#/session/${sessionId}`;

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#020617",
      color: "white"
    }}>
      <div style={{
        background: "#0f172a",
        padding: "40px",
        borderRadius: "20px",
        textAlign: "center",
        boxShadow: "0 10px 25px rgba(0,0,0,0.5)"
      }}>
        <h1 style={{ marginBottom: "10px" }}>SK File Transfer</h1>
        <p style={{ marginBottom: "20px", opacity: 0.8 }}>Scan to start transfer</p>

        <div style={{ background: "white", padding: "15px", borderRadius: "10px", display: "inline-block" }}>
          <QRCodeSVG value={sessionUrl} size={200} />
        </div>

        <p style={{ marginTop: 20, fontSize: 14, fontPadding: "5px", background: "#1e293b", borderRadius: "5px" }}>
          Session ID: <strong>{sessionId}</strong>
        </p>
      </div>
    </div>
  );
}