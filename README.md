# Interview AI

A full-stack web application designed to help users prepare for interviews by generating AI-powered reports based on their resumes. Fully responsive and cross-platform — works seamlessly on **Desktop, Android, and iOS**.

## 🌐 Live Deployment

The application is deployed on **Render**.

| Service | URL |
|---------|-----|
| **Frontend** | https://interview-ai-frontend-oavg.onrender.com |
| **Backend API** | https://interview-ai-backend-0n14.onrender.com |

> **Note:** Free tier services on Render may take 30–60 seconds to spin up on the first request after inactivity.

## 🏗️ Project Architecture

The project follows a standard client-server (Full-Stack) architecture:

- **Frontend (Client):** Built with **React** and **Vite**, providing a fast and responsive single-page application (SPA) experience. It handles all user interfaces, client-side routing, and state management.
- **Backend (Server):** Built with **Node.js** and **Express.js**, serving as a robust RESTful API. It handles user authentication, business logic, file processing (resume PDF uploads/parsing), and integrates with AI models.
- **Database:** Uses **MongoDB** (via Mongoose) for persistent storage of user credentials, profiles, and generated reports.
- **AI Integration:** Utilizes **Google GenAI (Gemini)** for analyzing resume content and generating interview insights/reports.

## 📄 Core Pages

The application is structured around four primary pages:

1. **Register Page:** Allows new users to create an account securely.
2. **Login Page:** Authenticates returning users and grants access to the platform.
3. **Home Page (Generate Report):** The main dashboard where users can upload or select their resume (PDF format), choose their specifics, and trigger the generation of their personalized report.
4. **Interview Page (Report Page):** Displays the final generated report, allowing users to view AI feedback, navigate through questions/suggestions, and see download options for their resume.
## ⚡ Performance & Latency Optimizations

The report generation pipeline has been optimized to significantly reduce latency and improve system reliability:

1. **AI Reasoning Calibration (`thinkingLevel: "low"`)**
   - Calibrated the Gemini 3 model's reasoning settings by introducing `thinkingConfig` with `thinkingLevel` set to `"low"`.
   - This bypasses unnecessary deep chain-of-thought steps for non-logical/extraction tasks, reducing initial generation time by **~40%** (from **15.8s** down to **~9s**).

2. **Hybrid Caching Service (`node-cache` & In-Memory Map)**
   - Implemented a unified caching service ([cache.service.js](file:///c:/Users/risha/OneDrive/Desktop/yt-genAI/Backend/src/services/cache.service.js)) that hashes candidate payload configurations using SHA-256 to serve identical reports instantly.
   - Repeated requests bypass the AI model and load in under **~740ms** (a **95%+ latency reduction**).
   - Uses a **Dual-Mode Fallback System**: dynamically utilizes `node-cache` with automatic 24-hour TTL (Time-to-Live) cache eviction when installed, and gracefully degrades to a native JavaScript `Map` store if the module is missing, making the application highly resilient to missing package environments.

## 🛠️ Required Libraries & Tech Stack

### Frontend Dependencies (`/Frontend`)
- **Core React:** `react`, `react-dom`
- **Routing:** `react-router`
- **Network Requests:** `axios`
- **Styling:** `sass-embedded` (SCSS)
- **Build Tool:** `vite`

### Backend Dependencies (`/Backend`)
- **Server Framework:** `express`
- **Database ORM:** `mongoose` (MongoDB)
- **Authentication & Security:** `bcryptjs` (password hashing), `jsonwebtoken` (JWT for secure sessions), `cookie-parser`, `cors`
- **File Handling & Parsing:** `multer` (handling form data and file uploads), `pdf-parse` (extracting text from PDFs)
- **Web Scraping/Automation:** `puppeteer`
- **AI Integration:** `@google/genai` (Google's Generative AI API)
- **Caching:** `node-cache` (with memory Map fallback)
- **Validation:** `zod`, `zod-to-json-schema`
- **Environment Management:** `dotenv`

## 🚀 How to Run locally

### Prerequisites
- [Node.js](https://nodejs.org/) installed
- MongoDB instance (local or Atlas) running

### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd Backend
   ```
2. Install all required dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the Backend directory with necessary variables (e.g., `PORT`, `MONGO_URI`, `JWT_SECRET`, `GEMINI_API_KEY`).
4. Start the development server (runs with nodemon):
   ```bash
   npm run dev
   ```

### 2. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd Frontend
   ```
2. Install all required dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

## 👨‍💻 Authors

- [rishabhkheria](https://github.com/rishabhkheria) (Owner)
