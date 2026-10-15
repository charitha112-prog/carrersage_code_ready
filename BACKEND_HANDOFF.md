# CareerSage implementation handoff

The supplied folder was a frontend prototype and contained no backend service. Its browser-local account/password demo has been replaced with integrated API-backed registration, sign-in, session revocation, resume processing, dashboard data, interview questions, answer feedback, and progress history.

Use `docker compose up --build` for a single-origin deployment, or follow the separate API/UI development instructions in `README.md`. Keep the configured data volume persistent; SQLite stores user accounts, resume text/analysis, session hashes, and practice answers.

The starter model is deterministic and local: vocabulary extraction plus TF-IDF cosine similarity against five role skill profiles. The answer coach is heuristic. No external AI account/key, proprietary dataset, live labor-market API, or OCR service is configured. See `docs/ARCHITECTURE.md`, `docs/EVALUATION.md`, and `docs/TESTING.md` before making claims about coverage or accuracy.

Do not deploy with default wildcard CORS for a separate frontend, ephemeral storage, or without HTTPS, backups, rate limits, and a privacy/retention policy. For multiple service instances or higher concurrency, replace SQLite with a managed database. The repository has no team roster, so `docs/CONTRIBUTIONS.md` deliberately does not invent individual names or work history.
