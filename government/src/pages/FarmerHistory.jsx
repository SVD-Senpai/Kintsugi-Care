import { useApp } from "../context/AppContext";
import RiskBadge from "../components/RiskBadge";

export default function FarmerHistory() {
  const { cases, queue } = useApp();
  const allMine = [...queue, ...cases]; // demo: showing all cases as "mine" since there's no auth layer yet

  return (
    <div className="history-page">
      <h1 className="page-title">My Reports</h1>
      {allMine.length === 0 ? (
        <p className="empty-state">No reports yet. Submit your first one from "Report Symptom".</p>
      ) : (
        <div className="history-list">
          {allMine.map((c) => (
            <div className="history-row" key={c.id}>
              <RiskBadge level={c.riskLevel} />
              <div className="history-row__main">
                <div className="history-row__title">
                  {c.animalType} · {c.village}
                </div>
                <div className="history-row__meta">
                  {new Date(c.reportedAt).toLocaleString()} · Status: {c.status}
                  {!c.synced && " · ⏳ pending sync"}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}