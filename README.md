# Suretofind

A short questionnaire that matches your interests and working style to today's
most in-demand jobs — no sign-up, nothing stored, just your results.

**[Live site →](https://bryaniredev.github.io/Suretofind/)**

## How it works

1. Pick your job market — **United States**, **Ireland**, or **Ireland
   2026/27** (a student-focused edition, see below).
2. You answer 24 quick interest questions based on **Holland's RIASEC model**
   (Realistic, Investigative, Artistic, Social, Enterprising, Conventional) —
   the same framework behind the U.S. Department of Labor's O\*NET Interest
   Profiler and CareersPortal.ie's Interest Profiler.
3. You answer a handful of lifestyle questions (remote vs. on-site, indoor
   vs. outdoor, solo vs. team, structure vs. flexibility, risk appetite, and
   an education/pathway preference).
4. Your answers are scored against a market-specific job dataset:
   - **United States** (30 jobs) — compiled from the U.S. Bureau of Labor
     Statistics *Occupational Outlook Handbook* (2024–2034 projections),
     LinkedIn "Jobs on the Rise" 2026, and the World Economic Forum *Future
     of Jobs Report 2025*.
   - **Ireland** (28 jobs) — compiled from Ireland's Critical Skills
     Occupations List 2026 (Department of Enterprise, Tourism and
     Employment), the CSO Labour Force Survey, the Morgan McKinley Ireland
     Salary Guide 2026, the Expert Group on Future Skills Needs (EGFSN), and
     sector salary guides from Excel Recruitment and Fáilte Ireland.
   - **Ireland 2026/27** (91 jobs) — a version built for Irish secondary
     students, adapting to the real Junior Cycle and Leaving Certificate
     subject lists and adding a hobbies signal alongside RIASEC. Compiled
     from the SOLAS National Skills Bulletin 2025 (21st edition), Ireland's
     Critical Skills Occupations List (CSOL, DETE, effective 13 May 2026),
     the EGFSN's *Skills for Biopharma* and *Skills for Zero Carbon*
     reports, the Fáilte Ireland Tourism Careers Research 2025 Update, the
     Build Up Skills Ireland 2030 report, apprenticeship.ie / the National
     Apprenticeship Office (including SIMI motor apprenticeships), the
     Irish Aviation Authority Student Controller Programme, the
     HSE/Department of Health Consolidated Salary Scales (effective 1
     August 2025, with a 1 February 2026 uplift), 2025/2026 CAO points, WRC-
     confirmed Employment Regulation Orders (childcare, security), and
     public pay scales (HSE, ASTI, An Garda Síochána, Met Éireann, Defence
     Forces, Irish Rail). Private-sector figures also draw on Morgan
     McKinley 2026, Glassdoor.ie, Indeed.ie, PayScale, and ERI SalaryExpert
     — these vary between providers and are indicative, Dublin-weighted
     ranges. Spans 21 sectors from Technology & ICT and Healthcare through
     Skilled Trades, Transport & Logistics, Veterinary & Animal Care,
     Creative & Digital, Design & Architecture, Horticulture & Landscaping,
     Property & Real Estate, Politics & Public Life, and Personal Services &
     Retail. Every job lists its CAO points and/or apprenticeship route,
     NFQ level, and the Leaving Cert/Junior Cycle subjects it draws on, so
     results double as subject-choice guidance.
5. You get your top 6 matches, each with salary range, education/pathway
   path, growth outlook, and key skills.

### The Ireland 2026/27 flow, in detail

Rather than asking about a fixed list of subjects, this edition adapts to
each student:

1. **"Which stage of school are you in?"** — Junior Cycle, Senior Cycle, or
   not currently in school.
2. **Pick your subjects** — a multi-select drawn from NCCA's real 2025/26
   subject lists (Curriculum Online): the 15 optional Junior Cycle subjects,
   or all ~39 optional Leaving Certificate (Established) subjects (including
   the new Senior Cycle Redevelopment Tranche 1 subjects, Climate Action and
   Sustainable Development and Drama, Film and Theatre Studies), grouped the
   way the source lists group them. Short courses and the separate LCVP/LCA
   course lists are out of scope. Someone not in school skips this step
   entirely.
3. **Rate how much you enjoy exactly what you picked** — plus Irish,
   English, and Maths, the de facto core subjects almost everyone takes.
   These enjoyment questions are generated on the fly from your selection,
   not asked as one fixed list.
4. **Pick your hobbies** — a multi-select of activities popular with Irish
   teens (GAA/team sports, gaming, content creation, music, art, reading,
   coding, part-time work, volunteering, debating, cooking, fashion,
   outdoors, animals, strategy games, and more), used as a light extra
   signal on top of your RIASEC interest score.
5. The usual lifestyle questions, plus an after-school pathway preference
   (CAO degree / apprenticeship / PLC / open to any). A job needing no
   formal course at all (e.g. retail assistant, cabin crew) is treated as
   compatible with any of these, since it doesn't conflict with a
   student's post-school plans either way.

Matching for the US and Ireland editions combines a cosine-similarity score
across the six RIASEC dimensions (68%) with a lifestyle-alignment score
(32%). The Ireland 2026/27 edition reweights this to RIASEC interest (45%),
subject-enjoyment fit (20%), hobbies (10%), and lifestyle/pathway alignment
(25%), per research on teen career-questionnaire best practice: measure
enjoyment rather than self-rated ability, anchor items in the Irish school
experience, and always surface degree, apprenticeship, and PLC routes side
by side. Everything runs client-side — no backend, no accounts, no data
collection.

## Project structure

```
index.html                  Page shell — market select, quiz, and results screens
style.css                   Visual design (compass / wayfinding theme)
app.js                       Market selection, adaptive question flow, scoring, and results
jobs-data.js                 30-job US dataset with RIASEC weights and metadata
jobs-data-ie.js              28-job Ireland dataset with RIASEC weights and metadata
jobs-data-ie2026.js          91-job Ireland 2026/27 dataset across 21 sectors — adds
                             subjects/pathway/CAO fields
questions-data.js            24 RIASEC items + 6 lifestyle questions (shared: US & Ireland)
questions-data-ie2026.js     Ireland 2026/27's cycle question, Junior Cycle/Leaving Cert subject
                             catalogs + dynamic question builder, hobbies list + RIASEC weights,
                             the shared 5-axis lifestyle bank, and the pathway question
```

## Running locally

No build step required — it's plain HTML/CSS/JS.

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Updating the job data

Labor-market data changes — re-check sources periodically and update the
relevant dataset file:

- **US** (`jobs-data.js`): BLS's Occupational Outlook Handbook (updated each
  August), the WEF Future of Jobs Report, and LinkedIn's Jobs on the Rise
  (published each January).
- **Ireland** (`jobs-data-ie.js`): the Critical Skills Occupations List
  (reviewed periodically by DETE), the CSO Labour Force Survey (quarterly),
  and the Morgan McKinley Ireland Salary Guide (published annually).
- **Ireland 2026/27** (`jobs-data-ie2026.js`): the SOLAS National Skills
  Bulletin (published each October), the CSOL (reviewed roughly twice yearly
  by DETE), CAO points (each August, verify at CAO.ie), apprenticeship.ie,
  and Employment Regulation Orders (re-check whenever the WRC confirms a
  new one — these directly set pay floors for childcare and security roles).

## Disclaimer

This is a starting point for career exploration, not professional, financial,
or guidance-counselling advice. Salary and CAO-points figures are national
estimates/indicative snapshots for the selected market, vary by region,
employer, and year, and — for the Ireland 2026/27 edition especially — should
be treated as an exploration anchor to research further, not a verdict.
Creative and performance-based salary figures in particular reflect small,
highly variable samples and should not be read as reliable income guarantees.
