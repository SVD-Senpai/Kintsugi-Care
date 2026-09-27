import React from 'react';
import { ShieldAlert, Radio, AlertTriangle, CheckCircle2 } from 'lucide-react';

export function MapLegend({ className = '' }) {
  return (
    <div className={`bg-white/95 backdrop-blur-md p-3 rounded-xl border border-stone-200/90 shadow-lg text-xs ${className}`}>
      <div className="font-bold text-stone-900 mb-2 flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
        <Radio className="w-3.5 h-3.5 text-[#216d53]" />
        <span>Surveillance Severity Legend</span>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <div className="relative w-4 h-4 flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping absolute opacity-75" />
            <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
          </div>
          <span className="text-stone-700 font-medium">High Risk (Radar Alert Waves)</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-4 h-4 flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
          </div>
          <span className="text-stone-700 font-medium">Medium Risk (Cluster Watch)</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-4 h-4 flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          </div>
          <span className="text-stone-700 font-medium">Low Risk / Sentinel Monitor</span>
        </div>

        <div className="flex items-center gap-2 pt-1 border-t border-stone-100">
          <div className="w-3 h-3 rounded-xs border border-[#216d53] bg-[#216d53]/10" />
          <span className="text-stone-500 text-[11px]">Maharashtra District Boundary</span>
        </div>
      </div>
    </div>
  );
}

export default MapLegend;
