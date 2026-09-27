import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import FarmerReport from "./pages/FarmerReport";
import FarmerHistory from "./pages/FarmerHistory";
import OfficerDashboard from "./pages/OfficerDashboard";

export default function App() {
  const location = useLocation();
  const isCommandCenter = location.pathname === "/" || location.pathname === "/officer";

  return (
    <div className={`app-shell ${isCommandCenter ? "app-shell--command" : ""}`}>
      {/* Show standard top navbar on field/login routes so users can easily navigate back */}
      {!isCommandCenter && <Navbar />}

      <main className={`app-main ${isCommandCenter ? "app-main--full" : ""}`}>
        <Routes>
          <Route path="/" element={<OfficerDashboard />} />
          <Route path="/officer" element={<OfficerDashboard />} />
          <Route path="/report" element={<FarmerReport />} />
          <Route path="/history" element={<FarmerHistory />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
    </div>
  );
}