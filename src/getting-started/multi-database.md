# Multi-Database

Krayin's Multi-Tenant SaaS comes in **two flavours**, and they differ in exactly one thing:
*where each tenant's data is stored*. This guide documents the **single-database** edition —
the one running at your platform. This page explains the **multi-database** edition, so you
can tell which model you have and understand the trade-off.

::: info What you'll learn
- The difference between the single-database and multi-database editions
- How the multi-database model isolates each tenant
- The advantages and the costs of a database per tenant
- Which model suits which kind of platform
:::

## Two ways to separate tenants

Every SaaS has to keep one tenant's data from leaking into another's. Krayin offers two ways
to do it:

- **Single-database** *(this guide)* — one shared database. Every tenant-owned row carries a
  `company_id`, and the platform limits every query to the signed-in tenant's own rows.
  Separation is enforced in software. See [How It Works](/getting-started/architecture).
- **Multi-database** — **a separate database for every tenant**. There's no shared table to
  leak from, because each tenant's data physically lives in its own database.

The super-admin experience is nearly identical either way — the same tenants, plans,
subscriptions and cross-tenant views. What changes is what's happening underneath.

## How multi-database works

A small **central database** holds the platform's own records — the list of tenants, the
plans, invoices and settings. Each **tenant** then gets a database of its own, holding only
*their* CRM data.

When a request comes in, the platform reads the address (`acme.yourplatform.com`), works out
which tenant it belongs to, and connects to *that tenant's* database for the rest of the
request. The super admin, meanwhile, works against the central database and can read across
all the tenant databases for its platform-wide views.

<figure class="arch-figure">
<svg class="arch-diagram" viewBox="0 0 720 420" role="img" aria-labelledby="arch-title arch-desc" xmlns="http://www.w3.org/2000/svg">
  <title id="arch-title">Multi-database architecture</title>
  <desc id="arch-desc">A request is routed by domain to a tenant-specific database. A central database holds platform records and is used by the super admin.</desc>

  <!-- Super Admin -->
  <g class="node node-accent">
    <rect x="24" y="28" width="150" height="56" rx="10"/>
    <text x="99" y="52" class="t-title">Super Admin</text>
    <text x="99" y="70" class="t-sub">platform panel</text>
  </g>

  <!-- Incoming request / router -->
  <g class="node">
    <rect x="285" y="24" width="150" height="64" rx="10"/>
    <text x="360" y="48" class="t-title">Request</text>
    <text x="360" y="66" class="t-sub">acme.yourplatform.com</text>
  </g>

  <!-- Router diamond -->
  <g class="node node-router">
    <path d="M360 150 L432 186 L360 222 L288 186 Z"/>
    <text x="360" y="182" class="t-title">Route by</text>
    <text x="360" y="198" class="t-title">domain</text>
  </g>

  <!-- Central DB -->
  <g class="node node-central">
    <rect x="520" y="30" width="176" height="72" rx="10"/>
    <text x="608" y="54" class="t-title">Central database</text>
    <text x="608" y="74" class="t-sub">tenants · plans</text>
    <text x="608" y="90" class="t-sub">invoices · settings</text>
  </g>

  <!-- Tenant DBs -->
  <g class="node node-tenant">
    <rect x="40" y="320" width="176" height="72" rx="10"/>
    <text x="128" y="344" class="t-title">Acme database</text>
    <text x="128" y="364" class="t-sub">their leads, quotes,</text>
    <text x="128" y="380" class="t-sub">contacts</text>
  </g>
  <g class="node node-tenant">
    <rect x="272" y="320" width="176" height="72" rx="10"/>
    <text x="360" y="344" class="t-title">Northwind database</text>
    <text x="360" y="364" class="t-sub">their leads, quotes,</text>
    <text x="360" y="380" class="t-sub">contacts</text>
  </g>
  <g class="node node-tenant">
    <rect x="504" y="320" width="176" height="72" rx="10"/>
    <text x="592" y="344" class="t-title">Meridian database</text>
    <text x="592" y="364" class="t-sub">their leads, quotes,</text>
    <text x="592" y="380" class="t-sub">contacts</text>
  </g>

  <!-- Edges -->
  <g class="edge">
    <line x1="360" y1="88" x2="360" y2="150"/>
    <line x1="174" y1="56" x2="520" y2="60" class="edge-dashed"/>
    <line x1="330" y1="210" x2="160" y2="320"/>
    <line x1="360" y1="222" x2="360" y2="320"/>
    <line x1="390" y1="210" x2="560" y2="320"/>
  </g>
