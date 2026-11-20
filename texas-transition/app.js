(function () {
  "use strict";

  const ELECTION_DAY = "2026-11-03";
  const PLAY_MS = 4000;
  const PHASE_LABEL = { history: "History", election: "Election", transition: "Transition", governing: "Governing" };
  const PARTY_NAME = { D: "Democrat", R: "Republican" };
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const events = window.EVENTS.slice().sort((a, b) => a.date.localeCompare(b.date));
  let visible = events.slice();
  let current = events.findIndex((e) => e.date === ELECTION_DAY);
  if (current < 0) current = 0;
  let timer = null;
  let selectedCounty = null;

  // ---------- Dates ----------
  function formatDate(iso, approx) {
    const parts = iso.split("-").map(Number);
    const opts = parts.length === 2
      ? { year: "numeric", month: "long" }
      : { year: "numeric", month: "short", day: "numeric" };
    const d = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2] || 1));
    const s = d.toLocaleDateString("en-US", Object.assign({ timeZone: "UTC" }, opts));
    return approx ? "~" + s : s;
  }

  // ---------- Map ----------
  const { projection, countyLayer, pinLayer } = window.createTexasMap("#map");

  const tooltip = document.getElementById("tooltip");
  const mapCard = document.querySelector(".map-card");
  const countyNote = document.getElementById("county-note");
  const results = window.COUNTY_RESULTS || {};
  const hasResults = Object.keys(results).length > 0;

  const marginColor = d3.scaleDiverging()
    .domain([-40, 0, 40])
    .interpolator((t) => d3.interpolateRgbBasis(["#c0392b", "#f3efe6", "#2b5fad"])(t))
    .clamp(true);

  function resultText(name) {
    const r = results[name];
    if (!r) return "No county result entered";
    return `Governor: D ${r.dem.toFixed(1)}% · R ${r.rep.toFixed(1)}%`;
  }

  countyLayer.selectAll("path")
    .on("mousemove", (ev, d) => {
      const box = mapCard.getBoundingClientRect();
      tooltip.hidden = false;
      tooltip.innerHTML = `<strong>${d.properties.name} County</strong><br>${resultText(d.properties.name)}`;
      tooltip.style.left = ev.clientX - box.left + 12 + "px";
      tooltip.style.top = ev.clientY - box.top + 12 + "px";
    })
    .on("mouseleave", () => { tooltip.hidden = true; })
    .on("click", (ev, d) => {
      selectedCounty = selectedCounty === d.properties.name ? null : d.properties.name;
      countyLayer.selectAll("path").classed("selected", (c) => c.properties.name === selectedCounty);
      countyNote.textContent = selectedCounty
        ? `${selectedCounty} County — ${resultText(selectedCounty)}.`
        : defaultCountyNote();
    });

  function defaultCountyNote() {
    return hasResults
      ? "Counties are shaded by the governor's race margin. Click a county for details."
      : "County-level results aren't loaded yet. Add official numbers to county-results.js to shade counties by margin.";
  }

  function fillFor(event, name) {
    if (event.showResults && hasResults && results[name]) {
      const r = results[name];
      return marginColor(r.dem - r.rep);
    }
    const highlighted = event.counties && event.counties.includes(name);
    if (highlighted) return event.tint === "R" ? "var(--rep)" : event.tint === "D" ? "var(--dem)" : "var(--accent)";
    if (event.statewide) return event.tint === "R" ? "var(--rep-soft)" : event.tint === "D" ? "var(--dem-soft)" : "var(--neutral)";
    return "var(--neutral)";
  }

  function renderMap(event) {
    countyLayer.selectAll("path").style("fill", (d) => fillFor(event, d.properties.name));

    const place = event.place && window.PLACES[event.place];
    const pins = place ? [place] : [];
    const g = pinLayer.selectAll("g.pin").data(pins, (p) => p.name);
    g.exit().remove();
    const enter = g.enter().append("g").attr("class", "pin");
    if (!reducedMotion) enter.append("circle").attr("class", "pulse").attr("r", 6);
    enter.append("circle").attr("class", "dot").attr("r", 7);
    enter.append("text").attr("x", 12).attr("y", 4);
    const all = enter.merge(g);
    all.attr("transform", (p) => `translate(${projection([p.lon, p.lat])})`);
    all.select("text").text((p) => p.name);

    document.getElementById("map-caption").textContent = place
      ? `Map: ${place.name}`
      : event.showResults && hasResults ? "Map: governor's race margin by county" : "Map: statewide event";
  }

  // ---------- Power panel ----------
  function renderOffices(event) {
    const date = event.date;
    const list = document.getElementById("offices");
    const asof = document.getElementById("power-asof");
    asof.textContent = date < "2026-01-01" ? "· lineup heading into 2026" : `· as of ${formatDate(date, event.approx)}`;

    list.innerHTML = "";
    window.OFFICES.forEach((o) => {
      let holder = o.before, status = "";
      let flip = false;
      if (date >= ELECTION_DAY) {
        if (!o.after) {
          status = "2026 result not entered yet";
        } else if (o.takesOffice && date >= o.takesOffice) {
          holder = o.after;
          flip = o.after.party !== o.before.party;
          status = flip ? `Flipped from ${PARTY_NAME[o.before.party]}` : "Unchanged";
        } else {
          flip = o.after.party !== o.before.party;
          status = `Elected: ${o.after.name}${o.after.party ? " (" + o.after.party + ")" : ""} — takes office ${formatDate(o.takesOffice)}`;
        }
      }
      const li = document.createElement("li");
      li.className = "office " + (holder.party || "");
      li.innerHTML = `
        <span class="bar" aria-hidden="true"></span>
        <div>
          <div class="t">${o.title}</div>
          <div class="n">${holder.name}${holder.party ? ` <span class="t">(${PARTY_NAME[holder.party]})</span>` : ""}</div>
          ${status ? `<div class="s${flip ? " flip" : ""}">${status}</div>` : ""}
          ${date >= ELECTION_DAY && o.note ? `<details><summary>Details</summary>${o.note}</details>` : ""}
        </div>`;
      list.appendChild(li);
    });
  }

  // ---------- Event card ----------
  function renderEvent(event) {
    const phase = document.getElementById("event-phase");
    phase.textContent = PHASE_LABEL[event.phase];
    phase.className = "phase " + event.phase;
    const time = document.getElementById("event-date");
    time.textContent = formatDate(event.date, event.approx);
    time.dateTime = event.date;
    document.getElementById("event-title").textContent = event.title;
    document.getElementById("event-body").textContent = event.body;
  }

  // ---------- Timeline ----------
  const timelineEl = document.getElementById("timeline");

  function renderTimeline() {
    timelineEl.innerHTML = "";
    visible.forEach((e, i) => {
      const li = document.createElement("li");
      const b = document.createElement("button");
      b.type = "button";
      b.className = e.tint || "";
      b.innerHTML = `<span class="d">${formatDate(e.date, e.approx)}</span><span class="t">${e.title}</span>`;
      b.addEventListener("click", () => { stop(); select(i); });
      li.appendChild(b);
      timelineEl.appendChild(li);
    });
  }

  function select(i) {
    if (!visible.length) return;
    current = Math.max(0, Math.min(i, visible.length - 1));
    const event = visible[current];
    renderEvent(event);
    renderOffices(event);
    renderMap(event);
    timelineEl.querySelectorAll("button").forEach((b, j) => {
      b.setAttribute("aria-current", j === current ? "true" : "false");
      if (j === current) b.scrollIntoView({ block: "nearest", inline: "center", behavior: reducedMotion ? "auto" : "smooth" });
    });
  }

  const playBtn = document.getElementById("play");
  function stop() {
    clearInterval(timer);
    timer = null;
    playBtn.textContent = "Play";
  }
  function play() {
    if (current >= visible.length - 1) select(0);
    playBtn.textContent = "Pause";
    timer = setInterval(() => {
      if (current >= visible.length - 1) return stop();
      select(current + 1);
    }, PLAY_MS);
  }

  playBtn.addEventListener("click", () => (timer ? stop() : play()));
  document.getElementById("prev").addEventListener("click", () => { stop(); select(current - 1); });
  document.getElementById("next").addEventListener("click", () => { stop(); select(current + 1); });
  document.addEventListener("keydown", (ev) => {
    if (ev.target.closest("input")) return;
    if (ev.key === "ArrowLeft") { stop(); select(current - 1); }
    if (ev.key === "ArrowRight") { stop(); select(current + 1); }
  });

  document.querySelectorAll(".phase-filter input").forEach((box) => {
    box.addEventListener("change", () => {
      const keep = new Set([...document.querySelectorAll(".phase-filter input:checked")].map((b) => b.value));
      const prev = visible[current];
      visible = events.filter((e) => keep.has(e.phase));
      stop();
      renderTimeline();
      const idx = visible.indexOf(prev);
      select(idx >= 0 ? idx : 0);
    });
  });

  // ---------- Sources ----------
  const srcList = document.getElementById("sources");
  window.SOURCES.forEach((s) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = s.url; a.textContent = s.label; a.target = "_blank"; a.rel = "noopener";
    li.appendChild(a);
    srcList.appendChild(li);
  });

  countyNote.textContent = defaultCountyNote();
  renderTimeline();
  select(current);
})();
