import { followRepository } from "~/repositories";
import {
  ShowFollowDataSchema,
  ShowFollowParamSchema,
  createNotFoundError,
  type ShowFollowData,
  type ShowFollowError,
} from "~/utils";

export default defineEventHandler(
  async (event): Promise<ShowFollowData | ShowFollowError> => {
    const showFollowParamSPR = await safeParseRequestParamAs(
      event,
      ShowFollowParamSchema,
    );

    if (!showFollowParamSPR.success) {
      return createNotFoundError(event);
    }

    const follow: ShowFollowData["follow"] | null =
      await followRepository.findFullOne({
        where: {
          id: showFollowParamSPR.data.id,
        },
      });

    if (follow === null) {
      return createNotFoundError(event);
    }

    return ShowFollowDataSchema.parse({
      follow,
    });
  },
);
