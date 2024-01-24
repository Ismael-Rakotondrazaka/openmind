import {
  type ShowViewData,
  type ShowViewError,
  ShowViewParamSchema,
  createNotFoundError,
} from "~/utils";

export default defineEventHandler(
  async (event): Promise<ShowViewData | ShowViewError> => {
    const showViewParamSPR = await safeParseRequestParamAs(
      event,
      ShowViewParamSchema,
    );

    if (!showViewParamSPR.success) {
      return createNotFoundError(event);
    }

    const view: ShowViewData["view"] | null =
      await event.context.prisma.view.findFirst({
        where: {
          id: showViewParamSPR.data.id,
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              name: true,
              firstName: true,
              profileUrl: true,
              role: true,
              createdAt: true,
              updatedAt: true,
              deletedAt: true,
            },
          },
        },
      });

    if (view === null) {
      return createNotFoundError(event);
    }

    return {
      view,
    };
  },
);
