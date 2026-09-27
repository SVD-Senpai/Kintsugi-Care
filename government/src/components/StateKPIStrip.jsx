import { useApp } from "../context/AppContext";
import { TRANSLATIONS } from "../data/translations";

export default function StateKPIStrip({ kpis, activeDisease }) {
  const { lang } = useApp();
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const cards = [
    {
      id: "activeCases",
      label: t.activeCases,
      value: kpis?.activeCases?.value ?? "—",
      trend: kpis?.activeCases?.trend ?? "0%",
      subtext: kpis?.activeCases?.prevPeriod ?? "vs previous period",
      severity: kpis?.activeCases?.severity ?? "MODERATE",
      icon: "🐄",
    },
    {
      id: "suspectedOutbreaks",
      label: t.suspectedOutbreaks,
      value: kpis?.suspectedOutbreaks?.value ?? "—",
      trend: kpis?.suspectedOutbreaks?.trend ?? "—",
      subtext: kpis?.suspectedOutbreaks?.prevPeriod ?? "Active clusters",
      severity: kpis?.suspectedOutbreaks?.severity ?? "CRITICAL",
      icon: "⚠️",
    },
    {
      id: "highRiskDistricts",
      label: t.highRiskDistricts,
      value: kpis?.highRiskDistricts?.value ?? "—",
      trend: kpis?.highRiskDistricts?.trend ?? "—",
      subtext: kpis?.highRiskDistricts?.prevPeriod ?? "Under close watch",
      severity: kpis?.highRiskDistricts?.severity ?? "HIGH",
      icon: "📍",
    },
    {
      id: "animalsAffected",
      label: t.animalsAtRisk,
      value: typeof kpis?.animalsAffected?.value === "number" ? kpis.animalsAffected.value.toLocaleString() : kpis?.animalsAffected?.value ?? "—",
      trend: kpis?.animalsAffected?.trend ?? "—",
      subtext: kpis?.animalsAffected?.prevPeriod ?? "In active zones",
      severity: kpis?.animalsAffected?.severity ?? "HIGH",
      icon: "📊",
    },
    {
      id: "animalDeaths",
      label: t.animalDeaths,
      value: kpis?.animalDeaths?.value ?? "—",
      trend: kpis?.animalDeaths?.trend ?? "—",
      subtext: kpis?.animalDeaths?.prevPeriod ?? "Bovine deaths",
      severity: kpis?.animalDeaths?.severity ?? "CRITICAL",
      icon: "☠️",
    },
    {
      id: "vaccinationCoverage",
      label: t.vaccinationCoverage,
      value: kpis?.vaccinationCoverage?.value ?? "—",
      trend: kpis?.vaccinationCoverage?.trend ?? "—",
      subtext: kpis?.vaccinationCoverage?.prevPeriod ?? "Overall scheduled",
      severity: kpis?.vaccinationCoverage?.severity ?? "MODERATE",
      icon: "💉",
    },
    {
      id: "vetsAvailable",
      label: t.vetsAvailable,
      value: kpis?.vetsAvailable?.value ?? "—",
      trend: kpis?.vetsAvailable?.trend ?? "—",
      subtext: kpis?.vetsAvailable?.prevPeriod ?? "Duty assigned",
      severity: kpis?.vetsAvailable?.severity ?? "LOW",
      icon: "🩺",
    },
    {
      id: "mvuAvailable",
      label: t.mvuAvailable,
      value: kpis?.mvuAvailable?.value ?? "—",
      trend: kpis?.mvuAvailable?.trend ?? "—",
      subtext: kpis?.mvuAvailable?.prevPeriod ?? "Field operational",
      severity: kpis?.mvuAvailable?.severity ?? "MODERATE",
      icon: "🚐",
    },
  ];

  return (
    <section className="state-kpi-strip" aria-label="State-level Key Performance Indicators">
      <div className="state-kpi-strip__header">
        <div className="state-kpi-strip__title">
          <span>{t.kpiHeaderTitle}</span>
          {activeDisease && activeDisease !== "ALL" && (
            <span className="state-kpi-strip__filter-tag">Filter: {activeDisease} Layer Active</span>
          )}
        </div>
        <div className="state-kpi-strip__benchmark">{t.kpiBenchmark}</div>
      </div>

      <div className="state-kpi-grid">
        {cards.map((card) => (
          <div key={card.id} className={`kpi-card kpi-card--${card.severity.toLowerCase()}`}>
            <div className="kpi-card__top">
              <span className="kpi-card__icon">{card.icon}</span>
              <span className={`kpi-badge kpi-badge--${card.severity.toLowerCase()}`}>
                {card.trend}
              </span>
            </div>
            <div className="kpi-card__value">{card.value}</div>
            <div className="kpi-card__label">{card.label}</div>
            <div className="kpi-card__subtext">{card.subtext}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
