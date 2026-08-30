# RecruitFlow AI™ - AI Candidate Screening Chatbot & Pipeline Dashboard

A modern, production-grade **AI Candidate Screening Chatbot & Resume Intake Platform** built for recruitment agencies.

## Core Features Delivered

1. **Conversational AI Screening Chatbot**:
   - Gathers candidate basics in natural dialog: full name, email, target role, experience level, key skills, location preference, work mode (Remote/Hybrid/Onsite), availability, and salary targets.
2. **Resume Intake & Text Parser**:
   - Integrated file upload (`.txt`, `.pdf`, `.docx`) or structured summary input directly inside the chat workflow.
3. **Automated AI Screening & Scoring Engine**:
   - Evaluates applicant qualifications against team-configurable role criteria.
   - Calculates objective match score (0–100%).
   - Flags candidate into status categories: `Qualified` (≥75%), `Needs Review` (50-74%), or `Not a Fit` (<50%).
   - Highlights matching strengths, skill gaps, and screening rationale.
4. **Recruiter Candidate Pipeline Dashboard**:
   - Real-time pipeline counters (Total Applicants, Qualified, Needs Review, Not a Fit, Handoff Pending).
   - Table view & Kanban board view.
   - Filter by status, role, search by keyword/skill/name.
   - Candidate detail modal with full resume text, AI score breakdown, recruiter notes, status toggles, and CSV export.
5. **Human Handoff Safeguard**:
   - Detects out-of-scope inquiries (e.g. salary negotiation, equity, custom questions, request for human call).
   - Smoothly provides automated follow-up assurance while flagging candidate as `Handoff Requested` on the recruiter dashboard.

---

## Architectural & Workflow Summary

> **Architectural Summary Paragraph**:
> "RecruitFlow AI™ unifies conversational candidate screening, automated resume intake, and pipeline routing into a seamless event-driven architecture. As candidates interact with the screening chatbot, their role preferences, experience level, availability, location, and uploaded resume text are ingested and processed by a rule-based AI screening engine. The engine evaluates candidate attributes against team-configured role criteria, calculating an objective match score (0–100%) and categorizing candidates into three distinct status buckets: **Qualified** (≥75% match), **Needs Review** (50–74% match), or **Not a Fit** (<50% match). If a candidate poses inquiries beyond standard screening parameters, the system triggers an automated human handoff mechanism, alerting recruiters on the live pipeline dashboard while assuring the candidate of prompt recruiter follow-up."

---

## Technical Stack & Execution

- **Tech Stack**: HTML5, CSS3 (Tailwind CSS CDN + FontAwesome icons), Vanilla JavaScript (ES6+).
- **Data Persistence**: `LocalStorage` API with `StorageService`.
- **Zero Build Dependencies**: Runs natively in any web browser without needing `npm install` or complex build tools.

## How to Run

1. Open `index.html` directly in any web browser (Google Chrome, Microsoft Edge, Safari, Firefox) or start a local HTTP server:
   ```bash
   npx serve .
   ```
2. Open `http://localhost:3000` (or local file path) to interact with the landing page, live screening chatbot demo, recruiter pipeline dashboard, and walkthrough guide.
