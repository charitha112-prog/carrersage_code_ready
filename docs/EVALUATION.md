# Evaluation results

Run `python backend/evaluate_model.py` to repeat the role-matcher smoke evaluation. The corpus has five hand-written synthetic resumes, one intended label for each role, and reports top-1 accuracy and mean reciprocal rank. Results are not a representative user study or hiring benchmark. The question answer score is a fixed rubric heuristic and has not been validated against human raters.

## Test record — 10 October 2026

Do not treat synthetic fixtures as user data.

| Check | Result | Evidence |
|---|---|---|
| Frontend production build | Pass; Vite 7.3.7, 1,575 modules | `npm run build`; final bundle 284.25 kB JS (86.02 kB gzip), 58.00 kB CSS (12.00 kB gzip) |
| API health/auth/upload/question/answer smoke | Pass | Checked-in smoke script; registration, duplicate/wrong-password rejection, phone sign-in, PDF and DOCX extraction, saved analysis, dashboard, company/topic filters, answer, progress, unsupported type, logout revocation |
| Model labeled smoke set | 5/5 top-1; MRR 1.00 | `python backend/evaluate_model.py`; five hand-written synthetic profiles |
| Browser usability review | Pass for landing → account → sample upload → analysis → dashboard → question bank → answer feedback → updated activity | Chromium in-app browser, ~523 px viewport; sample PDF yielded 9 skills; category filters showed real questions and answer feedback updated progress/activity |
| API response latency (local) | Median 2.60 ms; p95 20.33 ms | 30 sequential `GET /api/health` round-trips using `backend/smoke_test.py` on local Windows test host; single-user, no load |

## Interpretation

No external model, reference labels, accessibility audit, load test, or production hosting environment is available in this project snapshot. Report only measurements reproduced by the checked-in scripts and current local run. Scores are coaching signals, not objective candidate quality measurements.

The HTTP smoke test ran with a temporary local database and synthetic sample accounts. The repeatable API script is `backend/smoke_test.py`; start the app on port 8000 and run `python backend/smoke_test.py` (set `CAREERSAGE_TEST_URL` to override the base URL). The question bank has eight curated records: five technical, two behavioral, and one resume-based. Docker was not installed on the test host, so the container image and cloud deployment were not launched here.

## Added feature validation — 12 October 2026

| Check | Result | Evidence / limits |
|---|---|---|
| Frontend production build and backend syntax | Pass | Vite build completed; Python compilation completed |
| GitHub link extraction and job/company matching | Pass | Isolated temporary SQLite database and synthetic DOCX; extracted resume and supplied GitHub links, produced and persisted an 80% match with 4/5 listed skills present |
| LinkedIn readiness | Configuration gate verified | Profile status reports not configured without credentials; end-to-end OAuth cannot be exercised until a LinkedIn Developer app enables OIDC and supplies a registered redirect URL |

The LinkedIn connection imports only the basic profile authorized by OIDC. LinkedIn job listings are not retrieved; users provide job descriptions and CareerSage compares their detected skill keywords with the latest resume. The synthetic match score is a functional check, not a validated accuracy metric.
