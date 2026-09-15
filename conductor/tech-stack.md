# Technology Stack: Er Piotta

## Architectural Topology: Dual-Repository Model
To protect sensitive school communications, child privacy, and personal authentication credentials, the system is partitioned into two distinct repositories:

1. **`er-piotta` (Public Repository - Current):**
   - Clean, lightweight frontend dashboard for family viewing.
   - Zero sensitive tokens, credentials, or private communication logs.
2. **`er-piotta-backend` / `piota-bridge` (Private Repository):**
   - Headless Android emulator & Piota app bridge.
   - Authentication with school system (`palladiusbonton2@gmail.com`).
   - LLM processing (Google Gemini / ADK) for notice summarization.
   - Integrations: Google Calendar API / MCP, local Obsidian sync (`/home/riccardo/obsidian-pbt`), and export of sanitized data to `er-piotta`.

## Frontend Tech Stack (`er-piotta`)
- **Framework:** Astro 4.16+ (Static Site Generation / Islands architecture)
- **Styling:** Tailwind CSS 3.4+ (`@astrojs/tailwind`)
- **Language:** TypeScript (strict typing, data schemas in `src/data/schoolData.ts`)
- **Deployment:** GitHub Pages via GitHub Actions (`.github/workflows/deploy.yml`)
- **Node Runtime:** Node.js 20+ with `npm`

## Backend Tech Stack (Target Private Repo)
- **Runtime & Orchestration:** Python 3.11+, Docker / Docker-Android (headless container or Waydroid/AVD)
- **Mobile Emulation & Bridge:** Android SDK, ADB, mitmproxy / network inspector for Piota App reverse-engineering
- **AI / LLM Layer:** Google Gemini API / ADK (Agent Development Kit)
- **Destinations:** Google Calendar, Obsidian Markdown notes, sanitized JSON sync
