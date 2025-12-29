import { useEffect, useState } from "react";
import { createPeerConnection } from "../webrtc";

export default function Session() {
  const [status, setStatus] = useState("Waiting for connection...");
  const [channel, setChannel] = useState(null);

  useEffect(() => {
    const pc = createPeerConnection((dc) => {
      setChannel(dc);
      setStatus("Connected ✅");
    });

    // Create data channel on one side
    const dc = pc.createDataChannel("file-transfer");

    dc.onopen = () => {
      setChannel(dc);
      setStatus("Connected ✅");
    };

    dc.onmessage = (e) => {
      console.log("Received:", e.data);
    };

    // TEMP: just log offer (signaling comes next)
    pc.createOffer().then(offer => {
      pc.setLocalDescription(offer);
      console.log("OFFER:", JSON.stringify(offer));
    });

  }, []);

  return (
    <div className="container">
      <div className="card">
        <h2>🔗 WebRTC Status</h2>
        <p>{status}</p>
      </div>
    </div>
  );
}
