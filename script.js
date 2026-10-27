/* =========================================================
   QUICK COMMERCE OPERATIONS DASHBOARD  ·  style.css
   ========================================================= */

/* 1. Design tokens (colours, radius, shadows) */
:root {
  --bg: #f3f5f8;
  --surface: #ffffff;
  --ink: #111827;
  --muted: #6b7785;
  --line: #e6e9ee;

  --navy: #141b24;
  --navy-2: #1d2733;
  --navy-3: #2a3644;

  --yellow: #f8cb46;
  --yellow-dark: #e7b92e;
  --yellow-soft: #fff6d6;

  --good: #15803d;
  --good-bg: #dcfce7;
  --warn: #92600a;
  --warn-bg: #fef3c7;
  --bad: #b91c1c;
  --bad-bg: #fee2e2;

  --radius: 14px;
  --shadow: 0 1px 2px rgba(17, 24, 39, 0.04), 0 4px 14px rgba(17, 24, 39, 0.05);
}

/* 2. Base */
* { box-sizing: border-box; }

body {
  margin: 0;
  font-family: "Segoe UI", system-ui, -apple-system, Arial, sans-serif;
  background: var(--bg);
  color: var(--ink);
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3, p { margin: 0; }
.hidden { display: none !important; }
.muted { color: var(--muted); font-size: 13px; }

button, input, select { font: inherit; color: inherit; }

/* 3. Layout */
.app { display: flex; min-height: 100vh; }

.main {
  flex: 1;
  min-width: 0;
  padding: 28px 32px 40px;
  max-width: 1500px;
}

/* 4. Sidebar */
.sidebar {
  width: 250px;
  flex-shrink: 0;
  background: linear-gradient(180deg, var(--navy) 0%, var(--navy-2) 100%);
  color: #fff;
  padding: 26px 18px;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

/* Logo (your logo.png image, with a text fallback if the file is missing) */
.logo {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  padding: 4px 4px 18px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
.logo-img {
  display: block;
  width: auto;
  height: auto;
  max-width: 170px;
  max-height: 52px;
  border-radius: 8px;
  object-fit: contain;
}
.logo-fallback {
  display: none;
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.8px;
  color: #fff;
}
.logo-fallback em { font-style: normal; color: var(--yellow); }
.logo-sub { font-size: 11.5px; color: #9aa6b4; letter-spacing: 0.2px; }

.nav-title {
  margin: 34px 0 10px 8px;
  color: #7d8a99;
  font-size: 11px;
  letter-spacing: 1.5px;
  font-weight: 600;
}

.nav { display: flex; flex-direction: column; gap: 4px; }

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 12px;
  border: 0;
  border-radius: 9px;
  background: transparent;
  color: #d5dce4;
  font-size: 14px;
  text-align: left;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.nav-item:hover { background: var(--navy-3); }
.nav-item.active {
  background: var(--navy-3);
  color: var(--yellow);
  box-shadow: inset 3px 0 0 var(--yellow);
}
.nav-icon { width: 18px; text-align: center; opacity: 0.9; }

.sidebar-footer {
  margin-top: auto;
  padding: 14px 12px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  gap: 10px;
  align-items: center;
  font-size: 12px;
  color: #aeb7c2;
  line-height: 1.5;
}
.sidebar-footer strong { color: #fff; font-weight: 600; }
.status-dot {
  width: 9px; height: 9px; border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.18);
  flex-shrink: 0;
}

/* 5. Top bar */
.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}
.topbar h1 { font-size: 28px; letter-spacing: -0.5px; margin-bottom: 6px; }
.topbar .muted { font-size: 14px; }

.topbar-actions { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }

.demo-label {
  background: var(--yellow-soft);
  color: #765400;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.3px;
}
.demo-label.custom { background: var(--good-bg); color: var(--good); }

.avatar {
  display: grid; place-items: center;
  width: 38px; height: 38px;
  border-radius: 50%;
  background: var(--navy);
  color: var(--yellow);
  font-size: 12px; font-weight: 700;
}

/* 6. Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  border-radius: 9px;
  border: 1px solid var(--line);
  background: var(--surface);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
}
.btn:hover { background: #f7f8fa; border-color: #d5dae1; }
.btn:disabled { opacity: 0.45; cursor: not-allowed; }
.btn-dark { background: var(--navy); color: var(--yellow); border-color: var(--navy); }
.btn-dark:hover { background: var(--navy-3); border-color: var(--navy-3); }

/* 7. Filters */
.filters {
  display: flex;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 14px;
  padding: 16px 18px;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  margin-bottom: 18px;
}
.field { display: flex; flex-direction: column; gap: 6px; min-width: 150px; }
.field label {
  font-size: 11px; font-weight: 700; color: var(--muted);
  text-transform: uppercase; letter-spacing: 0.6px;
}
.field select, .field input,
#tableSearch {
  background: #fff;
  border: 1px solid #dce2e8;
  border-radius: 9px;
  padding: 10px 12px;
  font-size: 13px;
  outline: none;
}
.field select:focus, .field input:focus, #tableSearch:focus {
  border-color: var(--yellow-dark);
  box-shadow: 0 0 0 3px rgba(248, 203, 70, 0.28);
}
.range-label { margin-left: auto; font-size: 12px; color: var(--muted); align-self: center; }

/* 8. KPI cards */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 16px;
}
.kpi-card {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 20px;
  box-shadow: var(--shadow);
}
.kpi-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
.kpi-card h3 { color: var(--muted); font-size: 13px; font-weight: 600; }
.kpi-icon {
  display: grid; place-items: center;
  width: 34px; height: 34px;
  border-radius: 9px;
  font-size: 16px;
}
.ic-yellow { background: var(--yellow-soft); }
.ic-blue { background: #e0ecff; }
.ic-green { background: var(--good-bg); }
.ic-red { background: var(--bad-bg); }
.ic-purple { background: #ede9fe; }

.kpi-value { font-size: 28px; font-weight: 750; letter-spacing: -1px; }
.kpi-foot { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-top: 10px; }
.kpi-note { color: var(--muted); font-size: 12px; }

.trend {
  font-size: 12px; font-weight: 700;
  padding: 3px 8px; border-radius: 20px;
  background: #eef1f4; color: var(--muted);
}
.trend.good { background: var(--good-bg); color: var(--good); }
.trend.bad { background: var(--bad-bg); color: var(--bad); }

/* 9. Panels and grids */
.grid { display: grid; gap: 18px; margin-top: 18px; }
.grid-2-1 { grid-template-columns: minmax(0, 2fr) minmax(0, 1fr); }
.grid-eq { grid-template-columns: repeat(2, minmax(0, 1fr)); }

.panel {
  margin-top: 18px;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 22px;
  box-shadow: var(--shadow);
}
.grid > .panel { margin-top: 0; }

.panel-head {
  display: flex; justify-content: space-between; align-items: flex-start;
  flex-wrap: wrap; gap: 12px;
}
.panel h2 { font-size: 17px; margin-bottom: 4px; }
.panel-actions { display: flex; gap: 10px; flex-wrap: wrap; }
#tableSearch { width: 240px; max-width: 100%; }

.chart-wrap { position: relative; height: 290px; margin-top: 18px; }

/* 10. Insights */
.insights { list-style: none; margin: 16px 0 0; padding: 0; display: grid; gap: 10px; }
.insights li {
  display: flex; gap: 12px; align-items: flex-start;
  padding: 12px 14px;
  border-radius: 10px;
  background: #f8f9fb;
  border: 1px solid var(--line);
  font-size: 14px; line-height: 1.5;
}
.insights .dot { width: 10px; height: 10px; border-radius: 50%; margin-top: 6px; flex-shrink: 0; }
.insights .info .dot { background: #3b82f6; }
.insights .good .dot { background: #22c55e; }
.insights .warn .dot { background: #f59e0b; }

/* 10b. Live store status (present SM + next truck) */
.live-pill {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 7px 12px;
  border-radius: 20px;
  background: var(--good-bg);
  color: var(--good);
  font-size: 12px; font-weight: 700;
}
.live-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: #22c55e;
  animation: pulse 1.8s infinite;
}
@keyframes pulse {
  0%   { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.55); }
  70%  { box-shadow: 0 0 0 8px rgba(34, 197, 94, 0); }
  100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
}

.live-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(290px, 1fr));
  gap: 16px;
  margin-top: 18px;
}
.live-card {
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 16px;
  background: #fbfcfd;
}
.live-store { font-size: 14px; font-weight: 700; margin-bottom: 14px; }

.live-row { display: flex; gap: 12px; align-items: flex-start; padding: 10px 0; }
.live-row + .live-row { border-top: 1px dashed var(--line); }
.live-row .icon {
  display: grid; place-items: center;
  width: 38px; height: 38px; flex-shrink: 0;
  border-radius: 10px;
  background: var(--navy);
  color: var(--yellow);
  font-size: 13px; font-weight: 700;
}
.live-row .icon.truck { background: var(--yellow-soft); font-size: 18px; }
.live-row .icon.leave { background: var(--warn-bg); color: var(--warn); }
.live-row .label { font-size: 11px; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: 0.5px; }
.live-row .name { font-size: 14.5px; font-weight: 700; margin: 2px 0; }
.live-row .sub { font-size: 12px; color: var(--muted); line-height: 1.5; }

.eta {
  display: inline-block; margin-top: 6px;
  padding: 4px 10px; border-radius: 20px;
  font-size: 12px; font-weight: 700;
}
.eta.arriving  { background: var(--good-bg); color: var(--good); }
.eta.delayed   { background: var(--warn-bg); color: var(--warn); }
.eta.unloading { background: #dbeafe; color: #1d4ed8; }

.live-foot {
  display: flex; justify-content: space-between; gap: 10px;
  margin-top: 6px; padding-top: 12px;
  border-top: 1px solid var(--line);
  font-size: 12px; color: var(--muted);
}
.live-foot strong { color: var(--ink); }

/* 10c. Complaint category tiles */
.cat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(175px, 1fr));
  gap: 16px;
}
.cat-tile {
  background: var(--surface);
  border: 1px solid var(--line);
  border-top: 4px solid var(--cat, var(--yellow));
  border-radius: var(--radius);
  padding: 16px 18px;
  box-shadow: var(--shadow);
}
.cat-tile .cat-head { display: flex; justify-content: space-between; align-items: center; font-size: 13px; font-weight: 600; color: var(--muted); }
.cat-tile .cat-value { font-size: 28px; font-weight: 750; letter-spacing: -0.5px; margin: 8px 0 4px; }
.cat-tile .cat-sub { font-size: 12px; color: var(--muted); display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }

