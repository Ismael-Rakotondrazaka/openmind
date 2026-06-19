import type { SitemapUrl } from '#sitemap/types';

export default defineCachedEventHandler(
  async (): Promise<SitemapUrl[]> => {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        imageUrl: true,
        updatedAt: true,
        username: true,
      },
      where: { deletedAt: null },
    });

    return users.map(
      (user): SitemapUrl => ({
        _sitemap: 'users',
        images: user.imageUrl
          ? [
              {
                caption: `Profile image for ${user.username}`,
                loc: user.imageUrl,
                title: `Profile image for ${user.username}`,
              },
            ]
          : undefined,
        lastmod: user.updatedAt.toISOString(),
        loc: `/u/${user.username ?? user.id}`,
      })
    );
  },
  {
    maxAge: 60 * 60,
  }
);
