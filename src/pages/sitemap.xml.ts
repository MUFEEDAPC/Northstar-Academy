export const prerender = true;

import { indexableRoutes } from '../data/indexable-routes.js';

export function GET() {
  const isVercelPreview = process.env.VERCEL === '1' && process.env.VERCEL_ENV !== 'production';
  const site = isVercelPreview ? undefined : import.meta.env.SITE;
  const urls = site ? indexableRoutes.map((route) => `<url><loc>${new URL(route, site).href}</loc></url>`).join('') : '';
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
