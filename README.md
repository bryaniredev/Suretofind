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
   - **Ireland 2026/27** (27 jobs) — a version built for Irish secondary
     students, adding 18 Leaving Cert subject-enjoyment questions and an
     after-school pathway preference (CAO degree / apprenticeship / PLC /
     open to any) alongside RIASEC. Compiled from the SOLAS National Skills
     Bulletin 2025, Ireland's Critical Skills Occupations List (CSOL, DETE,
     effective 13 May 2026), the EGFSN's *Skills for Biopharma* and *Skills
     for Zero Carbon* reports, the Fáilte Ireland Tourism Careers Research
     2025 Update, the Build Up Skills Ireland 2030 report, apprenticeship.ie
     / the National Apprenticeship Office, 2025/2026 CAO points, and public
     pay scales (HSE, ASTI, An Garda Síochána). Every job lists its CAO
     points and/or apprenticeship route, NFQ level, and the Leaving Cert
     subjects it draws on, so results double as subject-choice guidance.
5. You get your top 6 matches, each with salary range, education/pathway
   path, growth outlook, and key skills.

Matching for the US and Ireland editions combines a cosine-similarity score
across the six RIASEC dimensions (68%) with a lifestyle-alignment score
(32%). The Ireland 2026/27 edition reweights this to RIASEC interest (50%),
Leaving Cert subject-enjoyment fit (20%), and lifestyle/pathway alignment
(30%), per research on teen career-questionnaire best practice: measure
enjoyment rather than self-rated ability, anchor items in the Irish school
experience, and always surface degree, apprenticeship, and PLC routes side
by side. Everything runs client-side — no backend, no accounts, no data
collection.

## Project structure

```
index.html                  Page shell — market select, quiz, and results screens
style.css                   Visual design (compass / wayfinding theme)
app.js                       Market selection, question flow, scoring, and results rendering
jobs-data.js                 30-job US dataset with RIASEC weights and metadata
jobs-data-ie.js              28-job Ireland dataset with RIASEC weights and metadata
jobs-data-ie2026.js          27-job Ireland 2026/27 dataset — adds subjects/pathway/CAO fields
questions-data.js            24 RIASEC items + 6 lifestyle questions (shared: US & Ireland)
questions-data-ie2026.js     18 Leaving Cert subject items, 5 lifestyle items, and a pathway
                             question used only by the Ireland 2026/27 edition
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
  by DETE), CAO points (each August), and apprenticeship.ie.

## Disclaimer

This is a starting point for career exploration, not professional, financial,
or guidance-counselling advice. Salary and CAO-points figures are national
estimates/indicative snapshots for the selected market, vary by region,
employer, and year, and — for the Ireland 2026/27 edition especially — should
be treated as an exploration anchor to research further, not a verdict.
