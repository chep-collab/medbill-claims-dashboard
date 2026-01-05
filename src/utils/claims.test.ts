// ESM + TypeScript compatible
import type { Claim } from "../types/claim";

// Mock claims data
const mockClaims: Claim[] = [
  {
    id: "1",
    claim_number: "C001",
    patient_name: "Alice",
    device_type: "Wheelchair",
    payer: "Medicare",
    status: "Pending",
    amount: 100,
    notes: "",
    denial_reason: null,
  },
  {
    id: "2",
    claim_number: "C002",
    patient_name: "Bob",
    device_type: "Crutches",
    payer: "Medicaid",
    status: "Denied",
    amount: 200,
    notes: "",
    denial_reason: "Documentation missing",
  },
  {
    id: "3",
    claim_number: "C003",
    patient_name: "Charlie",
    device_type: "Walker",
    payer: "Private",
    status: "Approved",
    amount: 300,
    notes: "",
    denial_reason: null,
  },
];

// Helper functions (simulate your dashboard logic)
export const filterClaims = (
  claims: Claim[],
  statusFilter: string,
  search: string
) =>
  claims.filter((claim) => {
    const matchesStatus =
      statusFilter === "All" || claim.status === statusFilter;

    const matchesSearch =
      claim.patient_name.toLowerCase().includes(search.toLowerCase()) ||
      claim.claim_number.toLowerCase().includes(search.toLowerCase());

    return matchesStatus && matchesSearch;
  });

export const computeKPIs = (claims: Claim[]) => {
  const pending = claims
    .filter((c) => c.status === "Pending")
    .reduce((sum, c) => sum + c.amount, 0);

  const denied = claims
    .filter((c) => c.status === "Denied")
    .reduce((sum, c) => sum + c.amount, 0);

  return { pending, denied };
};

// ---------------------- TESTS ----------------------
describe("Claims Utils", () => {
  test("filters by status correctly", () => {
    const filtered = filterClaims(mockClaims, "Pending", "");
    expect(filtered.length).toBe(1);
    expect(filtered[0].patient_name).toBe("Alice");
  });

  test("filters by search correctly", () => {
    const filtered = filterClaims(mockClaims, "All", "Bob");
    expect(filtered.length).toBe(1);
    expect(filtered[0].claim_number).toBe("C002");
  });

  test("filters by status + search correctly", () => {
    const filtered = filterClaims(mockClaims, "Denied", "Bob");
    expect(filtered.length).toBe(1);
    expect(filtered[0].status).toBe("Denied");
  });

  test("computes KPIs correctly", () => {
    const kpis = computeKPIs(mockClaims);
    expect(kpis.pending).toBe(100);
    expect(kpis.denied).toBe(200);
  });

  test("edit claim notes updates correctly", () => {
    const updatedClaims = mockClaims.map((c) =>
      c.id === "1" ? { ...c, notes: "Checked" } : c
    );
    expect(updatedClaims.find((c) => c.id === "1")?.notes).toBe("Checked");
  });
});
