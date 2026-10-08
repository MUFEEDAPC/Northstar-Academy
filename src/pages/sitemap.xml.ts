export const prerender = true;

export function GET() {
  const site = import.meta.env.SITE;
  const urls = site ? `<url><loc>${new URL('/', site).href}</loc></url>` : '';
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
