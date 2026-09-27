import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import { TRANSLATIONS } from "../data/translations";

export default function GovernmentHeader({ alertCount = 5 }) {
  const { user, logout } = useAuth();
  const { lang, setLang, isOnline } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [activeNav, setActiveNav] = useState("dashboard");

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const currentDate = new Date().toLocaleDateString(lang === "mr" || lang === "hi" ? "mr-IN" : "en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const handleScrollTo = (sectionId, navKey) => {
    setActiveNav(navKey);
    if (location.pathname !== "/" && location.pathname !== "/officer") {
      navigate("/officer");
      setTimeout(() => {
        const elem = document.getElementById(sectionId);
        elem?.scrollIntoView({ behavior: "smooth" });
      }, 100);
      return;
    }
    const elem = document.getElementById(sectionId);
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <header className="gov-header">
      {/* Top Banner with Emblems & Official Identity */}
      <div className="gov-header__top">
        <div className="gov-header__brand">
          {/* Official Kintsugi Care Logo */}
          <div className="gov-header__logo-wrap" title="Kintsugi Care — Healing. Nurturing. Together.">
            <img src="/kintsugi-logo.png" alt="Kintsugi Care Logo" className="gov-header__logo-img" />
          </div>
          <div>
            <div className="gov-header__jurisdiction">{t.jurisdiction}</div>
            <h1 className="gov-header__title">{t.title}</h1>
            <div className="gov-header__sub">{t.subtitle}</div>
          </div>
        </div>

        {/* Live Status & Official Context */}
        <div className="gov-header__actions">
          <div className="gov-header__status-badge">
            <span className={`gov-live-dot ${!isOnline ? "gov-live-dot--offline" : ""}`} />
            <span className="gov-live-text">{isOnline ? t.liveSurveillance : "OFFLINE STORAGE"}</span>
            <span className="gov-date-text">· {currentDate}</span>
          </div>

          <div
            className="gov-header__alert-pill"
            title={`${alertCount} administrative alerts requiring attention`}
            onClick={() => handleScrollTo("gov-alert-center-section", "response")}
          >
            <span className="gov-alert-bell">🔔</span>
            <span className="gov-alert-count">
              {alertCount} {t.activeAlerts}
            </span>
          </div>

          {/* Explicit Language Switcher: English / मराठी / हिंदी */}
          <div className="gov-lang-picker" role="group" aria-label="Select Interface Language">
            <button
              type="button"
              className={`gov-lang-chip ${lang === "en" ? "gov-lang-chip--active" : ""}`}
              onClick={() => setLang("en")}
              title="Switch to English"
            >
              English
            </button>
            <button
              type="button"
              className={`gov-lang-chip ${lang === "mr" ? "gov-lang-chip--active" : ""}`}
              onClick={() => setLang("mr")}
              title="मराठी मध्ये बदला"
            >
              मराठी
            </button>
            <button
              type="button"
              className={`gov-lang-chip ${lang === "hi" ? "gov-lang-chip--active" : ""}`}
              onClick={() => setLang("hi")}
              title="हिंदी में बदलें"
            >
              हिंदी
            </button>
          </div>

          {/* Official Profile Badge */}
          <div className="gov-profile-pill" onClick={() => setShowProfileMenu(!showProfileMenu)}>
            <div className="gov-profile-avatar">SP</div>
            <div className="gov-profile-meta">
              <span className="gov-profile-name">{user?.name || "Suresh Patil, IAS"}</span>
              <span className="gov-profile-role">{t.officialRole}</span>
            </div>
            <span className="gov-profile-arrow">▾</span>

            {showProfileMenu && (
              <div className="gov-profile-dropdown" onClick={(e) => e.stopPropagation()}>
                <div className="gov-dropdown-item gov-dropdown-item--header">
                  <strong>{user?.name || "Suresh Patil, IAS"}</strong>
                  <div style={{ fontSize: "11px", color: "var(--color-ink-muted)" }}>
                    {t.deptOffice}
                  </div>
                </div>
                <hr style={{ margin: "6px 0", borderColor: "var(--color-border)" }} />
                {user ? (
                  <button
                    className="gov-dropdown-item gov-dropdown-item--logout"
                    onClick={() => {
                      logout();
                      navigate("/login");
                    }}
                  >
                    {t.logout}
                  </button>
                ) : (
                  <Link to="/login" className="gov-dropdown-item">
                    Staff Login
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Suggested Navigation Bar — 100% Government Operations Focused */}
      <nav className="gov-nav-bar" aria-label="Government Command Navigation">
        <div className="gov-nav-links">
          <button
            type="button"
            className={`gov-nav-link ${activeNav === "dashboard" ? "gov-nav-link--active" : ""}`}
            onClick={() => handleScrollTo("gov-command-top", "dashboard")}
          >
            {t.navDashboard}
          </button>
          <button
            type="button"
            className={`gov-nav-link ${activeNav === "intelligence" ? "gov-nav-link--active" : ""}`}
            onClick={() => handleScrollTo("gov-outbreak-section", "intelligence")}
          >
            {t.navIntelligence}
          </button>
          <button
            type="button"
            className={`gov-nav-link ${activeNav === "districts" ? "gov-nav-link--active" : ""}`}
            onClick={() => handleScrollTo("gov-workspace-section", "districts")}
          >
            {t.navDistricts}
          </button>
          <button
            type="button"
            className={`gov-nav-link ${activeNav === "response" ? "gov-nav-link--active" : ""}`}
            onClick={() => handleScrollTo("admin-action-queue-section", "response")}
          >
            {t.navResponse}
          </button>
          <button
            type="button"
            className={`gov-nav-link ${activeNav === "resources" ? "gov-nav-link--active" : ""}`}
            onClick={() => handleScrollTo("gov-resources-section", "resources")}
          >
            {t.navResources}
          </button>
        </div>
      </nav>
    </header>
  );
}
