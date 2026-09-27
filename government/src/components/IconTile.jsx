export default function IconTile({ icon, label, selected, onClick }) {
  return (
    <button
      type="button"
      className={`icon-tile ${selected ? "icon-tile--selected" : ""}`}
      onClick={onClick}
      aria-pressed={selected}
    >
      <span className="icon-tile__icon">{icon}</span>
      <span className="icon-tile__label">{label}</span>
    </button>
  );
}