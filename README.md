# Project Title

A brief description of our project.

## Description

This is a full-stack application with a React frontend and a Node.js/Express backend.

## Features

- User authentication (registration, login, logout)
- Admin panel
- Game browsing and details
- Shopping cart functionality
- Order management
- User settings
- Review system

## Technologies

**Client (Frontend):**
- React
- Vite
- Other client-side libraries (e.g., React Router, Axios)

**Server (Backend):**
- Node.js
- Express.js
- PostgreSQL (or your chosen database)
- Supabase (for database interaction, if applicable)
- Other server-side libraries (e.g., JWT for authentication, bcrypt for password hashing)

## Setup and Installation

Follow these steps to set up and run the project locally.

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn
- PostgreSQL (or your chosen database)

### 1. Clone the repository

```bash
git clone <repository-url>
cd <project-directory>
```

### 2. Server Setup

Navigate to the `server` directory and install dependencies:

```bash
cd server
npm install
# or yarn install
```

#### Database Configuration

- Create a PostgreSQL database.
- Update the database connection details in `server/config/db.js` (or similar file).
- Run the SQL scripts in `server/database/tables.sql` to set up the necessary tables.

#### Environment Variables

Create a `.env` file in the `server` directory based on a `.env.example` (if available) or create one with the following:

```
PORT=5000
DATABASE_URL=postgres://user:password@host:port/database
JWT_SECRET=your_jwt_secret
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
# Add any other environment variables your server needs
```

#### Run the Server

```bash
npm start
# or yarn start
```

The server should now be running on `http://localhost:5000` (or your specified PORT).

### 3. Client Setup

Open a new terminal, navigate to the `client` directory and install dependencies:

```bash
cd ../client
npm install
# or yarn install
```

#### Environment Variables

Create a `.env` file in the `client` directory based on a `.env.example` (if available) or create one with the following:

```
VITE_API_BASE_URL=http://localhost:5000/api
# Add any other environment variables your client needs
```

#### Run the Client

```bash
npm run dev
# or yarn dev
```

The client application should now be running on `http://localhost:5173` (or the port specified by Vite).

## Usage

(Describe how to use your application here, e.g., register an account, browse games, add to cart, etc.)

## Contributing

(Instructions for contributing to your project, if applicable)

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.
