# CareerSage MVP demo run sheet

## Four-minute walkthrough

1. **Landing and account (30 sec):** create a fresh test account; point out that the browser receives only a session token and public profile.
2. **Resume analysis (60 sec):** select “Try a sample resume,” drag it into the hoop, then show detected skills and ranked roles.
3. **Dashboard (45 sec):** review account-specific resume score, skill matches, role suggestions, and next steps.
4. **Interview practice (60 sec):** start an interview, submit a short written answer, and show the rubric feedback.
5. **Progress and deployment (45 sec):** show saved attempt history and explain the single-container launch with a persistent data volume.

## Presenter notes

- Use only a synthetic demo account and the bundled sample resume.
- Describe the role matcher as local TF-IDF cosine similarity against five role profiles. Do not call it a trained LLM or present five synthetic examples as a real-world accuracy benchmark.
- The question list is curated starter content. No live company, jobs, or external AI API is configured.
- The answer evaluation is a deterministic coaching heuristic; it is not validated against interviewers.
- The checked-in folder did not include a contributor roster or work history. Add verified individual names and module assignments before using this deck for a team-credit presentation.
- Container/cloud hosting was not launched on the test host because Docker was unavailable. The local API and production frontend build were exercised.
