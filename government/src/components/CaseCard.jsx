import RiskBadge from "./RiskBadge";

const STATUS_OPTIONS = ["Pending", "Visited", "Resolved", "Confirmed Outbreak"];

export default function CaseCard({ caseItem, onStatusChange, onClick }) {
  const c = caseItem;
  return (
    <div className="case-card" onClick={() => onClick?.(c)}>
      <div className="case-card__top">
        <RiskBadge level={c.riskLevel} />
        <span className="case-card__time">{new Date(c.reportedAt).toLocaleString()}</span>
      </div>
      <div className="case-card__body">
        <div className="case-card__title">
          {c.animalType} · {c.village || "Unknown location"}
        </div>
        <div className="case-card__diseases">
          {c.matchedDiseases?.length
            ? c.matchedDiseases.map((d) => d.disease).join(", ")
            : "No strong disease match"}
        </div>
        {!c.synced && <div className="case-card__pending-sync">⏳ Waiting to sync</div>}
      </div>
      <div className="case-card__footer" onClick={(e) => e.stopPropagation()}>
        <select
          value={c.status}
          onChange={(e) => onStatusChange(c.id, e.target.value)}
          className="case-card__status-select"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}