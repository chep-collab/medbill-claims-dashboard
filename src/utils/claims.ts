// src/utils/claims.ts
import type { Claim } from "../types/claim";

/* -------------------- FILTERING -------------------- */
export const filterClaims = (
  claims: Claim[],
  statusFilter: string,
  search: string
): Claim[] => {
  return claims.filter((claim) => {
    const matchesStatus = statusFilter === "All" || claim.status === statusFilter;
    const matchesSearch =
      claim.patient_name.toLowerCase().includes(search.toLowerCase()) ||
      claim.claim_number.toLowerCase().includes(search.toLowerCase());

    return matchesStatus && matchesSearch;
  });
};

/* -------------------- KPI CALCULATION -------------------- */
export const calculateKPIs = (claims: Claim[]) => {
  const pending = claims
    .filter((c) => c.status === "Pending")
    .reduce((sum, c) => sum + c.amount, 0);

  const denied = claims
    .filter((c) => c.status === "Denied")
    .reduce((sum, c) => sum + c.amount, 0);

  return { pending, denied };
};

/* -------------------- STATUS COLOR -------------------- */
export const getStatusColor = (status: string) => {
  switch (status) {
    case "Approved":
      return "#16a34a"; // green
    case "Pending":
      return "#f59e0b"; // orange
    case "Denied":
      return "#dc2626"; // red
    default:
      return "#6b7280"; // gray
  }
};
