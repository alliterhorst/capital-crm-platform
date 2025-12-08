# Capital CRM – Frontend Application

This is the frontend application for the **Capital CRM Platform**.  
It is a **Single Page Application (SPA)** built with **React** inside an **Nx Monorepo**, focusing on performance, scalability, and type safety.

---

## 🔰 Tech & Tooling

[![Nx](https://img.shields.io/badge/Nx-monorepo-143055?logo=nx&logoColor=white)](https://nx.dev/)
[![React](https://img.shields.io/badge/React-18-61dafb?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-bundler-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![shadcn/ui](https://img.shields.io/badge/shadcn-ui-000000)](https://ui.shadcn.com/)
[![Orval](https://img.shields.io/badge/Orval-API%20codegen-000000)](https://orval.dev/)
[![React Hook Form](https://img.shields.io/badge/React%20Hook%20Form-forms-EC5990?logo=reacthookform&logoColor=white)](https://react-hook-form.com/)
[![Zod](https://img.shields.io/badge/Zod-schema%20validation-3E67B1)](https://zod.dev/)
[![Axios](https://img.shields.io/badge/Axios-HTTP%20client-5A29E4?logo=axios&logoColor=white)](https://axios-http.com/)

---

## 📚 Overview

- **Architecture:** Feature-oriented (Feature-Sliced inspired)
- **Code sharing:** Centralized `shared` layer for API clients, UI primitives, hooks and utilities
- **API integration:** Orval-generated clients + hooks based on backend OpenAPI/Swagger
- **Styling:** Tailwind CSS + design tokens via CSS variables
- **DX:** Nx tasks for serving, building, linting, and code generation

---

## 📂 Project Structure

The application follows a **feature-oriented structure** to keep responsibilities clear and the codebase maintainable:

```text
apps/front-end/src/
├── app/                # App-wide setup: router, layout, providers, error boundaries
├── features/           # Business features (e.g., auth, dashboard, clients)
├── widgets/            # Composite UI blocks (e.g., Sidebar, Header, layout shells)
├── pages/              # Route-level components (page entries for router)
├── shared/             # Cross-cutting reusable modules
│   ├── api/            # Orval-generated API clients & Axios instances
│   ├── components/     # Reusable business components (domain-aware)
│   ├── config/         # Static configuration (navigation, app metadata, constants)
│   ├── hooks/          # Reusable React hooks (e.g., useToast, useBreakpoint)
│   ├── lib/            # Utilities and helpers (formatters, mappers, etc.)
│   └── ui/             # Design-system primitives (Buttons, Inputs, Cards – shadcn-based)
└── main.tsx            # Application entry point (bootstraps React app)
```

**Guidelines:**

- Prefer **`features/`** for code that belongs to a specific domain or use case.
- Use **`widgets/`** for higher-level layout blocks composed of multiple components.
- Keep **`shared/ui`** focused on **generic, reusable UI primitives** (no domain logic).
- Use **`shared/components`** for **domain-aware** components that can be reused in multiple features.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** – LTS version (recommended)
- A package manager such as **npm**, **pnpm**, or **yarn**
- Nx CLI (optional but recommended):

```bash
npm install -g nx
```

### Install dependencies

From the monorepo root:

```bash
npm install
# or
pnpm install
# or
yarn install
```

### Run the frontend in development mode

```bash
npx nx serve front-end
```

By default, the dev server runs at:

```text
http://localhost:5173
```

_(or the port configured when the app was generated in Nx)_

---

## 🧰 Nx Commands & Scripts

All common tasks are exposed as Nx targets.

### Core commands

| Command                  | Description                                            |
| ------------------------ | ------------------------------------------------------ |
| `npx nx serve front-end` | Starts the development server (Vite).                  |
| `npx nx build front-end` | Builds a production bundle into `dist/apps/front-end`. |
| `npx nx lint front-end`  | Runs ESLint for linting and basic static analysis.     |
| `npx nx test front-end`  | Runs unit tests (Vitest) for the frontend application. |

> Tip: you can explore the project graph with `npx nx graph`.

---

## 🤖 API Code Generation (Orval)

The project uses **Orval** to generate TypeScript types, Axios clients, and React Query hooks based on the backend's OpenAPI/Swagger specification.

This gives us:

- ✅ **Type safety:** Types are generated directly from the API contract.
- ✅ **Productivity:** Data-fetching hooks are ready to use in React components.
- ✅ **Consistency:** All API calls share the same conventions and error handling.

### Updating the API client

Whenever the backend specification changes (new endpoints, fields, or models), regenerate the client:

```bash
npx nx run front-end:generate-client
```

This command:

- Reads the Orval configuration (e.g., `orval.config.ts` in the repo).
- Regenerates the client code under `apps/front-end/src/shared/api/generated` (or the configured output path).

Make sure to commit the regenerated files together with the backend/API changes that require them.

---

## 🧩 UI Components (shadcn/ui)

We use **shadcn/ui** as the foundation for the internal design system (stored in `shared/ui`).

### Adding new UI components

Use the dedicated Nx target to invoke the `shadcn` CLI within the frontend context:

```bash
# Example: add a Select component
npx nx run front-end:shadcn -- add select
```

The component files will be generated under `apps/front-end/src/shared/ui` following the local design system conventions.

### UI command wrapper

There is also a helper target for UI-related scripts, with improved logging and color output:

```bash
npx nx run front-end:ui
```

Use this target for internal automation of UI tasks (e.g., batch updates, tokens sync, etc.).

---

## 🎨 Styling & Theming

Styling is handled with **Tailwind CSS** and design tokens defined via **CSS variables** (e.g., in `src/styles.css`).

Current base configuration:

- **Primary color:** `#EC6724`
- **Font family (body):** `Inter`
- **Font family (navigation/sidebar):** `Geologica`
- **Border radius:** `4px` (small rounded corners)

To customize the theme:

1. Update CSS variables in `apps/front-end/src/styles.css` (colors, radii, spacing).
2. Adjust Tailwind configuration in `tailwind.config.js` (or `tailwind.config.cjs`) to map tokens to utility classes.
3. Keep base tokens generic (e.g., `--color-primary`) and compose specific variants (e.g., hover, muted) from them.

---

## 🧱 Architecture Notes

- The frontend is designed to work as part of the **Capital CRM monorepo**, sharing tooling and patterns with other apps and libraries.
- Communication with the backend is fully typed and **contract-driven** through Orval.
- New features should:
  - Live under `features/<feature-name>` with their own hooks, types, and components.
  - Use API clients from `shared/api` instead of calling Axios directly.
  - Prefer `shared/ui` primitives for visual consistency.
