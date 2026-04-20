# 🌍 TravelWise — Smart Travel Planner

> **"Plan Smarter. Travel Better."**  
> A production-grade Smart Travel Planner built with React 18 + Firebase.

---

## Problem Statement

Travel planning is fragmented across spreadsheets, notes apps, and booking websites. Travelers struggle to track budgets, organize itineraries, and keep important documents in one place — leading to stress, overspending, and missed experiences.

**TravelWise** solves this by bringing everything together: a day-by-day itinerary builder, real-time budget tracker, document vault, and trip management dashboard — all in one beautiful app.

**Who is the user?** Solo travelers, couples, and small groups who plan multi-day trips.  
**Why it matters:** Poor planning leads to overspending, missed experiences, and stressful trips.

---

## ✨ Features

- 🔐 **Authentication** — Email/Password + Google OAuth via Firebase Auth
- 🗺️ **Trip Management** — Create, view, update, delete trips with status tracking
- 📅 **Itinerary Builder** — Day-by-day planner with activities (time, location, notes)
- 💰 **Budget Tracker** — Track spending by category with Pie/Bar chart visualization
- 📄 **Document Vault** — Store links to passport, visa, tickets, and more
- 👤 **Profile Page** — Editable user profile with trip statistics
- 🔍 **Search & Filter** — Filter trips by status, search by name/destination
- 📱 **Responsive Design** — Fully responsive mobile + desktop layout

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + Vite |
| Routing | React Router v6 |
| Auth | Firebase Authentication |
| Database | Firebase Firestore |
| Styling | Custom CSS (Glassmorphism dark theme) |
| Charts | Recharts |
| Icons | Lucide React |
| Date Utils | date-fns |
| Fonts | Inter + Poppins (Google Fonts) |

---

## ⚛️ React Concepts Demonstrated

| Concept | Where Used |
|---------|-----------|
| `useState` | Forms, UI toggles, local data |
| `useEffect` | Firestore subscriptions, auth state, data fetching |
| `useContext` | AuthContext (user), TripContext (trips) |
| `useCallback` | Optimized event handlers |
| `useMemo` | Filtered trip lists, budget calculations, category data |
| `useRef` | Dropdown close-on-outside-click |
| `React.lazy + Suspense` | Route-level code splitting |
| Context API | AuthContext + TripContext |
| Protected Routes | ProtectedRoute component |
| Controlled Components | All form inputs |
| Lifting State Up | TripContext shared across Dashboard, TripDetail, Profile |
| Custom Hooks | `useItinerary`, `useBudget` |

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+ 
- A Firebase project (free tier works)

### 1. Clone & Install

```bash
git clone https://github.com/your-username/travelwise.git
cd travelwise
npm install
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable **Authentication** → Sign-in methods → Email/Password + Google
4. Create a **Firestore Database** (start in test mode)
5. Copy your Firebase config

### 3. Environment Variables

Create a `.env` file in the root:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Then update `src/services/firebase.js` with your config values.

### 4. Firestore Security Rules

In Firebase Console → Firestore → Rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    match /trips/{tripId} {
      allow read, write: if request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
      match /{subcollection}/{docId} {
        allow read, write: if request.auth != null;
      }
    }
  }
}
```

### 5. Run Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx          # Top navigation with dropdown
│   │   └── ProtectedRoute.jsx  # Auth guard
│   └── trips/
│       ├── TripCard.jsx        # Trip card UI
│       ├── ItineraryTab.jsx    # Day-by-day planner
│       ├── BudgetTab.jsx       # Budget tracker + charts
│       └── DocumentsTab.jsx    # Document links
├── context/
│   ├── AuthContext.jsx         # Firebase auth state
│   └── TripContext.jsx         # Global trips list
├── hooks/
│   ├── useItinerary.js         # Itinerary CRUD hook
│   └── useBudget.js            # Budget CRUD hook
├── pages/
│   ├── LandingPage.jsx         # Public home page
│   ├── AuthPage.jsx            # Login / Sign up
│   ├── Dashboard.jsx           # Trip overview
│   ├── CreateTrip.jsx          # 3-step trip form
│   ├── TripDetail.jsx          # Tabbed trip view
│   └── ProfilePage.jsx         # User profile
└── services/
    ├── firebase.js             # Firebase init
    ├── authService.js          # Auth helpers
    └── tripService.js          # Firestore CRUD
```

---

## 🌐 Deployment (Vercel)

```bash
npm run build
# Deploy /dist folder to Vercel or Netlify
```

---

## 👨‍💻 Author

Built for the **Building Web Applications with React** — End Term Project, Batch 2029.
