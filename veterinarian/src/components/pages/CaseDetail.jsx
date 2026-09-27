import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';
import { DiagnosisPanel } from './DiagnosisPanel';
import { 
  ArrowLeft, 
  User, 
  Phone, 
  MapPin, 
  Calendar, 
  Clock, 
  Thermometer, 
  Heart, 
  Wind, 
  FileText, 
  MessageSquare, 
  Plus, 
  Send, 
  FolderHeart, 
  Compass, 
  AlertTriangle,
  CheckCircle2,
  Share2
} from 'lucide-react';

export function CaseDetail() {
  const { 
    selectedCaseId, 
    cases, 
    updateCaseStatus, 
    addCaseNote, 
    navigateToAnimal, 
    navigateToMapWithFocus,
    setActivePage 
  } = useApp();
  const { t } = useLanguage();

  const currentCase = cases.find(c => c.id === selectedCaseId) || cases[0];

  // Modals
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');

  const [showReqInfoModal, setShowReqInfoModal] = useState(false);
  const [reqInfoMessage, setReqInfoMessage] = useState('Please take a clear close-up photograph of the lesions under sunlight and measure rectal temperature again this evening.');

  const [activeTab, setActiveTab] = useState('clinical'); // 'clinical' or 'treatment'

  const handleAddNoteSubmit = (e) => {
    e.preventDefault();
    if (newNoteText.trim()) {
      addCaseNote(currentCase.id, newNoteText.trim());
      setNewNoteText('');
      setShowNoteModal(false);
    }
  };

  const handleReqInfoSubmit = (e) => {
    e.preventDefault();
    addCaseNote(currentCase.id, `[Information Request Sent to Farmer]: ${reqInfoMessage}`);
    setShowReqInfoModal(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Navigation & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/90 shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActivePage('caseQueue')}
            className="p-2 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
            title="Back to Case Queue"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-stone-900 tracking-tight">
                Case #{currentCase.id}
              </h2>
              <StatusBadge status={currentCase.priority} />
              <StatusBadge status={currentCase.status} />
            </div>
            <p className="text-xs text-stone-500 font-medium mt-0.5">
              Submitted: {currentCase.submittedDate} • Last Updated: {currentCase.lastUpdated}
            </p>
          </div>
        </div>

        {/* Quick Status Selector & Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Dropdown */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-stone-400 font-bold hidden sm:inline">Status:</span>
            <select
              value={currentCase.status}
              onChange={(e) => updateCaseStatus(currentCase.id, e.target.value)}
              className="px-3 py-1.5 text-xs bg-stone-100 font-bold text-stone-800 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#216d53]/30 cursor-pointer"
            >
              <option value="Active">Active</option>
              <option value="Under Review">Under Review</option>
              <option value="Follow-up">Follow-up</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          <button
            onClick={() => setShowNoteModal(true)}
            className="px-3 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t('addNote')}</span>
          </button>

          <button
            onClick={() => setShowReqInfoModal(true)}
            className="px-3 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{t('requestInfo')}</span>
          </button>

          <button
            onClick={() => navigateToAnimal(currentCase.animalId)}
            className="px-3 py-1.5 rounded-xl bg-[#216d53]/10 text-[#216d53] hover:bg-[#216d53]/20 font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <FolderHeart className="w-3.5 h-3.5" />
            <span>{t('openHealthRecord')}</span>
          </button>
        </div>
      </div>

      {/* Tabs for Case Inspection vs Diagnosis Form */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
        <button
          onClick={() => setActiveTab('clinical')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
            activeTab === 'clinical' 
              ? 'bg-[#216d53] text-white shadow-xs' 
              : 'text-stone-600 hover:bg-white'
          }`}
        >
          Clinical Dossier & Evidence
        </button>
        <button
          onClick={() => setActiveTab('treatment')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
            activeTab === 'treatment' 
              ? 'bg-[#216d53] text-white shadow-xs' 
              : 'text-stone-600 hover:bg-white'
          }`}
        >
          <span>Diagnosis & Prescriptions</span>
          {currentCase.treatmentPlan?.status === 'Prescribed' && (
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          )}
        </button>
      </div>

      {activeTab === 'treatment' ? (
        <DiagnosisPanel 
          currentCase={currentCase} 
          onFinished={() => setActiveTab('clinical')} 
        />
      ) : (
        /* Main Dossier View */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (2 cols): Clinical Presentation, Vitals, Photos, Exposure */}
          <div className="lg:col-span-2 space-y-6">
            {/* Clinical Overview Card */}
            <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <h3 className="text-base font-extrabold text-stone-900 tracking-tight">
                  Clinical Examination & Symptoms
                </h3>
                <span className="text-xs font-bold text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
                  Onset: {currentCase.duration} ago
                </span>
              </div>

              {/* Vitals Ribbon */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-[#fbf9f4] border border-stone-200/60">
                  <div className="flex items-center gap-1.5 text-stone-500 text-[10px] font-bold uppercase">
                    <Thermometer className="w-3.5 h-3.5 text-red-500" />
                    <span>Rectal Temperature</span>
                  </div>
                  <div className="text-lg font-black text-red-600 mt-1">
                    {currentCase.temperature}
                  </div>
                  <div className="text-[10px] text-red-500 font-semibold">Febrile (Elevated)</div>
                </div>

                <div className="p-3 rounded-xl bg-[#fbf9f4] border border-stone-200/60">
                  <div className="flex items-center gap-1.5 text-stone-500 text-[10px] font-bold uppercase">
                    <Heart className="w-3.5 h-3.5 text-rose-500" />
                    <span>Heart Rate</span>
                  </div>
                  <div className="text-lg font-black text-stone-800 mt-1">
                    {currentCase.heartRate}
                  </div>
                  <div className="text-[10px] text-stone-400 font-medium">Mild tachycardia</div>
                </div>

                <div className="p-3 rounded-xl bg-[#fbf9f4] border border-stone-200/60">
                  <div className="flex items-center gap-1.5 text-stone-500 text-[10px] font-bold uppercase">
                    <Wind className="w-3.5 h-3.5 text-sky-500" />
                    <span>Respiration</span>
                  </div>
                  <div className="text-lg font-black text-stone-800 mt-1">
                    {currentCase.respirationRate}
                  </div>
                  <div className="text-[10px] text-stone-400 font-medium">Tachypneic</div>
                </div>
              </div>

              {/* Reported Symptoms Tags */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-400 block mb-2">
                  Key Pathological Signs & Lesions
                </label>
                <div className="flex flex-wrap gap-2">
                  {currentCase.symptoms.map((symp, idx) => (
                    <span 
                      key={idx}
                      className="px-3 py-1 rounded-xl bg-red-50 text-red-800 border border-red-200 text-xs font-bold tracking-tight"
                    >
                      {symp}
                    </span>
                  ))}
                </div>
              </div>

              {/* Farmer's Own Description */}
              <div className="p-4 rounded-xl bg-[#fbf9f4] border border-stone-200/80">
                <div className="text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-[#216d53]" />
                  <span>Farmer's Clinical Complaint</span>
                </div>
                <p className="text-xs text-stone-800 leading-relaxed italic">
                  "{currentCase.farmerDescription}"
                </p>
              </div>

              {/* Epidemiological Exposure History */}
              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80">
                <div className="text-xs font-bold text-amber-900 mb-1 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Epidemiological Exposure History</span>
                </div>
                <p className="text-xs text-amber-950 leading-relaxed">
                  {currentCase.exposureHistory}
                </p>
              </div>
            </div>

            {/* Photographic Evidence Gallery */}
            <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs p-5 sm:p-6 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <h3 className="text-base font-extrabold text-stone-900 tracking-tight">
                  Photographic Evidence & Lesion Documentation
                </h3>
                <span className="text-xs font-semibold text-stone-400">Captured via Kintsugi Care App</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative rounded-xl overflow-hidden border border-stone-200 group">
                  <img
                    src={currentCase.photoUrl}
                    alt="Lesion presentation"
                    className="w-full h-56 object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 text-white">
                    <p className="text-xs font-medium leading-snug">{currentCase.photoCaption}</p>
                    <span className="text-[10px] text-white/70 mt-0.5 block">High resolution macro capture</span>
                  </div>
                </div>

                <div className="flex flex-col justify-center p-5 rounded-xl bg-[#fbf9f4] border border-dashed border-stone-300 text-center space-y-2">
                  <div className="w-10 h-10 mx-auto rounded-full bg-stone-200 flex items-center justify-center text-stone-500">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-bold text-stone-700">Lab Pathology Report Pending</div>
                  <p className="text-[11px] text-stone-500 max-w-xs mx-auto">
                    Blood swab sample dispatched to Regional Disease Diagnostic Laboratory (RDDL), Pune on Sep 04.
                  </p>
                  <button 
                    onClick={() => setShowReqInfoModal(true)}
                    className="text-xs font-bold text-[#216d53] hover:underline pt-1"
                  >
                    Request additional photos from farmer
                  </button>
                </div>
              </div>
            </div>

            {/* Veterinary Notes & Observation Trail */}
            <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <h3 className="text-base font-extrabold text-stone-900 tracking-tight">
                  Veterinarian Clinical Notes
                </h3>
                <button
                  onClick={() => setShowNoteModal(true)}
                  className="text-xs font-bold text-[#216d53] hover:text-[#164e3b] flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Note</span>
                </button>
              </div>

              <div className="space-y-3">
                {currentCase.vetNotes && currentCase.vetNotes.length > 0 ? (
                  currentCase.vetNotes.map((note) => (
                    <div key={note.id} className="p-3.5 rounded-xl bg-[#fbf9f4] border border-stone-200/70 text-xs">
                      <div className="flex items-center justify-between text-stone-400 font-semibold text-[10px] mb-1">
                        <span className="text-stone-800 font-bold">{note.author}</span>
                        <span>{note.timestamp}</span>
                      </div>
                      <p className="text-stone-700 leading-relaxed font-medium">{note.text}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-stone-400 italic">No notes recorded yet.</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column (1 col): Animal Profile, Farmer Details, Geographic Location */}
          <div className="space-y-6">
            {/* Animal Profile Card */}
            <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-stone-900 text-sm">Animal Profile</h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">
                    {currentCase.animalId}
                  </span>
                </div>
                <button
                  onClick={() => navigateToAnimal(currentCase.animalId)}
                  className="text-xs font-bold text-[#216d53] hover:underline"
                >
                  View Dossier
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-stone-100">
                  <span className="text-stone-400 font-medium">Name</span>
                  <span className="font-bold text-stone-900">{currentCase.animalName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-100">
                  <span className="text-stone-400 font-medium">Species & Breed</span>
                  <span className="font-bold text-stone-900">{currentCase.species} • {currentCase.breed}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-100">
                  <span className="text-stone-400 font-medium">Ear Tag Number</span>
                  <span className="font-mono font-bold text-stone-800 text-[11px]">IN-MH-PUN-00101</span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-100">
                  <span className="text-stone-400 font-medium">Sex & Age</span>
                  <span className="font-semibold text-stone-800">Female • 4.2 Years</span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-100">
                  <span className="text-stone-400 font-medium">Lactation Stage</span>
                  <span className="font-semibold text-stone-800">2nd (Down 60%)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-stone-400 font-medium">Live Body Weight</span>
                  <span className="font-bold text-stone-900">385 kg</span>
                </div>
              </div>
            </div>

            {/* Farmer Profile Card */}
            <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <h4 className="font-extrabold text-stone-900 text-sm">Farmer Information</h4>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Kintsugi Care User
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 font-black">
                    {currentCase.farmerName.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-stone-900 text-sm">{currentCase.farmerName}</div>
                    <div className="text-stone-400 text-[11px]">Farmer ID: {currentCase.farmerId}</div>
                  </div>
                </div>

                <div className="pt-2 space-y-2">
                  <div className="flex items-center gap-2 text-stone-700">
                    <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span className="font-semibold">{currentCase.farmerPhone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-stone-700">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>{currentCase.village}, {currentCase.taluka || 'Haveli'} taluka, {currentCase.district}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Geographic Surveillance & Map Shortcut */}
            <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <h4 className="font-extrabold text-stone-900 text-sm">Geographic Coordinates</h4>
                <Compass className="w-4 h-4 text-[#216d53]" />
              </div>

              <div className="p-3 rounded-xl bg-[#fbf9f4] border border-stone-200/70 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-stone-500">Latitude:</span>
                  <span className="font-mono font-bold text-stone-800">{currentCase.coordinates[0].toFixed(4)}° N</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Longitude:</span>
                  <span className="font-mono font-bold text-stone-800">{currentCase.coordinates[1].toFixed(4)}° E</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Surveillance Hub:</span>
                  <span className="font-semibold text-[#216d53]">RDDL Pune Division</span>
                </div>
              </div>

              <button
                onClick={() => navigateToMapWithFocus(currentCase.district, currentCase.suspectedDisease)}
                className="w-full py-2 px-3 rounded-xl bg-[#216d53] text-white hover:bg-[#164e3b] font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-colors"
              >
                <span>Inspect District on GIS Map</span>
                <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: ADD CLINICAL NOTE */}
      <Modal
        isOpen={showNoteModal}
        onClose={() => setShowNoteModal(false)}
        title="Add Clinical Observation Note"
        subtitle={`Appends an official entry to Case #${currentCase.id}`}
      >
        <form onSubmit={handleAddNoteSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Observation Details
            </label>
            <textarea
              rows={4}
              required
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              placeholder="Record diagnostic impression, drug response, or field visit notes..."
              className="w-full p-3 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#216d53]/30"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowNoteModal(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#216d53] text-white text-xs font-bold hover:bg-[#164e3b]"
            >
              Record Note
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 2: REQUEST MORE INFORMATION FROM FARMER */}
      <Modal
        isOpen={showReqInfoModal}
        onClose={() => setShowReqInfoModal(false)}
        title="Request Information from Farmer"
        subtitle={`Dispatches an alert to ${currentCase.farmerName}'s Kintsugi Care app`}
      >
        <form onSubmit={handleReqInfoSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Instructions for Farmer
            </label>
            <textarea
              rows={4}
              required
              value={reqInfoMessage}
              onChange={(e) => setReqInfoMessage(e.target.value)}
              className="w-full p-3 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#216d53]/30 font-medium leading-relaxed"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowReqInfoModal(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#216d53] text-white text-xs font-bold hover:bg-[#164e3b] flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Request</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default CaseDetail;
