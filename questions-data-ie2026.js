/* ============================================================
   Suretofind — Ireland 2026/27 questionnaire (student edition)
   Adds an adaptive subject-choice flow and a hobbies signal on
   top of the shared RIASEC interest bank:

     1. Which cycle are you in? (Junior Cycle / Senior Cycle /
        not currently in school)
     2. Pick the subjects you actually take, from the real
        Junior Cycle or Leaving Certificate (Established) subject
        lists (NCCA Curriculum Online, 2025/26) — grouped the way
        NCCA groups them, minus the ~100-hour short courses and
        the separate LCVP/LCA course lists, which are out of
        scope here.
     3. Rate how much you enjoy exactly the subjects you picked
        (plus the three de facto core subjects everyone takes:
        Irish, English, Maths) — these questions are generated
        dynamically, not asked as one fixed list.
     4. Pick your hobbies from a list of activities popular with
        Irish teens, used as a light extra signal on top of the
        RIASEC interest score.

   Subject counts are transcribed directly from NCCA's published
   lists; NCCA's own materials disagree slightly on exact totals
   (see the "Subject counts vary by how you count" caveat in the
   source research), so treat the numbers here as indicative of
   the real menu, not a disputed exact count.
   ============================================================ */

const CYCLE_QUESTION_IE2026 = [
  {
    type: "choice",
    key: "cycle",
    text: "Which stage of school are you in?",
    options: [
      { label: "Junior Cycle (1st–3rd year)", value: "junior" },
      { label: "Senior Cycle (Transition Year–6th year)", value: "senior" },
      { label: "I'm not currently in school", value: "none" },
    ]
  }
];

// The three de facto core subjects almost everyone takes at both
// Junior Cycle and Leaving Certificate — always asked (unless the
// student isn't in school), so they're not part of the picker below.
const CORE_SUBJECT_QUESTIONS_IE2026 = [
  { type: "likert", subjectKeys: ["irish"], text: "I really enjoy Irish." },
  { type: "likert", subjectKeys: ["english"], text: "I really enjoy English." },
  { type: "likert", subjectKeys: ["maths"], text: "I really enjoy Maths." },
];

// Junior Cycle's 15 optional full subjects (Framework for Junior
// Cycle 2015), NCCA Curriculum Online — excludes the ~100-hour
// short courses (Coding, CSPE, Digital Media Literacy, etc.),
// which are a separate, smaller menu.
const JUNIOR_CYCLE_SUBJECTS_IE2026 = [
  { id: "jc-business", label: "Business Studies", group: "Business", keys: ["business"] },
  { id: "jc-appliedTech", label: "Applied Technology", group: "Technology & Engineering", keys: ["engineeringSubj"] },
  { id: "jc-engineering", label: "Engineering", group: "Technology & Engineering", keys: ["engineeringSubj"] },
  { id: "jc-graphics", label: "Graphics", group: "Technology & Engineering", keys: ["dcg"] },
  { id: "jc-woodTech", label: "Wood Technology", group: "Technology & Engineering", keys: ["construction"] },
  { id: "jc-science", label: "Science", group: "Science", keys: ["physics", "chemistry", "biology"] },
  { id: "jc-classics", label: "Classics", group: "Humanities & Languages", keys: ["history"] },
  { id: "jc-geography", label: "Geography", group: "Humanities & Languages", keys: ["geography"] },
  { id: "jc-history", label: "History", group: "Humanities & Languages", keys: ["history"] },
  { id: "jc-mfl", label: "Modern Foreign Languages (French, German, Spanish, Italian)", group: "Humanities & Languages", keys: ["languages"] },
  { id: "jc-religiousEd", label: "Religious Education", group: "Humanities & Languages", keys: ["history"] },
  { id: "jc-jewishStudies", label: "Jewish Studies", group: "Humanities & Languages", keys: ["history"] },
  { id: "jc-homeEc", label: "Home Economics", group: "Home Economics & Arts", keys: ["homeEc"] },
  { id: "jc-music", label: "Music", group: "Home Economics & Arts", keys: ["music"] },
  { id: "jc-visualArt", label: "Visual Art", group: "Home Economics & Arts", keys: ["art"] },
];

