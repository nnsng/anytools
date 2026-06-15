# Anytools - All-in-One Developer Utilities Suite

Anytools is an open-source, offline-first developer utility toolkit designed with a modern cyber terminal aesthetic. Built to increase productivity, every tool runs **100% client-side** inside your browser. No data is ever sent to a server, ensuring absolute privacy and security for your configuration files, tokens, and data payload.

## 🛠️ Built-in Modules

The workspace is packed with multiple essential tools categorized for everyday development:

### 📝 Text & Encoders

- **Base64 Text/Image:** Seamlessly convert plain text or images directly to Base64 URI strings and vice versa.
- **URL Encoder & Decoder:** Securely parse and format deep link query parameters.
- **HTML Entity Encoder:** Safely escape special characters to avoid cross-site scripting issues.
- **String Case Converter:** Instantly switch text cases between camelCase, snake_case, PascalCase, kebab-case, etc.
- **Text Analyzer:** Count characters, words, sentences, and run structural readability statistics on paragraphs.

### 🧹 Code Formatters

- **JSON Formatter & Minifier:** Format bulky payloads, prettify JSON, or minify scripts to reduce payload sizes.
- **JS / CSS / HTML Formatters:** Clean up raw code snippets with tailored indentation and nesting rules.

### ⚙️ Development Utilities

- **Cron Parser:** Decode complex cron job expressions into clear, readable schedules with upcoming execution lists.
- **cURL-to-Code:** Translate raw bash `curl` requests into modern JavaScript `fetch` or Axios promises instantly.
- **JSON-to-TypeScript:** Generate complete TS type declarations and interfaces straight from an active JSON payload.
- **JWT Debugger:** Decode token headers, payloads, signatures, and verify lifetime periods completely client-side.
- **Diff Checker:** Compare two blocks of code or text files side-by-side with clear color-coded inline adjustments.
- **Regex Tester:** Draft, debug, and test active regular expressions with syntax highlighting against matching content.

### 🎨 Generators & Studios

- **Mock Data Generator:** Rapidly craft mock schemas, JSON objects, and dummy database entities using Faker.js.
- **Secure Password Generator:** Create highly customized, cryptographic-grade password phrases.
- **Favicon Generator:** Build optimized, multi-sized web favicons and standard `.ico` bundles from images.
- **QR Code Studio:** Generate dynamic, high-resolution QR codes with customizable colors, sizing, and error-correction levels.

### 🧪 Playgrounds & Lists

- **HTML Sandbox:** Live preview playground to write and run CSS, HTML, and JS code snippets in an isolated environment.
- **Markdown Previewer:** Instantly parse and preview Markdown syntax into fully stylized rich HTML.
- **Deduplicate Tool:** Instantly filter out duplicate items from a custom text or coordinate array.

---

## 🚀 Tech Stack

- **Core:** React 19, TypeScript, Vite 8
- **Routing:** TanStack Router (File-based SPA Routing)
- **Styling:** Tailwind CSS v4, Lucide Icons
- **UI Primitives:** Radix UI components (Shadcn UI presets)
- **Code Quality:** Biome (Lightning-fast formatter, linter, and code check)
- **Environment:** pnpm workspaces

---

## 💻 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (v18+) and [pnpm](https://pnpm.io/) installed on your machine.

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

Validate and keep the codebase tidy using Biome:

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

This project includes a native `vercel.json` rewrite schema suited for Single Page Application (SPA) routing, allowing nested TanStack routes to re-route correctly directly in the client:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```
