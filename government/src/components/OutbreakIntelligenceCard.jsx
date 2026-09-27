import { OUTBREAK_HERO_DATA } from "../data/maharashtraData";
import { useApp } from "../context/AppContext";
import { TRANSLATIONS } from "../data/translations";

export default function OutbreakIntelligenceCard({ onTakeAction, onInspectCluster }) {
  const { lang } = useApp();
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const o = OUTBREAK_HERO_DATA;

  return (
    <div className="outbreak-card">
      <div className="outbreak-card__badge-strip">
        <div className="outbreak-card__alert-tag">
          <span className="outbreak-pulse-dot" />
          <span>{t.activeOutbreakBadge}</span>
        </div>
        <span className="outbreak-card__time">{t.detectedSince}</span>
      </div>

      <div className="outbreak-card__header">
        <div>
          <h2 className="outbreak-card__title">{t.outbreakTitle}</h2>
          <div className="outbreak-card__location">{t.outbreakLocation}</div>
        </div>

        {/* Explainable Risk Score Gauge */}
        <div className="risk-score-box">
          <div className="risk-score-box__header">{t.riskScoreLabel}</div>
          <div className="risk-score-box__val">
            <span className="risk-score-num">{o.riskScore}</span>
            <span className="risk-score-max">/100</span>
          </div>
          <div className="risk-score-box__level">{t.riskScoreSeverity}</div>
        </div>
      </div>

      {/* Core Epidemiological Telemetry Grid */}
      <div className="outbreak-stats-grid">
        <div className="outbreak-stat">
          <span className="outbreak-stat__label">{t.compatibleCases}</span>
          <span className="outbreak-stat__num">{o.cases}</span>
          <span className="outbreak-stat__note">Clinical pattern match</span>
        </div>
        <div className="outbreak-stat">
          <span className="outbreak-stat__label">{t.recordedDeaths}</span>
          <span className="outbreak-stat__num text-danger">{o.deaths}</span>
          <span className="outbreak-stat__note">Peracute fatality</span>
        </div>
        <div className="outbreak-stat">
          <span className="outbreak-stat__label">{t.caseVelocity}</span>
          <span className="outbreak-stat__num text-danger">{o.weeklyGrowth}</span>
          <span className="outbreak-stat__note">Accelerating curve</span>
        </div>
        <div className="outbreak-stat">
          <span className="outbreak-stat__label">{t.livestockExposed}</span>
          <span className="outbreak-stat__num">~{o.livestockPotentiallyExposed.toLocaleString()}</span>
          <span className="outbreak-stat__note">6 km contiguous radius</span>
        </div>
        <div className="outbreak-stat">
          <span className="outbreak-stat__label">{t.vaccinationRate}</span>
          <span className="outbreak-stat__num text-warning">{o.vaccinationRate}</span>
          <span className="outbreak-stat__note">Severe deficit buffer</span>
        </div>
      </div>

      {/* Two Column Deep Dive: Why is this High Risk? & Response Capacity */}
      <div className="outbreak-deep-grid">
        {/* Left Column: Why High Risk */}
        <div className="outbreak-panel outbreak-panel--drivers">
          <h4 className="outbreak-panel__title">
            <span>{t.whyHighRisk}</span>
            <span className="outbreak-panel__badge">{t.aiSignalsBadge}</span>
          </h4>
          <ul className="drivers-list">
            {o.whyHighRiskDrivers.map((d, i) => (
              <li key={i} className="driver-item">
                <span className="driver-bullet">▪</span>
                <div>
                  <strong>{d.label}:</strong> <span>{d.detail}</span>
                </div>
              </li>
            ))}
          </ul>

          <div className="environmental-factors-strip">
            {t.environmentalCatalyst}
          </div>
        </div>

        {/* Right Column: Response Capacity & Administrative Recommendation */}
        <div className="outbreak-panel outbreak-panel--response">
          <h4 className="outbreak-panel__title">
            <span>{t.responseCapacityTitle}</span>
            <span className="outbreak-panel__badge outbreak-panel__badge--avail">{t.availableNearby}</span>
          </h4>

          <div className="capacity-card">
            <div className="capacity-card__top">
              <span className="capacity-card__id">{o.responseCapacity.mvuId}</span>
              <span className="capacity-card__dist">{o.responseCapacity.mvuDistance}</span>
              <span className="status-badge-inline status-badge-inline--ready">● Ready</span>
            </div>
            <div className="capacity-card__text">
              Status: <strong>{o.responseCapacity.status}</strong> · Workload: {o.responseCapacity.currentWorkload}
            </div>
            <div className="capacity-card__sub">
              Local VOs: {o.responseCapacity.nearbyVets}
            </div>
          </div>

          <div className="gov-recommendation-box">
            <div className="gov-recommendation-box__header">
              <span className="gov-rec-badge">{o.governmentRecommendation.urgency}</span>
              <span className="gov-rec-title">{t.govRecommendationTitle}</span>
            </div>
            <div className="gov-rec-headline">{t.govRecHeadline}</div>
            <ul className="gov-rec-list">
              {o.governmentRecommendation.actions.map((act, idx) => (
                <li key={idx}>{act}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Actions & Legal / Trust Language */}
      <div className="outbreak-card__footer">
        <div className="outbreak-card__disclaimer">
          {t.trustProtocol}
        </div>
        <div className="outbreak-card__actions">
          <button
            className="btn btn--secondary"
            onClick={() => onTakeAction?.(o)}
          >
            {t.reviewActionBtn}
          </button>
          <button
            className="btn btn--outline"
            onClick={() => onInspectCluster?.(o.districtId)}
          >
            {t.inspectClusterBtn}
          </button>
        </div>
      </div>
    </div>
  );
}
