import { QRCodeSVG } from "qrcode.react";

export default function QRCard({ url }) {
  return (
    <div style={{ background: "white", padding: "10px", borderRadius: "12px" }}>
      <QRCodeSVG value={url} size={200} />
    </div>
  );
}
