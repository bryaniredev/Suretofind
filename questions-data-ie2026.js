/* ============================================================
   Suretofind — Ireland 2026/27 questionnaire (student edition)
   Adds Leaving Cert subject-enjoyment items and an after-school
   pathway preference on top of the shared RIASEC interest bank,
   per research on Irish teen career-questionnaire best practice:
   measure enjoyment (not self-rated ability), anchor items in
   the Irish school experience, and always surface degree,
   apprenticeship, and PLC routes side by side.
   ============================================================ */

const SUBJECT_QUESTIONS_IE2026 = [
  { type: "likert", subject: "maths", text: "How much do you enjoy Maths?" },
  { type: "likert", subject: "english", text: "How much do you enjoy English?" },
  { type: "likert", subject: "irish", text: "How much do you enjoy Irish?" },
  { type: "likert", subject: "chemistry", text: "How much do you enjoy Chemistry?" },
  { type: "likert", subject: "biology", text: "How much do you enjoy Biology?" },
  { type: "likert", subject: "physics", text: "How much do you enjoy Physics?" },
  { type: "likert", subject: "business", text: "How much do you enjoy Business, Accounting, or Economics?" },
  { type: "likert", subject: "construction", text: "How much do you enjoy Construction Studies?" },
  { type: "likert", subject: "engineeringSubj", text: "How much do you enjoy Engineering (the Leaving Cert subject)?" },
  { type: "likert", subject: "dcg", text: "How much do you enjoy Design & Communication Graphics (DCG)?" },
  { type: "likert", subject: "homeEc", text: "How much do you enjoy Home Economics?" },
  { type: "likert", subject: "art", text: "How much do you enjoy Art?" },
  { type: "likert", subject: "agriScience", text: "How much do you enjoy Agricultural Science?" },
  { type: "likert", subject: "appliedMaths", text: "How much do you enjoy Applied Maths?" },
  { type: "likert", subject: "computerScience", text: "How much do you enjoy Computer Science?" },
  { type: "likert", subject: "geography", text: "How much do you enjoy Geography?" },
  { type: "likert", subject: "history", text: "How much do you enjoy History?" },
  { type: "likert", subject: "languages", text: "How much do you enjoy learning a modern language (French, German, Spanish, etc.)?" },
];

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
