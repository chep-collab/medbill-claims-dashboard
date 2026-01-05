import { useEffect, useMemo, useState } from "react";
import { supabase } from "./supabase";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";

import type { Claim } from "./types/claim";
import {
  filterClaims,
  calculateKPIs,
} from "./utils/claims";

/* -------------------- STATUS STYLES -------------------- */
const getStatusStyle = (status: string) => {
  switch (status) {
    case "PAID":
      return { color: "#166534", bg: "#dcfce7" }; // green
    case "PENDING":
      return { color: "#92400e", bg: "#fef3c7" }; // amber
    case "SUBMITTED":
      return { color: "#1e40af", bg: "#dbeafe" }; // blue
    case "DENIED":
      return { color: "#991b1b", bg: "#fee2e2" }; // red
    default:
      return { color: "#374151", bg: "#f3f4f6" };
  }
};

function App() {
  /* -------------------- STATE -------------------- */
  const [claims, setClaims] = useState<Claim[]>([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [notes, setNotes] = useState("");

  /* -------------------- FETCH DATA -------------------- */
  useEffect(() => {
    const fetchClaims = async () => {
      const { data, error } = await supabase
        .from("claims")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        return;
      }

      setClaims(data || []);
    };

    fetchClaims();
  }, []);

  /* -------------------- FILTERING -------------------- */
  const filteredClaims = useMemo(
    () => filterClaims(claims, statusFilter, search),
    [claims, statusFilter, search]
  );

  /* -------------------- KPIs -------------------- */
  const kpis = useMemo(
    () => calculateKPIs(filteredClaims),
    [filteredClaims]
  );

  const chartData = [
    { name: "Pending", value: kpis.pending },
    { name: "Denied", value: kpis.denied },
  ];

  const COLORS = ["#f59e0b", "#dc2626"];

  /* -------------------- UPDATE CLAIM -------------------- */
  const saveClaimUpdate = async () => {
    if (!selectedClaim) return;

    await supabase
      .from("claims")
      .update({
        notes,
        status: selectedClaim.status,
      })
      .eq("id", selectedClaim.id);

    setClaims((prev) =>
      prev.map((c) =>
        c.id === selectedClaim.id
          ? { ...c, notes, status: selectedClaim.status }
          : c
      )
    );

    setSelectedClaim(null);
    setNotes("");
  };

  /* -------------------- UI -------------------- */
  return (
    <div style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
      <h1>Medbill — Claims Dashboard</h1>

      {/* KPIs */}
      <div style={{ display: "flex", gap: 24, margin: "16px 0" }}>
        <strong>Pending Amount: ${kpis.pending}</strong>
        <strong>Denied Amount: ${kpis.denied}</strong>
      </div>

      {/* Chart */}
      <PieChart width={360} height={220}>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={70}
          label
        >
          {chartData.map((_, i) => (
            <Cell key={i} fill={COLORS[i]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>

      {/* Search */}
      <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
        <input
          placeholder="Search by patient or claim #"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: 8, width: 280 }}
        />
      </div>

      {/* Filters */}
      <div style={{ marginBottom: 16 }}>
        {["All", "PAID", "PENDING", "SUBMITTED", "DENIED"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            style={{
              marginRight: 8,
              padding: "6px 14px",
              borderRadius: 6,
              border:
                statusFilter === s
                  ? "2px solid #2563eb"
                  : "1px solid #d1d5db",
              background: statusFilter === s ? "#eff6ff" : "white",
              fontWeight: 600,
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* TABLE */}
      <table width="100%" cellPadding={10}>
        <thead>
          <tr style={{ textAlign: "left" }}>
            <th>Claim #</th>
            <th>Patient</th>
            <th>Device</th>
            <th>Payer</th>
            <th>Status</th>
            <th>Amount</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {filteredClaims.map((c) => {
            const style = getStatusStyle(c.status);
            return (
              <tr key={c.id} style={{ borderTop: "1px solid #e5e7eb" }}>
                <td>{c.claim_number}</td>
                <td>{c.patient_name}</td>
                <td>{c.device_type}</td>
                <td>{c.payer}</td>
                <td>
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: 999,
                      fontWeight: 600,
                      color: style.color,
                      backgroundColor: style.bg,
                    }}
                  >
                    {c.status}
                  </span>
                </td>
                <td>${c.amount}</td>
                <td>
                  <button
                    onClick={() => {
                      setSelectedClaim(c);
                      setNotes(c.notes || "");
                    }}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* MODAL */}
      {selectedClaim && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div style={{ background: "white", padding: 20, width: 400 }}>
            <h3>Edit Claim</h3>

            <select
              value={selectedClaim.status}
              onChange={(e) =>
                setSelectedClaim({
                  ...selectedClaim,
                  status: e.target.value,
                })
              }
            >
              <option>PAID</option>
              <option>PENDING</option>
              <option>SUBMITTED</option>
              <option>DENIED</option>
            </select>

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{ width: "100%", marginTop: 8 }}
            />

            <div style={{ marginTop: 12 }}>
              <button onClick={saveClaimUpdate}>Save</button>
              <button onClick={() => setSelectedClaim(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
