# Project Architecture

This document provides a comprehensive overview of the application's architecture, data models, and design principles.

---

## 1. High-Level Overview

This project is a **real-time chat application built with the MERN stack** (MongoDB, Express, React, Node.js). It is designed to be a scalable foundation for communication, featuring authentication, workspace management, private conversations (DMs), and room-based group communication.

### Core Design Principles

1.  **Feature-first organization**: Each business feature stays inside its own folder in both frontend and backend.
2.  **Separation of concerns**: UI, business logic, networking, and storage are decoupled.
3.  **Reusable building blocks**: Shared UI and common utilities live in shared folders.
4.  **Scalable modules**: Backend features are isolated to allow independent growth.
5.  **Real-time + Persistent data split**: WebSocket (Socket.IO) handles live events, while HTTP APIs handle persistence and fetching.

---

## 2. Frontend Architecture

The frontend is located in the `client/` directory and is built with **React** and **TypeScript**.

### Directory Structure

```bash
client/
└── src/
    ├── app/             # Application bootstrap and global wiring
    │   ├── routes/      # React Router configuration
    │   ├── providers/   # Global context providers (Query, Auth, etc.)
    │   ├── stores/      # Global state management (Zustand)
    │   └── guards/      # Route protection (AuthGuard, GuestGuard)
    │
    ├── feat/            # Feature-based business logic
    │   ├── auth/        # Authentication flows
    │   ├── workspaces/  # Workspace management
    │   ├── chat/        # Messaging logic
    │   ├── rooms/       # Room management
    │   ├── users/       # User profiles and search
    │   ├── presence/    # User online status
    │   └── notifications/ # System notifications
    │
    ├── shared/          # Reusable code across features
    │   ├── layouts/     # Page layouts (AppLayout, AuthLayout, etc.)
    │   ├── components/  # Common UI (ShadCN), forms, feedback
    │   ├── constants/   # Shared constants
    │   ├── hooks/       # Shared React hooks
    │   ├── services/    # Shared business services
    │   ├── types/       # Shared TypeScript types
    │   ├── utils/       # Shared utility functions
    │   └── assets/      # Global assets (images, icons)
    │
    ├── services/        # App-wide infrastructure services
    │   ├── api/         # Axios instance and base API setup
    │   ├── socket/      # Socket.IO client setup
    │   ├── storage/     # LocalStorage wrappers
    │   └── logger/      # Client-side logging
    │
    ├── utils/           # Generic helper functions
    ├── styles/          # Global CSS and Tailwind configuration
    ├── scripts/         # Support scripts
    └── types/           # Global type definitions
```

---

## 3. Backend Architecture

The backend is located in the `server/` directory and is built with **Node.js**, **Express**, and **TypeScript**.

### Directory Structure

```bash
server/
└── src/
    ├── app.ts           # Express application setup
    ├── server.ts        # Server entry point
    ├── socket.ts        # Socket.IO server initialization
    │
    ├── config/          # Environment variables and DB config
    │
    ├── modules/         # Feature-based backend modules
    │   ├── auth/        # Auth controllers, services, and routes
    │   ├── workspaces/  # Workspace management
    │   ├── users/       # User management
    │   ├── conversations/ # Private messaging logic
    │   ├── messages/    # Message persistence
    │   ├── rooms/       # Group chat management
    │   ├── presence/    # Real-time presence tracking
    │   └── notifications/ # Notification logic
    │
    ├── sockets/         # Socket.IO logic
    │   ├── handlers/    # Event handlers (message, room, etc.)
    │   └── middleware/  # Socket authentication and logging
    │
    ├── middlewares/     # Express global middlewares (Auth, Error handling)
    ├── repositories/    # Database abstraction layer (Mongoose models)
    ├── services/        # Cross-module business logic
    ├── utils/           # Helper functions
    ├── validators/      # Request validation (Zod/Joi)
    └── types/           # Backend TypeScript types
```

---

## 4. Data Model (Schema)

The application uses **MongoDB** with **Mongoose**. Below are the primary entities:

### User
```typescript
{
  username: string;       // Unique
  email: string;          // Unique
  password: string;       // Hashed
  displayName: string;
  avatarUrl: string;
  status: 'online' | 'offline' | 'away';
  lastSeen: Date;
}
```

### Workspace
```typescript
{
  name: string;
  slug: string;           // Unique, used in URLs
  description: string;
  ownerId: ObjectId;      // Reference to User
  avatarUrl: string;
}
```

### Room (Channel)
```typescript
{
  workspaceId: ObjectId;
  name: string;
  topic: string;
  isPrivate: boolean;
  createdBy: ObjectId;
  members: ObjectId[];    // Array of User references
}
```

### Message
```typescript
{
  content: string;
  senderId: ObjectId;
  workspaceId: ObjectId;
  targetId: ObjectId;     // Can be RoomId or UserId (for DMs)
  type: 'text' | 'image' | 'file';
  metadata: Object;       // File details, etc.
  reactions: [
    {
      userId: ObjectId,
      emoji: string
    }
  ];
  isEdited: boolean;
  deletedAt: Date;
}
```

### Conversation (DM Metadata)
```typescript
{
  workspaceId: ObjectId;
  participants: ObjectId[]; // Exactly 2 Users for DMs
  lastMessageAt: Date;
}
```

---

## 5. System Lifecycles

### Request Lifecycle
1.  **Client Request**: Frontend sends HTTP request (Axios).
2.  **Middleware**: Backend validates JWT and permissions.
3.  **Controller**: Extracts data and calls appropriate service.
4.  **Service**: Executes business logic and interacts with Repository.
5.  **Repository**: Performs DB operations (Mongoose).
6.  **Response**: Formatted JSON returned to client.

### Message Lifecycle (Real-time)
1.  **Emit**: Client sends `SEND_MESSAGE` via Socket.
2.  **Handle**: `message.handler.ts` validates and persists message to DB.
3.  **Broadcast**: Socket.IO broadcasts to all members in the Room or the specific recipient in DMs.
4.  **Acknowledge**: Sender receives confirmation; recipients receive the message event and update UI.

### Presence Lifecycle
1.  **Connect**: User connects to Socket; marked as `online`.
2.  **Heartbeat**: Periodic pings ensure connection is alive.
3.  **Disconnect**: User closes app; Socket disconnects; marked as `offline` after a short grace period.
