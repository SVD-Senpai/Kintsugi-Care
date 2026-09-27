import { NavLink, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isOnline, lang, setLang, queue } = useApp();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="navbar__brand">
        <span className="navbar__mark">🏛️</span>
        <div>
          <div className="navbar__title">Kintsugi Care</div>
          <div className="navbar__subtitle">Maharashtra Livestock Disease Intelligence &amp; Field Response Portal</div>
        </div>
      </div>

      <nav className="navbar__links">
        <NavLink to="/" end className={({ isActive }) => (isActive ? "navlink navlink--active" : "navlink")}>
          📊 Command Center
        </NavLink>
        <NavLink to="/report" className={({ isActive }) => (isActive ? "navlink navlink--active" : "navlink")}>
          🌾 Report Symptom
        </NavLink>
        <NavLink to="/history" className={({ isActive }) => (isActive ? "navlink navlink--active" : "navlink")}>
          📋 Field History
        </NavLink>
      </nav>

      <div className="navbar__status">
        <button
          className="lang-toggle"
          onClick={() => setLang(lang === "en" ? "hi" : "en")}
          aria-label="Toggle language"
        >
          {lang === "en" ? "मराठी / हिंदी" : "English"}
        </button>
        <span className={`status-pill ${isOnline ? "status-pill--online" : "status-pill--offline"}`}>
          <span className="status-dot" />
          {isOnline ? "Live Network" : "Offline Storage"}
          {queue.length > 0 && <span className="status-pill__badge">{queue.length} queued</span>}
        </span>
        {user ? (
          <>
            <span className="navbar__user">{user.name}</span>
            <button className="btn btn--ghost" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <NavLink to="/login" className="btn btn--secondary btn--sm">
            Sign in
          </NavLink>
        )}
      </div>
    </header>
  );
}