// Leaving Certificate (Established) subjects, NCCA Curriculum
// Online — excludes Irish/English/Maths (core, above), the LCVP
// Link Modules, and the separate LCA course list. Grouped the way
// the source subject list itself groups them (Languages; Science/
// Maths; Business/Social studies; Technology/Applied; Arts/PE).
// Includes the Senior Cycle Redevelopment Tranche 1 subjects
// (Climate Action and Sustainable Development; Drama, Film and
// Theatre Studies), live for Fifth Years from September 2025 —
// though in 2025/26 those two are only actually offered in ~100
// phase-one schools nationally.
const SENIOR_CYCLE_SUBJECTS_IE2026 = [
  // Languages
  { id: "lc-french", label: "French", group: "Languages", keys: ["languages"] },
  { id: "lc-german", label: "German", group: "Languages", keys: ["languages"] },
  { id: "lc-spanish", label: "Spanish", group: "Languages", keys: ["languages"] },
  { id: "lc-italian", label: "Italian", group: "Languages", keys: ["languages"] },
  { id: "lc-latin", label: "Latin", group: "Languages", keys: ["history"] },
  { id: "lc-ancientGreek", label: "Ancient Greek", group: "Languages", keys: ["history"] },
  { id: "lc-arabic", label: "Arabic", group: "Languages", keys: ["languages"] },
  { id: "lc-japanese", label: "Japanese", group: "Languages", keys: ["languages"] },
  { id: "lc-russian", label: "Russian", group: "Languages", keys: ["languages"] },
  { id: "lc-mandarin", label: "Mandarin Chinese", group: "Languages", keys: ["languages"] },
  { id: "lc-lithuanian", label: "Lithuanian", group: "Languages", keys: ["languages"] },
  { id: "lc-polish", label: "Polish", group: "Languages", keys: ["languages"] },
  { id: "lc-portuguese", label: "Portuguese", group: "Languages", keys: ["languages"] },
  { id: "lc-hebrewStudies", label: "Hebrew Studies", group: "Languages", keys: ["history"] },
  { id: "lc-classicalStudies", label: "Classical Studies", group: "Languages", keys: ["history"] },
  // Science & Mathematics
  { id: "lc-appliedMaths", label: "Applied Mathematics", group: "Science & Mathematics", keys: ["appliedMaths"] },
  { id: "lc-physics", label: "Physics", group: "Science & Mathematics", keys: ["physics"] },
  { id: "lc-chemistry", label: "Chemistry", group: "Science & Mathematics", keys: ["chemistry"] },
  { id: "lc-biology", label: "Biology", group: "Science & Mathematics", keys: ["biology"] },
  { id: "lc-physicsChemistry", label: "Physics and Chemistry (combined)", group: "Science & Mathematics", keys: ["physics", "chemistry"] },
  { id: "lc-agriScience", label: "Agricultural Science", group: "Science & Mathematics", keys: ["agriScience"] },
  { id: "lc-computerScience", label: "Computer Science", group: "Science & Mathematics", keys: ["computerScience"] },
  // Business & Social Studies
  { id: "lc-accounting", label: "Accounting", group: "Business & Social Studies", keys: ["business"] },
  { id: "lc-businessSubj", label: "Business", group: "Business & Social Studies", keys: ["business"] },
  { id: "lc-economics", label: "Economics", group: "Business & Social Studies", keys: ["business"] },
  { id: "lc-geography", label: "Geography", group: "Business & Social Studies", keys: ["geography"] },
  { id: "lc-history", label: "History", group: "Business & Social Studies", keys: ["history"] },
  { id: "lc-politicsSociety", label: "Politics and Society", group: "Business & Social Studies", keys: ["history"] },
  { id: "lc-religiousEd", label: "Religious Education", group: "Business & Social Studies", keys: ["history"] },
  // Technology & Applied
  { id: "lc-construction", label: "Construction Studies", group: "Technology & Applied", keys: ["construction"] },
  { id: "lc-engineering", label: "Engineering", group: "Technology & Applied", keys: ["engineeringSubj"] },
  { id: "lc-dcg", label: "Design and Communication Graphics", group: "Technology & Applied", keys: ["dcg"] },
  { id: "lc-technology", label: "Technology", group: "Technology & Applied", keys: ["engineeringSubj"] },
  { id: "lc-homeEc", label: "Home Economics", group: "Technology & Applied", keys: ["homeEc"] },
  // Arts & PE
  { id: "lc-art", label: "Art", group: "Arts & PE", keys: ["art"] },
  { id: "lc-music", label: "Music", group: "Arts & PE", keys: ["music"] },
  { id: "lc-pe", label: "Physical Education (LCPE)", group: "Arts & PE", keys: ["pe"] },
  { id: "lc-climateAction", label: "Climate Action and Sustainable Development", group: "Arts & PE", keys: ["agriScience"] },
  { id: "lc-dramaFilmTheatre", label: "Drama, Film and Theatre Studies", group: "Arts & PE", keys: ["art"] },
];

function catalogForCycle(cycle) {
  return cycle === "junior" ? JUNIOR_CYCLE_SUBJECTS_IE2026 : SENIOR_CYCLE_SUBJECTS_IE2026;
}

