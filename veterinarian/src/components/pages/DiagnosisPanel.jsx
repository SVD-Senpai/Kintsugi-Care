import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Stethoscope, 
  Pill, 
  Plus, 
  Trash2, 
  Send, 
  Save, 
  ShieldCheck, 
  FileText,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

export function DiagnosisPanel({ currentCase, onFinished = null }) {
  const { saveTreatmentPlan } = useApp();
  const { t } = useLanguage();

  const initialPlan = currentCase.treatmentPlan || {};

  const [diagnosisType, setDiagnosisType] = useState(initialPlan.diagnosisType || 'Confirmed');
  const [confirmedDisease, setConfirmedDisease] = useState(
    currentCase.confirmedDisease && currentCase.confirmedDisease !== 'Pending Lab Confirmation' 
      ? currentCase.confirmedDisease 
      : currentCase.suspectedDisease
  );
  const [precautions, setPrecautions] = useState(initialPlan.precautions || 'Isolate from rest of herd for 14 days. Disinfect stall daily.');
  const [vetNotes, setVetNotes] = useState('');

  // Prescriptions list
  const [prescriptions, setPrescriptions] = useState(
    initialPlan.prescriptions && initialPlan.prescriptions.length > 0
      ? initialPlan.prescriptions
      : [
          { medicine: 'Meloxicam + Paracetamol Inj', dosage: '15 ml', route: 'Intramuscular (IM)', frequency: 'Once daily (OD)', duration: '3 Days' },
          { medicine: 'Ceftiofur Sodium Inj', dosage: '1 gm', route: 'Intramuscular (IM)', frequency: 'Once daily (OD)', duration: '3 Days' },
          { medicine: 'Povidone Iodine 5% Wash', dosage: 'Liberal wash', route: 'Topical', frequency: 'Twice daily (BD)', duration: '7 Days' }
        ]
  );

  const handleAddMedicine = () => {
    setPrescriptions([
      ...prescriptions,
      { medicine: '', dosage: '', route: 'Oral', frequency: 'Once daily (OD)', duration: '3 Days' }
    ]);
  };

  const handleRemoveMedicine = (index) => {
    setPrescriptions(prescriptions.filter((_, i) => i !== index));
  };

  const handleMedicineChange = (index, field, value) => {
    const updated = [...prescriptions];
    updated[index][field] = value;
    setPrescriptions(updated);
  };

  const handleSaveDraft = () => {
    saveTreatmentPlan(currentCase.id, {
      diagnosisType,
      confirmedDisease,
      prescriptions,
      precautions,
      vetNotes
    }, false);
    if (onFinished) onFinished();
  };

  const handleSendToFarmer = () => {
    saveTreatmentPlan(currentCase.id, {
      diagnosisType,
      confirmedDisease,
      prescriptions,
      precautions,
      vetNotes
    }, true);
    if (onFinished) onFinished();
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs p-5 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-stone-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#216d53]/10 text-[#216d53] flex items-center justify-center">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-stone-900 tracking-tight">
              Clinical Diagnosis & Treatment Plan
            </h3>
            <p className="text-xs text-stone-500 font-medium">
              Formulate veterinary prescription & send biosecurity advisory directly to farmer's Kintsugi Care app
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-stone-400">Status:</span>
          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
            initialPlan.status === 'Prescribed' 
              ? 'bg-teal-100 text-teal-800' 
              : 'bg-stone-100 text-stone-700'
          }`}>
            {initialPlan.status || 'Draft'}
          </span>
        </div>
      </div>

      {/* Diagnosis Input Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1.5">
            Diagnostic Classification
          </label>
          <select
            value={diagnosisType}
            onChange={(e) => setDiagnosisType(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#216d53]/30 font-semibold text-stone-800"
          >
            <option value="Confirmed (Clinical Presentation)">Confirmed (Clinical Presentation)</option>
            <option value="Confirmed (Laboratory Pathological)">Confirmed (Laboratory Pathological)</option>
            <option value="Presumptive / Suspected">Presumptive / Suspected</option>
            <option value="Differential Diagnosis">Differential Diagnosis</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1.5">
            Confirmed / Definitive Disease
          </label>
          <input
            type="text"
            value={confirmedDisease}
            onChange={(e) => setConfirmedDisease(e.target.value)}
            placeholder="e.g., Lumpy Skin Disease (Capripoxvirus)"
            className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#216d53]/30 font-semibold text-stone-800"
          />
        </div>
      </div>

      {/* Prescription Medication Table */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
            <Pill className="w-3.5 h-3.5 text-[#216d53]" />
            <span>Medication & Dosage Protocol</span>
          </label>
          <button
            type="button"
            onClick={handleAddMedicine}
            className="text-xs font-bold text-[#216d53] hover:text-[#164e3b] flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#eaf3ee] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Medicine</span>
          </button>
        </div>

        <div className="border border-stone-200 rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#fbf9f4] border-b border-stone-200 text-stone-500 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Medicine Name & Form</th>
                <th className="py-2.5 px-3">Dosage</th>
                <th className="py-2.5 px-3">Route</th>
                <th className="py-2.5 px-3">Frequency</th>
                <th className="py-2.5 px-3">Duration</th>
                <th className="py-2.5 px-2 text-center w-10">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {prescriptions.map((med, idx) => (
                <tr key={idx} className="hover:bg-stone-50/70">
                  <td className="p-2">
                    <input
                      type="text"
                      value={med.medicine}
                      onChange={(e) => handleMedicineChange(idx, 'medicine', e.target.value)}
                      placeholder="e.g. Meloxicam Inj"
                      className="w-full px-2 py-1 text-xs border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#216d53] font-medium"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      value={med.dosage}
                      onChange={(e) => handleMedicineChange(idx, 'dosage', e.target.value)}
                      placeholder="e.g. 15 ml"
                      className="w-full px-2 py-1 text-xs border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#216d53]"
                    />
                  </td>
                  <td className="p-2">
                    <select
                      value={med.route}
                      onChange={(e) => handleMedicineChange(idx, 'route', e.target.value)}
                      className="w-full px-2 py-1 text-xs border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#216d53]"
                    >
                      <option value="Intramuscular (IM)">Intramuscular (IM)</option>
                      <option value="Intravenous (IV)">Intravenous (IV)</option>
                      <option value="Subcutaneous (SC)">Subcutaneous (SC)</option>
                      <option value="Oral">Oral</option>
                      <option value="Topical">Topical</option>
                      <option value="Intramammary">Intramammary</option>
                    </select>
                  </td>
                  <td className="p-2">
                    <select
                      value={med.frequency}
                      onChange={(e) => handleMedicineChange(idx, 'frequency', e.target.value)}
                      className="w-full px-2 py-1 text-xs border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#216d53]"
                    >
                      <option value="Once daily (OD)">Once daily (OD)</option>
                      <option value="Twice daily (BD)">Twice daily (BD)</option>
                      <option value="Thrice daily (TID)">Thrice daily (TID)</option>
                      <option value="Single dose">Single dose</option>
                      <option value="Alternate days">Alternate days</option>
                    </select>
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      value={med.duration}
                      onChange={(e) => handleMedicineChange(idx, 'duration', e.target.value)}
                      placeholder="e.g. 4 Days"
                      className="w-full px-2 py-1 text-xs border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#216d53]"
                    />
                  </td>
                  <td className="p-2 text-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveMedicine(idx)}
                      className="p-1 rounded-md text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Precautions & Farmer Advisory */}
      <div>
        <label className="block text-xs font-bold text-stone-700 mb-1.5 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#216d53]" />
          <span>Biosecurity, Quarantine & Precautions for Farmer</span>
        </label>
        <textarea
          rows={3}
          value={precautions}
          onChange={(e) => setPrecautions(e.target.value)}
          placeholder="Isolation distance, sanitization protocol, milk withholding, etc."
          className="w-full p-3 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#216d53]/30 leading-relaxed font-medium text-stone-800"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-stone-100">
        <button
          type="button"
          onClick={handleSaveDraft}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-50 font-bold text-xs flex items-center justify-center gap-2 transition-all"
        >
          <Save className="w-4 h-4 text-stone-500" />
          <span>{t('saveDraft')}</span>
        </button>

        <button
          type="button"
          onClick={handleSendToFarmer}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#216d53] text-white hover:bg-[#164e3b] font-bold text-xs shadow-md shadow-[#216d53]/20 flex items-center justify-center gap-2 transition-all active:scale-98"
        >
          <Send className="w-4 h-4" />
          <span>{t('sendToFarmer')}</span>
        </button>
      </div>
    </div>
  );
}

export default DiagnosisPanel;
