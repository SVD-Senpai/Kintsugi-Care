// Kintsugi Veterinary Health Surveillance - Mock Data Model
// Realistic synthetic clinical and surveillance dataset for Maharashtra Livestock Disease Monitoring

export const currentVet = {
  id: "VET-MH-0842",
  name: "Dr. Anjali Deshmukh",
  title: "Senior Veterinary Surveillance Officer",
  credentials: "B.V.Sc & A.H., M.V.Sc (Pathology)",
  department: "Animal Husbandry Department (AHD), Govt. of Maharashtra",
  region: "Western & Central Maharashtra Surveillance Division",
  districtsCovered: ["Pune", "Satara", "Kolhapur", "Ahmednagar", "Chhatrapati Sambhajinagar"],
  station: "Regional Disease Diagnostic Laboratory (RDDL), Pune",
  licenseNo: "MH-VET-2016-0842",
  email: "vet@ahd.mh.gov.in",
  phone: "+91 98220 45891",
  avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=256",
  stats: {
    casesReviewed: 184,
    activeMonitoring: 14,
    advisoriesIssued: 29,
    resolutionRate: "94.6%"
  }
};

export const farmers = [
  {
    id: "FARM-01",
    name: "Ramesh Patil",
    village: "Rampur",
    taluka: "Haveli",
    district: "Pune",
    phone: "+91 98231 10423",
    totalLivestock: 24,
    cattleCount: 18,
    buffaloCount: 6,
    goatCount: 0,
    coordinates: [18.4682, 73.9142]
  },
  {
    id: "FARM-02",
    name: "Sunita Gaikwad",
    village: "Shirwal",
    taluka: "Khandala",
    district: "Satara",
    phone: "+91 94225 78192",
    totalLivestock: 14,
    cattleCount: 8,
    buffaloCount: 4,
    goatCount: 2,
    coordinates: [18.1340, 73.9872]
  },
  {
    id: "FARM-03",
    name: "Eknath Shinde",
    village: "Nimgaon",
    taluka: "Karjat",
    district: "Ahmednagar",
    phone: "+91 98902 33418",
    totalLivestock: 32,
    cattleCount: 22,
    buffaloCount: 2,
    goatCount: 8,
    coordinates: [18.9100, 75.0100]
  },
  {
    id: "FARM-04",
    name: "Balasaheb Jadhav",
    village: "Danoli",
    taluka: "Shirol",
    district: "Kolhapur",
    phone: "+91 91584 90212",
    totalLivestock: 19,
    cattleCount: 7,
    buffaloCount: 12,
    goatCount: 0,
    coordinates: [16.7450, 74.5200]
  },
  {
    id: "FARM-05",
    name: "Vandana More",
    village: "Pimpalgaon",
    taluka: "Niphad",
    district: "Nashik",
    phone: "+91 97631 84520",
    totalLivestock: 28,
    cattleCount: 15,
    buffaloCount: 5,
    goatCount: 8,
    coordinates: [20.1700, 73.9800]
  },
  {
    id: "FARM-06",
    name: "Tukaram Pawar",
    village: "Bidkin",
    taluka: "Paithan",
    district: "Chhatrapati Sambhajinagar",
    phone: "+91 98218 66490",
    totalLivestock: 16,
    cattleCount: 4,
    buffaloCount: 2,
    goatCount: 10,
    coordinates: [19.6800, 75.3200]
  }
];

