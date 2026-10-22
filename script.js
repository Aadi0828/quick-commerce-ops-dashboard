/* =========================================================
   QUICK COMMERCE OPERATIONS DASHBOARD  ·  script.js
   All data is fictional and generated for portfolio practice.
   ========================================================= */
"use strict";

/* ---------- 1. Settings ---------- */
const TARGET_PPI = 20;       // productivity target
const GRN_ALERT = 150;       // pending GRN at/above this = high priority
const PAGE_SIZE = 10;        // rows per table page
const COLORS = ["#f8cb46", "#263746", "#64748b", "#e7b92e", "#94a3b8"];
const COMPLAINT_ALERT = 2.5; // complaints above this % of orders = "High Complaints"
const REQUIRED_COLUMNS = ["date", "shift", "orders", "present", "planned", "ppi", "grn"];

// The five complaint types. "key" is also the CSV column name (optional columns).
const CATEGORIES = [
  { key: "damage",       label: "Item Damage",  icon: "💥", color: "#dc2626" },
  { key: "expired",      label: "Expired",      icon: "⏳", color: "#f59e0b" },
  { key: "poor_quality", label: "Poor Quality", icon: "👎", color: "#8b5cf6" },
  { key: "missing",      label: "Missing Item", icon: "❓", color: "#3b82f6" },
  { key: "wrong_item",   label: "Wrong Item",   icon: "🔀", color: "#0f766e" }
];
const COMPLAINT_KEYS = CATEGORIES.map((c) => c.key);

/* Live store info (demo): Store Manager (SM) per shift + inbound trucks.
   Edit these names and trucks to match your own stores.
   etaMin = minutes from the moment the page opens; delayMin = extra delay. */
const STORE_LIVE = {
  "Gurugram – Sector 45": {
    sm: {
      Morning: { name: "Rohit Verma",  checkIn: "05:52" },
      Evening: { name: "Neha Kapoor",  checkIn: "13:55" },
      Night:   { name: "Amit Sharma",  checkIn: "21:58" }
    },
    trucks: [
      { id: "TRK-2041", from: "Fresh Hub",       cartons: 120, etaMin: 25 },
      { id: "TRK-2044", from: "FMCG Warehouse",  cartons: 210, etaMin: 150 },
      { id: "TRK-2049", from: "Dairy Depot",     cartons: 64,  etaMin: 330 }
    ]
  },
  "Delhi – Dwarka": {
    sm: {
      Morning: { name: "Pooja Singh",  checkIn: "05:58" },
      Evening: { name: "Sanjay Mehta", checkIn: "", leave: true, cover: "Priya Nair (ASM)" },
      Night:   { name: "Karan Malhotra", checkIn: "21:50" }
    },
    trucks: [
      { id: "TRK-3102", from: "FMCG Warehouse", cartons: 180, etaMin: -12 },
      { id: "TRK-3107", from: "Fresh Hub",      cartons: 95,  etaMin: 70, delayMin: 35 },
      { id: "TRK-3111", from: "Beverage Depot", cartons: 140, etaMin: 280 }
    ]
  },
  "Noida – Sector 62": {
    sm: {
      Morning: { name: "Anjali Gupta", checkIn: "06:01" },
      Evening: { name: "Vikram Rao",   checkIn: "13:49" },
      Night:   { name: "Deepak Yadav", checkIn: "21:55" }
    },
    trucks: [
      { id: "TRK-4210", from: "Fresh Hub",    cartons: 88,  etaMin: 55 },
      { id: "TRK-4216", from: "Dairy Depot",  cartons: 72,  etaMin: 200 }
    ]
  }
};

