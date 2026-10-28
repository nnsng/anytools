# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Anytools is a client-side-only developer utility suite (React 19 + Vite + TanStack Router + Tailwind v4, pnpm). Every tool runs in the browser; there is no backend, so don't add server calls.

## Commands

- `pnpm dev` — Vite+ dev server (the toolchain is Vite+: scripts wrap `vp`; requires Node ^22.18 or ^24.11)
- `pnpm build` / `pnpm preview`
- `pnpm test` — `vp test run` (Vitest, tests in `*.test.ts` beside the code, run in Node with no DOM, so keep tested logic free of `window`/`document`). Single file: `pnpm vp test run path/to/file.test.ts`
- `pnpm check` — `vp check` (Oxlint + Oxfmt + type check) (`pnpm lint` / `pnpm format` for each alone)
- `pnpm generate-routes` — regenerate `src/routeTree.gen.ts` (also done automatically by the Vite plugin; never edit it by hand)

Format/lint config lives in the `fmt`, `lint` and `staged` blocks of `vite.config.ts` (tabs, single quotes, no semicolons, width 100). The pre-commit hook (`.vite-hooks/pre-commit`) runs `vp staged` = `vp check --fix` on staged files, so a commit can reformat files. Suppress lint with `// oxlint-disable-next-line <rule> -- reason`. Use the `@/*` alias for `src/*`.

Vite+ re-exports its tools: import `defineConfig` from `vite-plus` and test helpers (`describe`, `it`, `expect`) from `vite-plus/test`, never from `vite`/`vitest` (a lint rule enforces this). `.nvmrc` pins Node 24.

## Architecture

- **Routing**: file-based TanStack Router in `src/routes/`; the router is created in `src/main.tsx` (`src/router.tsx` is unused). There is a single dynamic tool route, [src/routes/tools/$toolId.tsx](src/routes/tools/$toolId.tsx), which looks up the tool in the registry, renders the shared page header, and lazy-loads the tool component inside `Suspense`.
- **Tool registry**: [src/utils/tools-registry.ts](src/utils/tools-registry.ts) (`TOOLS`) is the source of metadata (id, name, description, category, icon, tags) used by the dashboard, sidebar, and command palette. `CATEGORIES` in the same file fixes the group order; `groupToolsByCategory` sorts tools by name inside each group.
- **Adding a tool**: create the folder and add an entry to `TOOLS`; the component is found by folder name through `import.meta.glob` in [src/utils/tool-components.ts](src/utils/tool-components.ts) (no manual map). `tools-registry.test.ts` checks every id has a folder. Full rules in [CONVENTIONS.md](CONVENTIONS.md).
- **Tool layout** (`src/components/tools/<tool-id>/`): `index.ts` re-exports the default component, `<tool-id>.tsx` is the UI, pure logic lives in `utils.ts` (+ `utils.test.ts`, `types.ts`, `samples.ts`). Shared pieces: `tools/shared/` (EditorPane, FormatterTool, ColorField…), `src/hooks/` (`useCopyToClipboard`, `useDebouncedValue`), `src/lib/` (`file.ts`, `convert.ts`).
- **Shared UI**: `src/components/ui/` holds shadcn/Radix-based primitives (strictly typed); `src/components/layout/` for header, sidebar, command palette, theme button; `src/components/dashboard/` for the home page.
- **Theming**: `src/contexts/theme-context.tsx` provides light/dark theme and swaps the favicon (`favicon.svg` / `favicon-light.svg`); an inline script in `index.html` applies the saved theme before first paint, and the HTML sandbox syncs its iframe theme. Status colors must work in both themes (see `src/lib/styles.ts` and CONVENTIONS.md). Styling uses a "cyber terminal" aesthetic (`terminal-*`, `matrix`, `crt`, `scanlines` utilities defined in `src/styles.css`).
- **Build**: `vite.config.ts` splits React and TanStack Router into `react-vendor` / `router-vendor` chunks; heavy tool dependencies stay in per-tool lazy chunks (`jsqr` is imported on demand). Devtools load only in dev.
- **Routing errors**: unknown tools and routes render `layout/not-found.tsx`; tool crashes are caught by the route `errorComponent` in `$toolId.tsx`.

## Gotchas

- Radix `TabsContent` unmounts inactive tabs, so their state is lost. Tools that must keep input across tabs use `forceMount` plus `data-[state=inactive]:hidden` (see `jwt-debugger.tsx`).
- CPU-bound or untrusted work must not run on the main thread: regex matching runs in a Web Worker with a timeout (`tools/regex-tester/use-regex-matcher.ts`, `regex.worker.ts`). Heavy libraries are loaded with `import()` on demand.
- Tools derive output with `useMemo` (+ `useDeferredValue`) from input state; avoid copying derived data into state from effects.
- Anything rendered with `dangerouslySetInnerHTML` must go through DOMPurify; user HTML/JS only runs in the sandboxed iframe (no `allow-same-origin`).
