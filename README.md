# UniTracker — Germany University Application Tracker & Admissions Roadmap 🇩🇪

[![Live Website](https://img.shields.io/badge/Live_Site-unitracker.live-emerald?style=for-the-badge&logo=googlechrome&logoColor=white)](https://unitracker.live)
[![License: MIT](https://img.shields.io/badge/License-MIT-black?style=for-the-badge)](LICENSE)
[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring&logoColor=white)](https://spring.io/projects/spring-boot)

> **Say goodbye to messy Excel sheets.** UniTracker is a free, all-in-one web platform built specifically for international students applying for Bachelor's and Master's degrees in Germany.

🌐 **Try it Live:** [https://unitracker.live](https://unitracker.live)  
🧮 **German Grade Calculator:** [https://unitracker.live/grade-calculator](https://unitracker.live/grade-calculator)

---

## 🚀 Why UniTracker?

Applying to German public universities is notoriously complex — juggling **Uni-Assist VPD**, **APS verification certificates**, differing **winter/summer deadlines**, **ECTS module handbooks**, and **Blocked Accounts**.

UniTracker brings clarity to your entire admission journey:
- **Never miss a deadline:** Automated 15-day and 10-day email alerts sent straight to your inbox.
- **Know where you stand:** Calculate your German Bavarian grade and view university admission readiness.
- **End-to-end guidance:** A step-by-step interactive roadmap from IELTS to VFS German Student Visa.
- **Complete data privacy:** Works seamlessly as a guest with local storage or sign in with Clerk to sync across all devices.

---

## ✨ Key Features

### 🧮 1. Modified Bavarian Formula Grade Calculator
- Converts international grades (Indian 10-point CGPA, Indian Percentage, US 4.0 GPA, UK scales, and custom metrics) into the official German scale (1.0 – 4.0).
- Features instant German academic classification:
  - **1.0 – 1.5:** *Sehr Gut* (Excellent — Top chances for TU9 universities)
  - **1.6 – 2.5:** *Gut* (Good — Meets requirements for 90%+ public programs)
  - **2.6 – 3.0:** *Befriedigend* (Satisfactory — Target NC-frei / open admission programs)
  - **3.1 – 4.0:** *Ausreichend* (Passing threshold)
- Complete step-by-step math breakdown and educational guide warning against common transcript pitfalls (e.g. why $N_{min}$ must never be 0).

### 🗺️ 2. Interactive 6-Phase Germany Roadmap
- **Phase 1:** Profile Evaluation, IELTS/TOEFL & German Language (A1–B1)
- **Phase 2:** APS India Certificate & Document Notarization
- **Phase 3:** University Shortlisting & Uni-Assist VPD Applications
- **Phase 4:** Direct University Portal Submissions & Automated Alerts
- **Phase 5:** Blocked Account (€11,904) & Statutory Health Insurance (TK / DAK)
- **Phase 6:** VFS Visa Appointment, Studierendenwerk Dorms & Anmeldung
- **Personalized Tasks & Date Tracking:** Add your own custom steps per phase and log dates via a compact calendar picker.

### 📋 3. Per-Application Checklists & Presets
- Each university card contains an interactive to-do checklist.
- One-click German application presets:
  - *Tailor course-specific Letter of Motivation (SOP)*
  - *Update Tabular CV / Europass format*
  - *Check module handbook & ECTS credit table*
  - *Translate / notarize academic transcripts*
  - *Request institutional LORs from professors*

### 🔔 4. Automated Email Reminders & Google Calendar
- Set automated email triggers:
  - When application portal opens
  - 15 days before application deadline
  - 10 days before application deadline
- One-click export to Google Calendar with prefilled university course details.

### 📊 5. Visual Analytics & Portability
- Real-time distribution breakdown across **High (Ambitious)**, **Medium (Moderate)**, and **Safe** universities.
- **1-Click CSV Export & Import:** Back up your full application sheet to Excel/CSV anytime.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, Tailwind CSS v4, Lucide React Icons, Vite
- **Authentication:** Clerk (`@clerk/clerk-react`)
- **Backend:** Java 17, Spring Boot, Spring Data JPA, Maven
- **Database:** PostgreSQL
- **Deployment:** Render (Backend API & Postgres), Custom Domain (`unitracker.live`)

---

## 💻 Local Development Setup

### Prerequisites
- Node.js 18+ & npm
- Java JDK 17+ & Maven

### 1. Clone the repository
```bash
git clone https://github.com/your-username/university-tracker.git
cd university-tracker
```

### 2. Run Frontend
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Run Backend (Optional for local API)
```bash
cd ../backend
mvn spring-boot:run
```

---

## 📲 Share UniTracker with Fellow Aspirants

Want to share UniTracker in WhatsApp or Telegram study groups? Feel free to copy & paste this snippet:

```text
Hey everyone! 👋 
If you are applying for German universities (Winter/Summer intake), check out this free tool:
👉 https://unitracker.live

It has:
• 🧮 Bavarian Formula German Grade Calculator (converts your CGPA to German 1.0-4.0)
• 🗺️ Step-by-step Germany roadmap (APS, VPD, Blocked Account, Visa)
• 🔔 Automated email reminder alerts 15 & 10 days before university deadlines
• 📋 Per-university checklists so you don't miss SOPs, LORs, or VPDs

100% free with no ads. Hope it helps with your applications!
```

---

## 📄 License
This project is licensed under the MIT License - feel free to use and contribute!