/* ---------- 2. Small helpers ---------- */
const $ = (id) => document.getElementById(id);
const pad = (n) => String(n).padStart(2, "0");
const toISO = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const fromISO = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
const addDays = (iso, n) => { const d = fromISO(iso); d.setDate(d.getDate() + n); return toISO(d); };
const daysBetween = (a, b) => Math.round((fromISO(b) - fromISO(a)) / 86400000) + 1;
const fmtDate = (iso) => fromISO(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
const fmtFull = (iso) => fromISO(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
const fmtNum = (n) => Math.round(n).toLocaleString("en-IN");
const sum = (rows, key) => rows.reduce((t, r) => t + r[key], 0);
const avg = (rows, key) => (rows.length ? sum(rows, key) / rows.length : 0);

function esc(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function groupBy(rows, keyFn) {
  const map = new Map();
  rows.forEach((r) => {
    const k = keyFn(r);
    if (!map.has(k)) map.set(k, []);
    map.get(k).push(r);
  });
  return map;
}

function uniqueInOrder(values) {
  return [...new Set(values)];
}

/* ---------- 3. Demo data (28 days x 3 stores x 3 shifts) ---------- */
function generateData() {
  const stores = [
    { name: "Gurugram – Sector 45", scale: 1.15 },
    { name: "Delhi – Dwarka", scale: 1.0 },
    { name: "Noida – Sector 62", scale: 0.85 }
  ];
  const shifts = [
    { name: "Morning", base: 340, planned: 5 },
    { name: "Evening", base: 480, planned: 6 },
    { name: "Night", base: 230, planned: 4 }
  ];

  // Seeded random numbers: the demo data is the same on every refresh
  let seed = 42;
  const rand = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };

  const today = toISO(new Date());
  const rows = [];

  for (let back = 27; back >= 0; back--) {
    const date = addDays(today, -back);
    const dow = fromISO(date).getDay();
    const weekend = dow === 0 || dow === 6 ? 1.18 : 1;

    stores.forEach((st) => shifts.forEach((sh) => {
      const orders = Math.round(sh.base * st.scale * weekend * (0.88 + rand() * 0.26));
      let present = sh.planned;
      if (rand() < 0.32) present -= 1;
      if (rand() < 0.08) present -= 1;
      const ppi = +(17.5 + rand() * 6.5).toFixed(1);
      const grn = Math.round(30 + rand() * 190);

      // Complaints: roughly 1.6% of orders, split across the five types
      const perHundred = { damage: 0.35, expired: 0.18, poor_quality: 0.3, missing: 0.45, wrong_item: 0.32 };
      const complaints = {};
      COMPLAINT_KEYS.forEach((k) => {
        complaints[k] = Math.max(0, Math.round((orders / 100) * perHundred[k] * (0.3 + rand() * 1.4)));
      });

      rows.push({ date, store: st.name, shift: sh.name, orders, present, planned: sh.planned, ppi, grn, ...complaints });
    }));
  }
  return rows;
}

/* ---------- 4. App state ---------- */
let records = generateData();
let isCustom = false;

const state = {
  store: "all", shift: "all", from: "", to: "",
  page: "overview",
  search: "", sortKey: "date", sortDir: "desc", pageNo: 1
};

const PAGE_TEXT = {
  overview:     ["Operations Overview", "Blinkit Store Operations · Portfolio Project"],
  manpower:     ["Manpower", "Attendance against planned headcount"],
  inventory:    ["Inventory & GRN", "Pending goods-receipt backlog"],
  complaints:   ["Customer Complaints", "Item damage, expired, poor quality, missing and wrong item"],
  productivity: ["Productivity", "Picker productivity index (PPI) against target"],
  about:        ["About Dashboard", "How this portfolio project works"]
};

/* ---------- 5. Row calculations ---------- */
const attendance = (r) => (r.planned ? (r.present / r.planned) * 100 : 0);
const complaintsOf = (r) => COMPLAINT_KEYS.reduce((t, k) => t + (r[k] || 0), 0);
const complaintRate = (r) => (r.orders ? (complaintsOf(r) / r.orders) * 100 : 0);

function statusOf(r) {
  if (r.present < r.planned) return { label: "Manpower Gap", cls: "status-warning" };
  if (r.ppi < TARGET_PPI) return { label: "Low PPI", cls: "status-bad" };
  if (complaintRate(r) >= COMPLAINT_ALERT) return { label: "High Complaints", cls: "status-bad" };
  return { label: "Healthy", cls: "status-good" };
}

function aggregate(rows) {
  return {
    orders: sum(rows, "orders"),
    present: sum(rows, "present"),
    planned: sum(rows, "planned"),
    ppi: avg(rows, "ppi"),
    grn: sum(rows, "grn"),
    complaints: rows.reduce((t, r) => t + complaintsOf(r), 0),
    count: rows.length
  };
}

function applyFilters(recs, from, to) {
  return recs.filter((r) =>
    (state.store === "all" || r.store === state.store) &&
    (state.shift === "all" || r.shift === state.shift) &&
    r.date >= from && r.date <= to
  );
}

/* ---------- 6. Toast message ---------- */
let toastTimer;
function toast(message, isError = false) {
  const el = $("toast");
  el.textContent = message;
  el.className = "toast show" + (isError ? " error" : "");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 4200);
}

/* ---------- 7. Charts ---------- */
const hasChart = typeof Chart !== "undefined";
const charts = {};

if (hasChart) {
  Chart.defaults.font.family = '"Segoe UI", system-ui, Arial, sans-serif';
  Chart.defaults.color = "#6b7785";
}

const GRID = "#eef1f4";
const lineOpts = (extra = {}) => ({
  responsive: true, maintainAspectRatio: false,
  interaction: { mode: "index", intersect: false },
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false } },
    y: { beginAtZero: true, grid: { color: GRID } }
  },
  ...extra
});
const barOpts = (extra = {}) => ({
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false } },
    y: { beginAtZero: true, grid: { color: GRID } }
  },
  ...extra
});

const CHART_TYPES = {
  ordersTrend:     { type: "line",     options: lineOpts() },
  shiftSplit:      { type: "doughnut", options: { responsive: true, maintainAspectRatio: false, cutout: "64%", plugins: { legend: { position: "bottom" } } } },
  manpowerShift:   { type: "bar",      options: barOpts({ plugins: { legend: { position: "bottom" } } }) },
  attendanceStore: { type: "bar",      options: barOpts({ indexAxis: "y", scales: { x: { min: 0, max: 100, grid: { color: GRID }, ticks: { callback: (v) => v + "%" } }, y: { grid: { display: false } } } }) },
  grnTrend:        { type: "line",     options: lineOpts() },
  grnStore:        { type: "bar",      options: barOpts() },
  ppiTrend:        { type: "line",     options: lineOpts({ plugins: { legend: { position: "bottom" } }, scales: { x: { grid: { display: false } }, y: { beginAtZero: false, grid: { color: GRID } } } }) },
  ppiShift:        { type: "bar",      options: barOpts({ scales: { x: { grid: { display: false } }, y: { beginAtZero: false, suggestedMin: 14, grid: { color: GRID } } } }) },
  complaintsTrend: { type: "bar",      options: barOpts({ plugins: { legend: { position: "bottom" } }, scales: { x: { stacked: true, grid: { display: false } }, y: { stacked: true, beginAtZero: true, grid: { color: GRID } } } }) },
  complaintsSplit: { type: "doughnut", options: { responsive: true, maintainAspectRatio: false, cutout: "64%", plugins: { legend: { position: "bottom" } } } },
  complaintsStore: { type: "bar",      options: barOpts({ plugins: { legend: { position: "bottom" } }, scales: { x: { stacked: true, grid: { display: false } }, y: { stacked: true, beginAtZero: true, grid: { color: GRID } } } }) },
  complaintsShift: { type: "bar",      options: barOpts({ scales: { x: { grid: { display: false } }, y: { beginAtZero: true, grid: { color: GRID }, ticks: { callback: (v) => v + "%" } } } }) }
};

function upsertChart(id, labels, datasets) {
  if (!hasChart) return;
  if (charts[id]) {
    charts[id].data.labels = labels;
    charts[id].data.datasets = datasets;
    charts[id].update();
    return;
  }
  const def = CHART_TYPES[id];
  charts[id] = new Chart($(id), { type: def.type, data: { labels, datasets }, options: def.options });
}

