/* =========================================================
   PORTFOLIO ENHANCEMENTS
   Day/Night Mode + Store Online/Offline + Hover Effects
   Portfolio Demo by Aditya Kumar
   Paste this code at the END of your existing script.js
   ========================================================= */

(function addPortfolioEnhancements() {
  const enhancementStyles = document.createElement("style");

  enhancementStyles.textContent = `
    body {
      transition: background-color .25s ease, color .25s ease;
    }

    body.night-mode {
      background: #101827 !important;
      color: #e5e7eb !important;
    }

    body.night-mode .panel,
    body.night-mode .kpi,
    body.night-mode .kpi-card,
    body.night-mode .mini,
    body.night-mode .cat-tile,
    body.night-mode .live-card,
    body.night-mode .topbar,
    body.night-mode .sidebar,
    body.night-mode .table-wrap,
    body.night-mode .table-container,
    body.night-mode .filter-bar,
    body.night-mode .toolbar {
      background-color: #1b2638 !important;
      color: #e5e7eb !important;
      border-color: #374151 !important;
    }

    body.night-mode h1,
    body.night-mode h2,
    body.night-mode h3,
    body.night-mode h4,
    body.night-mode p,
    body.night-mode label,
    body.night-mode th,
    body.night-mode td,
    body.night-mode .muted,
    body.night-mode .label,
    body.night-mode .sub,
    body.night-mode .name,
    body.night-mode .value {
      color: #e5e7eb;
    }

    body.night-mode input,
    body.night-mode select,
    body.night-mode textarea {
      background: #111827 !important;
      color: #f9fafb !important;
      border-color: #4b5563 !important;
    }

    body.night-mode tbody tr:hover {
      background: #26384d !important;
    }

    .portfolio-enhancement-bar {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      flex-wrap: wrap;
      gap: 10px;
      margin: 12px 0 18px;
    }

    .portfolio-enhancement-btn {
      border: 0;
      border-radius: 8px;
      padding: 9px 13px;
      font-weight: 600;
      cursor: pointer;
      background: #263746;
      color: #fff;
      transition: all .2s ease;
    }

    .portfolio-enhancement-btn:hover {
      transform: translateY(-2px);
      filter: brightness(1.12);
    }

    .portfolio-enhancement-btn.status-online {
      background: #15803d;
    }

    .portfolio-enhancement-btn.status-offline {
      background: #b91c1c;
    }

    .portfolio-live-pill {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      padding: 8px 11px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 700;
      background: #dcfce7;
      color: #166534;
    }

    .portfolio-live-pill.is-offline {
      background: #fee2e2;
      color: #991b1b;
    }

    body.night-mode .portfolio-live-pill {
      background: #14532d;
      color: #bbf7d0;
    }

    body.night-mode .portfolio-live-pill.is-offline {
      background: #7f1d1d;
      color: #fecaca;
    }

    .portfolio-credit {
      display: inline-block;
      margin-top: 5px;
      font-size: 12px;
      font-weight: 700;
      color: #64748b;
      letter-spacing: .02em;
    }

    body.night-mode .portfolio-credit {
      color: #cbd5e1;
    }

    .panel,
    .kpi-card,
    .kpi,
    .mini,
    .cat-tile,
    .live-card,
    tbody tr,
    .nav-item,
    button {
      transition:
        box-shadow .18s ease,
        background-color .18s ease,
        border-color .18s ease,
        transform .18s ease;
    }

    .panel:hover,
    .kpi-card:hover,
    .kpi:hover,
    .mini:hover,
    .cat-tile:hover,
    .live-card:hover {
      box-shadow: 0 5px 20px rgba(56, 189, 248, .16);
      border-color: #38bdf8 !important;
    }

    tbody tr:hover {
      background: rgba(56, 189, 248, .10);
    }

    .nav-item:hover {
      filter: brightness(1.08);
    }

    @media (max-width: 650px) {
      .portfolio-enhancement-bar {
        justify-content: flex-start;
      }
    }
  `;

  document.head.appendChild(enhancementStyles);

  /* ---------- Day/Night and Store Status Controls ---------- */

  const topbar = document.querySelector(".topbar");

  const controls = document.createElement("div");
  controls.className = "portfolio-enhancement-bar";

  controls.innerHTML = `
    <span id="portfolioStoreStatus" class="portfolio-live-pill">
      ● Store Online
    </span>

    <button
      type="button"
      id="portfolioStoreToggle"
      class="portfolio-enhancement-btn status-online">
      Set Store Offline
    </button>

    <button
      type="button"
      id="portfolioThemeToggle"
      class="portfolio-enhancement-btn">
      🌙 Night Mode
    </button>
  `;

  if (topbar && topbar.parentNode) {
    topbar.parentNode.insertBefore(controls, topbar.nextSibling);
  } else {
    document.body.insertBefore(controls, document.body.firstChild);
  }

  /* ---------- Portfolio Credit ---------- */

  const pageSubtitle = document.getElementById("pageSubtitle");

  if (
    pageSubtitle &&
    !document.querySelector(".portfolio-credit")
  ) {
    const credit = document.createElement("div");
    credit.className = "portfolio-credit";
    credit.textContent = "Portfolio Demo by Aditya Kumar";

    pageSubtitle.insertAdjacentElement("afterend", credit);
  } else if (
    topbar &&
    !document.querySelector(".portfolio-credit")
  ) {
    const credit = document.createElement("div");
    credit.className = "portfolio-credit";
    credit.textContent = "Portfolio Demo by Aditya Kumar";

    topbar.appendChild(credit);
  }

  /* ---------- Day/Night Mode ---------- */

  const themeButton = document.getElementById(
    "portfolioThemeToggle"
  );

  function setTheme(night) {
    document.body.classList.toggle("night-mode", night);

    themeButton.textContent = night
      ? "☀️ Day Mode"
      : "🌙 Night Mode";

    try {
      localStorage.setItem(
        "quickCommerceTheme",
        night ? "night" : "day"
      );
    } catch (error) {
      // Continue if browser storage is unavailable.
    }

    if (typeof Chart !== "undefined") {
      Chart.defaults.color = night
        ? "#cbd5e1"
        : "#6b7785";

      if (typeof charts !== "undefined") {
        Object.values(charts).forEach((chart) => {
          if (!chart || !chart.options) return;

          if (chart.options.scales) {
            Object.values(chart.options.scales).forEach((scale) => {
              if (scale.ticks) {
                scale.ticks.color = night
                  ? "#cbd5e1"
                  : "#6b7785";
              }

              if (scale.grid) {
                scale.grid.color = night
                  ? "#374151"
                  : "#eef1f4";
              }
            });
          }

          chart.update("none");
        });
      }
    }
  }

  let savedTheme = "day";

  try {
    savedTheme =
      localStorage.getItem("quickCommerceTheme") || "day";
  } catch (error) {
    // Use day mode if browser storage is unavailable.
  }

  setTheme(savedTheme === "night");

  themeButton.addEventListener("click", () => {
    const isNight = document.body.classList.contains(
      "night-mode"
    );

    setTheme(!isNight);
  });

  /* ---------- Store Online/Offline Toggle ---------- */

  let storeOnline = true;

  const statusPill = document.getElementById(
    "portfolioStoreStatus"
  );

  const storeButton = document.getElementById(
    "portfolioStoreToggle"
  );

  storeButton.addEventListener("click", () => {
    storeOnline = !storeOnline;

    statusPill.textContent = storeOnline
      ? "● Store Online"
      : "● Store Offline";

    statusPill.classList.toggle(
      "is-offline",
      !storeOnline
    );

    storeButton.textContent = storeOnline
      ? "Set Store Offline"
      : "Set Store Online";

    storeButton.classList.toggle(
      "status-online",
      storeOnline
    );

    storeButton.classList.toggle(
      "status-offline",
      !storeOnline
    );
  });
})();
