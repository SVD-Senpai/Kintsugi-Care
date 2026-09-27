import { createFileRoute } from "@tanstack/react-router";
import { Building2, Calendar, MapPin, MessageCircle, Phone, Stethoscope, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  BigButton,
  Card,
  CardSkeleton,
  Disclaimer,
  ErrorState,
  OfflineNote,
  PageHeader,
  Section,
  StatusPill,
} from "@/components/app/ui";
import { api } from "@/lib/services/api";
import { useApp, useRemote } from "@/lib/store";

export const Route = createFileRoute("/vet-help")({
  head: () => ({
    meta: [
      { title: "Vet Help — Kintsugi Care" },
      {
        name: "description",
        content:
          "Call or message your assigned veterinarian and find the nearest government veterinary hospital.",
      },
      { property: "og:title", content: "Vet Help — Kintsugi Care" },
      { property: "og:description", content: "Reach a vet or the nearest hospital quickly." },
    ],
  }),
  component: VetHelpPage,
});

function VetHelpPage() {
  const { t, lang, online, animals, updateAnimal } = useApp();
  const r = useRemote(() => api.getVetHelp(), online);

  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedAnimalId, setSelectedAnimalId] = useState(animals[0]?.id ?? "");
  const [urgency, setUrgency] = useState<"routine" | "urgent">("urgent");
  const [visitNote, setVisitNote] = useState("");
  const [requestedVets, setRequestedVets] = useState<Record<string, string>>({});

  const handleRequestVisit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAnimalId) return;

    const animal = animals.find((a) => a.id === selectedAnimalId);
    if (animal && animal.status === "healthy" && urgency === "urgent") {
      updateAnimal(animal.id, { status: "attention", statusNote: "reducedAppetite" });
    }

    setRequestedVets((prev) => ({ ...prev, [r.data?.vets[0]?.id ?? "vet1"]: "Requested" }));
    toast.success(`${t("consultationRequested")} for ${animal?.name ?? "animal"}! ETA: 2–4 hours`);
    setShowRequestModal(false);
    setVisitNote("");
  };

  return (
    <div className="pb-10">
      <PageHeader
        title={t("vetHelp")}
        right={
          <button
            onClick={() => setShowRequestModal(true)}
            className="press inline-flex items-center gap-1.5 rounded-full gradient-fresh px-3 py-1.5 text-xs font-bold text-primary-foreground shadow-cta"
          >
            <Stethoscope className="h-4 w-4" /> {t("emergencyConsultation")}
          </button>
        }
      />

      <Section>
        {r.status === "offline" && (
          <div className="mb-3">
            <OfflineNote text={t("requiresInternet")} />
          </div>
        )}
        {r.status === "loading" && (
          <div className="space-y-3">
            <CardSkeleton />
            <CardSkeleton />
          </div>
        )}
        {r.status === "error" && <ErrorState onRetry={r.retry} />}
        {r.data && (
          <div className="space-y-3">
            {r.data.vets.map((v) => {
              const isReq = !!requestedVets[v.id];
              return (
                <Card key={v.id} className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-soft text-lg font-extrabold text-primary">
                      {v.photoInitials}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold">{v.name}</p>
                      <p className="truncate text-sm text-muted-foreground">
                        {lang === "hi" ? v.roleHi : v.role}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <StatusPill
                          status={v.availability === "available" ? "healthy" : "attention"}
                          label={t(v.availability)}
                        />
                        <span className="text-xs text-muted-foreground">
                          {v.activeCases} {t("activeCases")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {isReq && (
                    <div className="rounded-xl bg-healthy-soft px-3 py-2 text-xs font-bold text-healthy">
                      ✓ Farm visit scheduled for your herd today (Estimated: 2–4 hours)
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <a
                      href={`tel:${v.phone.replace(/\s/g, "")}`}
                      className="press flex h-12 items-center justify-center gap-2 rounded-2xl gradient-fresh font-bold text-primary-foreground shadow-cta"
                    >
                      <Phone className="h-4 w-4" />
                      {t("call")}
                    </a>
                    <a
                      href={`sms:${v.phone.replace(/\s/g, "")}`}
                      className="press flex h-12 items-center justify-center gap-2 rounded-2xl border border-border bg-card font-bold"
                    >
                      <MessageCircle className="h-4 w-4" />
                      {t("message")}
                    </a>
                  </div>
                </Card>
              );
            })}

            <Card className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-info-soft text-info">
                  <Building2 className="h-6 w-6" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold uppercase text-muted-foreground">
                    {t("govHospital")}
                  </p>
                  <p className="font-bold">
                    {lang === "hi" ? r.data.hospital.nameHi : r.data.hospital.name}
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    {r.data.hospital.distanceKm} km · {r.data.hospital.hours}
                  </p>
                  <StatusPill
                    status={r.data.hospital.open ? "healthy" : "care"}
                    label={t(r.data.hospital.open ? "open" : "closed")}
                    className="mt-2"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <a
                  href={`tel:${r.data.hospital.phone.replace(/\s/g, "")}`}
                  className="press flex h-12 items-center justify-center gap-2 rounded-2xl gradient-fresh font-bold text-primary-foreground shadow-cta"
                >
                  <Phone className="h-4 w-4" />
                  {t("call")}
                </a>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(r.data.hospital.name)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="press flex h-12 items-center justify-center gap-2 rounded-2xl border border-border bg-card font-bold"
                >
                  <MapPin className="h-4 w-4" />
                  {t("directions")}
                </a>
              </div>
            </Card>
          </div>
        )}
      </Section>

      <div className="px-4">
        <Disclaimer text={t("disclaimerShort")} />
      </div>

      {/* Request Visit Dialog */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4 backdrop-blur-sm animate-fade-up">
          <div className="w-full max-w-md rounded-t-3xl sm:rounded-3xl border border-border bg-card p-6 shadow-float">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="text-lg font-extrabold">{t("emergencyConsultation")}</h3>
              <button
                type="button"
                onClick={() => setShowRequestModal(false)}
                className="press h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleRequestVisit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  {t("selectAnimal")} *
                </label>
                <select
                  value={selectedAnimalId}
                  onChange={(e) => setSelectedAnimalId(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary"
                >
                  {animals.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.id} · {a.breed} · {a.status})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Urgency Level
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setUrgency("urgent")}
                    className={`press rounded-xl border-2 py-2 px-3 text-xs font-bold ${
                      urgency === "urgent"
                        ? "border-urgent bg-urgent-soft text-urgent"
                        : "border-border"
                    }`}
                  >
                    Urgent (Same Day)
                  </button>
                  <button
                    type="button"
                    onClick={() => setUrgency("routine")}
                    className={`press rounded-xl border-2 py-2 px-3 text-xs font-bold ${
                      urgency === "routine"
                        ? "border-primary bg-primary-soft text-primary"
                        : "border-border"
                    }`}
                  >
                    Routine Checkup
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Symptoms / Reason for visit
                </label>
                <textarea
                  rows={3}
                  value={visitNote}
                  onChange={(e) => setVisitNote(e.target.value)}
                  placeholder="Describe condition: fever, reduced milk, injury, bloat..."
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary"
                />
              </div>

              <div className="pt-2">
                <BigButton type="submit" variant="primary">
                  Dispatch Request to {r.data?.vets[0]?.name ?? "Veterinarian"}
                </BigButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
