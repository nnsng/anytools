# Coding Conventions

Rules below are derived from how the codebase is already written. Formatting and basic lint rules are enforced by `vp check` and the pre-commit hook; this file covers what tooling does not.

## Tooling

- Format/lint config lives in `vite.config.ts` (`fmt`, `lint`, `staged`). Do not add separate config files.
- Run `pnpm check` before committing. Don't suppress a rule without a reason: `// oxlint-disable-next-line <rule> -- why`.
- Import via the `@/*` alias; avoid `../../` that leaves a tool folder.

## Folder structure

```
src/components/tools/<tool-id>/
  index.ts          export { default } from './<tool-id>'   (required for React.lazy)
  <tool-id>.tsx     top-level component, default export
  <part>.tsx        sub-components, named exports
  use-<name>.ts(x)  hooks specific to the tool
  utils.ts          pure logic (parse/convert/format), no React
  types.ts          types shared inside the tool
```

- A tool folder never imports from another tool folder. Shared UI goes to `tools/shared/`, shared logic to `src/lib/`.
- `components/ui/` is shadcn-generated primitives only; no tool-specific code.
- Folder and file names: kebab-case. One component per file, file named after the component.

## Naming and exports

- Components: PascalCase. Hooks: `useX`. Constants: `UPPER_SNAKE_CASE`. Everything else: camelCase.
- Default export only for the tool entry component (needed by `React.lazy`). Everything else uses named exports.
- Props type: `type XProps = {...}` declared above the component, not inline.
- Use `type`, not `interface`, unless declaration merging is needed.
- No `any`. If unavoidable, use `unknown` and narrow; otherwise disable the rule with a reason.

## React

- Keep components focused: **~150 lines max**. When a component needs more than ~6 `useState`, extract a hook (`use-<name>.ts`) or split into sub-components.
- Derive values during render or with `useMemo`; don't mirror props/derived data into state with an effect.
- Async work in `useEffect` must guard against stale results (cancel flag or `AbortController`) and must be `void`-ed explicitly if not awaited.
- List `key`s are stable ids, not array indexes, unless the list is static.
- Business logic never lives in JSX handlers: handlers call functions from `utils.ts`.

## Styling

- Tailwind only; compose classes with `cn()`.
- Use theme tokens (`text-foreground`, `text-muted-foreground`, `bg-terminal-*`, `text-matrix`) instead of raw palette colors such as `text-slate-500`, so light/dark themes both work.
- Repeated class strings (3+ uses) become a component or a `cva` variant.

## Errors and side effects

- Tool input is user-typed and often invalid: parse functions return a result (`{ ok, value | error }`) or throw a typed error that the component turns into UI. No `console.*` for expected failures; show them in the tool.
- Browser APIs (clipboard, file reading, `localStorage`) are wrapped once in a shared helper/hook, not re-implemented per tool. Wrap `localStorage` access in try/catch.
- Everything stays client-side. Never send user input to a network endpoint.

## Security

- Any HTML rendered with `dangerouslySetInnerHTML` must be sanitized first, or rendered in a sandboxed iframe (as `html-sandbox` does). Don't write a lint-disable comment claiming content is sanitized unless it is.

## Adding a tool (checklist)

1. Create the folder per the structure above.
2. Add an entry to `TOOLS` in `src/utils/tools-registry.ts`.
3. Add the `React.lazy` import and `TOOL_COMPONENTS` entry in `src/routes/tools/$toolId.tsx` (same id).
4. Put pure logic in `utils.ts` and cover it with a `utils.test.ts` (`pnpm vp test run <file>`).
