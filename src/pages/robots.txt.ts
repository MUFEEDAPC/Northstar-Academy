export const prerender = true;

export function GET() {
  const site = import.meta.env.SITE;
  const sitemapDirective = site ? `\nSitemap: ${new URL('/sitemap.xml', site).href}` : '';
  const body = `User-agent: *\nAllow: /${sitemapDirective}\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
