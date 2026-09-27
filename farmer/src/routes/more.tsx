import { Link, createFileRoute } from "@tanstack/react-router";
import {
  Bell,
  ChevronRight,
  ClipboardList,
  CloudOff,
  Edit3,
  FolderClock,
  HeartPulse,
  Languages,
  RefreshCw,
  ShieldCheck,
  Stethoscope,
  Syringe,
  User,
  X,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Card, PageHeader, Section } from "@/components/app/ui";
import { LangToggle } from "@/components/app/LangToggle";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/more")({
  head: () => ({
    meta: [
      { title: "More — Kintsugi Care" },
      {
        name: "description",
        content:
          "First aid, vet help, vaccinations, daily checklist, pending reports, language and offline settings.",
      },
      { property: "og:title", content: "More — Kintsugi Care" },
      { property: "og:description", content: "All tools for protecting your herd in one place." },
    ],
  }),
  component: MorePage,
});

type To =
  "/first-aid" | "/vet-help" | "/vaccinations" | "/checklist" | "/alerts" | "/pending" | "/animals";

function Row({
  to,
  icon: Icon,
  label,
  sub,
  badge,
}: {
  to: To;
  icon: LucideIcon;
  label: string;
  sub?: string;
  badge?: number;
}) {
  return (
    <Link to={to} className="press flex items-center gap-3 px-4 py-3.5">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-bold">{label}</span>
        {sub && <span className="block text-xs text-muted-foreground">{sub}</span>}
      </span>
      {badge ? (
        <span className="rounded-full bg-attention px-2 py-0.5 text-xs font-bold text-attention-foreground">
          {badge}
        </span>
      ) : null}
      <ChevronRight className="h-5 w-5 text-muted-foreground" />
    </Link>
  );
}

