# Development Guide

Welcome to the development guide. This document outlines the setup process, coding conventions, and best practices for this project.

---

## 1. Project Setup

### Prerequisites
- **Node.js**: v18 or higher
- **MongoDB**: Local instance or MongoDB Atlas
- **npm** or **yarn**

### Installation
1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd <project-folder>
    ```

2.  **Install dependencies**:
    ```bash
    # Root (if using workspace) or separately:
    cd client && npm install
    cd ../server && npm install
    ```

3.  **Environment Variables**:
    - Create a `.env` file in the `server/` directory based on `.env.example`.
    - Create a `.env` file in the `client/` directory if needed (e.g., `VITE_API_URL`).

### Running the App
- **Backend**: `cd server && npm run dev`
- **Frontend**: `cd client && npm run dev`

---

## 2. Coding Conventions

### Language & Tooling
- **TypeScript**: Always use strict typing. Avoid `any`.
- **Linting**: ESLint with recommended configurations.
- **Formatting**: Prettier for consistent code style.

### Naming
- **Files**: `kebab-case` for general files, `PascalCase` for React components.
- **Variables/Functions**: `camelCase`.
- **Interfaces/Types**: `PascalCase`.

### CSS & Styling
- **Tailwind CSS**: Primary styling utility.
- **Vanilla CSS**: Used for complex animations or specific overrides.
- **Design System**: Follow the Vercel/Geist aesthetic (clean lines, generous whitespace, monochrome primary palette).

---

## 3. UI Components

The project uses a custom UI kit inspired by ShadCN/Geist.

### Buttons
- **Primary**: Black pill buttons for main actions.
- **Secondary**: White/Outline buttons for secondary actions.
- **Ghost**: For low-priority navigation.

### Cards
- Use standard `8px` border-radius (`rounded-md`).
- Layered shadows for depth (`shadow-sm`, `shadow-md`).
- Consistent padding (typically `p-6`).

---

## 4. Git Workflow

1.  **Branching**: Use `feature/`, `bugfix/`, or `refactor/` prefixes.
2.  **Commits**: Follow [Conventional Commits](https://www.conventionalcommits.org/).
3.  **Pull Requests**: Ensure tests pass and code is reviewed before merging.
