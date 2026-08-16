# Suretofind

A short questionnaire that matches your interests and working style to today's
most in-demand jobs — no sign-up, nothing stored, just your results.

**[Live site →](https://bryaniredev.github.io/Suretofind/)**

## How it works

1. You answer 24 quick interest questions based on **Holland's RIASEC model**
   (Realistic, Investigative, Artistic, Social, Enterprising, Conventional) —
   the same framework behind the U.S. Department of Labor's O\*NET Interest
   Profiler.
2. You answer 6 lifestyle questions (education tolerance, remote vs. on-site,
   indoor vs. outdoor, solo vs. team, structure vs. flexibility, and risk
   appetite).
3. Your answers are scored against a 30-job dataset compiled from:
   - U.S. Bureau of Labor Statistics, *Occupational Outlook Handbook*
     (2024–2034 projections)
   - LinkedIn "Jobs on the Rise" 2026
   - World Economic Forum, *Future of Jobs Report 2025*
4. You get your top 6 matches, each with salary range, education path, growth
   outlook, and key skills.

Matching combines a cosine-similarity score across the six RIASEC dimensions
(68% of the final score) with a lifestyle-alignment score across the six
lifestyle axes (32% of the final score). Everything runs client-side — no
backend, no accounts, no data collection.

## Project structure

```
index.html           Page shell — intro, quiz, and results screens
style.css             Visual design (compass / wayfinding theme)
app.js                Question flow, scoring, and results rendering
jobs-data.js          30-job dataset with RIASEC weights and metadata
questions-data.js     24 RIASEC items + 6 lifestyle questions
```

## Running locally

No build step required — it's plain HTML/CSS/JS.

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Updating the job data

Labor-market data changes — re-check BLS's Occupational Outlook Handbook
(updated each August), the WEF Future of Jobs Report, and LinkedIn's Jobs on
the Rise (published each January), and update `jobs-data.js` accordingly.

## Disclaimer

This is a starting point for career exploration, not professional or
financial advice. Salary and growth figures are US-national estimates and
vary by region, employer, and experience.
