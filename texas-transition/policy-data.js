/*
 * Policies & data centers — content data.
 *
 * Policy summaries are condensed from bill histories and news coverage.
 * Each entry links to its bill history on Texas Legislature Online
 * (capitol.texas.gov), which is the authoritative record. Data center
 * statuses come from company announcements and public project trackers,
 * which often disagree. Check before publishing and update as projects move.
 */

const TLO = (sess, bill) => `https://capitol.texas.gov/BillLookup/History.aspx?LegSess=${sess}&Bill=${bill}`;

window.POLICY_CATEGORIES = {
  energy: "Energy & grid",
  datacenters: "Data centers",
  water: "Water & disasters",
  taxes: "Property taxes",
  education: "Education",
  safety: "Public safety & border",
  health: "Health",
  local: "Local control",
  elections: "Elections & maps",
};

/*
 * status: "law" (signed), "voters" (needed and got voter approval),
 *         "vetoed", "court" (signed but blocked or challenged in court)
 * date:   date signed / approved / vetoed. "YYYY-MM" when only the month is certain.
 */
window.POLICIES = [
  // ---------------- 2021 — 87th Legislature ----------------
  {
    date: "2021-06-08", bill: "SB 2 (87R)", category: "energy", status: "law",
    title: "ERCOT board overhaul after Winter Storm Uri",
    summary: "Replaced ERCOT's stakeholder board with members appointed by state leaders and required board members to live in Texas.",
    impact: "Followed the February 2021 blackouts that left millions without power. Puts the grid operator under closer political control.",
    url: TLO("87R", "SB2"),
  },
  {
    date: "2021-06-08", bill: "SB 3 (87R)", category: "energy", status: "law",
    title: "Grid weatherization and emergency alerts",
    summary: "Required power plants and key natural gas facilities to prepare for extreme weather, and created a statewide power-outage alert system.",
    impact: "Aimed at preventing a repeat of the Uri blackouts. Penalties apply to facilities that fail weatherization inspections.",
    url: TLO("87R", "SB3"),
  },
  {
    date: "2021-05-19", bill: "SB 8 (87R)", category: "health", status: "law",
    title: "Six-week abortion ban with private lawsuits",
    summary: "Banned abortion after cardiac activity is detected (about six weeks) and let private citizens sue anyone who helps with an abortion. Took effect Sept. 1, 2021.",
    impact: "Most abortions in Texas stopped; many patients traveled out of state.",
    url: TLO("87R", "SB8"),
  },
  {
    date: "2021-06-16", bill: "HB 1927 (87R)", category: "safety", status: "law",
    title: "Permitless carry of handguns",
    summary: "Allowed most adults 21 and older to carry a handgun without a license or training. Took effect Sept. 1, 2021.",
    impact: "Changed how local police and businesses handle firearms; licenses remain optional.",
    url: TLO("87R", "HB1927"),
  },
  {
    date: "2021-09-07", bill: "SB 1 (87, 2nd called)", category: "elections", status: "law",
    title: "Election law overhaul",
    summary: "Banned 24-hour and drive-thru voting, added ID number requirements for mail ballots, and expanded protections for partisan poll watchers. Took effect Dec. 2, 2021.",
    impact: "Hit counties such as Harris that had expanded voting options in 2020; mail-ballot rejections rose in the 2022 primary.",
    url: TLO("872", "SB1"),
  },
  // ---------------- 2022 ----------------
  {
    date: "2022-08-25", bill: "HB 1280 (87R)", category: "health", status: "law",
    title: "Abortion trigger ban takes effect",
    summary: "Passed in 2021 to take effect if Roe v. Wade were overturned. After the Dobbs ruling, it banned nearly all abortions starting Aug. 25, 2022, with criminal penalties for providers.",
    impact: "Abortion became illegal in Texas except to save the patient's life or prevent serious physical harm.",
    url: TLO("87R", "HB1280"),
  },
  // ---------------- 2023 — 88th Legislature ----------------
  {
    date: "2023-06-14", bill: "HB 2127 (88R)", category: "local", status: "court",
    title: "State preemption of city and county rules",
    summary: "Bars cities and counties from passing local rules in areas covered by state law, such as labor, agriculture and natural resources. Took effect Sept. 1, 2023.",
    impact: "Ended local ordinances like required water breaks for construction workers in Austin and Dallas. Cities including Houston challenged it in court.",
    url: TLO("88R", "HB2127"),
  },
  {
    date: "2023-06", bill: "HB 3 (88R)", category: "safety", status: "law",
    title: "Armed security at every school",
    summary: "Requires an armed security officer at every public school campus and adds school safety funding. Passed after the 2022 Uvalde shooting.",
    impact: "Districts had to hire officers or use alternatives such as trained staff; many said state funding did not cover the cost.",
    url: TLO("88R", "HB3"),
  },
  {
    date: "2023-06-17", bill: "SB 17 (88R)", category: "education", status: "law",
    title: "Ban on DEI offices at public universities",
    summary: "Banned diversity, equity and inclusion offices, trainings and hiring statements at public colleges and universities. Took effect Jan. 1, 2024.",
    impact: "Universities closed or renamed centers and cut related positions.",
    url: TLO("88R", "SB17"),
  },
  {
    date: "2023-06", bill: "HB 5 (88R)", category: "taxes", status: "law",
    title: "JETI: new incentive program for large projects",
    summary: "Created the Texas Jobs, Energy, Technology and Innovation program to replace the expired Chapter 313 school-tax abatements for large industrial projects.",
    impact: "Shapes the tax breaks that local school districts can offer big employers and plants.",
    url: TLO("88R", "HB5"),
  },
  {
    date: "2023-11-07", bill: "SB 2627 / Prop. 7 (88R)", category: "energy", status: "voters",
    title: "Texas Energy Fund approved by voters",
    summary: "Created a state fund offering low-interest loans and grants for new natural gas power plants and backup power, approved by voters in November 2023.",
    impact: "Meant to add dispatchable power as demand rises, including from data centers and industry.",
    url: TLO("88R", "SB2627"),
  },
  {
    date: "2023-11-07", bill: "SB 2 / Prop. 4 (88, 2nd called)", category: "taxes", status: "voters",
    title: "$18 billion property tax relief",
    summary: "Raised the school homestead exemption from $40,000 to $100,000 and cut school tax rates. Voters approved the constitutional amendment in November 2023.",
    impact: "Lowered school property tax bills for homeowners; the state took on more of the cost of schools.",
    url: TLO("882", "SB2"),
  },
  {
    date: "2023-12-18", bill: "SB 4 (88, 4th called)", category: "safety", status: "court",
    title: "State crime of illegal entry",
    summary: "Made illegal entry from a foreign country a state crime and let state judges order people to leave the country.",
    impact: "Federal courts blocked enforcement while legal challenges continued.",
    url: TLO("884", "SB4"),
  },
  // ---------------- 2025 — 89th Legislature ----------------
  {
    date: "2025-05-03", bill: "SB 2 (89R)", category: "education", status: "law",
    title: "Education savings accounts (school vouchers)",
    summary: "Created a $1 billion program letting families use public money for private school tuition and other education costs, run by the comptroller, starting in the 2026–27 school year.",
    impact: "The governor-elect opposes vouchers; the program's future is a likely fight in the 2027 session.",
    url: TLO("89R", "SB2"),
  },
  {
    date: "2025-06", bill: "HB 2 (89R)", category: "education", status: "law",
    title: "$8.5 billion for public schools",
    summary: "Added school funding, including teacher raises based on experience and money for special education and school safety.",
    impact: "Raises reached teachers in the 2025–26 school year.",
    url: TLO("89R", "HB2"),
  },
  {
    date: "2025-06-20", bill: "SB 6 (89R)", category: "datacenters", status: "law",
    title: "Grid rules for data centers and other large loads",
    summary: "For new loads of 75 MW or more, such as data centers: requires fees and financial commitments to connect, makes them share transmission costs, and lets ERCOT order them to curtail or switch to backup generators during grid emergencies. Took effect immediately.",
    impact: "Meant to protect households from blackouts and costs as data centers grow. ERCOT reported about 205 GW of large-load requests in October 2025.",
    url: TLO("89R", "SB6"),
    showDataCenters: true,
  },
  {
    date: "2025-06-22", bill: "SB 3 (89R)", category: "health", status: "vetoed",
    title: "THC hemp product ban — vetoed",
    summary: "Would have banned consumable hemp products containing THC. Gov. Abbott vetoed it and called a special session on regulating the products instead.",
    impact: "Hemp shops stayed open; regulation remained unsettled.",
    url: TLO("89R", "SB3"),
  },
  {
    date: "2025-08-29", bill: "HB 4 (89, 2nd called)", category: "elections", status: "law",
    title: "Mid-decade congressional redistricting",
    summary: "Redrew Texas' congressional map ahead of the 2026 election. Democratic House members left the state for two weeks to block a quorum before it passed.",
    impact: "Changed district lines for millions of Texans in the 2026 U.S. House races.",
    url: TLO("892", "HB4"),
  },
  {
    date: "2025-09", bill: "2nd special session (2025)", category: "water", status: "law",
    title: "Camp safety and flood warnings after the Hill Country floods",
    summary: "After the July 4, 2025 floods in Kerr County and the Hill Country, lawmakers passed new rules for youth camps in flood plains and money for flood warning systems.",
    impact: "Camps near rivers must meet new safety standards; counties get help with sirens and alerts.",
    url: "https://www.texaspolicyresearch.com/the-89th-texas-legislature-wraps-up-special-session-what-passed-and-what-failed/",
  },
  {
    date: "2025-11-04", bill: "SB 4 & SB 23 (89R) / Nov. 2025 amendments", category: "taxes", status: "voters",
    title: "Bigger homestead exemptions",
    summary: "Raised the school homestead exemption to $140,000, and to $200,000 for homeowners 65 and older or with disabilities. Required voter approval in November 2025.",
    impact: "Further lowers school taxes for homeowners; does not apply to renters directly.",
    url: TLO("89R", "SB4"),
  },
  {
    date: "2025-11-04", bill: "HB 9 / HJR 1 (89R)", category: "taxes", status: "voters",
    title: "Business personal property exemption",
    summary: "Exempts the first $125,000 of business personal property (equipment, inventory) from property tax, starting in 2026 after voter approval.",
    impact: "Most small businesses no longer owe this tax.",
    url: TLO("89R", "HB9"),
  },
  {
    date: "2025-11-04", bill: "Water fund amendment (89R)", category: "water", status: "voters",
    title: "Dedicated money for water supply",
    summary: "Constitutional amendment sending up to $1 billion a year in state sales tax revenue to the Texas Water Fund for new supplies and repairs.",
    impact: "Matters for growing cities and for water-hungry industry, including data centers that use water cooling.",
    url: "https://www.sos.state.tx.us/elections/",
  },
];