export const animals = [
  {
    id: "KC-00101",
    tagNumber: "IN-MH-PUN-00101",
    name: "Radha",
    species: "Cattle",
    breed: "Gir Indigenous",
    age: "4.2 Years",
    sex: "Female",
    lactationStage: "2nd Lactation (3 months in)",
    weightKg: 385,
    ownerId: "FARM-01",
    ownerName: "Ramesh Patil",
    village: "Rampur",
    district: "Pune",
    currentHealthStatus: "Active Case",
    healthStatusClass: "urgent",
    activeCaseId: "PH-1024",
    timeline: [
      {
        date: "2026-09-04",
        type: "Case Report",
        title: "Clinical Onset: High Fever & Cutaneous Nodules",
        vet: "Dr. Anjali Deshmukh",
        notes: "Rectal temp 104.8°F. Firm, raised circumscribed skin nodules (2-4 cm) over neck, thorax and perineum. Presumptive Lumpy Skin Disease."
      },
      {
        date: "2026-05-12",
        type: "Vaccination",
        title: "FMD Quadrivalent Vaccine (Raksha-Ovac)",
        vet: "Dr. S. K. Kadam",
        notes: "Batch: FMD-26-88B. Booster administered subcutaneously. No adverse reaction observed."
      },
      {
        date: "2026-01-20",
        type: "Vaccination",
        title: "HS & BQ Combined Vaccine",
        vet: "Dr. S. K. Kadam",
        notes: "Administered as annual pre-monsoon prophylactic drive. Batch: HSBQ-MH-910."
      },
      {
        date: "2025-10-14",
        type: "Treatment",
        title: "Subclinical Mastitis Recovery",
        vet: "Dr. Anjali Deshmukh",
        notes: "Intramammary cefquinome infusion for 3 days. California Mastitis Test (CMT) returned negative on day 7."
      }
    ]
  },
  {
    id: "KC-00102",
    tagNumber: "IN-MH-PUN-00102",
    name: "Lakshmi",
    species: "Buffalo",
    breed: "Murrah",
    age: "5.0 Years",
    sex: "Female",
    lactationStage: "3rd Lactation (Yield down by 40%)",
    weightKg: 490,
    ownerId: "FARM-01",
    ownerName: "Ramesh Patil",
    village: "Rampur",
    district: "Pune",
    currentHealthStatus: "Under Review",
    healthStatusClass: "attention",
    activeCaseId: "PH-1025",
    timeline: [
      {
        date: "2026-09-03",
        type: "Case Report",
        title: "Reduced Appetite & Stringy Salivation",
        vet: "Dr. Anjali Deshmukh",
        notes: "Sublingual hyperemia, temp 103.2°F. Early vesicular suspicion. Isolated in quarantine stall."
      },
      {
        date: "2026-02-18",
        type: "Vaccination",
        title: "HS Oil Adjuvant Vaccine",
        vet: "Dr. S. K. Kadam",
        notes: "Routine vaccination. Batch: HS-MH-2025-04."
      },
      {
        date: "2025-11-05",
        type: "Observation",
        title: "Routine Deworming",
        vet: "Vet Assistant",
        notes: "Albendazole oral bolus 3g administered."
      }
    ]
  },
  {
    id: "KC-00103",
    tagNumber: "IN-MH-SAT-00103",
    name: "Bheema",
    species: "Cattle",
    breed: "Khillari Draft",
    age: "3.5 Years",
    sex: "Male",
    lactationStage: "N/A (Draft bull)",
    weightKg: 420,
    ownerId: "FARM-02",
    ownerName: "Sunita Gaikwad",
    village: "Shirwal",
    district: "Satara",
    currentHealthStatus: "Active Case",
    healthStatusClass: "urgent",
    activeCaseId: "PH-1026",
    timeline: [
      {
        date: "2026-09-04",
        type: "Case Report",
        title: "Acute Severe Lameness & Crepitant Swelling",
        vet: "Dr. Anjali Deshmukh",
        notes: "Left hindquarter hot, extremely tender swelling with distinct gaseous crepitation upon palpation. Rectal temp 105.2°F. High suspicion: Black Quarter (Clostridium chauvoei)."
      },
      {
        date: "2025-08-10",
        type: "Treatment",
        title: "Hoof Trim & Copper Sulphate Foot Bath",
        vet: "Dr. Gaikwad",
        notes: "Routine claw maintenance."
      }
    ]
  },
  {
    id: "KC-00104",
    tagNumber: "IN-MH-AHM-00104",
    name: "Gauri",
    species: "Cattle",
    breed: "Holstein-Friesian Cross",
    age: "4.8 Years",
    sex: "Female",
    lactationStage: "Dry period",
    weightKg: 450,
    ownerId: "FARM-03",
    ownerName: "Eknath Shinde",
    village: "Nimgaon",
    district: "Ahmednagar",
    currentHealthStatus: "Active Case",
    healthStatusClass: "urgent",
    activeCaseId: "PH-1027",
    timeline: [
      {
        date: "2026-09-02",
        type: "Case Report",
        title: "Disseminated Nodular Eruptions & Edema",
        vet: "Dr. Anjali Deshmukh",
        notes: "Presumptive LSD. Sternal edema, enlarged prescapular lymph nodes, ocular discharge."
      }
    ]
  },
  {
    id: "KC-00105",
    tagNumber: "IN-MH-CSN-00105",
    name: "Sundari",
    species: "Goat",
    breed: "Osmanabadi",
    age: "2.1 Years",
    sex: "Female",
    lactationStage: "Lactating (Twin kids)",
    weightKg: 34,
    ownerId: "FARM-06",
    ownerName: "Tukaram Pawar",
    village: "Bidkin",
    district: "Chhatrapati Sambhajinagar",
    currentHealthStatus: "Follow-up",
    healthStatusClass: "attention",
    activeCaseId: "PH-1028",
    timeline: [
      {
        date: "2026-09-01",
        type: "Case Report",
        title: "Erosive Stomatitis & Diarrhea",
        vet: "Dr. Anjali Deshmukh",
        notes: "Suspected Peste des Petits Ruminants (PPR). Started Enrofloxacin + supportive electrolyte therapy."
      }
    ]
  },
  {
    id: "KC-00106",
    tagNumber: "IN-MH-KOL-00106",
    name: "Kailash",
    species: "Cattle",
    breed: "Deoni Working Bull",
    age: "6.0 Years",
    sex: "Male",
    lactationStage: "N/A",
    weightKg: 480,
    ownerId: "FARM-04",
    ownerName: "Balasaheb Jadhav",
    village: "Danoli",
    district: "Kolhapur",
    currentHealthStatus: "Active Case",
    healthStatusClass: "urgent",
    activeCaseId: "PH-1029",
    timeline: [
      {
        date: "2026-09-04",
        type: "Case Report",
        title: "Ruptured Interdigital Vesicles & Coronary Lesions",
        vet: "Dr. Anjali Deshmukh",
        notes: "Confirmed Foot-and-Mouth Disease (Type O). Extensive tongue erosions, drooling rope-like saliva. Severe pain on movement."
      }
    ]
  },
  {
    id: "KC-00107",
    tagNumber: "IN-MH-NAS-00107",
    name: "Moti",
    species: "Goat",
    breed: "Berari",
    age: "1.5 Years",
    sex: "Male",
    lactationStage: "N/A",
    weightKg: 28,
    ownerId: "FARM-05",
    ownerName: "Vandana More",
    village: "Pimpalgaon",
    district: "Nashik",
    currentHealthStatus: "Under Review",
    healthStatusClass: "attention",
    activeCaseId: "PH-1030",
    timeline: [
      {
        date: "2026-09-05",
        type: "Case Report",
        title: "Sudden Depression & Greenish Diarrhea",
        vet: "Dr. Anjali Deshmukh",
        notes: "Suspected Enterotoxaemia (Pulpy Kidney) after lush sorghum grazing. Opisthotonos onset."
      }
    ]
  },
  {
    id: "KC-00108",
    tagNumber: "IN-MH-PUN-00108",
    name: "Sita",
    species: "Cattle",
    breed: "Sahiwal Indigenous",
    age: "5.2 Years",
    sex: "Female",
    lactationStage: "Dry",
    weightKg: 410,
    ownerId: "FARM-01",
    ownerName: "Ramesh Patil",
    village: "Rampur",
    district: "Pune",
    currentHealthStatus: "Resolved",
    healthStatusClass: "healthy",
    activeCaseId: null,
    timeline: [
      {
        date: "2026-08-15",
        type: "Vaccination",
        title: "LSD Goat Pox Heterologous Vaccine",
        vet: "Dr. Anjali Deshmukh",
        notes: "Prophylactic ring vaccination conducted in Haveli taluka. Healthy post-injection."
      }
    ]
  },
  {
    id: "KC-00109",
    tagNumber: "IN-MH-KOL-00109",
    name: "Surabhi",
    species: "Buffalo",
    breed: "Jaffarabadi",
    age: "6.5 Years",
    sex: "Female",
    lactationStage: "4th Lactation",
    weightKg: 540,
    ownerId: "FARM-04",
    ownerName: "Balasaheb Jadhav",
    village: "Danoli",
    district: "Kolhapur",
    currentHealthStatus: "Active Case",
    healthStatusClass: "urgent",
    activeCaseId: "PH-1031",
    timeline: [
      {
        date: "2026-09-04",
        type: "Case Report",
        title: "Dyspnea & Submandibular Edema",
        vet: "Dr. Anjali Deshmukh",
        notes: "Suspected Haemorrhagic Septicaemia (Pasteurella multocida). Marked stertorous breathing, hot brisket swelling."
      }
    ]
  },
  {
    id: "KC-00110",
    tagNumber: "IN-MH-NAS-00110",
    name: "Mangala",
    species: "Cattle",
    breed: "Dangi Indigenous",
    age: "3.2 Years",
    sex: "Female",
    lactationStage: "Heifer",
    weightKg: 310,
    ownerId: "FARM-05",
    ownerName: "Vandana More",
    village: "Pimpalgaon",
    district: "Nashik",
    currentHealthStatus: "Follow-up",
    healthStatusClass: "attention",
    activeCaseId: "PH-1032",
    timeline: [
      {
        date: "2026-09-03",
        type: "Case Report",
        title: "Bovine Ephemeral Fever (Three-day Sickness)",
        vet: "Dr. Anjali Deshmukh",
        notes: "Biphasic fever, shifting lameness. Responsive to NSAID (Flunixin Meglumine)."
      }
    ]
  },
  {
    id: "KC-00111",
    tagNumber: "IN-MH-AHM-00111",
    name: "Champu",
    species: "Goat",
    breed: "Sangamneri",
    age: "2.3 Years",
    sex: "Female",
    lactationStage: "Lactating",
    weightKg: 31,
    ownerId: "FARM-03",
    ownerName: "Eknath Shinde",
    village: "Nimgaon",
    district: "Ahmednagar",
    currentHealthStatus: "Resolved",
    healthStatusClass: "healthy",
    activeCaseId: "PH-1033",
    timeline: [
      {
        date: "2026-08-28",
        type: "Case Report",
        title: "Contagious Ecthyma (Orf) Lesions",
        vet: "Dr. Anjali Deshmukh",
        notes: "Crusted proliferative scabs around oral commissures. Treated with glycerine iodine topical wash. Lesions fully healed."
      }
    ]
  },
  {
    id: "KC-00112",
    tagNumber: "IN-MH-SAT-00112",
    name: "Raja",
    species: "Buffalo",
    breed: "Pandharpuri",
    age: "4.0 Years",
    sex: "Male",
    lactationStage: "N/A",
    weightKg: 460,
    ownerId: "FARM-02",
    ownerName: "Sunita Gaikwad",
    village: "Shirwal",
    district: "Satara",
    currentHealthStatus: "Follow-up",
    healthStatusClass: "attention",
    activeCaseId: "PH-1034",
    timeline: [
      {
        date: "2026-09-02",
        type: "Treatment",
        title: "Trypanosomiasis (Surra) Follow-up",
        vet: "Dr. Anjali Deshmukh",
        notes: "Administered Quinpyramine sulphate. Blood smear negative for trypanosomes on day 3 check."
      }
    ]
  }
];

