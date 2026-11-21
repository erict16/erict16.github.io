import { SITE_URL } from '@/lib/site';

export function GET() {
  return new Response(
    `User-Agent: *\n\nHost: ${SITE_URL}\nSitemap: ${SITE_URL}/sitemap.xml\n`,
  );
}
