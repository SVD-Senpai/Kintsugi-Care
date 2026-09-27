const META = {
  LOW: { label: "Low", className: "risk-badge--low" },
  MEDIUM: { label: "Medium", className: "risk-badge--medium" },
  HIGH: { label: "Emergency", className: "risk-badge--high" },
};

export default function RiskBadge({ level, size = "md" }) {
  const meta = META[level] || META.LOW;
  return (
    <span className={`risk-badge ${meta.className} risk-badge--${size}`}>
      <span className="risk-badge__dot" />
      {meta.label}
    </span>
  );
}