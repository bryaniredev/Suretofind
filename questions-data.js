/* ============================================================
   Suretofind — Questionnaire item bank
   24 RIASEC interest items (4 per type, Holland Code model) +
   6 lifestyle/constraint questions used to weight job matches.
   ============================================================ */

const RIASEC_QUESTIONS = [
  // Realistic
  { type: "likert", trait: "R", text: "I'd rather fix or build something with my hands than write a report about it." },
  { type: "likert", trait: "R", text: "Working outdoors or in a workshop sounds more appealing than sitting at a desk all day." },
  { type: "likert", trait: "R", text: "I like using tools, machines, or equipment to get a job done." },
  { type: "likert", trait: "R", text: "I enjoy physical, hands-on work more than abstract theory." },

  // Investigative
  { type: "likert", trait: "I", text: "I like digging into data or a hard problem until I really understand it." },
  { type: "likert", trait: "I", text: "I'm drawn to questions that don't have an obvious answer yet." },
  { type: "likert", trait: "I", text: "I enjoy research, experiments, or figuring out how things work." },
  { type: "likert", trait: "I", text: "I'd rather analyze a problem carefully than just go with my gut." },

  // Artistic
  { type: "likert", trait: "A", text: "I like creating things — writing, designing, or building something original." },
  { type: "likert", trait: "A", text: "I get bored by rigid rules and prefer creative freedom." },
  { type: "likert", trait: "A", text: "Self-expression matters a lot to me in my work." },
  { type: "likert", trait: "A", text: "I enjoy imagining new ideas more than following an existing process." },

  // Social
  { type: "likert", trait: "S", text: "Helping other people directly is one of the most rewarding parts of work for me." },
  { type: "likert", trait: "S", text: "I'd rather teach, counsel, or care for someone than work alone on a spreadsheet." },
  { type: "likert", trait: "S", text: "I'm energized by conversations and relationships with other people." },
  { type: "likert", trait: "S", text: "I naturally notice when someone needs support, and I want to help." },

  // Enterprising
  { type: "likert", trait: "E", text: "I enjoy persuading, selling, or negotiating to get a deal done." },
  { type: "likert", trait: "E", text: "I like taking charge and leading a team toward a goal." },
  { type: "likert", trait: "E", text: "Ambition and healthy competition motivate me." },
  { type: "likert", trait: "E", text: "I'd rather start something new than maintain something that already exists." },

  // Conventional
  { type: "likert", trait: "C", text: "I like clear structure, rules, and organized systems at work." },
  { type: "likert", trait: "C", text: "I'm detail-oriented and enjoy keeping accurate records." },
  { type: "likert", trait: "C", text: "I feel most comfortable when I know exactly what's expected of me." },
  { type: "likert", trait: "C", text: "I enjoy organizing information or processes so everything runs smoothly." },
];

const LIFESTYLE_QUESTIONS = [
  {
    type: "choice",
    key: "degree",
    text: "How much time are you willing to invest in school or training first?",
    options: [
      { label: "None — I want to start earning as soon as possible", value: "none" },
      { label: "A short certificate or apprenticeship (under 2 years)", value: "cert" },
      { label: "A bachelor's degree", value: "bachelor" },
      { label: "A graduate degree (master's or higher)", value: "graduate" },
    ]
  },
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

const LIKERT_SCALE = [
  { label: "Strongly disagree", value: 1 },
  { label: "Disagree", value: 2 },
  { label: "Neutral", value: 3 },
  { label: "Agree", value: 4 },
  { label: "Strongly agree", value: 5 },
];