const lineSet = (label, data, color, fillColor) => ({
  label, data,
  borderColor: color, backgroundColor: fillColor || color,
  fill: !!fillColor, tension: 0.35, borderWidth: 2.5,
  pointRadius: 2.5, pointHoverRadius: 5
});

/* ---------- 8. Filters ---------- */
function fillSelect(select, allLabel, values, selected) {
  select.innerHTML = "";
  const first = document.createElement("option");
  first.value = "all";
  first.textContent = allLabel;
  select.appendChild(first);
  values.forEach((v) => {
    const o = document.createElement("option");
    o.value = v;
    o.textContent = v;
    select.appendChild(o);
  });
  select.value = values.includes(selected) ? selected : "all";
}

function initFilters(resetDates) {
  const stores = uniqueInOrder(records.map((r) => r.store));
  const shifts = uniqueInOrder(records.map((r) => r.shift));
  fillSelect($("storeFilter"), "All Stores", stores, state.store);
  fillSelect($("shiftFilter"), "All Shifts", shifts, state.shift);
  state.store = $("storeFilter").value;
  state.shift = $("shiftFilter").value;

  const dates = records.map((r) => r.date).sort();
  const min = dates[0], max = dates[dates.length - 1];
  $("fromDate").min = $("toDate").min = min;
  $("fromDate").max = $("toDate").max = max;

  if (resetDates) {
    state.to = max;
    const lastWeek = addDays(max, -6);
    state.from = lastWeek > min ? lastWeek : min;   // default: last 7 days
  }
  $("fromDate").value = state.from;
  $("toDate").value = state.to;
}

function resetFilters() {
  state.store = "all"; state.shift = "all";
  state.search = ""; state.pageNo = 1;
  $("tableSearch").value = "";
  initFilters(true);
  render();
}

/* ---------- 9. KPI cards ---------- */
function pctChange(cur, prev) {
  return prev > 0 ? ((cur - prev) / prev) * 100 : null;
}

function setTrend(id, delta, higherIsBetter, unit, hasPrev) {
  const el = $(id);
  if (delta === null || !hasPrev) {
    el.textContent = "–";
    el.className = "trend";
    return;
  }
  const up = delta >= 0;
  const flat = Math.abs(delta) < 0.05;
  el.textContent = `${flat ? "●" : up ? "▲" : "▼"} ${Math.abs(delta).toFixed(1)}${unit}`;
  el.className = "trend" + (flat ? "" : up === higherIsBetter ? " good" : " bad");
}

function renderKPIs(rows, prevRows) {
  const c = aggregate(rows), p = aggregate(prevRows);
  const hasPrev = prevRows.length > 0;

  $("kpiOrders").textContent = fmtNum(c.orders);
  setTrend("trendOrders", pctChange(c.orders, p.orders), true, "%", hasPrev);

  $("kpiManpower").textContent = `${fmtNum(c.present)} / ${fmtNum(c.planned)}`;
  const attC = c.planned ? (c.present / c.planned) * 100 : 0;
  const attP = p.planned ? (p.present / p.planned) * 100 : 0;
  setTrend("trendManpower", attC - attP, true, " pts", hasPrev && p.planned > 0);
  $("noteManpower").textContent = `${attC.toFixed(1)}% attendance`;

  $("kpiPPI").textContent = c.count ? c.ppi.toFixed(1) : "–";
  setTrend("trendPPI", pctChange(c.ppi, p.ppi), true, "%", hasPrev);

  $("kpiGRN").textContent = fmtNum(c.grn);
  setTrend("trendGRN", pctChange(c.grn, p.grn), false, "%", hasPrev);

  $("kpiComplaints").textContent = fmtNum(c.complaints);
  setTrend("trendComplaints", pctChange(c.complaints, p.complaints), false, "%", hasPrev);
  $("noteComplaints").textContent = c.orders ? `${((c.complaints / c.orders) * 100).toFixed(2)}% of orders` : "of orders";
}

/* ---------- 10. Overview page ---------- */
function buildInsights(rows) {
  if (!rows.length) return [{ type: "info", text: "No data for the selected filters. Try widening the date range." }];

  const out = [];

  // Peak shift
  const byShift = groupBy(rows, (r) => r.shift);
  let peak = null;
  byShift.forEach((list, name) => {
    const total = sum(list, "orders");
    if (!peak || total > peak.total) peak = { name, total };
  });
  const totalOrders = sum(rows, "orders");
  out.push({ type: "info", text: `${peak.name} is the busiest shift, handling ${((peak.total / totalOrders) * 100).toFixed(0)}% of all orders.` });

  // Manpower gaps
  const gaps = rows.filter((r) => r.present < r.planned);
  if (!gaps.length) {
    out.push({ type: "good", text: "Every shift met its planned manpower in this period." });
  } else {
    const byStore = groupBy(gaps, (r) => r.store);
    let worst = null;
    byStore.forEach((list, name) => { if (!worst || list.length > worst.n) worst = { name, n: list.length }; });
    out.push({ type: "warn", text: `${gaps.length} of ${rows.length} shifts ran below planned manpower. ${worst.name} had the most gaps (${worst.n}).` });
  }

  // PPI vs target
  const low = rows.filter((r) => r.ppi < TARGET_PPI);
  const avgPPI = avg(rows, "ppi");
  if (!low.length) {
    out.push({ type: "good", text: `All shifts met the PPI target of ${TARGET_PPI}. Average PPI is ${avgPPI.toFixed(1)}.` });
  } else {
    out.push({ type: low.length / rows.length > 0.35 ? "warn" : "info", text: `${low.length} shifts (${((low.length / rows.length) * 100).toFixed(0)}%) were below the PPI target of ${TARGET_PPI}. Average PPI is ${avgPPI.toFixed(1)}.` });
  }

  // GRN backlog
  const grnByStore = [...groupBy(rows, (r) => r.store)].map(([name, list]) => ({ name, total: sum(list, "grn") })).sort((a, b) => b.total - a.total);
  const highGRN = rows.filter((r) => r.grn >= GRN_ALERT).length;
  out.push({ type: highGRN ? "warn" : "good", text: `${grnByStore[0].name} carries the largest GRN backlog (${fmtNum(grnByStore[0].total)} units). ${highGRN} shifts had ${GRN_ALERT}+ units pending.` });

  // Complaints
  const totalComplaints = rows.reduce((t, r) => t + complaintsOf(r), 0);
  if (totalComplaints > 0) {
    const cats = CATEGORIES.map((c) => ({ label: c.label, total: sum(rows, c.key) })).sort((a, b) => b.total - a.total);
    const rate = (totalComplaints / totalOrders) * 100;
    out.push({
      type: rate >= COMPLAINT_ALERT ? "warn" : "info",
      text: `${cats[0].label} is the top complaint type (${((cats[0].total / totalComplaints) * 100).toFixed(0)}% of ${fmtNum(totalComplaints)} complaints). Overall complaint rate is ${rate.toFixed(2)}% of orders.`
    });
  } else {
    out.push({ type: "good", text: "No complaints recorded in this period." });
  }

  return out;
}