export const initialCases = [
  {
    id: "PH-1024",
    animalId: "KC-00101",
    animalName: "Radha",
    species: "Cattle",
    breed: "Gir Indigenous",
    farmerId: "FARM-01",
    farmerName: "Ramesh Patil",
    farmerPhone: "+91 98231 10423",
    village: "Rampur",
    taluka: "Haveli",
    district: "Pune",
    coordinates: [18.4682, 73.9142],
    suspectedDisease: "Lumpy Skin Disease (LSD)",
    confirmedDisease: "Lumpy Skin Disease (Capripoxvirus)",
    priority: "High Priority",
    priorityLevel: "high", // high, medium, low
    status: "Active", // Active, Under Review, Follow-up, Resolved
    submittedDate: "2026-09-04 08:30 AM",
    lastUpdated: "2026-09-05 09:15 AM",
    symptoms: ["Nodular skin eruptions (2-5cm)", "Rectal Temp: 104.8°F (Fever)", "Enlarged prescapular lymph nodes", "Reduced milk yield (down 60%)", "Ocular & nasal discharge"],
    duration: "4 Days",
    temperature: "104.8°F",
    heartRate: "88 bpm",
    respirationRate: "34 bpm",
    farmerDescription: "Nodules started appearing around the neck 4 days ago. Now spread across the whole body. Radha stopped eating concentrates and milk dropped drastically.",
    exposureHistory: "Grazed in common village pasture near Mutha canal 6 days ago. Other cattle in adjacent hamlet reported similar lumps.",
    photoUrl: "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&q=80&w=600",
    photoCaption: "Clinical presentation: Circumscribed cuticular nodules over the lateral cervical and prescapular region.",
    vetNotes: [
      {
        id: "note-1",
        author: "Dr. Anjali Deshmukh",
        timestamp: "2026-09-04 11:20 AM",
        text: "Tele-triage review: High suspicion of Capripoxvirus LSD. Clinical signs classic. Requested immediate isolation in quarantine pen and topical fly-repellent barrier."
      },
      {
        id: "note-2",
        author: "Dr. Anjali Deshmukh",
        timestamp: "2026-09-05 09:15 AM",
        text: "Skin swab and EDTA whole blood dispatch requested to RDDL Pune. Prescribed parenteral anti-inflammatory + secondary antibiotic coverage."
      }
    ],
    treatmentPlan: {
      diagnosisType: "Confirmed (Clinical Presentation)",
      confirmedDisease: "Lumpy Skin Disease (Capripoxvirus)",
      prescriptions: [
        { medicine: "Meloxicam + Paracetamol (Melonex Plus)", dosage: "15 ml", route: "Intramuscular (IM)", frequency: "Once daily (OD)", duration: "4 Days" },
        { medicine: "Ceftiofur Sodium Inj (Ceftiokem)", dosage: "1 gm (reconstituted)", route: "Intramuscular (IM)", frequency: "Once daily (OD)", duration: "3 Days" },
        { medicine: "Chlorpheniramine Maleate (Anistamin)", dosage: "10 ml", route: "Intramuscular (IM)", frequency: "Twice daily (BD)", duration: "3 Days" },
        { medicine: "Povidone Iodine 5% + Neem Extract spray", dosage: "Liberal wash", route: "Topical application on nodules", frequency: "Twice daily (BD)", duration: "7 Days" }
      ],
      precautions: "Isolate Radha at least 30 meters from rest of herd. Use potassium permanganate (1:1000) foot dips. Spray cypermethrin or neem oil across shed to control vector biting flies (Stomoxys / culicoides). Do not consume raw milk.",
      status: "Prescribed",
      lastPrescribedDate: "2026-09-05 09:30 AM"
    },
    followUp: {
      nextCheckIn: "2026-09-07",
      targetObservation: "Check nodule ulceration & fever subsidence below 102°F",
      assignedTo: "Dr. Anjali Deshmukh"
    }
  },
  {
    id: "PH-1025",
    animalId: "KC-00102",
    animalName: "Lakshmi",
    species: "Buffalo",
    breed: "Murrah",
    farmerId: "FARM-01",
    farmerName: "Ramesh Patil",
    farmerPhone: "+91 98231 10423",
    village: "Rampur",
    taluka: "Haveli",
    district: "Pune",
    coordinates: [18.4720, 73.9180],
    suspectedDisease: "Foot-and-Mouth Disease (FMD) Prodrome",
    confirmedDisease: "Pending Lab Confirmation",
    priority: "High Priority",
    priorityLevel: "high",
    status: "Under Review",
    submittedDate: "2026-09-05 06:45 AM",
    lastUpdated: "2026-09-05 10:00 AM",
    symptoms: ["Reduced appetite (refusing dry fodder)", "Stringy profuse salivation", "Mild dental pad redness", "Rectal Temp: 103.2°F"],
    duration: "24 Hours",
    temperature: "103.2°F",
    heartRate: "72 bpm",
    respirationRate: "28 bpm",
    farmerDescription: "Lakshmi was fine yesterday evening. This morning she refused green fodder and saliva is dripping continuously. She is smacking her lips.",
    exposureHistory: "Shared water trough with visiting pastoral cattle from Shirwal 3 days back.",
    photoUrl: "https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&q=80&w=600",
    photoCaption: "Clinical inspection: Excessive rope-like salivation, early hyperemic oral mucosa.",
    vetNotes: [
      {
        id: "note-1",
        author: "Dr. Anjali Deshmukh",
        timestamp: "2026-09-05 08:15 AM",
        text: "Suspected FMD prodromal stage. Advised farmer to immediately examine interdigital clefts of all hooves for vesicular lesions."
      }
    ],
    treatmentPlan: {
      diagnosisType: "Suspected",
      confirmedDisease: "FMD Early Phase",
      prescriptions: [
        { medicine: "Boro-glycerine (1:4) paste", dosage: "Liberal application", route: "Oral cavity swab", frequency: "Thrice daily (TID)", duration: "5 Days" },
        { medicine: "Flunixin Meglumine (Megludyne)", dosage: "12 ml", route: "Slow Intravenous (IV)", frequency: "Once daily (OD)", duration: "3 Days" }
      ],
      precautions: "Quarantine immediately. Prohibit inter-village animal movement. Disinfect stall floor with 4% sodium carbonate wash.",
      status: "Draft",
      lastPrescribedDate: null
    },
    followUp: {
      nextCheckIn: "2026-09-06",
      targetObservation: "Inspect for vesicular rupture on tongue or coronary band",
      assignedTo: "Dr. Anjali Deshmukh"
    }
  },
  {
    id: "PH-1026",
    animalId: "KC-00103",
    animalName: "Bheema",
    species: "Cattle",
    breed: "Khillari Draft",
    farmerId: "FARM-02",
    farmerName: "Sunita Gaikwad",
    farmerPhone: "+91 94225 78192",
    village: "Shirwal",
    taluka: "Khandala",
    district: "Satara",
    coordinates: [18.1340, 73.9872],
    suspectedDisease: "Black Quarter (BQ - Clostridium chauvoei)",
    confirmedDisease: "Black Quarter (Confirmed by Gram Stain)",
    priority: "High Priority",
    priorityLevel: "high",
    status: "Active",
    submittedDate: "2026-09-04 02:15 PM",
    lastUpdated: "2026-09-05 08:30 AM",
    symptoms: ["Severe unilateral hindleg lameness", "Hot, crepitating gaseous swelling over upper thigh", "High fever: 105.4°F", "Severe toxemia & shivering"],
    duration: "18 Hours",
    temperature: "105.4°F",
    heartRate: "96 bpm",
    respirationRate: "42 bpm",
    farmerDescription: "Bheema was unable to stand this afternoon. His left thigh has a swollen patch that crackles like dry paper when pressed. Very high body heat.",
    exposureHistory: "Heavy unseasonal rain 10 days ago caused soil disturbance in pasture. Unvaccinated yearling bull.",
    photoUrl: "https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&q=80&w=600",
    photoCaption: "Clinical inspection: Crepitating subcutaneous emphysematous swelling on left gluteal mass.",
    vetNotes: [
      {
        id: "note-1",
        author: "Dr. Anjali Deshmukh",
        timestamp: "2026-09-04 04:00 PM",
        text: "Emergency response: High-dose crystalline penicillin initiated intravenously immediately. Surgical incisions placed for tissue aeration."
      }
    ],
    treatmentPlan: {
      diagnosisType: "Confirmed",
      confirmedDisease: "Black Quarter (Clostridium chauvoei)",
      prescriptions: [
        { medicine: "Procaine & Benzylpenicillin (Bistrepen)", dosage: "40 lakh IU", route: "Deep Intramuscular (IM) / Around lesion", frequency: "Twice daily (BD)", duration: "5 Days" },
        { medicine: "Hydrogen Peroxide 3% irrigation", dosage: "50 ml", route: "Topical infiltration into incisions", frequency: "Twice daily (BD)", duration: "3 Days" },
        { medicine: "Ketoprofen Inj", dosage: "15 ml", route: "Intramuscular (IM)", frequency: "Once daily (OD)", duration: "3 Days" }
      ],
      precautions: "Do not move carcass if fatality occurs; deep burial with unslaked lime mandatory. Alert taluka veterinary officer for emergency BQ ring vaccination.",
      status: "Prescribed",
      lastPrescribedDate: "2026-09-04 04:30 PM"
    },
    followUp: {
      nextCheckIn: "2026-09-05",
      targetObservation: "Evaluate crepitus progression and systemic toxicity markers",
      assignedTo: "Dr. Anjali Deshmukh"
    }
  },
  {
    id: "PH-1027",
    animalId: "KC-00104",
    animalName: "Gauri",
    species: "Cattle",
    breed: "HF Cross",
    farmerId: "FARM-03",
    farmerName: "Eknath Shinde",
    farmerPhone: "+91 98902 33418",
    village: "Nimgaon",
    taluka: "Karjat",
    district: "Ahmednagar",
    coordinates: [18.9100, 75.0100],
    suspectedDisease: "Lumpy Skin Disease (Severe Cutaneous & Respiratory)",
    confirmedDisease: "Lumpy Skin Disease",
    priority: "High Priority",
    priorityLevel: "high",
    status: "Active",
    submittedDate: "2026-09-03 11:10 AM",
    lastUpdated: "2026-09-05 07:45 AM",
    symptoms: ["Generalized nodular eruptions (>80 lesions)", "Sternal and brisket edema", "Pneumonic rales & cough", "Rectal Temp: 104.2°F"],
    duration: "5 Days",
    temperature: "104.2°F",
    heartRate: "84 bpm",
    respirationRate: "38 bpm",
    farmerDescription: "The cow has lumps everywhere including udder and legs. Forelegs are swollen and she has trouble breathing.",
    exposureHistory: "Farmer purchased crossbred calf from Shrigonda cattle market 12 days ago without quarantine.",
    photoUrl: "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&q=80&w=600",
    photoCaption: "Disseminated cutaneous nodules with ventral brisket edema.",
    vetNotes: [
      {
        id: "note-1",
        author: "Dr. Anjali Deshmukh",
        timestamp: "2026-09-03 01:30 PM",
        text: "Severe case with secondary bacterial bronchopneumonia complication. Intensified antimicrobial therapy required."
      }
    ],
    treatmentPlan: {
      diagnosisType: "Confirmed",
      confirmedDisease: "Lumpy Skin Disease (Capripoxvirus) with secondary pneumonia",
      prescriptions: [
        { medicine: "Marbofloxacin 10% (Marbocyl)", dosage: "8 ml", route: "Intramuscular (IM)", frequency: "Once daily (OD)", duration: "5 Days" },
        { medicine: "Isoflupredone Acetate (Isoflupred)", dosage: "5 ml", route: "Intramuscular (IM)", frequency: "Single dose", duration: "1 Day" },
        { medicine: "Ascorbic Acid (Vitamin C Inj)", dosage: "20 ml", route: "Slow Intravenous (IV)", frequency: "Once daily (OD)", duration: "4 Days" }
      ],
      precautions: "Isolate in shaded, dry pen. Soft green fodder feeding. Keep cattle tick-free.",
      status: "Prescribed",
      lastPrescribedDate: "2026-09-03 02:00 PM"
    },
    followUp: {
      nextCheckIn: "2026-09-06",
      targetObservation: "Check thoracic auscultation and regression of brisket edema",
      assignedTo: "Dr. Anjali Deshmukh"
    }
  },
  {
    id: "PH-1028",
    animalId: "KC-00105",
    animalName: "Sundari",
    species: "Goat",
    breed: "Osmanabadi",
    farmerId: "FARM-06",
    farmerName: "Tukaram Pawar",
    farmerPhone: "+91 98218 66490",
    village: "Bidkin",
    taluka: "Paithan",
    district: "Chhatrapati Sambhajinagar",
    coordinates: [19.6800, 75.3200],
    suspectedDisease: "Peste des Petits Ruminants (PPR - Goat Plague)",
    confirmedDisease: "PPR Suspected",
    priority: "Medium Priority",
    priorityLevel: "medium",
    status: "Follow-up",
    submittedDate: "2026-09-01 09:40 AM",
    lastUpdated: "2026-09-04 04:15 PM",
    symptoms: ["Erosive stomatitis (mouth ulcers)", "Muco-purulent ocular & nasal discharge", "Profuse foul-smelling diarrhea", "Rectal Temp: 103.8°F"],
    duration: "4 Days",
    temperature: "103.8°F",
    heartRate: "110 bpm",
    respirationRate: "46 bpm",
    farmerDescription: "Goat has painful sores inside her lips and can't nurse her kids. Watery yellowish stool since yesterday.",
    exposureHistory: "Pastured alongside mixed nomadic sheep flock traveling toward Beed district border.",
    photoUrl: "https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&q=80&w=600",
    photoCaption: "Necrotic stomatitis lesions with crusty encrustations on mouth commissures.",
    vetNotes: [
      {
        id: "note-1",
        author: "Dr. Anjali Deshmukh",
        timestamp: "2026-09-01 11:00 AM",
        text: "PPR suspected. Prescribed Enrofloxacin + electrolyte replenishment. Advised isolating kids and providing artificial colostrum/milk replacer."
      },
      {
        id: "note-2",
        author: "Dr. Anjali Deshmukh",
        timestamp: "2026-09-04 04:15 PM",
        text: "Follow-up report: Diarrhea stabilized. Ulcers showing granulation tissue. Temp down to 102.4°F."
      }
    ],
    treatmentPlan: {
      diagnosisType: "Suspected",
      confirmedDisease: "Peste des Petits Ruminants (PPR)",
      prescriptions: [
        { medicine: "Enrofloxacin 10% (Baytril)", dosage: "2.5 ml", route: "Subcutaneous (SC)", frequency: "Once daily (OD)", duration: "4 Days" },
        { medicine: "Oral Electrolyte Powder (Electral Vet)", dosage: "30 gm in 1L warm water", route: "Oral drenching", frequency: "Twice daily (BD)", duration: "5 Days" },
        { medicine: "B-Complex + Liver Extract (Belamyl)", dosage: "2 ml", route: "Intramuscular (IM)", frequency: "Alternate days", duration: "3 Doses" }
      ],
      precautions: "Herd quarantine. Alert local panchayat. Prohibit goat sales at weekly bazaar.",
      status: "Prescribed",
      lastPrescribedDate: "2026-09-01 11:30 AM"
    },
    followUp: {
      nextCheckIn: "2026-09-06",
      targetObservation: "Complete resolution of mouth erosions; discharge from follow-up",
      assignedTo: "Dr. Anjali Deshmukh"
    }
  },
  {
    id: "PH-1029",
    animalId: "KC-00106",
    animalName: "Kailash",
    species: "Cattle",
    breed: "Deoni",
    farmerId: "FARM-04",
    farmerName: "Balasaheb Jadhav",
    farmerPhone: "+91 91584 90212",
    village: "Danoli",
    taluka: "Shirol",
    district: "Kolhapur",
    coordinates: [16.7450, 74.5200],
    suspectedDisease: "Foot-and-Mouth Disease (FMD Type O)",
    confirmedDisease: "FMD Type O (Confirmed by ELISA at RDDL)",
    priority: "High Priority",
    priorityLevel: "high",
    status: "Active",
    submittedDate: "2026-09-04 03:00 PM",
    lastUpdated: "2026-09-05 08:00 AM",
    symptoms: ["Ruptured interdigital vesicles", "Excessive frothy salivation", "Severe foot soreness (reluctant to bear weight)", "Rectal Temp: 104.5°F"],
    duration: "3 Days",
    temperature: "104.5°F",
    heartRate: "86 bpm",
    respirationRate: "32 bpm",
    farmerDescription: "Bullock cannot walk to the field. He keeps lifting his feet alternately and saliva is foaming at his mouth.",
    exposureHistory: "Shirol block is bordering Karnataka livestock transit route; multiple villages report foot lesions.",
    photoUrl: "https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&q=80&w=600",
    photoCaption: "Erosive ulceration in the interdigital space with secondary myiasis risk.",
    vetNotes: [
      {
        id: "note-1",
        author: "Dr. Anjali Deshmukh",
        timestamp: "2026-09-04 05:00 PM",
        text: "Confirmed FMD. Footbath with 2% copper sulphate recommended twice daily. Topical fly repellant lotion to prevent maggot infestation."
      }
    ],
    treatmentPlan: {
      diagnosisType: "Confirmed",
      confirmedDisease: "Foot-and-Mouth Disease (Type O)",
      prescriptions: [
        { medicine: "Copper Sulphate 2% Footbath", dosage: "Dip for 3 minutes", route: "External foot dip", frequency: "Twice daily (BD)", duration: "7 Days" },
        { medicine: "Flunixin Meglumine", dosage: "15 ml", route: "Intramuscular (IM)", frequency: "Once daily (OD)", duration: "3 Days" },
        { medicine: "Gamma Benzene Hexachloride & Proflavine (Lorexane spray)", dosage: "Spray on hoof lesions", route: "Topical", frequency: "Twice daily (BD)", duration: "5 Days" }
      ],
      precautions: "Strict standstill order for all cloven-hoofed animals in Danoli village for 21 days. Ring vaccination within 5km radius.",
      status: "Prescribed",
      lastPrescribedDate: "2026-09-04 05:30 PM"
    },
    followUp: {
      nextCheckIn: "2026-09-07",
      targetObservation: "Healing of interdigital lesions; check for secondary myiasis",
      assignedTo: "Dr. Anjali Deshmukh"
    }
  },
  {
    id: "PH-1030",
    animalId: "KC-00107",
    animalName: "Moti",
    species: "Goat",
    breed: "Berari",
    farmerId: "FARM-05",
    farmerName: "Vandana More",
    farmerPhone: "+91 97631 84520",
    village: "Pimpalgaon",
    taluka: "Niphad",
    district: "Nashik",
    coordinates: [20.1700, 73.9800],
    suspectedDisease: "Enterotoxaemia (Clostridium perfringens Type D)",
    confirmedDisease: "Under Laboratory Analysis",
    priority: "Medium Priority",
    priorityLevel: "medium",
    status: "Under Review",
    submittedDate: "2026-09-05 07:15 AM",
    lastUpdated: "2026-09-05 09:45 AM",
    symptoms: ["Sudden severe depression", "Teeth grinding & head pressing", "Profuse pasty green diarrhea with mucus", "Rectal Temp: 101.8°F (Subnormal)"],
    duration: "12 Hours",
    temperature: "101.8°F",
    heartRate: "125 bpm",
    respirationRate: "48 bpm",
    farmerDescription: "Moti was grazing in the fresh sorghum field yesterday. This morning he was lying down, grinding his teeth and has dirty diarrhea.",
    exposureHistory: "Sudden shift from dry stall-feed to lush carbohydrate-rich fodder.",
    photoUrl: "https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&q=80&w=600",
    photoCaption: "Opisthotonos posture with nervous depression.",
    vetNotes: [
      {
        id: "note-1",
        author: "Dr. Anjali Deshmukh",
        timestamp: "2026-09-05 08:30 AM",
        text: "Triage note: Classical Enterotoxaemia presentation following carbohydrate overload. Urine sample requested to test for glucosuria."
      }
    ],
    treatmentPlan: {
      diagnosisType: "Suspected",
      confirmedDisease: "Enterotoxaemia (Type D)",
      prescriptions: [
        { medicine: "Clostridium perfringens Type D Antiserum", dosage: "20 ml", route: "Subcutaneous (SC)", frequency: "Immediate single dose", duration: "1 Day" },
        { medicine: "Oxytetracycline (Terramycin LA)", dosage: "3 ml", route: "Intramuscular (IM)", frequency: "Single dose", duration: "1 Day" },
        { medicine: "Activated Charcoal Suspension", dosage: "20 gm in water", route: "Oral drench", frequency: "Once", duration: "1 Day" }
      ],
      precautions: "Withdraw concentrates immediately. Provide high-fiber roughage only. Restrict grazing on fresh sprouted shoots.",
      status: "Draft",
      lastPrescribedDate: null
    },
    followUp: {
      nextCheckIn: "2026-09-05",
      targetObservation: "Assess recovery from nervous signs within 6 hours",
      assignedTo: "Dr. Anjali Deshmukh"
    }
  },
  {
    id: "PH-1031",
    animalId: "KC-00109",
    animalName: "Surabhi",
    species: "Buffalo",
    breed: "Jaffarabadi",
    farmerId: "FARM-04",
    farmerName: "Balasaheb Jadhav",
    farmerPhone: "+91 91584 90212",
    village: "Danoli",
    taluka: "Shirol",
    district: "Kolhapur",
    coordinates: [16.7500, 74.5250],
    suspectedDisease: "Haemorrhagic Septicaemia (HS - Galghotu)",
    confirmedDisease: "Haemorrhagic Septicaemia (Pasteurella multocida B:2)",
    priority: "High Priority",
    priorityLevel: "high",
    status: "Active",
    submittedDate: "2026-09-04 06:10 PM",
    lastUpdated: "2026-09-05 08:45 AM",
    symptoms: ["Severe stertorous / snoring breathing", "Hot, painful submandibular & throat edema", "Rectal Temp: 106.1°F (Hyperpyrexia)", "Tongue protrusion & cyanosis"],
    duration: "16 Hours",
    temperature: "106.1°F",
    heartRate: "104 bpm",
    respirationRate: "52 bpm",
    farmerDescription: "Her throat is swollen up like a pillow. She is snoring loudly while breathing and tongue is sticking out. Very fearful condition.",
    exposureHistory: "Waterlogged marsh pasture following heavy Panchaganga river catchment floods.",
    photoUrl: "https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&q=80&w=600",
    photoCaption: "Marked inflammatory submandibular edema causing airway compression.",
    vetNotes: [
      {
        id: "note-1",
        author: "Dr. Anjali Deshmukh",
        timestamp: "2026-09-04 07:30 PM",
        text: "Critical acute HS case. Initiated Ceftiofur sodium IV + Dexamethasone to relieve impending asphyxia."
      }
    ],
    treatmentPlan: {
      diagnosisType: "Confirmed",
      confirmedDisease: "Haemorrhagic Septicaemia",
      prescriptions: [
        { medicine: "Ceftiofur Sodium Inj (Xyrofur)", dosage: "2 gm IV", route: "Intravenous (IV)", frequency: "Twice daily (BD)", duration: "4 Days" },
        { medicine: "Dexamethasone Sodium Phosphate", dosage: "10 ml", route: "Intravenous (IV)", frequency: "Single anti-shock dose", duration: "1 Day" },
        { medicine: "Flunixin Meglumine", dosage: "15 ml", route: "Intramuscular (IM)", frequency: "Once daily (OD)", duration: "3 Days" }
      ],
      precautions: "Emergency alert to taluka surveillance cell. Check all animals in the shed for febrile onset. Vaccinate incontact animals immediately.",
      status: "Prescribed",
      lastPrescribedDate: "2026-09-04 07:45 PM"
    },
    followUp: {
      nextCheckIn: "2026-09-05",
      targetObservation: "Relief of laryngeal obstruction and reduction of throat edema",
      assignedTo: "Dr. Anjali Deshmukh"
    }
  },
  {
    id: "PH-1032",
    animalId: "KC-00110",
    animalName: "Mangala",
    species: "Cattle",
    breed: "Dangi Indigenous",
    farmerId: "FARM-05",
    farmerName: "Vandana More",
    farmerPhone: "+91 97631 84520",
    village: "Pimpalgaon",
    taluka: "Niphad",
    district: "Nashik",
    coordinates: [20.1720, 73.9850],
    suspectedDisease: "Bovine Ephemeral Fever (Three-day Sickness)",
    confirmedDisease: "Bovine Ephemeral Fever",
    priority: "Medium Priority",
    priorityLevel: "medium",
    status: "Follow-up",
    submittedDate: "2026-09-03 04:20 PM",
    lastUpdated: "2026-09-05 09:10 AM",
    symptoms: ["Biphasic fever curve (104.4°F)", "Shifting leg stiffness & lameness", "Muscular tremors & recumbency", "Rapid recovery following NSAID"],
    duration: "48 Hours",
    temperature: "102.1°F (Post-treatment)",
    heartRate: "70 bpm",
    respirationRate: "24 bpm",
    farmerDescription: "Mangala could not stand yesterday and was shaking. After the injection given yesterday she stood up today and is chewing cud.",
    exposureHistory: "Pastured near Godavari riverbanks with high midge (Culicoides) vector density.",
    photoUrl: "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&q=80&w=600",
    photoCaption: "Patient standing and alert during follow-up inspection.",
    vetNotes: [
      {
        id: "note-1",
        author: "Dr. Anjali Deshmukh",
        timestamp: "2026-09-05 09:10 AM",
        text: "Marked clinical improvement. Animal ambulatory, normal rumination resumed. Continue oral NSAID for 24 hours."
      }
    ],
    treatmentPlan: {
      diagnosisType: "Confirmed",
      confirmedDisease: "Bovine Ephemeral Fever",
      prescriptions: [
        { medicine: "Meloxicam oral bolus (Melonex)", dosage: "100 mg", route: "Oral", frequency: "Once daily (OD)", duration: "2 Days" },
        { medicine: "Calcium & Vitamin D3 oral gel", dosage: "300 gm tube", route: "Oral drench", frequency: "Single dose", duration: "1 Day" }
      ],
      precautions: "Maintain fly screens in stall. Ensure clean bedding.",
      status: "Prescribed",
      lastPrescribedDate: "2026-09-03 05:00 PM"
    },
    followUp: {
      nextCheckIn: "2026-09-06",
      targetObservation: "Confirm no relapse; close case",
      assignedTo: "Dr. Anjali Deshmukh"
    }
  },
  {
    id: "PH-1033",
    animalId: "KC-00111",
    animalName: "Champu",
    species: "Goat",
    breed: "Sangamneri",
    farmerId: "FARM-03",
    farmerName: "Eknath Shinde",
    farmerPhone: "+91 98902 33418",
    village: "Nimgaon",
    taluka: "Karjat",
    district: "Ahmednagar",
    coordinates: [18.9120, 75.0120],
    suspectedDisease: "Contagious Ecthyma (Orf)",
    confirmedDisease: "Contagious Ecthyma",
    priority: "Low Priority",
    priorityLevel: "low",
    status: "Resolved",
    submittedDate: "2026-08-28 10:15 AM",
    lastUpdated: "2026-09-04 11:00 AM",
    symptoms: ["Crusted proliferative lesions on lips", "Mild weight loss", "Normal rectal temperature (102.2°F)"],
    duration: "10 Days",
    temperature: "102.2°F",
    heartRate: "82 bpm",
    respirationRate: "26 bpm",
    farmerDescription: "Scabs around lips have completely dried up and fallen off. Champu is eating grains eagerly.",
    exposureHistory: "Graze among thorny bushes where minor oral abrasions triggered Parapoxvirus entry.",
    photoUrl: "https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&q=80&w=600",
    photoCaption: "Post-recovery: Lip mucosa clear without residual scabbing.",
    vetNotes: [
      {
        id: "note-1",
        author: "Dr. Anjali Deshmukh",
        timestamp: "2026-09-04 11:00 AM",
        text: "Case resolved. Scabs cleared. No secondary infections detected. Animal declared clinically healthy."
      }
    ],
    treatmentPlan: {
      diagnosisType: "Confirmed",
      confirmedDisease: "Contagious Ecthyma",
      prescriptions: [
        { medicine: "Glycerine + Povidone Iodine 10%", dosage: "Topical paint", route: "Oral lips paint", frequency: "Twice daily", duration: "Completed" }
      ],
      precautions: "Zoonotic caution: Use rubber gloves when handling lesions.",
      status: "Completed",
      lastPrescribedDate: "2026-08-28 11:00 AM"
    },
    followUp: {
      nextCheckIn: "Case Closed",
      targetObservation: "Resolved",
      assignedTo: "Dr. Anjali Deshmukh"
    }
  },
  {
    id: "PH-1034",
    animalId: "KC-00112",
    animalName: "Raja",
    species: "Buffalo",
    breed: "Pandharpuri",
    farmerId: "FARM-02",
    farmerName: "Sunita Gaikwad",
    farmerPhone: "+91 94225 78192",
    village: "Shirwal",
    taluka: "Khandala",
    district: "Satara",
    coordinates: [18.1360, 73.9900],
    suspectedDisease: "Trypanosomiasis (Surra - Trypanosoma evansi)",
    confirmedDisease: "Trypanosomiasis",
    priority: "Medium Priority",
    priorityLevel: "medium",
    status: "Follow-up",
    submittedDate: "2026-09-02 01:20 PM",
    lastUpdated: "2026-09-04 03:30 PM",
    symptoms: ["Intermittent recurrent fever (103.5°F)", "Progressive emaciation & anemia", "Petechial hemorrhages on conjunctiva"],
    duration: "7 Days",
    temperature: "102.6°F",
    heartRate: "68 bpm",
    respirationRate: "22 bpm",
    farmerDescription: "Raja has been losing flesh steadily despite good feeding. Eyes are pale.",
    exposureHistory: "High Tabanus (horse fly) population around sugarcane fields.",
    photoUrl: "https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&q=80&w=600",
    photoCaption: "Conjunctival examination showing pale mucous membrane with petechiae.",
    vetNotes: [
      {
        id: "note-1",
        author: "Dr. Anjali Deshmukh",
        timestamp: "2026-09-04 03:30 PM",
        text: "Wet blood film examined: Trypanosomes absent post-triquin therapy. Continue iron tonic."
      }
    ],
    treatmentPlan: {
      diagnosisType: "Confirmed",
      confirmedDisease: "Trypanosomiasis",
      prescriptions: [
        { medicine: "Quinpyramine sulphate & chloride (Triquin)", dosage: "2 gm s/c", route: "Subcutaneous (SC)", frequency: "Single dose", duration: "Completed" },
        { medicine: "Iron Dextran + Cyanocobalamin Inj (Imferon Vet)", dosage: "10 ml", route: "Deep IM", frequency: "Twice weekly", duration: "2 Weeks" }
      ],
      precautions: "Control Tabanid flies with deltamethrin shed spray.",
      status: "Prescribed",
      lastPrescribedDate: "2026-09-02 02:00 PM"
    },
    followUp: {
      nextCheckIn: "2026-09-09",
      targetObservation: "Check repeat peripheral blood smear for trypanosomes",
      assignedTo: "Dr. Anjali Deshmukh"
    }
  },
  {
    id: "PH-1035",
    animalId: "KC-00101",
    animalName: "Karan (Calf)",
    species: "Cattle",
    breed: "Gir Indigenous",
    farmerId: "FARM-01",
    farmerName: "Ramesh Patil",
    farmerPhone: "+91 98231 10423",
    village: "Rampur",
    taluka: "Haveli",
    district: "Pune",
    coordinates: [18.4690, 73.9160],
    suspectedDisease: "Lumpy Skin Disease (Early Contact)",
    confirmedDisease: "Pending Lab Confirmation",
    priority: "Medium Priority",
    priorityLevel: "medium",
    status: "Under Review",
    submittedDate: "2026-09-05 08:00 AM",
    lastUpdated: "2026-09-05 10:15 AM",
    symptoms: ["Mild temperature elevation: 103.1°F", "Two small papules on inner ear flap", "Dull demeanor"],
    duration: "1 Day",
    temperature: "103.1°F",
    heartRate: "90 bpm",
    respirationRate: "30 bpm",
    farmerDescription: "Radha's calf is feeling warm today. I saw 2 tiny bumps inside his ear.",
    exposureHistory: "Nursing calf kept alongside LSD-infected dam Radha.",
    photoUrl: "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&q=80&w=600",
    photoCaption: "Early intradermal micro-papules on inner pinna.",
    vetNotes: [
      {
        id: "note-1",
        author: "Dr. Anjali Deshmukh",
        timestamp: "2026-09-05 10:15 AM",
        text: "High risk contact transmission. Wean calf temporarily onto boiled cow milk. Prescribed supportive immune boosters."
      }
    ],
    treatmentPlan: {
      diagnosisType: "Suspected",
      confirmedDisease: "Lumpy Skin Disease Contact Phase",
      prescriptions: [
        { medicine: "Levamisole Hydrochloride (Immune-stimulant dose)", dosage: "2.5 mg/kg oral", route: "Oral drench", frequency: "Single dose", duration: "1 Day" },
        { medicine: "Paracetamol syrup", dosage: "15 ml", route: "Oral", frequency: "Twice daily", duration: "3 Days" }
      ],
      precautions: "Isolate calf immediately. Clean bedding.",
      status: "Draft",
      lastPrescribedDate: null
    },
    followUp: {
      nextCheckIn: "2026-09-06",
      targetObservation: "Check if generalized cutaneous nodules appear",
      assignedTo: "Dr. Anjali Deshmukh"
    }
  },
  {
    id: "PH-1036",
    animalId: "KC-00106",
    animalName: "Nandi",
    species: "Cattle",
    breed: "Khillari",
    farmerId: "FARM-04",
    farmerName: "Balasaheb Jadhav",
    farmerPhone: "+91 91584 90212",
    village: "Danoli",
    taluka: "Shirol",
    district: "Kolhapur",
    coordinates: [16.7480, 74.5220],
    suspectedDisease: "Foot-and-Mouth Disease (FMD)",
    confirmedDisease: "FMD Type O",
    priority: "High Priority",
    priorityLevel: "high",
    status: "Active",
    submittedDate: "2026-09-05 06:00 AM",
    lastUpdated: "2026-09-05 09:30 AM",
    symptoms: ["Salivation & lip smacking", "Interdigital sores", "Temp: 104.1°F"],
    duration: "24 Hours",
    temperature: "104.1°F",
    heartRate: "82 bpm",
    respirationRate: "30 bpm",
    farmerDescription: "Second bullock in my team has started showing the exact same sores as Kailash.",
    exposureHistory: "Paired bullock sharing yoke with Kailash (PH-1029).",
    photoUrl: "https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&q=80&w=600",
    photoCaption: "Early blister on upper lip mucosa.",
    vetNotes: [
      {
        id: "note-1",
        author: "Dr. Anjali Deshmukh",
        timestamp: "2026-09-05 09:30 AM",
        text: "Confirmed cross-infection. Applied same therapeutic regimen as Kailash."
      }
    ],
    treatmentPlan: {
      diagnosisType: "Confirmed",
      confirmedDisease: "Foot-and-Mouth Disease (Type O)",
      prescriptions: [
        { medicine: "Copper Sulphate 2% Footbath", dosage: "Dip twice daily", route: "Topical", frequency: "BD", duration: "7 Days" },
        { medicine: "Meloxicam Inj", dosage: "15 ml", route: "IM", frequency: "OD", duration: "3 Days" }
      ],
      precautions: "Do not move outside shed.",
      status: "Prescribed",
      lastPrescribedDate: "2026-09-05 09:35 AM"
    },
    followUp: {
      nextCheckIn: "2026-09-07",
      targetObservation: "Check ulcer progression",
      assignedTo: "Dr. Anjali Deshmukh"
    }
  },
  {
    id: "PH-1037",
    animalId: "KC-00108",
    animalName: "Kalu",
    species: "Buffalo",
    breed: "Murrah",
    farmerId: "FARM-03",
    farmerName: "Eknath Shinde",
    farmerPhone: "+91 98902 33418",
    village: "Nimgaon",
    taluka: "Karjat",
    district: "Ahmednagar",
    coordinates: [18.9150, 75.0150],
    suspectedDisease: "Haemorrhagic Septicaemia (Sentinel alert)",
    confirmedDisease: "Under Review",
    priority: "High Priority",
    priorityLevel: "high",
    status: "Active",
    submittedDate: "2026-09-05 08:45 AM",
    lastUpdated: "2026-09-05 10:30 AM",
    symptoms: ["Sudden fever 105.1°F", "Early grunting breath", "Salivation"],
    duration: "8 Hours",
    temperature: "105.1°F",
    heartRate: "92 bpm",
    respirationRate: "44 bpm",
    farmerDescription: "Buffalo was breathing heavily and refused to drink water this morning.",
    exposureHistory: "Pastured in flood-receding soil.",
    photoUrl: "https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&q=80&w=600",
    photoCaption: "Early submandibular thickening.",
    vetNotes: [
      {
        id: "note-1",
        author: "Dr. Anjali Deshmukh",
        timestamp: "2026-09-05 10:30 AM",
        text: "High alert in Ahmednagar corridor. Prescribed emergency IV antibiotic."
      }
    ],
    treatmentPlan: {
      diagnosisType: "Suspected",
      confirmedDisease: "Haemorrhagic Septicaemia",
      prescriptions: [
        { medicine: "Ceftiofur Sodium Inj", dosage: "2 gm IV", route: "IV", frequency: "BD", duration: "3 Days" }
      ],
      precautions: "Isolate buffalo. Alert livestock development officer.",
      status: "Prescribed",
      lastPrescribedDate: "2026-09-05 10:35 AM"
    },
    followUp: {
      nextCheckIn: "2026-09-05",
      targetObservation: "Check fever curve after 6 hours",
      assignedTo: "Dr. Anjali Deshmukh"
    }
  },
  {
    id: "PH-1038",
    animalId: "KC-00105",
    animalName: "Rani",
    species: "Goat",
    breed: "Osmanabadi",
    farmerId: "FARM-06",
    farmerName: "Tukaram Pawar",
    farmerPhone: "+91 98218 66490",
    village: "Bidkin",
    taluka: "Paithan",
    district: "Chhatrapati Sambhajinagar",
    coordinates: [19.6820, 75.3240],
    suspectedDisease: "PPR / Contagious Caprine Pleuropneumonia",
    confirmedDisease: "PPR Suspected",
    priority: "Low Priority",
    priorityLevel: "low",
    status: "Resolved",
    submittedDate: "2026-08-25 09:00 AM",
    lastUpdated: "2026-09-02 02:00 PM",
    symptoms: ["Transient ocular discharge", "Temp 103.0°F", "Cough"],
    duration: "7 Days",
    temperature: "102.0°F",
    heartRate: "80 bpm",
    respirationRate: "24 bpm",
    farmerDescription: "Rani had mild coughing last week, now completely recovered after supportive syrup.",
    exposureHistory: "Grazed with local village flock.",
    photoUrl: "https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&q=80&w=600",
    photoCaption: "Goat alert and ruminating normally.",
    vetNotes: [
      {
        id: "note-1",
        author: "Dr. Anjali Deshmukh",
        timestamp: "2026-09-02 02:00 PM",
        text: "Complete clinical recovery confirmed. Case closed."
      }
    ],
    treatmentPlan: {
      diagnosisType: "Confirmed",
      confirmedDisease: "Mild Caprine Respiratory Syndrome",
      prescriptions: [
        { medicine: "Ambroxol + Terbutaline syrup", dosage: "10 ml", route: "Oral", frequency: "BD", duration: "Completed" }
      ],
      precautions: "Routine deworming scheduled.",
      status: "Completed",
      lastPrescribedDate: "2026-08-25 10:00 AM"
    },
    followUp: {
      nextCheckIn: "Case Closed",
      targetObservation: "Resolved",
      assignedTo: "Dr. Anjali Deshmukh"
    }
  }
];

