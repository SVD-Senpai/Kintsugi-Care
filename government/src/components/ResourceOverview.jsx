import { RESOURCE_STATUS } from "../data/maharashtraData";

export default function ResourceOverview({ onReviewResourceAction }) {
  const r = RESOURCE_STATUS;

  return (
    <div className="resource-overview-panel">
      <div className="resource-overview-panel__header">
        <div>
          <h3 className="resource-overview-panel__title">STATE RESOURCE &amp; RESPONSE CAPACITY</h3>
          <p className="resource-overview-panel__subtitle">System-level readiness of Veterinary Officers, Mobile Units, and Laboratories</p>
        </div>
        <div className="capacity-status-tag capacity-status-tag--pressure">
          Overall Status: {r.overallCapacity}
        </div>
      </div>

      {/* 3 Columns for Vet, MVU, and Labs */}
      <div className="resource-grid">
        {/* Column 1: Veterinary Officers */}
        <div className="resource-card">
          <div className="resource-card__header">
            <span className="resource-card__icon">🩺</span>
            <div>
              <h4 className="resource-card__name">Veterinary Officers (VOs)</h4>
              <span className="resource-card__total">{r.veterinarians.total} Authorized Posts</span>
            </div>
          </div>

          <div className="resource-bars">
            <div className="resource-bar-row">
              <span className="bar-label">Available / On Duty</span>
              <strong className="bar-val text-success">{r.veterinarians.available}</strong>
            </div>
            <div className="resource-track">
              <div className="resource-fill resource-fill--success" style={{ width: `${(r.veterinarians.available / r.veterinarians.total) * 100}%` }} />
            </div>

            <div className="resource-bar-row">
              <span className="bar-label">Busy on Active Field Calls</span>
              <strong className="bar-val text-warning">{r.veterinarians.busy}</strong>
            </div>
            <div className="resource-track">
              <div className="resource-fill resource-fill--warning" style={{ width: `${(r.veterinarians.busy / r.veterinarians.total) * 100}%` }} />
            </div>

            <div className="resource-bar-row">
              <span className="bar-label">On Sanctioned Leave / Training</span>
              <strong className="bar-val text-muted">{r.veterinarians.unavailable}</strong>
            </div>
            <div className="resource-track">
              <div className="resource-fill resource-fill--muted" style={{ width: `${(r.veterinarians.unavailable / r.veterinarians.total) * 100}%` }} />
            </div>
          </div>
          <div className="resource-card__footer-note">{r.veterinarians.statusText}</div>
        </div>

        {/* Column 2: Mobile Veterinary Units (MVUs) */}
        <div className="resource-card">
          <div className="resource-card__header">
            <span className="resource-card__icon">🚐</span>
            <div>
              <h4 className="resource-card__name">Mobile Veterinary Units</h4>
              <span className="resource-card__total">{r.mvu.total} Fleet Vehicles</span>
            </div>
          </div>

          <div className="resource-bars">
            <div className="resource-bar-row">
              <span className="bar-label">Available for Immediate Dispatch</span>
              <strong className="bar-val text-success">{r.mvu.available}</strong>
            </div>
            <div className="resource-track">
              <div className="resource-fill resource-fill--success" style={{ width: `${(r.mvu.available / r.mvu.total) * 100}%` }} />
            </div>

            <div className="resource-bar-row">
              <span className="bar-label">Currently Deployed on Cluster Runs</span>
              <strong className="bar-val text-warning">{r.mvu.deployed}</strong>
            </div>
            <div className="resource-track">
              <div className="resource-fill resource-fill--warning" style={{ width: `${(r.mvu.deployed / r.mvu.total) * 100}%` }} />
            </div>

            <div className="resource-bar-row">
              <span className="bar-label">Scheduled Maintenance / Workshop</span>
              <strong className="bar-val text-muted">{r.mvu.maintenance}</strong>
            </div>
            <div className="resource-track">
              <div className="resource-fill resource-fill--muted" style={{ width: `${(r.mvu.maintenance / r.mvu.total) * 100}%` }} />
            </div>
          </div>
          <div className="resource-card__footer-note">{r.mvu.statusText}</div>
        </div>

        {/* Column 3: Diagnostic Laboratories */}
        <div className="resource-card">
          <div className="resource-card__header">
            <span className="resource-card__icon">🧪</span>
            <div>
              <h4 className="resource-card__name">Disease Diagnostic Labs</h4>
              <span className="resource-card__total">3 Reference Labs</span>
            </div>
          </div>

          <div className="lab-list">
            {r.laboratories.map((lab, i) => (
              <div key={i} className="lab-item">
                <div className="lab-item__top">
                  <span className="lab-name">{lab.name}</span>
                  <span className={`lab-status lab-status--${lab.status.toLowerCase().includes("delayed") ? "delayed" : "ok"}`}>
                    {lab.load}
                  </span>
                </div>
                <div className="lab-item__meta">
                  <span>Turnaround: {lab.avgTurnaround}</span> · <span>Pending: {lab.pendingSamples} samples</span>
                </div>
                {lab.alert && <div className="lab-item__alert">⚠️ {lab.alert}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Operational Bottleneck & Smart Allocation Recommendation */}
      <div className="resource-alert-strip">
        <div className="bottleneck-card">
          <div className="bottleneck-card__badge">⚠️ RESPONSE BOTTLENECK DETECTED</div>
          <h4 className="bottleneck-card__title">Laboratory Confirmation Delay (&gt;48h)</h4>
          <p className="bottleneck-card__desc">
            7 bovine blood and tissue samples in <strong>Nashik</strong> and <strong>Ahmednagar</strong> have been awaiting PCR/ELISA confirmation beyond the standard 48-hour protocol.
          </p>
          <div className="bottleneck-card__action">
            <strong>Recommended Operational Action:</strong> Direct expedited courier transfer of pending Nashik samples to Western Regional Lab, Pune.
          </div>
        </div>

        <div className="allocation-rec-card">
          <div className="allocation-rec-card__badge">RESOURCE ALLOCATION RECOMMENDATION</div>
          <h4 className="allocation-rec-card__title">Nashik Possible HS Cluster</h4>
          <p className="allocation-rec-card__desc">
            Additional clinical response recommended for Sinnar taluka corridor.
          </p>
          <div className="allocation-details">
            <div><strong>Suggested Resource:</strong> MVU-07</div>
            <div><strong>Distance:</strong> 14 km (approx 28 min transit)</div>
            <div><strong>Status:</strong> Available (1 non-critical visit completed)</div>
            <div><strong>Reason:</strong> High-priority cluster with increasing cases and 3 fatalities.</div>
          </div>
          <button
            className="btn btn--secondary btn--sm"
            style={{ marginTop: "10px" }}
            onClick={() => onReviewResourceAction?.("act-001")}
          >
            Review Deployment Order in Action Queue →
          </button>
        </div>
      </div>
    </div>
  );
}
