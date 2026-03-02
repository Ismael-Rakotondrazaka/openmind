import type { SitemapUrl } from '#sitemap/types';

import { serverSupabaseServiceRole } from '#supabase/server';

export default defineCachedEventHandler(
  async (event): Promise<SitemapUrl[]> => {
    const client = serverSupabaseServiceRole(event);

    const { data: posts } = await client.from('posts').select(
      `
        id,
        title,
        slug,
        cover_url,
        updated_at,
        author:author_id(username, id)
        `,
      { count: 'exact' }
    );

    if (!posts) return [];

    return posts.map(
      (post): SitemapUrl => ({
        _sitemap: 'posts',
        images: post.cover_url
          ? [
              {
                caption: `Cover image for ${post.title}`,
                loc: post.cover_url,
                title: `Cover image for ${post.title}`,
              },
            ]
          : undefined,
        lastmod: post.updated_at,
        loc: `/u/${post.author.username ?? post.author.id}/posts/${post.slug}`,
      })
    );
  },
  {
    maxAge: 60 * 60, // 1 hour
  }
);