const SUBJECT_PICKER_QUESTION_IE2026 = {
  type: "multiselect",
  key: "subjects",
  dynamicCatalog: true,
  text: "Pick the subjects you're taking this year.",
  hint: "Tick every subject that applies — Irish, English, and Maths are already covered separately.",
};

// Builds the dynamic "I really enjoy X" statements for exactly the
// subjects a student picked, plus the shared core three.
// De-duplicates by which internal scoring keys a subject maps to,
// so e.g. picking both French and German only produces one
// "I really enjoy learning a language" statement, not two identical ones.
function buildSubjectQuestions(cycle, selectedIds) {
  if (cycle === "none") return [];

  const catalog = catalogForCycle(cycle);
  const selectedEntries = catalog.filter((s) => selectedIds.indexOf(s.id) !== -1);
  const seen = {};
  const questions = [];

  CORE_SUBJECT_QUESTIONS_IE2026.forEach((q) => {
    const sig = q.subjectKeys.join(",");
    if (seen[sig]) return;
    seen[sig] = true;
    questions.push(q);
  });

  selectedEntries.forEach((entry) => {
    const sig = entry.keys.join(",");
    if (seen[sig]) return;
    seen[sig] = true;
    questions.push({
      type: "likert",
      subjectKeys: entry.keys,
      text: `I really enjoy ${entry.label}.`,
    });
  });

  return questions;
}

// Same axes as the shared lifestyle bank, minus the "degree tolerance"
// question — replaced below by an explicit pathway-preference question,
// since Irish careers routes aren't a simple more-schooling/less-schooling
// ladder (an apprenticeship can lead to a Level 8 award, for example).
const LIFESTYLE_QUESTIONS_IE2026 = [
  {
    type: "choice",
    key: "remote",
    text: "Where do you want to work?",
    options: [
      { label: "Fully remote", value: "remote" },
      { label: "Hybrid — a mix of home and office", value: "hybrid" },
      { label: "On-site, in person", value: "onsite" },
      { label: "Doesn't matter to me", value: "flexible" },
    ]
  },
  {
    type: "choice",
    key: "setting",
    text: "Indoors or outdoors?",
    options: [
      { label: "Mostly indoors", value: "indoor" },
      { label: "Mostly outdoors", value: "outdoor" },
      { label: "A healthy mix of both", value: "mixed" },
    ]
  },
  {
    type: "choice",
    key: "collab",
    text: "How do you like to work with others?",
    options: [
      { label: "Mostly solo, with deep focus time", value: "solo" },
      { label: "Mostly as part of a team", value: "team" },
      { label: "A mix of both", value: "mixed" },
    ]
  },
  {
    type: "choice",
    key: "pace",
    text: "Structured routine, or flexible freedom?",
    options: [
      { label: "I like clear structure and routine", value: "structured" },
      { label: "I like flexibility and autonomy", value: "flexible" },
    ]
  },
  {
    type: "choice",
    key: "risk",
    text: "Steady ground, or higher-risk upside?",
    options: [
      { label: "A steady, well-established career path", value: "stable" },
      { label: "A fast-growing field, even with more uncertainty", value: "growth" },
    ]
  },
];

const PATHWAY_QUESTION_IE2026 = [
  {
    type: "choice",
    key: "pathway",
    text: "After school, which route appeals to you most?",
    options: [
      { label: "A CAO / third-level degree", value: "degree" },
      { label: "An earn-while-you-learn apprenticeship", value: "apprenticeship" },
      { label: "A shorter PLC / QQI course", value: "plc" },
      { label: "I'm open to any of these", value: "open" },
    ]
  }
];

// Activities popular with Irish teens (Sport Ireland's Irish Sports
// Monitor 2025 records record-high 49% sport participation driven by
// teens/young adults; the GAA's 2025 Gaelic Games Youth Participation
// Study tracks youth involvement specifically) plus widely-recognised
// digital, creative, and part-time-work activities. Used as a light
// extra signal on top of the RIASEC interest score — not a job filter.
const HOBBY_OPTIONS_IE2026 = [
  { id: "gaa", label: "GAA / Gaelic games (football, hurling, camogie)" },
  { id: "teamSports", label: "Soccer, rugby, basketball, or other team sports" },
  { id: "fitness", label: "Gym, running, or individual fitness/sport" },
  { id: "gaming", label: "Gaming or esports" },
  { id: "contentCreation", label: "Making content (TikTok, YouTube, Instagram)" },
  { id: "musicPlaying", label: "Playing an instrument or singing" },
  { id: "musicListening", label: "Following music, playlists, or gigs" },
  { id: "visualArt", label: "Drawing, painting, or other visual art" },
  { id: "reading", label: "Reading (books, fanfiction, manga)" },
  { id: "coding", label: "Coding, robotics, or tech projects" },
  { id: "partTimeJob", label: "Part-time job or side hustle" },
  { id: "volunteering", label: "Volunteering or community work" },
  { id: "debating", label: "Debating, public speaking, or student council" },
  { id: "cooking", label: "Cooking or baking" },
  { id: "fashion", label: "Fashion, beauty, or styling" },
  { id: "outdoors", label: "Outdoor activities (hiking, camping, fishing)" },
  { id: "animals", label: "Caring for animals or pets" },
  { id: "strategyGames", label: "Board games, D&D, or strategy/puzzle games" },
];

