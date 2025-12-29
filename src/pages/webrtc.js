export function createPeerConnection(onDataChannel) {
  const pc = new RTCPeerConnection({
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" }
    ]
  });

  pc.ondatachannel = (event) => {
    onDataChannel(event.channel);
  };

  return pc;
}
