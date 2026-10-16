# StayRent

StayRent is a property rental web application built with the MERN stack. It allows tenants to browse and book rental properties, property owners to manage listings and bookings, and administrators to oversee platform activity. The application includes role-based access control and WhatsApp contact support for property owners.

## Features

- Browse rental properties and view property details
- Filter property listings by keyword, city, type, and price
- Register and log in as a tenant or property owner
- Create and manage property listings
- Submit and manage booking requests
- Save properties to a wishlist
- Submit and view property reviews
- Provide administrators with tools to manage users, owners, properties, and bookings
- Contact property owners through WhatsApp

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, React Router DOM v6, Axios |
| Backend | Node.js, Express.js, Multer |
| Database | MongoDB, Mongoose |
| Authentication | JSON Web Tokens (JWT), bcryptjs |

## Prerequisites

Make sure the following are installed or available:

- Node.js v18 or later
- npm
- MongoDB running locally or a MongoDB Atlas connection string
- Git

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/LessThanNone/StayRent.git
cd StayRent
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Install frontend dependencies

Open a separate terminal from the repository root and run:

```bash
cd frontend
npm install
```

### 4. Configure environment variables

Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/stayrent
JWT_SECRET=replace_with_a_secure_secret
NODE_ENV=development
```

Update `MONGO_URI` to match your MongoDB connection. Replace the example `JWT_SECRET` with a secure secret for your environment.

### 5. Start the application

Run the backend and frontend in separate terminal windows.

**Backend** — from the `backend` directory:

```bash
npm run dev
```

The backend runs at `http://localhost:5000`.

**Frontend** — from the `frontend` directory:

```bash
npm run dev
```

Vite will display the local frontend URL in the terminal, typically `http://localhost:5173`.

## Database Seeding

To populate the database with sample data, run the seeder from the `backend` directory:

```bash
npm run seed
```

**Warning:** The seeder clears existing database data before inserting sample records. Do not run it against a database containing data you need to keep.

After seeding, the sample owner account requires administrator approval before it can create property listings.

## Project Structure

```text
StayRent/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── seeder.js
│   ├── server.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── hooks/
    │   ├── pages/
    │   ├── services/
    │   ├── utils/
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
```

## License

This project is licensed under the MIT License.
See the [LICENSE](LICENSE) file for details.