/*
 * Data centers. status: "operating" | "construction" | "planned"
 * announced: when the project became public (used to sync with the policy timeline).
 */
window.DATA_CENTERS = [
  {
    name: "Stargate — Abilene", company: "OpenAI, Oracle, Crusoe", county: "Taylor",
    lat: 32.50, lon: -99.77, status: "operating", mw: "~1,200 MW planned",
    announced: "2025-01-21",
    note: "Most advanced AI campus in Texas. Trackers report most buildings delivered by fall 2026, with the rest still under construction.",
    source: "https://datacentercensus.com/us/texas",
  },
  {
    name: "Stargate — Shackelford County (Frontier)", company: "OpenAI, Vantage Data Centers", county: "Shackelford",
    lat: 32.72, lon: -99.30, status: "construction", mw: "~1,400 MW",
    announced: "2025-09-23",
    note: "One of the Stargate sites announced in September 2025; groundbreaking reported in December 2025.",
    source: "https://datacentercensus.com/us/texas",
  },
  {
    name: "Stargate — Milam County", company: "OpenAI, SB Energy", county: "Milam",
    lat: 30.75, lon: -97.00, status: "construction", mw: "~1,200 MW",
    announced: "2025-09-23",
    note: "Announced September 2025; one tracker estimates completion in late 2028.",
    source: "https://datacentercensus.com/us/texas",
  },
  {
    name: "Meta — El Paso", company: "Meta", county: "El Paso",
    lat: 31.87, lon: -106.32, status: "construction", mw: "~1,000 MW",
    announced: "2025-10",
    note: "Ground broken October 2025; trackers report a target of 1 GW by 2028 and a larger investment than first announced.",
    source: "https://llmpulse.ai/blog/ai-data-centers-under-construction/",
  },
  {
    name: "Fermi America — Project Matador", company: "Fermi America", county: "Carson",
    lat: 35.31, lon: -101.56, status: "construction", mw: "Up to ~11 GW planned",
    announced: "2025-06",
    note: "Status is disputed: one report says work paused in early 2026 awaiting an air permit, while later trackers list it as under construction. Plans include gas, nuclear, solar and wind power on site.",
    source: "https://www.blackridgeresearch.com/blog/largest-biggest-upcoming-new-data-centers-in-texas-united-states",
  },
  {
    name: "Google — Armstrong County", company: "Google", county: "Armstrong",
    lat: 35.08, lon: -101.40, status: "planned", mw: "Not disclosed",
    announced: "2025-11-14",
    note: "Part of Google's $40 billion Texas investment through 2027. Google says it will be air-cooled to limit water use.",
    source: "https://www.texastribune.org/2025/11/14/texas-google-data-centers-ai/",
  },
  {
    name: "Google — Haskell County (2 campuses)", company: "Google", county: "Haskell",
    lat: 33.16, lon: -99.73, status: "planned", mw: "Not disclosed",
    announced: "2025-11-14",
    note: "Two campuses near Abilene; one paired with a new solar and battery plant. Air-cooled, per Google.",
    source: "https://www.texastribune.org/2025/11/14/texas-google-data-centers-ai/",
  },
  {
    name: "Google — Midlothian", company: "Google", county: "Ellis",
    lat: 32.48, lon: -96.99, status: "operating", mw: "Not disclosed",
    announced: "2019",
    note: "Existing Google campus; the 2025 investment includes continued buildout in Ellis County.",
    source: "https://blog.google/inside-google/company-announcements/google-american-innovation-texas/",
  },
  {
    name: "Meta — Fort Worth", company: "Meta", county: "Tarrant",
    lat: 32.99, lon: -97.31, status: "operating", mw: "Not disclosed",
    announced: "2015",
    note: "Meta's first Texas data center campus, in the Alliance area north of Fort Worth.",
    source: "https://www.electricchoice.com/datacenters/texas/",
  },
  {
    name: "Meta — Temple", company: "Meta", county: "Bell",
    lat: 31.05, lon: -97.35, status: "construction", mw: "Not disclosed",
    announced: "2022",
    note: "Construction began in 2022 and was redesigned for AI workloads; check current status.",
    source: "https://www.electricchoice.com/datacenters/texas/",
  },
  {
    name: "Microsoft — San Antonio", company: "Microsoft", county: "Bexar",
    lat: 29.43, lon: -98.65, status: "operating", mw: "Not disclosed",
    announced: "2008",
    note: "Long-running Microsoft cloud campus on San Antonio's west side; expanded several times.",
    source: "https://www.electricchoice.com/datacenters/texas/",
  },
  {
    name: "Dallas–Fort Worth metro cluster", company: "Many operators", county: "Dallas",
    lat: 32.90, lon: -96.80, status: "operating", mw: "Largest cluster in Texas",
    announced: "2000", cluster: true,
    note: "Dozens of colocation and cloud facilities in Garland, Plano, Richardson, Allen and nearby. Statewide, one tracker counts 466 facilities across 77 counties.",
    source: "https://www.electricchoice.com/datacenters/texas/",
  },
  {
    name: "Houston metro cluster", company: "Many operators", county: "Harris",
    lat: 29.76, lon: -95.37, status: "operating", mw: "Many facilities",
    announced: "2000", cluster: true,
    note: "Colocation and enterprise data centers serving the energy and health sectors.",
    source: "https://www.electricchoice.com/datacenters/texas/",
  },
  {
    name: "Austin metro cluster", company: "Many operators", county: "Travis",
    lat: 30.27, lon: -97.74, status: "operating", mw: "Many facilities",
    announced: "2000", cluster: true,
    note: "Colocation and enterprise facilities across Austin and Round Rock.",
    source: "https://www.electricchoice.com/datacenters/texas/",
  },
];

