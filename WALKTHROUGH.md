# RecruitFlow AI™ - 60–90 Second Demo Walkthrough Script & Architecture

This document details the step-by-step 60–90 second walkthrough script and accurate architecture description for **RecruitFlow AI™**.

---

## 🏛️ Accurate Architecture Description

> **System Architecture**:
> *"RecruitFlow AI uses Gemini to evaluate candidate qualifications against configurable role criteria and returns a structured, explainable screening result. Application logic validates the AI output and enforces the required score thresholds: Qualified (>=75), Needs Review (50–74), and Not a Fit (<50)."*

---

## Video Walkthrough Timeline

### 🎬 Scene 1: Agency Landing Page & Candidate Intake (0:00 - 0:20)
- **Visual**: Screen opens on the **RecruitFlow AI™ Landing Page**. Click **"Start Screening Demo"** to scroll down to the embedded live chatbot widget.
- **Action**: Type candidate details:
  - Name & Email: `Sarah Jenkins, sarah.jenkins@example.com`
  - Target Role: `Senior Frontend Engineer`
  - Experience: `5 years`
  - Skills: `React, TypeScript, CSS, REST APIs`
  - Location & Mode: `San Francisco, CA (Hybrid)`
  - Availability: `2 weeks notice`
- **Voiceover**: *"Welcome to RecruitFlow AI™. When a job seeker lands on our recruitment agency portal, our conversational chatbot engages them instantly, capturing their target role, experience level, location, and availability in single-question steps."*

---

### 🎬 Scene 2: Genuine Resume Intake & Gemini AI Screening (0:20 - 0:40)
- **Visual**: The chatbot displays the **Resume Intake** box. Upload a PDF/DOCX/TXT resume (or paste text summary), view the text extraction, confirm the summary card, and click **"Confirm & Run Gemini AI Screening"**.
- **Action**: Observe typing indicator -> Express backend calls Gemini API -> Chatbot displays **"✨ Qualified Candidate (Score: 92%)"** badge, core skill match summary, strengths, skill gaps, and AI rationale.
- **Voiceover**: *"Candidates attach their resume file. In real time, browser parsers extract text and Gemini AI evaluates candidate qualifications against role rules. Application logic enforces score thresholds—here, Sarah scores a 92% match and is flagged as 'Qualified'!"*

---

### 🎬 Scene 3: Human Handoff Safeguard (0:40 - 0:55)
- **Visual**: In the chat box, type: `"Can I speak directly to a human recruiter about equity options?"`
- **Action**: The chatbot detects handoff intent, displays **"🤝 I'll flag this for a recruiter so they can follow up with you"** confirmation message, and flags candidate for recruiter follow-up on the dashboard.
- **Voiceover**: *"If a candidate asks complex out-of-scope questions, the bot gracefully triggers a human handoff safeguard, assuring the applicant while sending an alert to recruiters."*

---

### 🎬 Scene 4: Recruiter Pipeline Dashboard (0:55 - 1:20)
- **Visual**: Click the **"Recruiter Pipeline"** tab. Show the dashboard metrics updating in real time. Click on candidate profile drawer.
- **Action**: Point out match score meter, extracted resume text, strengths breakdown, recruiter notes input box, status override buttons (`Qualified`, `Needs Review`, `Not a Fit`), and **"Resolve Handoff"** button.
- **Voiceover**: *"On the Recruiter Dashboard, hiring managers see real-time metrics across Qualified, Needs Review, and Not a Fit candidates. One-click drawers reveal detailed Gemini AI rationale, extracted resumes, handoff notes, and recruiter status overrides!"*
