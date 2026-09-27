// Rule-based, explainable triage engine.
// NOT a diagnosis — always routes to a human Veterinary Officer for confirmation.
// Weighted symptom → disease scoring, with hard "emergency override" combinations
// for classic textbook presentations (per ICAR/OIE clinical patterns).

const DISEASE_RULES = [
  {
    name: "Foot & Mouth Disease (FMD)",
    weights: { fever: 2, blistersMouth: 3, blistersFeet: 3, salivation: 2, lameness: 2 },
    emergencyIf: ["blistersMouth", "blistersFeet"],
  },
  {
    name: "Lumpy Skin Disease (LSD)",
    weights: { fever: 2, skinNodules: 3, lethargy: 1, nasalDischarge: 1 },
    emergencyIf: ["skinNodules", "fever"],
  },
  {
    name: "PPR (Peste des Petits Ruminants)",
    weights: { fever: 2, diarrhea: 2, coughing: 1, nasalDischarge: 1, eyeDischarge: 1 },
    emergencyIf: ["diarrhea", "nasalDischarge", "fever"],
  },
  {
    name: "Mastitis",
    weights: { swollenUdder: 3, milkDrop: 2, fever: 1 },
    emergencyIf: [],
  },
  {
    name: "Brucellosis (zoonotic risk)",
    weights: { abortion: 3, weightLoss: 1, lethargy: 1 },
    emergencyIf: ["abortion"],
  },
];

const LEVELS = {
  LOW: { key: "LOW", label: "Low", color: "#4C7A50" },
  MEDIUM: { key: "MEDIUM", label: "Medium — monitor closely", color: "#D9A441" },
  HIGH: { key: "HIGH", label: "Emergency — contact vet now", color: "#A63D40" },
};

export function runTriage(symptomIds) {
  if (!symptomIds || symptomIds.length === 0) {
    return { level: LEVELS.LOW, score: 0, matchedDiseases: [], advice: "No symptoms selected." };
  }

  const symptomSet = new Set(symptomIds);
  const matched = [];
  let topScore = 0;
  let forcedEmergency = false;

  for (const rule of DISEASE_RULES) {
    let score = 0;
    for (const sym of symptomIds) {
      if (rule.weights[sym]) score += rule.weights[sym];
    }
    if (score > 0) {
      matched.push({ disease: rule.name, score });
      topScore = Math.max(topScore, score);
    }
    const hitsEmergency = rule.emergencyIf.length > 0 && rule.emergencyIf.every((s) => symptomSet.has(s));
    if (hitsEmergency) forcedEmergency = true;
  }

  matched.sort((a, b) => b.score - a.score);

  // Fail-toward-caution: ambiguous/ borderline cases escalate rather than get dismissed.
  let level;
  if (forcedEmergency || topScore >= 6) {
    level = LEVELS.HIGH;
  } else if (topScore >= 3 || symptomIds.length >= 3) {
    level = LEVELS.MEDIUM;
  } else {
    level = LEVELS.LOW;
  }

  const advice =
    level.key === "HIGH"
      ? "This combination matches a high-risk disease pattern. Isolate the animal from the herd and contact your nearest Veterinary Officer immediately."
      : level.key === "MEDIUM"
      ? "Keep monitoring the animal every few hours. If symptoms worsen or new ones appear, report again immediately."
      : "Symptoms look mild. Keep observing and ensure clean water, food, and rest.";

  return { level, score: topScore, matchedDiseases: matched.slice(0, 3), advice };
}

export { LEVELS };