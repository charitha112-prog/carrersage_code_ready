# Module progress and contributions

The source snapshot contains no contributor roster, issue history, or individual attribution. This table records verifiable module status without assigning work to named people. Add the actual team member names and reviewed contributions before presenting this as an individual-contribution record.

| Module | Status | Contribution evidence |
|---|---|---|
| React/Vite screens and visual design | Existing prototype retained; API integration added | `src/main.jsx`, `src/api.js`, `src/styles.css` |
| Authentication and persistence | MVP implemented | `backend/main.py` (SQLite, PBKDF2, revocable sessions) |
| Resume processing, project links, and role matching | MVP implemented; baseline only | PDF/DOCX extraction, GitHub link section, skill rules and TF-IDF cosine matcher |
| Company/job matching | MVP implemented; user-supplied job descriptions | Persisted skill-overlap score against the latest resume; LinkedIn URL retained as a reference |
| LinkedIn profile connection | OAuth/OIDC integration implemented; requires app credentials and LinkedIn product access | Consent-based import of basic profile details; LinkedIn job search is not available to this app |
| Interview dataset and answer scoring | MVP implemented; starter content | `backend/questions.json`, answer rubric endpoint |
| Deployment | Single container and Compose setup | `Dockerfile`, `docker-compose.yml` |
| Evaluation and documentation | Scripts and handoff docs added; measured record completed at release | `docs/` |

## Individual contributors

Not recoverable from the supplied folder. Do not attribute modules to people without confirmation from the project team.
