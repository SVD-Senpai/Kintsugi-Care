import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import { languages, type LanguageCode, type TranslationKey } from "@/i18n/translations";
import { db, localKv } from "./offline/db";
import { api } from "./services/api";
import { animals as seedAnimals, farmer as seedFarmer, seedCases } from "./mock/data";
import type {
  Animal,
  CaseStage,
  ExposureRecord,
  FarmerProfile,
  HealthCase,
  HistoryEntry,
  MovementEntry,
  RecoveryUpdate,
  Vaccination,
} from "./types";

type Vars = Record<string, string | number>;

interface AppState {
  hydrated: boolean;
  lang: LanguageCode;
  setLang: (l: LanguageCode) => void;
  t: (key: TranslationKey, vars?: Vars) => string;
  /** true when browser online AND not simulating offline */
  online: boolean;
  simulateOffline: boolean;
  setSimulateOffline: (v: boolean) => void;
  // Farmer profile
  profile: FarmerProfile;
  updateProfile: (patch: Partial<FarmerProfile>) => void;
  // Animals / Herd
  animals: Animal[];
  addAnimal: (animal: Animal) => void;
  updateAnimal: (id: string, patch: Partial<Animal>) => void;
  findAnimal: (id: string) => Animal | undefined;
  recordVaccination: (animalId: string, vaccinationId: string, givenDate?: string) => void;
  addVaccination: (animalId: string, vacc: Omit<Vaccination, "id">) => void;
  addAnimalHistory: (animalId: string, entry: Omit<HistoryEntry, "id">) => void;
  // Cases & Tracking
  cases: HealthCase[];
  pendingCount: number;
  syncing: boolean;
  addCase: (c: HealthCase) => Promise<HealthCase>;
  updateCase: (id: string, patch: Partial<HealthCase>) => void;
  findCase: (id: string) => HealthCase | undefined;
  resolveCase: (id: string, notes?: string) => void;
  advanceCaseStage: (id: string, nextStage: CaseStage, note?: string) => void;
  syncNow: () => Promise<void>;
  addRecovery: (id: string, r: RecoveryUpdate) => void;
  setExposure: (id: string, e: ExposureRecord) => void;
  // Prevention & Reminders
  checklist: Record<string, boolean>;
  toggleChecklist: (id: string) => void;
  reminders: string[];
  toggleReminder: (id: string) => void;
}

