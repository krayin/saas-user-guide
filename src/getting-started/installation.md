# Installation

This page is an operator's overview of what it takes to stand the platform up. The
step-by-step commands live in the module's own technical README; here we cover what you need
in place and what the process gives you, so you know what you're aiming for.

::: info Audience
Setting the platform up is a **technical** task, usually done once by whoever hosts it. If
that's not you, hand this page and the module README to your developer or host — then pick up
this guide at [The Dashboard](/super-admin/dashboard).
:::

## What you need

- **Krayin CRM v2.2.6** — the SaaS module installs on top of it.
- **PHP 8.3 or newer** and **Composer 2.x**.
- A **database** and **mail** service, configured as for any Krayin install.
- A domain you control, with **wildcard DNS** — because every tenant gets a subdomain
  (`*.yourplatform.com`), your DNS and web server must route all subdomains to the platform.

::: warning
Install the SaaS module **before** installing Krayin itself, and don't seed the database with
the usual Krayin seeder. The SaaS module has its own installer that sets the platform up
correctly — running the standard Krayin install first will get in its way.
:::

## What installation does

Once your developer has added the module and run its installer, the process will:

1. **Set your platform's address.** The app is pointed at your main domain — the address your
   super-admin panel lives on.
2. **Prepare the database** for multi-tenancy, adding the tenant stamping that keeps each
   tenant's data separate (see [Architecture](/getting-started/architecture)).
3. **Create your super-admin account.** The installer asks for the email and password you'll
   use to sign in. If you accept the defaults, that's `admin@example.com` with a default
   password — **change the password immediately** after your first sign-in.

## Wildcard subdomains

Because tenants live on subdomains, the single most important hosting detail is that
**`*.yourplatform.com` resolves to the platform**. If a new tenant signs up as `acme` and
`acme.yourplatform.com` doesn't load, it's almost always because wildcard DNS or the web
server's wildcard host rule isn't set up. Get this working before you onboard real tenants.

For local testing, this guide's own instance uses hostnames like `site1.krayin-saas.com`
mapped in the host machine's `hosts` file — the same idea as wildcard DNS, done by hand.

## First sign-in

With the platform installed, open the super-admin panel:

```
https://yourplatform.com/super/login
```

Sign in with the account the installer created. From here, the rest of this guide takes over.

## Where to go next

- Connect Stripe and set your logo → [Configuration](/settings/configuration)
- Create your first plans → [Plan Management](/subscriptions/plan-management)
- Onboard your first tenant → [Registration](/tenants/registration) ·
  [Tenant Management](/super-admin/tenant-management)
