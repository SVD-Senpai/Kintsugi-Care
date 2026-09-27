import { useState } from "react";
import { useApp } from "../context/AppContext";
import { ANIMAL_TYPES, SYMPTOMS } from "../data/symptoms";
import IconTile from "../components/IconTile";
import RiskBadge from "../components/RiskBadge";
import VoiceInputButton from "../components/VoiceInputButton";

const STEPS = ["animal", "symptoms", "location", "result"];

export default function FarmerReport() {
  const { submitReport, isOnline, lang } = useApp();
  const [step, setStep] = useState(0);
  const [animalType, setAnimalType] = useState(null);
  const [symptomIds, setSymptomIds] = useState([]);
  const [village, setVillage] = useState("");
  const [farmerName, setFarmerName] = useState("");
  const [coords, setCoords] = useState(null);
  const [locating, setLocating] = useState(false);
  const [note, setNote] = useState("");
  const [result, setResult] = useState(null);

  const goNext = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  const toggleSymptom = (id) => {
    setSymptomIds((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  };

  const detectLocation = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
      },
      () => {
        // Fallback to a default region center if permission denied — keeps demo usable.
        setCoords({ lat: 28.6139, lng: 77.209 });
        setLocating(false);
      }
    );
  };

  const handleSubmit = () => {
    const finalCoords = coords || { lat: 28.6139, lng: 77.209 };
    const { case: savedCase, triage } = submitReport({
      animalType: animalType?.id,
      symptomIds,
      lat: finalCoords.lat,
      lng: finalCoords.lng,
      village,
      farmerName,
    });
    setResult({ savedCase, triage });
    goNext();
  };

  const resetFlow = () => {
    setStep(0);
    setAnimalType(null);
    setSymptomIds([]);
    setVillage("");
    setFarmerName("");
    setCoords(null);
    setNote("");
    setResult(null);
  };

  return (
    <div className="report-flow">
      <ProgressBar step={step} />

      {!isOnline && (
        <div className="offline-banner">
          📴 You're offline — this report will be saved on your phone and sent automatically once you're back online.
        </div>
      )}

      {step === 0 && (
        <StepShell title="Which animal is sick?" hindi="कौन सा पशु बीमार है?" lang={lang}>
          <div className="tile-grid">
            {ANIMAL_TYPES.map((a) => (
              <IconTile
                key={a.id}
                icon={a.icon}
                label={lang === "hi" ? a.hi : a.en}
                selected={animalType?.id === a.id}
                onClick={() => setAnimalType(a)}
              />
            ))}
          </div>
          <NavButtons onNext={goNext} nextDisabled={!animalType} showBack={false} />
        </StepShell>
      )}

      {step === 1 && (
        <StepShell title="What symptoms do you see?" hindi="कौन से लक्षण दिख रहे हैं?" lang={lang}>
          <div className="tile-grid tile-grid--symptoms">
            {SYMPTOMS.map((s) => (
              <IconTile
                key={s.id}
                icon={s.icon}
                label={lang === "hi" ? s.hi : s.en}
                selected={symptomIds.includes(s.id)}
                onClick={() => toggleSymptom(s.id)}
              />
            ))}
          </div>

          <div className="note-block">
            <label className="field-label">Anything else? (optional)</label>
            <div className="note-input-row">
              <textarea
                className="text-input"
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Type or speak a note…"
              />
              <VoiceInputButton lang={lang} onResult={(text) => setNote((prev) => (prev ? prev + " " + text : text))} />
            </div>
          </div>

          <NavButtons onNext={goNext} onBack={goBack} nextDisabled={symptomIds.length === 0} />
        </StepShell>
      )}

      {step === 2 && (
        <StepShell title="Where is the animal?" hindi="पशु कहाँ है?" lang={lang}>
          <div className="field-group">
            <label className="field-label">Your name</label>
            <input
              className="text-input"
              value={farmerName}
              onChange={(e) => setFarmerName(e.target.value)}
              placeholder="e.g. Ram Singh"
            />
          </div>
          <div className="field-group">
            <label className="field-label">Village / area</label>
            <input
              className="text-input"
              value={village}
              onChange={(e) => setVillage(e.target.value)}
              placeholder="e.g. Rampur"
            />
          </div>
          <div className="field-group">
            <button type="button" className="btn btn--outline" onClick={detectLocation} disabled={locating}>
              📍 {locating ? "Getting location…" : coords ? "Location captured ✓" : "Use my current location"}
            </button>
          </div>
          <NavButtons onNext={handleSubmit} onBack={goBack} nextLabel="Submit Report" nextDisabled={!village} />
        </StepShell>
      )}

      {step === 3 && result && (
        <div className="result-panel">
          <div className="result-panel__badge">
            <RiskBadge level={result.triage.level.key} size="lg" />
          </div>
          <h2 className="result-panel__title">{result.triage.advice}</h2>

          {result.triage.matchedDiseases.length > 0 && (
            <div className="result-panel__diseases">
              <span className="field-label">Closest matching patterns:</span>
              <ul>
                {result.triage.matchedDiseases.map((d) => (
                  <li key={d.disease}>{d.disease}</li>
                ))}
              </ul>
            </div>
          )}

          <p className="result-panel__disclaimer">
            This is an AI-assisted triage, not a diagnosis. A Veterinary Officer has been notified for high-risk
            cases and will confirm the next steps.
          </p>

          {!isOnline && (
            <p className="result-panel__sync-note">⏳ Saved on this device — will sync when you're back online.</p>
          )}

          <button className="btn btn--primary" onClick={resetFlow}>
            Report another animal
          </button>
        </div>
      )}
    </div>
  );
}

function StepShell({ title, hindi, lang, children }) {
  return (
    <div className="step-shell">
      <h2 className="step-shell__title">{lang === "hi" ? hindi : title}</h2>
      {children}
    </div>
  );
}

function NavButtons({ onNext, onBack, nextDisabled, nextLabel = "Next", showBack = true }) {
  return (
    <div className="nav-buttons">
      {showBack && (
        <button type="button" className="btn btn--ghost" onClick={onBack}>
          ← Back
        </button>
      )}
      <button type="button" className="btn btn--primary" onClick={onNext} disabled={nextDisabled}>
        {nextLabel}
      </button>
    </div>
  );
}

function ProgressBar({ step }) {
  return (
    <div className="progress-bar">
      {STEPS.map((s, i) => (
        <div key={s} className={`progress-bar__dot ${i <= step ? "progress-bar__dot--active" : ""}`} />
      ))}
    </div>
  );
}