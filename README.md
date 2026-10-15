# CareerSage

CareerSage is a React/Vite career-preparation MVP with a FastAPI backend. The single-container production build serves both the frontend and `/api` from one origin. SQLite data lives in a persistent volume.

## Run the full app with Docker

Install Docker Desktop, then run:

```sh
docker compose up --build
```

Open `http://localhost:8000`. The Compose setup mounts a named volume at `/data`, so accounts, analyses, and practice history survive container restarts. To reset local development data, remove the Compose volume intentionally.

## Run in development mode

Start the API from the project root in one terminal:

```sh
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
pip install -r backend/requirements.txt
python -m uvicorn backend.main:app --reload --port 8000
```

Start the frontend in another terminal:

```sh
npm ci
npm run dev
```

Open the Vite URL it prints. `vite.config.js` proxies API requests to port 8000. The API's interactive schema is at `/docs`.

## Main workflows

- Account registration/sign-in with salted PBKDF2 password hashes and expiring, revocable sessions. Sign-in accepts the registered email, phone (with or without punctuation), or username, plus the same password. New accounts are signed in immediately. Passwords are never saved in the browser; “Remember sign-in ID” remembers only the email, phone, or username, and the session stays signed in for up to seven days unless logged out.
- A visible Logout control in the signed-in header and sidebar. Each account’s resume analysis and interview answers are stored in SQLite; the Docker Compose volume preserves them across container restarts.
- PDF/DOCX text extraction and local skills/role matching (10 MB maximum).
- GitHub repository URLs detected in a resume or supplied during upload are saved and shown in their own resume-analysis section.
- Company/job fit matching compares the latest resume’s skill keywords with a pasted job description. LinkedIn job links are saved as references; listing content is not scraped or fetched.
- Optional LinkedIn OpenID Connect profile connection. It imports only profile details authorized by LinkedIn (name, photo, and optionally email); LinkedIn does not expose resume experience or an open job-search feed through the standard sign-in product.
- Personalized dashboard and saved analysis per account.
- Curated question filters, written interview-answer feedback, and progress history.
- Bundled sample resume for a complete demonstration.

## Project notes

- `docs/ARCHITECTURE.md` describes the components, workflow, endpoints, and deployment limits.
- `docs/EVALUATION.md` records the model smoke result, HTTP checks, and local latency measurement.
- `docs/TESTING.md` has repeatable functional, usability, and performance steps.
- `docs/CONTRIBUTIONS.md` records verified module status and the missing team attribution.
- `docs/DEMO_PRESENTATION.md` is the demo run sheet; the editable presentation deck is in `docs/CareerSage-MVP-final-delivery.pptx`.

## MVP boundaries

Role matching is a small interpretable TF-IDF cosine and skill-vocabulary baseline. Company/job matching is rule-based skill overlap against the description supplied by the user, not a live recommendation feed. To enable LinkedIn profile connection, create an app in the LinkedIn Developer Portal, add the Sign in with LinkedIn using OpenID Connect product, and configure `LINKEDIN_CLIENT_ID`, `LINKEDIN_CLIENT_SECRET`, and `LINKEDIN_REDIRECT_URI` in the backend environment. Register the exact callback URL with LinkedIn; use an HTTPS callback for hosted deployments. In Compose, these values can be supplied from a local `.env` file (never commit secrets). Without credentials, resume analysis and pasted-description matching continue to work and the profile page explains the missing setup. LinkedIn job access is restricted; CareerSage does not scrape LinkedIn pages. Scanned PDFs are not OCR'd. SQLite supports this single-instance demo; use a managed database and review security/privacy controls before production deployment.
