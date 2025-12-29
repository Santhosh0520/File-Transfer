import FilePicker from "../components/FilePicker";

export default function Session() {
  return (
    <div className="container">
      <div className="card">
        <h2>🔗 Devices Connected</h2>

        <div style={{ margin: "20px 0" }}>
          <p>💻 Laptop: Connected</p>
          <p>📱 Phone: Connected</p>
        </div>

        <hr style={{ opacity: 0.2, marginBottom: "15px" }} />

        <FilePicker />
      </div>
    </div>
  );
}