</svg>
<figcaption>Each tenant's CRM data lives in its own database; a small central database holds the platform's records.</figcaption>
</figure>

<style scoped>
.arch-figure { margin: 24px 0; }
.arch-diagram { width: 100%; height: auto; display: block; }
.arch-diagram .node rect,
.arch-diagram .node path {
  fill: var(--vp-c-bg-soft);
  stroke: var(--vp-c-divider);
  stroke-width: 1.5;
}
.arch-diagram .node-accent rect { fill: var(--vp-c-brand-soft); stroke: var(--vp-c-brand-1); }
.arch-diagram .node-central rect { fill: var(--vp-c-brand-soft); stroke: var(--vp-c-brand-1); }
.arch-diagram .node-router path { fill: var(--vp-c-brand-soft); stroke: var(--vp-c-brand-1); }
.arch-diagram .node-tenant rect { fill: var(--vp-c-bg-soft); stroke: var(--vp-c-brand-2); stroke-width: 2; }
.arch-diagram .t-title { fill: var(--vp-c-text-1); font-size: 13px; font-weight: 600; text-anchor: middle; font-family: var(--vp-font-family-base); }
.arch-diagram .t-sub { fill: var(--vp-c-text-2); font-size: 11px; text-anchor: middle; font-family: var(--vp-font-family-base); }
.arch-diagram .edge line { stroke: var(--vp-c-text-3); stroke-width: 1.5; }
.arch-diagram .edge .edge-dashed { stroke: var(--vp-c-brand-1); stroke-dasharray: 5 4; }
.arch-figure figcaption { color: var(--vp-c-text-2); font-size: 13px; text-align: center; margin-top: 8px; }
</style>

The dashed line marks the super admin reading the central database; the solid lines show a
tenant's request being routed to its own database.

## What a tenant gets, either way

From the tenant's seat, the two editions feel the same: their own subdomain, their own CRM,
their own team, and data no one else can see. A tenant never needs to know which model powers
the platform. Everything in the [Tenants](/tenants/registration) section applies to both.

## Advantages of a database per tenant

- **Maximum isolation.** There is no shared table, so one tenant's data can never appear in
  another's queries — separation is physical, not just enforced in code.
- **Per-tenant backup and restore.** You can back up, restore or migrate a single tenant
  without touching the others.
- **Independent scaling.** A heavy tenant can be moved to its own database server without
  affecting anyone else.
- **Cleaner compliance.** Data-residency and "delete all my data" requests are simpler when a
  tenant's data is a self-contained database.

## Things to keep in mind

- **More databases to run.** Maintenance — upgrades, backups, monitoring — scales with the
  number of tenants, not with one shared database.
- **Higher infrastructure cost.** Many databases cost more to host than one.
- **Slower sign-up.** A new tenant's database has to be created and a full CRM installed into
  it before they can sign in — this runs in the background and takes a moment, where the
  single-database edition is instant.
- **Database-creation privileges.** The platform's database user must be allowed to create and
  drop databases.

## Which model should you run?

| | Single-database *(this guide)* | Multi-database |
|---|---|---|
| Data separation | One shared DB, scoped by `company_id` | A separate DB per tenant |
| Best for | Many smaller tenants, lowest cost | Fewer, larger tenants needing hard isolation |
| Sign-up speed | Instant | A short provisioning wait |
| Ops overhead | One database | One per tenant |
| Isolation | Enforced in software | Physical |

Neither is "better" — they suit different businesses. If you're running many small tenants and
want the simplest, cheapest setup, single-database is the natural fit. If you have a smaller
number of larger customers who need their data physically apart, multi-database earns its extra
overhead.

::: tip The multi-database edition
The multi-database product is a separate Krayin extension with its own provisioning, email-OTP
registration and per-tenant SMTP. Its full write-up lives on Webkul's blog:
[User Guide for Krayin CRM Multi-DB SaaS](https://webkul.com/blog/user-guide-for-krayin-crm-multidb-sass/).
:::

## Where to go next

- How the single-database edition keeps tenants apart → [How It Works](/getting-started/architecture)
- What every tenant gets, on either model → [The Tenant Workspace](/tenants/tenant-workspace)
- Stand your platform up → [Installation](/getting-started/installation)
