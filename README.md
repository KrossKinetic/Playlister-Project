# Playlister Project

A full-stack web application for managing music playlists, allowing users to create accounts, build playlists, and publish their favorite song lists.

## 🚀 Technologies Used

### Frontend (Client)
* **React** - UI Library
* **Material UI (MUI)** - Component Library
* **Vite** - Build tool
* **React Router** - Navigation
* **React Youtube** - YouTube Player Integration

### Backend (Server)
* **Node.js & Express** - Server Framework
* **MongoDB (Mongoose)** - NoSQL Database
* **PostgreSQL & Sequelize** - SQL Database ORM
* **JWT & Bcrypt** - Authentication & Security

## 📂 Project Structure

* **client/** - React frontend application.
* **server/** - Express backend API.

## 🛠 Installation & Setup

### 1. Backend Setup
1.  Navigate to the server folder:
    ```bash
    cd server
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `server` directory and add your database, youtube API and JWT secrets (e.g., `DB_CONNECT`, `JWT_SECRET`).
4.  Start the server:
    ```bash
    node index.js
    ```
    *The server runs on port 4000 by default.*

### 2. Frontend Setup
1.  Navigate to the client folder:
    ```bash
    cd client
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the application:
    ```bash
    npm start
    ```
    *The client runs on port 3000 by default.*

## ✨ Features

* **Authentication**: Login, Register, and Account Update capabilities.
* **Playlist Management**: Create, edit, and manage playlists.
* **Songs Catalog**: Browse and add songs to your playlists.
* **YouTube Integration**: Play songs directly within the application.
