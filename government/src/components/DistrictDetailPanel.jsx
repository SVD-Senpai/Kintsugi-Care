export default function DistrictDetailPanel({ district, onClose, onInspectCases }) {
  if (!district) return null;

  const d = district;

  return (
    <div className="district-detail-drawer">
      {/* Header */}
      <div className="district-detail-drawer__header">
        <div>
          <div className="district-detail-drawer__division">{d.division} · District Headquarters</div>
          <h2 className="district-detail-drawer__title">{d.name} District Intelligence</h2>
        </div>
        <div className="district-detail-drawer__actions">
          <span className={`gov-risk-tag gov-risk-tag--${d.riskLevel.toLowerCase()} gov-risk-tag--lg`}>
            {d.riskLevel} RISK · {d.riskScore}/100
          </span>
          <button className="gov-close-btn" onClick={onClose} aria-label="Close detail panel">
            ✕
          </button>
        </div>
      </div>

      {/* Administrative Status Banner */}
      <div className={`admin-status-banner admin-status-banner--${d.riskLevel.toLowerCase()}`}>
        <div className="admin-status-banner__left">
          <span className="admin-status-banner__badge">ADMINISTRATIVE STATUS</span>
          <strong className="admin-status-banner__state">{d.administrativeStatus}</strong>
        </div>
        <div className="admin-status-banner__right">
          Priority Attention: <strong>{d.administrativeAttention}</strong>
        </div>
      </div>

      {/* Metric Tiles Grid */}
      <div className="district-detail-grid">
        <div className="detail-stat-card">
          <span className="detail-stat-card__label">Active Cases</span>
          <span className="detail-stat-card__val">{d.activeCases}</span>
          <span className="detail-stat-card__sub">{d.weeklyGrowth} in 7 days</span>
        </div>
        <div className="detail-stat-card">
          <span className="detail-stat-card__label">Suspected Outbreaks</span>
          <span className="detail-stat-card__val">{d.suspectedOutbreaks}</span>
          <span className="detail-stat-card__sub">Cluster flagged</span>
        </div>
        <div className="detail-stat-card">
          <span className="detail-stat-card__label">Recorded Fatalities</span>
          <span className="detail-stat-card__val text-danger">{d.deaths}</span>
          <span className="detail-stat-card__sub">Bovine deaths</span>
        </div>
        <div className="detail-stat-card">
          <span className="detail-stat-card__label">Animals Exposed</span>
          <span className="detail-stat-card__val">{d.animalsAffected.toLocaleString()}</span>
          <span className="detail-stat-card__sub">Of {d.livestockPopulation.toLocaleString()} total</span>
        </div>
      </div>

      {/* Dominant Suspected Disease & Vaccination Coverage */}
      <div className="district-detail-section">
        <h4 className="section-heading">DOMINANT SUSPECTED DISEASE &amp; VACCINATION COVERAGE</h4>
        <div className="disease-focus-card">
          <div className="disease-focus-card__main">
            <span className="focus-disease-name">⚠️ {d.dominantDisease}</span>
            <span className="focus-disease-note">Primary clinical pattern reported in field triage</span>
          </div>
        </div>

        <div className="vaccine-bars-grid">
          {Object.entries(d.vaccinationCoverage).map(([disCode, pct]) => {
            const isDeficit = pct < 60;
            return (
              <div key={disCode} className="vaccine-bar-item">
                <div className="vaccine-bar-label">
                  <span>{disCode} Coverage</span>
                  <strong className={isDeficit ? "text-danger" : ""}>{pct}%</strong>
                </div>
                <div className="vaccine-bar-track">
                  <div
                    className={`vaccine-bar-fill ${isDeficit ? "vaccine-bar-fill--deficit" : ""}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                {isDeficit && <span className="deficit-flag">⚠️ Coverage Deficit</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Environmental & Weather Risk Factors */}
      <div className="district-detail-section">
        <h4 className="section-heading">ENVIRONMENTAL &amp; WEATHER RISK FACTORS</h4>
        <p className="disclaimer-inline">
          * Environmental factors may elevate pathogen survival and vector proliferation; they do not diagnose clinical disease.
        </p>
        <div className="weather-grid">
          <div className="weather-item">
            <span className="weather-item__label">🌧️ Precipitation</span>
            <strong>{d.weatherRisk.rainfall}</strong>
          </div>
          <div className="weather-item">
            <span className="weather-item__label">💧 Relative Humidity</span>
            <strong>{d.weatherRisk.humidity}</strong>
          </div>
          <div className="weather-item">
            <span className="weather-item__label">🌡️ Temperature</span>
            <strong>{d.weatherRisk.temperature}</strong>
          </div>
          <div className="weather-item">
            <span className="weather-item__label">🌱 Soil Condition</span>
            <strong>{d.weatherRisk.soilWetness}</strong>
          </div>
        </div>
        <div className="weather-advisory-box">
          <strong>Epidemiological Advisory:</strong> {d.weatherRisk.advisory}
        </div>
      </div>

      {/* Response Capacity */}
      <div className="district-detail-section">
        <h4 className="section-heading">DISTRICT RESPONSE CAPACITY</h4>
        <div className="capacity-grid">
          <div className="capacity-box">
            <div className="capacity-box__header">
              <span>🩺 Veterinary Officers</span>
              <strong>{d.vetCapacity.available} / {d.vetCapacity.total} Available</strong>
            </div>
            <div className="capacity-box__detail">
              {d.vetCapacity.busy} officers actively deployed on field calls
            </div>
          </div>
          <div className="capacity-box">
            <div className="capacity-box__header">
              <span>🚐 Mobile Vet Units</span>
              <strong>{d.mvuCapacity.available} / {d.mvuCapacity.total} Available</strong>
            </div>
            <div className="capacity-box__detail">
              Nearest: <strong>{d.mvuCapacity.nearestUnit}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Taluka & Cluster Breakdown */}
      <div className="district-detail-section">
        <h4 className="section-heading">TALUKA &amp; VILLAGE CLUSTER SURVEILLANCE</h4>
        <div className="taluka-table-shell">
          <table className="taluka-table">
            <thead>
              <tr>
                <th>Taluka</th>
                <th>Village Cluster</th>
                <th>Cases</th>
                <th>Deaths</th>
                <th>Risk Tier</th>
              </tr>
            </thead>
            <tbody>
              {d.talukas.map((t) => (
                <tr key={t.name}>
                  <td><strong>{t.name}</strong></td>
                  <td>{t.villageCluster}</td>
                  <td>{t.cases}</td>
                  <td>{t.deaths}</td>
                  <td>
                    <span className={`gov-risk-tag gov-risk-tag--${t.risk.toLowerCase()} gov-risk-tag--sm`}>
                      {t.risk}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Footer */}
      <div className="district-detail-drawer__footer">
        <button
          className="btn btn--secondary"
          onClick={() => onInspectCases(d.id)}
        >
          🔍 Drill Down into Animal Cases ({d.activeCases} records) →
        </button>
        <button className="btn btn--outline" onClick={onClose}>
          Close Panel
        </button>
      </div>
    </div>
  );
}
