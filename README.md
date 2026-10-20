# 🐄 Al-Karam Dairy Farm Management System (DFMS)

A full-stack, enterprise-grade Dairy Farm Management System with a Public Customer Website and an authenticated Admin Control & Financial Ledger Portal, developed according to the comprehensive SRS specifications.

---

## 🌟 Key Modules & Features

### 1. 🌐 Public Customer Website
- **Home Page (`/`)**:
  - High-impact Hero section with purity guarantee badges and CTAs.
  - Live Milk Price ticker (Cow Milk, Buffalo Milk, Desi Ghee).
  - Quick action to open interactive order modal from any page.
  - Farm Statistics (120+ Cattle, 1,800+ Liters daily yield, 350+ households).
  - Why Choose Us (Grass-fed, 0% water mixing guarantee, Touchless milking).
  - Customer Testimonials & Reviews.
- **Products & Price List (`/products`)**:
  - Pure Cow Milk (Rs 220/Ltr), Buffalo Milk (Rs 260/Ltr), Desi Ghee (Rs 2,400/KG), Butter, Dahi, Paneer, Khoya.
  - Category filters: All, Fresh Milk, Desi Ghee & Butter, Dahi & Dairy.
  - Detailed nutritional facts (fat %, protein profile, benefits).
  - Direct "Order Now" button with pre-selected product.
- **Farm Visual Gallery (`/gallery`)**:
  - Filterable tabs: Cattle Breeds, Pastures & Fodder, Milking Parlor & 4°C Chiller, Desi Ghee Bilona Center.
  - Lightbox modal with zoom and descriptions.
  - Schedule physical farm visit CTA.
- **About Us (`/about`)**:
  - Farm history, vision & mission.
  - Founder's message & core principles (Purity, Animal Welfare, Modern Hygiene).
- **Contact & Direct Order (`/contact`)**:
  - Interactive online order form saving directly into the database.
  - Contact cards: Phone, WhatsApp, Farm address, Timings.
  - Frequently Asked Questions (FAQs).
- **WhatsApp Floating Button**:
  - Pulsing floating CTA on all pages opening direct WhatsApp chat with prefilled message.

---

### 2. 🔐 Admin Management & Financial Portal

- **Admin Dashboard (`/admin`)**:
  - 6 KPI metric cards: Total Cattle, Today's Milk (L), Today's Income (Rs), Total Expenses (Rs), Customers Count, Pending Orders.
  - Interactive multi-bar charts: 6-month historical trend comparing Milk Yield vs Income vs Expenses.
  - Pie chart: Expense category breakdown.
  - Quick Action Shortcuts.
  - Recent public orders table with fast action links.
  - Roman Urdu / English bilingual language toggle.

- **Animals Management (`/admin/animals`)**:
  - Tag number, name, type (Cow / Buffalo), breed, age, purchase date, status.
  - Search by tag number or name.
  - Filter by type and status (Active, Sold, Dead).
  - Add / Edit animal modals.
  - **Animal Detail & Milk History (AN-05)**: View individual animal's lifetime milk production records and total liters!

- **Milk Records & Production (`/admin/milk`)**:
  - Morning Liters, Evening Liters, Rate per Liter, Total Liters, Total Estimated Value.
  - Daily & monthly table view with date range filter (From / To).
  - Auto-calculation: `(Morning + Evening) * Rate = Total Bill`.
  - Delete / manage entries.

- **Farm Expenses Book (`/admin/expenses`)**:
  - Categories: Chara & Wanda, Dawa & Vet, Worker Salaries, Electricity & Utilities, Maintenance, Other.
  - Category-wise quick filter and summary cards.
  - Add expense modal with automatic category totals.

- **Customers & Udhaar Khata / Ledger (`/admin/customers`)**:
  - Customer registry with name, phone, delivery address, and current balance.
  - Udhaar badges: Red (`Udhaar Baqi: Rs X`), Blue (`Advance Paid`), Green (`Khata Clear`).
  - **Interactive Customer Ledger Modal (C-03, C-04, C-05)**:
    - **+ Doodh Supply (Sale)**: Liters, Rate, Amount -> increases customer's balance.
    - **+ Vasooli (Payment)**: Cash, JazzCash, EasyPaisa, Bank -> decreases customer's balance.
    - Complete chronological ledger statement with running balance!
    - Print Khata statement button.

- **Website Customer Orders (`/admin/orders`)**:
  - View orders placed by visitors from the website.
  - Status filters: Pending, Confirmed, Delivered, Cancelled.
  - One-click **WhatsApp Customer** button (opens chat with pre-filled greeting and order details).
  - One-click **Call Customer** button.
  - Fast status toggles (Pending -> Confirmed -> Delivered).

- **Reports & Analytics (`/admin/reports`)**:
  - **Daily Report (R-01)**: Date picker, milk collected, sales, expenses, and net profit.
  - **Monthly Report (R-02)**: Monthly output, 6-month trend chart.
  - **Profit & Loss Statement (R-03)**: Total income, total expenses, net profit, profit margin %.
  - **Customer Udhaar Report (R-05)**: List of all debtors with pending receivables.
  - **Exporting (R-04)**: Printable PDF view and CSV (Excel) spreadsheet download.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Tailwind CSS v4, Vite, React Router v7, React Hot Toast |
| **Backend** | Node.js, Express, TypeScript, Mongoose, JWT, BcryptJS, CORS, Dotenv |
| **Database** | MongoDB Atlas (Cloud) |
| **Charts & Visuals** | Recharts, Lucide React Icons |

---

## 🚀 How to Run the Project

### 1. Start the Backend:
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

### 2. Seed Sample Database Records (Already executed):
```bash
cd backend
npm run seed
```

### 3. Start the Frontend:
```bash
cd frontend
npm run dev
# Website opens on http://localhost:5173
```

---

## 🔑 Default Credentials
- **Admin Email**: `admin@dairy.com`
- **Password**: `admin123`
*(A 1-Click Demo Fill button is also available directly on the login page)*
