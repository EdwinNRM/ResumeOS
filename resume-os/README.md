# ResumeOS

> A minimal ATS-first resume operating system.

ResumeOS is not just a resume builder.
It is a structured writing environment designed to help developers craft resumes with clarity, performance and intent.

Built around a plain-structured architecture, ResumeOS removes visual noise and focuses on what actually matters: semantic structure, readability and ATS compatibility.

---

## ✨ Philosophy

Most tools treat resumes like documents.
ResumeOS treats them like systems.

* Minimal by design
* Structured like code
* Local-first and loginless
* Built for developers

No accounts.
No clutter.
No distractions.

---

## 🧠 Features

* Notion-style block editor
* Plain structured resume schema
* Live ATS-friendly preview
* Secure local-first workflow
* Fast PDF export
* Soft minimal interface

---

## 🧱 Architecture

ResumeOS follows a monorepo structure:

```
resume-os/
  web/      → React + Zustand + Tailwind
  api/      → FastAPI export & ATS engine
  shared/   → schema, validation and ATS rules
```

Key principles:

* Single source of truth (shared schema)
* Renderer-first preview architecture
* Security by design
* Zero heavy editor dependencies

---

## 🔐 Security

ResumeOS was designed with safety as a core requirement:

* Local-first storage
* Schema validation on frontend and backend
* Sanitized rendering pipeline
* No raw HTML injection
* Stateless API design

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **Python** (v3.10 or higher)

### Installation

Clone the repository:

```bash
git clone git@github.com:EdwinNRM/ResumeOS.git
cd resume-os
```

### Running the Application

You will need to run the **Backend** and **Frontend** in separate terminal windows.

#### 1. Backend (FastAPI)

Open your first terminal:

```bash
cd resume-os/api

# Create a virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the server
uvicorn app.main:app --reload --port 8000
```

- API Base URL: `http://localhost:8000`
- API Documentation: `http://localhost:8000/docs`

#### 2. Frontend (React)

Open a **new** terminal window:

```bash
cd resume-os/web

# Install dependencies
npm install

# Start the development server
npm run dev
```

- App URL: `http://localhost:5173`

### Troubleshooting

- **CORS Errors**: Ensure the backend is running on port 8000 and the frontend on port 5173. If you use different ports, update `api/app/security/resume_security_headers.py`.
- **Export Failed**: Make sure the backend terminal is running without errors.

---

## 🧩 Roadmap

* [x] Core architecture
* [x] Block editor engine
* [x] ATS rule engine
* [x] PDF export pipeline
* [ ] UI refinement

---

## 💡 Vision

ResumeOS exists to change how technical resumes are built.

Less decoration.
More structure.
More clarity.

Build resumes like a system — not a document.
