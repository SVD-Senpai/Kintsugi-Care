import React from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { StatusBadge } from '../common/StatusBadge';
import { 
  AlertOctagon, 
  Radio, 
  MapPin, 
  Users, 
  Calendar, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowUpRight, 
  Activity, 
  Share2,
  FileCheck
} from 'lucide-react';

export function AreaAlerts() {
  const { alerts, acknowledgeAlert, navigateToMapWithFocus, setActivePage } = useApp();
  const { t } = useLanguage();

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-extrabold text-stone-900 tracking-tight">
              Maharashtra Area Disease Surveillance Alerts
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200">
              Active Outbreak Surveillance
            </span>
          </div>
          <p className="text-xs text-stone-500 font-medium">
            Epidemiological cluster advisories and containment zones issued by Animal Husbandry Department
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActivePage('diseaseMap')}
            className="px-3.5 py-2 rounded-xl bg-[#216d53] text-white hover:bg-[#164e3b] font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Open Surveillance GIS</span>
          </button>
        </div>
      </div>

      {/* Alert Cards Stream */}
      <div className="space-y-4">
        {alerts.map((alert) => {
          const isHigh = alert.riskSeverity === 'high';
          const isMedium = alert.riskSeverity === 'medium';

          return (
            <div
              key={alert.id}
              className={`rounded-2xl border bg-white p-5 sm:p-6 transition-all shadow-2xs ${
                isHigh 
                  ? 'border-red-300 ring-2 ring-red-500/10' 
                  : isMedium 
                  ? 'border-amber-300' 
                  : 'border-stone-200/90'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                {/* Left side: Disease, District, Status */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-extrabold tracking-wide uppercase ${
                      isHigh 
                        ? 'bg-red-100 text-red-800 border border-red-300' 
                        : isMedium
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${isHigh ? 'bg-red-600 animate-ping' : isMedium ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                      {alert.riskLevel}
                    </span>

                    <span className="text-xs font-bold text-stone-500 bg-stone-100 px-2.5 py-0.5 rounded-full border border-stone-200">
                      ID: {alert.id}
                    </span>

                    <span className="text-xs font-semibold text-stone-600">
                      {alert.alertStatus}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-extrabold text-stone-900 tracking-tight">
                      {alert.disease} — {alert.district} District
                    </h3>
                    <p className="text-xs text-stone-500 font-medium mt-0.5">
                      Affected Talukas: <span className="font-semibold text-stone-800">{alert.talukas?.join(', ')}</span> • Buffer Radius: {alert.radiusKm} km
                    </p>
                  </div>

                  {/* Epidemiological stats bar */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 text-xs">
                    <div className="p-2.5 rounded-xl bg-[#fbf9f4] border border-stone-200/60">
                      <div className="text-[10px] uppercase font-bold text-stone-400">Active Cases</div>
                      <div className="text-base font-extrabold text-stone-900">{alert.activeCases}</div>
                      <div className="text-[10px] text-red-600 font-medium">{alert.trend}</div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#fbf9f4] border border-stone-200/60">
                      <div className="text-[10px] uppercase font-bold text-stone-400">Livestock at Risk</div>
                      <div className="text-base font-extrabold text-stone-900">{alert.affectedAnimals}</div>
                      <div className="text-[10px] text-stone-500">In direct cluster</div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#fbf9f4] border border-stone-200/60">
                      <div className="text-[10px] uppercase font-bold text-stone-400">First Detected</div>
                      <div className="text-xs font-bold text-stone-800 mt-1">{alert.firstDetected}</div>
                      <div className="text-[10px] text-stone-400">RDDL Sentinel</div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#fbf9f4] border border-stone-200/60">
                      <div className="text-[10px] uppercase font-bold text-stone-400">Last Synced</div>
                      <div className="text-xs font-bold text-stone-800 mt-1">{alert.lastUpdated}</div>
                      <div className="text-[10px] text-stone-400">Real-time update</div>
                    </div>
                  </div>

                  {/* Containment Protocol Advisory */}
                  <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs">
                    <span className="font-bold text-stone-800 block mb-1">
                      Containment Protocol & Mandatory Veterinary Directives:
                    </span>
                    <p className="text-stone-700 leading-relaxed font-medium">
                      {alert.recommendedAction}
                    </p>
                    <div className="text-[10px] text-stone-500 font-medium mt-1">
                      <span className="font-bold text-stone-700">Vector mode:</span> {alert.transmissionVector}
                    </div>
                  </div>
                </div>

                {/* Right side: Actions */}
                <div className="flex flex-row md:flex-col gap-2 shrink-0 justify-end">
                  {alert.acknowledged ? (
                    <div className="px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-xs flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Acknowledged</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => acknowledgeAlert(alert.id)}
                      className="px-3.5 py-2 rounded-xl bg-stone-900 text-white hover:bg-stone-800 font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <FileCheck className="w-3.5 h-3.5" />
                      <span>{t('acknowledgeAlert')}</span>
                    </button>
                  )}

                  <button
                    onClick={() => navigateToMapWithFocus(alert.district, alert.disease)}
                    className="px-3.5 py-2 rounded-xl bg-[#216d53] text-white hover:bg-[#164e3b] font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>{t('viewOnMap')}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setActivePage('caseQueue')}
                    className="px-3.5 py-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>{t('viewRelatedCases')}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AreaAlerts;
