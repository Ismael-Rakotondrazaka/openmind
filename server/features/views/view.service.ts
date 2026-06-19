import type { RecordViewBody } from '#shared/features/views';

export const recordView = async (
  userId: string | undefined,
  body: RecordViewBody
): Promise<{ success: boolean }> => {
  const { postId } = body;

  if (!userId) {
    await prisma.post.update({
      data: { viewsCount: { increment: 1 } },
      where: { id: postId },
    });
    return { success: true };
  }

  const existing = await prisma.view.findUnique({
    where: { postId_userId: { postId, userId } },
  });

  if (!existing) {
    await prisma.$transaction([
      prisma.view.create({ data: { postId, userId } }),
      prisma.post.update({
        data: { viewsCount: { increment: 1 } },
        where: { id: postId },
      }),
    ]);
  }

  return { success: true };
};
