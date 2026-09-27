import React, { createContext, useContext, useState, useMemo } from 'react';
import { currentVet as defaultVet, farmers, animals as initialAnimals, initialCases, areaAlertsData, notificationsList } from '../data/mockData';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [vetProfile, setVetProfile] = useState(defaultVet);
  
  // Navigation state
  const [activePage, setActivePage] = useState('dashboard');
  const [selectedCaseId, setSelectedCaseId] = useState('PH-1024');
  const [selectedAnimalId, setSelectedAnimalId] = useState('KC-00101');
  const [focusedDistrict, setFocusedDistrict] = useState(null);
  const [focusedDisease, setFocusedDisease] = useState(null);

  // Global search & filters
  const [globalSearch, setGlobalSearch] = useState('');

  // Core Data States
  const [cases, setCases] = useState(initialCases);
  const [animals, setAnimals] = useState(initialAnimals);
  const [alerts, setAlerts] = useState(areaAlertsData);
  const [notifications, setNotifications] = useState(notificationsList);
  const [toasts, setToasts] = useState([]);

  // Toast dispatch
  const showToast = (message, type = 'success', title = '') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type, title }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Case actions
  const updateCaseStatus = (caseId, newStatus) => {
    setCases(prev => prev.map(c => {
      if (c.id === caseId) {
        return {
          ...c,
          status: newStatus,
          lastUpdated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
        };
      }
      return c;
    }));
    showToast(`Case #${caseId} status updated to ${newStatus}`, 'info', 'Status Updated');
  };

  const addCaseNote = (caseId, noteText) => {
    const newNote = {
      id: `note-${Date.now()}`,
      author: vetProfile.name,
      timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      text: noteText
    };

    setCases(prev => prev.map(c => {
      if (c.id === caseId) {
        return {
          ...c,
          vetNotes: [newNote, ...(c.vetNotes || [])],
          lastUpdated: newNote.timestamp
        };
      }
      return c;
    }));
    showToast(`Clinical observation recorded for Case #${caseId}`, 'success', 'Note Added');
  };

  const saveTreatmentPlan = (caseId, treatmentData, sendToFarmer = false) => {
    const timestamp = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    
    setCases(prev => prev.map(c => {
      if (c.id === caseId) {
        const updatedTreatment = {
          ...c.treatmentPlan,
          ...treatmentData,
          status: sendToFarmer ? 'Prescribed' : 'Draft',
          lastPrescribedDate: sendToFarmer ? timestamp : c.treatmentPlan?.lastPrescribedDate
        };

        const updatedStatus = sendToFarmer && c.status === 'Under Review' ? 'Active' : c.status;

        return {
          ...c,
          status: updatedStatus,
          confirmedDisease: treatmentData.confirmedDisease || c.confirmedDisease,
          treatmentPlan: updatedTreatment,
          lastUpdated: timestamp
        };
      }
      return c;
    }));

    // If sent to farmer, also append a treatment event to the animal's record
    const targetCase = cases.find(c => c.id === caseId);
    if (sendToFarmer && targetCase) {
      setAnimals(prev => prev.map(a => {
        if (a.id === targetCase.animalId) {
          return {
            ...a,
            timeline: [
              {
                date: new Date().toISOString().split('T')[0],
                type: 'Treatment',
                title: `Veterinary Prescription: ${treatmentData.confirmedDisease || 'Therapeutic Protocol'}`,
                vet: vetProfile.name,
                notes: `Prescribed: ${treatmentData.prescriptions?.map(p => p.medicine).join(', ')}. Biosecurity guidelines issued.`
              },
              ...a.timeline
            ]
          };
        }
        return a;
      }));

      showToast(`Recommendation & biosecurity advisory dispatched to ${targetCase.farmerName} via Kintsugi Care`, 'success', 'Prescription Dispatched');
    } else {
      showToast(`Treatment plan draft saved locally for Case #${caseId}`, 'info', 'Draft Saved');
    }
  };

  const closeCase = (caseId, resolutionSummary) => {
    const timestamp = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    setCases(prev => prev.map(c => {
      if (c.id === caseId) {
        return {
          ...c,
          status: 'Resolved',
          lastUpdated: timestamp,
          followUp: {
            ...c.followUp,
            nextCheckIn: 'Case Closed',
            targetObservation: resolutionSummary || 'Resolved and clinically stabilized'
          }
        };
      }
      return c;
    }));

    const targetCase = cases.find(c => c.id === caseId);
    if (targetCase) {
      setAnimals(prev => prev.map(a => {
        if (a.id === targetCase.animalId) {
          return {
            ...a,
            currentHealthStatus: 'Resolved',
            healthStatusClass: 'healthy',
            timeline: [
              {
                date: new Date().toISOString().split('T')[0],
                type: 'Case Closed',
                title: `Clinical Recovery: Case #${caseId} Closed`,
                vet: vetProfile.name,
                notes: resolutionSummary || `Animal demonstrated cessation of signs and completed medication course.`
              },
              ...a.timeline
            ]
          };
        }
        return a;
      }));
    }

    showToast(`Case #${caseId} marked as Resolved. Animal status updated.`, 'success', 'Case Resolved');
  };

  const updateFollowUpDate = (caseId, nextDate, targetObs) => {
    setCases(prev => prev.map(c => {
      if (c.id === caseId) {
        return {
          ...c,
          status: c.status === 'Resolved' ? 'Follow-up' : c.status,
          followUp: {
            ...c.followUp,
            nextCheckIn: nextDate,
            targetObservation: targetObs || c.followUp?.targetObservation
          }
        };
      }
      return c;
    }));
    showToast(`Follow-up schedule updated for Case #${caseId}`, 'info', 'Schedule Updated');
  };

  const acknowledgeAlert = (alertId) => {
    setAlerts(prev => prev.map(a => {
      if (a.id === alertId) {
        return { ...a, acknowledged: true };
      }
      return a;
    }));
    showToast(`Alert #${alertId} acknowledged by ${vetProfile.name}`, 'info', 'Alert Acknowledged');
  };

  const updateProfile = (updatedFields) => {
    setVetProfile(prev => ({ ...prev, ...updatedFields }));
    showToast('Veterinarian profile updated successfully', 'success', 'Profile Updated');
  };

  // Nav helpers
  const navigateToCase = (caseId) => {
    setSelectedCaseId(caseId);
    setActivePage('caseDetail');
  };

  const navigateToAnimal = (animalId) => {
    setSelectedAnimalId(animalId);
    setActivePage('animalRecords');
  };

  const navigateToMapWithFocus = (district, disease = null) => {
    setFocusedDistrict(district);
    setFocusedDisease(disease);
    setActivePage('diseaseMap');
  };

  // Dynamic KPI calculations
  const kpiStats = useMemo(() => {
    const activeCount = cases.filter(c => c.status === 'Active').length;
    const highPriorityCount = cases.filter(c => c.priorityLevel === 'high' && c.status !== 'Resolved').length;
    const followUpCount = cases.filter(c => c.status === 'Follow-up' || (c.status !== 'Resolved' && c.followUp?.nextCheckIn && c.followUp.nextCheckIn !== 'Case Closed')).length;
    const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged).length;

    return {
      activeCases: activeCount,
      highPriorityCases: highPriorityCount,
      pendingFollowUps: followUpCount,
      areaAlerts: alerts.length,
      unacknowledgedAlerts
    };
  }, [cases, alerts]);

  // Auth functions
  const login = (email, password) => {
    if (email.toLowerCase().includes('vet') || password === 'vet1234') {
      setIsAuthenticated(true);
      showToast(`Welcome back, ${vetProfile.name}`, 'success', 'Authenticated');
      setActivePage('dashboard');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    showToast('Logged out of Kintsugi Surveillance Portal', 'info', 'Session Ended');
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        vetProfile,
        updateProfile,
        activePage,
        setActivePage,
        selectedCaseId,
        setSelectedCaseId,
        selectedAnimalId,
        setSelectedAnimalId,
        focusedDistrict,
        setFocusedDistrict,
        focusedDisease,
        setFocusedDisease,
        globalSearch,
        setGlobalSearch,
        cases,
        animals,
        farmers,
        alerts,
        notifications,
        toasts,
        showToast,
        removeToast,
        updateCaseStatus,
        addCaseNote,
        saveTreatmentPlan,
        closeCase,
        updateFollowUpDate,
        acknowledgeAlert,
        navigateToCase,
        navigateToAnimal,
        navigateToMapWithFocus,
        kpiStats
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