const HOBBY_QUESTION_IE2026 = [
  {
    type: "multiselect",
    key: "hobbies",
    text: "What do you spend your free time on?",
    hint: "Pick as many as genuinely apply — there's no limit.",
    options: HOBBY_OPTIONS_IE2026,
  }
];

// Broad sector/interest-area signal, one level up from individual
// subjects and hobbies. RIASEC and subject-enjoyment questions alone
// can't tell a genuine interest in, say, food and hospitality apart
// from a more generic "hands-on and a bit creative" profile that also
// happens to fit trades, crafts, or care work — several sectors share
// a similar Realistic/Artistic/Social mix. Without this, a job in a
// sector the student has never shown any real interest in can still
// rank highly on interest-vector math alone (e.g. Chef surfacing for
// students who've never cooked). Each option maps to the job
// `category` values it covers (see jobs-data-ie2026.js) — together
// the 12 options cover every category in the dataset.
const SECTOR_OPTIONS_IE2026 = [
  { id: "food-hospitality", label: "Food, cooking & hospitality", categories: ["Hospitality & Tourism"] },
  { id: "trades-construction", label: "Building, trades & construction", categories: ["Skilled Trades & Construction"] },
  { id: "engineering-machines", label: "Machines, vehicles & engineering", categories: ["Engineering", "Transport & Logistics", "Green Economy"] },
  { id: "tech-computers", label: "Computers, software & technology", categories: ["Technology & ICT"] },
  { id: "healthcare-medicine", label: "Healthcare & medicine", categories: ["Healthcare", "Science, Pharma & MedTech"] },
  { id: "teaching-childcare", label: "Teaching & working with children", categories: ["Education"] },
  { id: "animals-vet", label: "Animals & veterinary care", categories: ["Veterinary & Animal Care"] },
  { id: "nature-farming", label: "Nature, farming & the outdoors", categories: ["Agriculture & Agri-Food", "Horticulture & Landscaping", "Science & Environment"] },
  { id: "business-money", label: "Business, money & entrepreneurship", categories: ["Business & Finance", "Property & Real Estate"] },
  { id: "law-publicservice", label: "Law, safety & public service", categories: ["Public Sector & Law", "Politics & Public Life"] },
  { id: "art-design", label: "Art, design & creative work", categories: ["Creative & Digital", "Design & Architecture", "Information & Culture"] },
  { id: "beauty-fitness", label: "Hair, beauty, fitness & personal care", categories: ["Personal Services & Retail"] },
];

const SECTOR_QUESTION_IE2026 = [
  {
    type: "multiselect",
    key: "sectors",
    text: "Which of these fields genuinely interest you?",
    hint: "Pick every field you'd actually consider working in — this helps rule out ones you're just not drawn to, even when a job's other traits happen to line up with you.",
    options: SECTOR_OPTIONS_IE2026,
  }
];

// Approximate RIASEC signature per hobby (0–1 per trait, missing
// traits treated as 0), used to nudge — not replace — the interest
// profile computed from the RIASEC questions.
const HOBBY_RIASEC_IE2026 = {
  gaa: { R: 0.7, S: 0.5, E: 0.3 },
  teamSports: { R: 0.7, S: 0.5, E: 0.35 },
  fitness: { R: 0.75, C: 0.2 },
  gaming: { I: 0.5, R: 0.35, C: 0.3 },
  contentCreation: { A: 0.6, E: 0.55 },
  musicPlaying: { A: 0.85 },
  musicListening: { A: 0.4, S: 0.3 },
  visualArt: { A: 0.9 },
  reading: { I: 0.6, A: 0.3 },
  coding: { I: 0.75, R: 0.35, C: 0.3 },
  partTimeJob: { E: 0.6, C: 0.45 },
  volunteering: { S: 0.85 },
  debating: { E: 0.7, S: 0.45 },
  cooking: { R: 0.55, A: 0.4 },
  fashion: { A: 0.65, E: 0.3 },
  outdoors: { R: 0.85 },
  animals: { S: 0.6, R: 0.45 },
  strategyGames: { I: 0.6, C: 0.35 },
};
