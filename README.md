Modern Full-Stack Personal Finance Tracker built with clean architecture and performance in mind.

## 🚀 Tech Stack

### Backend
- **Core:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Language:** TypeScript
- **Auth:** JWT (Access/Refresh strategy), httpOnly cookies, Bcrypt
- **Features:** Server-side pagination, Filtering, Search, Data isolation

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS + SCSS Modules (Hybrid approach)
- **Architecture:** Feature-Sliced Design (Modified)
- **State:** React Server Components (RSC) + Server Actions

## 🛠 Features (In Progress)
- [x] Secure Authentication & Registration
- [x] Category Management (CRUD)
- [x] Transactions API (Create, Delete, Read with Filters)
- [ ] Smart Dashboard & Analytics
- [ ] User Profile Settings

## 🏗 Architecture
The project follows a strict separation of concerns using a Monorepo-like structure. The Backend handles complex data filtering to reduce client-side load ("Database First" approach).