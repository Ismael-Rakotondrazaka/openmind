import type { SitemapUrl } from '#sitemap/types';

import { serverSupabaseServiceRole } from '#supabase/server';

export default defineCachedEventHandler(
  async (event): Promise<SitemapUrl[]> => {
    const client = serverSupabaseServiceRole(event);

    const { data: users } = await client.from('users').select(
      `
      id,
      username,
      image_url,
      updated_at
      `,
      { count: 'exact' }
    );

    if (!users) return [];

    return users.map(
      (user): SitemapUrl => ({
        _sitemap: 'users',
        images: user.image_url
          ? [
              {
                caption: `Profile image for ${user.username}`,
                loc: user.image_url,
                title: `Profile image for ${user.username}`,
              },
            ]
          : undefined,
        lastmod: user.updated_at,
        loc: `/u/${user.username ?? user.id}`,
      })
    );
  },
  {
    maxAge: 60 * 60, // 1 hour
  }
);
