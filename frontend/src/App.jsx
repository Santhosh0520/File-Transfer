import { HashRouter, Routes, Route } from "react-router-dom";
import QRPage from "./QRPage";
import SessionPage from "./SessionPage";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<QRPage />} />
        <Route path="/session/:id" element={<SessionPage />} />
      </Routes>
    </HashRouter>
  );
}
