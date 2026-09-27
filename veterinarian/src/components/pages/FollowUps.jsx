import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';
import { 
  Stethoscope, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Eye, 
  Edit3, 
  XCircle, 
  AlertCircle,
  FileCheck
} from 'lucide-react';

export function FollowUps() {
  const { cases, navigateToCase, closeCase, updateFollowUpDate } = useApp();
  const { t } = useLanguage();

  // Active follow-up cases (status === 'Follow-up' or cases that have a pending follow-up date and not closed)
  const followUpCases = cases.filter(c => 
    c.status === 'Follow-up' || 
    (c.status !== 'Resolved' && c.followUp?.nextCheckIn && c.followUp.nextCheckIn !== 'Case Closed')
  );

  // Close Case Modal
  const [closingCaseId, setClosingCaseId] = useState(null);
  const [resolutionSummary, setResolutionSummary] = useState('');

  // Update Schedule Modal
  const [updatingCaseId, setUpdatingCaseId] = useState(null);
  const [newNextDate, setNewNextDate] = useState('2026-09-08');
  const [targetObservation, setTargetObservation] = useState('');

  const handleCloseCaseSubmit = (e) => {
    e.preventDefault();
    if (closingCaseId) {
      closeCase(closingCaseId, resolutionSummary || 'Patient showed full cessation of symptoms, healed lesions, and normal appetite.');
      setClosingCaseId(null);
      setResolutionSummary('');
    }
  };

  const handleUpdateScheduleSubmit = (e) => {
    e.preventDefault();
    if (updatingCaseId) {
      updateFollowUpDate(updatingCaseId, newNextDate, targetObservation);
      setUpdatingCaseId(null);
      setTargetObservation('');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold text-stone-900 tracking-tight">
            Active Follow-ups & Convalescent Surveillance
          </h2>
          <p className="text-xs text-stone-500 font-medium">
            Monitor patient progress post-treatment, schedule clinical visits, and record case resolutions
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
            {followUpCases.length} Pending Review
          </span>
        </div>
      </div>

      {/* Follow-up Cases Cards & Table */}
      <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#fbf9f4] border-b border-stone-200 text-stone-500 uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Case ID</th>
                <th className="py-3 px-4">Animal & Species</th>
                <th className="py-3 px-4">Farmer / District</th>
                <th className="py-3 px-4">Disease</th>
                <th className="py-3 px-4">Next Check-in</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {followUpCases.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-stone-400">
                    <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 mb-2 opacity-80" />
                    <p className="text-sm font-semibold">All active follow-ups resolved!</p>
                  </td>
                </tr>
              ) : (
                followUpCases.map((c) => (
                  <tr key={c.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-extrabold text-stone-900">
                      <button
                        onClick={() => navigateToCase(c.id)}
                        className="hover:text-[#216d53] transition-colors"
                      >
                        {c.id}
                      </button>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-stone-900">{c.animalName}</div>
                      <div className="text-[11px] text-stone-400">{c.species} • {c.breed}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-stone-900">{c.farmerName}</div>
                      <div className="text-[11px] text-stone-400">{c.village}, {c.district}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-stone-800">{c.suspectedDisease}</div>
                      <div className="text-[10px] text-stone-400">Updated: {c.lastUpdated}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 font-bold text-stone-900">
                        <Calendar className="w-3.5 h-3.5 text-[#216d53]" />
                        <span>{c.followUp?.nextCheckIn || 'Pending Schedule'}</span>
                      </div>
                      <div className="text-[10px] text-stone-500 truncate max-w-xs">
                        {c.followUp?.targetObservation || 'General recovery check'}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusBadge status={c.status} />
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => navigateToCase(c.id)}
                          className="px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 font-bold text-xs transition-colors"
                          title="View Case"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            setUpdatingCaseId(c.id);
                            setTargetObservation(c.followUp?.targetObservation || '');
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition-colors flex items-center gap-1"
                          title="Reschedule"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Schedule</span>
                        </button>

                        <button
                          onClick={() => {
                            setClosingCaseId(c.id);
                            setResolutionSummary(`Cessation of symptoms in ${c.animalName}. Farmer confirms normal appetite and rumination.`);
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs border border-emerald-200 transition-colors flex items-center gap-1"
                          title="Close Case"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Close</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: CLOSE CASE */}
      <Modal
        isOpen={!!closingCaseId}
        onClose={() => setClosingCaseId(null)}
        title={`Close Case #${closingCaseId}`}
        subtitle="Mark animal as clinically recovered and discharge from active follow-up"
      >
        <form onSubmit={handleCloseCaseSubmit} className="space-y-4">
          <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-emerald-900 text-xs flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Clinical Resolution Confirmation</span>
              <p className="mt-0.5 text-emerald-800">
                Closing this case will update the animal's electronic health status to "Resolved" and record a permanent discharge note on their health timeline.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Veterinary Resolution Summary
            </label>
            <textarea
              rows={3}
              required
              value={resolutionSummary}
              onChange={(e) => setResolutionSummary(e.target.value)}
              className="w-full p-3 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 font-medium"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setClosingCaseId(null)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 flex items-center gap-1.5"
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Confirm Case Closure</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 2: UPDATE SCHEDULE */}
      <Modal
        isOpen={!!updatingCaseId}
        onClose={() => setUpdatingCaseId(null)}
        title={`Update Follow-up Schedule (#${updatingCaseId})`}
        subtitle="Set the next clinical evaluation date and target observations"
      >
        <form onSubmit={handleUpdateScheduleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Next Check-in Date
            </label>
            <input
              type="date"
              required
              value={newNextDate}
              onChange={(e) => setNewNextDate(e.target.value)}
              className="w-full p-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#216d53]/30 font-bold text-stone-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Clinical Parameter to Monitor
            </label>
            <input
              type="text"
              required
              value={targetObservation}
              onChange={(e) => setTargetObservation(e.target.value)}
              placeholder="e.g. Inspect nodule healing, check rectal temperature, auscultate lungs"
              className="w-full p-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#216d53]/30"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setUpdatingCaseId(null)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#216d53] text-white text-xs font-bold hover:bg-[#164e3b]"
            >
              Save Schedule
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default FollowUps;
