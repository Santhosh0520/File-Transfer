export function createPeerConnection(onDataChannel, onIceCandidate) {
  const pc = new RTCPeerConnection({
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" }
    ],
  });

  pc.ondatachannel = (event) => {
    onDataChannel(event.channel);
  };

  pc.onicecandidate = (event) => {
    if (event.candidate) {
      onIceCandidate(event.candidate);
    }
  };

  return pc;
}
