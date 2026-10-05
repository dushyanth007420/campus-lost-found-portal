# Campus Lost and Found Portal - S.A. Engineering College (Autonomous)

A complete MERN stack web application for college students, staff, and faculty to report lost and found items on campus, verify ownership claims, and receive real-time email notifications via Nodemailer.

---

## 🌟 Key Features

- **Item Reporting**: Report misplaced (Lost) or discovered (Found) items with descriptions, locations, categories, and photos.
- **Verification Claims**: Students can submit proof-of-ownership claims directly to the item reporter.
- **Nodemailer Automated Emails**:
  - Branded welcome email on student registration.
  - Immediate email alerts to item owners when a claim is filed.
  - Automated status emails to claimants upon claim approval or rejection.
- **S.A. Engineering College Social Channels**:
  - Official Instagram: [@saec_autonomous](https://www.instagram.com/saec_autonomous/)
  - Official LinkedIn: [S.A. Engineering College (Autonomous)](https://www.linkedin.com/company/sa-engineering-college-autonomous/posts/?feedView=all)
- **Role-Based Access**:
  - Student Dashboard (manage posted items & review incoming claims).
  - Admin Moderation Panel (review all items, system stats, claim logs).

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite), React Router v6, Axios, Vanilla CSS (responsive design)
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), Multer (image uploads)
- **Authentication**: JWT (JSON Web Tokens), bcryptjs
- **Mailing**: Nodemailer (Gmail SMTP integration)

---

## 🚀 Getting Started

### 1. Backend Setup

```bash
cd server
npm install
```

Copy the `.env.example` file to `.env`:
```bash
cp .env.example .env
```

Configure your `.env` variables:
```ini
PORT=5001
MONGODB_URI=mongodb://localhost:27017/campus_lost_found
JWT_SECRET=your_jwt_secret_here
ALLOWED_EMAIL_DOMAIN=*

# Nodemailer Gmail Configuration
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_16_character_app_password
```

Seed initial sample items and admin credentials (optional):
```bash
node seed.js
```
*(Default Admin: `admin@college.edu` / `admin123`)*

Start the backend server:
```bash
node server.js
```
*Backend runs on `http://localhost:5001`*

---

### 2. Frontend Setup

```bash
cd client
npm install
npm run dev
```
*Frontend runs on `http://localhost:3000` (or `http://localhost:3002`)*

---

## 👥 Default Accounts

| Account | Email | Password | Role |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@college.edu` | `admin123` | Administrator (Admin Panel) |
| **Student** | `johndoe@college.edu` | `user123` | Standard User |
*(Any other email such as `@gmail.com` can also register dynamically).*
