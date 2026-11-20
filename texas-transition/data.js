/*
 * Texas Transition Tracker — content data.
 *
 * Results for the Nov. 3, 2026 election are UNOFFICIAL, taken from news
 * reports published in the days after the election (see SOURCES below).
 * Check the Texas Secretary of State's official canvass before relying
 * on any number here, and update this file when final figures are out.
 */

// Party codes: "D" Democrat, "R" Republican, null = not yet entered.
window.OFFICES = [
  {
    id: "gov",
    title: "Governor",
    before: { name: "Greg Abbott", party: "R" },
    after: { name: "Gina Hinojosa", party: "D" },
    note: "Won by about 7 points (unofficial). First Democratic governor since Ann Richards left office in 1995, and first Latina governor of Texas.",
    takesOffice: "2027-01-19",
  },
  {
    id: "ltgov",
    title: "Lieutenant Governor",
    before: { name: "Dan Patrick", party: "R" },
    after: { name: "Vikki Goodwin", party: "D" },
    note: "Won by roughly 6 points (unofficial). Presides over a Texas Senate that stays Republican.",
    takesOffice: "2027-01-19",
  },
  {
    id: "ag",
    title: "Attorney General",
    before: { name: "Ken Paxton", party: "R" },
    after: { name: "Nathan Johnson", party: "D" },
    note: "Open seat: Paxton ran for U.S. Senate. Johnson beat Mayes Middleton (R) by about 6 points (unofficial).",
    takesOffice: "2027-01",
  },
  {
    id: "house",
    title: "Texas House (150 seats)",
    before: { name: "Republican majority, 88–62", party: "R" },
    after: { name: "Democratic majority (~82–83 seats reported)", party: "D" },
    note: "About 21 seats flipped from Republican to Democrat. Reported totals differ by source and a few races were still being counted. 76 seats is a majority.",
    takesOffice: "2027-01-12",
  },
  {
    id: "senate",
    title: "Texas Senate (31 seats)",
    before: { name: "Republican majority, 19–12", party: "R" },
    after: { name: "Republican majority, 19–12", party: "R" },
    note: "Republicans keep control, but a Democratic lieutenant governor now presides over the chamber.",
    takesOffice: "2027-01-12",
  },
  {
    id: "scotx",
    title: "Texas Supreme Court (4 seats on ballot)",
    before: { name: "All-Republican court", party: "R" },
    after: { name: "Democrats won all 4 seats on the ballot", party: "D" },
    note: "Four of nine seats. Check how this changes the court's overall balance once members are sworn in.",
    takesOffice: "2027-01",
  },
  {
    id: "ussen",
    title: "U.S. Senate seat",
    before: { name: "John Cornyn", party: "R" },
    after: { name: "James Talarico", party: "D" },
    note: "Federal office, shown for context.",
    takesOffice: "2027-01-03",
  },
  {
    id: "comptroller",
    title: "Comptroller",
    before: { name: "Republican incumbent", party: "R" },
    after: null,
    note: "Result not yet entered. Add it in data.js once verified.",
  },
  {
    id: "land",
    title: "Land Commissioner",
    before: { name: "Republican incumbent", party: "R" },
    after: null,
    note: "Result not yet entered. Add it in data.js once verified.",
  },
  {
    id: "ag-comm",
    title: "Agriculture Commissioner",
    before: { name: "Republican incumbent", party: "R" },
    after: null,
    note: "Result not yet entered. Add it in data.js once verified.",
  },
];

// Map locations used by timeline events.
window.PLACES = {
  capitol: { name: "Texas Capitol, Austin", lat: 30.2747, lon: -97.7404 },
};

/*
 * Timeline events, in date order.
 *   date:     ISO date (YYYY-MM-DD); "approx: true" marks estimated dates
 *   phase:    "history" | "election" | "transition" | "governing"
 *   place:    key into PLACES for a map pin, or null for statewide events
 *   counties: county names to highlight on the map (optional)
 *   statewide: true to tint the whole state
 */
