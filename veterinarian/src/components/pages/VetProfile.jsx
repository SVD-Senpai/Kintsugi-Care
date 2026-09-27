import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  UserCheck, 
  ShieldCheck, 
  Mail, 
  Phone, 
  MapPin, 
  Award, 
  CheckCircle2, 
  Save, 
  FileText, 
  Activity,
  Layers
} from 'lucide-react';

export function VetProfile() {
  const { vetProfile, updateProfile } = useApp();
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    name: vetProfile.name,
    title: vetProfile.title,
    credentials: vetProfile.credentials,
    department: vetProfile.department,
    region: vetProfile.region,
    station: vetProfile.station,
    licenseNo: vetProfile.licenseNo,
    email: vetProfile.email,
    phone: vetProfile.phone
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile(formData);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-2xs overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-[#216d53] via-[#1b5b45] to-[#124232] p-6 flex items-end justify-between relative">
          <span className="text-white/80 text-xs font-bold uppercase tracking-wider">
            Official AHD Surveillance Credential
          </span>
          <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-white/20 text-white backdrop-blur-xs border border-white/30">
            Govt. of Maharashtra Class-I
          </span>
        </div>

        <div className="p-6 pt-0 sm:flex sm:items-end sm:justify-between -mt-12 sm:-mt-14 mb-4">
          <div className="flex items-end gap-4">
            <div className="relative">
              <img
                src={vetProfile.avatar}
                alt={vetProfile.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-4 border-white shadow-lg bg-stone-100"
              />
              <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" />
            </div>

            <div className="mb-1">
              <h2 className="text-2xl font-black text-stone-900 tracking-tight">
                {vetProfile.name}
              </h2>
              <p className="text-xs font-bold text-[#216d53]">
                {vetProfile.title} • {vetProfile.credentials}
              </p>
              <p className="text-[11px] text-stone-500 font-medium">
                Registration No: <span className="font-mono font-bold text-stone-700">{vetProfile.licenseNo}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-6 pt-0">
          <div className="p-3.5 rounded-2xl bg-[#fbf9f4] border border-stone-200/60">
            <div className="text-[10px] uppercase font-bold text-stone-400">Total Cases Reviewed</div>
            <div className="text-xl font-black text-stone-900 mt-0.5">{vetProfile.stats.casesReviewed} Cases</div>
            <div className="text-[10px] text-emerald-700 font-semibold">98.2% on-time triage</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#fbf9f4] border border-stone-200/60">
            <div className="text-[10px] uppercase font-bold text-stone-400">Resolution Rate</div>
            <div className="text-xl font-black text-[#216d53] mt-0.5">{vetProfile.stats.resolutionRate}</div>
            <div className="text-[10px] text-stone-500">Morbidity recovery</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#fbf9f4] border border-stone-200/60">
            <div className="text-[10px] uppercase font-bold text-stone-400">Active Monitoring</div>
            <div className="text-xl font-black text-stone-900 mt-0.5">{vetProfile.stats.activeMonitoring} Patients</div>
            <div className="text-[10px] text-amber-600 font-semibold">In current cycle</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#fbf9f4] border border-stone-200/60">
            <div className="text-[10px] uppercase font-bold text-stone-400">Containment Advisories</div>
            <div className="text-xl font-black text-stone-900 mt-0.5">{vetProfile.stats.advisoriesIssued} Dispatched</div>
            <div className="text-[10px] text-stone-500">To cooperative dairies</div>
          </div>
        </div>
      </div>

      {/* Editable Details Form */}
      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-2xs p-6 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div>
            <h3 className="text-base font-extrabold text-stone-900 tracking-tight">
              Veterinary Officer Profile & Duty Jurisdiction
            </h3>
            <p className="text-xs text-stone-500 font-medium">
              Update administrative contact information and assigned surveillance division
            </p>
          </div>
          <span className="text-xs font-bold text-stone-400">AHD Official Record</span>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Full Name & Title
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#216d53]/30 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Official Designation
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#216d53]/30 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Veterinary Council Registration No.
              </label>
              <input
                type="text"
                name="licenseNo"
                value={formData.licenseNo}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#216d53]/30 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Academic Degrees & Specialization
              </label>
              <input
                type="text"
                name="credentials"
                value={formData.credentials}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#216d53]/30"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Assigned Surveillance Division
              </label>
              <input
                type="text"
                name="region"
                value={formData.region}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#216d53]/30 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Diagnostic Laboratory / Station
              </label>
              <input
                type="text"
                name="station"
                value={formData.station}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#216d53]/30 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Official AHD Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#216d53]/30 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Emergency Duty Phone
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#216d53]/30 font-medium"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-stone-100">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#216d53] text-white hover:bg-[#164e3b] font-bold text-xs shadow-md shadow-[#216d53]/20 flex items-center gap-2 transition-all active:scale-98"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default VetProfile;