function renderInsights(rows) {
  $("insightList").innerHTML = buildInsights(rows)
    .map((i) => `<li class="${i.type}"><span class="dot"></span><span>${esc(i.text)}</span></li>`)
    .join("");
}

const SORTERS = {
  date: (r) => r.date,
  store: (r) => r.store,
  shift: (r) => r.shift,
  orders: (r) => r.orders,
  present: (r) => r.present,
  attendance: (r) => attendance(r),
  ppi: (r) => r.ppi,
  grn: (r) => r.grn,
  complaints: (r) => complaintsOf(r),
  status: (r) => statusOf(r).label
};

function getTableRows(rows) {
  const q = state.search.trim().toLowerCase();
  let list = rows.filter((r) => !q || `${r.date} ${fmtDate(r.date)} ${r.store} ${r.shift} ${statusOf(r).label}`.toLowerCase().includes(q));
  const get = SORTERS[state.sortKey];
  const dir = state.sortDir === "asc" ? 1 : -1;
  list.sort((a, b) => {
    const x = get(a), y = get(b);
    if (x < y) return -1 * dir;
    if (x > y) return 1 * dir;
    return a.store.localeCompare(b.store) || a.shift.localeCompare(b.shift);
  });
  return list;
}

function renderTable(rows) {
  const list = getTableRows(rows);
  const pages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  state.pageNo = Math.min(state.pageNo, pages);
  const start = (state.pageNo - 1) * PAGE_SIZE;
  const slice = list.slice(start, start + PAGE_SIZE);

  $("shiftTableBody").innerHTML = slice.length
    ? slice.map((r) => {
        const s = statusOf(r);
        return `<tr>
          <td>${fmtDate(r.date)}</td>
          <td><strong>${esc(r.store)}</strong></td>
          <td>${esc(r.shift)}</td>
          <td class="num">${fmtNum(r.orders)}</td>
          <td class="num">${r.present} / ${r.planned}</td>
          <td class="num">${attendance(r).toFixed(0)}%</td>
          <td class="num">${r.ppi.toFixed(1)}</td>
          <td class="num">${fmtNum(r.grn)}</td>
          <td class="num">${complaintsOf(r)}</td>
          <td><span class="shift-status ${s.cls}">${s.label}</span></td>
        </tr>`;
      }).join("")
    : `<tr><td class="empty" colspan="10">No matching rows found.</td></tr>`;

  $("tableInfo").textContent = list.length
    ? `Showing ${start + 1}–${start + slice.length} of ${list.length} rows`
    : "0 rows";
  $("prevPage").disabled = state.pageNo <= 1;
  $("nextPage").disabled = state.pageNo >= pages;

  document.querySelectorAll("th[data-sort]").forEach((th) => {
    th.classList.remove("sorted-asc", "sorted-desc");
    if (th.dataset.sort === state.sortKey) th.classList.add("sorted-" + state.sortDir);
  });
}

function renderOverview(rows) {
  // Orders trend (per day)
  const byDate = [...groupBy(rows, (r) => r.date)].sort((a, b) => a[0].localeCompare(b[0]));
  upsertChart("ordersTrend",
    byDate.map(([d]) => fmtDate(d)),
    [lineSet("Orders", byDate.map(([, l]) => sum(l, "orders")), "#d9a514", "rgba(248, 203, 70, 0.28)")]
  );

  // Shift split
  const shifts = uniqueInOrder(rows.map((r) => r.shift));
  upsertChart("shiftSplit", shifts, [{
    data: shifts.map((s) => sum(rows.filter((r) => r.shift === s), "orders")),
    backgroundColor: shifts.map((_, i) => COLORS[i % COLORS.length]),
    borderWidth: 2, borderColor: "#fff"
  }]);

  renderInsights(rows);
  renderTable(rows);
}

/* ---------- 11. Mini stat tiles ---------- */
function renderMini(id, items) {
  $(id).innerHTML = items.map((i) =>
    `<div class="mini"><div class="label">${esc(i.label)}</div><div class="value">${esc(String(i.value))}</div><div class="sub">${esc(i.sub)}</div></div>`
  ).join("");
}

function simpleRows(id, rows, cols, emptyCols) {
  $(id).innerHTML = rows.length
    ? rows.map((cells) => `<tr>${cells.join("")}</tr>`).join("")
    : `<tr><td class="empty" colspan="${emptyCols}">No data for the selected filters.</td></tr>`;
}

