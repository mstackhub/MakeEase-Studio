# MakeEase Studio — Web App Portfolio + Product Store + Demo Center

> **Brand Positioning:** We build simple tools for real problems. (สร้างเครื่องมือที่ใช้งานง่าย เพื่อแก้ปัญหาที่เกิดขึ้นจริง)

A modern, fast, and scalable digital product store, portfolio, demo center, and lead generation web application built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **Drizzle ORM** with **LibSQL / Turso**.

---

## ✨ Features

- **Storefront & Portfolio:**
  - 8-Section Homepage designed for problem-first positioning
  - Real-time instant search & category filtering on `/products`
  - Deep-dive product pages with Pain Points ("เคยเจอปัญหาแบบนี้ไหม?"), Solutions, Feature Icons, Screenshot Gallery with Zoom, and Dynamic Pricing Cards
  - Interactive Demo Center (`/demo`) with 1-click credential copying for Demo Accounts and Direct Demo launchers
  - Two service models on `/services`: Ready-to-Use vs Custom Solution
  - Authentic, problem-first storytelling on `/about`
  - High-converting Lead Capture on `/contact` with URL query auto-fill, budget selector, and anti-spam protection

- **Admin Studio CMS:**
  - Protected single-admin authentication with JWT session cookies
  - Dashboard overview with metrics and recent lead pipeline
  - Full Product CRUD across 7 structured tabs (Basic, Problems, Features, Gallery, Pricing, Demo, SEO)
  - Duplicate, Edit, and Delete (with Confirmation Dialog)
  - Category taxonomy management
  - Lead pipeline manager (New, Contacted, Proposal, Won, Lost)
  - Live Brand Color customization with CSS Variables and color presets

- **SEO & Performance:**
  - JSON-LD Structured Data (`WebSite`, `Product`, `BreadcrumbList`)
  - Dynamic `sitemap.xml` and `robots.txt`
  - Google Analytics 4 event tracking (`view_product`, `click_demo`, `click_contact`, `submit_lead`, etc.)

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

### 3. Initialize & Seed Database
```bash
npm run seed
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Admin Access

- **Login URL:** `/admin/login`
- **Default Email:** `admin@example.com`
- **Default Password:** `adminpassword123`

---

## 🛠️ Tech Stack

- **Framework:** Next.js (App Router) & React 18
- **Language:** TypeScript
- **Styling:** Tailwind CSS with CSS Variables for Brand Theming
- **Database:** SQLite / Turso (`@libsql/client`)
- **ORM:** Drizzle ORM
- **Icons:** Lucide React
- **Auth:** Jose (JWT Cookie Session) & BcryptJS

