/* Shared Texas county map used by both pages. Needs d3, topojson and US_COUNTIES_TOPO. */
window.createTexasMap = function (svgSelector, opts) {
  "use strict";
  opts = opts || {};
  const W = 800, H = 720;
  const topo = window.US_COUNTIES_TOPO;
  const txGeoms = topo.objects.counties.geometries.filter((g) => String(g.id).startsWith("48"));
  const counties = txGeoms.map((g) => topojson.feature(topo, g));
  const outline = topojson.merge(topo, txGeoms);

  const svg = d3.select(svgSelector).attr("viewBox", `0 0 ${W} ${H}`);
  const projection = d3.geoConicEqualArea().parallels([27.5, 35]).rotate([100, 0])
    .fitExtent([[16, 16], [W - 16, H - 16]], outline);
  const path = d3.geoPath(projection);

  const countyLayer = svg.append("g");
  countyLayer.selectAll("path")
    .data(counties)
    .join("path")
    .attr("class", "county")
    .attr("d", path);
  svg.append("path").datum(outline).attr("class", "state-outline").attr("d", path);
  const pinLayer = svg.append("g");

  return { svg, projection, path, countyLayer, pinLayer, counties };
};
