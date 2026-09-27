import { useApp } from "../context/AppContext";
import { TRANSLATIONS } from "../data/translations";

export default function DistrictsAttentionPanel({ districts, selectedDistrict, onSelectDistrict }) {
  const { lang } = useApp();
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  // Sort districts by risk score descending
  const sortedDistricts = [...districts].sort((a, b) => b.riskScore - a.riskScore);

  return (
    <div className="districts-attention-panel">
      <div className="districts-attention-panel__header">
        <div>
          <h3 className="districts-attention-panel__title">{t.attentionTitle}</h3>
          <p className="districts-attention-panel__subtitle">{t.attentionSubtitle}</p>
        </div>
        <span className="districts-attention-panel__count-badge">{districts.length} {t.monitoredBadge}</span>
      </div>

      <div className="districts-attention-list">
        {sortedDistricts.map((d, index) => {
          const isSelected = selectedDistrict?.id === d.id;
          const isCritical = d.riskLevel === "CRITICAL";

          return (
            <div
              key={d.id}
              className={`district-attention-card ${
                isSelected ? "district-attention-card--selected" : ""
              } district-attention-card--${d.riskLevel.toLowerCase()}`}
              onClick={() => onSelectDistrict(d)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelectDistrict(d);
                }
              }}
            >
              <div className="district-attention-card__rank">#{index + 1}</div>

              <div className="district-attention-card__body">
                <div className="district-attention-card__top">
                  <div className="district-attention-card__name-row">
                    <span className="district-attention-card__name">{d.name}</span>
                    <span className="district-attention-card__division">{d.division}</span>
                  </div>
                  <span className={`gov-risk-tag gov-risk-tag--${d.riskLevel.toLowerCase()}`}>
                    {d.riskLevel} · {d.riskScore}
                  </span>
                </div>

                <div className="district-attention-card__metrics">
                  <span className="metric-pill">
                    <strong>{d.activeCases}</strong> {t.suspectedCasesText}
                  </span>
                  {d.deaths > 0 && (
                    <span className="metric-pill metric-pill--death">
                      <strong>{d.deaths}</strong> {t.deathText}
                    </span>
                  )}
                  <span className={`metric-pill ${isCritical ? "metric-pill--growth" : ""}`}>
                    {d.weeklyGrowth} / 7d
                  </span>
                </div>

                <div className="district-attention-card__concern">
                  <span className="concern-label">{t.possibleConcern}</span>{" "}
                  <span className="concern-text">{d.primaryConcern}</span>
                </div>

                <div className="district-attention-card__footer">
                  <div className="admin-attention-tag">
                    {t.adminAttentionLabel}{" "}
                    <strong className={`admin-attention-level admin-attention-level--${d.administrativeAttention.toLowerCase()}`}>
                      {d.administrativeAttention}
                    </strong>
                  </div>
                  <span className="inspect-link">
                    {isSelected ? t.activeViewLink : t.inspectLink}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
