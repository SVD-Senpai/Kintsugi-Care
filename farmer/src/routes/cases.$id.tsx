import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  HeartPulse,
  MapPin,
  Phone,
  ShieldCheck,
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
import { formatDate, timeAgo } from "@/lib/format";
import { vets } from "@/lib/mock/data";
import { api } from "@/lib/services/api";
import { useApp } from "@/lib/store";
import type { CaseStage, RecoveryUpdate } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/cases/$id")({
  head: () => ({
    meta: [
      { title: "Case Tracking — Kintsugi Care" },
      {
        name: "description",
        content:
          "Follow your animal's case from report to recovery, and send daily recovery updates.",
      },
      { property: "og:title", content: "Case Tracking — Kintsugi Care" },
      { property: "og:description", content: "Timeline, vet instructions and recovery updates." },
    ],
  }),
  component: CasePage,
});

const stages: {
  s: CaseStage;
  k:
    | "tReported"
    | "tAssessed"
    | "tVetNotified"
    | "tVetVisit"
    | "tTreatment"
    | "tFollowUp"
    | "tResolved";
  descEn: string;
  descHi: string;
}[] = [
  {
    s: "reported",
    k: "tReported",
    descEn: "Problem submitted by farmer",
    descHi: "किसान द्वारा रिपोर्ट दर्ज की गई",
  },
  {
    s: "assessed",
    k: "tAssessed",
    descEn: "Urgency calculated automatically",
    descHi: "प्राथमिकता का आकलन किया गया",
  },
  {
    s: "vetNotified",
    k: "tVetNotified",
    descEn: "Veterinary officer alerted",
    descHi: "पशु चिकित्सक को सूचना भेजी गई",
  },
  {
    s: "vetVisit",
    k: "tVetVisit",
    descEn: "Clinical examination and sampling",
    descHi: "डॉक्टर द्वारा परीक्षण व नमूना संग्रह",
  },
  {
    s: "treatment",
    k: "tTreatment",
    descEn: "Medicine and care plan active",
    descHi: "दवा और उपचार चल रहा है",
  },
  {
    s: "followUp",
    k: "tFollowUp",
    descEn: "Recovery monitoring in progress",
    descHi: "सुधार की निगरानी जारी है",
  },
  {
    s: "resolved",
    k: "tResolved",
    descEn: "Animal recovered, case closed",
    descHi: "पशु स्वस्थ, मामला बंद",
  },
];

