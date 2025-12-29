export default function FileSender({ socket, sessionId }) {
  const sendFile = async (file) => {
    const chunkSize = 16 * 1024; // 16KB
    let offset = 0;

    socket.emit("file-start", {
      sessionId,
      fileName: file.name,
      fileSize: file.size,
    });

    while (offset < file.size) {
      const slice = file.slice(offset, offset + chunkSize);
      const buffer = await slice.arrayBuffer();
      socket.emit("file-chunk", { sessionId, chunk: buffer });
      offset += chunkSize;
    }

    socket.emit("file-end", { sessionId });
  };

  return (
    <input
      type="file"
      onChange={(e) => sendFile(e.target.files[0])}
    />
  );
}
