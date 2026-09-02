# RecruitFlow AI™ - Architecture & Deliverables

This document details the accurate architecture description for **RecruitFlow AI™**.

---

## 🏛️ Accurate Architecture Description

> **System Architecture**:
> *"RecruitFlow AI uses Gemini to evaluate candidate qualifications against configurable role criteria and returns a structured, explainable screening result. Application logic validates the AI output and enforces the required score thresholds: Qualified (>=75), Needs Review (50–74), and Not a Fit (<50)."*

---

## Core Components

1. **Conversational Chatbot Intake** — Single-question step-by-step flow collecting name, email, target role, experience, skills, location, work mode, and availability.
2. **Resume Parser** — Browser-side PDF (PDF.js), DOCX (Mammoth.js), and TXT text extraction with drag & drop, 5MB limit, and error handling.
3. **Gemini AI Screening Backend** — Express server (`POST /api/screen-candidate`) calls Gemini API with Responsible AI prompt, returns structured JSON evaluation.
4. **Score & Status Enforcement** — Application logic enforces: `>=75` → Qualified, `50–74` → Needs Review, `<50` → Not a Fit.
5. **Human Handoff Safeguard** — Detects out-of-scope candidate queries, flags candidate for recruiter follow-up on the dashboard.
6. **Recruiter Pipeline Dashboard** — Real-time metrics, search/filter/sort, candidate detail modal, recruiter notes, status overrides, CSV export, and handoff resolution.
