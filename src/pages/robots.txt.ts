export const prerender = true;

export function GET() {
  const isVercelPreview = process.env.VERCEL === '1' && process.env.VERCEL_ENV !== 'production';
  const site = isVercelPreview ? undefined : import.meta.env.SITE;
  const sitemapDirective = site ? `\nSitemap: ${new URL('/sitemap.xml', site).href}` : '';
  const body = `User-agent: *\nAllow: /${sitemapDirective}\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