/* ---------- 12. Manpower page ---------- */
function renderManpower(rows) {
  const c = aggregate(rows);
  const gaps = rows.filter((r) => r.present < r.planned);
  const att = c.planned ? (c.present / c.planned) * 100 : 0;

  renderMini("manpowerStats", [
    { label: "Shifts below plan", value: gaps.length, sub: `out of ${rows.length} shifts` },
    { label: "Headcount gap", value: fmtNum(c.planned - c.present), sub: "planned minus present" },
    { label: "Overall attendance", value: att.toFixed(1) + "%", sub: `${fmtNum(c.present)} of ${fmtNum(c.planned)} present` }
  ]);

  const shifts = uniqueInOrder(rows.map((r) => r.shift));
  upsertChart("manpowerShift", shifts, [
    { label: "Planned", data: shifts.map((s) => sum(rows.filter((r) => r.shift === s), "planned")), backgroundColor: "#cbd5e1", borderRadius: 6, maxBarThickness: 48 },
    { label: "Present", data: shifts.map((s) => sum(rows.filter((r) => r.shift === s), "present")), backgroundColor: "#f8cb46", borderRadius: 6, maxBarThickness: 48 }
  ]);

  const stores = uniqueInOrder(rows.map((r) => r.store));
  upsertChart("attendanceStore", stores, [{
    label: "Attendance %",
    data: stores.map((s) => {
      const l = rows.filter((r) => r.store === s);
      const pl = sum(l, "planned");
      return pl ? +((sum(l, "present") / pl) * 100).toFixed(1) : 0;
    }),
    backgroundColor: "#263746", borderRadius: 6, maxBarThickness: 34
  }]);

  const top = gaps.slice()
    .sort((a, b) => (b.planned - b.present) - (a.planned - a.present) || b.date.localeCompare(a.date))
    .slice(0, 10)
    .map((r) => [
      `<td>${fmtDate(r.date)}</td>`, `<td><strong>${esc(r.store)}</strong></td>`, `<td>${esc(r.shift)}</td>`,
      `<td class="num">${r.planned}</td>`, `<td class="num">${r.present}</td>`,
      `<td class="num"><span class="shift-status status-warning">−${r.planned - r.present}</span></td>`
    ]);
  simpleRows("gapTableBody", top, 6, 6);
}

/* ---------- 13. Inventory page ---------- */
function renderInventory(rows) {
  const c = aggregate(rows);
  const byStore = [...groupBy(rows, (r) => r.store)].map(([name, l]) => ({ name, total: sum(l, "grn") })).sort((a, b) => b.total - a.total);
  const high = rows.filter((r) => r.grn >= GRN_ALERT).length;

  renderMini("grnStats", [
    { label: "Total pending GRN", value: fmtNum(c.grn), sub: "units in selected range" },
    { label: "Average per shift", value: c.count ? fmtNum(c.grn / c.count) : "–", sub: "units pending" },
    { label: "High-priority shifts", value: high, sub: byStore.length ? `${GRN_ALERT}+ units · top store: ${byStore[0].name}` : `${GRN_ALERT}+ units pending` }
  ]);

  const byDate = [...groupBy(rows, (r) => r.date)].sort((a, b) => a[0].localeCompare(b[0]));
  upsertChart("grnTrend",
    byDate.map(([d]) => fmtDate(d)),
    [lineSet("Pending GRN", byDate.map(([, l]) => sum(l, "grn")), "#b91c1c", "rgba(220, 38, 38, 0.10)")]
  );

  upsertChart("grnStore", byStore.map((s) => s.name), [{
    label: "Pending GRN", data: byStore.map((s) => s.total),
    backgroundColor: "#263746", borderRadius: 6, maxBarThickness: 48
  }]);

  const top = rows.slice().sort((a, b) => b.grn - a.grn || b.date.localeCompare(a.date)).slice(0, 10).map((r) => {
    const level = r.grn >= GRN_ALERT ? ["High", "status-bad"] : r.grn >= 100 ? ["Medium", "status-warning"] : ["Low", "status-good"];
    return [
      `<td>${fmtDate(r.date)}</td>`, `<td><strong>${esc(r.store)}</strong></td>`, `<td>${esc(r.shift)}</td>`,
      `<td class="num">${fmtNum(r.grn)}</td>`, `<td><span class="shift-status ${level[1]}">${level[0]}</span></td>`
    ];
  });
  simpleRows("grnTableBody", top, 5, 5);
}

