import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { createPeerConnection } from "../webrtc.js";

const socket = io("https://file-transfer-backend-us1y.onrender.com", {
  transports: ["websocket"],
});

export default function Session() {
  const { id: roomId } = useParams();
  const [status, setStatus] = useState("Connecting...");
  const pcRef = useRef(null);
  const iceQueue = useRef([]);

  useEffect(() => {
    socket.emit("join-room", roomId);

    const pc = createPeerConnection(
      (dc) => {
        dc.onopen = () => {
          setStatus("Connected ✅");
        };
      },
      (candidate) => {
        socket.emit("ice-candidate", { roomId, candidate });
      }
    );

    pcRef.current = pc;

    socket.on("role", async (role) => {
      if (role === "offerer") {
        const dc = pc.createDataChannel("file-transfer");
        dc.onopen = () => setStatus("Connected ✅");

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit("offer", { roomId, offer });
      }
    });

    socket.on("offer", async (offer) => {
      await pc.setRemoteDescription(offer);

      // Apply buffered ICE
      iceQueue.current.forEach(c => pc.addIceCandidate(c));
      iceQueue.current = [];

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit("answer", { roomId, answer });
    });

    socket.on("answer", async (answer) => {
      await pc.setRemoteDescription(answer);

      // Apply buffered ICE
      iceQueue.current.forEach(c => pc.addIceCandidate(c));
      iceQueue.current = [];
    });

    socket.on("ice-candidate", async (candidate) => {
      if (pc.remoteDescription) {
        await pc.addIceCandidate(candidate);
      } else {
        iceQueue.current.push(candidate);
      }
    });

    return () => {
      socket.off("role");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
      // ❌ DO NOT disconnect socket here
    };
  }, [roomId]);

  return (
    <div className="container">
      <div className="card">
        <h2>🔗 Connection Status</h2>
        <p>{status}</p>
      </div>
    </div>
  );
}
