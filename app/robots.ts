import { SITE_URL } from '@/lib/site';

export default function robots() {
  return {
    host: SITE_URL,
    rules: [
      {
        userAgent: '*',
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
