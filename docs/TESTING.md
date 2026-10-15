# Functional, usability, and performance test plan

## Functional smoke checks

1. `GET /api/health` returns HTTP 200 and `status: ok`.
2. Register a new account, sign in with email and phone, reject a wrong password and duplicate registration, then log out and reject the revoked token.
3. Upload a selectable-text PDF and DOCX; confirm a saved analysis and skill/role fields. Reject empty, oversized, image-only, malformed, and unsupported file types with a clear 4xx response.
4. Read the question dataset with category, company, difficulty, and topic filters; submit an answer and confirm the attempt appears in progress and on the dashboard.
5. Restart the service with its data volume mounted; account and resume analysis remain available.
6. Upload a synthetic DOCX containing GitHub repository URLs and verify they are shown in the dedicated repository section. Also enter additional repository URLs on upload and ensure duplicate/invalid domains are excluded.
7. Add a synthetic resume, then paste a job title, company, description, and optional LinkedIn job URL. Confirm matched/missing skills and score are displayed and saved for that account; reject non-LinkedIn URLs.
8. Check LinkedIn status with no credentials configured (the UI should explain setup is needed). With an approved LinkedIn OIDC app configured, consent, callback, basic profile display, and disconnect can be tested against a test LinkedIn account.

## Usability review

Check the landing, account, upload, analysis, dashboard, practice, and profile paths at desktop and narrow mobile widths. Confirm focusable controls, visible errors, loading/disabled states, no password in browser storage, and that sample resume leads to an actual analysis. Record actual browser/device and findings in `EVALUATION.md`.

## Performance procedure

Measure 30 sequential local health requests after warm-up; record median/p95, environment, and date. Separately time resume analysis with small selectable-text PDF/DOCX fixtures. This is a smoke baseline, not a concurrency/load test. Do not use personal resumes in test records.

## Known limitations to check

- OCR is not included; scanned PDFs return a useful text extraction error.
- Only PDF/DOCX are accepted for backend processing (the UI may also accept `.doc`, which the API rejects clearly).
- SQLite is appropriate for a single-instance MVP, not horizontally scaled multi-instance deployment.
- No live job-market/company API or generative model is configured.
- LinkedIn OIDC requires a registered developer app, enabled OpenID Connect product, and trusted callback URL. Standard profile access returns basic profile fields only; LinkedIn job search is not available to this app. Matching is based on the job description the user pastes.
