import { useState } from "react";
import { ADMINISTRATIVE_ACTIONS } from "../data/maharashtraData";

export default function AdministrativeActionQueue() {
  const [actions, setActions] = useState(ADMINISTRATIVE_ACTIONS);
  const [feedback, setFeedback] = useState(null);

  const updateStatus = (id, newStatus) => {
    setActions((prev) =>
      prev.map((act) => (act.id === id ? { ...act, status: newStatus } : act))
    );
    const target = actions.find((a) => a.id === id);
    setFeedback({
      message: `Administrative action for "${target?.title}" marked as "${newStatus}".`,
      type: newStatus === "Approved" ? "success" : "info",
    });
    setTimeout(() => setFeedback(null), 4000);
  };

  const pendingCount = actions.filter((a) => a.status === "Awaiting Decision").length;

  return (
    <div className="admin-queue-panel">
      <div className="admin-queue-panel__header">
        <div>
          <h3 className="admin-queue-panel__title">ADMINISTRATIVE ACTION &amp; DECISION QUEUE</h3>
          <p className="admin-queue-panel__subtitle">
            Official government decision-making, resource sanctions &amp; executive authorizations
          </p>
        </div>
        <div className="admin-queue-panel__stats">
          <span className="queue-counter queue-counter--critical">
            {pendingCount} Awaiting Official Sanction
          </span>
        </div>
      </div>

      {feedback && (
        <div className={`admin-feedback-banner admin-feedback-banner--${feedback.type}`}>
          ✓ {feedback.message}
        </div>
      )}

      <div className="admin-actions-grid">
        {actions.map((act) => {
          const isAwaiting = act.status === "Awaiting Decision";
          const isApproved = act.status === "Approved";
          const isEscalated = act.status === "Escalated";

          return (
            <div
              key={act.id}
              className={`admin-action-card admin-action-card--${act.severity.toLowerCase()} ${
                isApproved ? "admin-action-card--approved" : ""
              }`}
            >
              <div className="admin-action-card__top">
                <div className="admin-action-card__badge-row">
                  <span className={`action-severity action-severity--${act.severity.toLowerCase()}`}>
                    {act.severity}
                  </span>
                  <span className="action-category">{act.category}</span>
                </div>
                <span className={`action-status-pill action-status-pill--${act.status.toLowerCase().replace(/\s+/g, "-")}`}>
                  {act.status}
                </span>
              </div>

              <h4 className="admin-action-card__title">{act.title}</h4>
              <div className="admin-action-card__location">📍 {act.location}</div>

              <div className="admin-action-card__section">
                <span className="section-label">Identified Issue &amp; Exposure:</span>
                <p className="section-val">{act.issue}</p>
                <div className="impact-callout">
                  <strong>Impact:</strong> {act.impact}
                </div>
              </div>

              <div className="admin-action-card__section">
                <span className="section-label">Resource Requisition:</span>
                <div className="resource-req-box">
                  <span>📦 {act.resourceRequired}</span>
                  {act.suggestedResource && (
                    <div className="suggested-res">
                      Suggested Resource: <strong>{act.suggestedResource}</strong>
                    </div>
                  )}
                </div>
              </div>

              <div className="admin-action-card__recommendation">
                <span className="rec-badge">RECOMMENDED ADMINISTRATIVE ACTION</span>
                <p>{act.recommendedAction}</p>
              </div>

              {/* Action Buttons for Government Decision */}
              <div className="admin-action-card__footer">
                <span className="urgency-tag">Urgency: <strong>{act.urgency}</strong></span>

                <div className="decision-buttons">
                  {isAwaiting && (
                    <>
                      <button
                        className="btn btn--primary btn--sm"
                        onClick={() => updateStatus(act.id, "Approved")}
                      >
                        ✓ Sanction / Approve
                      </button>
                      <button
                        className="btn btn--outline btn--sm"
                        onClick={() => updateStatus(act.id, "Escalated")}
                      >
                        ⚡ Escalate
                      </button>
                    </>
                  )}

                  {isApproved && (
                    <>
                      <span className="status-confirmed-text">✓ Approved by Commissioner</span>
                      <button
                        className="btn btn--ghost btn--sm"
                        onClick={() => updateStatus(act.id, "In Progress")}
                      >
                        Mark In Progress →
                      </button>
                    </>
                  )}

                  {isEscalated && (
                    <>
                      <span className="status-escalated-text">⚡ Escalated to Directorate</span>
                      <button
                        className="btn btn--primary btn--sm"
                        onClick={() => updateStatus(act.id, "Approved")}
                      >
                        Authorize Interventions
                      </button>
                    </>
                  )}

                  {act.status === "In Progress" && (
                    <>
                      <span className="status-progress-text">⏳ Field Deployment In Progress</span>
                      <button
                        className="btn btn--secondary btn--sm"
                        onClick={() => updateStatus(act.id, "Completed")}
                      >
                        Mark Completed
                      </button>
                    </>
                  )}

                  {act.status === "Completed" && (
                    <span className="status-completed-text">✓ Response Action Completed</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="admin-queue-panel__footer">
        <p>
          * <strong>Administrative Governance Principle:</strong> The AI system computes risk indicators and drafts recommendation orders. Sanctions, movement restrictions, and resource reallocations are exclusively executed upon authorized official review.
        </p>
      </div>
    </div>
  );
}
