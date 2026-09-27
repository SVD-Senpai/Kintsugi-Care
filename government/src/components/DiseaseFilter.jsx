import { SCHEDULED_DISEASES } from "../data/maharashtraData";
import { useApp } from "../context/AppContext";
import { TRANSLATIONS } from "../data/translations";

export default function DiseaseFilter({ activeDisease, onSelectDisease }) {
  const { lang } = useApp();
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  return (
    <div className="disease-filter-bar">
      <div className="disease-filter-bar__lead">
        <span className="disease-filter-bar__icon">🔬</span>
        <span className="disease-filter-bar__title">{t.diseaseLayer}</span>
      </div>

      <div className="disease-filter-bar__chips" role="radiogroup" aria-label="Select disease layer">
        {SCHEDULED_DISEASES.map((d) => {
          const isActive = activeDisease === d.id;
          return (
            <button
              key={d.id}
              type="button"
              role="radio"
              aria-checked={isActive}
              className={`disease-chip ${isActive ? "disease-chip--active" : ""}`}
              onClick={() => onSelectDisease(d.id)}
              title={`${d.name} (${d.mortalityRisk ? `Risk: ${d.mortalityRisk}` : d.description})`}
            >
              <span className="disease-chip__code">{d.short || d.code}</span>
              {d.id === "HS" && <span className="disease-chip__flag" title="Active Outbreak Cluster">⚠️</span>}
            </button>
          );
        })}
      </div>

      <div className="disease-filter-bar__status">
        {t.activeLayer} <strong>{SCHEDULED_DISEASES.find((d) => d.id === activeDisease)?.name || t.allDiseases}</strong>
      </div>
    </div>
  );
}
