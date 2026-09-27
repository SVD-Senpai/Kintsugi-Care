import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Activity,
  Check,
  CheckCircle2,
  ChevronRight,
  Copy,
  Download,
  MapPin,
  Plus,
  QrCode,
  Stethoscope,
  Syringe,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  BigButton,
  Card,
  Disclaimer,
  EmptyState,
  PageHeader,
  Section,
  StatusPill,
} from "@/components/app/ui";
import { daysUntil, formatDate } from "@/lib/format";
import { animals as fallbackAnimals, vets } from "@/lib/mock/data";
import { useApp } from "@/lib/store";
import type { HistoryEntry, Vaccination } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/animals/$id")({
  head: () => ({
    meta: [
      { title: "Animal Health Passport — Kintsugi Care" },
      {
        name: "description",
        content:
          "Digital livestock health passport: vaccinations, health history, movement and QR identity.",
      },
    ],
  }),
  component: PassportPage,
});

const placeKeyLabel = {
  farm: "farm",
  grazing: "grazing",
  waterPoint: "waterPoint",
  market: "market",
  otherFarm: "otherFarm",
  vetClinic: "vetClinic",
} as const;

function PassportPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const {
    t,
    lang,
    animals,
    findAnimal,
    cases,
    recordVaccination,
    addVaccination,
    addAnimalHistory,
  } = useApp();

  const [tab, setTab] = useState<"reports" | "treatment" | "visits">("reports");
  const [showQr, setShowQr] = useState(false);
  const [copied, setCopied] = useState(false);

  // Modals for passport actions
  const [showAddVaccModal, setShowAddVaccModal] = useState(false);
  const [newVaccName, setNewVaccName] = useState("FMD");
  const [newVaccDueDate, setNewVaccDueDate] = useState(
    new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
  );

  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteDetail, setNoteDetail] = useState("");
  const [noteKind, setNoteKind] = useState<"report" | "treatment" | "visit" | "note">("note");

  const animal = findAnimal(id) ?? fallbackAnimals.find((a) => a.id === id);

  if (!animal) {
    return (
      <div className="p-4">
        <PageHeader title={t("healthPassport")} />
        <EmptyState
          icon={Activity}
          title={t("noAnimals")}
          sub={t("noAnimalsSub")}
          action={
            <BigButton onClick={() => navigate({ to: "/animals" })}>
              {t("viewAll")} {t("myAnimals")}
            </BigButton>
          }
        />
      </div>
    );
  }

  const activeCase = cases.find((c) => c.animalId === animal.id && c.stage !== "resolved");
  const history = animal.history.filter((h) =>
    tab === "reports"
      ? h.kind === "report" || h.kind === "note"
      : tab === "treatment"
        ? h.kind === "treatment"
        : h.kind === "visit",
  );

  const copyId = () => {
    navigator.clipboard?.writeText(animal.id);
    setCopied(true);
    toast.success(`${t("copied")} (${animal.id})`);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMarkVaccineGiven = (v: Vaccination) => {
    recordVaccination(animal.id, v.id);
    toast.success(`${v.name} marked as administered!`);
  };

  const handleAddVaccination = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVaccName.trim()) return;
    addVaccination(animal.id, {
      name: newVaccName.trim(),
      dueDate: newVaccDueDate,
      status: "due",
    });
    toast.success(t("recordAdded"));
    setShowAddVaccModal(false);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim()) return;
    addAnimalHistory(animal.id, {
      date: new Date().toISOString().slice(0, 10),
      title: noteTitle.trim(),
      detail: noteDetail.trim() || undefined,
      kind: noteKind,
    });
    toast.success(t("recordAdded"));
    setNoteTitle("");
    setNoteDetail("");
    setShowAddNoteModal(false);
  };

  return (
    <div className="pb-10">
      <PageHeader title={t("healthPassport")} subtitle={animal.id} />

      <div className="px-4">
        <div className="surface-card overflow-hidden">
          <div className="relative h-56">
            <img
              src={animal.photo}
              alt={animal.name}
              className="h-full w-full object-cover"
              width={800}
              height={400}
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 via-ink/50 to-transparent p-4 text-cream">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-extrabold">{animal.name}</h2>
                <StatusPill
                  status={animal.status}
                  label={t(
                    animal.status === "healthy"
                      ? "healthy"
                      : animal.status === "attention"
                        ? "needAttention"
                        : "underCare",
                  )}
                />
              </div>
              <p className="text-sm opacity-90">
                {animal.breed} · {t(animal.gender)} · {t("years", { n: animal.ageYears })}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 p-4 bg-card">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                {t("animalId")}
              </p>
              <div className="flex items-center gap-2">
                <p className="font-mono text-lg font-extrabold tracking-wider">{animal.id}</p>
                <button
                  type="button"
                  onClick={copyId}
                  className="press text-muted-foreground hover:text-primary"
                  aria-label={t("copyId")}
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-healthy" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <button
              onClick={() => setShowQr((v) => !v)}
              className="press inline-flex items-center gap-2 rounded-xl bg-secondary px-3.5 py-2.5 text-sm font-bold"
            >
              <QrCode className="h-4 w-4 text-primary" />
              {showQr ? t("close") : t("showQr")}
            </button>
          </div>

          {showQr && (
            <div className="flex flex-col items-center border-t border-border px-4 py-5 animate-pop bg-secondary/30">
              <div
                className="grid grid-cols-9 gap-0.5 rounded-2xl bg-card p-4 shadow-card border border-border"
                aria-label={`QR ${animal.id}`}
              >
                {Array.from({ length: 81 }).map((_, i) => {
                  const seed = (animal.id.charCodeAt(i % animal.id.length) * (i + 7)) % 5;
                  const corner =
                    (i % 9 < 3 && i < 27) || (i % 9 > 5 && i < 27) || (i % 9 < 3 && i > 53);
                  return (
                    <span
                      key={i}
                      className={cn(
                        "h-3 w-3 rounded-[2px]",
                        corner || seed < 2 ? "bg-ink" : "bg-transparent",
                      )}
                    />
                  );
                })}
              </div>
              <p className="mt-3 text-center text-xs font-medium text-muted-foreground max-w-xs">
                {t("qrHint")}
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={copyId}
                  className="press inline-flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5 text-xs font-bold border border-border"
                >
                  <Copy className="h-3.5 w-3.5" /> {t("copyId")}
                </button>
                <button
                  onClick={() => toast.success("ID Card generated and ready to share.")}
                  className="press inline-flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5 text-xs font-bold border border-border"
                >
                  <Download className="h-3.5 w-3.5" /> {t("downloadCard")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Current Health Status */}
      <Section title={t("currentHealth")}>
        <Card>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <StatusPill
                status={animal.status}
                label={t(
                  animal.status === "healthy"
                    ? "healthy"
                    : animal.status === "attention"
                      ? "needAttention"
                      : "underCare",
                )}
                className="text-sm px-3 py-1.5"
              />
              {animal.statusNote && (
                <span className="text-sm text-muted-foreground font-medium">
                  {t(animal.statusNote as "reducedAppetite")}
                </span>
              )}
            </div>
          </div>
          {activeCase && (
            <Link
              to="/cases/$id"
              params={{ id: activeCase.id }}
              className="press mt-3 flex items-center gap-3 rounded-2xl bg-secondary/80 p-3 border border-border"
            >
              <Activity className="h-5 w-5 text-urgent" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">
                  {t("currentCase")} · {activeCase.id}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t("assignedVet")}: {vets[0]?.name}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          )}
        </Card>
        <Link
          to="/report"
          search={{ mode: "questions", animal: animal.id }}
          className="gradient-fresh press mt-3 flex h-14 items-center justify-center gap-2 rounded-2xl font-bold text-primary-foreground shadow-cta"
        >
          <Stethoscope className="h-5 w-5" /> {t("reportForAnimal", { name: animal.name })}
        </Link>
      </Section>

      {/* Vaccinations */}
      <Section
        title={t("vaccinations")}
        action={
          <button
            onClick={() => setShowAddVaccModal(true)}
            className="press inline-flex items-center gap-1 text-xs font-bold text-primary"
          >
            <Plus className="h-3.5 w-3.5" /> {t("logVaccination")}
          </button>
        }
      >
        <div className="space-y-2">
          {animal.vaccinations.length === 0 && (
            <Card className="text-center py-4 text-sm text-muted-foreground">{t("noHistory")}</Card>
          )}
          {animal.vaccinations.map((v) => {
            const d = v.dueDate ? daysUntil(v.dueDate) : null;
            return (
              <Card key={v.id} className="flex flex-col gap-2 py-3">
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                      v.status === "done"
                        ? "bg-healthy-soft text-healthy"
                        : v.status === "overdue"
                          ? "bg-urgent-soft text-urgent"
                          : "bg-info-soft text-info",
                    )}
                  >
                    <Syringe className="h-5 w-5" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold truncate">{v.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {v.status === "done"
                        ? `${t("completedLabel")} · ${v.givenDate ? formatDate(v.givenDate, lang) : ""}`
                        : d !== null && d < 0
                          ? t("overdue", { n: -d })
                          : d !== null
                            ? t("dueIn", { n: d })
                            : ""}
                    </p>
                  </div>
                  <StatusPill
                    status={
                      v.status === "done" ? "healthy" : v.status === "overdue" ? "care" : "info"
                    }
                    label={
                      v.status === "done"
                        ? t("completedLabel")
                        : v.status === "overdue"
                          ? t("vaccOverdue")
                          : t("upcoming")
                    }
                  />
                </div>
                {v.status !== "done" && (
                  <div className="flex justify-end pt-1 border-t border-border/50">
                    <button
                      type="button"
                      onClick={() => handleMarkVaccineGiven(v)}
                      className="press inline-flex items-center gap-1.5 rounded-lg bg-primary-soft px-3 py-1 text-xs font-bold text-primary"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" /> {t("markAdministered")}
                    </button>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </Section>

      {/* Health History */}
      <Section
        title={t("healthHistory")}
        action={
          <button
            onClick={() => setShowAddNoteModal(true)}
            className="press inline-flex items-center gap-1 text-xs font-bold text-primary"
          >
            <Plus className="h-3.5 w-3.5" /> {t("addNote")}
          </button>
        }
      >
        <div className="mb-3 grid grid-cols-3 rounded-2xl bg-secondary p-1">
          {(
            [
              ["reports", t("previousReports")],
              ["treatment", t("treatmentHistory")],
              ["visits", t("vetVisits")],
            ] as const
          ).map(([k, l]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={cn(
                "press rounded-xl px-1 py-2 text-xs font-bold transition-all",
                tab === k ? "bg-card shadow-card text-primary" : "text-muted-foreground",
              )}
            >
              {l}
            </button>
          ))}
        </div>

        {history.length === 0 ? (
          <EmptyState icon={Activity} title={t("noHistory")} sub={t("noHistorySub")} />
        ) : (
          <div className="surface-card divide-y divide-border">
            {history.map((h) => (
              <div key={h.id} className="flex gap-3 p-4">
                <div className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />
                <div>
                  <p className="font-bold leading-tight">{h.title}</p>
                  {h.detail && <p className="text-sm text-muted-foreground mt-0.5">{h.detail}</p>}
                  <p className="mt-1 text-xs text-muted-foreground">{formatDate(h.date, lang)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* Movement History */}
      <Section title={t("movementHistory")}>
        <p className="-mt-2 mb-3 text-xs text-muted-foreground">{t("movementHint")}</p>
        <div className="surface-card p-4">
          {animal.movement.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-2">{t("noHistory")}</p>
          ) : (
            <ol className="relative ml-2 border-l-2 border-dashed border-sage pl-5">
              {animal.movement.map((m) => (
                <li key={m.id} className="relative pb-4 last:pb-0">
                  <span className="absolute -left-[1.85rem] top-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary-soft text-primary">
                    <MapPin className="h-3.5 w-3.5" />
                  </span>
                  <p className="font-bold leading-tight">
                    {t(placeKeyLabel[m.placeKey] ?? "farm")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(m.date, lang)} · {m.from}
                    {m.to ? ` – ${m.to}` : ""}
                  </p>
                </li>
              ))}
            </ol>
          )}
        </div>
        <div className="mt-4">
          <Disclaimer text={t("disclaimerShort")} />
        </div>
      </Section>

      {/* Log Vaccination Modal */}
      {showAddVaccModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4 backdrop-blur-sm animate-fade-up">
          <div className="w-full max-w-md rounded-t-3xl sm:rounded-3xl border border-border bg-card p-6 shadow-float">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="text-lg font-extrabold">{t("logVaccination")}</h3>
              <button
                type="button"
                onClick={() => setShowAddVaccModal(false)}
                className="press h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddVaccination} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  {t("vaccineName")}
                </label>
                <input
                  required
                  value={newVaccName}
                  onChange={(e) => setNewVaccName(e.target.value)}
                  placeholder="e.g. FMD, HS, PPR, Blackleg"
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  {t("dueIn", { n: "" })}
                </label>
                <input
                  type="date"
                  required
                  value={newVaccDueDate}
                  onChange={(e) => setNewVaccDueDate(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary"
                />
              </div>
              <BigButton type="submit" variant="primary">
                {t("save")} {t("vaccination")}
              </BigButton>
            </form>
          </div>
        </div>
      )}

      {/* Add Health Note Modal */}
      {showAddNoteModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4 backdrop-blur-sm animate-fade-up">
          <div className="w-full max-w-md rounded-t-3xl sm:rounded-3xl border border-border bg-card p-6 shadow-float">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="text-lg font-extrabold">{t("addNote")}</h3>
              <button
                type="button"
                onClick={() => setShowAddNoteModal(false)}
                className="press h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddNote} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  {t("noteTitle")} *
                </label>
                <input
                  required
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder="e.g. Deworming completed, Appetite improved"
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  {t("speciesLabel")}
                </label>
                <select
                  value={noteKind}
                  onChange={(e) =>
                    setNoteKind(e.target.value as "report" | "treatment" | "visit" | "note")
                  }
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                >
                  <option value="note">Observation Note</option>
                  <option value="treatment">Treatment / Medicine</option>
                  <option value="visit">Veterinary / Camp Visit</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  {t("noteDetail")}
                </label>
                <textarea
                  rows={3}
                  value={noteDetail}
                  onChange={(e) => setNoteDetail(e.target.value)}
                  placeholder="Dosage, instructions, or vet name..."
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary"
                />
              </div>
              <BigButton type="submit" variant="primary">
                {t("save")}
              </BigButton>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
