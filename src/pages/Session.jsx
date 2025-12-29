import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { createPeerConnection } from "../webrtc.js";

const socket = io("http://localhost:5000");

export default function Session() {
  const { id: roomId } = useParams();
  const [status, setStatus] = useState("Connecting...");
  const [channel, setChannel] = useState(null);

  useEffect(() => {
    socket.emit("join-room", roomId);

    const pc = createPeerConnection(
      (dc) => {
        setChannel(dc);
        setStatus("Connected ✅");
      },
      (candidate) => {
        socket.emit("ice-candidate", { roomId, candidate });
      }
    );

    const dc = pc.createDataChannel("file-transfer");

    dc.onopen = () => {
      setChannel(dc);
      setStatus("Connected ✅");
    };

    socket.on("offer", async (offer) => {
      await pc.setRemoteDescription(offer);
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit("answer", { roomId, answer });
    });

    socket.on("answer", async (answer) => {
      await pc.setRemoteDescription(answer);
    });

    socket.on("ice-candidate", async (candidate) => {
      await pc.addIceCandidate(candidate);
    });

    pc.createOffer().then((offer) => {
      pc.setLocalDescription(offer);
      socket.emit("offer", { roomId, offer });
    });

    return () => socket.disconnect();
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
