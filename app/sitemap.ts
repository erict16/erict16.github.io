import { SITE_URL } from '@/lib/site';
import { MetadataRoute } from 'next';

export default function sitemap() {
  return [
    {
      lastModified: new Date().toISOString().split('T')[0],
      url: SITE_URL,
    },
  ] as MetadataRoute.Sitemap;
}
