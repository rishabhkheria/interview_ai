# Interview AI

A full-stack web application designed to help users prepare for interviews by generating AI-powered reports based on their resumes.

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
