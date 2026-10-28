# Coding Conventions

Formatting and basic lint rules are enforced by `vp check` and the pre-commit hook; this file covers what tooling does not.

## Tooling

- Format/lint config lives in `vite.config.ts` (`fmt`, `lint`, `staged`). Do not add separate config files.
- Run `pnpm check` and `pnpm test` before committing. Suppress a rule only with a reason: `// oxlint-disable-next-line <rule> -- why`.
- Import through the `@/*` alias; use `./` only inside the same tool folder.

## Folder structure

```
src/components/tools/<tool-id>/
  index.ts          export { default } from './<tool-id>'   (loaded by import.meta.glob)
  <tool-id>.tsx     top-level component, default export
  <part>.tsx        sub-components, named exports
  use-<name>.ts     hooks specific to the tool (.tsx only if it contains JSX)
  utils.ts          pure logic (parse/convert/format), no React
  utils.test.ts     tests for utils.ts, beside the file
  types.ts          types shared inside the tool
  constants.ts      option lists and constants
  samples.ts        sample inputs
```

- A tool folder never imports from another tool folder. Cross-tool UI goes in `tools/shared/`, hooks in `src/hooks/`, pure functions in `src/lib/`.
- `components/ui/` holds shadcn primitives only; no tool-specific code.
- Banned helper file names: `helpers`, `<tool>-utils`, `converter`, `parsers`, `generator`. Use `utils.ts`.

## Naming

- **Files and folders**: kebab-case (TanStack route files `__root.tsx`, `$toolId.tsx` excepted). A component file is named after its component (`editor-pane.tsx` → `EditorPane`). A tool folder name equals its id in the registry.
- **Identifiers**: components and types PascalCase; functions and variables camelCase; hooks `useX`; module constants `UPPER_SNAKE_CASE` (`INDENT_OPTIONS`, `COPY_RESET_MS`); string-literal unions instead of enums.
- **Types**: `type`, not `interface`, no `I` prefix; props are `<Component>Props`.
- **Component names match the file**: the default export of `jwt-debugger.tsx` is `JwtDebugger`, not `JwtCodec`.
- **Booleans**: `is/has/can/should` prefix (`isOpen`, `isCopied`, `hasError`). Option flags inside a settings object may stay nouns (`uppercase`).
- **Handlers**: props `onX`, internal handlers `handleX`.
- **Functions**: verbs (`parseJwt`, `buildIco`, `formatCss`); converters `xToY`.
- **Exports**: named everywhere; default only for the tool entry component.

## React

- Components stay focused: about 150 lines max. More than ~6 `useState` means extract a hook, group state in one object/reducer, or split into sub-components.
- Derive values with `useMemo` (+ `useDeferredValue` for expensive ones); never mirror derived data into state through an effect.
- Async work in effects needs a cancel flag or `AbortController`; mark intentionally un-awaited promises with `void`.
- Heavy or CPU-bound work (regex, large diffs) runs in a Web Worker with a timeout or is debounced.
- Heavy dependencies are loaded on demand with `import()` (see `jsqr` in QR studio).
- List `key`s are stable ids, not array indexes, unless the list is static.
- Logic lives in `utils.ts`, not in handlers or JSX.

## Styling

- Tailwind only; compose classes with `cn()`.
- Prefer semantic tokens (`text-foreground`, `text-muted-foreground`, `text-destructive`, `bg-terminal-*`, `text-matrix`). The `slate-100…700` shades are remapped per theme in `styles.css`, so they are theme-safe; other palette colors (`red-*`, `yellow-*`) are not, so use them only for status accents.
- Repeated class strings (3+ uses) become a component or a `cva` variant.

## Errors and side effects

- Expected failures (bad user input) are returned as `{ output, error }` (`runConversion` in `src/lib/convert.ts`) and shown in the tool, not logged.
- Browser APIs go through shared helpers: clipboard → `useCopyToClipboard`, files → `src/lib/file.ts`. Wrap `localStorage` access in try/catch.
- Everything stays client-side; never send user input to a network endpoint.

## Security

- HTML rendered with `dangerouslySetInnerHTML` must be sanitized (DOMPurify) first. User-authored HTML/JS runs only in a sandboxed iframe without `allow-same-origin`.
- Use `crypto.getRandomValues` / `crypto.randomUUID` for anything random that users may rely on.

## Accessibility

- Icon-only buttons need `aria-label`; form controls need a `<label htmlFor>` or `aria-label`; error messages use `role="alert"`; decorative elements are `aria-hidden`.

## Adding a tool

1. Create the folder per the structure above (`index.ts` re-exporting the default component).
2. Add an entry to `TOOLS` in `src/utils/tools-registry.ts`; the id must equal the folder name and `category` must be one of `CATEGORIES` (that list sets the sidebar order). Tools are sorted by name within their category automatically. `src/utils/tool-components.ts` finds the component automatically and `tools-registry.test.ts` fails if the folder is missing.
3. Put pure logic in `utils.ts` with a `utils.test.ts` (`pnpm vp test run <file>`).
