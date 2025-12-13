# Budgeto v2

Modern, fast, and accessible personal budgeting app built with React Router v7, TypeScript, and SCSS modules. Budgeto focuses on a delightful mobile-first experience with near-instant loads, clear navigation, and strong accessibility — while staying developer-friendly with strict TypeScript, testing, and linting.

## Highlights

- **Mobile-first UX:** Optimized for the visible viewport on phones; fluid layouts and responsive typography.
- **Performance-first:** Targets sub-1s page loads on 3G via code-splitting, caching, and lazy-loading.
- **Accessibility:** WCAG 2.1 AA baseline (striving to AAA where practical) with semantic HTML, ARIA, and focus management.
- **Type-safe:** TypeScript in strict mode, individual named imports, and modern React hooks.
- **File-based routing:** React Router v7 with generated types (excluded from linting).
- **Styling:** SCSS modules with best practices; no Tailwind.
- **Testing:** Vitest + React Testing Library for unit/integration; Playwright for end-to-end.
- **Quality:** ESLint (flat config), Prettier, and import sorting for consistent code style.

## Tech Stack

- `React Router v7` for routing and data APIs
- `TypeScript` (strict), Vite for build/dev
- `SCSS modules` for component-scoped styles
- `Vitest` + `@testing-library/react` for tests
- `Playwright` for E2E
- `ESLint` + `Prettier` + `simple-import-sort`
- Optional: Radix UI for marketing/primitive components (no Tailwind)

## Repository Structure

````
Dockerfile
# Budgeto v2 💸📊
react-router.config.ts
## Highlights ✨
tsconfig.json
vite.config.ts
public/
src/
	app.css
	root.tsx
	routes.ts
	routes/
		home.tsx
## Tech Stack 🧰
		welcome.tsx
## Repository Structure 📁

## Getting Started 🚀

Start development server:

- Node.js 18+ and npm 9+ (macOS, zsh)

Install dependencies:
Build for production:
```bash
npm install
````

Preview production build:

```bash
npm run dev
```

## Routing & Generated Types 🗺️

Type-check and lint:

## Styling Guidelines 🎨

````bash
## Performance Strategy ⚡
npm run lint
## Accessibility Checklist ♿

## State Management 🧠

## Testing ✅
npm run build

Preview production build:

## Storybook 📚
npm run preview
## Linting & Formatting 🧹

## Deployment 🛳️

## CI/CD 🤖
- Router types are generated under `.react-router/`. These are excluded from linting and should not be edited manually.
## Roadmap 🗓️
## Styling Guidelines
## Contributing 🤝
- SCSS modules only; follow BEM-ish naming and keep styles component-scoped.
## License 📄
- Maintain WCAG AA color contrast; prefer semantic HTML elements.

## Performance Strategy

- React lazy + `Suspense` for route/component splitting.
- Shadow loading: reserve minimum heights and show lightweight skeletons/spinners.
- Intersection Observer to defer offscreen images/content.
- SVG icons for crisp, scalable graphics.
- Service Worker for offline cache and repeat-visit speed.
- Cache-first static assets via CDN (recommended in deployment).

## Accessibility Checklist

- Keyboard navigable with visible focus states.
- Proper roles and ARIA where necessary.
- Manage focus on dialogs and route transitions.
- Test with screen readers; ensure semantic structure.

## State Management

- Prefer React hooks/state.
- Use Context for global app state.
- Consider Redux only for complex cross-route state.

## Testing

Unit & Integration (Vitest + RTL):

```bash
npm run test
````

End-to-End (Playwright):

```bash
npm run test:e2e
```

Targets:

- 90%+ unit test coverage
- Real-user flows in E2E (auth, navigation, add income/expense, summaries)

## Storybook

- Storybook documents components in isolation using Vite.

Start Storybook:

```bash
npm run storybook
```

Build Storybook static site:

```bash
npm run build:storybook
```

## Linting & Formatting

- ESLint flat config aligned with React Router v7.
- Prettier enforced; import order via `simple-import-sort`.
- Generated router types are ignored (`.react-router/**`).

Auto-fix on save in VS Code (recommended):

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ]
}
```

## Deployment

- Build static assets with Vite and serve behind a CDN.
- Use service workers and caching headers for fast repeat visits.
- Consider Docker for containerized deployments (`Dockerfile` included).

## CI/CD

- Recommended: GitHub Actions to run typecheck, lint, tests, and build on every push/PR.
- Optional: deploy preview using Vercel/Netlify; publish Storybook as an artifact.

## Roadmap

- Dashboard charts and insights (donut, trends).
- Offline-first budgeting workflows.
- Import/export CSV and bank integrations.
- Theming (high contrast/dark mode) while preserving accessibility.

## Contributing

- Use named imports; avoid `*` imports.
- Keep components functional; no class components.
- Maintain strict TypeScript and SCSS best practices.
- Add/maintain tests and stories for new components.

## License

Copyright © Budgeto v2
