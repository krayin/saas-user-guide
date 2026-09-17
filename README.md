# Krayin SaaS User Guide

User documentation for the [Krayin Multi-Tenant SaaS](https://github.com/krayin/laravel-crm),
built with [VitePress](https://vitepress.dev/).

- **Live site:** <https://saas-docs.demo.krayincrm.com/>
- **Content lives in:** `src/`
- **Config:** `.vitepress/config.mts` · **Theme:** `.vitepress/theme/`

## Requirements

- Node **18 or newer** (tested on Node 24)
- npm

## Setup

Install dependencies once:

```bash
npm install
```

## Commands

Run these from the project root.

| Command | What it does |
|---|---|
| `npm run docs:dev` | Start the dev server with hot reload. Open <http://localhost:5173>. |
| `npm run docs:build` | Build the static site into `.vitepress/dist`. **Fails on dead internal links** — run it before committing. |
| `npm run docs:preview` | Serve the built site exactly as it deploys. Run `docs:build` first. |

### Write and preview

```bash
npm run docs:dev
```

Edits to any `.md` file in `src/` reload instantly. The dev server also listens on
`0.0.0.0`, so you can open it from a phone on the same network — for example
`http://192.168.15.214:5173/`.

### Check before publishing

```bash
npm run docs:build     # must pass — catches broken links
npm run docs:preview   # review the real production output
```

## Adding a page

1. Create the markdown file under `src/<section>/<page>.md`.
2. Add it to the `sidebar` in `.vitepress/config.mts` — a page not listed there is
   invisible.
3. Put screenshots in `src/public/images/<page-slug>/` and embed them with the lightbox
   component:

   ```md
   <ImagePopup src="/images/<page-slug>/<shot>.png" alt="..." />
   ```

4. Run `npm run docs:build` to confirm no links broke.

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the site and
publishes it to GitHub Pages at the domain in `src/public/CNAME`. No manual deploy step.

## Project layout

```
.
├── .vitepress/
│   ├── config.mts              # site title, nav, sidebar, search
│   └── theme/
│       ├── index.ts            # registers <ImagePopup>, sidebar auto-scroll
│       ├── custom.css          # Krayin brand colours
│       └── components/ImagePopup.vue
├── src/
│   ├── index.md                # homepage
│   ├── getting-started/
│   ├── super-admin/
│   ├── subscriptions/
│   ├── settings/
│   ├── tenants/
│   └── public/
│       ├── images/<page>/…     # screenshots
│       ├── logo.png            # nav + hero branding
│       └── CNAME               # deploy domain
├── PLAN.md                     # build plan and progress
└── package.json
```
