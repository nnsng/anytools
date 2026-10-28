# Anytools - All-in-One Developer Utilities Suite

Anytools is an open-source, privacy-first developer utility toolkit designed with a modern cyber terminal aesthetic. Built to increase productivity, every tool runs **100% client-side** inside your browser. No data is ever sent to a server, ensuring absolute privacy and security for your configuration files, tokens, and data payload.

## 🛠️ Built-in Modules

Tools are grouped in the sidebar and on the home page, in this order. Within each group they are sorted by name.

### 🔁 Converters & Encoders

- **Base64 Image:** Convert images to Base64 URI strings and back.
- **Base64 Text:** Encode and decode Base64 text, with Unicode support.
- **Color Converter:** Convert colors between HEX, RGB, HSL and CMYK with a picker and eyedropper.
- **HTML Entity Encoder:** Escape and unescape HTML entities safely to avoid cross-site scripting issues.
- **JSON ⇄ CSV:** Convert between JSON and CSV with delimiter, header, nested-object flattening and type inference options.
- **JSON ⇄ YAML:** Convert between JSON and YAML, with line and column positions for YAML syntax errors.
- **Number Base Converter:** Convert integers between binary, octal, decimal, hex and any base up to 36, with exact big-number support.
- **Timestamp Converter:** Convert Unix epoch timestamps to readable dates and back, with a live epoch clock.
- **URL Encoder:** Encode and decode URL components or full URIs.

### 🧹 Formatters

- **CSS Formatter:** Beautify or minify CSS.
- **HTML Formatter:** Beautify or minify HTML.
- **JS Formatter:** Beautify or minify JavaScript.
- **JSON Formatter:** Prettify JSON or minify it to reduce payload size.

### ✏️ Text Tools

- **Diff Checker:** Compare two blocks of code or text side by side or inline, with color-coded changes.
- **List Deduplicator:** Remove duplicate lines or items from a text list.
- **String Case Converter:** Switch text between camelCase, snake_case, PascalCase, kebab-case and more.
- **Text Analyzer:** Count characters, words and sentences, and see readability statistics for paragraphs.

### ⚙️ Dev Utilities

- **Cron Parser:** Decode cron expressions into readable schedules with upcoming run times.
- **JWT Debugger:** Decode token headers and payloads, verify signatures, and check lifetime periods, all client-side.
- **Regex Tester:** Draft and test regular expressions with live highlighting and match details. Matching runs in a Web Worker with a timeout.

### 🎨 Generators

- **CSS Generator:** Build multi-layer box shadows, linear/radial/conic gradients and fluid `clamp()` sizes with a live preview.
- **Favicon Generator:** Build multi-size web favicons and `.ico` bundles from an image or text.
- **Lorem Ipsum Generator:** Generate placeholder paragraphs, sentences or words.
- **Mock Data Generator:** Craft mock schemas and JSON records using Faker.js.
- **Password Generator:** Create random passwords with unbiased sampling from `crypto.getRandomValues`.
- **QR Code Studio:** Generate QR codes with custom colors, sizes and error correction, and scan QR codes from images.
- **UUID Generator:** Generate v1 and v4 UUIDs in bulk.

### 🧪 Playgrounds

- **HTML Sandbox:** Write and preview HTML, CSS and JavaScript in an isolated iframe without access to the app.
- **Markdown Preview:** Render Markdown to HTML with a live preview. Output is sanitized with DOMPurify.

---

## 🚀 Tech Stack

- **Core:** React 19, TypeScript, Vite 8
- **Routing:** TanStack Router (File-based SPA Routing)
- **Styling:** Tailwind CSS v4, Lucide Icons
- **UI Primitives:** Radix UI components (Shadcn UI presets)
- **Toolchain & Code Quality:** Vite+ (`vp`) with Oxlint and Oxfmt
- **Environment:** pnpm workspaces

---

## 💻 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (v22.18+ or v24.11+, required by Vite+; `.nvmrc` pins 24) and [pnpm](https://pnpm.io/) installed on your machine.

### Installation

Clone the repository and install dependencies:

```bash
pnpm install
```

### Run Local Server

Execute the Vite local development pipeline with automatic file-based route updates:

```bash
pnpm dev
```

### Production Build

Build and optimize the static assets into the target production folder (`dist/`):

```bash
pnpm build
```

### Static Analysis & Lints

Validate and keep the codebase tidy using Vite+ (Oxlint + Oxfmt):

```bash
# Auto-format files
pnpm format

# Verify linting patterns
pnpm lint

# Perform formatting, linting, and TS verification in one go
pnpm check
```

### Testing

Execute unit tests via Vitest:

```bash
pnpm test
```

---

## 🌐 Deploying to Vercel

[vercel.json](vercel.json) configures the build (`pnpm build`, output `dist/`), a rewrite of every path to `index.html` so nested TanStack routes work as a single-page app, long-lived caching for `/assets/*`, and security headers (`X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`).
