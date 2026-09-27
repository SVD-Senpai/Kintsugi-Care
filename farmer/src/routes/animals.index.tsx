import { Link, createFileRoute } from "@tanstack/react-router";
import { ChevronRight, PawPrint, Plus, Search, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { BigButton, EmptyState, PageHeader, StatusPill } from "@/components/app/ui";
import { daysUntil } from "@/lib/format";
import { speciesPhoto } from "@/lib/mock/data";
import { useApp } from "@/lib/store";
import type { Animal, HealthStatus, Species } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/animals/")({
  validateSearch: (s: Record<string, unknown>): { status?: "all" | HealthStatus } => ({
    status:
      s.status === "healthy" || s.status === "attention" || s.status === "care"
        ? s.status
        : undefined,
  }),
  head: () => ({
    meta: [
      { title: "My Animals — Kintsugi Care" },
      {
        name: "description",
        content:
          "Every animal in your herd with health status, vaccinations due and a digital health passport.",
      },
      { property: "og:title", content: "My Animals — Kintsugi Care" },
      {
        property: "og:description",
        content: "Herd list with health status and vaccination reminders.",
      },
    ],
  }),
  component: AnimalsPage,
});

function AnimalsPage() {
  const { status: searchStatus } = Route.useSearch();
  const { t, animals, addAnimal } = useApp();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | HealthStatus>(searchStatus ?? "all");
  const [showAddModal, setShowAddModal] = useState(false);

  // New Animal Form State
  const [newName, setNewName] = useState("");
  const [newSpecies, setNewSpecies] = useState<Species>("cow");
  const [newBreed, setNewBreed] = useState("");
  const [newGender, setNewGender] = useState<"female" | "male">("female");
  const [newAge, setNewAge] = useState<number>(3);
  const [newTag, setNewTag] = useState("");
  const [newStatus, setNewStatus] = useState<HealthStatus>("healthy");

  const list = animals.filter(
    (a) =>
      (filter === "all" || a.status === filter) &&
      (a.name + a.id + a.breed).toLowerCase().includes(q.toLowerCase()),
  );

  const filters: { k: "all" | HealthStatus; l: string }[] = [
    { k: "all", l: t("all") },
    { k: "healthy", l: t("healthy") },
    { k: "attention", l: t("needAttention") },
    { k: "care", l: t("underCare") },
  ];

  const handleCreateAnimal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const autoId = newTag.trim()
      ? newTag.trim().toUpperCase()
      : `KC-${Math.floor(10000 + Math.random() * 90000)}`;
    const created: Animal = {
      id: autoId,
      name: newName.trim(),
      species: newSpecies,
      breed:
        newBreed.trim() || `${newSpecies.charAt(0).toUpperCase() + newSpecies.slice(1)} Indigenous`,
      gender: newGender,
      ageYears: Number(newAge) || 2,
      status: newStatus,
      statusNote: newStatus === "attention" ? "reducedAppetite" : undefined,
      photo: speciesPhoto[newSpecies] ?? speciesPhoto.other,
      vaccinations: [
        {
          id: `v-${Date.now()}-1`,
          name:
            newSpecies === "poultry"
              ? "Ranikhet (RD)"
              : newSpecies === "goat" || newSpecies === "sheep"
                ? "PPR"
                : "FMD",
          dueDate: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
          status: "due",
        },
      ],
      movement: [
        {
          id: `m-${Date.now()}`,
          place: "Farm",
          placeKey: "farm",
          from: "06:00",
          date: new Date().toISOString().slice(0, 10),
        },
      ],
      history: [
        {
          id: `h-${Date.now()}`,
          date: new Date().toISOString().slice(0, 10),
          title: "Registered into Kintsugi Care herd",
          kind: "note",
        },
      ],
    };

    addAnimal(created);
    toast.success(t("animalAdded"));
    setShowAddModal(false);
    // Reset form
    setNewName("");
    setNewBreed("");
    setNewTag("");
  };

  return (
    <div className="pb-8">
      <PageHeader
        title={t("myAnimals")}
        back={false}
        right={
          <button
            onClick={() => setShowAddModal(true)}
            className="press inline-flex items-center gap-1.5 rounded-full gradient-fresh px-3 py-1.5 text-xs font-bold text-primary-foreground shadow-cta"
            aria-label={t("addAnimal")}
          >
            <Plus className="h-4 w-4" /> {t("addAnimal")}
          </button>
        }
      />

      <div className="px-4">
        <label className="flex h-12 items-center gap-2 rounded-2xl border border-border bg-card px-4 shadow-card">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("searchAnimals")}
            className="w-full bg-transparent text-base outline-none placeholder:text-muted-foreground"
          />
          {q && (
            <button onClick={() => setQ("")} className="text-muted-foreground">
              <X className="h-4 w-4" />
            </button>
          )}
        </label>

        <div className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4">
          {filters.map((f) => (
            <button
              key={f.k}
              onClick={() => setFilter(f.k)}
              className={cn(
                "press shrink-0 rounded-full px-4 py-2 text-sm font-bold transition-colors",
                filter === f.k
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-card border border-border text-foreground",
              )}
            >
              {f.l}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 space-y-3 px-4">
        {list.length === 0 && (
          <EmptyState
            icon={PawPrint}
            title={t("noAnimals")}
            sub={t("noAnimalsSub")}
            action={
              <button
                onClick={() => setShowAddModal(true)}
                className="press rounded-2xl gradient-fresh px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-cta"
              >
                <Plus className="mr-1.5 inline-block h-4 w-4" /> {t("registerAnimal")}
              </button>
            }
          />
        )}
        {list.map((a, i) => {
          const due = a.vaccinations
            .filter((v) => v.status !== "done" && v.dueDate)
            .sort((x, y) => daysUntil(x.dueDate!) - daysUntil(y.dueDate!))[0];
          const d = due ? daysUntil(due.dueDate!) : null;

          return (
            <Link
              key={a.id}
              to="/animals/$id"
              params={{ id: a.id }}
              className="surface-card press block overflow-hidden animate-fade-up"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="flex gap-3 p-3">
                <img
                  src={a.photo}
                  alt={a.name}
                  className="h-24 w-24 shrink-0 rounded-2xl object-cover"
                  width={96}
                  height={96}
                  loading="lazy"
                />
                <div className="min-w-0 flex-1 py-0.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-lg font-extrabold leading-tight">{a.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {a.id} · {a.breed}
                      </p>
                    </div>
                    <StatusPill
                      status={a.status}
                      label={t(
                        a.status === "healthy"
                          ? "healthy"
                          : a.status === "attention"
                            ? "needAttention"
                            : "underCare",
                      )}
                    />
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {t(a.gender)} · {t("years", { n: a.ageYears })}
                  </p>
                  <p
                    className={cn(
                      "mt-1.5 text-xs font-semibold truncate",
                      d === null
                        ? "text-healthy"
                        : d < 0
                          ? "text-urgent"
                          : d <= 7
                            ? "text-attention"
                            : "text-muted-foreground",
                    )}
                  >
                    {d === null
                      ? t("vaccUpToDate")
                      : d < 0
                        ? `${due!.name}: ${t("vaccOverdue")}`
                        : `${due!.name}: ${t("vaccDueIn", { n: d })}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-border bg-secondary/50 px-4 py-2.5 text-sm font-bold text-primary">
                <span>{t("viewPassport")}</span>
                <ChevronRight className="h-4 w-4" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Register Animal Dialog / Bottom Sheet */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4 backdrop-blur-sm animate-fade-up">
          <div className="w-full max-w-md rounded-t-3xl sm:rounded-3xl border border-border bg-card p-6 shadow-float max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h2 className="text-xl font-extrabold">{t("registerAnimal")}</h2>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="press h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAnimal} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  {t("animalName")} *
                </label>
                <input
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Shyama, Surti, Cheeku"
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    {t("speciesLabel")} *
                  </label>
                  <select
                    value={newSpecies}
                    onChange={(e) => setNewSpecies(e.target.value as Species)}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                  >
                    <option value="cow">{t("cow")}</option>
                    <option value="buffalo">{t("buffalo")}</option>
                    <option value="goat">{t("goat")}</option>
                    <option value="sheep">{t("sheep")}</option>
                    <option value="poultry">{t("poultry")}</option>
                    <option value="other">{t("other")}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    {t("genderLabel")}
                  </label>
                  <select
                    value={newGender}
                    onChange={(e) => setNewGender(e.target.value as "female" | "male")}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                  >
                    <option value="female">{t("female")}</option>
                    <option value="male">{t("male")}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    {t("breedLabel")}
                  </label>
                  <input
                    value={newBreed}
                    onChange={(e) => setNewBreed(e.target.value)}
                    placeholder="e.g. Gir, Murrah, Jamunapari"
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    {t("ageLabel")}
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={25}
                    value={newAge}
                    onChange={(e) => setNewAge(Number(e.target.value))}
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  {t("tagNumberOptional")}
                </label>
                <input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="e.g. KC-00192 (Auto-assigned if empty)"
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  {t("initialHealth")}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewStatus("healthy")}
                    className={cn(
                      "press rounded-xl border-2 py-2 px-3 text-xs font-bold transition-all",
                      newStatus === "healthy"
                        ? "border-healthy bg-healthy-soft text-healthy"
                        : "border-border bg-background",
                    )}
                  >
                    {t("healthy")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewStatus("attention")}
                    className={cn(
                      "press rounded-xl border-2 py-2 px-3 text-xs font-bold transition-all",
                      newStatus === "attention"
                        ? "border-attention bg-attention-soft text-attention"
                        : "border-border bg-background",
                    )}
                  >
                    {t("needAttention")}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <BigButton type="submit" variant="primary" disabled={!newName.trim()}>
                  {t("registerAnimal")}
                </BigButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
