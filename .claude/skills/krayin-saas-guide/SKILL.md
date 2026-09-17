---
name: krayin-saas-guide
description: Use when writing, updating, or reviewing a page of the Krayin SaaS user guide (the VitePress docs site at saas-user-guide). Triggers include "write the docs page for X", "document the subscription plans screen", "add a guide page", "update the SaaS user guide", "capture screenshots for the guide".
---

# Krayin SaaS User Guide

Turn a feature of the Krayin Multi-Tenant SaaS into a merchant-facing documentation page:
read the real code, drive the real screens, capture real screenshots, write the page, wire
the sidebar.

The reference implementation is Bagisto's SaaS guide (`saas-docs.bagisto.com`). Match its
**tech and conventions**, not its content — Krayin is a CRM, so it documents Leads, Quotes
and Contacts where Bagisto documents storefront themes and mobile apps.

## The stack

| Piece | Choice |
|---|---|
| Generator | VitePress `^1.6.4` |
| Content root | `src/` (`srcDir` in config) |
| Config | `.vitepress/config.mts` |
| Theme | `.vitepress/theme/` — extends `DefaultTheme`, custom CSS + `ImagePopup.vue` |
| Screenshots | `src/public/images/<page>/*.png`, rendered via `<ImagePopup>` |
| Search | built-in `local` provider |
| Deploy | GitHub Actions → GitHub Pages, `CNAME` for the custom domain |
| Scripts | `docs:dev`, `docs:build`, `docs:preview` |

Node 18+. Never add a heavyweight dependency — the site is plain VitePress plus one Vue
component on purpose.

## Non-negotiables

1. **Never write a page from memory.** Every screen, field name, menu label, validation
   rule and default in a page must be traced to code in the `saas` workspace
   (`packages/Webkul/SaasKrayin`, `packages/Webkul/SaasSubscription`) or observed in a
   running instance. If you cannot verify a claim, cut it.
2. **Labels are quoted from the UI, not invented.** Pull them from the lang files
   (`src/Resources/lang/en/app.php`) so the guide matches what the reader sees on screen.
3. **Screenshots are real.** Captured from a running Krayin SaaS with seeded, plausible
   data — never mocked, never a Bagisto screenshot with the logo swapped.
4. **Merchant voice.** The reader operates a SaaS business; they are not a Laravel
   developer. No class names, no file paths, no `php artisan` in a user-guide page.

## Step 1: Research the feature in code

Before writing, establish what the screen actually does:

- **Routes** — `src/Routes/super-routes.php`, `company-subscription-routes.php` tell you
  the real URLs a reader will type or click.
- **Menu keys** — `src/Config/super-menu.php` gives the navigation path
  ("Settings → Agents").
- **Controller + Request** — the validation rules are the guide's "what's required" list.
- **Lang file** — the exact labels, hints and error strings.
- **Config** — `super-core-config.php` for anything under Configuration.

Write down the field list and rules *before* opening the docs file. A page that lists a
field the form does not have is worse than no page.

## Step 2: Capture screenshots

**Instance:** <http://krayin-saas.com/> — super admin at `/super/login`. Playwright MCP
drives it; the conventions are borrowed from the `krayin-blog` skill, whose "Step 3:
Images" section has the mechanics.

**Only `site1`–`site3` exist as tenant subdomains.** `/etc/hosts` maps exactly those three,
so a tenant registered under any other username shows up in the grids but its workspace
will not load. Never invent a subdomain for a screenshot; use the seeded tenants:

| Subdomain | Tenant | Notes |
|---|---|---|
| `site1.krayin-saas.com` | Acme Consulting | — |
| `site2.krayin-saas.com` | Northwind Supply Co. | — |
| `site3.krayin-saas.com` | Meridian Labs | has a CNAME — use for Custom Domains |

`cname-krayin-saas.com` also resolves, and points at Meridian Labs.

**Demo data is a prerequisite, not a detail.** Before capturing anything, check what the
screen will actually show. A tenant called `site1`, a plan called "Plan A", or a
`@webkul.in` address in a public screenshot is a defect. The instance needs a credible
tenant list, a Starter/Growth/Scale plan ladder, and enough leads, quotes and invoices
that grids and charts look populated. Seed once, then reuse — the same tenant names should
appear across the dashboard, the tenant grid and the invoice list.

Never capture: real customer names, live email addresses, production Stripe keys, or any
token.

**Differences from the blog skill — docs shots are not blog shots:**

| | Blog | Docs |
|---|---|---|
| Framing | `frame_shots.py` — window chrome + shadow | **None.** Raw, tight crop |
| Why | Hero images need to look designed | `<ImagePopup>` supplies the chrome |
| Target | `images/<name>-krayin.png` | `src/public/images/<page-slug>/<name>.png` |

Do **not** run `frame_shots.py` on documentation screenshots — the lightbox already frames
them, and the drop-shadow just wastes pixels the reader needs.

Shared with the blog skill:

