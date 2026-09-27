import { useState, useMemo } from "react";
import GovernmentHeader from "../components/GovernmentHeader";
import StateKPIStrip from "../components/StateKPIStrip";
import DiseaseFilter from "../components/DiseaseFilter";
import MaharashtraRiskMap from "../components/MaharashtraRiskMap";
import DistrictsAttentionPanel from "../components/DistrictsAttentionPanel";
import DistrictDetailPanel from "../components/DistrictDetailPanel";
import OutbreakIntelligenceCard from "../components/OutbreakIntelligenceCard";
import GovernmentAlertCenter from "../components/GovernmentAlertCenter";
import AdministrativeActionQueue from "../components/AdministrativeActionQueue";
import ResourceOverview from "../components/ResourceOverview";
import ResponsePipelineTracker from "../components/ResponsePipelineTracker";
import CaseDrillDownModal from "../components/CaseDrillDownModal";
import { GovernmentService } from "../services/governmentService";

export default function OfficerDashboard() {
  const [activeDisease, setActiveDisease] = useState("ALL");
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedCase, setSelectedCase] = useState(null);
  const [drillDownCases, setDrillDownCases] = useState(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);

  // Retrieve reactive datasets via Service Layer based on active disease
  const districts = useMemo(() => {
    return GovernmentService.getDistricts(activeDisease);
  }, [activeDisease]);

  const kpis = useMemo(() => {
    return GovernmentService.getStateKPIs(activeDisease);
  }, [activeDisease]);

  const alerts = useMemo(() => {
    return GovernmentService.getAlerts(activeDisease);
  }, [activeDisease]);

  // If a district is selected, ensure it has the latest data from the filtered list
  const currentDistrictData = useMemo(() => {
    if (!selectedDistrict) return null;
    return districts.find((d) => d.id === selectedDistrict.id) || selectedDistrict;
  }, [selectedDistrict, districts]);

  // Handle district selection
  const handleSelectDistrict = (district) => {
    setSelectedDistrict(district);
    setIsDetailDrawerOpen(true);
  };

  // Handle drill down into animal records for a district
  const handleInspectDistrictCases = (districtId) => {
    const cases = GovernmentService.getCases(districtId);
    setDrillDownCases(cases);
    setSelectedCase(cases[0] || null);
  };

  // Quick action from Outbreak Card
  const handleInspectCluster = (districtId) => {
    const d = districts.find((dist) => dist.id === districtId);
    if (d) {
      handleSelectDistrict(d);
    }
    const workspaceElem = document.getElementById("gov-workspace-section");
    workspaceElem?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll to Action Queue
  const handleReviewAction = () => {
    const queueElem = document.getElementById("admin-action-queue-section");
    if (queueElem) {
      queueElem.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div id="gov-command-top" className="gov-command-center">
      {/* 1. Official Government Header & Navigation */}
      <GovernmentHeader
        activeDisease={activeDisease}
        onDiseaseChange={setActiveDisease}
        alertCount={alerts.length}
      />

      <div className="gov-command-body">
        {/* 2. Statewide KPI Overview Strip */}
        <StateKPIStrip kpis={kpis} activeDisease={activeDisease} />

        {/* 3. Disease Surveillance Filter Toolbar */}
        <DiseaseFilter
          activeDisease={activeDisease}
          onSelectDisease={setActiveDisease}
        />

        {/* 4. Active Outbreak Intelligence Hero Card */}
        <section id="gov-outbreak-section" className="dashboard-section" aria-label="Active Outbreak Intelligence">
          <OutbreakIntelligenceCard
            onTakeAction={handleReviewAction}
            onInspectCluster={handleInspectCluster}
          />
        </section>

        {/* 5. Main Surveillance Workspace: Risk Map (Left) + Districts Attention / Detail (Right) */}
        <section id="gov-workspace-section" className="dashboard-section" aria-label="Risk Map & Attention Ranking">
          <div className="gov-workspace-grid">
            {/* Left Column: Geographic Risk Map */}
            <div className="gov-workspace-grid__map">
              <MaharashtraRiskMap
                districts={districts}
                selectedDistrict={currentDistrictData}
                onSelectDistrict={handleSelectDistrict}
                activeDisease={activeDisease}
                onDrillDownCase={(c) => {
                  setSelectedCase(c);
                  setDrillDownCases([c]);
                }}
              />
            </div>

            {/* Right Column: Districts Attention Ranking & Drill-down Drawer */}
            <div className="gov-workspace-grid__attention">
              {isDetailDrawerOpen && currentDistrictData ? (
                <DistrictDetailPanel
                  district={currentDistrictData}
                  onClose={() => setIsDetailDrawerOpen(false)}
                  onInspectCases={handleInspectDistrictCases}
                />
              ) : (
                <DistrictsAttentionPanel
                  districts={districts}
                  selectedDistrict={currentDistrictData}
                  onSelectDistrict={handleSelectDistrict}
                />
              )}
            </div>
          </div>
        </section>

        {/* 6. Response Pipeline Stage Tracker */}
        <section id="gov-pipeline-section" className="dashboard-section" aria-label="Response Pipeline">
          <ResponsePipelineTracker />
        </section>

        {/* 7. Government Alert Center */}
        <section id="gov-alert-center-section" className="dashboard-section" aria-label="Government Alert Feed">
          <GovernmentAlertCenter
            alerts={alerts}
            onSelectAlertDistrict={(distId) => {
              const d = districts.find((dist) => dist.id === distId);
              if (d) handleSelectDistrict(d);
            }}
          />
        </section>

        {/* 8. Administrative Action & Decision Queue */}
        <section
          id="admin-action-queue-section"
          className="dashboard-section"
          aria-label="Administrative Action Queue"
        >
          <AdministrativeActionQueue />
        </section>

        {/* 9. Resource Status, Bottlenecks & Smart Recommendations */}
        <section id="gov-resources-section" className="dashboard-section" aria-label="Resource Capacity">
          <ResourceOverview
            onReviewResourceAction={handleReviewAction}
          />
        </section>
      </div>

      {/* 10. Individual Case Drill-Down Modal */}
      {drillDownCases && drillDownCases.length > 0 && (
        <CaseDrillDownModal
          cases={drillDownCases}
          selectedCase={selectedCase}
          onSelectCase={setSelectedCase}
          onClose={() => {
            setDrillDownCases(null);
            setSelectedCase(null);
          }}
        />
      )}
    </div>
  );
}