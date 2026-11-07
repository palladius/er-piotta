# Changelog

All notable changes to `er-piotta` are documented in this file.

## [1.1.0] - 2026-11-07
### Added
- **Gmail-Style Inbox View (`src/pages/tickets.astro`)**:
  - Teacher avatars and country/subject emojis (`🇩🇪🧮 Herr Biehl`, `🇬🇧🎵 Miss Penrose`, `🇬🇧📚 Miss Rayment`, `🇩🇪🎨 Frau Faux`, `🇨🇭🏫 Tandem IMS`).
  - Kid badges and filters with `🐉 Ale` (P3), `🚗 Seb` (P1), and `🐉🚗 A+S` (plus navbar integration in `src/layouts/Layout.astro`).
  - Nature (`⚡ ACT` vs `💡 FYI`) and Category (`📝 HW`, `🎯 TST`, `📚 LIB`, `🎒 TRP`, `📸 PIC`, `📅 ADM`) badges and quick filters.
  - Fixed-width `YYYYMMDD(Ven)` creation/event dates and `⏳ YYYYMMDD(+Ng)` Auto-Archive (+7d post-event) filter.
  - Accessible 3-way Owner radio selector (`Ricc` / `Kate` / `—`) and shared family Note editor (`📝 +Nota`) using native `<dialog closedby="any">` and `<search>`.
- **Live Persistence API (`serve_7107.py`)**: Added `GET /api/tickets-state` and `POST /api/ticket` to persist Owner, Note, Read, and Archive changes directly to `src/data/piota_feed.json` and Google Cloud Firestore (`palladius-genai/piota_items`).