function CasePage() {
  const { id } = Route.useParams();
  const { t, lang, findCase, hydrated, addRecovery, resolveCase, advanceCaseStage, online } =
    useApp();
  const navigate = useNavigate();
  const c = findCase(id);

  const [form, setForm] = useState<Partial<RecoveryUpdate>>({});
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);
  const [showConfirmResolve, setShowConfirmResolve] = useState(false);
  const [resolveNotes, setResolveNotes] = useState("");

  if (!hydrated) {
    return (
      <div>
        <PageHeader title={t("caseTimeline")} />
        <div className="mx-4 skeleton h-64 rounded-3xl" />
      </div>
    );
  }

  if (!c) {
    return (
      <div>
        <PageHeader title={t("caseTimeline")} />
        <div className="px-4">
          <EmptyState
            icon={ClipboardList}
            title={t("noActiveCase")}
            sub={t("noActiveCaseSub")}
            action={
              <BigButton onClick={() => navigate({ to: "/report" })}>
                {t("reportProblem")}
              </BigButton>
            }
          />
        </div>
      </div>
    );
  }

  const cur = stages.findIndex((x) => x.s === c.stage);
  const vet = vets[0]!;
  const canSubmit = form.overall && form.eating && form.activity;
  const isResolved = c.stage === "resolved";

  const submitRecoveryUpdate = async () => {
    if (!canSubmit) return;
    setSaving(true);
    const r: RecoveryUpdate = {
      id: `r-${Date.now()}`,
      date: new Date().toISOString(),
      overall: form.overall!,
      eating: form.eating!,
      activity: form.activity!,
    };
    addRecovery(c.id, r);
    if (online) {
      try {
        await api.submitRecovery();
      } catch {
        /* saved offline */
      }
    }
    setSaving(false);
    setOpen(false);
    setForm({});
    toast.success(t("updateSaved"));
    if (r.overall === "worse") toast.error(t("worseWarning"));
  };

  const handleResolve = () => {
    resolveCase(c.id, resolveNotes.trim() || undefined);
    setShowConfirmResolve(false);
    toast.success(`${t("caseResolved")}! ${c.animalName} is now marked healthy.`);
  };

  return (
    <div className="pb-10">
      <PageHeader
        title={c.animalName}
        subtitle={`${t("reportNumber")}: ${c.id}`}
        right={
          <StatusPill
            status={isResolved ? "healthy" : c.assessment.level}
            label={
              isResolved
                ? t("caseResolved")
                : t(
                    c.assessment.level === "high"
                      ? "highPriority"
                      : c.assessment.level === "medium"
                        ? "mediumPriority"
                        : "lowPriority",
                  )
            }
          />
        }
      />

      {/* Case Resolved Banner */}
      {isResolved && (
        <div className="mx-4 mb-3 rounded-2xl bg-healthy-soft p-4 text-healthy border border-healthy/30 flex items-start gap-3">
          <CheckCircle2 className="h-6 w-6 shrink-0 mt-0.5" />
          <div>
            <p className="font-extrabold text-base">{t("caseResolved")}</p>
            <p className="text-xs text-foreground/80 mt-0.5">
              {c.resolutionNotes ?? "Animal has fully recovered and returned to the healthy herd."}
            </p>
            {c.resolvedAt && (
              <p className="text-[11px] text-muted-foreground mt-1">
                {t("completedLabel")}: {formatDate(c.resolvedAt, lang)}
              </p>
            )}
          </div>
        </div>
      )}

      {c.syncState !== "synced" && (
        <div className="mx-4 mb-3 rounded-2xl bg-attention-soft px-4 py-2.5 text-sm">
          {t("savedOfflineSub")}
        </div>
      )}

      {/* Link to Animal Passport */}
      {c.animalId && (
        <div className="mx-4 mb-4">
          <Link
            to="/animals/$id"
            params={{ id: c.animalId }}
            className="surface-card press flex items-center justify-between p-3"
          >
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-soft text-primary font-bold text-xs">
                ID
              </span>
              <span className="text-sm font-bold text-foreground">
                {t("viewPassport")}: {c.animalName} ({c.animalId})
              </span>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        </div>
      )}

      {/* Case Timeline */}
      <Section title={t("caseTimeline")}>
        <Card>
          <ol className="relative ml-3 border-l-2 border-border">
            {stages.map((s, i) => {
              const done = i <= cur;
              const active = i === cur;
              return (
                <li key={s.s} className="mb-4 ml-5 last:mb-0">
                  <span
                    className={cn(
                      "absolute -left-[11px] flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all",
                      done
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card",
                      active && "ring-4 ring-primary-soft scale-110",
                    )}
                  >
                    {done && !active && <Check className="h-3 w-3" />}
                    {active && <span className="h-2 w-2 rounded-full bg-card" />}
                  </span>
                  <div className="flex items-baseline justify-between">
                    <p className={cn("font-bold leading-5", !done && "text-muted-foreground")}>
                      {t(s.k)}
                    </p>
                    <span className="text-[11px] text-muted-foreground ml-2">
                      {i === 0
                        ? timeAgo(c.createdAt, lang)
                        : active
                          ? t("inProgress")
                          : done
                            ? t("done")
                            : t("pending")}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {lang === "hi" ? s.descHi : s.descEn}
                  </p>
                </li>
              );
            })}
          </ol>

          {/* Quick Stage Progression Controls (Demo / Workflow Actions) */}
          {!isResolved && (
            <div className="mt-4 pt-3 border-t border-border flex flex-wrap gap-2">
              {c.stage === "reported" && (
                <button
                  type="button"
                  onClick={() => {
                    advanceCaseStage(c.id, "vetNotified", "Veterinary team dispatched");
                    toast.success(t("stageAdvanced"));
                  }}
                  className="press rounded-xl bg-primary-soft px-3 py-1.5 text-xs font-bold text-primary"
                >
                  Confirm Vet Notification →
                </button>
              )}
              {(c.stage === "vetNotified" || c.stage === "assessed") && (
                <button
                  type="button"
                  onClick={() => {
                    advanceCaseStage(
                      c.id,
                      "vetVisit",
                      "Dr. Anita Verma arrived and examined the animal",
                    );
                    toast.success(t("stageAdvanced"));
                  }}
                  className="press rounded-xl bg-primary-soft px-3 py-1.5 text-xs font-bold text-primary"
                >
                  Log Doctor Visit →
                </button>
              )}
              {c.stage === "vetVisit" && (
                <button
                  type="button"
                  onClick={() => {
                    advanceCaseStage(
                      c.id,
                      "treatment",
                      "Prescribed antibiotic and multivitamin course",
                    );
                    toast.success(t("stageAdvanced"));
                  }}
                  className="press rounded-xl bg-primary-soft px-3 py-1.5 text-xs font-bold text-primary"
                >
                  Begin Treatment Course →
                </button>
              )}
              {c.stage === "treatment" && (
                <button
                  type="button"
                  onClick={() => {
                    advanceCaseStage(c.id, "followUp", "Daily appetite and breathing observation");
                    toast.success(t("stageAdvanced"));
                  }}
                  className="press rounded-xl bg-primary-soft px-3 py-1.5 text-xs font-bold text-primary"
                >
                  Move to Follow-up →
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowConfirmResolve(true)}
                className="press ml-auto rounded-xl bg-healthy-soft px-3 py-1.5 text-xs font-bold text-healthy"
              >
                ✓ {t("markResolved")}
              </button>
            </div>
          )}
        </Card>
      </Section>

      {/* Assigned Veterinarian */}
      <Section title={t("assignedVet")}>
        <Card>
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft font-extrabold text-primary">
              {vet.photoInitials}
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-bold">{vet.name}</p>
              <p className="truncate text-sm text-muted-foreground">
                {lang === "hi" ? vet.roleHi : vet.role}
              </p>
              {c.vetEta && (
                <p className="text-sm font-semibold text-primary">
                  {t("estArrival")}: {c.vetEta}
                </p>
              )}
            </div>
            <a
              href={`tel:${vet.phone.replace(/\s/g, "")}`}
              className="press flex h-11 w-11 items-center justify-center rounded-full gradient-fresh text-primary-foreground shadow-cta"
              aria-label={t("call")}
            >
              <Phone className="h-5 w-5" />
            </a>
          </div>
        </Card>
      </Section>

      {/* Vet Instructions */}
      {c.vetInstructions && c.vetInstructions.length > 0 && (
        <Section title={t("vetInstructions")}>
          <Card>
            <ul className="space-y-2.5">
              {c.vetInstructions.map((v, i) => (
                <li key={i} className="flex gap-2.5 text-sm">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-bold text-primary">
                    {i + 1}
                  </span>
                  <span className="leading-snug">{v}</span>
                </li>
              ))}
            </ul>
          </Card>
        </Section>
      )}

      {/* Recovery Check */}
      <Section title={t("recoveryCheck")}>
        {!open ? (
          <>
            {!isResolved && (
              <BigButton icon={HeartPulse} onClick={() => setOpen(true)}>
                {t("updateCase")}
              </BigButton>
            )}
            {c.recovery.length > 0 && (
              <div className="mt-3 space-y-2">
                {c.recovery.map((r) => (
                  <div
                    key={r.id}
                    className="surface-card flex items-center justify-between p-3.5 text-sm"
                  >
                    <div>
                      <span className="font-bold text-foreground block">
                        {formatDate(r.date, lang)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {t("eating")}:{" "}
                        {t(
                          r.eating === "normal"
                            ? "normal"
                            : r.eating === "less"
                              ? "less"
                              : "notEating",
                        )}{" "}
                        · {t("activity")}:{" "}
                        {t(
                          r.activity === "normal"
                            ? "normal"
                            : r.activity === "less"
                              ? "less"
                              : "veryWeak",
                        )}
                      </span>
                    </div>
                    <StatusPill
                      status={
                        r.overall === "better"
                          ? "healthy"
                          : r.overall === "same"
                            ? "attention"
                            : "care"
                      }
                      label={t(r.overall)}
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <Card className="animate-fade-up">
            {(
              [
                {
                  k: "howIsToday",
                  f: "overall",
                  o: [
                    ["better", "better"],
                    ["same", "same"],
                    ["worse", "worse"],
                  ],
                },
                {
                  k: "eating",
                  f: "eating",
                  o: [
                    ["normal", "normal"],
                    ["less", "less"],
                    ["none", "notEating"],
                  ],
                },
                {
                  k: "activity",
                  f: "activity",
                  o: [
                    ["normal", "normal"],
                    ["less", "less"],
                    ["veryWeak", "veryWeak"],
                  ],
                },
              ] as const
            ).map((q) => (
              <div key={q.f} className="mb-4">
                <p className="mb-2 font-bold">{t(q.k)}</p>
                <div className="grid grid-cols-3 gap-2">
                  {q.o.map(([v, l]) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, [q.f]: v }))}
                      className={cn(
                        "press rounded-xl border-2 px-2 py-3 text-sm font-bold transition-colors",
                        form[q.f] === v
                          ? "border-primary bg-primary-soft text-primary"
                          : "border-border text-foreground",
                      )}
                    >
                      {t(l)}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {form.overall === "worse" && (
              <div className="mb-4 rounded-xl bg-urgent-soft p-3 text-xs text-urgent flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>{t("worseWarning")}</span>
              </div>
            )}

            <div className="flex gap-2">
              <BigButton
                variant="secondary"
                onClick={() => {
                  setOpen(false);
                  setForm({});
                }}
                className="w-1/3"
              >
                {t("cancel")}
              </BigButton>
              <BigButton
                onClick={submitRecoveryUpdate}
                disabled={!canSubmit || saving}
                className="flex-1"
              >
                {saving ? t("loading") : t("submitUpdate")}
              </BigButton>
            </div>
          </Card>
        )}
      </Section>

      {/* Exposure Check & Contact Tracing */}
      <Section title={t("exposureCheck")}>
        {c.exposure ? (
          <Card className="space-y-1.5">
            <p className="text-sm">
              {t("locationsVisited")}: <b>{c.exposure.places.map((p) => t(p)).join(", ")}</b>
            </p>
            <p className="text-sm">
              {t("potentiallyExposed")}:{" "}
              <b>
                {c.exposure.companions.cows +
                  c.exposure.companions.buffaloes +
                  c.exposure.companions.goats}
              </b>{" "}
              ({c.exposure.companions.cows} {t("cow")}, {c.exposure.companions.buffaloes}{" "}
              {t("buffalo")}, {c.exposure.companions.goats} {t("goat")})
            </p>
            <p className="text-xs text-muted-foreground pt-1 border-t border-border">
              Recorded and available for veterinary epidemiological review.
            </p>
          </Card>
        ) : (
          <Link
            to="/exposure/$id"
            params={{ id: c.id }}
            className="surface-card press flex items-center gap-3 p-4"
          >
            <MapPin className="h-5 w-5 text-primary" />
            <span className="flex-1 font-bold text-sm">{t("exposureQ")}</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        )}
      </Section>

      <div className="px-4">
        <Disclaimer text={t("disclaimerShort")} />
      </div>

      {/* Confirm Resolution Modal */}
      {showConfirmResolve && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fade-up">
          <div className="w-full max-w-sm rounded-3xl border border-border bg-card p-6 shadow-float">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-healthy-soft text-healthy mx-auto mb-3">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-extrabold text-center">{t("markResolved")}</h3>
            <p className="text-xs text-muted-foreground text-center mt-1">{t("confirmResolved")}</p>
            <textarea
              value={resolveNotes}
              onChange={(e) => setResolveNotes(e.target.value)}
              placeholder="Recovery notes: animal recovered, eating normally..."
              rows={3}
              className="mt-4 w-full rounded-xl border border-border bg-background p-3 text-xs outline-none focus:border-primary"
            />
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setShowConfirmResolve(false)}
                className="press rounded-xl border border-border py-2.5 text-xs font-bold text-foreground"
              >
                {t("cancel")}
              </button>
              <button
                type="button"
                onClick={handleResolve}
                className="press rounded-xl gradient-fresh py-2.5 text-xs font-bold text-primary-foreground shadow-cta"
              >
                {t("done")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
