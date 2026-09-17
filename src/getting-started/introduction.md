# Introduction

Krayin Multi-Tenant SaaS turns Krayin CRM into a product you can *sell*. Instead of running
one CRM for your own business, you run a platform where many businesses each get their own
CRM — on their own web address, with their own data — and you charge them a subscription for
it.

::: info Who this guide is for
This guide covers **both** sides of the platform:
- **Operators** — you, running the platform: onboarding tenants, building plans, taking
  payment.
- **Tenants** — your customers, using the CRM they subscribed to.

Each page says at the top which panel it's about, so you always know where you should be.
:::

## The two audiences

The platform has two completely separate front doors:

- **The super-admin panel** — where *you* run the business. You sign in at `/super/login`
  and manage every tenant, plan, subscription and invoice from one place. This is the subject
  of the **Super Admin**, **Subscriptions** and **Settings** sections of this guide.
- **A tenant's CRM** — where *your customer* works. Each tenant gets a full Krayin CRM on
  their own subdomain, with its own admin login at `/admin/login`. The **Tenants** section
  covers this side.

## What a tenant gets

When a business signs up, they get a genuine, self-contained CRM — not a limited demo:

- Their own **subdomain**, e.g. `acme.yourplatform.com`, and optionally their own
  [custom domain](/tenants/custom-domains).
- A private CRM with **Leads**, **Quotes**, **Contacts**, **Organizations** and pipelines.
- Their own team of users, roles and settings — entirely separate from every other tenant.

## What you get as the operator

From the super-admin panel you can:

- See and manage every [tenant](/super-admin/tenant-management) on the platform.
- Watch activity across all tenants at a glance on the [dashboard](/super-admin/dashboard),
  and view cross-tenant [Leads](/super-admin/leads) and [Quotes](/super-admin/quotes).
- Build subscription [plans](/subscriptions/plan-management) — monthly, yearly, with offers
  and resource limits — and offer a [free trial](/subscriptions/trials).
- Take payment through [Stripe](/settings/configuration) and track every
  [subscriber](/subscriptions/subscribers) and [invoice](/subscriptions/invoices).

## Where to go next

- Understand how tenants stay separated → [Architecture](/getting-started/architecture)
- Get the platform running → [Installation](/getting-started/installation)
- Jump straight to the operator's home base → [The Dashboard](/super-admin/dashboard)
