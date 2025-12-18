import { QRCodeSVG } from "qrcode.react";

export default function QRPage() {
  // SAFE session id (no crypto API)
  const sessionId = Math.random().toString(36).substring(2, 10);
  const sessionUrl =
  "https://file-transfer.vercel.app/session/" + sessionId;



  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#020617"
    }}>
      <div style={{
        background: "#0f172a",
        padding: "30px",
        borderRadius: "16px",
        color: "white",
        textAlign: "center"
      }}>
        <h1>SK File Transfer</h1>
        <p>Scan this QR from your phone</p>

        <QRCodeSVG value={sessionUrl} size={200} />

        <p style={{ marginTop: 10, fontSize: 12 }}>
          Session ID: {sessionId}
        </p>
      </div>
    </div>
  );
}
