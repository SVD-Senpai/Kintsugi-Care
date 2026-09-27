import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { StatusBadge } from '../common/StatusBadge';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  RotateCcw, 
  ArrowUpRight, 
  Eye, 
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';

export function CaseQueue() {
  const { cases, navigateToCase } = useApp();
  const { t } = useLanguage();

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [speciesFilter, setSpeciesFilter] = useState('all');
  const [districtFilter, setDistrictFilter] = useState('all');

  // Sorting
  const [sortField, setSortField] = useState('submittedDate');
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  // Filtered & Sorted Cases
  const filteredCases = useMemo(() => {
    return cases
      .filter((c) => {
        // Search term (Case ID, Farmer, Animal, or Disease)
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const matches = 
            c.id.toLowerCase().includes(q) ||
            c.farmerName.toLowerCase().includes(q) ||
            c.animalName.toLowerCase().includes(q) ||
            c.district.toLowerCase().includes(q) ||
            c.suspectedDisease.toLowerCase().includes(q);
          if (!matches) return false;
        }

        // Status
        if (statusFilter !== 'all' && c.status.toLowerCase() !== statusFilter.toLowerCase()) {
          return false;
        }

        // Priority
        if (priorityFilter !== 'all' && c.priorityLevel.toLowerCase() !== priorityFilter.toLowerCase()) {
          return false;
        }

        // Species
        if (speciesFilter !== 'all' && c.species.toLowerCase() !== speciesFilter.toLowerCase()) {
          return false;
        }

        // District
        if (districtFilter !== 'all' && c.district.toLowerCase() !== districtFilter.toLowerCase()) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        let valA = a[sortField] || '';
        let valB = b[sortField] || '';

        if (sortField === 'priority') {
          const pOrder = { high: 3, medium: 2, low: 1 };
          valA = pOrder[a.priorityLevel] || 0;
          valB = pOrder[b.priorityLevel] || 0;
        }

        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [cases, searchTerm, statusFilter, priorityFilter, speciesFilter, districtFilter, sortField, sortOrder]);

  const resetAllFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setSpeciesFilter('all');
    setDistrictFilter('all');
  };

  // Distinct districts from cases
  const availableDistricts = useMemo(() => {
    const dSet = new Set(cases.map(c => c.district));
    return Array.from(dSet).sort();
  }, [cases]);

  return (
    <div className="space-y-5 pb-12">
      {/* Header & Filter Card */}
      <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-extrabold text-stone-900 tracking-tight">
              Clinical Case Management Queue
            </h2>
            <p className="text-xs text-stone-500 font-medium">
              Showing {filteredCases.length} of {cases.length} reported livestock disease cases
            </p>
          </div>

          {(searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' || speciesFilter !== 'all' || districtFilter !== 'all') && (
            <button
              onClick={resetAllFilters}
              className="flex items-center gap-1.5 text-xs font-bold text-[#216d53] hover:text-[#164e3b] px-3 py-1.5 rounded-xl bg-[#eaf3ee] transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t('resetFilters')}</span>
            </button>
          )}
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Case, Farmer, Disease..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#216d53]/30 focus:border-[#216d53] transition-all"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#216d53]/30 focus:border-[#216d53] font-medium text-stone-700 transition-all appearance-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="under review">Under Review</option>
              <option value="follow-up">Follow-up</option>
              <option value="resolved">Resolved</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Priority Filter */}
          <div className="relative">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#216d53]/30 focus:border-[#216d53] font-medium text-stone-700 transition-all appearance-none cursor-pointer"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Species Filter */}
          <div className="relative">
            <select
              value={speciesFilter}
              onChange={(e) => setSpeciesFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#216d53]/30 focus:border-[#216d53] font-medium text-stone-700 transition-all appearance-none cursor-pointer"
            >
              <option value="all">All Species</option>
              <option value="cattle">Cattle</option>
              <option value="buffalo">Buffalo</option>
              <option value="goat">Goat</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* District Filter */}
          <div className="relative">
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#216d53]/30 focus:border-[#216d53] font-medium text-stone-700 transition-all appearance-none cursor-pointer"
            >
              <option value="all">All Districts</option>
              {availableDistricts.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Case Table */}
      <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#fbf9f4] border-b border-stone-200 text-stone-500 uppercase font-bold text-[10px] tracking-wider select-none">
                <th 
                  onClick={() => handleSort('id')} 
                  className="py-3 px-4 cursor-pointer hover:text-stone-900"
                >
                  <div className="flex items-center gap-1">
                    <span>Case ID</span>
                    <ArrowUpDown className="w-3 h-3 text-stone-400" />
                  </div>
                </th>
                <th className="py-3 px-4">Animal</th>
                <th className="py-3 px-4">Species</th>
                <th className="py-3 px-4">Farmer</th>
                <th 
                  onClick={() => handleSort('district')} 
                  className="py-3 px-4 cursor-pointer hover:text-stone-900"
                >
                  <div className="flex items-center gap-1">
                    <span>District</span>
                    <ArrowUpDown className="w-3 h-3 text-stone-400" />
                  </div>
                </th>
                <th className="py-3 px-4">Disease / Suspected</th>
                <th 
                  onClick={() => handleSort('priority')} 
                  className="py-3 px-4 cursor-pointer hover:text-stone-900"
                >
                  <div className="flex items-center gap-1">
                    <span>Priority</span>
                    <ArrowUpDown className="w-3 h-3 text-stone-400" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('status')} 
                  className="py-3 px-4 cursor-pointer hover:text-stone-900"
                >
                  <div className="flex items-center gap-1">
                    <span>Status</span>
                    <ArrowUpDown className="w-3 h-3 text-stone-400" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('submittedDate')} 
                  className="py-3 px-4 cursor-pointer hover:text-stone-900"
                >
                  <div className="flex items-center gap-1">
                    <span>Submitted</span>
                    <ArrowUpDown className="w-3 h-3 text-stone-400" />
                  </div>
                </th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredCases.length === 0 ? (
                <tr>
                  <td colSpan="10" className="py-12 text-center text-stone-400">
                    <p className="text-sm font-semibold">No cases found matching the criteria.</p>
                    <button 
                      onClick={resetAllFilters} 
                      className="mt-2 text-xs font-bold text-[#216d53] underline"
                    >
                      Reset all filters
                    </button>
                  </td>
                </tr>
              ) : (
                filteredCases.map((c) => (
                  <tr key={c.id} className="hover:bg-stone-50/80 transition-colors group">
                    {/* Case ID */}
                    <td className="py-3.5 px-4 font-extrabold text-stone-900">
                      <button
                        onClick={() => navigateToCase(c.id)}
                        className="hover:text-[#216d53] transition-colors"
                      >
                        {c.id}
                      </button>
                    </td>

                    {/* Animal */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-stone-900">{c.animalName}</div>
                      <div className="text-[11px] text-stone-400">{c.breed}</div>
                    </td>

                    {/* Species */}
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-stone-700">{c.species}</span>
                    </td>

                    {/* Farmer */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-stone-900">{c.farmerName}</div>
                      <div className="text-[11px] text-stone-400">{c.village}</div>
                    </td>

                    {/* District */}
                    <td className="py-3.5 px-4 font-medium text-stone-700">
                      {c.district}
                    </td>

                    {/* Disease */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-bold text-stone-900 truncate">{c.suspectedDisease}</div>
                      <div className="text-[10px] text-stone-400">Temp: {c.temperature}</div>
                    </td>

                    {/* Priority */}
                    <td className="py-3.5 px-4">
                      <StatusBadge status={c.priority} />
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <StatusBadge status={c.status} />
                    </td>

                    {/* Submitted */}
                    <td className="py-3.5 px-4 text-stone-500 whitespace-nowrap text-[11px]">
                      {c.submittedDate}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => navigateToCase(c.id)}
                        className="px-3 py-1.5 rounded-xl bg-[#216d53] text-white hover:bg-[#164e3b] font-bold text-xs shadow-2xs transition-all flex items-center gap-1 ml-auto active:scale-98"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{t('viewCase')}</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default CaseQueue;
