// Simple spatial-temporal clustering: groups HIGH-risk cases that are close in
// distance (km) and time (days) into a "potential outbreak cluster".
// This is intentionally lightweight (no ML) so it stays explainable for judges.

function haversineKm(a, b) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

const RADIUS_KM = 8;
const WINDOW_DAYS = 7;
const MIN_CLUSTER_SIZE = 3;

export function detectClusters(cases) {
  const highRisk = cases.filter((c) => c.riskLevel === "HIGH");
  const clusters = [];
  const visited = new Set();

  for (const seed of highRisk) {
    if (visited.has(seed.id)) continue;
    const group = highRisk.filter((c) => {
      const distOk = haversineKm(seed, c) <= RADIUS_KM;
      const daysApart = Math.abs(new Date(seed.reportedAt) - new Date(c.reportedAt)) / 86400000;
      return distOk && daysApart <= WINDOW_DAYS;
    });
    if (group.length >= MIN_CLUSTER_SIZE) {
      group.forEach((c) => visited.add(c.id));
      const centerLat = group.reduce((s, c) => s + c.lat, 0) / group.length;
      const centerLng = group.reduce((s, c) => s + c.lng, 0) / group.length;
      clusters.push({
        id: `cluster-${clusters.length + 1}`,
        cases: group,
        center: { lat: centerLat, lng: centerLng },
        size: group.length,
      });
    }
  }
  return clusters;
}