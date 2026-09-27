import React, { createContext, useContext, useState } from 'react';

const translations = {
  en: {
    // Brand & App (Directly from Kintsugi Care SIH 2026 Platform Slide)
    portalTitle: "Kintsugi Care",
    portalSubtitle: "From Early Signals to Timely Action",
    platformDesc: "An Integrated AI-powered Livestock Health Intelligence & Response Platform",
    vetRoleSubtitle: "Veterinarian Portal — AI-Assisted Triage & Case Management",
    brandTagline: "Healthy Animals • Stronger Communities",
    motto: "Healthier Livestock | Safer Communities | A Stronger India",
    deptTag: "Farmers • Veterinarians • Government Integration",
    
    // Nav
    dashboard: "Dashboard",
    caseQueue: "Case Queue",
    animalRecords: "Animal Records",
    followUps: "Follow-ups",
    areaAlerts: "Area Alerts",
    diseaseMap: "Disease Map",
    vetProfile: "Vet Profile",
    logout: "Logout",
    
    // Status badges
    highPriority: "High Priority",
    mediumPriority: "Medium Priority",
    lowPriority: "Low Priority",
    active: "Active",
    underReview: "Under Review",
    followUpStatus: "Follow-up",
    resolved: "Resolved",
    prescribed: "Prescribed",
    draft: "Draft",
    
    // KPIs
    activeCasesLabel: "Active Cases",
    highPriorityLabel: "High Priority Cases",
    pendingFollowUpsLabel: "Pending Follow-ups",
    areaAlertsLabel: "Area Alerts",
    
    // Common Actions
    viewCase: "View Case",
    reviewCase: "Review Case",
    addNote: "Add Note",
    requestInfo: "Request Information",
    openHealthRecord: "Open Animal Health Record",
    diagnosisTreatment: "Diagnosis & Treatment",
    saveDraft: "Save Draft",
    sendToFarmer: "Send Recommendation to Farmer",
    updateFollowUp: "Update Follow-up",
    closeCase: "Close Case",
    acknowledgeAlert: "Acknowledge Alert",
    viewOnMap: "View on Map",
    viewRelatedCases: "View Related Cases",
    searchPlaceholder: "Search case ID, farmer, animal, or district...",
    allDistricts: "All Districts",
    allStatuses: "All Statuses",
    allPriorities: "All Priorities",
    allSpecies: "All Species",
    resetFilters: "Reset Filters",
    
    // Alerts Banner
    activeAlertHeader: "Active Disease Alert",
    activeAlertDesc: "Elevated disease activity detected in selected Maharashtra surveillance clusters",
    
    // Map
    mapTitle: "Maharashtra Disease Surveillance GIS",
    mapSubtitle: "Real-time epidemiological cluster detection and vector alert zones",
    highRiskHotspot: "High Risk Hotspot",
    mediumRiskZone: "Medium Risk Zone",
    lowRiskWatch: "Low Risk Surveillance",
    monitoredDistrict: "Healthy / Monitored",
    
    // Animals
    cattle: "Cattle",
    buffalo: "Buffalo",
    goat: "Goat",
    sheep: "Sheep"
  },
  hi: {
    // Brand & App
    portalTitle: "किंतसुगी केयर (Kintsugi Care)",
    portalSubtitle: "प्रारंभिक संकेतों से समय पर त्वरित कार्रवाई",
    platformDesc: "एआई-संचालित एकीकृत पशुधन स्वास्थ्य निगरानी और प्रतिक्रिया मंच",
    vetRoleSubtitle: "पशु चिकित्सक पोर्टल — एआई-सहायता प्राप्त केस प्रबंधन",
    brandTagline: "स्वस्थ पशुधन • सशक्त समुदाय",
    motto: "स्वस्थ पशुधन | सुरक्षित समुदाय | सशक्त भारत",
    deptTag: "किसान • पशु चिकित्सक • शासन एकीकृत प्रणाली",
    
    // Nav
    dashboard: "डैशबोर्ड",
    caseQueue: "केस कतार",
    animalRecords: "पशु स्वास्थ्य रिकॉर्ड",
    followUps: "फॉलो-अप (समीक्षा)",
    areaAlerts: "क्षेत्रीय रोग अलर्ट",
    diseaseMap: "महाराष्ट्र रोग नक्शा",
    vetProfile: "पशु चिकित्सक प्रोफ़ाइल",
    logout: "लॉगआउट",
    
    // Status badges
    highPriority: "उच्च प्राथमिकता",
    mediumPriority: "मध्यम प्राथमिकता",
    lowPriority: "सामान्य प्राथमिकता",
    active: "सक्रिय",
    underReview: "समीक्षाधीन",
    followUpStatus: "फॉलो-अप",
    resolved: "निराकृत (स्वस्थ)",
    prescribed: "उपचार अनुशंसित",
    draft: "प्रारूप",
    
    // KPIs
    activeCasesLabel: "सक्रिय मामले",
    highPriorityLabel: "उच्च प्राथमिकता मामले",
    pendingFollowUpsLabel: "लंबित फॉलो-अप",
    areaAlertsLabel: "क्षेत्रीय रोग अलर्ट",
    
    // Common Actions
    viewCase: "केस देखें",
    reviewCase: "केस जांचें",
    addNote: "टिप्पणी जोड़ें",
    requestInfo: "अधिक जानकारी मांगें",
    openHealthRecord: "पशु स्वास्थ्य रिकॉर्ड खोलें",
    diagnosisTreatment: "निदान एवं उपचार",
    saveDraft: "ड्राफ्ट सहेजें",
    sendToFarmer: "किसान को उपचार परामर्श भेजें",
    updateFollowUp: "फॉलो-अप अद्यतन करें",
    closeCase: "केस बंद करें",
    acknowledgeAlert: "अलर्ट स्वीकारें",
    viewOnMap: "नक्शे पर देखें",
    viewRelatedCases: "संबंधित केस देखें",
    searchPlaceholder: "केस आईडी, किसान, पशु या जिला खोजें...",
    allDistricts: "सभी जिले",
    allStatuses: "सभी स्थितियां",
    allPriorities: "सभी प्राथमिकताएं",
    allSpecies: "सभी प्रजातियां",
    resetFilters: "फ़िल्टर रीसेट करें",
    
    // Alerts Banner
    activeAlertHeader: "सक्रिय रोग चेतावनी",
    activeAlertDesc: "चयनित महाराष्ट्र निगरानी क्षेत्रों में उच्च संक्रामक रोग गतिविधि दर्ज की गई",
    
    // Map
    mapTitle: "महाराष्ट्र रोग निगरानी जीआईएस प्रणाली",
    mapSubtitle: "वास्तविक समय रोग प्रकोप और अलर्ट ज़ोन निगरानी",
    highRiskHotspot: "उच्च जोखिम हॉटस्पॉट",
    mediumRiskZone: "मध्यम जोखिम क्षेत्र",
    lowRiskWatch: "निगरानी क्षेत्र",
    monitoredDistrict: "स्वस्थ / सामान्य",
    
    // Animals
    cattle: "गाय / बैल",
    buffalo: "भैंस",
    goat: "बकरी",
    sheep: "भेड़"
  }
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en');

  const toggleLanguage = () => {
    setLang(prev => (prev === 'en' ? 'hi' : 'en'));
  };

  const t = (key) => {
    return translations[lang]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
