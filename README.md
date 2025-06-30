# Project Management System (PMS)

Welcome to the Project Management System (PMS) Web App, a modern web application designed to streamline project management. Built with [Next.js](https://nextjs.org), this application offers a robust platform for managing tasks, events, reminders, and content within collaborative workspaces.

## Tech Stack and Components

| **Use**                       | **Tech**                          |
|-------------------------------|-----------------------------------|
| Framework                    | Next.js (15.3.4)                |
| UI Library                   | React (19.0.0), React DOM (19.0.0) |
| Type Safety                  | TypeScript                      |
| Styling                      | Tailwind CSS                    |
| Authentication               | NextAuth.js (4.24.11), @auth/core (0.34.2), @auth/drizzle-adapter (1.10.0) |
| Database ORM                 | Drizzle ORM (0.44.2), Drizzle Kit (0.31.4) |
| Database Client              | LibSQL (0.15.9) with Turso      |
| UI Components (Primitives)   | Radix UI (Avatar, Dialog, Dropdown Menu, Label, Slot, Icons) |
| UI Design System             | Shadcn/UI (built on Radix UI and Tailwind CSS) |
| Animation                    | Motion (12.19.2)                |
| Markdown Rendering           | React Markdown (10.1.0)         |
| Styling Utilities            | Class Variance Authority (0.7.1), Clsx (2.1.1), Tailwind Merge (3.3.1) |
| Icons                        | Lucide React (0.525.0)          |
| Date Handling                | Date-fns (4.1.0)                |
| Password Hashing             | Bcryptjs (3.0.2)                |
| Development Tools            | ESLint, ESLint Config Next (15.3.4), Dotenv (17.0.0), NPM (as package manager) |
| Animation Library            | TW Animate CSS (1.3.4)          |
| UI Component Library         | Magic UI                        |

**UI Components Overview:**

- **Radix UI Components (from `components/ui`):**
  - Avatar
  - Button
  - Card
  - Dialog
  - Dropdown Menu
  - Input
  - Label
  - Textarea

- **Magic UI Components (from `components/magicui`):**
  - Animated Circular Progress Bar
  - Animated List
  - Animated Shiny Text
  - Border Beam
  - File Tree
  - Interactive Hover Button
  - Magic Card
  - Number Ticker

## Application Structure

- **Users**: Individuals who interact with the system. Users can have profiles, manage personal settings, and belong to one or more workspaces.
- **Workspaces**: Collaborative environments where users group together to work on related projects. Each workspace can contain multiple projects and serves as a container for shared resources and settings.
- **Projects**: Specific initiatives or endeavors within a workspace. Projects are the central unit for organizing tasks, events, reminders, and content.
  - **Tasks**: Actionable items or to-dos within a project. Tasks can be assigned to users, have deadlines, and track progress.
  - **Events**: Scheduled occurrences related to a project, such as meetings or milestones.
  - **Reminders**: Notifications or alerts tied to tasks or events to ensure timely follow-ups.
  - **Content**: Documentation, notes, or markdown-based information associated with a project for knowledge sharing or reference.