// Area Disease Alerts across Maharashtra Districts
export const areaAlertsData = [
  {
    id: "ALT-MH-01",
    district: "Pune",
    talukas: ["Haveli", "Daund", "Shirur", "Indapur"],
    disease: "Lumpy Skin Disease (LSD)",
    riskLevel: "HIGH RISK",
    riskSeverity: "high", // high, medium, low
    activeCases: 42,
    affectedAnimals: 185,
    firstDetected: "2026-08-24",
    lastUpdated: "2026-09-05 09:30 AM",
    alertStatus: "Active Outbreak Cluster",
    acknowledged: false,
    coordinates: [18.5204, 73.8567],
    radiusKm: 28,
    transmissionVector: "Biting insects (Culicoides / Stomoxys) & shared pastures",
    recommendedAction: "Mandatory ring vaccination in 10km buffer zone. Ban animal gatherings and cattle markets in Haveli & Daund blocks.",
    trend: "Increasing (+18% this week)"
  },
  {
    id: "ALT-MH-02",
    district: "Kolhapur",
    talukas: ["Shirol", "Hatkanangle", "Karveer"],
    disease: "Foot-and-Mouth Disease (FMD)",
    riskLevel: "HIGH RISK",
    riskSeverity: "high",
    activeCases: 31,
    affectedAnimals: 120,
    firstDetected: "2026-08-29",
    lastUpdated: "2026-09-05 08:45 AM",
    alertStatus: "Active Outbreak Cluster",
    acknowledged: false,
    coordinates: [16.7050, 74.2433],
    radiusKm: 24,
    transmissionVector: "Aerosol droplets, milk collection centers, fodder transit",
    recommendedAction: "Establish animal disinfection checkpoints on interstate highway NH-48. Daily surveillance of dairy cooperative herds.",
    trend: "Peaking"
  },
  {
    id: "ALT-MH-03",
    district: "Ahmednagar",
    talukas: ["Karjat", "Rahata", "Sangamner", "Shrigonda"],
    disease: "Haemorrhagic Septicaemia (HS)",
    riskLevel: "HIGH RISK",
    riskSeverity: "high",
    activeCases: 23,
    affectedAnimals: 92,
    firstDetected: "2026-08-30",
    lastUpdated: "2026-09-05 07:15 AM",
    alertStatus: "Active Outbreak Cluster",
    acknowledged: true,
    coordinates: [19.0948, 74.7480],
    radiusKm: 22,
    transmissionVector: "Ingestion of contaminated marsh feed & uncleaned water troughs",
    recommendedAction: "Emergency ring vaccination of all buffaloes in Godavari canal command area. Immediate administration of prophylactic broad-spectrum antibiotics.",
    trend: "Increasing (+12% this week)"
  },
  {
    id: "ALT-MH-04",
    district: "Satara",
    talukas: ["Khandala", "Wai", "Phaltan"],
    disease: "Black Quarter (BQ)",
    riskLevel: "MEDIUM RISK",
    riskSeverity: "medium",
    activeCases: 14,
    affectedAnimals: 65,
    firstDetected: "2026-09-01",
    lastUpdated: "2026-09-04 06:00 PM",
    alertStatus: "Contained Watch",
    acknowledged: true,
    coordinates: [17.6805, 74.0183],
    radiusKm: 18,
    transmissionVector: "Soil spores activated by waterlogged fields; wound entry",
    recommendedAction: "Vaccinate unvaccinated calves and yearlings (6 months - 2 years). Cauterize and bury any deceased carcasses with lime.",
    trend: "Stable"
  },
  {
    id: "ALT-MH-05",
    district: "Chhatrapati Sambhajinagar",
    talukas: ["Paithan", "Gangapur", "Vaijapur"],
    disease: "Peste des Petits Ruminants (PPR)",
    riskLevel: "MEDIUM RISK",
    riskSeverity: "medium",
    activeCases: 19,
    affectedAnimals: 140,
    firstDetected: "2026-08-28",
    lastUpdated: "2026-09-04 03:00 PM",
    alertStatus: "Active Surveillance",
    acknowledged: false,
    coordinates: [19.8762, 75.3433],
    radiusKm: 20,
    transmissionVector: "Direct flock co-mingling in roadside grazing corridors",
    recommendedAction: "Mass Sungri 96 PPR vaccination of migratory goat herds. Strict barrier isolation of symptomatic kids.",
    trend: "Decreasing (-8% this week)"
  },
  {
    id: "ALT-MH-06",
    district: "Amravati",
    talukas: ["Morshi", "Warud", "Achalpur"],
    disease: "Anthrax (Suspected Sentinel)",
    riskLevel: "LOW RISK",
    riskSeverity: "low",
    activeCases: 3,
    affectedAnimals: 18,
    firstDetected: "2026-09-02",
    lastUpdated: "2026-09-04 11:30 AM",
    alertStatus: "Sentinel Monitoring",
    acknowledged: true,
    coordinates: [20.9374, 77.7796],
    radiusKm: 15,
    transmissionVector: "Alkaline soil spore reservoir",
    recommendedAction: "Prohibit post-mortem of sudden unexplained deaths. Blood smear stained with polychrome methylene blue for McFadyean capsule reaction.",
    trend: "Contained"
  },
  {
    id: "ALT-MH-07",
    district: "Nashik",
    talukas: ["Niphad", "Sinnar", "Yeola"],
    disease: "Bovine Ephemeral Fever & Enterotoxaemia",
    riskLevel: "LOW RISK",
    riskSeverity: "low",
    activeCases: 8,
    affectedAnimals: 45,
    firstDetected: "2026-09-02",
    lastUpdated: "2026-09-05 08:30 AM",
    alertStatus: "Monitoring",
    acknowledged: false,
    coordinates: [20.0110, 73.7900],
    radiusKm: 18,
    transmissionVector: "Culicoides midges & abrupt green fodder flush",
    recommendedAction: "Shed insecticide spray and dietary transition management.",
    trend: "Stable"
  }
];

