# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Anytools is a client-side-only developer utility suite (React 19 + Vite + TanStack Router + Tailwind v4, pnpm). Every tool runs in the browser; there is no backend, so don't add server calls.

## Commands

- `pnpm dev` — Vite+ dev server (the toolchain is Vite+: scripts wrap `vp`; requires Node ^22.18 or ^24.11)
- `pnpm build` / `pnpm preview`
- `pnpm test` — `vp test run` (jsdom + Testing Library are installed; no test files exist yet). Single file: `pnpm vp test run path/to/file.test.ts`
- `pnpm check` — `vp check` (Oxlint + Oxfmt + type check) (`pnpm lint` / `pnpm format` for each alone)
- `pnpm generate-routes` — regenerate `src/routeTree.gen.ts` (also done automatically by the Vite plugin; never edit it by hand)

Format/lint config lives in the `fmt`, `lint` and `staged` blocks of `vite.config.ts` (tabs, single quotes, no semicolons, width 100). A pre-commit hook (`.vite-hooks/pre-commit`) runs `vp staged`. Suppress lint with `// oxlint-disable-next-line <rule> -- reason`. Use the `@/*` alias for `src/*`.

## Architecture

- **Routing**: file-based TanStack Router in `src/routes/`. There is a single dynamic tool route, [src/routes/tools/$toolId.tsx](src/routes/tools/$toolId.tsx), which looks up the tool in the registry, renders the shared page header, and lazy-loads the tool component inside `Suspense`.
- **Tool registry**: [src/utils/tools-registry.ts](src/utils/tools-registry.ts) (`TOOLS`) is the source of metadata (id, name, description, category, icon, tags) used by the dashboard, sidebar, and command palette.
- **Adding a tool** requires touching both places: add an entry to `TOOLS`, and add a `React.lazy` import plus an entry in the `TOOL_COMPONENTS` map in `$toolId.tsx` (keyed by the same id). Ids without a component fall back to `tools/stub`.
- **Tool layout** (`src/components/tools/<tool-id>/`): `index.ts` re-exports the default component (`export { default } from './<tool-id>'`, required for `React.lazy`), `<tool-id>.tsx` is the UI, and pure logic should live in `utils.ts` next to it (see [CONVENTIONS.md](CONVENTIONS.md)); today only some tools do, and the helper files are inconsistently named (`color-utils.ts`, `helpers.ts`, `curl-parsers.ts`, `converter.ts`, …).
- **Shared UI**: `src/components/tools/shared/` (panes, editor pane, code block, border box) for tool internals; `src/components/ui/` for shadcn/Radix-based primitives (strictly typed); `src/components/layout/` for header, sidebar, command palette, theme button; `src/components/dashboard/` for the home page.
- **Theming**: `src/contexts/theme-context.tsx` provides light/dark theme; the HTML sandbox syncs its iframe theme with it. Styling uses a "cyber terminal" aesthetic (`terminal-*`, `matrix`, `crt`, `scanlines` utilities defined in `src/styles.css`).
- **Build**: `vite.config.ts` splits `@faker-js` and React/TanStack into manual vendor chunks.
