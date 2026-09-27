import React from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { MaharashtraMap } from '../map/MaharashtraMap';
import { StatusBadge } from '../common/StatusBadge';
import { 
  Activity, 
  AlertTriangle, 
  Clock, 
  Radio, 
  ArrowUpRight, 
  ShieldAlert, 
  MapPin, 
  CheckCircle2, 
  ChevronRight, 
  Send,
  Eye
} from 'lucide-react';

export function Dashboard() {
  const { 
    kpiStats, 
    cases, 
    alerts, 
    navigateToCase, 
    navigateToMapWithFocus, 
    setActivePage 
  } = useApp();
  const { t } = useLanguage();

  // Top high-priority alert for banner
  const topAlert = alerts.find(a => a.riskSeverity === 'high') || alerts[0];

  // Top 4 urgent/active cases for triage preview
  const urgentCases = cases
    .filter(c => c.status !== 'Resolved')
    .slice(0, 4);

  return (
    <div className="space-y-6 pb-12">
      {/* Kintsugi Care Platform Ribbon (from SIH 2026 Presentation) */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#eaf3ee] p-2 flex items-center justify-center shrink-0 border border-[#216d53]/20">
            <img 
              src="/kintsugi_care_icon_transparent.png" 
              alt="Kintsugi Care" 
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-stone-900 tracking-tight">
                Kintsugi Care
              </h2>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#216d53]/10 text-[#216d53] border border-[#216d53]/20">
                Veterinarian Surveillance
              </span>
            </div>
            <p className="text-xs text-stone-600 font-semibold mt-0.5">
              From Early Signals to Timely Action
            </p>
            <p className="text-[11px] text-stone-400 font-medium">
              An Integrated AI-powered Livestock Health Intelligence & Response Platform
            </p>
          </div>
        </div>

        {/* 5-step chain badges from slide: DETECT -> ASSESS -> PREDICT -> RESPOND -> LEARN */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200 whitespace-nowrap">
            1. DETECT
          </span>
          <span className="text-stone-300 font-bold">→</span>
          <span className="px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 text-[10px] font-bold border border-teal-200 whitespace-nowrap">
            2. ASSESS
          </span>
          <span className="text-stone-300 font-bold">→</span>
          <span className="px-2.5 py-1 rounded-lg bg-sky-50 text-sky-800 text-[10px] font-bold border border-sky-200 whitespace-nowrap">
            3. PREDICT
          </span>
          <span className="text-stone-300 font-bold">→</span>
          <span className="px-2.5 py-1 rounded-lg bg-[#216d53] text-white text-[10px] font-bold shadow-xs whitespace-nowrap">
            4. RESPOND
          </span>
          <span className="text-stone-300 font-bold">→</span>
          <span className="px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700 text-[10px] font-bold border border-stone-200 whitespace-nowrap">
            5. LEARN
          </span>
        </div>
      </div>

      {/* 1. TOP KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Cases */}
        <div 
          onClick={() => setActivePage('caseQueue')}
          className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
              {t('activeCasesLabel')}
            </span>
            <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-stone-900">{kpiStats.activeCases}</span>
            <span className="text-xs font-semibold text-red-600 flex items-center">
              +3 today
            </span>
          </div>
          <div className="text-[11px] text-stone-500 mt-1 flex items-center justify-between">
            <span>Requiring clinical intake</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-stone-600" />
          </div>
        </div>

        {/* High Priority Cases */}
        <div 
          onClick={() => setActivePage('caseQueue')}
          className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
              {t('highPriorityLabel')}
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-stone-900">{kpiStats.highPriorityCases}</span>
            <span className="text-xs font-semibold text-amber-600">Urgent Tele-Triage</span>
          </div>
          <div className="text-[11px] text-stone-500 mt-1 flex items-center justify-between">
            <span>Severe morbidity signs</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-stone-600" />
          </div>
        </div>

        {/* Pending Follow-ups */}
        <div 
          onClick={() => setActivePage('followUps')}
          className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
              {t('pendingFollowUpsLabel')}
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-stone-900">{kpiStats.pendingFollowUps}</span>
            <span className="text-xs font-semibold text-blue-600">Due within 48h</span>
          </div>
          <div className="text-[11px] text-stone-500 mt-1 flex items-center justify-between">
            <span>Post-treatment monitor</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-stone-600" />
          </div>
        </div>

        {/* Area Alerts */}
        <div 
          onClick={() => setActivePage('areaAlerts')}
          className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
              {t('areaAlertsLabel')}
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Radio className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-stone-900">{kpiStats.areaAlerts}</span>
            <span className="text-xs font-semibold text-red-600 animate-pulse">
              {kpiStats.unacknowledgedAlerts} Unacknowledged
            </span>
          </div>
          <div className="text-[11px] text-stone-500 mt-1 flex items-center justify-between">
            <span>Active surveillance clusters</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-stone-600" />
          </div>
        </div>
      </div>

      {/* 2. ACTIVE DISEASE ALERT SECTION (VISUALLY PROMINENT) */}
      {topAlert && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-700 text-white p-5 sm:p-6 shadow-xl border border-red-400/50 animate-in fade-in">
          {/* Subtle radar background graphic */}
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-15 pointer-events-none flex items-center justify-center">
            <div className="w-64 h-64 rounded-full border-4 border-white animate-ping" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-extrabold tracking-wide uppercase border border-white/30">
                  <span className="w-2 h-2 rounded-full bg-yellow-300 animate-ping" />
                  {t('activeAlertHeader')}
                </span>
                <span className="text-xs font-bold text-white/90">
                  {topAlert.alertStatus}
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight">
                  {topAlert.disease} Cluster — {topAlert.district} District
                </h3>
                <p className="text-xs sm:text-sm text-white/90 max-w-2xl font-medium mt-1 leading-relaxed">
                  {t('activeAlertDesc')} ({topAlert.talukas?.join(', ')} talukas). High vector activity detected.
                </p>
              </div>

              {/* Stat Chips */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs">
                <div className="px-2.5 py-1 rounded-lg bg-black/20 backdrop-blur-xs font-semibold">
                  Cases: <span className="font-bold">{topAlert.activeCases} Active</span>
                </div>
                <div className="px-2.5 py-1 rounded-lg bg-black/20 backdrop-blur-xs font-semibold">
                  At Risk: <span className="font-bold">{topAlert.affectedAnimals} Livestock</span>
                </div>
                <div className="px-2.5 py-1 rounded-lg bg-black/20 backdrop-blur-xs font-semibold">
                  Risk Level: <span className="font-bold text-yellow-300">{topAlert.riskLevel}</span>
                </div>
                <div className="text-[11px] text-white/70">
                  Updated: {topAlert.lastUpdated}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex sm:flex-col gap-2 shrink-0">
              <button
                onClick={() => navigateToMapWithFocus(topAlert.district, topAlert.disease)}
                className="px-4 py-2.5 rounded-xl bg-white text-red-700 hover:bg-stone-50 font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-98"
              >
                <span>{t('viewOnMap')}</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActivePage('areaAlerts')}
                className="px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs backdrop-blur-xs border border-white/30 transition-all flex items-center justify-center gap-1.5"
              >
                <span>View Full Advisory</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. MAHARASHTRA DISEASE MAP PREVIEW (LARGE & VISUALLY IMPORTANT) */}
      <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-stone-100">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-extrabold text-stone-900 tracking-tight">
                {t('mapTitle')}
              </h3>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#216d53]/10 text-[#216d53] border border-[#216d53]/20">
                Live GIS Feed
              </span>
            </div>
            <p className="text-xs text-stone-500 font-medium">
              Spatial surveillance showing animated high-risk cluster waves across 35 Maharashtra districts
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActivePage('diseaseMap')}
              className="px-3.5 py-1.5 rounded-xl bg-[#216d53] text-white hover:bg-[#164e3b] font-bold text-xs shadow-xs transition-all flex items-center gap-1.5"
            >
              <span>Full Screen GIS Console</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Embedded Maharashtra GIS Map */}
        <MaharashtraMap 
          height="460px" 
          compact={false}
          onSelectAlert={(alert) => {
            console.log('Selected alert on map preview:', alert);
          }}
        />

        {/* Map Context Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
          <div className="p-3 rounded-xl bg-[#fbf9f4] border border-stone-200/60">
            <div className="text-[10px] uppercase font-bold text-stone-400">Total Hotspots</div>
            <div className="text-lg font-black text-stone-800">
              {alerts.filter(a => a.riskSeverity === 'high').length} Districts
            </div>
            <div className="text-[10px] text-red-600 font-medium">Pune, Kolhapur, Ahmednagar</div>
          </div>

          <div className="p-3 rounded-xl bg-[#fbf9f4] border border-stone-200/60">
            <div className="text-[10px] uppercase font-bold text-stone-400">Primary Vector Path</div>
            <div className="text-lg font-black text-stone-800">Western Basin</div>
            <div className="text-[10px] text-stone-500 font-medium">Riverine & canal tracts</div>
          </div>

          <div className="p-3 rounded-xl bg-[#fbf9f4] border border-stone-200/60">
            <div className="text-[10px] uppercase font-bold text-stone-400">Herd Exposure Index</div>
            <div className="text-lg font-black text-stone-800">625 Cattle</div>
            <div className="text-[10px] text-amber-600 font-medium">Within 25km buffer zones</div>
          </div>

          <div className="p-3 rounded-xl bg-[#fbf9f4] border border-stone-200/60">
            <div className="text-[10px] uppercase font-bold text-stone-400">Surveillance Status</div>
            <div className="text-lg font-black text-stone-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Active Sentinel</span>
            </div>
            <div className="text-[10px] text-stone-500 font-medium">AHD RDDL Pune Link</div>
          </div>
        </div>
      </div>

      {/* 4. RECENT INTAKE & TRIAGE QUEUE */}
      <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-stone-100">
          <div>
            <h3 className="text-base font-extrabold text-stone-900 tracking-tight">
              Urgent Clinical Triage Queue
            </h3>
            <p className="text-xs text-stone-500 font-medium">
              Recent livestock disease reports awaiting veterinary inspection & prescription
            </p>
          </div>

          <button
            onClick={() => setActivePage('caseQueue')}
            className="text-xs font-bold text-[#216d53] hover:text-[#164e3b] flex items-center gap-1"
          >
            <span>View All ({cases.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-100 text-stone-400 uppercase font-bold text-[10px] tracking-wider">
                <th className="pb-3 px-3">Case ID</th>
                <th className="pb-3 px-3">Animal</th>
                <th className="pb-3 px-3">Farmer / Village</th>
                <th className="pb-3 px-3">Suspected Disease</th>
                <th className="pb-3 px-3">Priority</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {urgentCases.map((c) => (
                <tr key={c.id} className="hover:bg-stone-50/70 transition-colors group">
                  <td className="py-3 px-3 font-extrabold text-stone-900">
                    {c.id}
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-stone-800">{c.animalName}</div>
                    <div className="text-[11px] text-stone-500">{c.species} • {c.breed}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-stone-800">{c.farmerName}</div>
                    <div className="text-[11px] text-stone-500">{c.village}, {c.district}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-stone-900">{c.suspectedDisease}</div>
                    <div className="text-[10px] text-stone-500">Temp: {c.temperature}</div>
                  </td>
                  <td className="py-3 px-3">
                    <StatusBadge status={c.priority} />
                  </td>
                  <td className="py-3 px-3">
                    <StatusBadge status={c.status} />
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => navigateToCase(c.id)}
                      className="px-3 py-1.5 rounded-lg bg-[#216d53] text-white hover:bg-[#164e3b] font-bold text-xs transition-colors shadow-2xs"
                    >
                      {t('reviewCase')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
