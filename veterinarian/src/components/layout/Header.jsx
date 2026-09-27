import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  Globe, 
  Menu, 
  ShieldCheck, 
  ChevronDown,
  X,
  ArrowUpRight,
  Activity,
  AlertTriangle,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';

export function Header({ setMobileOpen }) {
  const { 
    activePage, 
    vetProfile, 
    notifications, 
    cases, 
    animals, 
    farmers,
    navigateToCase, 
    navigateToAnimal,
    navigateToMapWithFocus 
  } = useApp();
  const { lang, toggleLanguage, t } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showNotifsDropdown, setShowNotifsDropdown] = useState(false);
  const searchRef = useRef(null);
  const notifRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchDropdown(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifsDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered search results
  const searchResults = React.useMemo(() => {
    if (!searchQuery.trim()) return { cases: [], animals: [], farmers: [] };
    const q = searchQuery.toLowerCase();

    const matchedCases = cases.filter(c => 
      c.id.toLowerCase().includes(q) || 
      c.farmerName.toLowerCase().includes(q) || 
      c.district.toLowerCase().includes(q) ||
      c.suspectedDisease.toLowerCase().includes(q)
    ).slice(0, 3);

    const matchedAnimals = animals.filter(a => 
      a.id.toLowerCase().includes(q) || 
      a.name.toLowerCase().includes(q) || 
      a.tagNumber.toLowerCase().includes(q)
    ).slice(0, 3);

    const matchedFarmers = farmers.filter(f => 
      f.name.toLowerCase().includes(q) || 
      f.village.toLowerCase().includes(q) || 
      f.district.toLowerCase().includes(q)
    ).slice(0, 3);

    return { cases: matchedCases, animals: matchedAnimals, farmers: matchedFarmers };
  }, [searchQuery, cases, animals, farmers]);

  const hasResults = searchResults.cases.length > 0 || searchResults.animals.length > 0 || searchResults.farmers.length > 0;

  const getPageHeading = () => {
    switch (activePage) {
      case 'dashboard': return { title: t('dashboard'), subtitle: 'From Early Signals to Timely Action • Clinical Triage' };
      case 'caseQueue': return { title: t('caseQueue'), subtitle: 'AI-Assisted Triage & Case Management' };
      case 'caseDetail': return { title: 'Case Dossier & Tele-Diagnosis', subtitle: 'Clinical Inspection & Prescriptions' };
      case 'animalRecords': return { title: t('animalRecords'), subtitle: 'Electronic Herd Health Dossier & Timelines' };
      case 'followUps': return { title: t('followUps'), subtitle: 'Post-Prescription Monitoring & Resolution' };
      case 'areaAlerts': return { title: t('areaAlerts'), subtitle: 'Epidemiological Clusters & Outbreak Intelligence' };
      case 'diseaseMap': return { title: t('diseaseMap'), subtitle: 'Maharashtra GIS Spatial Outbreak Surveillance' };
      case 'vetProfile': return { title: t('vetProfile'), subtitle: 'Veterinary Officer Credentialing & Jurisdiction' };
      default: return { title: 'Kintsugi Care', subtitle: 'Veterinarian Portal' };
    }
  };

  const heading = getPageHeading();

  return (
    <header className="sticky top-0 z-30 bg-[#fbf9f4]/90 backdrop-blur-md border-b border-stone-200/80 px-4 sm:px-8 py-3 flex items-center justify-between">
      {/* Left: Mobile hamburger & Page Title */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden p-2 rounded-xl text-stone-600 hover:bg-stone-200/60 transition-colors"
          aria-label="Open navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center">
            <img 
              src="/kintsugi_care_icon_transparent.png" 
              alt="Kintsugi Care" 
              className="w-8 h-8 object-contain"
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-extrabold text-stone-900 tracking-tight">
                {heading.title}
              </h1>
              <span className="hidden sm:inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#216d53]/10 text-[#216d53] border border-[#216d53]/20">
                Kintsugi Care
              </span>
            </div>
            <p className="text-xs text-stone-500 font-medium hidden md:block">
              {heading.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Right: Search, SIH 2026 Logo, Notifications, Language Toggle, Vet Status */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Global Search Bar */}
        <div ref={searchRef} className="relative hidden md:block w-56 lg:w-72">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchDropdown(true);
              }}
              onFocus={() => setShowSearchDropdown(true)}
              placeholder={t('searchPlaceholder')}
              className="w-full pl-9 pr-8 py-2 text-xs bg-white border border-stone-200 rounded-xl placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#216d53]/30 focus:border-[#216d53] shadow-2xs transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Search Dropdown Results */}
          {showSearchDropdown && searchQuery.trim().length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-stone-200 p-2 z-50 animate-in fade-in zoom-in-95">
              {!hasResults ? (
                <div className="p-4 text-center text-xs text-stone-500">
                  No records matching "{searchQuery}"
                </div>
              ) : (
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {/* Cases */}
                  {searchResults.cases.length > 0 && (
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400 px-2 py-1">
                        Cases
                      </div>
                      {searchResults.cases.map(c => (
                        <div
                          key={c.id}
                          onClick={() => {
                            navigateToCase(c.id);
                            setShowSearchDropdown(false);
                            setSearchQuery('');
                          }}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-stone-50 cursor-pointer text-xs transition-colors"
                        >
                          <div>
                            <div className="font-bold text-stone-900">{c.id} • {c.animalName}</div>
                            <div className="text-[11px] text-stone-500">{c.suspectedDisease} ({c.district})</div>
                          </div>
                          <ArrowUpRight className="w-3.5 h-3.5 text-stone-400" />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Animals */}
                  {searchResults.animals.length > 0 && (
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400 px-2 py-1">
                        Animals
                      </div>
                      {searchResults.animals.map(a => (
                        <div
                          key={a.id}
                          onClick={() => {
                            navigateToAnimal(a.id);
                            setShowSearchDropdown(false);
                            setSearchQuery('');
                          }}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-stone-50 cursor-pointer text-xs transition-colors"
                        >
                          <div>
                            <div className="font-bold text-stone-900">{a.name} ({a.species})</div>
                            <div className="text-[11px] text-stone-500">Tag: {a.tagNumber} • {a.ownerName}</div>
                          </div>
                          <ArrowUpRight className="w-3.5 h-3.5 text-stone-400" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* SIH 2026 Official Logo Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white border border-stone-200/90 shadow-2xs">
          <img 
            src="/sih_2026_logo_transparent.png" 
            alt="Smart India Hackathon 2026" 
            className="h-6 object-contain"
          />
        </div>

        {/* Language Toggle: EN / हिंदी */}
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-stone-200/90 text-xs font-bold text-stone-700 hover:text-[#216d53] hover:border-[#216d53]/40 shadow-2xs transition-all"
          title="Toggle Language"
        >
          <Globe className="w-3.5 h-3.5 text-[#216d53]" />
          <span>{lang === 'en' ? 'हिंदी' : 'English'}</span>
        </button>

        {/* Notifications Dropdown */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setShowNotifsDropdown(!showNotifsDropdown)}
            className="relative p-2 rounded-xl bg-white border border-stone-200/90 text-stone-600 hover:text-stone-900 hover:border-stone-300 shadow-2xs transition-all"
            aria-label="Surveillance alerts"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
          </button>

          {showNotifsDropdown && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-stone-200 p-4 z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-stone-900">Surveillance Bulletins</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-100 text-red-700">
                    {notifications.length} New
                  </span>
                </div>
                <span className="text-[11px] text-stone-400">Maharashtra Hub</span>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto">
                {notifications.map(n => (
                  <div 
                    key={n.id}
                    className="p-2.5 rounded-xl hover:bg-[#fbf9f4] border border-stone-100 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-xs font-bold text-stone-800">{n.title}</div>
                      <span className="text-[10px] text-stone-400 shrink-0">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-stone-600 mt-1 leading-snug">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Veterinarian Status Pill */}
        <div className="hidden sm:flex items-center gap-2.5 pl-2 border-l border-stone-200">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <div className="text-right leading-none">
            <div className="text-xs font-bold text-stone-900">{vetProfile.name}</div>
            <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">Surveillance Active</div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