window.POLICY_SOURCES = [
  { label: "Texas Legislature Online — bill histories", url: "https://capitol.texas.gov/" },
  { label: "Texas Tribune — what lawmakers did in the 2025 session", url: "https://www.texastribune.org/2025/06/02/texas-legislature-ends-session-republican-agenda/" },
  { label: "Texas Policy Research — 2025 special session recap", url: "https://www.texaspolicyresearch.com/the-89th-texas-legislature-wraps-up-special-session-what-passed-and-what-failed/" },
  { label: "Raise Your Hand Texas — 89th session recap", url: "https://www.raiseyourhandtexas.org/policy/89th-legislative-recap/" },
  { label: "Utility Dive — SB 6 lets ERCOT disconnect data centers in a crisis", url: "https://www.utilitydive.com/news/texas-law-gives-grid-operator-power-to-disconnect-data-centers-during-crisis/751587/" },
  { label: "Inside Climate News — Texas rules for data centers", url: "https://insideclimatenews.org/news/10102025/texas-grid-operators-and-regulators-iron-out-new-rules-for-data-centers/" },
  { label: "Texas Tribune — Google's $40B Texas data centers", url: "https://www.texastribune.org/2025/11/14/texas-google-data-centers-ai/" },
  { label: "Data Center Census — Texas projects", url: "https://datacentercensus.com/us/texas" },
  { label: "LLM Pulse — AI data centers under construction", url: "https://llmpulse.ai/blog/ai-data-centers-under-construction/" },
  { label: "Black Ridge Research — Texas data centers being built", url: "https://www.blackridgeresearch.com/blog/largest-biggest-upcoming-new-data-centers-in-texas-united-states" },
  { label: "ElectricChoice — Texas data center directory", url: "https://www.electricchoice.com/datacenters/texas/" },
];
