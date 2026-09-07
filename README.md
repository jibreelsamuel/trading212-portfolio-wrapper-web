# Trading 212 Portfolio Wrapper — Web MVP (archived)

Archived snapshot of the **Vite + React web UI** formerly at  
`frontend/web` in [trading212-portfolio-wrapper](https://github.com/jibreelsamuel/trading212-portfolio-wrapper).

The live product path is **Expo mobile** + Quarkus backend in that repo. This repository is kept only as historical reference and is **not maintained**.

## Contents

- Web app sources (Vite / React Router / TanStack Query)
- Snapshot of `@portfolio/shared` as `./shared` (so `file:./shared` still resolves)

## Run locally (best-effort)

Needs the Quarkus API from the main repo (`:8080`) and `APP_API_TOKEN`.

```bash
npm install
npm run dev
```

Vite proxies `/api` → `http://localhost:8080` (see `vite.config.ts`).
