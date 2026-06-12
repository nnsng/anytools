````markdown
# Implementation Plan: AnyTools Website (Pure Client-Side)

This document outlines the architecture, layout, design token system, and execution steps to build **AnyTools**, a high-performance, purely client-side utilities website featuring a tech/developer aesthetic.

---

## 1. Project Stack & Core Strategy

- **Framework:** TanStack Start configured as a Single Page Application (SPA).
- **Rendering Strategy:** **100% Client-Side.** No Server-Side Rendering (SSR). All data manipulation, transformation, and processing occur entirely within the user's browser for absolute privacy and zero server latency.
- **Styling:** Tailwind CSS + `tailwindcss-animate` for micro-interactions.
- **UI Components:** `shadcn/ui` primitives built over Radix UI.
- **Icons:** `lucide-react` for technical iconography.

---

## 2. Directory Structure

To ensure maximum maintainability, every tool isolates its logic, state, and specific view sub-components inside a dedicated folder under `src/components/tools/`.

```text
src/
├── components/
│   ├── ui/                     # Shared shadcn/ui atoms (button, input, dialogue)
│   ├── layout/                 # Global navigation shell, tech sidebar, command menu
│   └── tools/                  # Isolated tool modules (Logic + UI paired)
│       ├── shared/             # Reusable tool primitives (CodeEditor, CopyButton)
│       ├── unix-converter/
│       │   ├── unix-converter-client.tsx
│       │   └── utils.ts
│       ├── json-formatter/
│       │   ├── json-formatter-client.tsx
│       │   └── validator.ts
│       └── [other-tools]/
├── routes/
│   ├── __root.tsx              # App Root, Client Context & Global Layout
│   ├── index.tsx               # Homepage Dashboard (Instant Client Search)
│   └── tools/
│       └── $toolId.tsx         # Single dynamic client route mapping all tools
└── styles/
    └── global.css              # Cyberpunk / Terminal styling definitions
```
````

---

## 3. Design Tokens & "Tech Vibe" Theme

The application targets a high-contrast, terminal-inspired environment with neon accents.

### Color Tokens & Utilities

- **Theme:** Default dark mode with an optional high-contrast, light IDE secondary theme.
- **Core Palette:** Charcoal black canvas base, deep zinc boundaries, stark white typography, and reactive matrix green interactive tokens.
- **Atmospherics:** Custom CSS grid matrix overlays mapped globally across viewport backdrops to enrich the raw development machine aesthetic.
- **Geometry:** Sharp, low-radius border geometries to enforce an industrial, technical component layout structure.

---

## 4. Complete Tool Implementation Matrix

Every utility executes natively on the client using optimized browser APIs or lightweight client-side npm libraries:

| Tool Route ID      | Tool Name                   | Scope / Technical Implementation                                  | Key Dependency             |
| ------------------ | --------------------------- | ----------------------------------------------------------------- | -------------------------- |
| `unix-converter`   | Unix Time Converter         | Real-time human-readable date conversions, epoch tracking.        | Native JS `Date`           |
| `json-formatter`   | JSON Format/Validate        | Raw text beautifying/minification with syntax highlighting.       | Native `JSON.stringify`    |
| `base64-string`    | Base64 String Encode/Decode | Multi-encoding string translation with padding checks.            | Native `btoa` / `atob`     |
| `base64-image`     | Base64 Image Encode/Decode  | Drag-and-drop client local file processing to base64 strings.     | Browser `FileReader`       |
| `regex-tester`     | RegExp Tester               | Dynamic regex evaluator with inline group match highlights.       | Native `RegExp`            |
| `url-encoder`      | URL Encode/Decode           | URI escape sequences formatting.                                  | `encodeURIComponent`       |
| `html-encoder`     | HTML Entity Encode/Decode   | Encodes raw script strings safely into browser entities.          | Custom dictionary          |
| `html-preview`     | HTML Preview                | Isolated sandbox environment to view raw HTML outputs.            | Secure `iframe` + Blob URL |
| `markdown-preview` | Markdown Preview            | Dynamic rich text markdown engine renderer.                       | `marked` or `snarkdown`    |
| `diff-checker`     | Text Diff Checker           | Structural string diff calculation with line-by-line highlights.  | `diff-match-patch`         |
| `cron-parser`      | Cron Job Parser             | Expression compilation rendering subsequent scheduled times.      | `cron-parser`              |
| `color-converter`  | Color Converter             | Real-time calculations across HEX, RGB, HSL, CMYK models.         | Native math logic          |
| `curl-to-code`     | cURL to Code                | Maps fetch configurations to JavaScript, Python, and Go snippets. | Text parser engines        |
| `json-to-code`     | JSON to Code                | Dynamic text parsing producing valid TypeScript Interfaces.       | Structure compiler         |
| `mock-generator`   | Data Forge                  | Generates structured JSON datasets using customizable parameters. | `@faker-js/faker`          |

---

## 5. Architectural Blueprints

### Global Shell & Dynamic Routing

A unified router dispatcher captures incoming URL variables at a single route junction. It matches the parameter directly against a local component registry map, instantly rendering the respective isolated client module tool without triggering full-page browser flashes.

### Modular Tool Design Pattern

Each utility directory completely packages its internal state hooks, parsing mathematics, sub-layouts, and actions. It exports a single, memory-optimized functional component ready to hook directly into the dynamic route dispatcher.

---

## 6. Execution Roadmap

- **Phase 1: Environment Bootstrapping**
- Scaffold the project via TanStack Start. Disable SSR configuration options inside the framework configuration properties.
- Establish global style color schemes, baseline variables, and structural container wireframes.

- **Phase 2: Registry & Navigation Shell**
- Populate an immutable static configuration registry array detailing information for all 15 utilities.
- Build the unified landing cockpit complete with real-time text query filtering over tool cards.

- **Phase 3: Core Utility Matrix Delivery**
- Author and separate operational layout logic files sequentially inside the specific component folders.
- Build shared atomic interface elements like quick clipboard copy utilities and baseline syntax text containers.

- **Phase 4: Optimization & Structural Check**
- Audit runtime calculations to verify processing limits safely occur entirely inside browser boundaries.
- Compile final production distribution direct to lightweight, static asset bundles.

```

```
