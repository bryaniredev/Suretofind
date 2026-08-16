# Suretofind

A short questionnaire that matches your interests and working style to today's
most in-demand jobs — no sign-up, nothing stored, just your results.

**[Live site →](https://bryaniredev.github.io/Suretofind/)**

## How it works

1. Pick your job market — **United States** or **Ireland**.
2. You answer 24 quick interest questions based on **Holland's RIASEC model**
   (Realistic, Investigative, Artistic, Social, Enterprising, Conventional) —
   the same framework behind the U.S. Department of Labor's O\*NET Interest
   Profiler.
3. You answer 6 lifestyle questions (education tolerance, remote vs. on-site,
   indoor vs. outdoor, solo vs. team, structure vs. flexibility, and risk
   appetite).
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
5. You get your top 6 matches, each with salary range, education path, growth
   outlook, and key skills.

Matching combines a cosine-similarity score across the six RIASEC dimensions
(68% of the final score) with a lifestyle-alignment score across the six
lifestyle axes (32% of the final score). Everything runs client-side — no
backend, no accounts, no data collection.

## Project structure

```
index.html           Page shell — market select, quiz, and results screens
style.css             Visual design (compass / wayfinding theme)
app.js                Market selection, question flow, scoring, and results rendering
jobs-data.js          30-job US dataset with RIASEC weights and metadata
jobs-data-ie.js        28-job Ireland dataset with RIASEC weights and metadata
questions-data.js     24 RIASEC items + 6 lifestyle questions (shared across markets)
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

## Disclaimer

This is a starting point for career exploration, not professional or
financial advice. Salary and growth figures are national estimates for the
selected market and vary by region, employer, and experience.
