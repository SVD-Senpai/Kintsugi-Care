import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LanguageProvider } from './context/LanguageContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { ToastContainer } from './components/common/Toast';
import { Login } from './components/pages/Login';
import { Dashboard } from './components/pages/Dashboard';
import { CaseQueue } from './components/pages/CaseQueue';
import { CaseDetail } from './components/pages/CaseDetail';
import { AnimalRecords } from './components/pages/AnimalRecords';
import { FollowUps } from './components/pages/FollowUps';
import { AreaAlerts } from './components/pages/AreaAlerts';
import { DiseaseMapPage } from './components/pages/DiseaseMapPage';
import { VetProfile } from './components/pages/VetProfile';

function MainApp() {
  const { isAuthenticated, activePage } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  // If unauthenticated, show Login screen
  if (!isAuthenticated) {
    return (
      <>
        <Login />
        <ToastContainer />
      </>
    );
  }

  // Active page router
  const renderActivePage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'caseQueue':
        return <CaseQueue />;
      case 'caseDetail':
        return <CaseDetail />;
      case 'animalRecords':
        return <AnimalRecords />;
      case 'followUps':
        return <FollowUps />;
      case 'areaAlerts':
        return <AreaAlerts />;
      case 'diseaseMap':
        return <DiseaseMapPage />;
      case 'vetProfile':
        return <VetProfile />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#fbf9f4] text-[#1c2e26] flex flex-col antialiased">
      {/* Persistent Left Sidebar */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Content Area (offset by sidebar width on desktop) */}
      <div className="flex-1 flex flex-col lg:pl-72 min-w-0">
        {/* Top Header */}
        <Header setMobileOpen={setMobileOpen} />

        {/* Dynamic Page Body */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {renderActivePage()}
        </main>
      </div>

      {/* Global Toast Alerts */}
      <ToastContainer />
    </div>
  );
}

export function App() {
  return (
    <LanguageProvider>
      <AppProvider>
        <MainApp />
      </AppProvider>
    </LanguageProvider>
  );
}

export default App;
