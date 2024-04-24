import { type Follow } from "@prisma/client";

export const filterFollow = <T>(data: T & Follow): Follow => {
  return {
    id: data.id,
    createdAt: data.createdAt,
    followerId: data.followerId,
    followingId: data.followingId,
  };
};
