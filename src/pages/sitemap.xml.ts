import { SITE_URL } from '@/lib/site';

export function GET() {
  const day = new Date().toISOString().split('T')[0];
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url>
<loc>${SITE_URL}</loc>
<lastmod>${day}</lastmod>
</url>
</urlset>
`,
    { headers: { 'Content-Type': 'application/xml' } },
  );
}
