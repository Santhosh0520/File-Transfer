import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io("https://file-transfer-backend-us1y.onrender.com", {
  transports: ["websocket"],
});

export default function Session() {
  const { id: roomId } = useParams();
  const [status, setStatus] = useState("Connecting...");
  const pcRef = useRef(null);

  useEffect(() => {
    socket.emit("join-room", roomId);
    socket.emit("get-turn-credentials");

    socket.on("turn-credentials", async (iceServers) => {
      const pc = new RTCPeerConnection({ iceServers });
      pcRef.current = pc;

      pc.onicecandidate = (e) => {
        if (e.candidate) {
          socket.emit("ice-candidate", { roomId, candidate: e.candidate });
        }
      };

      pc.ondatachannel = (e) => {
        e.channel.onopen = () => setStatus("Connected ✅");
      };

      const dc = pc.createDataChannel("file");
      dc.onopen = () => setStatus("Connected ✅");

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket.emit("offer", { roomId, offer });

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
    });
  }, [roomId]);

  return (
    <div className="container">
      <div className="card">
        <h2>Connection Status</h2>
        <p>{status}</p>
      </div>
    </div>
  );
}