/* ---------- 13b. Complaints page ---------- */
function renderComplaints(rows, prevRows) {
  const totalOrders = sum(rows, "orders");
  const total = rows.reduce((t, r) => t + complaintsOf(r), 0);

  // Category tiles with trend vs previous period
  $("complaintCats").innerHTML = CATEGORIES.map((c) => {
    const cur = sum(rows, c.key);
    const prev = sum(prevRows, c.key);
    const delta = prevRows.length ? pctChange(cur, prev) : null;
    let trend = `<span class="trend">–</span>`;
    if (delta !== null) {
      const up = delta >= 0;
      trend = `<span class="trend ${up ? "bad" : "good"}">${up ? "▲" : "▼"} ${Math.abs(delta).toFixed(1)}%</span>`;
    }
    const rate = totalOrders ? ((cur / totalOrders) * 100).toFixed(2) : "0.00";
    return `<div class="cat-tile" style="--cat:${c.color}">
      <div class="cat-head"><span>${esc(c.label)}</span><span>${c.icon}</span></div>
      <div class="cat-value">${fmtNum(cur)}</div>
      <div class="cat-sub">${trend}<span>${rate}% of orders</span></div>
    </div>`;
  }).join("");

  // Stacked trend by day
  const byDate = [...groupBy(rows, (r) => r.date)].sort((a, b) => a[0].localeCompare(b[0]));
  upsertChart("complaintsTrend",
    byDate.map(([d]) => fmtDate(d)),
    CATEGORIES.map((c) => ({
      label: c.label,
      data: byDate.map(([, l]) => sum(l, c.key)),
      backgroundColor: c.color, borderRadius: 3, maxBarThickness: 36
    }))
  );

  // Category split
  upsertChart("complaintsSplit", CATEGORIES.map((c) => c.label), [{
    data: CATEGORIES.map((c) => sum(rows, c.key)),
    backgroundColor: CATEGORIES.map((c) => c.color),
    borderWidth: 2, borderColor: "#fff"
  }]);

  // By store (stacked)
  const stores = uniqueInOrder(rows.map((r) => r.store));
  upsertChart("complaintsStore", stores,
    CATEGORIES.map((c) => ({
      label: c.label,
      data: stores.map((s) => sum(rows.filter((r) => r.store === s), c.key)),
      backgroundColor: c.color, maxBarThickness: 56
    }))
  );

  // Rate by shift (% of orders)
  const shifts = uniqueInOrder(rows.map((r) => r.shift));
  upsertChart("complaintsShift", shifts, [{
    label: "Complaint rate %",
    data: shifts.map((s) => {
      const l = rows.filter((r) => r.shift === s);
      const o = sum(l, "orders");
      return o ? +((l.reduce((t, r) => t + complaintsOf(r), 0) / o) * 100).toFixed(2) : 0;
    }),
    backgroundColor: "#8b5cf6", borderRadius: 6, maxBarThickness: 60
  }]);

  // Hotspot table
  const top = rows.slice()
    .sort((a, b) => complaintsOf(b) - complaintsOf(a) || complaintRate(b) - complaintRate(a))
    .slice(0, 10)
    .map((r) => {
      const rate = complaintRate(r);
      const cls = rate >= COMPLAINT_ALERT ? "status-bad" : rate >= 1.5 ? "status-warning" : "status-good";
      return [
        `<td>${fmtDate(r.date)}</td>`, `<td><strong>${esc(r.store)}</strong></td>`, `<td>${esc(r.shift)}</td>`,
        ...CATEGORIES.map((c) => `<td class="num">${r[c.key] || 0}</td>`),
        `<td class="num"><strong>${complaintsOf(r)}</strong></td>`,
        `<td class="num"><span class="shift-status ${cls}">${rate.toFixed(2)}%</span></td>`
      ];
    });
  simpleRows("complaintTableBody", total ? top : [], 10, 10);
}

/* ---------- 13c. Live store status (present SM + next truck) ---------- */
const pageOpenedAt = Date.now();

const fmtClock = (ms) => new Date(ms).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false });

function durationText(min) {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60), m = min % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

function currentShiftName(date) {
  const h = date.getHours();
  if (h >= 6 && h < 14) return "Morning";
  if (h >= 14 && h < 22) return "Evening";
  return "Night";
}

function truckState(truck, now) {
  const eta = pageOpenedAt + (truck.etaMin + (truck.delayMin || 0)) * 60000;
  const diff = Math.round((eta - now) / 60000);
  if (diff > 0) return { ...truck, eta, state: truck.delayMin ? "delayed" : "arriving", diff };
  if (diff > -45) return { ...truck, eta, state: "unloading", diff };
  return { ...truck, eta, state: "done", diff };
}

function renderLive() {
  const now = Date.now();
  const shift = currentShiftName(new Date(now));
  $("liveClock").textContent = `Live · ${fmtClock(now)} · ${shift} shift`;

  const names = Object.keys(STORE_LIVE).filter((n) =>
    records.some((r) => r.store === n) && (state.store === "all" || state.store === n)
  );

  if (!names.length) {
    $("liveGrid").innerHTML = `<p class="muted">Live SM and truck info is set up for the demo stores. Add your own stores in <code>STORE_LIVE</code> inside script.js.</p>`;
    return;
  }

  const latest = records.reduce((m, r) => (r.date > m ? r.date : m), "");

  $("liveGrid").innerHTML = names.map((name) => {
    const info = STORE_LIVE[name];
    const sm = info.sm[shift];

    // Present SM
    const initials = sm.name.split(" ").map((w) => w[0]).join("").slice(0, 2);
    const smRow = sm.leave
      ? `<div class="icon leave">${esc(initials)}</div>
         <div><div class="label">Store Manager · ${shift}</div>
         <div class="name">${esc(sm.name)} — on leave</div>
         <div class="sub">Cover: ${esc(sm.cover || "not assigned")}</div></div>`
      : `<div class="icon">${esc(initials)}</div>
         <div><div class="label">Store Manager · ${shift}</div>
         <div class="name">${esc(sm.name)}</div>
         <div class="sub">Present · checked in ${esc(sm.checkIn)}</div></div>`;

    // Trucks
    const trucks = info.trucks.map((t) => truckState(t, now)).filter((t) => t.state !== "done").sort((a, b) => a.eta - b.eta);
    let truckRow;
    if (!trucks.length) {
      truckRow = `<div class="icon truck">🚚</div><div><div class="label">Next truck</div><div class="name">No more trucks today</div></div>`;
    } else {
      const t = trucks[0];
      const badge = t.state === "unloading"
        ? `<span class="eta unloading">Unloading now</span>`
        : t.state === "delayed"
          ? `<span class="eta delayed">Delayed · arriving in ${durationText(t.diff)} (${fmtClock(t.eta)})</span>`
          : `<span class="eta arriving">Arriving in ${durationText(t.diff)} (${fmtClock(t.eta)})</span>`;
      const later = trucks.slice(1, 3).map((x) => `${esc(x.id)} · ${fmtClock(x.eta)}`).join(" &nbsp;|&nbsp; ");
      truckRow = `<div class="icon truck">🚚</div>
        <div><div class="label">Next truck arriving</div>
        <div class="name">${esc(t.id)}</div>
        <div class="sub">${esc(t.from)} · ${t.cartons} cartons</div>
        ${badge}
        ${later ? `<div class="sub" style="margin-top:6px">Then: ${later}</div>` : ""}</div>`;
    }

    // Latest-day numbers for this store
    const todayRows = records.filter((r) => r.store === name && r.date === latest);
    const todayOrders = sum(todayRows, "orders");
    const todayComplaints = todayRows.reduce((t, r) => t + complaintsOf(r), 0);

    return `<article class="live-card">
      <div class="live-store">${esc(name)}</div>
      <div class="live-row">${smRow}</div>
      <div class="live-row">${truckRow}</div>
      <div class="live-foot">
        <span>Orders · ${fmtDate(latest)}: <strong>${fmtNum(todayOrders)}</strong></span>
        <span>Complaints: <strong>${todayComplaints}</strong></span>
      </div>
    </article>`;
  }).join("");
}

