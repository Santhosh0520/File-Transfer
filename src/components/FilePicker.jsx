import { useState } from "react";
import ProgressBar from "./ProgressBar";

export default function FilePicker() {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleFile = (e) => {
    const selected = e.target.files[0];
    setFile(selected);

    // mock transfer
    let value = 0;
    const interval = setInterval(() => {
      value += 10;
      setProgress(value);
      if (value >= 100) clearInterval(interval);
    }, 300);
  };

  return (
    <>
      <input type="file" onChange={handleFile} />

      {file && (
        <>
          <p style={{ marginTop: "10px" }}>
            📄 {file.name} ({Math.round(file.size / 1024)} KB)
          </p>
          <ProgressBar progress={progress} />
        </>
      )}
    </>
  );
}

