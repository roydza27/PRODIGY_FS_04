# API Documentation

This document describes the REST API endpoints and Socket.IO events used in the application.

---

## 1. Authentication

### POST `/api/auth/register`
Create a new user account.
- **Body**: `{ username, email, password, displayName }`
- **Response**: `{ user, token }`

### POST `/api/auth/login`
Sign in to an existing account.
- **Body**: `{ email, password }`
- **Response**: `{ user, token }`

### GET `/api/auth/me`
Get current authenticated user.
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ user }`

---

## 2. Workspaces

### GET `/api/workspaces`
List all workspaces for the current user.
- **Response**: `[ { id, name, slug, ... } ]`

### POST `/api/workspaces`
Create a new workspace.
- **Body**: `{ name, slug, description }`
- **Response**: `{ workspace }`

### GET `/api/workspaces/:slug`
Get workspace details by slug.
- **Response**: `{ workspace, members, rooms }`

---

## 3. Rooms

### GET `/api/rooms/:workspaceId`
List all rooms in a workspace.
- **Response**: `[ { id, name, topic, ... } ]`

### POST `/api/rooms`
Create a new room in a workspace.
- **Body**: `{ workspaceId, name, topic, isPrivate }`
- **Response**: `{ room }`

---

## 4. Messages

### GET `/api/messages/:targetId`
Fetch message history for a room or DM.
- **Query Params**: `limit`, `before` (for pagination)
- **Response**: `[ { id, content, sender, ... } ]`

---

## 5. Socket.IO Events

### Client -> Server

| Event | Data | Description |
|---|---|---|
| `JOIN_WORKSPACE` | `{ workspaceId }` | Joins the workspace-wide socket room. |
| `JOIN_ROOM` | `{ roomId }` | Joins a specific chat room. |
| `SEND_MESSAGE` | `{ targetId, content, type }` | Sends a message to a room or user. |
| `TYPING_START` | `{ targetId }` | Signals user has started typing. |
| `TYPING_STOP` | `{ targetId }` | Signals user has stopped typing. |

### Server -> Client

| Event | Data | Description |
|---|---|---|
| `NEW_MESSAGE` | `{ message }` | Received when a new message is sent in a joined room. |
| `USER_PRESENCE` | `{ userId, status }` | Received when a workspace member changes status. |
| `USER_TYPING` | `{ userId, targetId }` | Received when another user is typing. |
| `NOTIFICATION` | `{ type, data }` | System notifications (mentions, invites). |
