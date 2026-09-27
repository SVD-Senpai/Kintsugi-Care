import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { StatusBadge } from '../common/StatusBadge';
import { 
  FolderHeart, 
  Search, 
  Syringe, 
  Stethoscope, 
  FileText, 
  Calendar, 
  User, 
  MapPin, 
  Tag, 
  Activity,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

export function AnimalRecords() {
  const { animals, selectedAnimalId, setSelectedAnimalId, navigateToCase } = useApp();
  const { t } = useLanguage();

  const [searchAnimal, setSearchAnimal] = useState('');

  // Selected animal object
  const currentAnimal = animals.find(a => a.id === selectedAnimalId) || animals[0];

  const filteredAnimals = animals.filter(a => 
    a.name.toLowerCase().includes(searchAnimal.toLowerCase()) ||
    a.id.toLowerCase().includes(searchAnimal.toLowerCase()) ||
    a.tagNumber.toLowerCase().includes(searchAnimal.toLowerCase()) ||
    a.species.toLowerCase().includes(searchAnimal.toLowerCase()) ||
    a.ownerName.toLowerCase().includes(searchAnimal.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs">
        <div>
          <h2 className="text-lg font-extrabold text-stone-900 tracking-tight">
            Electronic Livestock Health Records
          </h2>
          <p className="text-xs text-stone-500 font-medium">
            Longitudinal electronic health records, vaccination schedules, and clinical timeline
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchAnimal}
            onChange={(e) => setSearchAnimal(e.target.value)}
            placeholder="Search animal, ear tag, owner..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#216d53]/30"
          />
        </div>
      </div>

      {/* Main Container: Animal Picker Sidebar + Record Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Animal Registry List */}
        <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs p-4 space-y-2 h-fit max-h-[720px] overflow-y-auto">
          <div className="text-xs font-bold uppercase tracking-wider text-stone-400 px-2 py-1">
            Registered Herd Livestock ({filteredAnimals.length})
          </div>

          {filteredAnimals.map((animal) => {
            const isSelected = animal.id === currentAnimal.id;

            return (
              <div
                key={animal.id}
                onClick={() => setSelectedAnimalId(animal.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-[#eaf3ee] border-[#216d53]/50 shadow-2xs' 
                    : 'bg-stone-50/50 border-stone-200/60 hover:bg-stone-50 hover:border-stone-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-extrabold text-stone-900 text-sm flex items-center gap-1.5">
                      <span>{animal.name}</span>
                      <span className="text-[10px] font-bold text-stone-500 bg-white px-1.5 py-0.5 rounded border border-stone-200">
                        {animal.species}
                      </span>
                    </div>
                    <div className="text-[11px] text-stone-500 font-medium">
                      Tag: {animal.tagNumber}
                    </div>
                    <div className="text-[11px] text-stone-400 mt-1">
                      Owner: <span className="font-semibold text-stone-700">{animal.ownerName}</span> ({animal.village})
                    </div>
                  </div>

                  <StatusBadge status={animal.currentHealthStatus} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column (2 cols): Selected Animal Profile & Chronological Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Identity & Health Status Banner */}
          <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs p-5 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
              <div>
                <div className="flex items-center gap-2.5">
                  <h3 className="text-2xl font-black text-stone-900 tracking-tight">
                    {currentAnimal.name}
                  </h3>
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-md bg-stone-100 text-stone-700 border border-stone-200">
                    {currentAnimal.tagNumber}
                  </span>
                  <StatusBadge status={currentAnimal.currentHealthStatus} />
                </div>
                <p className="text-xs text-stone-500 font-medium mt-1">
                  Registered Animal ID: <span className="font-semibold text-stone-800">{currentAnimal.id}</span>
                </p>
              </div>

              {currentAnimal.activeCaseId && (
                <button
                  onClick={() => navigateToCase(currentAnimal.activeCaseId)}
                  className="px-3.5 py-2 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 font-bold text-xs border border-red-200 flex items-center gap-1.5 transition-colors"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
                  <span>View Active Case #{currentAnimal.activeCaseId}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#fbf9f4] border border-stone-200/60">
                <div className="text-stone-400 font-bold uppercase text-[10px]">Species & Breed</div>
                <div className="font-extrabold text-stone-900 mt-0.5">{currentAnimal.species}</div>
                <div className="text-stone-500 text-[11px]">{currentAnimal.breed}</div>
              </div>

              <div className="p-3 rounded-xl bg-[#fbf9f4] border border-stone-200/60">
                <div className="text-stone-400 font-bold uppercase text-[10px]">Age & Sex</div>
                <div className="font-extrabold text-stone-900 mt-0.5">{currentAnimal.age}</div>
                <div className="text-stone-500 text-[11px]">{currentAnimal.sex}</div>
              </div>

              <div className="p-3 rounded-xl bg-[#fbf9f4] border border-stone-200/60">
                <div className="text-stone-400 font-bold uppercase text-[10px]">Lactation / Work</div>
                <div className="font-extrabold text-stone-900 mt-0.5 truncate">{currentAnimal.lactationStage}</div>
                <div className="text-stone-500 text-[11px]">Weight: {currentAnimal.weightKg || '420'} kg</div>
              </div>

              <div className="p-3 rounded-xl bg-[#fbf9f4] border border-stone-200/60">
                <div className="text-stone-400 font-bold uppercase text-[10px]">Owner & Location</div>
                <div className="font-extrabold text-stone-900 mt-0.5">{currentAnimal.ownerName}</div>
                <div className="text-stone-500 text-[11px]">{currentAnimal.village}, {currentAnimal.district}</div>
              </div>
            </div>
          </div>

          {/* Chronological Health Timeline */}
          <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs p-5 sm:p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <h4 className="text-base font-extrabold text-stone-900 tracking-tight">
                  Longitudinal Health & Vaccination Timeline
                </h4>
                <p className="text-xs text-stone-500 font-medium">
                  Verified clinical events, prophylaxis drives, and veterinary treatments
                </p>
              </div>

              <span className="text-xs font-bold text-stone-400">
                {currentAnimal.timeline.length} Entries
              </span>
            </div>

            {/* Timeline Tree UI */}
            <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:top-2 before:bottom-2 before:left-[11px] before:w-0.5 before:bg-stone-200">
              {currentAnimal.timeline.map((event, idx) => {
                const isVaccine = event.type.toLowerCase().includes('vaccin');
                const isReport = event.type.toLowerCase().includes('report') || event.type.toLowerCase().includes('case');
                const isTreatment = event.type.toLowerCase().includes('treat');

                let Icon = FileText;
                let dotBg = 'bg-stone-400';

                if (isVaccine) {
                  Icon = Syringe;
                  dotBg = 'bg-[#216d53] text-white';
                } else if (isReport) {
                  Icon = ShieldAlert;
                  dotBg = 'bg-red-500 text-white';
                } else if (isTreatment) {
                  Icon = Stethoscope;
                  dotBg = 'bg-blue-600 text-white';
                }

                return (
                  <div key={idx} className="relative group">
                    {/* Circle Node on Timeline */}
                    <div className={`absolute -left-[30px] top-0 w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-white shadow-2xs ${dotBg}`}>
                      <Icon className="w-3 h-3" />
                    </div>

                    {/* Timeline Event Card */}
                    <div className="p-4 rounded-xl bg-[#fbf9f4] border border-stone-200/70 hover:border-stone-300 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                            isVaccine ? 'bg-[#216d53]/15 text-[#164e3b]' :
                            isReport ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {event.type}
                          </span>
                          <span className="font-extrabold text-stone-900 text-xs">
                            {event.title}
                          </span>
                        </div>
                        <div className="text-[11px] font-semibold text-stone-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{event.date}</span>
                        </div>
                      </div>

                      <p className="text-xs text-stone-700 leading-relaxed font-medium mt-1">
                        {event.notes}
                      </p>

                      <div className="text-[10px] font-bold text-stone-400 mt-2">
                        Supervising Officer: <span className="text-stone-700">{event.vet || 'AHD Veterinarian'}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnimalRecords;
