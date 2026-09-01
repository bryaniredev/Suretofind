/* ============================================================
   Suretofind — App logic
   ============================================================ */

(function () {
  "use strict";

  const QUESTIONS_STANDARD = [...RIASEC_QUESTIONS, ...LIFESTYLE_QUESTIONS];
  // Ireland 2026/27 starts with a fixed base — RIASEC, then "which
  // cycle are you in?", then the subject picker (its own catalog of
  // options resolves at render time from the cycle answer) — and the
  // subject-enjoyment questions for whatever was picked get spliced
  // in right after the picker once it's answered. See continueMultiselect()
  // and handleAnswered() below.
  const QUESTIONS_IE2026 = [
    ...RIASEC_QUESTIONS,
    ...CYCLE_QUESTION_IE2026,
    SUBJECT_PICKER_QUESTION_IE2026,
    ...HOBBY_QUESTION_IE2026,
    ...SECTOR_QUESTION_IE2026,
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
      footer: "Job data compiled from the SOLAS National Skills Bulletin 2025, Ireland's Critical Skills Occupations List (DETE, effective 13 May 2026), the EGFSN's Skills for Biopharma and Skills for Zero Carbon reports, the Fáilte Ireland Tourism Careers Research 2025 Update, the Build Up Skills Ireland 2030 report, apprenticeship.ie/National Apprenticeship Office data, 2025/2026 CAO points, and public pay scales (HSE, ASTI, An Garda Síochána). Subjects are drawn from NCCA's Junior Cycle and Leaving Certificate subject lists (2025/26); hobbies and sector interests are light extra signals, not a strict job filter. Matching combines Holland's RIASEC interest model with Leaving Cert/Junior Cycle subject enjoyment, your hobbies, which fields genuinely interest you, and your preferred after-school pathway — treat your results as exploration anchors for further research with a guidance counsellor, not a verdict."
    }
  };

  const state = {
    market: "us",
    questions: MARKETS.us.questions,
    total: MARKETS.us.questions.length,
    index: 0,
    insertedSubjectCount: 0, // how many dynamically-built subject questions are currently spliced in
    likertAnswers: {},   // question index -> value 1-5
    lifestyleAnswers: {} // key -> value (also holds multiselect answers as arrays)
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
    brandToggle: document.getElementById("brand-toggle"),
    brandLabel: document.getElementById("brand-label"),
    retroCloseBtn: document.getElementById("retro-close-btn"),
  };

  function showScreen(name) {
    Object.values(screens).forEach((s) => s.classList.remove("active"));
    screens[name].classList.add("active");
  }

  // ---------- Retro "SureFind 2000" skin toggle ----------

  function applyRetroSkin(on) {
    document.documentElement.setAttribute("data-skin", on ? "retro" : "default");
    if (els.brandLabel) {
      els.brandLabel.textContent = on ? "SureFind 2000" : "Suretofind";
    }
    if (els.brandToggle) {
      els.brandToggle.setAttribute("aria-pressed", on ? "true" : "false");
      els.brandToggle.setAttribute(
        "aria-label",
        on ? "Toggle off SureFind 2000 style" : "Toggle retro SureFind 2000 style"
      );
    }
    try {
      localStorage.setItem("suretofindRetroSkin", on ? "1" : "0");
    } catch (e) {
      /* localStorage unavailable — skin still applies for this visit */
    }
  }

  function toggleRetroSkin() {
    const isRetro = document.documentElement.getAttribute("data-skin") === "retro";
    applyRetroSkin(!isRetro);
  }

  if (els.brandToggle) {
    els.brandToggle.addEventListener("click", toggleRetroSkin);
    els.brandToggle.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleRetroSkin();
      }
    });
  }
  if (els.retroCloseBtn) {
    els.retroCloseBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      applyRetroSkin(false);
    });
  }

  (function initRetroSkin() {
    let saved = null;
    try {
      saved = localStorage.getItem("suretofindRetroSkin");
    } catch (e) {
      /* ignore */
    }
    if (saved === "1") applyRetroSkin(true);
  })();

  // ---------- Navigation ----------

  els.marketBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      state.market = btn.dataset.market;
      // Copy the base array — Ireland 2026/27 splices questions in and
      // out as it's answered, and that must never mutate the shared
      // MARKETS[...].questions array itself (or a retake would reuse
      // whatever got spliced during the previous attempt).
      state.questions = [...MARKETS[state.market].questions];
      state.total = state.questions.length;
      state.index = 0;
      state.insertedSubjectCount = 0;
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
    heading.textContent = q.dynamicCatalog ? subjectPickerHeading() : q.text;
    els.questionWrap.appendChild(heading);

    if (q.type === "multiselect") {
      renderMultiselectQuestion(q);
      nudgeCompass();
      return;
    }

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
          handleAnswered(q);
          setTimeout(goNext, 180);
        });
        optionsWrap.appendChild(btn);
      });
    }

    els.questionWrap.appendChild(optionsWrap);
    nudgeCompass();
  }

  function subjectPickerHeading() {
    return state.lifestyleAnswers.cycle === "junior"
      ? "Pick the Junior Cycle subjects you're taking this year."
      : "Pick the Leaving Cert subjects you're taking this year.";
  }

  // Renders a grouped (or flat, if options carry no .group) chip list
  // plus a Continue button — multiselect questions don't auto-advance
  // like likert/choice ones, since the user needs to pick several.
  function renderMultiselectQuestion(q) {
    const options = q.dynamicCatalog ? catalogForCycle(state.lifestyleAnswers.cycle) : q.options;
    const selected = new Set(state.lifestyleAnswers[q.key] || []);

    if (q.hint) {
      const hint = document.createElement("p");
      hint.className = "multiselect-hint";
      hint.textContent = q.hint;
      els.questionWrap.appendChild(hint);
    }

    const wrap = document.createElement("div");
    wrap.className = "multiselect-wrap";

    let currentGroup;
    let groupList;
    options.forEach((opt) => {
      if (opt.group !== currentGroup) {
        currentGroup = opt.group;
        const groupHeading = document.createElement("p");
        groupHeading.className = "multiselect-group";
        groupHeading.textContent = currentGroup;
        wrap.appendChild(groupHeading);
        groupList = document.createElement("div");
        groupList.className = "multiselect-list";
        wrap.appendChild(groupList);
      } else if (!groupList) {
        groupList = document.createElement("div");
        groupList.className = "multiselect-list";
        wrap.appendChild(groupList);
      }

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "multiselect-btn" + (selected.has(opt.id) ? " selected" : "");
      btn.textContent = opt.label;
      btn.addEventListener("click", () => {
        if (selected.has(opt.id)) {
          selected.delete(opt.id);
        } else {
          selected.add(opt.id);
        }
        btn.classList.toggle("selected");
      });
      groupList.appendChild(btn);
    });

    els.questionWrap.appendChild(wrap);

    const continueBtn = document.createElement("button");
    continueBtn.type = "button";
    continueBtn.className = "btn-primary multiselect-continue";
    continueBtn.textContent = "Continue";
    continueBtn.addEventListener("click", () => {
      continueMultiselect(q, Array.from(selected));
    });
    els.questionWrap.appendChild(continueBtn);
  }

  // Side effects that run right after a choice question is answered.
  // Ireland 2026/27's "cycle" question controls whether the subject
  // picker even appears next.
  function handleAnswered(q) {
    if (state.market !== "ie2026" || q.key !== "cycle") return;

    const cycle = state.lifestyleAnswers.cycle;
    const pickerIndex = state.index + 1;
    const hasPicker = state.questions[pickerIndex] === SUBJECT_PICKER_QUESTION_IE2026;

    if (cycle === "none") {
      if (hasPicker) {
        state.questions.splice(pickerIndex, 1);
        state.total -= 1;
      }
      if (state.insertedSubjectCount > 0) {
        state.questions.splice(pickerIndex, state.insertedSubjectCount);
        state.total -= state.insertedSubjectCount;
        state.insertedSubjectCount = 0;
      }
    } else if (!hasPicker) {
      state.questions.splice(pickerIndex, 0, SUBJECT_PICKER_QUESTION_IE2026);
      state.total += 1;
    }
  }

  // Handles a multiselect's Continue click: records the selection, and
  // for the subject picker specifically, (re)builds and splices in the
  // matching subject-enjoyment questions right after it.
  function continueMultiselect(q, selectedIds) {
    state.lifestyleAnswers[q.key] = selectedIds;

    if (q.key === "subjects") {
      const removed = state.insertedSubjectCount || 0;
      if (removed > 0) {
        state.questions.splice(state.index + 1, removed);
        state.total -= removed;
      }
      const newQuestions = buildSubjectQuestions(state.lifestyleAnswers.cycle, selectedIds);
      if (newQuestions.length) {
        state.questions.splice(state.index + 1, 0, ...newQuestions);
        state.total += newQuestions.length;
      }
      state.insertedSubjectCount = newQuestions.length;
    }

    goNext();
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
    music: "Music",
    pe: "Physical Education",
  };

  const PATHWAY_LABELS = {
    degree: "CAO / third-level degree",
    apprenticeship: "Earn-while-you-learn apprenticeship",
    plc: "PLC / QQI course",
    multiple: "Multiple routes in — degree, apprenticeship, or PLC",
    none: "Direct entry — no formal course required",
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

  // Subject-enjoyment profile — built from whichever dynamically-generated
  // subject questions ended up in state.questions (identified generically
  // by the presence of q.subjectKeys, so this doesn't need to know which
  // specific subjects were picked). Empty for a student not currently in
  // school, or on markets that don't ask about subjects at all.
  function computeSubjectProfile() {
    const profile = {};
    state.questions.forEach((q, i) => {
      if (q.type === "likert" && q.subjectKeys) {
        const val = state.likertAnswers[i] || 3;
        const norm = (val - 1) / 4; // normalize to 0..1
        q.subjectKeys.forEach((key) => {
          profile[key] = norm;
        });
      }
    });
    return profile;
  }

  function subjectAlignment(job, subjectProfile) {
    if (!job.subjects || !job.subjects.length) return 0.7;
    // 0.5 (neutral) for a subject the student never rated — they either
    // didn't pick it or it wasn't offered — rather than a lean-positive
    // guess, so jobs resting on niche unrated subjects don't get an
    // automatic, unearned boost over jobs the student actually rated.
    const vals = job.subjects.map((s) => (s in subjectProfile ? subjectProfile[s] : 0.5));
    return vals.reduce((sum, v) => sum + v, 0) / vals.length;
  }

  // Sector-interest alignment — a direct signal on top of RIASEC/subject/
  // hobby math. Several sectors (e.g. hospitality, trades, care work)
  // share similar Realistic/Artistic/Social vectors, so a student who's
  // never expressed interest in a sector can still cosine-match a job
  // in it. This pulls those down (and pulls genuinely-picked sectors
  // up) using the job's own `category` field.
  function sectorAlignment(job) {
    const selected = state.lifestyleAnswers.sectors || [];
    if (!selected.length) return 0.65; // no opinion given — stay neutral
    const selectedCategories = new Set();
    selected.forEach((id) => {
      const opt = SECTOR_OPTIONS_IE2026.find((o) => o.id === id);
      if (opt) opt.categories.forEach((c) => selectedCategories.add(c));
    });
    return selectedCategories.has(job.category) ? 1 : 0.25;
  }

  // Hobby profile — a light extra signal blended alongside RIASEC
  // interest, not a standalone job filter. Returns null when the
  // student picked no hobbies, so callers can fall back to a neutral
  // score that doesn't distort the ranking.
  function computeHobbyProfile() {
    const selected = state.lifestyleAnswers.hobbies || [];
    if (!selected.length) return null;

    const profile = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    selected.forEach((id) => {
      const vec = HOBBY_RIASEC_IE2026[id];
      if (!vec) return;
      TRAITS.forEach((t) => {
        profile[t] += vec[t] || 0;
      });
    });
    TRAITS.forEach((t) => {
      profile[t] = profile[t] / selected.length;
    });
    return profile;
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
      // A "none" pathway (direct entry, no formal course) doesn't
      // conflict with any after-school plan — someone could work that
      // job alongside or before a degree/apprenticeship/PLC just as
      // easily as a "multiple"-route job.
      if (
        a.pathway === "open" ||
        job.pathway === "multiple" ||
        job.pathway === "none" ||
        a.pathway === job.pathway
      ) {
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
    const isIe2026 = state.market === "ie2026";
    const subjectProfile = isIe2026 ? computeSubjectProfile() : null;
    const hobbyProfile = isIe2026 ? computeHobbyProfile() : null;

    const scored = market.jobs.map((job) => {
      const interestScore = cosineSim(profile, job.riasec); // 0..1
      const lifestyleScore = lifestyleAlignment(job); // 0..1
      let finalScore;
      if (subjectProfile) {
        const subjectScore = subjectAlignment(job, subjectProfile); // 0..1
        // A neutral 0.65 keeps every job's score equally unaffected when
        // no hobbies were picked, rather than distorting the ranking.
        const hobbyScore = hobbyProfile ? cosineSim(hobbyProfile, job.riasec) : 0.65;
        const sectorScore = sectorAlignment(job); // 0..1
        finalScore =
          interestScore * 0.35 +
          subjectScore * 0.15 +
          hobbyScore * 0.08 +
          sectorScore * 0.22 +
          lifestyleScore * 0.2;
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
