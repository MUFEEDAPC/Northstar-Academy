import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

// SITE_URL is the single source of truth for deployed canonical URLs.
// Keep the existing URL for local development only; never use it as a Vercel
// deployment fallback because the production domain has not been confirmed.
const configuredSite = process.env.SITE_URL?.trim();
const isVercel = process.env.VERCEL === '1';
const isProductionDeployment = isVercel && process.env.VERCEL_ENV === 'production';

if (isProductionDeployment && !configuredSite) {
  throw new Error('Set SITE_URL to the verified production domain in Vercel project settings.');
}

let site;
if (configuredSite) {
  let parsedSite;
  try {
    parsedSite = new URL(configuredSite);
  } catch {
    throw new Error('SITE_URL must be a valid absolute URL, such as https://academy.example.');
  }

  if ((isProductionDeployment && parsedSite.protocol !== 'https:') || parsedSite.pathname !== '/' || parsedSite.search || parsedSite.hash) {
    throw new Error('SITE_URL must be an HTTPS origin without a path, query, or fragment for production builds.');
  }

  site = parsedSite.origin;
} else if (!isVercel) {
  // Development-only value retained from the current Astro configuration.
  site = 'https://northstar.academy';
}

export default defineConfig({ integrations: [react(), tailwind()], site });
