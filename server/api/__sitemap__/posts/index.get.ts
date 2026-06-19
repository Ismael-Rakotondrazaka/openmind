import type { SitemapUrl } from '#sitemap/types';

export default defineCachedEventHandler(
  async (): Promise<SitemapUrl[]> => {
    const posts = await prisma.post.findMany({
      select: {
        author: { select: { id: true, username: true } },
        coverUrl: true,
        slug: true,
        title: true,
        updatedAt: true,
      },
      where: { deletedAt: null, status: 'published' },
    });

    return posts.map(
      (post): SitemapUrl => ({
        _sitemap: 'posts',
        images: post.coverUrl
          ? [
              {
                caption: `Cover image for ${post.title}`,
                loc: post.coverUrl,
                title: `Cover image for ${post.title}`,
              },
            ]
          : undefined,
        lastmod: post.updatedAt.toISOString(),
        loc: `/u/${post.author.username ?? post.author.id}/posts/${post.slug}`,
      })
    );
  },
  {
    maxAge: 60 * 60,
  }
);
