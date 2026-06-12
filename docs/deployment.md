# Deployment Guide

This document outlines the strategies and requirements for deploying the Workspace Chat Platform to production environments.

---

## 🏗️ Production Requirements

### Infrastructure
- **Node.js Environment**: A platform that supports Node.js v18+ (e.g., Vercel, Railway, Render, or a VPS).
- **Database**: A production MongoDB instance (e.g., MongoDB Atlas).
- **SSL/HTTPS**: Mandatory for secure communication and cookie handling.

---

## 📦 Deployment Strategies

### Option 1: Managed Platforms (Recommended)
- **Frontend**: Deploy `client/` to **Vercel** or **Netlify**.
- **Backend**: Deploy `server/` to **Railway**, **Render**, or **Heroku**.

### Option 2: Docker (Future)
- We plan to provide `Dockerfile` and `docker-compose.yml` for containerized deployments.

---

## ⚙️ Environment Variables (Production)

Ensure the following variables are set in your production environment:

### Server
- `PORT`: The port the server runs on.
- `MONGODB_URI`: Connection string for your production DB.
- `JWT_SECRET`: A long, random string for signing tokens.
- `CLIENT_URL`: The URL where your frontend is hosted (for CORS).

### Client
- `VITE_API_URL`: The URL of your deployed backend API.
- `VITE_SOCKET_URL`: The URL of your deployed Socket server.

---

## 🚀 Post-Deployment Checklist
1.  Verify database connectivity.
2.  Test user registration and login.
3.  Confirm Socket.IO connections are successful.
4.  Ensure CORS settings allow communication between frontend and backend.
