import { useState } from "react";
import { useApp } from "../context/AppContext";
import { TRANSLATIONS } from "../data/translations";

export default function GovernmentAlertCenter({ alerts, onSelectAlertDistrict }) {
  const [filter, setFilter] = useState("ALL");
  const { lang } = useApp();
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const categories = ["ALL", "Emerging Cluster", "Vaccination Gap", "Response Delay", "Weather Risk", "Resource Shortage"];

  const filteredAlerts = alerts.filter((a) => {
    if (filter === "ALL") return true;
    return a.category === filter;
  });

  return (
    <div className="alert-center-panel">
      <div className="alert-center-panel__header">
        <div>
          <h3 className="alert-center-panel__title">{t.alertCenterTitle}</h3>
          <p className="alert-center-panel__subtitle">{t.alertCenterSubtitle}</p>
        </div>
        <div className="alert-center-panel__badge">
          {alerts.length} {t.activeSystemAlerts}
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="alert-categories-bar">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`alert-filter-chip ${filter === cat ? "alert-filter-chip--active" : ""}`}
            onClick={() => setFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Alert Feed Cards */}
      <div className="alert-feed-list">
        {filteredAlerts.length === 0 ? (
          <p className="empty-state">No alerts in this category.</p>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`gov-alert-card gov-alert-card--${alert.priority.toLowerCase()}`}
            >
              <div className="gov-alert-card__top">
                <div className="gov-alert-card__category-wrap">
                  <span className={`gov-alert-priority gov-alert-priority--${alert.priority.toLowerCase()}`}>
                    {alert.priority}
                  </span>
                  <span className="gov-alert-category">{alert.category}</span>
                  <span className="gov-alert-location">📍 {alert.location}</span>
                </div>
                <span className="gov-alert-time">{alert.timestamp}</span>
              </div>

              <h4 className="gov-alert-card__title">{alert.title}</h4>
              <p className="gov-alert-card__summary">{alert.summary}</p>

              <div className="gov-alert-card__drivers">
                <span className="drivers-title">{t.keyRiskDrivers}</span>
                <div className="driver-chips">
                  {alert.riskDrivers.map((driver, idx) => (
                    <span key={idx} className="driver-chip">
                      {driver}
                    </span>
                  ))}
                </div>
              </div>

              <div className="gov-alert-card__capacity">
                <strong>{t.localCapacity}</strong> {alert.responseCapacity}
              </div>

              <div className="gov-alert-card__recommendation">
                <span className="rec-badge">{t.adminRecommendation}</span>
                <p className="rec-text">{alert.recommendation}</p>
              </div>

              <div className="gov-alert-card__footer">
                <span className="alert-status-text">Status: <strong>{alert.status}</strong></span>
                {alert.districtId && (
                  <button
                    className="btn btn--ghost btn--sm"
                    onClick={() => onSelectAlertDistrict(alert.districtId)}
                  >
                    View District Telemetry →
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
