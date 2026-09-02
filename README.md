# RecruitFlow AI™ - Internship MVP: AI Candidate Screening & Resume Intake Platform

An **internship-level AI recruitment screening MVP** built for automated candidate intake, resume extraction (PDF/DOCX/TXT), Gemini API screening, and live recruiter pipeline management.

---

## 🎯 Problem & Solution

- **The Problem**: Manual recruitment candidate intake is slow, inconsistent, and often loses qualified candidates due to delays in initial screening and resume review.
- **The Solution**: RecruitFlow AI™ provides a conversational chatbot assistant that collects candidate details, extracts resume text directly in the browser (using PDF.js and Mammoth.js), screens candidate qualifications against job criteria using Gemini AI, and syncs candidate records into an interactive recruiter dashboard with human handoff safeguards.

---

## ✨ Core Features

1. **Conversational Intake Chatbot**:
   - Single-question step-by-step workflow: Name, Email (with validation), Target Role, Experience level, Key skills, Location, Work Mode, Availability.
   - Summary confirmation step before screening execution.
2. **Real Resume Text Parsing**:
   - **PDF**: Genuine browser text extraction via PDF.js (`pdfjsLib`).
   - **DOCX**: Genuine browser text extraction via Mammoth.js (`mammoth`).
   - **TXT**: Native text reader.
   - Handles drag & drop, file picker, 5MB size limits, format validation, and image-only PDF warning.
3. **Gemini AI Screening Backend**:
   - Express server endpoint `POST /api/screen-candidate` using `GEMINI_API_KEY`.
   - **Responsible AI Prompt Rules**: Evaluates strictly on job-relevant qualifications; ignores protected characteristics (race, gender, age, religion, disability, etc.); sandbox treats resume text as untrusted candidate data.
   - Returns structured JSON: match score (0–100), status, strengths, matched skills, skill gaps, and assessment rationale.
   - Enforces status thresholds in application logic:
     - Score >= 75 → `Qualified`
     - Score 50–74 → `Needs Review`
     - Score < 50 → `Not a Fit`
   - **Explicit Error & Retry UX**: If `GEMINI_API_KEY` is missing or API fails, displays clear user-friendly error with **Retry** button without silently fabricating simulated AI results.
4. **Recruiter Pipeline Dashboard**:
   - Starts clean with **zero fake candidates** and a professional empty pipeline state (*"Your pipeline is ready. Candidates will appear here after completing screening."*).
   - Real-time metric counters calculated from actual candidate records.
   - Table view and Kanban board view.
   - Search filter, status filter, role filter, score sorting, newest/oldest sorting.
   - Candidate details modal displaying actual extracted resume text, Gemini AI breakdown, recruiter notes with auto-save, status overrides, and CSV export.
5. **Human Handoff Safeguard**:
   - Intent detection for out-of-scope candidate inquiries (e.g. salary negotiation, equity, request for human recruiter call).
   - Flags candidate as `Handoff Requested` with timestamp and reason, alerting recruiters on the dashboard with a **Resolve Handoff** action button.

---

## 🏗️ Architecture & Stack

- **Frontend**: HTML5, CSS3 (Tailwind CSS CDN + FontAwesome icons), Vanilla JavaScript (ES6+).
- **Client Libraries**: PDF.js (v3.11) & Mammoth.js (v1.6).
- **Backend**: Express.js server (`server.js`) on port 3001.
- **AI Model**: Google Gemini API (`gemini-1.5-flash` / `gemini-2.5-flash` / `gemini-2.0-flash`).
- **Data Persistence**: Client LocalStorage API (`StorageService`) with safe `recruitflow_data_version_v2` migration.

---

## 🚀 Setup & Execution Instructions

### 1. Install Server Dependencies
```bash
npm install
```

### 2. Configure Gemini API Key
Create a `.env` file in the project root:
```env
PORT=3001
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

### 3. Run Backend Server
```bash
npm start
```
*Server will start listening on `http://localhost:3001`.*

### 4. Run / Open Frontend
Open `index.html` directly in your browser or run a simple local web server:
```bash
npx --yes serve . -p 3000
```
Open `http://localhost:3000` in your web browser.

---

## 🔒 Security & Responsible AI

- API keys are stored exclusively in backend environment variables (`GEMINI_API_KEY`) and are never exposed in client JavaScript.
- Uploaded file size is capped at 5MB.
- Privacy notice rendered on intake: *"Candidate information and resume content are processed strictly for recruitment screening purposes."*
- Gemini system prompt explicitly sandbox-isolates untrusted resume input to prevent prompt injection.

---

## 🏢 Production Deployment Considerations

While this MVP is built for internship demonstration with client LocalStorage persistence and Express backend API, a full production deployment at an enterprise recruitment agency would require:

1. **Persistent Database**: PostgreSQL / MongoDB / Supabase database for persistent candidate records across multiple recruiter devices.
2. **ATS Integration**: Webhooks and API integrations with platforms like Greenhouse, Lever, or Workday.
3. **Recruiter Authentication**: Multi-tenant RBAC (Role-Based Access Control) authentication via OAuth2 / Auth0 for hiring managers and recruiters.
4. **Interview Scheduling**: Integration with Google Calendar / Outlook APIs (e.g., Calendly) for automated interview booking.
5. **Email Automation**: SMTP / SendGrid email workflow triggers for sending automated invitation links or status updates.
6. **Enhanced Privacy & Audit Logging**: GDPR / CCPA compliance data deletion endpoints and full recruiter activity audit logs.
