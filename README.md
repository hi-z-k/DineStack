# 🇪🇹 Ethio Delight

**The Ultimate Fusion of Traditional Ethiopian Flavors & Modern Full-Stack Tech.**

Ethio Delight is a high-performance food delivery ecosystem built for the vibrant culinary scene of Addis Ababa. This project features a "Surgical Component" architecture, a real-time "Command Center" admin dashboard, and a seamless floating receipt experience.

---

## Key Features

### Frontend (User Experience)
* **Surgical Component Architecture:** Decoupled modules for filters, search, and product cards for maximum performance and readability.
* **Floating Scroll System:** A draggable/pinnable cart interface designed for high-conversion mobile and desktop use.
* **Real-time Menu:** Instant menu synchronization via Socket.io—no manual refreshes required.
* **PDF Invoicing:** Professional automated invoice generation upon checkout.
* **Motion UI:** Fluid, high-end interactions powered by Framer Motion.

### Backend (The Engine)
* **Centralized Logic:** Controllers, models, and routes organized within the `src` directory for a clean, scalable production environment.
* **Real-time Orchestration:** Immediate socket broadcasts for new orders, status changes, and user cancellations.
* **Secure Auth:** Robust JWT authentication with specific Admin and Customer permission tiers.
* **Data Visualization:** Integrated revenue analytics and daily sales timelines via Recharts.

---

## Project Structure

```text
├── backend
│   ├── .env                 # Environment variables
│   ├── src/                 # Main Source Code
│   │   ├── app.js           # Express Entry Point
│   │   ├── controllers/     # Business Logic (orders, products, users)
│   │   ├── models/          # Database Schemas (Order, Product, User)
│   │   ├── routes/          # API Route Definitions
│   │   └── utils/           # Middleware (Auth, BodyParser)
│   ├── seed.js              # Database Seeding Script
│   └── package.json
└── frontend
    ├── src/
    │   ├── api.js           # Centralized Axios/Fetch Service
    │   ├── components/      # Surgical UI Modules (CategoryFilter, SearchBar, etc.)
    │   ├── context/         # State Management (Auth & Cart)
    │   ├── pages/           # High-level Views (Home, Admin, Checkout)
    │   └── utils/           # UI Helpers (Invoice Generator)
    ├── tailwind.config.js
    └── package.json

```

---

## 🛠 Tech Stack

| Technology | Usage |
| --- | --- |
| **React 18 + Vite** | Frontend Framework |
| **Node.js + Express** | Backend Runtime |
| **MongoDB + Mongoose** | Database & Modeling |
| **Tailwind CSS** | Atomic Styling |
| **Socket.io** | Real-time Communication |
| **Framer Motion** | Advanced Animations |
| **Recharts** | Admin Dashboard Analytics |

---

## 🚦 Getting Started

### 1. Prerequisites

* Node.js (v16+)
* MongoDB Instance (Local or Atlas)

### 2. Environment Setup

Create a `.env` file in the `backend` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key

```

### 3. Installation

**Backend:**

```bash
cd backend
npm install
npm run dev

```

**Frontend:**

```bash
cd frontend
npm install
npm run dev

```

### 4. Database Seeding

Populate the system with authentic Ethiopian menu items:

```bash
cd backend
node seed.js

```


Developed with 🧡 for the Ethiopian Culinary Scene.


```
