# Krayin SaaS User Guide — Build Plan

A VitePress documentation site for the Krayin Multi-Tenant SaaS, modelled on Bagisto's
[SaaS guide](https://saas-docs.bagisto.com/) ([repo](https://github.com/bagisto/saas-user-guide)).

- **Workspace:** `/home/users/vikas.vishwakarma/www/html/Krayin/saas-user-guide`
- **Remote:** `https://github.com/krayin/saas-user-guide.git`
- **Live site:** <https://saas-docs.demo.krayincrm.com/>
- **Source of truth for behaviour:** `../saas` (`SaasKrayin` + `SaasSubscription`)
- **Skill:** `.claude/skills/krayin-saas-guide/SKILL.md`

---

## 1. What the reference does

Inspected from a clone of `bagisto/saas-user-guide`, not assumed:

| Aspect | Finding |
|---|---|
| Generator | VitePress `^1.6.4`, `serve` as the only runtime dep |
| Scripts | `docs:dev`, `docs:build`, `docs:preview` |
| Content root | `srcDir: "./src"`, `cleanUrls: true`, `lastUpdated: true` |
| Config | `.vitepress/config.mts` — nav, grouped sidebar, local search, edit links |
| Theme | Extends `DefaultTheme`; `custom.css` + one Vue component |
| `ImagePopup.vue` | Click-to-zoom lightbox for screenshots — the only custom component |
| Sidebar UX | `theme/index.ts` scrolls the active sidebar entry into view on navigation |
| Scale | 25 markdown pages, 64 screenshots |
| Deploy | GH Actions → `peaceiris/actions-gh-pages@v4`, Node 20, `CNAME` |
| Search | Built-in `local` provider (no Algolia) |

**Page conventions:** H1 = screen name → intro sentence → `::: info What you'll learn` →
task-based `##` headings → `<ImagePopup>` after the instruction → bolded UI labels →
bulleted field lists → `::: tip` linking onward.

The prose is written for an operator, not a developer. That voice is the thing most worth
copying.

## 2. What we are *not* copying

Bagisto is eCommerce; Krayin is CRM. These Bagisto sections have no Krayin equivalent and
must not be ported:

- Storefront Themes (Breeze, Fashion, Commercia, Adornments)
- Mobile App Requests

Krayin adds surfaces Bagisto's guide has no counterpart for: **cross-tenant Leads** and
**Quotes** in the super admin.

## 3. Verified Krayin surface

Taken from `super-menu.php`, the route files and `super-core-config.php` — this is what
actually exists, and therefore what the guide may document:

**Super admin menu:** `dashboard`, `tenants`, `leads`, `quotes`, `settings`
(`settings.agent`, `settings.agent.roles`, `settings.agent.agents`), `configuration`

**Subscription menu:** `subscription.plan`, `subscription.subscriber`, `subscription.invoice`

**Configuration groups:** `general.subscription`, `.subscription_settings`,
`.payment_stripe`, `.trial_settings`

A **free-trial** feature ships alongside these: `Helpers/Trial.php`, `isTrial()` in
`PlanPresenter`, and a `trial_settings` config group with **status** and **trial days**. A
trial plan renders as a card with a length instead of a price and links straight to
registration rather than a payment gateway. It gets its own page.

## 4. Proposed structure

~20 pages across 5 sections, ordered the way an operator actually works: stand the
platform up → onboard tenants → run billing.

```
src/
├── index.md                          # hero + feature cards
├── getting-started/
│   ├── introduction.md               # what the SaaS module is, who it's for
│   ├── architecture.md               # single DB, company_id scoping, subdomains
│   └── installation.md               # saas:install, .env, vhost/DNS
├── super-admin/
│   ├── dashboard.md                  # /super/login, KPI tiles, recent tenants
│   ├── tenant-management.md          # create, edit, block, delete
│   ├── leads.md                      # cross-tenant leads, per-tenant filter
│   └── quotes.md                     # cross-tenant quotes
├── subscriptions/
│   ├── plan-management.md            # create/edit, monthly+yearly, offers, restrictions
│   ├── subscribers.md                # who is on what, expiry
│   ├── invoices.md                   # invoice list, PDF, resend
│   └── trials.md                     # free-trial status + length, trial plan cards
├── settings/
│   ├── agents-and-roles.md           # platform staff + permissions
│   └── configuration.md              # subscription toggle, Stripe keys, locale
└── tenants/
    ├── registration.md               # 3-step wizard (Organization → Auth → Personal)
    ├── tenant-workspace.md           # what a tenant gets on first login
    ├── choosing-a-plan.md            # pricing page, monthly/yearly toggle, checkout
    ├── billing-and-invoices.md       # tenant's own plan, upgrade, invoices, cancel
    └── custom-domains.md             # CNAME: DNS → vhost → field → verify
```

**Audience.** The guide covers both the operator and the tenant. Sections 2–4 are operator
facing; `tenants/` is largely tenant facing. Each page says which panel the reader should
be in.

`src/public/images/<page-slug>/` holds the screenshots, one folder per page.

## 5. Phases

### Phase 1 — Scaffold
- `package.json` (VitePress `^1.6.4`, the three `docs:*` scripts)
- `.vitepress/config.mts` — Krayin title, nav to krayincrm.com / docs / devdocs, local
  search, edit link to `krayin/saas-user-guide`, grouped sidebar
- `.vitepress/theme/` — `index.ts` (register `ImagePopup`, sidebar auto-scroll),
  `custom.css` with **Krayin brand colours**, `components/ImagePopup.vue`
- `src/public/` — Krayin logo, favicon
- `.github/workflows/deploy.yml`, `CNAME`, `.gitignore`
- **Exit:** `npm run docs:dev` serves an empty shell with correct branding.

### Phase 2 — Skeleton
- Every page from §4 as a stub: H1 + intro + `What you'll learn`
- Full sidebar wired in config
- **Exit:** `npm run docs:build` passes with zero dead links.

### Phase 3 — Content, section by section
Per page, following the skill: research code → capture screenshots → write → build.

Order (each builds on the last):
1. Getting Started
2. Super Admin
3. Subscriptions
4. Settings
5. Tenants

- **Exit:** every page has verified prose and real screenshots.

**Progress (2026-09-16):**
- ✅ Super Admin — dashboard, tenant-management, leads, quotes
- ✅ Subscriptions — plan-management, subscribers, invoices, trials
- ✅ Settings — agents-and-roles, configuration
- ✅ Getting Started — introduction, architecture, installation
- ✅ Tenants — registration, tenant-workspace, choosing-a-plan, billing-and-invoices, custom-domains
- **All 18 content pages written; `docs:build` passes (no dead links).**
- **Payment flow documented** (registration.md): post-registration **Payment Gateways** page →
  **Stripe hosted checkout** (real redirect to checkout.stripe.com, Sandbox), → callback
  activates account + raises invoice. Screenshots: registration/payment-gateway.png,
  registration/stripe-checkout.png. configuration.md Stripe section cross-links this flow and
  explains the webhook's role. Verified flow in code: SuperPlanController@paymentGetways →
  super.payment.gateway.initiate (StripeGateway hosted Checkout) → .callback / .webhook.
- Phase 4 remaining: final read-through, polish index.md, deploy check.

**App quirks observed (not ours to fix in the docs task — no app commits):**
- `remaining_days` (subscriber grid *Plan Validity / Remaining Days* and subscriber view
  *Remaining Days*) renders as a raw Carbon float, e.g. `209.145…`, not a whole number.
  Screenshots reflect the real screen; not called out in the prose.
- The subscriber **view** *Plan Amount* shows the plan's base monthly amount ($129) even for a
  yearly cycle, rather than the yearly amount actually charged. The page describes the field
  by what its label means, not by asserting the number.

### Phase 4 — Polish & ship
- `index.md` hero + feature cards
- Read every page end to end as a new operator would
- Confirm the GH Pages deploy and the custom domain

## 6. Risks

| Risk | Mitigation |
|---|---|
| Docs drift from code | Skill forbids writing from memory; every claim traced to code |
| Screenshots go stale | One folder per page, named by subject, so re-capture is cheap |
| Bagisto content bleeds in | §2 lists the excluded sections explicitly |
| Dev vocabulary in user prose | Skill checklist; reviewed at Phase 4 |

## 7. Decisions

| Question | Decision |
|---|---|
| Live domain | `saas-docs.demo.krayincrm.com` → goes in `CNAME`; GitHub Pages serves it |
| Local review | Everything is written and reviewed locally first — `docs:dev` while writing, `docs:build` to catch dead links, `docs:preview` to see the deployed output. Nothing ships unreviewed in a browser |
| Screenshots | Reuse the `krayin-blog` capture conventions (Playwright MCP, 1600×900, `deviceScaleFactor: 2`, saved `storageState`, groom demo data, blur PII) — but **no** `frame_shots.py`. Docs shots stay raw and tightly cropped; `<ImagePopup>` supplies the framing |
| Scope | Cover **everything** — operator *and* tenant. `tenants/` grew to 5 pages: registration, workspace, choosing a plan, billing & invoices, custom domains |

### Local workflow

```bash
npm run docs:dev        # http://localhost:5173, hot reload
npm run docs:build      # fails on dead internal links
npm run docs:preview    # production build, exactly as deployed
```

`vite.server.host = "0.0.0.0"` in the config, so the dev server is reachable from another
device on the LAN for a mobile check.

Review each page in the browser before calling it done: click every `<ImagePopup>`, toggle
dark mode, narrow to phone width, and search for the page's main term.

## 8. Screenshot instance & assets

**Instance:** the local SaaS at <http://krayin-saas.com/> (super admin at `/super/login`).
Confirmed reachable, 200 on both. Tenant subdomains resolve via `/etc/hosts` and the
Apache vhost aliases already in place.

**Branding:** Krayin ships SVG logos in
`packages/Webkul/Admin/src/Resources/assets/images/` — `logo.svg` (light),
`dark-logo.svg`, plus `favicon.ico`.

VitePress wants raster logos. ImageMagick is available and handles the conversion with
transparency intact (verified — produces 315×120 RGBA):

```bash
SRC=../saas/packages/Webkul/Admin/src/Resources/assets/images

convert -background none -density 300 "$SRC/logo.svg"      -resize x120 src/public/logo.png
convert -background none -density 300 "$SRC/dark-logo.svg" -resize x120 src/public/logo-dark.png
convert -background none -density 300 "$SRC/logo.svg"      -resize x320 src/public/logo-large.png
cp "$SRC/favicon.ico" src/public/favicon.ico
```

The nav logo takes `{ light, dark }` so the wordmark stays legible in both themes;
`logo-large.png` is the homepage hero image.

### Demo data — seeded

Done. The instance now carries presentable data, and every screenshot should be taken
against it so names stay consistent across pages.

**Plans** — created through the real model path, so `PlanObserver` synced them to Stripe
(test mode, `acct_1NskbXBqRFgD1CFE`):

| Plan | Monthly | Yearly | Stripe |
|---|---|---|---|
| Starter | $19 | $190 | product + both price ids |
| Growth (recommended) | $49 (−$4) | $490 (−$98) | product + both price ids |
| Scale | $129 | $1290 (−$290) | product + both price ids |
| Free Trial | — | — | none, by design |

A trial is granted in-app and never charged, so the observer keeps it out of the gateway —
worth explaining on the Free Trials page. Trials were switched on at **14 days**. The old
"Plan A" / "Free Plan" placeholders were deleted.

**Tenants** — constrained to `site1`–`site3`, the only subdomains in `/etc/hosts`. A tenant
under any other username appears in the grids but its workspace will not load, so never
invent one for a screenshot.

| Subdomain | Tenant | Email | CNAME |
|---|---|---|---|
| `site1` | Acme Consulting | `hello@acmeconsulting.example` | — |
| `site2` | Northwind Supply Co. | `hello@northwindsupply.example` | — |
| `site3` | Meridian Labs | `team@meridianlabs.example` | `cname-krayin-saas.com` |

Each has 8 leads, 8 contacts, 8 organisations and 3 quotes, spread across pipeline stages
with staggered dates so grids and charts look lived-in. `site2`/`site3` were registered
through the real endpoint, so they carry proper pipelines, sources and email templates.

**Two things fixed before they became defects:**

- `site1` held a real `@webkul.in` address on both the company and its admin user. Renamed;
  zero webkul addresses remain anywhere.
- The Laravel debugbar was overlaying every page. `DEBUGBAR_ENABLED=false` added to the
  `saas` `.env` (`APP_DEBUG` left alone, so errors still surface while authoring).
