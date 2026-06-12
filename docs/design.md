# Design System & User Flow

This document defines the visual identity and interaction patterns of the application.

---

## 1. Visual Identity (Geist Style)

The application follows a clean, minimalist design language inspired by Vercel's Geist design system.

### Color Palette
- **Primary**: `#171717` (Deep Ink) - Used for primary CTAs and text.
- **Canvas**: `#ffffff` (Pure White) - Card and modal surfaces.
- **Canvas Soft**: `#fafafa` - Default page background.
- **Success/Link**: `#0070f3` - Interactive elements and success states.
- **Error**: `#ee0000` - Destructive actions and errors.

### Typography
- **Primary Font**: Geometric Sans-serif (Geist/Inter).
- **Monospace Font**: Technical labels and code (Geist Mono).
- **Headings**: Sentence-case, often terminated with a period for a deliberate voice.

### Spacing & Shapes
- **Base Unit**: `4px`.
- **Border Radius**:
  - `6px` (`rounded-sm`): Base UI (buttons, inputs).
  - `8px` (`rounded-md`): Standard cards.
  - `Pill`: Marketing-scale buttons.

---

## 2. Screen Flow

### Authentication
1.  **Login/Register**: User enters credentials.
2.  **Redirect**: Landing page after auth.

### Workspaces
1.  **Workspace List**: User selects or creates a workspace.
2.  **Workspace Home**: Defaults to the `#general` room.

### Chat Journey
1.  **Sidebar**: Select Room or DM.
2.  **Chat Panel**: View history, type message, see live updates.
3.  **Member Panel**: Inspect who else is in the workspace/room.

---

## 3. Interaction Principles

- **Speed**: UI should feel instantaneous (Optimistic updates for messages).
- **Clarity**: High contrast and generous whitespace.
- **Feedback**: Loading states (skeletons), success toasts, and clear error messages.
