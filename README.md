# NoteApp

NoteApp is a full-stack note-taking sample built with React, Express, and MongoDB. The project is split into independent frontend and backend folders: the frontend is powered by Vite, while the backend exposes a REST API via Express, connects to MongoDB, and uses Upstash Redis for rate limiting.

## Features
- Create, list, edit, and delete notes, ordered by creation time (newest first).
- Inline editing within the detail page with optimistic updates.
- Sliding-window rate limiting via Upstash to protect the API.
- Tailwind CSS + DaisyUI themed UI with toast notifications from `react-hot-toast`.
- Axios instance that centralizes HTTP configuration toward the local backend.

## Tech Stack
- **Frontend:** React 19, React Router 7, Vite, Tailwind CSS, DaisyUI, Lucide React, React Hot Toast, Axios.
- **Backend:** Node.js, Express, Mongoose, Upstash Ratelimit/Redis, dotenv, cors.
- **Database:** MongoDB (via Mongoose).
- **Tooling:** ESLint, Nodemon.

## Project Structure
```text
noteApp/
├─ backend/
│  ├─ package.json
│  └─ src/
│     ├─ config/
│     │  ├─ db.js            # MongoDB connection
│     │  └─ upstash.js       # Upstash rate limit config
│     ├─ controllers/
│     │  └─ notesController.js
│     ├─ middleware/
│     │  └─ rateLimiter.js
│     ├─ models/
│     │  └─ Note.js
│     ├─ routes/
│     │  └─ notesRoutes.js
│     └─ server.js           # Express entry point
├─ frontend/
│  ├─ package.json
│  ├─ src/
│  │  ├─ App.jsx
│  │  ├─ main.jsx
│  │  ├─ index.css
│  │  ├─ lib/                # axios instance and utilities
│  │  ├─ components/
│  │  └─ pages/
│  └─ tailwind.config.js     # Tailwind & DaisyUI setup
└─ README.md                 # You are here
```

## Prerequisites
- Node.js 18+ (latest LTS recommended).
- MongoDB instance (local or hosted).
- Upstash Redis account (for rate limiting).

## Environment Variables
Create a `.env` file in the `backend/` folder:

```
# backend/.env
PORT=5001
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/<database>
UPSTASH_REDIS_REST_URL=https://<your-upstash-url>
UPSTASH_REDIS_REST_TOKEN=<your-upstash-token>
```

- `PORT`: Optional. Defaults to 5001 if omitted.
- `MONGODB_URI`: MongoDB connection string.
- `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`: REST endpoint and token from your Upstash dashboard.

If you change the frontend origin or backend port, update:
- `cors` configuration in `backend/src/server.js` (defaults to `http://localhost:5173`).
- Axios `baseURL` in `frontend/src/lib/axios.js`.

## Getting Started

### 1. Install Dependencies
Install packages for both backend and frontend:

```bash
cd /Users/hulin/Documents/projects/noteApp/backend
npm install

cd /Users/hulin/Documents/projects/noteApp/frontend
npm install
```

### 2. Run the Development Servers
Use two terminals:

```bash
# Terminal 1: start backend (http://localhost:5001 by default)
cd /Users/hulin/Documents/projects/noteApp/backend
npm run dev

# Terminal 2: start frontend (http://localhost:5173 by default)
cd /Users/hulin/Documents/projects/noteApp/frontend
npm run dev
```

The frontend expects the backend at `http://localhost:5001/api`, so ensure the backend is running and MongoDB is reachable.

## API Overview
All routes live under `/api/notes`:

| Method | Path | Description |
| ------ | ---- | ----------- |
| `GET` | `/api/notes` | Fetch all notes (sorted by newest first) |
| `GET` | `/api/notes/:id` | Fetch a single note by ID |
| `POST` | `/api/notes` | Create a note (requires `title` and `content`) |
| `PUT` | `/api/notes/:id` | Update an existing note |
| `DELETE` | `/api/notes/:id` | Delete a note |

Responses are JSON formatted around the `Note` Mongoose model (`title`, `content`, timestamps, etc.). Errors return appropriate HTTP status codes with a `message`.

## Rate Limiting
- Middleware `rateLimiter` uses Upstash’s sliding window strategy: **10 requests per 20 seconds** (`Ratelimit.slidingWindow(10, "20 s")`).
- When the limit is hit, the server returns `429 Too Many Requests`.
- The frontend shows the `RateLimitedUI` component to explain the situation.
- Adjust the quota or window in `backend/src/config/upstash.js` as needed.

## Frontend Highlights
- Routes: `/` (list), `/create` (new note), `/note/:id` (detail/edit).
- `HomePage` fetches notes on mount; renders loading state, rate-limit prompt, or `NotesNotFound`.
- `CreatePage` and `NoteDetailPage` handle mutations with toast feedback and navigation.
- `NoteCard` triggers deletes via `DELETE /api/notes/:id` and updates local state.
- Tailwind + DaisyUI provide theming, form styling, and components.

## NPM Scripts

| Location | Command | Purpose |
| -------- | ------- | ------- |
| `backend` | `npm run dev` | Start Express with Nodemon |
| `backend` | `npm start` | Start Express in production mode |
| `frontend` | `npm run dev` | Run Vite dev server |
| `frontend` | `npm run build` | Build production assets |
| `frontend` | `npm run preview` | Preview the built frontend |
| `frontend` | `npm run lint` | Run ESLint checks |

## Known Issues & Improvements
- In `notesController.deleteNote`, the 404 guard references `deleteNote` instead of `deletedNote`. Update it to avoid missing the not-found response.
- `CreatePage` can emit duplicate failure toasts; the error handling can be streamlined.
- Consider moving CORS allowed origins and the Axios `baseURL` into environment variables for multi-environment deployments.
- Future enhancements could add authentication, tagging, search, or automated testing.

## License
The backend `package.json` lists ISC as the current license. Provide a dedicated `LICENSE` file if you adopt a different license for the project.