function MorePage() {
  const {
    t,
    lang,
    simulateOffline,
    setSimulateOffline,
    pendingCount,
    syncNow,
    syncing,
    online,
    hydrated,
    profile,
    updateProfile,
    animals,
  } = useApp();

  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editName, setEditName] = useState(profile.name);
  const [editNameHi, setEditNameHi] = useState(profile.nameHi || "");
  const [editPhone, setEditPhone] = useState(profile.phone || "");
  const [editVillage, setEditVillage] = useState(profile.village);
  const [editVillageHi, setEditVillageHi] = useState(profile.villageHi || "");
  const [editDistrict, setEditDistrict] = useState(profile.district);

  const handleOpenEdit = () => {
    setEditName(profile.name);
    setEditNameHi(profile.nameHi || "");
    setEditPhone(profile.phone || "");
    setEditVillage(profile.village);
    setEditVillageHi(profile.villageHi || "");
    setEditDistrict(profile.district);
    setShowEditProfile(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;

    updateProfile({
      name: editName.trim(),
      nameHi: editNameHi.trim() || undefined,
      phone: editPhone.trim(),
      village: editVillage.trim(),
      villageHi: editVillageHi.trim() || undefined,
      district: editDistrict.trim(),
    });

    toast.success(t("profileUpdated"));
    setShowEditProfile(false);
  };

  const displayName = lang === "hi" ? profile.nameHi || profile.name : profile.name;
  const displayVillage = lang === "hi" ? profile.villageHi || profile.village : profile.village;

  return (
    <div className="pb-8">
      <PageHeader title={t("more")} back={false} />
      <Section>
        <Card className="flex items-center gap-3">
          <span className="flex h-14 w-14 items-center justify-center rounded-full gradient-fresh text-xl font-extrabold text-primary-foreground">
            <User className="h-7 w-7" />
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-lg font-extrabold truncate">{displayName}</p>
              <button
                type="button"
                onClick={handleOpenEdit}
                className="flex items-center gap-1 text-xs font-bold text-primary bg-primary-soft hover:bg-primary-soft/80 px-2.5 py-1 rounded-lg transition-colors"
                title={t("editProfile")}
              >
                <Edit3 className="h-3.5 w-3.5" />
                {t("editProfile")}
              </button>
            </div>
            <p className="text-sm text-muted-foreground truncate">
              {t("village")}: {displayVillage}, {profile.district} · {animals.length} {t("animals")}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">{profile.phone}</p>
          </div>
        </Card>
      </Section>
      <Section title={t("protectMyHerd")}>
        <Card className="divide-y divide-border p-0">
          <Row to="/first-aid" icon={HeartPulse} label={t("firstAid")} sub={t("firstAidSub")} />
          <Row to="/vet-help" icon={Stethoscope} label={t("vetHelp")} />
          <Row to="/vaccinations" icon={Syringe} label={t("vaccinations")} />
          <Row
            to="/checklist"
            icon={ClipboardList}
            label={t("checklist")}
            sub={t("dailyPrevention")}
          />
          <Row to="/alerts" icon={Bell} label={t("areaAlerts")} />
          <Row
            to="/pending"
            icon={FolderClock}
            label={t("pendingReports")}
            badge={hydrated ? pendingCount : 0}
          />
        </Card>
      </Section>
      <Section title={t("language")}>
        <Card className="flex items-center justify-between">
          <span className="flex items-center gap-3 font-bold">
            <Languages className="h-5 w-5 text-primary" />
            {t("language")}
          </span>
          <LangToggle />
        </Card>
      </Section>
      <Section title={t("demoTools")}>
        <Card className="space-y-4">
          <div className="flex items-center gap-3">
            <CloudOff className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="font-bold">{t("simulateOffline")}</p>
              <p className="text-xs text-muted-foreground">{t("simulateOfflineSub")}</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={simulateOffline}
              onClick={() => setSimulateOffline(!simulateOffline)}
              className={cn(
                "relative h-7 w-12 rounded-full transition-colors",
                simulateOffline ? "bg-attention" : "bg-border",
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 h-6 w-6 rounded-full bg-card shadow transition-transform",
                  simulateOffline ? "translate-x-5.5 left-0" : "left-0.5",
                )}
              />
            </button>
          </div>
          <button
            type="button"
            onClick={() => void syncNow()}
            disabled={!online || syncing || pendingCount === 0}
            className="press flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-secondary font-bold disabled:opacity-50"
          >
            <RefreshCw className={cn("h-4 w-4", syncing && "animate-spin")} />
            {t("syncNow")} {pendingCount ? `(${pendingCount})` : ""}
          </button>
        </Card>
      </Section>
      <p className="mt-6 flex items-center justify-center gap-1 text-xs text-muted-foreground">
        <ShieldCheck className="h-3.5 w-3.5" />
        {t("appName")} · {t("tagline")}
      </p>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl bg-card p-6 shadow-xl border border-border space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-lg font-extrabold flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                {t("editProfile")}
              </h2>
              <button
                type="button"
                onClick={() => setShowEditProfile(false)}
                className="rounded-full p-1 text-muted-foreground hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-muted-foreground block mb-1">
                  Full Name (English) *
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm font-medium focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground block mb-1">
                  Name in Hindi (हिंदी नाम)
                </label>
                <input
                  type="text"
                  value={editNameHi}
                  onChange={(e) => setEditNameHi(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm font-medium focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground block mb-1">
                  {t("phoneNumber")} *
                </label>
                <input
                  type="tel"
                  required
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm font-medium focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-muted-foreground block mb-1">
                    {t("village")} *
                  </label>
                  <input
                    type="text"
                    required
                    value={editVillage}
                    onChange={(e) => setEditVillage(e.target.value)}
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm font-medium focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground block mb-1">
                    {t("district")} *
                  </label>
                  <input
                    type="text"
                    required
                    value={editDistrict}
                    onChange={(e) => setEditDistrict(e.target.value)}
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm font-medium focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowEditProfile(false)}
                  className="flex-1 rounded-xl border border-input bg-background py-2.5 text-sm font-bold hover:bg-muted"
                >
                  {t("cancel")}
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-bold text-primary-foreground shadow hover:bg-primary/90"
                >
                  {t("save")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
