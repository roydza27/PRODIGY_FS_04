# SyncSpace - Chat Platform

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Nodejs](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)
![MIT License](https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge)

A production-ready, real-time workspace collaboration platform built with the MERN stack. Designed for speed, scalability, and a modern user experience.

---

## 🚀 Overview

This platform enables teams to communicate efficiently through workspaces, channels, and private direct messages. Inspired by industry standards like Slack and Discord, it focuses on real-time interactivity and a clean, minimalist design.

### Key Features
- **Real-time Messaging**: Instant communication powered by Socket.IO.
- **Workspace Management**: Organise your team into distinct workspaces with unique slugs.
- **Room-based Chat**: Group discussions in channels with topic support.
- **Private DMs**: Secure one-to-one conversations (In Progress).
- **User Presence**: Real-time online/offline status tracking (In Progress).
- **Modern UI**: A Geist-inspired interface built with Tailwind CSS and React.

---

## 🏗️ Architecture

The project follows a **Feature-First** architecture to ensure maintainability and scalability.

- **Frontend**: React (Vite) + TypeScript + Zustand + Tailwind CSS.
- **Backend**: Node.js + Express + TypeScript + Mongoose.
- **Real-time**: Socket.IO for event-driven updates.
- **Database**: MongoDB for persistent storage.

Detailed documentation can be found in [docs/architecture.md](./docs/architecture.md).

---

## 📂 Project Structure

```text
.
├── client/           # Frontend React application
├── server/           # Backend Node.js API
├── docs/             # Comprehensive documentation
├── LICENSE           # MIT License
└── README.md         # This file
```

---

## 🛠️ Quick Start

### Prerequisites
- Node.js (v18+)
- MongoDB

### Installation

1. **Clone the repo**
   ```bash
   git clone <repository-url>
   ```

2. **Install dependencies**
   ```bash
   # Root
   cd client && npm install
   cd ../server && npm install
   ```

3. **Environment Setup**
   Configure your `.env` files in both `client/` and `server/` directories.

4. **Run Development Mode**
   ```bash
   # Terminal 1
   cd server && npm run dev
   
   # Terminal 2
   cd client && npm run dev
   ```

---

## 📚 Documentation

Explore our detailed guides:
- [📖 Architecture Overview](./docs/architecture.md)
- [🛠️ Development Guide](./docs/development.md)
- [🔌 API & Sockets](./docs/api.md)
- [🎨 Design System](./docs/design.md)
- [🗺️ Project Roadmap](./docs/roadmap.md)
- [🚀 Deployment Guide](./docs/deployment.md)
- [🤝 Contributing Guide](./docs/contributing.md)
- [⚖️ Code of Conduct](./docs/code-of-conduct.md)
- [🛡️ Security Policy](./docs/security.md)

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE).
