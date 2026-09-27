// Government Disease Intelligence Service Layer
// Clean abstraction over mock data, prepared for real REST / GraphQL government APIs in the future.

import {
  DISTRICTS_DATA,
  SCHEDULED_DISEASES,
  STATE_KPIS,
  OUTBREAK_HERO_DATA,
  GOVERNMENT_ALERTS,
  ADMINISTRATIVE_ACTIONS,
  RESPONSE_PIPELINE_STAGES,
  RESOURCE_STATUS,
  INDIVIDUAL_CASES_MAHARASHTRA,
} from "../data/maharashtraData";

export const GovernmentService = {
  // Fetch list of scheduled diseases
  getScheduledDiseases() {
    return [...SCHEDULED_DISEASES];
  },

  // Fetch all districts with risk metrics (optionally filtered by disease)
  getDistricts(diseaseId = "ALL") {
    if (diseaseId === "ALL") {
      return [...DISTRICTS_DATA];
    }
    // Filter / score districts based on specific disease activity
    return DISTRICTS_DATA.map((dist) => {
      const isDominant = dist.dominantDiseaseId === diseaseId;
      // Adjust risk score when viewing a specific disease
      const adjustedScore = isDominant ? dist.riskScore : Math.max(15, Math.round(dist.riskScore * 0.45));
      const adjustedRiskLevel =
        adjustedScore >= 80 ? "CRITICAL" : adjustedScore >= 65 ? "HIGH" : adjustedScore >= 40 ? "MODERATE" : "LOW";

      return {
        ...dist,
        riskScore: adjustedScore,
        riskLevel: adjustedRiskLevel,
        activeCases: isDominant ? dist.activeCases : Math.max(0, Math.round(dist.activeCases * 0.3)),
        isFilteredMatch: isDominant,
      };
    });
  },

  // Get district by ID
  getDistrictById(districtId) {
    return DISTRICTS_DATA.find((d) => d.id === districtId) || null;
  },

  // Get State KPI Strip data
  getStateKPIs(diseaseId = "ALL") {
    if (diseaseId === "ALL") {
      return { ...STATE_KPIS };
    }
    // Calculate disease-specific KPI slice
    const disease = SCHEDULED_DISEASES.find((d) => d.id === diseaseId);
    return {
      activeCases: {
        value: diseaseId === "HS" ? 14 : diseaseId === "FMD" ? 11 : 6,
        trend: diseaseId === "HS" ? "+175%" : "+20%",
        prevPeriod: `Targeted ${disease?.short || diseaseId} surveillance`,
        severity: diseaseId === "HS" ? "CRITICAL" : "HIGH",
      },
      suspectedOutbreaks: {
        value: diseaseId === "HS" ? 1 : diseaseId === "FMD" ? 1 : 0,
        trend: diseaseId === "HS" ? "Active" : "Monitored",
        prevPeriod: "1 active cluster",
        severity: diseaseId === "HS" ? "CRITICAL" : "MODERATE",
      },
      highRiskDistricts: {
        value: diseaseId === "HS" ? 1 : 1,
        trend: diseaseId === "HS" ? "Nashik" : "Ahmednagar",
        prevPeriod: "Border blocks flagged",
        severity: "HIGH",
      },
      animalsAffected: {
        value: diseaseId === "HS" ? 3420 : 2150,
        trend: "+42%",
        prevPeriod: "Exposed dairy population",
        severity: "HIGH",
      },
      animalDeaths: {
        value: diseaseId === "HS" ? 3 : 1,
        trend: "Bovine",
        prevPeriod: "Fatality recorded",
        severity: diseaseId === "HS" ? "CRITICAL" : "HIGH",
      },
      vaccinationCoverage: {
        value: diseaseId === "HS" ? "48%" : diseaseId === "FMD" ? "73%" : "68%",
        trend: "Deficit zone identified",
        prevPeriod: "State target: 85%",
        severity: diseaseId === "HS" ? "CRITICAL" : "MODERATE",
      },
      vetsAvailable: { ...STATE_KPIS.vetsAvailable },
      mvuAvailable: { ...STATE_KPIS.mvuAvailable },
    };
  },

  // Get Outbreak Intelligence Hero Data
  getOutbreakIntelligence(_diseaseId = "ALL") {
    return { ...OUTBREAK_HERO_DATA };
  },

  // Get Government Alerts
  getAlerts(diseaseId = "ALL") {
    if (diseaseId === "ALL") return [...GOVERNMENT_ALERTS];
    return GOVERNMENT_ALERTS.filter(
      (a) => a.title.includes(diseaseId) || a.summary.includes(diseaseId) || a.riskDrivers.some((d) => d.includes(diseaseId))
    );
  },

  // Get Administrative Action Queue
  getAdministrativeActions() {
    return [...ADMINISTRATIVE_ACTIONS];
  },

  // Get Response Pipeline Stages
  getResponsePipeline() {
    return [...RESPONSE_PIPELINE_STAGES];
  },

  // Get System Resource Status
  getResourceStatus() {
    return { ...RESOURCE_STATUS };
  },

  // Get Individual Cases for Drill-down
  getCases(districtId = null) {
    if (!districtId) return [...INDIVIDUAL_CASES_MAHARASHTRA];
    return INDIVIDUAL_CASES_MAHARASHTRA.filter((c) => c.districtId === districtId);
  },

  // Get single case by ID
  getCaseById(caseId) {
    return INDIVIDUAL_CASES_MAHARASHTRA.find((c) => c.id === caseId || c.pashuId === caseId) || null;
  },
};
