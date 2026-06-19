import type { FollowModel } from '../../../prisma/generated/client/models';
import type { UserProfile } from '../users/user.model';

export type { FollowModel };

export type FollowWithUsers = {
  follower: UserProfile;
  following: UserProfile;
} & FollowModel;
