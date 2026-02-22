# 🪄 AI Infographic Generator

> **Transform any YouTube video into a stunning, shareable infographic — instantly, powered by AI and n8n workflow automation.**

---

## 📖 Overview

**AI Infographic Generator** is a lightweight, purely frontend web application that converts YouTube video content into professional, AI-generated HTML infographics in seconds. Simply paste a YouTube link, click **Generate**, and a fully formatted infographic is created for you — ready to download or copy.

The app connects to an **n8n automation workflow** via a webhook, which orchestrates all the heavy lifting: fetching video transcripts, processing the content with an AI model, and returning a beautifully structured HTML infographic.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔗 **YouTube URL Input** | Accepts any valid YouTube video link |
| ⚡ **One-Click Generation** | Sends URL to n8n webhook and receives AI-generated infographic HTML |
| 🖼️ **Live Preview** | Rendered infographic displayed directly in the browser |
| 💾 **Download as HTML** | Saves infographic as a standalone `.html` file |
| 📋 **Copy HTML Code** | Copies raw HTML to clipboard for reuse anywhere |
| 🌙 **Dark / Light Mode** | Theme toggle with persistence via `localStorage` |
| 📱 **Fully Responsive** | Works beautifully on desktop, tablet, and mobile |
| 💎 **Glassmorphism UI** | Modern frosted-glass design with animated background blobs |
| ✅ **Input Validation** | URL format validation with shake animation on error |

---

## 🏗️ Project Structure

```
ai-infographic-generator/
│
├── index.html       # App structure, layout, and UI components
├── styles.css       # Full styling — glassmorphism, dark/light themes, animations
├── app.js           # Core logic — webhook calls, UI state, download, copy, validation
└── README.md        # This file
```

> No build tools, no frameworks, no Node.js required. Pure vanilla HTML/CSS/JS.

---

## 🔄 Complete Application Flow

This diagram shows the end-to-end data flow from user input to infographic output:

```
┌────────────────────────────────────────────────────────────────────────┐
│                         USER'S BROWSER                                  │
│                                                                          │
│  1. User pastes YouTube URL into the input field                         │
│  2. Clicks "Generate Infographic"                                        │
│  3. app.js validates the URL format                                      │
│  4. UI enters loading state (spinner visible, button disabled)           │
│                                                                          │
│  5. fetch() → POST request to n8n Webhook                                │
│               Body: { "youtubeUrl": "https://youtube.com/..." }          │
└──────────────────────────────┬─────────────────────────────────────────┘
                               │ HTTP POST (JSON)
                               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         n8n CLOUD WORKFLOW                               │
│                                                                          │
│  6.  Webhook Node → Receives the YouTube URL                             │
│  7.  HTTP Request Node → Fetches YouTube transcript / metadata           │
│  8.  AI / LLM Node → Processes content, builds infographic structure     │
│  9.  Code Node → Formats the result as clean, styled HTML                │
│  10. Respond to Webhook Node → Returns HTML string as response body      │
└──────────────────────────────┬─────────────────────────────────────────┘
                               │ HTTP Response (HTML text)
                               ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                         USER'S BROWSER (cont.)                            │
│                                                                           │
│  11. app.js receives the HTML response                                    │
│  12. Injects HTML into #result-content div (live DOM rendering)           │
│  13. Result section slides into view (smooth scroll)                      │
│  14. User can:                                                            │
│       → Download as infographic.html                                      │
│       → Copy raw HTML to clipboard                                        │
└───────────────────────────────────────────────────────────────────────────┘
```

---

## 🤖 n8n Workflow Automation — Deep Dive