const Ctx = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [lang, setLangState] = useState<LanguageCode>("en");
  const [browserOnline, setBrowserOnline] = useState(true);
  const [simulateOffline, setSimulateOfflineState] = useState(false);
  const [profile, setProfileState] = useState<FarmerProfile>(seedFarmer);
  const [animals, setAnimalsState] = useState<Animal[]>(seedAnimals);
  const [cases, setCases] = useState<HealthCase[]>(seedCases);
  const [syncing, setSyncing] = useState(false);
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});
  const [reminders, setReminders] = useState<string[]>([]);

  const casesRef = useRef(cases);
  casesRef.current = cases;
  const animalsRef = useRef(animals);
  animalsRef.current = animals;

  // Hydrate persisted state (client only)
  useEffect(() => {
    let alive = true;
    (async () => {
      const l = localKv.get<LanguageCode>("lang", "en");
      const sim = localKv.get<boolean>("simOffline", false);
      const prof = localKv.get<FarmerProfile>("profile", seedFarmer);
      const today = new Date().toISOString().slice(0, 10);
      const chk = localKv.get<{ date: string; items: Record<string, boolean> }>("checklist", {
        date: today,
        items: {},
      });
      const rem = localKv.get<string[]>("reminders", []);

      // Cases
      let storedCases = await db.getAll<HealthCase>("cases");
      if (!storedCases || storedCases.length === 0)
        storedCases = localKv.get<HealthCase[]>("cases", []);

      // Animals
      let storedAnimals = await db.getAll<Animal>("animals");
      if (!storedAnimals || storedAnimals.length === 0)
        storedAnimals = localKv.get<Animal[]>("animals", []);

      if (!alive) return;
      setLangState(l);
      setSimulateOfflineState(sim);
      setProfileState(prof);
      setChecklist(chk.date === today ? chk.items : {});
      setReminders(rem);

      if (storedCases && storedCases.length) {
        const merged = [...storedCases];
        for (const s of seedCases) if (!merged.some((c) => c.id === s.id)) merged.push(s);
        setCases(merged.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
      }

      if (storedAnimals && storedAnimals.length) {
        const merged = [...storedAnimals];
        for (const s of seedAnimals) if (!merged.some((a) => a.id === s.id)) merged.push(s);
        setAnimalsState(merged);
      } else {
        setAnimalsState(seedAnimals);
      }

      setBrowserOnline(navigator.onLine);
      setHydrated(true);
    })();

    const on = () => setBrowserOnline(true);
    const off = () => setBrowserOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      alive = false;
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  const persistCases = useCallback((next: HealthCase[]) => {
    localKv.set("cases", next);
    next.forEach((c) => void db.put("cases", c));
  }, []);

  const persistAnimals = useCallback((next: Animal[]) => {
    localKv.set("animals", next);
    next.forEach((a) => void db.put("animals", a));
  }, []);

  const setLang = useCallback((l: LanguageCode) => {
    setLangState(l);
    localKv.set("lang", l);
  }, []);

  const setSimulateOffline = useCallback((v: boolean) => {
    setSimulateOfflineState(v);
    localKv.set("simOffline", v);
  }, []);

  const updateProfile = useCallback((patch: Partial<FarmerProfile>) => {
    setProfileState((prev) => {
      const next = { ...prev, ...patch };
      localKv.set("profile", next);
      return next;
    });
  }, []);

  const dict = languages[lang].dict;
  const t = useCallback(
    (key: TranslationKey, vars?: Vars) => {
      let s = dict[key] ?? languages.en.dict[key] ?? key;
      if (vars) for (const [k, v] of Object.entries(vars)) s = s.replace(`{${k}}`, String(v));
      return s;
    },
    [dict],
  );

  const online = browserOnline && !simulateOffline;

  // Case Mutations
  const mutateCases = useCallback(
    (fn: (prev: HealthCase[]) => HealthCase[]) => {
      setCases((prev) => {
        const next = fn(prev);
        persistCases(next);
        return next;
      });
    },
    [persistCases],
  );

  // Animal Mutations
  const mutateAnimals = useCallback(
    (fn: (prev: Animal[]) => Animal[]) => {
      setAnimalsState((prev) => {
        const next = fn(prev);
        persistAnimals(next);
        return next;
      });
    },
    [persistAnimals],
  );

  const findCase = useCallback(
    (id: string) => casesRef.current.find((c) => c.id === id || c.localId === id),
    [],
  );
  const findAnimal = useCallback((id: string) => animalsRef.current.find((a) => a.id === id), []);

  const updateCase = useCallback(
    (id: string, patch: Partial<HealthCase>) => {
      mutateCases((prev) =>
        prev.map((c) => (c.id === id || c.localId === id ? { ...c, ...patch } : c)),
      );
    },
    [mutateCases],
  );

  const updateAnimal = useCallback(
    (id: string, patch: Partial<Animal>) => {
      mutateAnimals((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));
    },
    [mutateAnimals],
  );

  const addAnimal = useCallback(
    (animal: Animal) => {
      mutateAnimals((prev) => [animal, ...prev]);
    },
    [mutateAnimals],
  );

  const recordVaccination = useCallback(
    (animalId: string, vaccinationId: string, givenDate?: string) => {
      const date = givenDate ?? new Date().toISOString().slice(0, 10);
      mutateAnimals((prev) =>
        prev.map((a) => {
          if (a.id !== animalId) return a;
          const target = a.vaccinations.find((v) => v.id === vaccinationId);
          const vaccs = a.vaccinations.map((v) =>
            v.id === vaccinationId ? { ...v, status: "done" as const, givenDate: date } : v,
          );
          const historyEntry: HistoryEntry = {
            id: `h-${Date.now()}`,
            date,
            title: `${target?.name ?? "Vaccination"} administered`,
            kind: "visit",
            detail: "Recorded in digital health passport",
          };
          return { ...a, vaccinations: vaccs, history: [historyEntry, ...a.history] };
        }),
      );
    },
    [mutateAnimals],
  );

  const addVaccination = useCallback(
    (animalId: string, vacc: Omit<Vaccination, "id">) => {
      const newVacc: Vaccination = { ...vacc, id: `v-${Date.now()}` };
      mutateAnimals((prev) =>
        prev.map((a) => {
          if (a.id !== animalId) return a;
          return { ...a, vaccinations: [newVacc, ...a.vaccinations] };
        }),
      );
    },
    [mutateAnimals],
  );

  const addAnimalHistory = useCallback(
    (animalId: string, entry: Omit<HistoryEntry, "id">) => {
      const newEntry: HistoryEntry = { ...entry, id: `h-${Date.now()}` };
      mutateAnimals((prev) =>
        prev.map((a) => {
          if (a.id !== animalId) return a;
          return { ...a, history: [newEntry, ...a.history] };
        }),
      );
    },
    [mutateAnimals],
  );

  const addRecovery = useCallback(
    (id: string, r: RecoveryUpdate) => {
      mutateCases((prev) =>
        prev.map((c) =>
          c.id === id || c.localId === id ? { ...c, recovery: [r, ...c.recovery] } : c,
        ),
      );
    },
    [mutateCases],
  );

  const resolveCase = useCallback(
    (id: string, notes?: string) => {
      const now = new Date().toISOString();
      const today = now.slice(0, 10);
      const targetCase = casesRef.current.find((c) => c.id === id || c.localId === id);

      mutateCases((prev) =>
        prev.map((c) => {
          if (c.id === id || c.localId === id) {
            return {
              ...c,
              stage: "resolved" as const,
              resolvedAt: now,
              resolutionNotes: notes ?? "Animal has fully recovered and returned to normal health.",
            };
          }
          return c;
        }),
      );

      if (targetCase?.animalId) {
        mutateAnimals((prev) =>
          prev.map((a) => {
            if (a.id !== targetCase.animalId) return a;
            const historyEntry: HistoryEntry = {
              id: `h-${Date.now()}`,
              date: today,
              title: `Case ${targetCase.id} resolved`,
              kind: "note",
              detail: notes ?? "Animal recovered and marked healthy",
            };
            return {
              ...a,
              status: "healthy",
              statusNote: undefined,
              activeCaseId: undefined,
              history: [historyEntry, ...a.history],
            };
          }),
        );
      }
    },
    [mutateCases, mutateAnimals],
  );

  const advanceCaseStage = useCallback(
    (id: string, nextStage: CaseStage, note?: string) => {
      if (nextStage === "resolved") {
        resolveCase(id, note);
        return;
      }
      const today = new Date().toISOString().slice(0, 10);
      const targetCase = casesRef.current.find((c) => c.id === id || c.localId === id);

      mutateCases((prev) =>
        prev.map((c) => {
          if (c.id === id || c.localId === id) {
            const patch: Partial<HealthCase> = { stage: nextStage };
            if (nextStage === "vetVisit" && !c.vetInstructions) {
              patch.vetInstructions = [
                note ?? "Complete prescribed treatment course morning and evening.",
                "Keep animal hydrated and sheltered from extreme weather.",
                "Monitor appetite and breathing daily.",
              ];
            }
            return { ...c, ...patch };
          }
          return c;
        }),
      );

      if (targetCase?.animalId) {
        mutateAnimals((prev) =>
          prev.map((a) => {
            if (a.id !== targetCase.animalId) return a;
            const historyEntry: HistoryEntry = {
              id: `h-${Date.now()}`,
              date: today,
              title: `Case ${targetCase.id}: Stage updated to ${nextStage}`,
              kind:
                nextStage === "treatment"
                  ? "treatment"
                  : nextStage === "vetVisit"
                    ? "visit"
                    : "note",
              detail: note,
            };
            return { ...a, history: [historyEntry, ...a.history] };
          }),
        );
      }
    },
    [mutateCases, mutateAnimals, resolveCase],
  );

  const setExposure = useCallback(
    (id: string, e: ExposureRecord) => {
      updateCase(id, { exposure: e });
      const targetCase = casesRef.current.find((c) => c.id === id || c.localId === id);
      if (targetCase?.animalId && e.places.length > 0) {
        const today = new Date().toISOString().slice(0, 10);
        const newMovements: MovementEntry[] = e.places.map((placeKey, i) => ({
          id: `m-${Date.now()}-${i}`,
          place:
            placeKey === "grazing"
              ? "Grazing Area"
              : placeKey === "waterPoint"
                ? "Village Water Point"
                : placeKey,
          placeKey,
          from: "08:00",
          to: "12:00",
          date: today,
        }));
        mutateAnimals((prev) =>
          prev.map((a) => {
            if (a.id !== targetCase.animalId) return a;
            return { ...a, movement: [...newMovements, ...a.movement] };
          }),
        );
      }
    },
    [updateCase, mutateAnimals],
  );

  const syncNow = useCallback(async () => {
    const pending = casesRef.current.filter(
      (c) => c.syncState === "pending" || c.syncState === "failed",
    );
    if (!pending.length || syncing) return;
    setSyncing(true);
    mutateCases((prev) =>
      prev.map((c) => (pending.some((p) => p.id === c.id) ? { ...c, syncState: "syncing" } : c)),
    );
    let ok = 0;
    for (const p of pending) {
      try {
        const res = await api.submitReport(p);
        mutateCases((prev) =>
          prev.map((c) =>
            c.id === p.id
              ? {
                  ...c,
                  id: res.id,
                  localId: p.id,
                  syncState: "synced",
                  vetEta: res.vetEta,
                  stage: c.stage === "reported" ? "vetNotified" : c.stage,
                }
              : c,
          ),
        );
        ok++;
      } catch {
        mutateCases((prev) => prev.map((c) => (c.id === p.id ? { ...c, syncState: "failed" } : c)));
      }
    }
    setSyncing(false);
    if (ok) toast.success(t("allSynced"));
  }, [mutateCases, syncing, t]);

  const addCase = useCallback(
    async (c: HealthCase) => {
      const online =
        (typeof navigator === "undefined" ? true : navigator.onLine) && !simulateOffline;
      let saved: HealthCase;

      if (!online) {
        saved = { ...c, syncState: "pending" };
        mutateCases((prev) => [saved, ...prev]);
      } else {
        const res = await api.submitReport(c);
        saved = {
          ...c,
          id: res.id,
          localId: c.id,
          syncState: "synced",
          vetEta: res.vetEta,
          stage: "vetNotified",
        };
        mutateCases((prev) => [saved, ...prev]);
      }

      // Automatically update the animal's status and add to medical history
      if (c.animalId) {
        const today = new Date().toISOString().slice(0, 10);
        const isHigh = c.assessment.level === "high";
        mutateAnimals((prev) =>
          prev.map((a) => {
            if (a.id !== c.animalId) return a;
            const historyEntry: HistoryEntry = {
              id: `h-${Date.now()}`,
              date: today,
              title: `Report filed (${c.symptoms.join(", ")})`,
              kind: "report",
              detail: `Case ${saved.id} - ${c.assessment.level} priority`,
            };
            return {
              ...a,
              status: isHigh ? "care" : "attention",
              statusNote: isHigh ? "underTreatment" : "reducedAppetite",
              activeCaseId: saved.id,
              history: [historyEntry, ...a.history],
            };
          }),
        );
      }

      return saved;
    },
    [mutateCases, mutateAnimals, simulateOffline],
  );

  // Auto-sync when network returns
  const prevOnline = useRef(online);
  useEffect(() => {
    if (hydrated && online && !prevOnline.current) {
      toast(t("backOnline"));
      void syncNow();
    }
    prevOnline.current = online;
  }, [online, hydrated, syncNow, t]);

  const toggleChecklist = useCallback((id: string) => {
    setChecklist((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      localKv.set("checklist", { date: new Date().toISOString().slice(0, 10), items: next });
      return next;
    });
  }, []);

  const toggleReminder = useCallback((id: string) => {
    setReminders((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      localKv.set("reminders", next);
      return next;
    });
  }, []);

  const pendingCount = cases.filter((c) => c.syncState !== "synced").length;

  const value = useMemo<AppState>(
    () => ({
      hydrated,
      lang,
      setLang,
      t,
      online,
      simulateOffline,
      setSimulateOffline,
      profile,
      updateProfile,
      animals,
      addAnimal,
      updateAnimal,
      findAnimal,
      recordVaccination,
      addVaccination,
      addAnimalHistory,
      cases,
      pendingCount,
      syncing,
      addCase,
      updateCase,
      findCase,
      resolveCase,
      advanceCaseStage,
      syncNow,
      addRecovery,
      setExposure,
      checklist,
      toggleChecklist,
      reminders,
      toggleReminder,
    }),
    [
      hydrated,
      lang,
      setLang,
      t,
      online,
      simulateOffline,
      setSimulateOffline,
      profile,
      updateProfile,
      animals,
      addAnimal,
      updateAnimal,
      findAnimal,
      recordVaccination,
      addVaccination,
      addAnimalHistory,
      cases,
      pendingCount,
      syncing,
      addCase,
      updateCase,
      findCase,
      resolveCase,
      advanceCaseStage,
      syncNow,
      addRecovery,
      setExposure,
      checklist,
      toggleChecklist,
      reminders,
      toggleReminder,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useApp outside AppProvider");
  return v;
}

/** Simulates a network fetch that fails when offline, for loading/error/offline states. */
export function useRemote<T>(fn: () => Promise<T>, online: boolean, deps: unknown[] = []) {
  const [state, setState] = useState<{ status: "loading" | "ok" | "error" | "offline"; data?: T }>({
    status: "loading",
  });
  const [tick, setTick] = useState(0);
  useEffect(() => {
    let alive = true;
    setState((s) => ({ ...s, status: "loading" }));
    fn()
      .then((data) => {
        if (!alive) return;
        setState({ status: online ? "ok" : "offline", data });
      })
      .catch(() => alive && setState({ status: "error" }));
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [online, tick, ...deps]);
  return { ...state, retry: () => setTick((x) => x + 1) };
}