window.EVENTS = [
  {
    date: "1990-11-06",
    phase: "history",
    title: "Ann Richards elected governor",
    body: "Democrat Ann Richards wins the governor's race. She would be the last Democratic governor of Texas for three decades.",
    place: "capitol",
    statewide: true,
    tint: "D",
  },
  {
    date: "1994-11-08",
    phase: "history",
    title: "George W. Bush defeats Richards",
    body: "Republicans take the governor's office. Richards leaves office in January 1995.",
    place: "capitol",
    statewide: true,
    tint: "R",
  },
  {
    date: "1998-11-03",
    phase: "history",
    title: "Republicans sweep statewide offices",
    body: "Republicans win every statewide office on the ballot, beginning a long period of one-party control of the executive branch.",
    place: null,
    statewide: true,
    tint: "R",
  },
  {
    date: "2002-11-05",
    phase: "history",
    title: "Republicans win the Texas House",
    body: "Republicans take a majority in the Texas House for the first time since Reconstruction, completing control of the Legislature.",
    place: "capitol",
    statewide: true,
    tint: "R",
  },
  {
    date: "2026-03-03",
    phase: "election",
    title: "2026 primaries",
    body: "Democratic and Republican primaries set the November matchups for governor, lieutenant governor, attorney general and the Legislature.",
    place: null,
    statewide: true,
    tint: null,
  },
  {
    date: "2026-11-03",
    phase: "election",
    title: "Election Day: Democrats win the top of the ticket",
    body: "Gina Hinojosa defeats Gov. Greg Abbott, Vikki Goodwin defeats Lt. Gov. Dan Patrick, and Nathan Johnson wins the open attorney general seat. Democrats flip about 21 Texas House seats to take the majority, win all four Texas Supreme Court seats on the ballot, and James Talarico wins the U.S. Senate race. Republicans keep the Texas Senate, 19–12. All results are unofficial.",
    place: null,
    statewide: true,
    tint: "D",
    showResults: true,
  },
  {
    date: "2026-11-05",
    phase: "transition",
    title: "Transition team named",
    body: "Governor-elect Hinojosa announces the \"By and For the People\" transition team: Joe Madden (executive director), former Republican state Rep. Ernest Bailes, building trades leader Ryan Pollock, and former Austin ISD trustee Tamala Barksdale (senior advisor). Stated priorities: lowering costs for families, strengthening public schools, and restoring accountability in state government.",
    place: null,
    statewide: true,
    tint: "D",
  },
  {
    date: "2026-12-01",
    approx: true,
    phase: "transition",
    title: "Official canvass",
    body: "Counties and the state finish counting and certify results. Close Texas House races are settled here. (Date shown is approximate.)",
    place: null,
    statewide: true,
    tint: null,
  },
  {
    date: "2027-01-12",
    phase: "governing",
    title: "90th Legislature convenes",
    body: "The Legislature meets in regular session. The new Democratic House majority chooses a Speaker. Lawmakers also canvass the votes for governor and lieutenant governor in joint session.",
    place: "capitol",
    counties: ["Travis"],
    tint: "D",
  },
  {
    date: "2027-01-19",
    phase: "governing",
    title: "Inauguration",
    body: "Gina Hinojosa is sworn in as governor and Vikki Goodwin as lieutenant governor at the Capitol in Austin.",
    place: "capitol",
    counties: ["Travis"],
    tint: "D",
  },
  {
    date: "2027-01-19",
    phase: "governing",
    title: "Day-one pledge: new education commissioner",
    body: "Hinojosa said on election night she would replace Texas Education Agency Commissioner Mike Morath on her first day in office, and that her team was already interviewing candidates.",
    place: "capitol",
    counties: ["Travis"],
    tint: "D",
  },
  {
    date: "2027-05-31",
    approx: true,
    phase: "governing",
    title: "Regular session ends (projected)",
    body: "The 140-day session ends. With a Democratic governor and House and a Republican Senate, bills need to pass a divided Legislature. The governor then has a window to sign or veto bills.",
    place: "capitol",
    counties: ["Travis"],
    tint: null,
  },
];

window.SOURCES = [
  { label: "MultiState — Texas 2026 election results", url: "https://www.multistate.us/elections/results/texas-2026" },
  { label: "Houston Chronicle — Texas election updates", url: "https://www.houstonchronicle.com/politics/election/2026/article/texas-election-updates-22511224.php" },
  { label: "NBC News — Texas 2026 results", url: "https://www.nbcnews.com/politics/2026-elections/texas-results" },
  { label: "TASB — 2026 midterm election recap", url: "https://www.tasb.org/advocacy/tasb-gr-updates/2026-midterm-election-recap" },
  { label: "KSAT — 2026 Texas primary results", url: "https://www.ksat.com/vote-2026/2026/03/03/election-results-2026-texas-statewide-races-democrat-and-republican-primaries/" },
  { label: "CBS Texas — Hinojosa announces transition team", url: "https://www.cbsnews.com/texas/news/gina-hinojosa-announces-transition-team-after-historic-texas-governor-win/" },
  { label: "Texas Public Radio — Hinojosa transition team", url: "https://www.tpr.org/2026-11-05/hinojosa-taps-anti-voucher-republican-education-and-labor-allies-for-texas-transition-team" },
  { label: "Texas Secretary of State — official results", url: "https://www.sos.state.tx.us/elections/" },
];
