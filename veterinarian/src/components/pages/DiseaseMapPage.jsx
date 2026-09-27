import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { MaharashtraMap } from '../map/MaharashtraMap';
import { 
  Radio, 
  Search, 
  Filter, 
  AlertTriangle, 
  Layers, 
  Activity, 
  ShieldAlert, 
  ChevronDown,
  RotateCcw
} from 'lucide-react';

export function DiseaseMapPage() {
  const { alerts, cases, focusedDistrict, setFocusedDistrict, setActivePage } = useApp();
  const { t } = useLanguage();

  const [diseaseFilter, setDiseaseFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [districtQuery, setDistrictQuery] = useState('');

  // Summary Metrics
  const summaryMetrics = useMemo(() => {
    const highRiskAlerts = alerts.filter(a => a.riskSeverity === 'high');
    const totalClusterCases = alerts.reduce((acc, a) => acc + (a.activeCases || 0), 0);

    // Most reported disease
    const diseaseCounts = {};
    alerts.forEach(a => {
      diseaseCounts[a.disease] = (diseaseCounts[a.disease] || 0) + (a.activeCases || 0);
    });
    let topDisease = 'Lumpy Skin Disease';
    let topCount = 0;
    Object.entries(diseaseCounts).forEach(([dis, count]) => {
      if (count > topCount) {
        topDisease = dis;
        topCount = count;
      }
    });

    return {
      activeAlertsCount: alerts.length,
      highRiskCount: highRiskAlerts.length,
      totalCases: totalClusterCases,
      topDisease
    };
  }, [alerts]);

  const handleDistrictSearch = (e) => {
    e.preventDefault();
    if (districtQuery.trim()) {
      setFocusedDistrict(districtQuery.trim());
    }
  };

  const handleResetFilters = () => {
    setDiseaseFilter('all');
    setRiskFilter('all');
    setDistrictQuery('');
    setFocusedDistrict(null);
  };

  return (
    <div className="space-y-5 pb-12">
      {/* 1. TOP ANALYTICS SUMMARY PANEL */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-2xs">
          <div className="text-[10px] uppercase font-bold text-stone-400">Active Disease Clusters</div>
          <div className="text-2xl font-black text-stone-900 mt-0.5">{summaryMetrics.activeAlertsCount} Outbreaks</div>
          <div className="text-[11px] text-stone-500 font-medium">Surveillance active across MH</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-2xs">
          <div className="text-[10px] uppercase font-bold text-stone-400">High Risk Hotspots</div>
          <div className="text-2xl font-black text-red-600 mt-0.5">{summaryMetrics.highRiskCount} Districts</div>
          <div className="text-[11px] text-red-500 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping" />
            <span>Radar alert wave active</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-2xs">
          <div className="text-[10px] uppercase font-bold text-stone-400">Cluster Morbidity</div>
          <div className="text-2xl font-black text-stone-900 mt-0.5">{summaryMetrics.totalCases} Animals</div>
          <div className="text-[11px] text-stone-500 font-medium">Recorded in active zones</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-2xs">
          <div className="text-[10px] uppercase font-bold text-stone-400">Predominant Vector Disease</div>
          <div className="text-sm font-extrabold text-[#216d53] mt-1 truncate">{summaryMetrics.topDisease}</div>
          <div className="text-[11px] text-stone-500 font-medium">Capripoxvirus cluster</div>
        </div>
      </div>

      {/* 2. FILTER & DISTRICT SEARCH CONTROL BAR */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Disease Filter */}
          <div className="relative">
            <select
              value={diseaseFilter}
              onChange={(e) => setDiseaseFilter(e.target.value)}
              className="px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#216d53]/30 font-bold text-stone-800 appearance-none pr-8 cursor-pointer"
            >
              <option value="all">All Diseases</option>
              <option value="Lumpy Skin">Lumpy Skin Disease (LSD)</option>
              <option value="Foot-and-Mouth">Foot-and-Mouth Disease (FMD)</option>
              <option value="Haemorrhagic">Haemorrhagic Septicaemia (HS)</option>
              <option value="Black Quarter">Black Quarter (BQ)</option>
              <option value="Peste">PPR (Goat Plague)</option>
              <option value="Anthrax">Anthrax (Sentinel)</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Risk Filter */}
          <div className="relative">
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#216d53]/30 font-bold text-stone-800 appearance-none pr-8 cursor-pointer"
            >
              <option value="all">All Risk Levels</option>
              <option value="high">High Risk Only</option>
              <option value="medium">Medium Risk</option>
              <option value="low">Low Risk</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {(diseaseFilter !== 'all' || riskFilter !== 'all' || focusedDistrict) && (
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-[#216d53] hover:text-[#164e3b] rounded-xl bg-[#eaf3ee]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Map</span>
            </button>
          )}
        </div>

        {/* District Quick Search Form */}
        <form onSubmit={handleDistrictSearch} className="flex items-center gap-2">
          <div className="relative w-52 sm:w-64">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={districtQuery}
              onChange={(e) => setDistrictQuery(e.target.value)}
              placeholder="Jump to District (e.g. Pune, Satara)..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#216d53]/30"
            />
          </div>
          <button
            type="submit"
            className="px-3.5 py-2 rounded-xl bg-[#216d53] text-white hover:bg-[#164e3b] font-bold text-xs shadow-2xs transition-colors"
          >
            Locate
          </button>
        </form>
      </div>

      {/* 3. DEDICATED FULL-SIZE MAHARASHTRA GIS MAP */}
      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-md p-4">
        <MaharashtraMap 
          height="620px"
          compact={false}
          filterDisease={diseaseFilter}
          filterRisk={riskFilter}
          focusedDistrict={focusedDistrict}
          onSelectAlert={(alert) => {
            console.log('Selected alert:', alert);
          }}
        />
      </div>
    </div>
  );
}

export default DiseaseMapPage;