- Viewport `1600x900`, `deviceScaleFactor: 2` — retina-sharp on the docs site.
- Reuse a saved `storageState` so you log in once per session.
- **The user logs in themselves.** Never ask for, type, or store credentials.
- **Groom the data before shooting.** "Acme Consulting", not "test test" or "asdasd". A
  screenshot of an empty grid teaches nothing; a screenshot of junk data teaches the wrong
  thing.
- Blur any account email, token or PII before committing.

Docs-specific:

- One folder per page: `src/public/images/tenant-management/`, not a flat dump.
- Crop to the subject. If the reader has to hunt for the button you described, re-crop.
- Name by what it shows — `create-plan-billing-cycles.png`, not `shot-3.png`.

Reference with the component, never a bare markdown image:

```md
<ImagePopup src="/images/plans/create-plan.png" alt="Create Plan form" />
```

## Step 3: Write the page

Every page follows this shape:

````md
# <Screen name>

One or two sentences: what this screen is for, in the reader's terms.

::: info What you'll learn
- <outcome 1>
- <outcome 2>
:::

## <First task>

Prose that walks the reader through it, with **bold** for anything they click or type.

<ImagePopup src="/images/<page>/<shot>.png" alt="..." />

- **Field** — what it does, and what happens if it's wrong.

::: tip
A shortcut, a gotcha, or a link onward to the next logical page.
:::
````

Rules that matter:

- **Task headings, not noun headings.** "Creating a plan" beats "Plan management".
- **Bold every UI string** the reader must find: **Save as Plan**, **Billing Cycles**.
- **Explain the consequence**, not just the field. "Unique per tenant — two tenants cannot
  claim the same domain" is useful; "Enter the CName" is not.
- **Cross-link** rather than repeat. Each fact lives on exactly one page.
- Use `::: info`, `::: tip`, `::: warning` — `warning` only for things that lose data or
  money (deleting a tenant, changing a live plan's price).
- Short paragraphs. Bullets for field lists. No wall of text.

## Step 4: Wire it into the sidebar

A page that is not in `.vitepress/config.mts` is invisible — VitePress will not discover
it. Add it to the `sidebar` array in the section it belongs to, and keep the order
matching the order a real operator works in: set the platform up, then onboard tenants,
then run billing.

Check `nav` too if the page introduces a whole new section.

## Step 5: Verify locally

The site is developed and reviewed **locally** before anything is pushed. Never treat a
page as done because the markdown looks right — render it.

```bash
npm run docs:dev        # http://localhost:5173 — hot reload while writing
npm run docs:build      # must pass; fails on dead internal links
npm run docs:preview    # serves the production build, exactly as deployed
```

`config.mts` sets `vite.server.host = "0.0.0.0"`, so the dev server is also reachable from
another machine on the LAN — useful for checking a page on a phone.

Review in the browser, not just the terminal:

- Click every `<ImagePopup>` — the lightbox must open and the full-size image must be
  legible.
- Toggle **dark mode**. Screenshots taken on a light admin can look wrong against a dark
  page; check them.
- Narrow the window to phone width — the sidebar collapses to a hamburger, and wide
  tables/screenshots must not force horizontal scroll.
- Search for the page's main term in the local search box and confirm it comes up.

Then confirm by eye:

- [ ] Every screenshot loads, and shows Krayin — not Bagisto.
- [ ] Every internal link resolves (the build catches these).
- [ ] Every field listed exists on the real form, in the same order.
- [ ] The page is reachable from the sidebar in the right section.
- [ ] No developer vocabulary leaked into the prose.

## Section map

Mirror Bagisto's *structure*, but scope it to Krayin's actual surface — verified from
`super-menu.php` and the route files:

The guide covers **both audiences** — the operator running the platform and the tenant
using their workspace:

| Section | Audience | Covers |
|---|---|---|
| Getting Started | Operator | What the SaaS module is, architecture, installation |
| Super Admin | Operator | Sign-in, dashboard, tenant management, cross-tenant Leads & Quotes |
| Subscriptions | Operator | Plans (monthly/yearly + offers), subscribers, invoices, trials |
| Settings | Operator | Agents, roles, configuration (Stripe, locale, subscription toggle) |
| Tenants | Both | Registration, the tenant workspace, billing, custom domains |

When a page serves the tenant rather than the operator, say so in the opening sentence —
the reader needs to know whether they're meant to be in the super admin panel or their own
CRM.

Krayin has **no** storefront themes, and **no** mobile-app section. Do not port those
pages across from Bagisto.

## Where things live

- Docs workspace: `/home/users/vikas.vishwakarma/www/html/Krayin/saas-user-guide`
- Source of truth for behaviour: `/home/users/vikas.vishwakarma/www/html/Krayin/saas`
- Live site: <https://saas-docs.demo.krayincrm.com/> (GitHub Pages, `CNAME`)
- Reference site: <https://saas-docs.bagisto.com/> · <https://github.com/bagisto/saas-user-guide>
