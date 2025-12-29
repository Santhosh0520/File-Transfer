import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io("https://file-transfer-backend-us1y.onrender.com");

export default function Session() {
  const { id: roomId } = useParams();
  const pcRef = useRef(null);
  const [status, setStatus] = useState("Connecting...");

  useEffect(() => {
    console.log("🚀 Session started, room:", roomId);

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
    });
    pcRef.current = pc;

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        console.log("🧊 ICE candidate generated");
        socket.emit("ice", { roomId, candidate: e.candidate });
      }
    };

    pc.oniceconnectionstatechange = () => {
      console.log("❄ ICE state:", pc.iceConnectionState);
    };

    pc.onconnectionstatechange = () => {
      console.log("🔗 Connection state:", pc.connectionState);
    };

    pc.ondatachannel = (e) => {
      console.log("📡 Data channel received");
      e.channel.onopen = () => {
        console.log("✅ Data channel open");
        setStatus("Connected ✅");
      };
    };

    socket.emit("join-room", roomId);
    console.log("📨 join-room emitted");

    socket.on("role", async (role) => {
      console.log("🎭 Role received:", role);

      if (role === "offerer") {
        console.log("📤 Creating data channel");
        const dc = pc.createDataChannel("data");

        dc.onopen = () => {
          console.log("✅ Data channel open (offerer)");
          setStatus("Connected ✅");
        };

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        console.log("📄 Offer created");
        socket.emit("offer", { roomId, offer });
      }
    });

    socket.on("offer", async (offer) => {
      console.log("📄 Offer received");
      await pc.setRemoteDescription(offer);

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      console.log("📄 Answer created");
      socket.emit("answer", { roomId, answer });
    });

    socket.on("answer", async (answer) => {
      console.log("📄 Answer received");
      await pc.setRemoteDescription(answer);
    });

    socket.on("ice", async (candidate) => {
      console.log("🧊 ICE candidate received");
      await pc.addIceCandidate(candidate);
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