/* ---------- 14. Productivity page ---------- */
function renderProductivity(rows) {
  const above = rows.filter((r) => r.ppi >= TARGET_PPI).length;
  const shifts = uniqueInOrder(rows.map((r) => r.shift));
  const shiftAvg = shifts.map((s) => ({ name: s, ppi: avg(rows.filter((r) => r.shift === s), "ppi") })).sort((a, b) => b.ppi - a.ppi);

  renderMini("ppiStats", [
    { label: "Shifts at or above target", value: rows.length ? ((above / rows.length) * 100).toFixed(0) + "%" : "–", sub: `${above} of ${rows.length} shifts` },
    { label: "Best shift", value: shiftAvg.length ? shiftAvg[0].name : "–", sub: shiftAvg.length ? `Average PPI ${shiftAvg[0].ppi.toFixed(1)}` : "" },
    { label: "Weakest shift", value: shiftAvg.length ? shiftAvg[shiftAvg.length - 1].name : "–", sub: shiftAvg.length ? `Average PPI ${shiftAvg[shiftAvg.length - 1].ppi.toFixed(1)}` : "" }
  ]);

  const byDate = [...groupBy(rows, (r) => r.date)].sort((a, b) => a[0].localeCompare(b[0]));
  upsertChart("ppiTrend",
    byDate.map(([d]) => fmtDate(d)),
    [
      lineSet("Average PPI", byDate.map(([, l]) => +avg(l, "ppi").toFixed(2)), "#263746"),
      { label: `Target (${TARGET_PPI})`, data: byDate.map(() => TARGET_PPI), borderColor: "#dc2626", borderDash: [6, 5], borderWidth: 1.5, pointRadius: 0, fill: false }
    ]
  );

  upsertChart("ppiShift", shifts, [{
    label: "Average PPI",
    data: shifts.map((s) => +avg(rows.filter((r) => r.shift === s), "ppi").toFixed(2)),
    backgroundColor: shifts.map((s) => avg(rows.filter((r) => r.shift === s), "ppi") >= TARGET_PPI ? "#16a34a" : "#f59e0b"),
    borderRadius: 6, maxBarThickness: 60
  }]);

  const bottom = rows.slice().sort((a, b) => a.ppi - b.ppi || b.date.localeCompare(a.date)).slice(0, 10).map((r) => {
    const diff = r.ppi - TARGET_PPI;
    const s = diff >= 0 ? ["On target", "status-good"] : ["Below target", "status-bad"];
    return [
      `<td>${fmtDate(r.date)}</td>`, `<td><strong>${esc(r.store)}</strong></td>`, `<td>${esc(r.shift)}</td>`,
      `<td class="num">${r.ppi.toFixed(1)}</td>`, `<td class="num">${diff >= 0 ? "+" : ""}${diff.toFixed(1)}</td>`,
      `<td><span class="shift-status ${s[1]}">${s[0]}</span></td>`
    ];
  });
  simpleRows("ppiTableBody", bottom, 6, 6);
}

/* ---------- 15. Main render ---------- */
function render() {
  const rows = applyFilters(records, state.from, state.to);

  // Previous period of the same length, used for the trend badges
  const days = daysBetween(state.from, state.to);
  const prevTo = addDays(state.from, -1);
  const prevFrom = addDays(prevTo, -(days - 1));
  const prevRows = applyFilters(records, prevFrom, prevTo);

  $("rangeLabel").textContent = `${fmtFull(state.from)} – ${fmtFull(state.to)} · ${days} day${days > 1 ? "s" : ""} · ${rows.length} shift records`;

  renderKPIs(rows, prevRows);
  renderOverview(rows);
  renderLive();
  renderManpower(rows);
  renderInventory(rows);
  renderComplaints(rows, prevRows);
  renderProductivity(rows);
}

/* ---------- 16. Page navigation ---------- */
function showPage(page) {
  state.page = page;
  $("main").dataset.page = page;
  document.querySelectorAll(".page").forEach((p) => p.classList.toggle("hidden", p.dataset.page !== page));
  document.querySelectorAll(".nav-item").forEach((b) => b.classList.toggle("active", b.dataset.page === page));
  $("pageTitle").textContent = PAGE_TEXT[page][0];
  $("pageSubtitle").textContent = PAGE_TEXT[page][1];
  // Charts drawn while hidden need a resize once they become visible
  requestAnimationFrame(() => Object.values(charts).forEach((c) => c.resize()));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ---------- 17. CSV import / export ---------- */
function splitCSVLine(line) {
  const out = [];
  let cur = "", quoted = false;
  for (const ch of line) {
    if (ch === '"') quoted = !quoted;
    else if (ch === "," && !quoted) { out.push(cur); cur = ""; }
    else cur += ch;
  }
  out.push(cur);
  return out.map((s) => s.trim());
}

function normalizeDate(s) {
  let y, m, d;
  let match = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (match) { y = +match[1]; m = +match[2]; d = +match[3]; }
  else {
    match = s.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);   // DD-MM-YYYY or DD/MM/YYYY
    if (!match) return null;
    d = +match[1]; m = +match[2]; y = +match[3];
  }
  const check = new Date(y, m - 1, d);
  if (check.getFullYear() !== y || check.getMonth() !== m - 1 || check.getDate() !== d) return null;
  return `${y}-${pad(m)}-${pad(d)}`;
}

