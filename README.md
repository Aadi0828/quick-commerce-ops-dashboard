# Quick Commerce Operations Dashboard

A responsive store-operations dashboard for a quick-commerce dark store, built with HTML, CSS and JavaScript as a portfolio project.

**Live demo:** https://YOUR-USERNAME.github.io/quick-commerce-ops-dashboard/

> Disclaimer: All figures are fictional sample data. This is an independent portfolio project and is not affiliated with, or connected to, any company's internal systems.

## Features
- KPI cards: Total Orders, Manpower Present, Average PPI, Pending GRN, Complaints (with trend vs previous period)
- Filters: store, shift and date range update every KPI, chart and table
- Live store status: Store Manager on shift and next truck arriving
- Complaint tracking: item damage, expired, poor quality, missing item, wrong item
- 12 interactive charts across 5 pages (Overview, Manpower, Inventory & GRN, Complaints, Productivity)
- Auto-generated insights from the filtered data
- Sortable, searchable, paginated table with CSV export
- CSV import with row-by-row validation

## Tech Stack
HTML5, CSS3 (Grid, Flexbox), JavaScript (ES6), Chart.js

## CSV Format
Columns: date, store, shift, orders, present, planned, ppi, grn, damage, expired, poor_quality, missing, wrong_item
(store and the five complaint columns are optional)

## How to Run
Download the files and open index.html in any browser. An internet connection is needed for the charts.

## What I Learned
- DOM manipulation and event handling
- Array methods: filter, map, reduce, sort
- Reading files in the browser with FileReader
- Building responsive layouts and data visualisation with Chart.js
