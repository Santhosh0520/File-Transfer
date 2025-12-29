export default function ProgressBar({ progress }) {
  return (
    <div style={{ marginTop: "15px" }}>
      <div style={{
        height: "8px",
        width: "100%",
        background: "#334155",
        borderRadius: "10px"
      }}>
        <div style={{
          height: "100%",
          width: `${progress}%`,
          background: "#22c55e",
          borderRadius: "10px",
          transition: "0.3s"
        }} />
      </div>
      <p style={{ fontSize: "14px", marginTop: "5px" }}>
        {progress}%
      </p>
    </div>
  );
}