/* 11. Mini stats (per page) */
.mini-stats { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
.mini {
  background: var(--surface);
  border: 1px solid var(--line);
  border-left: 4px solid var(--yellow);
  border-radius: var(--radius);
  padding: 16px 18px;
  box-shadow: var(--shadow);
}
.mini .label { font-size: 12px; color: var(--muted); font-weight: 600; }
.mini .value { font-size: 24px; font-weight: 750; letter-spacing: -0.5px; margin: 6px 0 2px; }
.mini .sub { font-size: 12px; color: var(--muted); }

/* 12. Tables */
.table-container { width: 100%; overflow-x: auto; margin-top: 18px; }

table { width: 100%; border-collapse: collapse; text-align: left; white-space: nowrap; }

th {
  background: #f7f8fa;
  color: #657181;
  font-size: 11.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  user-select: none;
}
th[data-sort] { cursor: pointer; }
th[data-sort]:hover { color: var(--ink); }
th.sorted-asc::after { content: " ▲"; font-size: 9px; }
th.sorted-desc::after { content: " ▼"; font-size: 9px; }

th, td { padding: 14px 14px; border-bottom: 1px solid #edf0f3; }
td { font-size: 13px; }
th.num, td.num { text-align: right; }
tbody tr:hover { background: #fffaf0; }
td.empty { text-align: center; color: var(--muted); padding: 30px; }

.shift-status {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
}
.status-good { background: var(--good-bg); color: var(--good); }
.status-warning { background: var(--warn-bg); color: var(--warn); }
.status-bad { background: var(--bad-bg); color: var(--bad); }

.pager {
  display: flex; justify-content: space-between; align-items: center;
  flex-wrap: wrap; gap: 10px; margin-top: 14px;
}
.pager .btn { padding: 8px 12px; }
.pager div { display: flex; gap: 8px; }

/* 13. About page */
.about h2 { font-size: 20px; margin-bottom: 10px; }
.about h3 { font-size: 15px; margin: 22px 0 8px; }
.about p, .about li { line-height: 1.7; font-size: 14px; color: #374151; }
.about ul { margin: 0; padding-left: 20px; }
.about pre {
  background: var(--navy); color: #e7ecf2;
  padding: 14px 16px; border-radius: 10px;
  overflow-x: auto; font-size: 13px;
}
.about code { background: #eef1f4; padding: 2px 6px; border-radius: 5px; font-size: 12.5px; }
.disclaimer {
  margin-top: 24px;
  padding: 12px 14px;
  background: var(--yellow-soft);
  border-radius: 10px;
  color: #765400 !important;
  font-size: 13px !important;
}

.main[data-page="about"] .filters,
.main[data-page="about"] .kpi-grid { display: none; }

.note { margin-top: 26px; color: var(--muted); font-size: 12px; line-height: 1.6; }

/* 14. Toast */
.toast {
  position: fixed; right: 24px; bottom: 24px;
  max-width: 360px;
  background: var(--navy); color: #fff;
  padding: 13px 18px; border-radius: 10px;
  font-size: 13px; line-height: 1.5;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
  opacity: 0; transform: translateY(12px);
  pointer-events: none;
  transition: opacity 0.2s, transform 0.2s;
  z-index: 50;
}
.toast.show { opacity: 1; transform: translateY(0); }
.toast.error { background: #991b1b; }

/* 15. Responsive */
@media (max-width: 1380px) {
  /* 5 KPI cards: 3 on the first row, 2 on the second */
  .kpi-grid { grid-template-columns: repeat(6, minmax(0, 1fr)); }
  .kpi-card { grid-column: span 2; }
  .kpi-card:nth-child(n + 4) { grid-column: span 3; }
}

@media (max-width: 1100px) {
  .kpi-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .kpi-card, .kpi-card:nth-child(n + 4) { grid-column: span 1; }
  .kpi-card:last-child { grid-column: 1 / -1; }
  .grid-2-1, .grid-eq { grid-template-columns: minmax(0, 1fr); }
  .sidebar { width: 210px; }
  .main { padding: 22px; }
}

@media (max-width: 760px) {
  .app { display: block; }

  .sidebar {
    width: 100%; height: auto; position: static;
    padding: 16px;
  }
  .sidebar .nav-title, .sidebar-footer { display: none; }
  .logo { padding-bottom: 12px; margin-bottom: 8px; }
  .nav { flex-direction: row; overflow-x: auto; gap: 6px; }
  .nav-item { width: auto; white-space: nowrap; padding: 10px 12px; }
  .nav-item.active { box-shadow: none; }

  .main { padding: 16px; }
  .topbar h1 { font-size: 23px; }
  .kpi-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
  .kpi-card, .kpi-card:nth-child(n + 4) { grid-column: span 1; padding: 14px; }
  .kpi-card:last-child { grid-column: 1 / -1; }
  .kpi-value { font-size: 23px; }
  .mini-stats { grid-template-columns: minmax(0, 1fr); }
  .field { min-width: 45%; flex: 1; }
  .range-label { width: 100%; margin-left: 0; }
  #tableSearch { width: 100%; }
  .panel-actions { width: 100%; }
  .chart-wrap { height: 240px; }
}
