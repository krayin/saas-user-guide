# Architecture

You don't need to be a developer to run the platform, but understanding how it keeps tenants
apart makes everything else — plans, custom domains, the cross-tenant views — make sense.
This page explains the model in plain terms.

::: info What you'll learn
- How one installation serves many tenants
- How each tenant's data stays private
- How the super admin sees across all tenants
:::

## One platform, many tenants

There is a single Krayin installation. Every business on it is a **tenant** (internally, a
"company"), and every tenant shares that one installation — you don't run a separate copy of
Krayin per customer.

What makes each tenant feel like they have their own CRM is two things: a web address of
their own, and strict data separation.

## Addresses: subdomains and custom domains

Each tenant is reached at their own **subdomain** — `acme.yourplatform.com`,
`northwind.yourplatform.com`, and so on. The subdomain is the tenant's **username**, chosen
when they register. The platform reads the address on every request and serves that tenant's
CRM.

A tenant can also point their **own domain** at the platform — `crm.acmeconsulting.com`
instead of `acme.yourplatform.com`. That's covered on [Custom Domains](/tenants/custom-domains).

::: tip
This is why usernames must be unique and URL-safe: the username *is* the address. Two tenants
can't share one, just as two websites can't share a domain.
:::

## Data separation: how tenants stay private

All tenants' data lives in one shared database, but each record is stamped with the tenant it
belongs to. When someone is signed in to a tenant's CRM, the platform automatically limits
**every** query to that tenant's own records — a tenant simply cannot see, or reach, another
tenant's leads, contacts or quotes. The separation is enforced for them at the data layer, so
there's nothing a tenant can do to step outside their own CRM.

A handful of genuinely shared reference tables — the list of countries and states, and the
directory of tenants itself — sit outside this scoping, because they're common to everyone.

::: tip Another way to separate tenants
This is the **single-database** edition, where separation is enforced in software. Krayin also
offers a **multi-database** edition that gives each tenant a database of its own — see
[Multi-Database](/getting-started/multi-database) for how the two compare.
:::

## The super admin sees everything

You, signed in to the super-admin panel, are the exception. The per-tenant limit doesn't
apply to you: that's precisely why you can see **all** tenants on the
[dashboard](/super-admin/dashboard), and browse [Leads](/super-admin/leads) and
[Quotes](/super-admin/quotes) from every tenant in one list.

So there are two vantage points, by design:

| | A tenant's admin | The super admin |
|---|---|---|
| Signs in at | `tenant.yourplatform.com/admin/login` | `yourplatform.com/super/login` |
| Sees | Only their own CRM | Every tenant |
| Manages | Their leads, quotes, contacts, team | Tenants, plans, subscriptions, invoices |

## Where to go next

- Stand the platform up → [Installation](/getting-started/installation)
- See the operator's view of all tenants → [Tenant Management](/super-admin/tenant-management)
- Set a tenant up on their own domain → [Custom Domains](/tenants/custom-domains)
