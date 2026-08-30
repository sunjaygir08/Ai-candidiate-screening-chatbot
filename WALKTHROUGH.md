# RecruitFlow AI™ - 60–90 Second Demo Walkthrough Script

This document details the step-by-step 60–90 second walkthrough script for demonstrating Task 2: **AI Candidate Screening Chatbot + Resume Intake + Recruiter Pipeline Dashboard**.

---

## Video Walkthrough Timeline

### 🎬 Scene 1: Agency Landing Page & Conversational Intake (0:00 - 0:20)
- **Visual**: Screen opens on the **RecruitFlow AI™ Landing Page**. Click **"Start Screening Demo"** to scroll down to the embedded live chatbot widget.
- **Action**: Type candidate details:
  - Name & Email: `Sarah Jenkins, sarah.jenkins@example.com`
  - Target Role: `Senior Frontend Engineer`
  - Experience & Skills: `5 years exp in React, TypeScript, JavaScript, Tailwind`
  - Location & Mode: `San Francisco, CA (Hybrid)`
  - Availability: `2 weeks notice`
- **Voiceover**: *"Welcome to RecruitFlow AI™. When a job seeker lands on our recruitment agency portal, our conversational chatbot engages them instantly. In under a minute, it collects candidate basics—role interest, experience, location preference, and start date."*

---

### 🎬 Scene 2: Resume Upload & Instant AI Screening (0:20 - 0:40)
- **Visual**: The chatbot displays the **Resume Intake** box. Attach or paste sample resume highlights and click **"Submit & Screen"**.
- **Action**: Observe typing indicator -> AI Screening Engine executes -> Chatbot displays **"✨ Qualified Candidate (Score: 92%)"** badge, core skill match summary, and next step instructions.
- **Voiceover**: *"Candidates simply attach or paste their resume. Instantly, our rule-based AI engine evaluates candidate qualifications against configured role rules. Here, Sarah scores a 92% match, gets tagged as 'Qualified', and receives custom next steps!"*

---

### 🎬 Scene 3: Human Handoff Safeguard Trigger (0:40 - 0:55)
- **Visual**: In the chat box, type: `"Can I speak directly to a human recruiter about equity options?"`
- **Action**: The chatbot detects handoff intent, displays **"🤝 Human Recruiter Handoff Initiated"** confirmation message, and flags candidate for recruiter follow-up.
- **Voiceover**: *"If a candidate asks complex or out-of-scope questions—such as compensation negotiation or custom policies—the bot gracefully triggers a human handoff safeguard, assuring the applicant while sending an alert to recruiters."*

---

### 🎬 Scene 4: Recruiter Pipeline Dashboard & Decisioning (0:55 - 1:20)
- **Visual**: Click the **"Recruiter Pipeline"** tab at the top. Show the dashboard metrics updating in real time (Qualified: 3, Review: 1, Not a Fit: 1, Handoff Pending: 2). Click on **Sarah Jenkins** to open her candidate profile drawer.
- **Action**: Point out match score meter, extracted resume text, strengths breakdown, recruiter notes input box, and status override buttons (`Qualified`, `Needs Review`, `Not a Fit`).
- **Voiceover**: *"On the Recruiter Dashboard, hiring teams see candidate pipelines updated in real time. Opening any profile reveals extracted resume text, AI match score breakdown, strengths vs. gaps, and one-click recruiter decision controls!"*

---

## 🏛️ Architectural Summary Paragraph

> *"RecruitFlow AI™ unifies conversational candidate screening, automated resume intake, and pipeline routing into a seamless event-driven architecture. As candidates interact with the screening chatbot, their role preferences, experience level, availability, location, and uploaded resume text are ingested and processed by a rule-based AI screening engine. The engine evaluates candidate attributes against team-configured role criteria, calculating an objective match score (0–100%) and categorizing candidates into three distinct status buckets: **Qualified** (≥75% match), **Needs Review** (50–74% match), or **Not a Fit** (<50% match). If a candidate poses inquiries beyond standard screening parameters, the system triggers an automated human handoff mechanism, alerting recruiters on the live pipeline dashboard while assuring the candidate of prompt recruiter follow-up."*
