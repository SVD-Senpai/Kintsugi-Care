import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { runTriage } from "../utils/triage";

const AppContext = createContext(null);

const STORAGE_KEY = "pashurakshak_cases_v1";
const QUEUE_KEY = "pashurakshak_offline_queue_v1";

// Seed demo cases around the Delhi-NCR region so the map/dashboard isn't empty
// on first run. Three of them are placed close together in time+space to
// demonstrate the outbreak-cluster feature out of the box.
const SEED_CASES = [
  mkCase(["fever", "blistersMouth", "blistersFeet", "salivation"], "cattle", 28.61, 77.21, -1, "Rampur"),
  mkCase(["fever", "blistersMouth", "salivation"], "buffalo", 28.63, 77.24, -2, "Bhagwanpur"),
  mkCase(["blistersFeet", "lameness", "fever"], "cattle", 28.58, 77.19, -3, "Sonipat Road"),
  mkCase(["swollenUdder", "milkDrop"], "buffalo", 28.7, 77.1, -1, "Narela"),
  mkCase(["lossOfAppetite", "lethargy"], "goat", 28.5, 77.3, -5, "Faridabad Chowk"),
  mkCase(["skinNodules", "fever", "lethargy"], "cattle", 28.75, 77.05, -2, "Bawana"),
];

function mkCase(symptomIds, animalType, lat, lng, daysAgo, village) {
  const triage = runTriage(symptomIds);
  const reportedAt = new Date(Date.now() + daysAgo * 86400000).toISOString();
  return {
    id: crypto.randomUUID(),
    animalType,
    symptomIds,
    riskLevel: triage.level.key,
    matchedDiseases: triage.matchedDiseases,
    advice: triage.advice,
    lat,
    lng,
    village,
    reportedAt,
    status: "Pending",
    farmerName: "Demo Farmer",
    synced: true,
  };
}

function loadCases() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn("Could not read stored cases", e);
  }
  return SEED_CASES;
}

function loadQueue() {
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn("Could not read offline queue", e);
  }
  return [];
}

export function AppProvider({ children }) {
  const [cases, setCases] = useState(loadCases);
  const [queue, setQueue] = useState(loadQueue);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lang, setLang] = useState("en");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
  }, [cases]);

  useEffect(() => {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  }, [queue]);

  useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  // Whenever we come back online, flush anything sitting in the offline queue.
  useEffect(() => {
    if (isOnline && queue.length > 0) {
      setCases((prev) => [...queue.map((q) => ({ ...q, synced: true })), ...prev]);
      setQueue([]);
    }
  }, [isOnline]); // eslint-disable-line react-hooks/exhaustive-deps

  const submitReport = useCallback(
    ({ animalType, symptomIds, lat, lng, village, farmerName }) => {
      const triage = runTriage(symptomIds);
      const newCase = {
        id: crypto.randomUUID(),
        animalType,
        symptomIds,
        riskLevel: triage.level.key,
        matchedDiseases: triage.matchedDiseases,
        advice: triage.advice,
        lat,
        lng,
        village,
        reportedAt: new Date().toISOString(),
        status: "Pending",
        farmerName: farmerName || "Anonymous Farmer",
        synced: isOnline,
      };

      if (isOnline) {
        setCases((prev) => [newCase, ...prev]);
      } else {
        setQueue((prev) => [newCase, ...prev]);
      }
      return { case: newCase, triage };
    },
    [isOnline]
  );

  const updateCaseStatus = useCallback((id, status) => {
  setCases((prev) => {
    const updated = prev.map((c) => (c.id === id ? { ...c, status } : c));
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn("Could not persist status update", e);
    }
    return updated;
  });
}, []);

  const value = {
    cases,
    queue,
    isOnline,
    lang,
    setLang,
    submitReport,
    updateCaseStatus,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}