[n8n](https://n8n.io) is the backbone of this project's intelligence. It is a **low-code, open-source workflow automation platform** that connects APIs, AI models, and services without needing a custom backend server.

### Why n8n?

| Advantage | Detail |
|---|---|
| **No Backend Code** | The entire server-side logic lives in n8n — zero Express/Node server needed |
| **Visual Workflow Builder** | Logic is built drag-and-drop; easy to modify without touching code |
| **Built-in AI Nodes** | Native integrations for OpenAI, Google Gemini, Anthropic Claude, and more |
| **Webhooks as API** | n8n exposes a webhook URL that acts as your REST API endpoint |
| **Scalable & Hosted** | n8n Cloud handles infrastructure, uptime, and scaling |
| **Rapid Prototyping** | A full AI pipeline can be built in minutes, not weeks |

### Workflow Breakdown

```
[Webhook Trigger]
      │
      ▼
[Extract YouTube URL from body]
      │
      ▼
[Fetch Transcript / Video Data]
   (YouTube API / HTTP Request node)
      │
      ▼
[AI / LLM Processing]
   - Summarize content
   - Extract key points, stats, quotes
   - Structure into infographic sections
      │
      ▼
[HTML Generation via Code Node]
   - Format AI output into styled HTML
   - Apply consistent visual hierarchy
      │
      ▼
[Respond to Webhook]
   - Return the HTML as response body (text/html)
```

### Webhook Endpoint

The app calls this endpoint via a `POST` request:

```
POST https://sahil0333.app.n8n.cloud/webhook/generate-infographic
Content-Type: application/json

{
  "youtubeUrl": "https://www.youtube.com/watch?v=EXAMPLE"
}
```

**Response:** Raw HTML string of the generated infographic.

---

## 🎨 UI Design & Technology

### Design System

- **Font:** [Outfit](https://fonts.google.com/specimen/Outfit) — modern geometric sans-serif
- **Icons:** [Font Awesome 6](https://fontawesome.com/) — solid and brand icon library
- **Color Palette:**
  - Primary Gradient: `#667eea → #764ba2` (purple-blue)
  - Secondary Gradient: `#ff9a9e → #fecfef` (pink-rose)
  - Dark Background: `#0f172a`
  - Light Background: `#f0f4f8`

### Key CSS Techniques

| Technique | Usage |
|---|---|
| **CSS Custom Properties (`--var`)** | Full theming system, swappable for dark/light mode |
| **Glassmorphism** | `backdrop-filter: blur()` + semi-transparent backgrounds |
| **Animated Blobs** | Floating gradient blobs using `@keyframes drift` for a living background |
| **Responsive Flexbox** | Adaptive layout with `@media (max-width: 768px)` breakpoints |
| **Micro-animations** | Spinner, shake on error, button hover transforms |

---

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Edge, Safari)
- An active **n8n instance** (cloud or self-hosted) with the workflow configured
- *(Optional)* A local HTTP server for development (e.g., VS Code Live Server)

### 1. Clone / Download

```bash
git clone https://github.com/your-username/ai-infographic-generator.git
cd ai-infographic-generator
```

### 2. Configure Webhook URL

Open `app.js` and update the `CONFIG` object with your n8n webhook URL:

```javascript
const CONFIG = {
    WEBHOOK_URL: 'https://YOUR-N8N-INSTANCE.app.n8n.cloud/webhook/generate-infographic'
};
```

### 3. Set Up n8n Workflow

1. Log in to your [n8n Cloud](https://app.n8n.cloud) or self-hosted instance
2. Create a new workflow
3. Add a **Webhook** trigger node — set method to `POST`, note the webhook URL
4. Build your AI pipeline (see [Workflow Breakdown](#workflow-breakdown) above)
5. Add a **Respond to Webhook** node at the end, returning the HTML string
6. **Activate** the workflow

### 4. Open the App

Simply open `index.html` in your browser — or use VS Code Live Server for a better dev experience:

```
Right-click index.html → Open with Live Server
```

> ⚠️ If running directly from `file://`, some browsers may block `fetch()` requests due to CORS. Use a local server instead.

---

## ⚙️ Configuration Reference

| Variable | Location | Description |
|---|---|---|
| `CONFIG.WEBHOOK_URL` | `app.js` line 2 | The n8n webhook POST endpoint |
| `data-theme` | `index.html` attr | Default theme (`dark` or `light`) |
| `localStorage('theme')` | `app.js` | Persisted user theme preference |

---

## 🔧 How the Frontend Works

### `app.js` — Core Logic

```
1. DOMContentLoaded → Initialize all element references
2. Theme init      → Read localStorage, set theme, update icon
3. Generate click  → Validate URL → show loading → POST to webhook → render result
4. displayResult() → Inject HTML into DOM → smooth scroll
5. showError()     → Set error text → trigger shake animation
6. Download click  → Wrap innerHTML in full HTML doc → create Blob → trigger download
7. Copy click      → navigator.clipboard.writeText(innerHTML) → confirm feedback
```

### URL Validation

YouTube URLs are validated with a regex before any network call is made:

```javascript
const regex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
```

Accepted formats: `youtube.com/watch?v=...`, `youtu.be/...`, with or without `https://`.

---

## 🌐 Browser Compatibility

| Browser | Support |
|---|---|
| Chrome 90+ | ✅ Full |
| Firefox 88+ | ✅ Full |
| Edge 90+ | ✅ Full |
| Safari 14+ | ✅ Full (with `-webkit-backdrop-filter`) |
| Internet Explorer | ❌ Not supported |

---

## 💡 Advantages of This Architecture

1. **Zero backend maintenance** — n8n handles all server-side logic, no Express, no database, no deployment pipeline
2. **AI-agnostic** — Swap the LLM in n8n any time (OpenAI → Gemini → Claude) without touching frontend code
3. **Instant deployment** — The frontend is static HTML; host it anywhere (GitHub Pages, Netlify, Vercel — free)
4. **Highly modifiable** — Change the infographic style by editing the n8n Code node, no frontend rebuild needed
5. **Rapid iteration** — Update workflow logic visually in n8n in minutes
6. **Cost-effective** — No server costs beyond n8n cloud subscription and AI API usage

---

## 📦 Tech Stack Summary

| Layer | Technology |
|---|---|
| **Frontend** | HTML5, Vanilla CSS3, Vanilla JavaScript (ES6+) |
| **Automation** | n8n (Workflow Automation Platform) |
| **AI / LLM** | Configured inside n8n (OpenAI, Gemini, etc.) |
| **Fonts** | Google Fonts — Outfit |
| **Icons** | Font Awesome 6 |
| **Hosting** | Any static host (GitHub Pages, Netlify, etc.) |

---

## 📄 License

This project is licensed under the **MIT License** — feel free to use, modify, and distribute.

---

## 🙌 Credits

Built with ❤️ using:
- [n8n](https://n8n.io) — Workflow Automation
- [Google Fonts](https://fonts.google.com) — Outfit Typeface
- [Font Awesome](https://fontawesome.com) — Icon Library

---

> *"Don't build a backend when automation can do it better."*