function loadCSV(text, fileName) {
  const lines = text.replace(/^\uFEFF/, "").split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) { toast("That CSV has no data rows.", true); return; }

  const header = splitCSVLine(lines[0]).map((h) => h.toLowerCase());
  const missing = REQUIRED_COLUMNS.filter((c) => !header.includes(c));
  if (missing.length) {
    toast(`Missing column(s): ${missing.join(", ")}. Needed: date,store,shift,orders,present,planned,ppi,grn`, true);
    return;
  }
  const idx = {};
  header.forEach((h, i) => { idx[h] = i; });

  const rows = [];
  let skipped = 0;

  for (let i = 1; i < lines.length; i++) {
    const cells = splitCSVLine(lines[i]);
    const date = normalizeDate(cells[idx.date] || "");
    const shift = cells[idx.shift];
    const nums = ["orders", "present", "planned", "ppi", "grn"].map((k) => Number(cells[idx[k]]));
    let bad = !date || !shift || nums.some((n) => !isFinite(n) || n < 0) || cells[idx.orders] === "";

    // Complaint columns are optional: a missing column or empty cell counts as 0
    const complaints = {};
    COMPLAINT_KEYS.forEach((k) => {
      const raw = idx[k] === undefined ? "" : cells[idx[k]];
      const n = raw === undefined || raw === "" ? 0 : Number(raw);
      if (!isFinite(n) || n < 0) bad = true;
      complaints[k] = n;
    });

    if (bad) { skipped++; continue; }
    rows.push({
      date,
      store: idx.store !== undefined && cells[idx.store] ? cells[idx.store] : "Uploaded Store",
      shift,
      orders: nums[0], present: nums[1], planned: nums[2], ppi: nums[3], grn: nums[4],
      ...complaints
    });
  }

  if (!rows.length) { toast("No valid rows found. Check the column format and dates.", true); return; }

  records = rows;
  isCustom = true;
  state.store = "all"; state.shift = "all"; state.search = ""; state.pageNo = 1;
  $("tableSearch").value = "";
  initFilters(true);
  updateSourceLabels(fileName);
  render();
  toast(`Loaded ${rows.length} rows from ${fileName}` + (skipped ? ` (${skipped} invalid rows skipped)` : ""));
}

function updateSourceLabels(fileName) {
  $("demoBadge").textContent = isCustom ? "CUSTOM DATA" : "DEMO DATA";
  $("demoBadge").classList.toggle("custom", isCustom);
  $("resetData").classList.toggle("hidden", !isCustom);
  $("dataSourceLabel").textContent = isCustom ? `Loaded: ${fileName}` : "Using sample data";
}

function exportCSV() {
  const rows = getTableRows(applyFilters(records, state.from, state.to));
  if (!rows.length) { toast("Nothing to export for these filters.", true); return; }
  const q = (v) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
  const lines = [["date", "store", "shift", "orders", "present", "planned", "ppi", "grn", ...COMPLAINT_KEYS].join(",")].concat(
    rows.map((r) => [r.date, q(r.store), q(r.shift), r.orders, r.present, r.planned, r.ppi, r.grn, ...COMPLAINT_KEYS.map((k) => r[k] || 0)].join(","))
  );
  const blob = new Blob(["\uFEFF" + lines.join("\n")], { type: "text/csv;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "operations-data.csv";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(link.href);
  toast(`Exported ${rows.length} rows.`);
}

/* ---------- 18. Event listeners ---------- */
document.querySelectorAll(".nav-item").forEach((btn) =>
  btn.addEventListener("click", () => showPage(btn.dataset.page))
);

$("storeFilter").addEventListener("change", (e) => { state.store = e.target.value; state.pageNo = 1; render(); });
$("shiftFilter").addEventListener("change", (e) => { state.shift = e.target.value; state.pageNo = 1; render(); });

$("fromDate").addEventListener("change", (e) => {
  if (!e.target.value) { e.target.value = state.from; return; }
  state.from = e.target.value;
  if (state.from > state.to) { state.to = state.from; $("toDate").value = state.to; }
  state.pageNo = 1; render();
});
$("toDate").addEventListener("change", (e) => {
  if (!e.target.value) { e.target.value = state.to; return; }
  state.to = e.target.value;
  if (state.to < state.from) { state.from = state.to; $("fromDate").value = state.from; }
  state.pageNo = 1; render();
});

$("resetFilters").addEventListener("click", resetFilters);

$("tableSearch").addEventListener("input", (e) => { state.search = e.target.value; state.pageNo = 1; render(); });

document.querySelectorAll("th[data-sort]").forEach((th) =>
  th.addEventListener("click", () => {
    const key = th.dataset.sort;
    if (state.sortKey === key) state.sortDir = state.sortDir === "asc" ? "desc" : "asc";
    else { state.sortKey = key; state.sortDir = key === "date" || key === "store" || key === "shift" || key === "status" ? "asc" : "desc"; }
    state.pageNo = 1;
    render();
  })
);

$("prevPage").addEventListener("click", () => { state.pageNo--; render(); });
$("nextPage").addEventListener("click", () => { state.pageNo++; render(); });
$("exportCSV").addEventListener("click", exportCSV);

$("csvUpload").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => loadCSV(String(reader.result), file.name);
  reader.onerror = () => toast("Could not read that file.", true);
  reader.readAsText(file);
  e.target.value = "";                 // allows re-uploading the same file
});

$("resetData").addEventListener("click", () => {
  records = generateData();
  isCustom = false;
  state.store = "all"; state.shift = "all"; state.search = ""; state.pageNo = 1;
  $("tableSearch").value = "";
  initFilters(true);
  updateSourceLabels("");
  render();
  toast("Back to demo data.");
});

/* ---------- 19. First load ---------- */
if (!hasChart) toast("Charts need an internet connection (Chart.js could not load).", true);
initFilters(true);
render();
setInterval(renderLive, 30000);   // keep the SM / truck countdowns fresh