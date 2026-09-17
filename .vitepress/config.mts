import { defineConfig } from "vitepress";

export default defineConfig({
  lang: "en-US",
  title: "Krayin SaaS Guide",
  description:
    "User documentation for the Krayin Multi-Tenant SaaS — super admin, tenants, subscription plans, billing, custom domains and platform settings.",

  srcDir: "./src",
  cleanUrls: true,
  lastUpdated: true,

  vite: {
    server: {
      // Reachable from another device on the LAN, for checking pages on a phone.
      host: "0.0.0.0",
    },
  },

  head: [["link", { rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]],

  themeConfig: {
    // The wordmark carries the branding, so the text title is redundant.
    siteTitle: false,

    logo: {
      light: "/logo.png",
      dark: "/logo-dark.png",
    },

    nav: [
      { text: "Introduction", link: "/getting-started/introduction" },
      { text: "User Guide", link: "https://docs.krayincrm.com/" },
      { text: "Dev Docs", link: "https://devdocs.krayincrm.com/" },
      { text: "Extensions", link: "https://krayincrm.com/extensions/" },
    ],

    editLink: {
      pattern:
        "https://github.com/krayin/saas-user-guide/edit/main/src/:path",
      text: "Help us improve this page on GitHub.",
    },

    lastUpdated: {
      text: "Last Updated",
      formatOptions: {
        dateStyle: "full",
      },
    },

    search: {
      provider: "local",
    },

    socialLinks: [
      { icon: "github", link: "https://github.com/krayin/laravel-crm" },
    ],

    sidebar: [
      {
        text: "Getting Started",
        collapsed: false,
        items: [
          { text: "Introduction", link: "/getting-started/introduction" },
          { text: "How It Works", link: "/getting-started/architecture" },
          { text: "Multi-Database", link: "/getting-started/multi-database" },
          { text: "Installation", link: "/getting-started/installation" },
        ],
      },
      {
        text: "Super Admin",
        collapsed: false,
        items: [
          { text: "Dashboard & Sign-in", link: "/super-admin/dashboard" },
          { text: "Tenant Management", link: "/super-admin/tenant-management" },
          { text: "Leads", link: "/super-admin/leads" },
          { text: "Quotes", link: "/super-admin/quotes" },
        ],
      },
      {
        text: "Subscriptions",
        collapsed: false,
        items: [
          { text: "Plan Management", link: "/subscriptions/plan-management" },
          { text: "Subscribers", link: "/subscriptions/subscribers" },
          { text: "Invoices", link: "/subscriptions/invoices" },
          { text: "Free Trials", link: "/subscriptions/trials" },
        ],
      },
      {
        text: "Settings",
        collapsed: false,
        items: [
          { text: "Agents & Roles", link: "/settings/agents-and-roles" },
          { text: "Configuration", link: "/settings/configuration" },
        ],
      },
      {
        text: "Tenants",
        collapsed: false,
        items: [
          { text: "Registration", link: "/tenants/registration" },
          { text: "The Tenant Workspace", link: "/tenants/tenant-workspace" },
          { text: "Choosing a Plan", link: "/tenants/choosing-a-plan" },
          { text: "Billing & Invoices", link: "/tenants/billing-and-invoices" },
          { text: "Custom Domains", link: "/tenants/custom-domains" },
        ],
      },
    ],
  },
});
