(function () {
  "use strict";

  const STATUS_LABEL = { operating: "Operating", construction: "Under construction", planned: "Planned" };
  const LAW_STATUS = {
    law: ["law", "Signed into law"],
    voters: ["voters", "Approved by voters"],
    vetoed: ["vetoed", "Vetoed"],
    court: ["vetoed", "Signed · challenged in court"],
  };
  const CATS = window.POLICY_CATEGORIES;
  const policies = window.POLICIES.slice().sort((a, b) => a.date.localeCompare(b.date));
  const centers = window.DATA_CENTERS;

  const state = {
    statuses: new Set(["operating", "construction", "planned"]),
    cats: new Set(Object.keys(CATS)),
    sync: false,
    policy: null,      // selected policy
    center: null,      // selected data center
  };

  function esc(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  function formatDate(iso) {
    const p = iso.split("-").map(Number);
    if (p.length === 1) return String(p[0]);
    const d = new Date(Date.UTC(p[0], p[1] - 1, p[2] || 1));
    const opts = p.length === 2 ? { year: "numeric", month: "long" } : { year: "numeric", month: "short", day: "numeric" };
    return d.toLocaleDateString("en-US", Object.assign({ timeZone: "UTC" }, opts));
  }

  // Treat partial dates ("2025-06", "2019") as the end of that period for "announced by" checks.
  function announcedBy(center, date) {
    return center.announced <= date || date.startsWith(center.announced);
  }

  // ---------- Map ----------
  const { projection, countyLayer, pinLayer } = window.createTexasMap("#map");
  const tooltip = document.getElementById("tooltip");
  const mapCard = document.querySelector(".map-card");
  const dcCounties = new Set(centers.filter((c) => !c.cluster).map((c) => c.county));

  countyLayer.selectAll("path")
    .style("fill", (d) => (dcCounties.has(d.properties.name) ? "#e2ece5" : "var(--neutral)"))
    .on("mousemove", (ev, d) => showTip(ev, `<strong>${esc(d.properties.name)} County</strong>`))
    .on("mouseleave", hideTip);

  function showTip(ev, html) {
    const box = mapCard.getBoundingClientRect();
    tooltip.hidden = false;
    tooltip.innerHTML = html;
    tooltip.style.left = ev.clientX - box.left + 12 + "px";
    tooltip.style.top = ev.clientY - box.top + 12 + "px";
  }
  function hideTip() { tooltip.hidden = true; }

  const pins = pinLayer.selectAll("g.dc-pin")
    .data(centers)
    .join("g")
    .attr("class", (c) => "dc-pin " + c.status)
    .attr("transform", (c) => `translate(${projection([c.lon, c.lat])})`)
    .attr("tabindex", 0)
    .attr("role", "button")
    .attr("aria-label", (c) => `${c.name}, ${STATUS_LABEL[c.status]}`)
    .on("mousemove", (ev, c) => showTip(ev, `<strong>${esc(c.name)}</strong><br>${STATUS_LABEL[c.status]} · ${esc(c.mw)}`))
    .on("mouseleave", hideTip)
    .on("click", (ev, c) => selectCenter(c))
    .on("keydown", (ev, c) => { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); selectCenter(c); } });
  pins.append("circle").attr("r", (c) => (c.cluster ? 10 : 7));
  pins.append("text").attr("x", 12).attr("y", 4);

  function isVisible(c) {
    if (!state.statuses.has(c.status)) return false;
    if (state.sync && state.policy && !announcedBy(c, state.policy.date)) return false;
    return true;
  }

  function renderMap() {
    pins.classed("dim", (c) => !isVisible(c))
      .classed("selected", (c) => c === state.center)
      .select("text").text((c) => (c === state.center ? c.name : ""));

    const shown = centers.filter(isVisible);
    const count = (s) => shown.filter((c) => c.status === s && !c.cluster).length;
    document.getElementById("dc-counts").innerHTML = ["operating", "construction", "planned"]
      .map((s) => `<div><strong>${count(s)}</strong><span>${STATUS_LABEL[s]}</span></div>`).join("");
  }

  // ---------- Detail card ----------
  const detail = document.getElementById("detail");

  function renderIntro() {
    const big = centers.filter((c) => !c.cluster);
    detail.innerHTML = `
      <h2>How to use this page</h2>
      <p>Click a law below to read what it does and how it affects communities. Click a dot on the map to see a data center project.</p>
      <p>This map tracks ${big.length} major data center projects plus the main metro clusters. The 2025 law <strong>SB 6</strong> sets grid rules for data centers and other large power users.</p>
      <p class="impact">Tip: turn on "Only show projects announced by the selected law's date" to see how data center plans grew around each law.</p>`;
  }

  function renderPolicy(p) {
    const [cls, label] = LAW_STATUS[p.status];
    const dcNote = p.showDataCenters || ["datacenters", "energy", "water"].includes(p.category)
      ? `<p class="empty">${centers.filter((c) => !c.cluster && announcedBy(c, p.date)).length} of the major data center projects on the map had been announced by this date.</p>`
      : "";
    detail.innerHTML = `
      <p class="event-meta"><span class="status-chip ${cls}">${label}</span> <span class="phase">${esc(CATS[p.category])}</span></p>
      <h2>${esc(p.title)}</h2>
      <dl><dt>Bill</dt><dd>${esc(p.bill)}</dd><dt>Date</dt><dd>${formatDate(p.date)}</dd></dl>
      <p>${esc(p.summary)}</p>
      <p class="impact"><strong>Community impact:</strong> ${esc(p.impact)}</p>
      ${dcNote}
      <p><a href="${esc(p.url)}" target="_blank" rel="noopener">Official record / source ↗</a></p>`;
  }

  function renderCenter(c) {
    detail.innerHTML = `
      <p class="event-meta"><span class="status-chip ${c.status}">${STATUS_LABEL[c.status]}</span></p>
      <h2>${esc(c.name)}</h2>
      <dl>
        <dt>Company</dt><dd>${esc(c.company)}</dd>
        <dt>County</dt><dd>${esc(c.county)}</dd>
        <dt>Power</dt><dd>${esc(c.mw)}</dd>
        <dt>Announced</dt><dd>${formatDate(c.announced)}</dd>
      </dl>
      <p>${esc(c.note)}</p>
      <p class="impact"><strong>Rules that apply:</strong> large sites (75 MW+) connecting to the ERCOT grid fall under SB 6 (2025), which requires cost-sharing for transmission and lets ERCOT order cutbacks during emergencies.</p>
      <p><a href="${esc(c.source)}" target="_blank" rel="noopener">Source ↗</a></p>`;
  }

  function selectCenter(c) {
    state.center = state.center === c ? null : c;
    if (state.center) renderCenter(c); else if (state.policy) renderPolicy(state.policy); else renderIntro();
    renderMap();
  }

  // ---------- Policy timeline ----------
  const yearsEl = document.getElementById("policy-years");

  function renderPolicies() {
    yearsEl.innerHTML = "";
    const shown = policies.filter((p) => state.cats.has(p.category));
    if (!shown.length) {
      yearsEl.innerHTML = '<p class="empty">No laws match these categories. Turn a category back on above.</p>';
      return;
    }
    const byYear = d3.group(shown, (p) => p.date.slice(0, 4));
    byYear.forEach((items, year) => {
      const sec = document.createElement("section");
      sec.className = "policy-year";
      sec.innerHTML = `<h3>${year}</h3>`;
      const ul = document.createElement("ul");
      ul.className = "policy-list";
      items.forEach((p) => {
        const li = document.createElement("li");
        const b = document.createElement("button");
        b.type = "button";
        b.className = "cat-" + p.category;
        b.setAttribute("aria-current", p === state.policy ? "true" : "false");
        b.innerHTML = `<span class="bill">${esc(p.bill)} · ${formatDate(p.date)}</span><span class="t">${esc(p.title)}</span>`;
        b.addEventListener("click", () => {
          state.policy = p;
          state.center = null;
          renderPolicy(p);
          yearsEl.querySelectorAll("button").forEach((x) => x.setAttribute("aria-current", "false"));
          b.setAttribute("aria-current", "true");
          renderMap();
        });
        li.appendChild(b);
        ul.appendChild(li);
      });
      sec.appendChild(ul);
      yearsEl.appendChild(sec);
    });
  }

  // ---------- Filters ----------
  const catBox = document.getElementById("cat-filters");
  Object.entries(CATS).forEach(([key, label]) => {
    const l = document.createElement("label");
    l.innerHTML = `<input type="checkbox" value="${key}" checked> ${esc(label)}`;
    l.querySelector("input").addEventListener("change", (ev) => {
      if (ev.target.checked) state.cats.add(key); else state.cats.delete(key);
      renderPolicies();
    });
    catBox.appendChild(l);
  });

  document.querySelectorAll('input[name="dc-status"]').forEach((box) => {
    box.addEventListener("change", () => {
      if (box.checked) state.statuses.add(box.value); else state.statuses.delete(box.value);
      renderMap();
    });
  });
  document.getElementById("sync-date").addEventListener("change", (ev) => {
    state.sync = ev.target.checked;
    renderMap();
  });

  // ---------- Sources ----------
  const srcList = document.getElementById("sources");
  window.POLICY_SOURCES.forEach((s) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = s.url; a.textContent = s.label; a.target = "_blank"; a.rel = "noopener";
    li.appendChild(a);
    srcList.appendChild(li);
  });

  renderIntro();
  renderPolicies();
  renderMap();
})();
