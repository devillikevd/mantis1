<div align="center">
  <img src="public/favicon.ico" width="80" height="80" alt="Mantis Logo"/>
  <h1 align="center">MANTIS OS</h1>
  <p align="center">
    <strong>Advanced AI-Powered Hardware Diagnostic & Troubleshooting Platform</strong>
  </p>

  <p align="center">
    <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js"/></a>
    <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react&logoColor=white" alt="React"/></a>
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/></a>
    <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS"/></a>
    <a href="https://www.prisma.io/"><img src="https://img.shields.io/badge/Prisma-5.9-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma"/></a>
  </p>
</div>

<br />

## 🪐 Overview

**MANTIS OS** is a cutting-edge, enterprise-ready platform designed to revolutionize hardware support. By combining vector-based RAG (Retrieval-Augmented Generation) with a highly immersive, sci-fi "JARVIS-inspired" user interface, MANTIS turns thousands of pages of technical manuals into an instant, interactive, voice-enabled diagnostic assistant.

Whether you're troubleshooting a combustion engine or diagnosing a circuit board, MANTIS provides real-time neural mapping, holographic scanning, and precise structural analysis.

---

## ✨ God-Tier Features

- 🧠 **Live 3D Neural Core:** Features an interactive, spinning 3D AI Core (built with `@react-three/fiber`) that dynamically reacts and pulses when the RAG engine is processing queries.
- 🗣️ **Real-Time Text-to-Speech (TTS):** The AI doesn't just type; it speaks. Integrated with browser native `SpeechSynthesis` for a fully immersive, voice-enabled diagnostic session.
- 👁️ **Holographic Computer Vision Scanner:** Upload images of broken hardware and watch as MANTIS initiates a full-screen, sweeping laser scan to extract structural features and diagnose physical damage.
- 📊 **Data-Overload Metrics:** Live, fluctuating network graphs (via `recharts`) showing simulated RAG latency and vector database ingestion in real-time.
- 🚁 **Automated Technician Dispatch:** Upon reaching a high-confidence diagnosis (≥85%), MANTIS switches modes to deploy a full-screen radar mapping system, calculating ETA and dispatching field engineers.
- 🔐 **NextAuth v5 (Auth.js):** Secure, modern authentication with credential fallback for robust hackathon demonstrations.

---

## 🏗️ Architecture & Tech Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | Next.js (App Router), React, Tailwind CSS | High-performance server components and highly styled glass-morphism UI. |
| **3D & Animation** | Framer Motion, React Three Fiber | Cinematic transitions, boot sequences, and real-time 3D rendering. |
| **Backend / API** | Next.js Route Handlers | Serverless endpoints handling Vector DB queries and AI streaming. |
| **Database** | Prisma ORM, SQLite / PostgreSQL | Robust, scalable relational data modeling for users, companies, and products. |
| **Authentication** | Auth.js (NextAuth v5 Beta) | Enterprise-grade session management and route protection. |

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js 18.x or higher
- npm or pnpm

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/mantis.git
   cd mantis
   ```

2. **Install dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Initialize the Database:**
   We are currently using SQLite for easy local development.
   ```bash
   npx prisma generate
   npm run db:push
   npm run db:seed
   ```

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) and login with `demo@company.com` / `demo123`.

---

## 🌍 Production Deployment Guide

Deploying MANTIS requires two main steps: **Hosting the Application** (Vercel) and **Hosting the Database** (Neon/Supabase). 

### Step 1: Database Setup (PostgreSQL)
Because Vercel is a serverless platform, local SQLite files will not persist (they reset on every request). You must use a cloud database.
1. Create a free PostgreSQL database on [Neon.tech](https://neon.tech/) or [Supabase](https://supabase.com/).
2. Copy your Connection URL.
3. In `prisma/schema.prisma`, change the provider back to PostgreSQL:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

### Step 2: Vercel Deployment
1. Push your code to a GitHub repository.
2. Go to [Vercel](https://vercel.com/) and click **"Add New Project"**.
3. Import your MANTIS GitHub repository.
4. **Environment Variables:** In the Vercel deployment settings, add the following:
   - `DATABASE_URL` = (Your Neon/Supabase PostgreSQL URL)
   - `NEXTAUTH_SECRET` = (Generate a random 32-character string)
   - `NEXTAUTH_URL` = (Your production Vercel domain, e.g., `https://mantis-app.vercel.app`)
5. Click **Deploy**.

### Step 3: Production Database Migration
Once Vercel finishes building:
1. Open your terminal.
2. Run `npx prisma db push` locally, but point it to your production DB by temporarily updating your local `.env`.
3. Run `npm run db:seed` to populate the production database with your demo companies and products.

> **Hackathon Tip:** If you want to skip the PostgreSQL setup just for a hackathon presentation, deploy to **Railway** or **Render**, which support persistent disks for SQLite!

---

<div align="center">
  <i>Built to redefine the future of intelligent diagnostics.</i>
</div>
