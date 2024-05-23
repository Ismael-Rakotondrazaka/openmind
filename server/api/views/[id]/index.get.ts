import { viewRepository } from "~/repositories";
import {
  ShowViewParamSchema,
  createNotFoundError,
  type ShowViewData,
  type ShowViewError,
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

    const view: ShowViewData["view"] | null = await viewRepository.findFullOne({
      where: {
        id: showViewParamSPR.data.id,
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
