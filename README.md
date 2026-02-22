# FAST-NUCES Islamabad — Faculty Review System

A web application for students of **FAST-NUCES Islamabad** to anonymously browse, search, and review faculty members. All reviews are completely anonymous and cannot be traced back to individual users.

---

## Screenshots

### Home Page — Faculty Listing
![Home Page](https://github.com/user-attachments/assets/dc33bbef-1d9b-4477-ae50-8d8f4ed666c8)

### Faculty Profile & Review Form
![Faculty Modal](https://github.com/user-attachments/assets/6ee439e1-47d5-4b8f-a3a7-45815a0f887c)

### Leaderboard
![Leaderboard](https://github.com/user-attachments/assets/57604a12-0cb5-4a33-abf5-49961a6a624c)

---

## Features

- **Faculty Directory** — Browse 240+ faculty members across 9 departments. Each card displays the faculty member's photo, name, department, office location, and current star rating.
- **Search & Filter** — Search faculty by name in real time and filter by department using the dropdown.
- **Pagination** — Browse results in pages of 12, 24, or 48 faculty per page.
- **HOD Badge** — Heads of Department are highlighted with a "HOD" badge on their card.
- **Faculty Profile Modal** — Click any faculty card to open a detailed profile showing their school, office, email address, a link to their official university profile page, an anonymous review form, and all existing reviews.
- **Anonymous Reviews** — Submit a star rating (1–5) and an optional written comment (up to 500 characters). Reviews cannot be edited, deleted, or traced back to the submitter.
- **Review Sorting** — Sort reviews for a faculty member by most recent, highest rated, or lowest rated.
- **Leaderboard** — A dedicated page showing the top 10 highest-rated faculty, a department rankings bar chart, a rating distribution pie chart, and site-wide stats (total reviews, average rating, number of rated faculty, total departments).
- **Recent Reviews Bell** — A notification button in the header lets you quickly see the latest reviews posted across all faculty.
- **Dark / Light Mode** — Toggle between dark and light themes using the sun/moon button in the header.
- **Mobile Responsive** — On mobile, faculty can be browsed in a swipeable carousel view or a compact list view. A hamburger menu consolidates navigation options.
- **Admin Panel** — Authenticated admins can access a protected admin panel to manage faculty data.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite |
| UI Components | shadcn/ui, Radix UI primitives |
| Styling | Tailwind CSS |
| Backend / Database | Supabase (PostgreSQL + Auth) |
| Data Fetching | TanStack React Query |
| Charts | Recharts |
| Routing | React Router v6 |

---

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm

### Installation

```sh
# 1. Clone the repository
git clone https://github.com/ammarasad2005/faculty-review

# 2. Navigate into the project directory
cd faculty-review

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

The app will be available at `http://localhost:8080`.

### Build for Production

```sh
npm run build
```

### Run Tests

```sh
npm test
```

---

## Project Structure

```
src/
├── components/       # Reusable UI components (Header, FacultyCard, ReviewForm, etc.)
├── contexts/         # React context providers (AuthContext)
├── hooks/            # Custom hooks for data fetching (useFacultyData, useReviews)
├── integrations/     # Supabase client setup
├── pages/            # Top-level page components (Index, Leaderboard, NotFound)
└── types/            # TypeScript type definitions
```
