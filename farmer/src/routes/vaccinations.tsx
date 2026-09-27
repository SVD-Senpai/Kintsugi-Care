import { Link, createFileRoute } from "@tanstack/react-router";
import {
  BadgeCheck,
  Bell,
  BellRing,
  CalendarDays,
  CheckCircle2,
  MapPin,
  Plus,
  Syringe,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  BigButton,
  Card,
  CardSkeleton,
  Disclaimer,
  OfflineNote,
  PageHeader,
  Section,
  StatusPill,
} from "@/components/app/ui";
import { daysUntil, formatDate } from "@/lib/format";
import { api } from "@/lib/services/api";
import { useApp, useRemote } from "@/lib/store";
import type { Vaccination } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/vaccinations")({
  head: () => ({
    meta: [
      { title: "Vaccinations — Kintsugi Care" },
      {
        name: "description",
        content:
          "Upcoming and completed vaccinations for your herd, with reminders and nearby vaccination camps.",
      },
      { property: "og:title", content: "Vaccinations — Kintsugi Care" },
      { property: "og:description", content: "Track herd vaccinations and nearby camps." },
    ],
  }),
  component: VaccPage,
});

function VaccPage() {
  const {
    t,
    lang,
    online,
    hydrated,
    reminders,
    toggleReminder,
    animals,
    recordVaccination,
    addVaccination,
  } = useApp();
  const camps = useRemote(() => api.getCamps(), online);

  const [showLogModal, setShowLogModal] = useState(false);
  const [selectedAnimalId, setSelectedAnimalId] = useState(animals[0]?.id ?? "");
  const [vaccineName, setVaccineName] = useState("FMD");
  const [vaccineDate, setVaccineDate] = useState(new Date().toISOString().slice(0, 10));

  const all = animals.flatMap((a) => a.vaccinations.map((v) => ({ a, v })));
  const upcoming = all
    .filter((x) => x.v.status !== "done")
    .sort((x, y) => daysUntil(x.v.dueDate!) - daysUntil(y.v.dueDate!));
  const done = all.filter((x) => x.v.status === "done");

  const handleLogVaccine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAnimalId || !vaccineName.trim()) return;

    addVaccination(selectedAnimalId, {
      name: vaccineName.trim(),
      givenDate: vaccineDate,
      status: "done",
    });
    toast.success(t("recordAdded"));
    setShowLogModal(false);
  };

  return (
    <div className="pb-10">
      <PageHeader
        title={t("vaccinations")}
        right={
          <button
            onClick={() => setShowLogModal(true)}
            className="press inline-flex items-center gap-1.5 rounded-full gradient-fresh px-3 py-1.5 text-xs font-bold text-primary-foreground shadow-cta"
          >
            <Plus className="h-4 w-4" /> {t("logVaccination")}
          </button>
        }
      />

      <Section title={t("upcoming")}>
        {upcoming.length === 0 ? (
          <Card className="text-center py-4 text-sm text-muted-foreground">
            {t("vaccUpToDate")}
          </Card>
        ) : (
          <div className="space-y-2.5">
            {upcoming.map(({ a, v }) => {
              const d = hydrated ? daysUntil(v.dueDate!) : 0;
              const on = reminders.includes(v.id);
              return (
                <Card key={v.id} className="space-y-2.5">
                  <div className="flex items-center gap-3">
                    <img
                      src={a.photo}
                      alt={a.name}
                      className="h-12 w-12 rounded-xl object-cover"
                      width={48}
                      height={48}
                      loading="lazy"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-bold">{v.name}</p>
                      <Link
                        to="/animals/$id"
                        params={{ id: a.id }}
                        className="text-sm text-muted-foreground hover:underline"
                      >
                        {a.name} · {a.id}
                      </Link>
                    </div>
                    {hydrated && (
                      <StatusPill
                        status={d < 0 ? "care" : d <= 7 ? "attention" : "info"}
                        label={d < 0 ? t("overdue", { n: -d }) : t("dueIn", { n: d })}
                      />
                    )}
                  </div>

                  <div className="flex items-center justify-between border-t border-border pt-2">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <CalendarDays className="h-4 w-4" />
                      {formatDate(v.dueDate!, lang)}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          toggleReminder(v.id);
                          if (!on) toast.success(t("reminderSet"));
                        }}
                        className={cn(
                          "press inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold",
                          on ? "bg-primary-soft text-primary" : "bg-secondary",
                        )}
                      >
                        {on ? (
                          <BellRing className="h-3.5 w-3.5" />
                        ) : (
                          <Bell className="h-3.5 w-3.5" />
                        )}
                        {on ? t("reminderSet") : t("setReminder")}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          recordVaccination(a.id, v.id);
                          toast.success(`${v.name} recorded as administered for ${a.name}!`);
                        }}
                        className="press inline-flex items-center gap-1 rounded-full bg-healthy-soft text-healthy px-2.5 py-1 text-xs font-bold"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {t("markAdministered")}
                      </button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </Section>

      <Section title={t("nearbyCamp")}>
        {camps.status === "loading" && <CardSkeleton />}
        {camps.status === "offline" && !camps.data && <OfflineNote />}
        {camps.data?.map((c) => (
          <Card key={c.location} className="border-primary/30">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <Syringe className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-bold">{lang === "hi" ? c.locationHi : c.location}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(c.date, lang)} · {c.time}
                </p>
                {c.verified && (
                  <span className="mt-1.5 inline-flex items-center gap-1 text-xs font-bold text-healthy">
                    <BadgeCheck className="h-3.5 w-3.5" />
                    {t("verifiedInfo")}
                  </span>
                )}
              </div>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(c.location)}`}
                target="_blank"
                rel="noreferrer"
                className="press flex h-10 w-10 items-center justify-center rounded-full bg-secondary"
                aria-label={t("directions")}
              >
                <MapPin className="h-4 w-4" />
              </a>
            </div>
          </Card>
        ))}
      </Section>

      <Section title={t("completedLabel")}>
        <Card className="divide-y divide-border p-0">
          {done.length === 0 ? (
            <p className="text-sm text-muted-foreground p-4 text-center">{t("noHistory")}</p>
          ) : (
            done.map(({ a, v }) => (
              <div key={v.id} className="flex items-center gap-3 px-4 py-3">
                <BadgeCheck className="h-5 w-5 text-healthy" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate">{v.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {a.name} · {v.givenDate ? formatDate(v.givenDate, lang) : ""}
                  </p>
                </div>
              </div>
            ))
          )}
        </Card>
      </Section>

      <div className="px-4">
        <Disclaimer text={t("disclaimerShort")} />
      </div>

      {/* Log Vaccination Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4 backdrop-blur-sm animate-fade-up">
          <div className="w-full max-w-md rounded-t-3xl sm:rounded-3xl border border-border bg-card p-6 shadow-float">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="text-lg font-extrabold">{t("logVaccination")}</h3>
              <button
                type="button"
                onClick={() => setShowLogModal(false)}
                className="press h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleLogVaccine} className="mt-4 space-y-4">
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
                      {a.name} ({a.id} · {a.breed})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  {t("vaccineName")} *
                </label>
                <input
                  required
                  value={vaccineName}
                  onChange={(e) => setVaccineName(e.target.value)}
                  placeholder="e.g. FMD, HS, Anthrax, PPR, Ranikhet"
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  {t("dateGiven")}
                </label>
                <input
                  type="date"
                  required
                  value={vaccineDate}
                  onChange={(e) => setVaccineDate(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary"
                />
              </div>

              <div className="pt-2">
                <BigButton type="submit" variant="primary">
                  {t("save")}
                </BigButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
