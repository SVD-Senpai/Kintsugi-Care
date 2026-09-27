import React from 'react';
import { 
  LayoutDashboard, 
  ClipboardList, 
  FolderHeart, 
  Stethoscope, 
  AlertOctagon, 
  Map as MapIcon, 
  UserCheck, 
  LogOut, 
  ShieldAlert,
  ChevronRight,
  Menu,
  X,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';

export function Sidebar({ mobileOpen, setMobileOpen }) {
  const { activePage, setActivePage, kpiStats, vetProfile, logout } = useApp();
  const { t } = useLanguage();

  const navItems = [
    { id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { id: 'caseQueue', label: t('caseQueue'), icon: ClipboardList, badge: kpiStats.activeCases, badgeColor: 'bg-red-500 text-white' },
    { id: 'animalRecords', label: t('animalRecords'), icon: FolderHeart },
    { id: 'followUps', label: t('followUps'), icon: Stethoscope, badge: kpiStats.pendingFollowUps, badgeColor: 'bg-amber-500 text-white' },
    { id: 'areaAlerts', label: t('areaAlerts'), icon: AlertOctagon, badge: kpiStats.unacknowledgedAlerts > 0 ? kpiStats.unacknowledgedAlerts : null, badgeColor: 'bg-red-600 text-white animate-pulse' },
    { id: 'diseaseMap', label: t('diseaseMap'), icon: MapIcon, highlight: true },
    { id: 'vetProfile', label: t('vetProfile'), icon: UserCheck },
  ];

  const handleNavClick = (id) => {
    setActivePage(id);
    if (setMobileOpen) setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#fbf9f4] border-r border-stone-200/90 flex flex-col justify-between
        transition-transform duration-300 ease-in-out lg:translate-x-0
        ${mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
      `}>
        {/* Top: Branding */}
        <div>
          <div className="p-4 sm:p-5 border-b border-stone-200/70 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Copied Kintsugi Care Logo Icon */}
              <div className="w-11 h-11 rounded-2xl bg-white p-1.5 border border-stone-200/80 shadow-xs flex items-center justify-center shrink-0">
                <img 
                  src="/kintsugi_care_icon_transparent.png" 
                  alt="Kintsugi Care Logo" 
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-[#1c2e26] text-lg tracking-tight">Kintsugi Care</span>
                  <span className="text-[9px] uppercase font-extrabold tracking-wider px-1.5 py-0.5 rounded-md bg-[#216d53]/10 text-[#216d53] border border-[#216d53]/20">
                    VET
                  </span>
                </div>
                <div className="text-[10px] text-stone-500 font-semibold tracking-tight truncate">
                  Healthy Animals • Stronger Communities
                </div>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button 
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/60"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Platform Pillars Badge (From SIH 2026 Slide) */}
          <div className="mx-4 mt-3 p-2.5 rounded-xl bg-white border border-stone-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9px] uppercase font-extrabold tracking-wider text-[#216d53] flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" />
                SIH 2026 Platform
              </span>
              <span className="text-[9px] font-bold text-stone-400">Maharashtra</span>
            </div>
            <div className="text-[11px] font-bold text-stone-800 leading-tight">
              From Early Signals to Timely Action
            </div>
            <div className="text-[10px] text-stone-500 mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Farmers • Vets • Government</span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`
                    w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all
                    ${isActive 
                      ? 'bg-[#216d53] text-white shadow-sm shadow-[#216d53]/25 font-bold' 
                      : 'text-stone-600 hover:bg-white hover:text-stone-900 hover:shadow-xs'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-stone-500'}`} />
                    <span>{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {item.badge !== undefined && item.badge !== null && (
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    )}
                    {isActive && (
                      <ChevronRight className="w-4 h-4 text-white/70" />
                    )}
                  </div>
                </button>
              );
            })}
          </nav>

          {/* 5-step response chain indicator */}
          <div className="mx-4 px-3 py-2 rounded-xl bg-stone-100/70 border border-stone-200/60 text-[10px] text-stone-500 font-bold uppercase tracking-wider text-center">
            Detect • Assess • Predict • Respond • Learn
          </div>
        </div>

        {/* Bottom Section: Veterinarian Card & Logout */}
        <div className="p-4 border-t border-stone-200/80 bg-white/70">
          <div 
            onClick={() => handleNavClick('vetProfile')}
            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white transition-all cursor-pointer border border-transparent hover:border-stone-200/80 group"
          >
            <div className="relative">
              <img 
                src={vetProfile.avatar} 
                alt={vetProfile.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-[#216d53]/30" 
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-stone-900 truncate group-hover:text-[#216d53] transition-colors">
                {vetProfile.name}
              </div>
              <div className="text-[10px] text-stone-500 truncate">
                {vetProfile.title}
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            className="mt-2.5 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-stone-500 hover:text-red-700 hover:bg-red-50 transition-colors border border-stone-200/60"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t('logout')}</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