// District centroid coordinates for Maharashtra GIS map markers & zoom actions
export const districtCentroids = {
  "Pune": [18.5204, 73.8567],
  "Satara": [17.6805, 74.0183],
  "Kolhapur": [16.7050, 74.2433],
  "Ahmednagar": [19.0948, 74.7480],
  "Nashik": [20.0110, 73.7900],
  "Chhatrapati Sambhajinagar": [19.8762, 75.3433],
  "Aurangabad": [19.8762, 75.3433],
  "Amravati": [20.9374, 77.7796],
  "Nagpur": [21.1458, 79.0882],
  "Solapur": [17.6599, 75.9064],
  "Jalgaon": [21.0077, 75.5626],
  "Sangli": [16.8524, 74.5815],
  "Beed": [18.9891, 75.7601],
  "Latur": [18.4088, 76.5604],
  "Nanded": [19.1383, 77.3210],
  "Osmanabad": [18.1856, 76.0419],
  "Parbhani": [19.2686, 76.7717],
  "Hingoli": [19.7173, 77.1477],
  "Jalna": [19.8347, 75.8816],
  "Dhule": [20.9042, 74.7749],
  "Nandurbar": [21.3732, 74.2404],
  "Buldhana": [20.5312, 76.1857],
  "Akola": [20.7002, 77.0082],
  "Washim": [20.1098, 77.1352],
  "Yavatmal": [20.3888, 78.1204],
  "Wardha": [20.7453, 78.6022],
  "Chandrapur": [19.9615, 79.2961],
  "Gadchiroli": [20.1809, 80.0000],
  "Bhandara": [21.1718, 79.6548],
  "Gondia": [21.4598, 80.1961],
  "Thane": [19.2183, 72.9781],
  "Palghar": [19.6967, 72.7699],
  "Raigad": [18.5158, 73.1822],
  "Ratnagiri": [16.9902, 73.3120],
  "Sindhudurg": [16.1189, 73.7127],
  "Mumbai": [18.9220, 72.8347]
};

export const notificationsList = [
  {
    id: "notif-1",
    title: "Urgent: New High-Priority Case",
    message: "PH-1024 reported by Ramesh Patil in Rampur, Pune. Severe nodular lesions detected.",
    time: "25 min ago",
    read: false,
    type: "urgent"
  },
  {
    id: "notif-2",
    title: "FMD Cluster Advisory - Shirol",
    message: "Shirol taluka (Kolhapur) disease cluster threshold exceeded. 31 cases active.",
    time: "1 hour ago",
    read: false,
    type: "warning"
  },
  {
    id: "notif-3",
    title: "Lab Confirmation Received",
    message: "RDDL Pune confirmed FMD Type-O isolate for sample Ref-MH-KOL-88.",
    time: "3 hours ago",
    read: false,
    type: "info"
  },
  {
    id: "notif-4",
    title: "Follow-up Due Today",
    message: "Bheema (PH-1026, Satara) BQ antibiotic response evaluation scheduled.",
    time: "5 hours ago",
    read: true,
    type: "followup"
  }
];
