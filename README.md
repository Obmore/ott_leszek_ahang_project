# OttLeszek

Magánéletedet tisztelő, részvételi emlékeztető és tervkészítő alkalmazás a magyar kontextusban. Egyszerű terv, emlékeztetők és opcionális kapcsolatfelvétel azokkal, akiket ismersz — manipuláció és sötét minták nélkül.

## Funkciók

- **Elköteleződés** — Egy kattintással jelezheted, hogy részt veszel.
- **Terv** — Lépések megadása (pl. „Elmegyek szavazni”), checklist a főoldalon.
- **Emlékeztetők** — Időzített emlékeztetők a fontos napokra.
- **Kapcsolat** — Opcionális kapcsolattartók és sablonok a meghívó üzenetekhez.
- **Adatvédelem** — Hozzájáruláskezelés, értesítési beállítások, adatexport és fiók törlés.

## Tech stack

| Réteg    | Technológia |
| -------- | ----------- |
| Mobile   | React Native, Expo (SDK 52), TypeScript, Expo Router |
| Backend  | Node.js, Fastify, TypeScript, Prisma |
| Adatbázis| SQLite (fejlesztés) / PostgreSQL (célszerű élesben) |

## Előfeltételek

- Node.js ≥ 20  
- pnpm 9+

## Gyors indulás

```bash
# Függőségek
pnpm install

# Backend
cd apps/backend
cp .env.example .env
pnpm run db:generate
pnpm run dev
# → http://localhost:3000

# Mobile (új terminál)
cd apps/mobile
pnpm run dev
# → QR kód / böngésző (w) / iOS (i) / Android (a)
```

A backend állapota: `GET http://localhost:3000/health`

## Projekt struktúra

```
apps/
  mobile/     React Native (Expo) alkalmazás
  backend/    Fastify API, Prisma
packages/
  shared/     Közös típusok és konstansok
  config/     Közös ESLint és TypeScript konfiguráció
docs/         Architektúra, ADR-ek, roadmap, demó
scripts/      Segédscriptek (pl. képernyőképek)
```

## Parancsok (repo gyökeréből)

| Parancs | Leírás |
| ------- | ------ |
| `pnpm run dev:mobile`  | Expo dev szerver |
| `pnpm run dev:backend`| Fastify dev szerver |
| `pnpm run typecheck`   | TypeScript ellenőrzés |
| `pnpm run lint`       | ESLint |
| `pnpm run format`     | Prettier formázás |

## Dokumentáció

- [Projekt és MVP](docs/PROJECT_FRAMING.md)
- [Funkciómátrix](docs/MVP_FEATURE_MATRIX.md)
- [Architektúra](docs/ARCHITECTURE.md)
- [Design és UX](docs/DESIGN_UX.md)
- [Adatmodell](docs/DATA_MODEL.md)
- [Adatvédelem és biztonság](docs/PRIVACY_SECURITY.md)
- [Roadmap](docs/ROADMAP.md)
- [Demó script](docs/DEMO_SCRIPT.md)
- [Tesztelés és demó](docs/TESTING_AND_DEMO.md)
- [ADR-ek](docs/adr/)

## Licenc

Privát / TBD.
