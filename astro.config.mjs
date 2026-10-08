import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

// SITE_URL is the preferred source for deployed canonical URLs. On Vercel
// production, use its stable project production domain when SITE_URL is unset.
// Keep the existing URL for local development only.
const configuredSite = process.env.SITE_URL?.trim();
const isVercel = process.env.VERCEL === '1';
const isProductionDeployment = isVercel && process.env.VERCEL_ENV === 'production';
const vercelProductionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();

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
} else if (isProductionDeployment && vercelProductionHost) {
  const parsedSite = new URL(vercelProductionHost.startsWith('https://') ? vercelProductionHost : `https://${vercelProductionHost}`);
  if (parsedSite.protocol !== 'https:' || parsedSite.pathname !== '/' || parsedSite.search || parsedSite.hash) {
    throw new Error('VERCEL_PROJECT_PRODUCTION_URL must be a valid HTTPS domain.');
  }
  site = parsedSite.origin;
} else if (!isVercel) {
  // Development-only value retained from the current Astro configuration.
  site = 'https://northstar.academy';
}

export default defineConfig({ integrations: [react(), tailwind()], site });
