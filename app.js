/* ============================================================
   Suretofind — App logic
   ============================================================ */

(function () {
  "use strict";

  const QUESTIONS_STANDARD = [...RIASEC_QUESTIONS, ...LIFESTYLE_QUESTIONS];
  const QUESTIONS_IE2026 = [
    ...RIASEC_QUESTIONS,
    ...SUBJECT_QUESTIONS_IE2026,
    ...LIFESTYLE_QUESTIONS_IE2026,
    ...PATHWAY_QUESTION_IE2026,
  ];

  const MARKETS = {
    us: {
      label: "US",
      jobs: JOBS,
      questions: QUESTIONS_STANDARD,
      footer: "Job data compiled from the U.S. Bureau of Labor Statistics Occupational Outlook Handbook (2024–2034 projections), LinkedIn \"Jobs on the Rise\" 2026, and the World Economic Forum Future of Jobs Report 2025. Matching is based on Holland's RIASEC interest model. Figures are US-national estimates and change over time — treat results as a starting point for research, not a guarantee."
    },
    ie: {
      label: "Ireland",
      jobs: JOBS_IE,
      questions: QUESTIONS_STANDARD,
      footer: "Job data compiled from Ireland's Critical Skills Occupations List 2026 (Department of Enterprise, Tourism and Employment), the CSO Labour Force Survey, the Morgan McKinley Ireland Salary Guide 2026, the Expert Group on Future Skills Needs (EGFSN), and sector salary guides from Excel Recruitment and Fáilte Ireland. Matching is based on Holland's RIASEC interest model. Figures are Ireland-national estimates and change over time — treat results as a starting point for research, not a guarantee."
    },
    ie2026: {
      label: "Ireland 2026/27",
      jobs: JOBS_IE_2026,
      questions: QUESTIONS_IE2026,
      footer: "Job data compiled from the SOLAS National Skills Bulletin 2025, Ireland's Critical Skills Occupations List (DETE, effective 13 May 2026), the EGFSN's Skills for Biopharma and Skills for Zero Carbon reports, the Fáilte Ireland Tourism Careers Research 2025 Update, the Build Up Skills Ireland 2030 report, apprenticeship.ie/National Apprenticeship Office data, 2025/2026 CAO points, and public pay scales (HSE, ASTI, An Garda Síochána). Salary figures from recruitment/aggregator sources are indicative and Dublin-weighted; CAO points change yearly. Matching combines Holland's RIASEC interest model with Leaving Cert subject enjoyment and your preferred after-school pathway — treat your results as exploration anchors for further research with a guidance counsellor, not a verdict."
    }
  };

  const state = {
    market: "us",
    questions: MARKETS.us.questions,
    total: MARKETS.us.questions.length,
    index: 0,
    likertAnswers: {},   // question index -> value 1-5
    lifestyleAnswers: {} // key -> value
  };

  const screens = {
    intro: document.getElementById("screen-intro"),
    quiz: document.getElementById("screen-quiz"),
    results: document.getElementById("screen-results"),
  };

  const els = {
    marketBtns: document.querySelectorAll(".btn-market"),
    retakeBtn: document.getElementById("retake-btn"),
    progressFill: document.getElementById("progress-fill"),
    progressLabel: document.getElementById("progress-label"),
    questionWrap: document.getElementById("question-wrap"),
    backBtn: document.getElementById("back-btn"),
    needle: document.getElementById("compass-needle"),
    resultsNeedleGroup: document.getElementById("results-hex"),
    matchList: document.getElementById("match-list"),
    topTraitLabel: document.getElementById("top-trait-label"),
    matchesHeading: document.getElementById("matches-heading"),
    footerDisclaimer: document.getElementById("footer-disclaimer"),
  };

  function showScreen(name) {
    Object.values(screens).forEach((s) => s.classList.remove("active"));
    screens[name].classList.add("active");
  }

  // ---------- Navigation ----------

  els.marketBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      state.market = btn.dataset.market;
      state.questions = MARKETS[state.market].questions;
      state.total = state.questions.length;
      state.index = 0;
      state.likertAnswers = {};
      state.lifestyleAnswers = {};
      showScreen("quiz");
      renderQuestion();
    });
  });

  els.retakeBtn.addEventListener("click", () => {
    state.index = 0;
    state.likertAnswers = {};
    state.lifestyleAnswers = {};
    showScreen("intro");
  });

  els.backBtn.addEventListener("click", () => {
    if (state.index > 0) {
      state.index -= 1;
      renderQuestion();
    }
  });

  function goNext() {
    if (state.index < state.total - 1) {
      state.index += 1;
      renderQuestion();
    } else {
      computeAndShowResults();
    }
  }

  // ---------- Rendering ----------

  function renderQuestion() {
    const q = state.questions[state.index];
    const pct = Math.round((state.index / state.total) * 100);
    els.progressFill.style.width = pct + "%";
    els.progressLabel.textContent = `${state.index + 1} / ${state.total}`;
    els.backBtn.disabled = state.index === 0;

    els.questionWrap.innerHTML = "";

    const heading = document.createElement("h2");
    heading.className = "question-text";
    heading.textContent = q.text;
    els.questionWrap.appendChild(heading);

    const optionsWrap = document.createElement("div");
    optionsWrap.className = q.type === "likert" ? "likert-row" : "choice-list";

    if (q.type === "likert") {
      const current = state.likertAnswers[state.index];
      LIKERT_SCALE.forEach((opt) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "likert-btn" + (current === opt.value ? " selected" : "");
        btn.innerHTML = `<span class="dot"></span><span class="likert-label">${opt.label}</span>`;
        btn.addEventListener("click", () => {
          state.likertAnswers[state.index] = opt.value;
          setTimeout(goNext, 180);
        });
        optionsWrap.appendChild(btn);
      });
    } else {
      const current = state.lifestyleAnswers[q.key];
      q.options.forEach((opt) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "choice-btn" + (current === opt.value ? " selected" : "");
        btn.textContent = opt.label;
        btn.addEventListener("click", () => {
          state.lifestyleAnswers[q.key] = opt.value;
          setTimeout(goNext, 180);
        });
        optionsWrap.appendChild(btn);
      });
    }

    els.questionWrap.appendChild(optionsWrap);
    nudgeCompass();
  }

  function nudgeCompass() {
    // subtle live needle wobble as you answer, purely decorative
    const deg = (state.index / state.total) * 340 - 170;
    if (els.needle) {
      els.needle.style.transform = `rotate(${deg}deg)`;
    }
  }

  // ---------- Scoring ----------

  const TRAITS = ["R", "I", "A", "S", "E", "C"];
  const TRAIT_NAMES = {
    R: "Realistic",
    I: "Investigative",
    A: "Artistic",
    S: "Social",
    E: "Enterprising",
    C: "Conventional",
  };
  const DEGREE_RANK = { none: 0, cert: 1, bachelor: 2, graduate: 3 };

  const SUBJECT_LABELS = {
    maths: "Maths",
    english: "English",
    irish: "Irish",
    chemistry: "Chemistry",
    biology: "Biology",
    physics: "Physics",
    business: "Business/Accounting/Economics",
    construction: "Construction Studies",
    engineeringSubj: "Engineering",
    dcg: "DCG",
    homeEc: "Home Economics",
    art: "Art",
    agriScience: "Agricultural Science",
    appliedMaths: "Applied Maths",
    computerScience: "Computer Science",
    geography: "Geography",
    history: "History",
    languages: "Modern Languages",
  };

  const PATHWAY_LABELS = {
    degree: "CAO / third-level degree",
    apprenticeship: "Earn-while-you-learn apprenticeship",
    plc: "PLC / QQI course",
    multiple: "Multiple routes in — degree, apprenticeship, or PLC",
  };

  function computeRiasecProfile() {
    const sums = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    const counts = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };

    RIASEC_QUESTIONS.forEach((q, i) => {
      const val = state.likertAnswers[i] || 3;
      sums[q.trait] += val;
      counts[q.trait] += 1;
    });

    const profile = {};
    TRAITS.forEach((t) => {
      const avg = sums[t] / counts[t]; // 1..5
      profile[t] = (avg - 1) / 4; // normalize to 0..1
    });
    return profile;
  }

  function cosineSim(u, j) {
    let dot = 0, magU = 0, magJ = 0;
    TRAITS.forEach((t) => {
      dot += u[t] * j[t];
      magU += u[t] * u[t];
      magJ += j[t] * j[t];
    });
    if (magU === 0 || magJ === 0) return 0;
    return dot / (Math.sqrt(magU) * Math.sqrt(magJ));
  }

  // Leaving Cert subject-enjoyment profile — only populated on markets
  // whose question set includes SUBJECT_QUESTIONS_IE2026 items (identified
  // generically by the presence of q.subject, so this doesn't need to know
  // about any particular market).
  function computeSubjectProfile() {
    const profile = {};
    state.questions.forEach((q, i) => {
      if (q.type === "likert" && q.subject) {
        const val = state.likertAnswers[i] || 3;
        profile[q.subject] = (val - 1) / 4; // normalize to 0..1
      }
    });
    return profile;
  }

  function subjectAlignment(job, subjectProfile) {
    if (!job.subjects || !job.subjects.length) return 0.7;
    const vals = job.subjects.map((s) => (s in subjectProfile ? subjectProfile[s] : 0.6));
    return vals.reduce((sum, v) => sum + v, 0) / vals.length;
  }

  function lifestyleAlignment(job) {
    const a = state.lifestyleAnswers;
    let alignedWeight = 0;
    let totalWeight = 0;

    // Education / pathway fit — Ireland 2026/27 asks about an after-school
    // pathway (degree / apprenticeship / PLC) rather than schooling
    // tolerance, since an apprenticeship route can lead to the same
    // Level 8 award as a CAO degree.
    totalWeight += 1.4;
    if (state.market === "ie2026") {
      if (a.pathway === "open" || job.pathway === "multiple" || a.pathway === job.pathway) {
        alignedWeight += 1.4;
      } else {
        alignedWeight += 0.5;
      }
    } else {
      // Penalize if the job needs more schooling than the user wants
      const userDeg = DEGREE_RANK[a.degree];
      const jobDeg = DEGREE_RANK[job.degree];
      if (jobDeg <= userDeg) {
        alignedWeight += 1.4;
      } else {
        const gap = jobDeg - userDeg;
        alignedWeight += Math.max(0, 1.4 - gap * 0.7);
      }
    }

    // Remote preference
    totalWeight += 1;
    if (a.remote === "flexible" || job.remote === "flexible" || a.remote === job.remote) {
      alignedWeight += 1;
    } else if (
      (a.remote === "hybrid" && (job.remote === "remote" || job.remote === "onsite")) ||
      (job.remote === "hybrid" && (a.remote === "remote" || a.remote === "onsite"))
    ) {
      alignedWeight += 0.5;
    }

    // Setting (indoor/outdoor)
    totalWeight += 1;
    if (a.setting === "mixed" || job.setting === "mixed" || a.setting === job.setting) {
      alignedWeight += 1;
    }

    // Collaboration style
    totalWeight += 1;
    if (a.collab === "mixed" || job.collab === "mixed" || a.collab === job.collab) {
      alignedWeight += 1;
    }

    // Structure / pace
    totalWeight += 0.8;
    if (a.pace === job.pace) {
      alignedWeight += 0.8;
    } else {
      alignedWeight += 0.3;
    }

    // Risk appetite
    totalWeight += 0.6;
    if (a.risk === job.risk) {
      alignedWeight += 0.6;
    } else {
      alignedWeight += 0.25;
    }

    return alignedWeight / totalWeight; // 0..1
  }

  function computeAndShowResults() {
    const profile = computeRiasecProfile();
    const market = MARKETS[state.market];
    const subjectProfile = state.market === "ie2026" ? computeSubjectProfile() : null;

    const scored = market.jobs.map((job) => {
      const interestScore = cosineSim(profile, job.riasec); // 0..1
      const lifestyleScore = lifestyleAlignment(job); // 0..1
      let finalScore;
      if (subjectProfile) {
        const subjectScore = subjectAlignment(job, subjectProfile); // 0..1
        finalScore = interestScore * 0.5 + subjectScore * 0.2 + lifestyleScore * 0.3;
      } else {
        finalScore = interestScore * 0.68 + lifestyleScore * 0.32;
      }
      return { job, interestScore, lifestyleScore, finalScore };
    });

    scored.sort((x, y) => y.finalScore - x.finalScore);

    if (els.matchesHeading) {
      els.matchesHeading.textContent = `Your top ${market.label} job matches`;
    }
    if (els.footerDisclaimer) {
      els.footerDisclaimer.textContent = market.footer;
    }

    renderResults(profile, scored.slice(0, 6));
    showScreen("results");
  }

  // ---------- Results rendering ----------

  function renderHexChart(profile) {
    // Hexagon compass-style radar chart, 6 axes at compass bearings
    const size = 320;
    const cx = size / 2, cy = size / 2;
    const maxR = 120;
    const angleFor = (i) => (Math.PI * 2 * i) / 6 - Math.PI / 2;

    function pointAt(i, r) {
      const ang = angleFor(i);
      return [cx + r * Math.cos(ang), cy + r * Math.sin(ang)];
    }

    // grid rings
    let svg = "";
    [0.25, 0.5, 0.75, 1].forEach((frac) => {
      const pts = TRAITS.map((_, i) => pointAt(i, maxR * frac).join(",")).join(" ");
      svg += `<polygon points="${pts}" class="hex-grid" />`;
    });
    // spokes
    TRAITS.forEach((_, i) => {
      const [x, y] = pointAt(i, maxR);
      svg += `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" class="hex-spoke" />`;
    });

    // data polygon
    const dataPts = TRAITS.map((t, i) => pointAt(i, maxR * profile[t]).join(",")).join(" ");
    svg += `<polygon points="${dataPts}" class="hex-data" />`;
    TRAITS.forEach((t, i) => {
      const [x, y] = pointAt(i, maxR * profile[t]);
      svg += `<circle cx="${x}" cy="${y}" r="4" class="hex-dot" />`;
    });

    // labels
    TRAITS.forEach((t, i) => {
      const [x, y] = pointAt(i, maxR + 34);
      svg += `<text x="${x}" y="${y}" class="hex-label" text-anchor="middle" dominant-baseline="middle">${t}</text>`;
    });

    els.resultsNeedleGroup.innerHTML = `<svg viewBox="0 0 ${size} ${size}" class="hex-svg">${svg}</svg>`;

    // top trait callout
    const top = TRAITS.reduce((best, t) => (profile[t] > profile[best] ? t : best), "R");
    els.topTraitLabel.textContent = `Your strongest pull: ${TRAIT_NAMES[top]}`;
  }

  function tagRow(job) {
    const tags = [
      job.degree === "none" ? "No degree required" : capitalize(job.degree) + "'s / cert",
      capitalize(job.remote),
      capitalize(job.setting),
      capitalize(job.collab === "team" ? "team-based" : job.collab),
      job.risk === "growth" ? "Fast-growing" : "Stable demand",
    ];
    return tags.map((t) => `<span class="tag">${t}</span>`).join("");
  }

  function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  function renderResults(profile, top) {
    renderHexChart(profile);

    els.matchList.innerHTML = "";
    top.forEach((entry, i) => {
      const { job, finalScore } = entry;
      const pct = Math.round(finalScore * 100);

      const card = document.createElement("article");
      card.className = "match-card";
      card.innerHTML = `
        <div class="match-rank">${String(i + 1).padStart(2, "0")}</div>
        <div class="match-body">
          <div class="match-head">
            <div>
              <p class="match-category">${job.category}</p>
              <h3 class="match-title">${job.title}</h3>
            </div>
            <div class="match-score">
              <span class="match-score-num">${pct}%</span>
              <span class="match-score-label">match</span>
            </div>
          </div>
          <p class="match-blurb">${job.blurb}</p>
          <div class="match-tags">${tagRow(job)}</div>
          <dl class="match-facts">
            <div><dt>Salary</dt><dd>${job.salary}</dd></div>
            <div><dt>Education</dt><dd>${job.education}</dd></div>
            <div><dt>Outlook</dt><dd>${job.growth}</dd></div>
            <div><dt>Key skills</dt><dd>${job.skills.join(", ")}</dd></div>
            ${job.pathway ? `<div><dt>Pathway</dt><dd>${PATHWAY_LABELS[job.pathway] || job.pathway}</dd></div>` : ""}
            ${job.subjects ? `<div><dt>Leaving Cert subjects</dt><dd>${job.subjects.map((s) => SUBJECT_LABELS[s] || s).join(", ")}</dd></div>` : ""}
          </dl>
        </div>
      `;
      els.matchList.appendChild(card);
    });
  }
})();
