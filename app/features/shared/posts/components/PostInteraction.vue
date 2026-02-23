<template>
  <div class="mb-2">
    <button
      v-if="post.reactions_count"
      class="group mb-2 flex flex-row items-center justify-start gap-2"
    >
      <div
        class="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale"
      >
        <Avatar v-if="post.reactions_details.like">
          <AvatarFallback class="">
            <Icon
              :name="ReactionStatusIcon.active[ReactionType.like]"
              size="1rem"
            />
          </AvatarFallback>
        </Avatar>
        <Avatar v-if="post.reactions_details.love">
          <AvatarFallback class="">
            <Icon
              :name="ReactionStatusIcon.active[ReactionType.love]"
              size="1rem"
            />
          </AvatarFallback>
        </Avatar>
        <Avatar v-if="post.reactions_details.celebrate">
          <AvatarFallback class="">
            <Icon
              :name="ReactionStatusIcon.active[ReactionType.celebrate]"
              size="1rem"
            />
          </AvatarFallback>
        </Avatar>
      </div>

      <p
        class="text-secondary-foreground group-hover:text-primary text-xs group-hover:underline"
      >
        {{ reactionsSummaryText }}
      </p>
    </button>

    <div class="flex flex-row items-center justify-start gap-2">
      <HoverCard>
        <HoverCardTrigger>
          <Button
            :variant="userReactionToPost ? 'default' : 'secondary'"
            size="sm"
            class="rounded-full"
            @click="handleToggleReaction"
          >
            <Icon :name="reactionButtonIcon" />
            {{ formattedReactionsCount }}
          </Button>
        </HoverCardTrigger>
        <HoverCardContent class="flex w-min flex-row flex-nowrap gap-4 p-2">
          <button
            v-for="reaction in ReactionTypes"
            :key="reaction"
            class="flex cursor-pointer flex-col items-center justify-center gap-2"
            type="button"
            @click="() => handleReactToPost(reaction)"
          >
            <Button
              :variant="
                userReactionToPost?.type === reaction ? 'default' : 'secondary'
              "
              size="icon"
              class="rounded-full"
              as="div"
            >
              <Icon
                :name="
                  userReactionToPost?.type === reaction
                    ? ReactionStatusIcon.active[reaction]
                    : ReactionStatusIcon.inactive[reaction]
                "
              />
            </Button>
            <span
              class="text-xs font-medium"
              :class="
                userReactionToPost?.type === reaction
                  ? 'text-primary'
                  : 'text-secondary-foreground'
              "
            >
              {{ ReactionTypeLabel[reaction] }}
            </span>
          </button>
        </HoverCardContent>
      </HoverCard>
      <Button variant="secondary" size="sm" class="rounded-full">
        <Icon name="mdi:comment" />
        {{ formattedCommentsCount }}
      </Button>
      <Button variant="secondary" size="sm" class="rounded-full">
        <Icon name="mdi:eye" />
        {{ formattedViewsCount }}
      </Button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

import type { Post } from '../post.model';

import { useCreateReaction } from '../../reactions/composables/useCreateReaction';
import { useDeleteReaction } from '../../reactions/composables/useDeleteReaction';
import { useGetUserReactionToPost } from '../../reactions/composables/useGetUserReactionToPost';
import { useGetUsersWhoReactedToPost } from '../../reactions/composables/useGetUsersWhoReactedToPost';
import { useUpdateReaction } from '../../reactions/composables/useUpdateReaction';
import {
  ReactionStatusIcon,
  ReactionType,
  ReactionTypeLabel,
  ReactionTypes,
} from '../../reactions/reaction.model';
import { getUserFullname } from '../../users/composables/useUserFullname';

type Props = {
  post: Post;
};

const props = defineProps<Props>();

const formattedReactionsCount = useNumericAbbreviation(
  () => props.post.reactions_count
);
const formattedViewsCount = useNumericAbbreviation(
  () => props.post.views_count
);
const formattedCommentsCount = useNumericAbbreviation(
  () => props.post.comments_count
);

const user = useSupabaseUser();

const { data: userReactionToPost } = useGetUserReactionToPost(() => ({
  postId: props.post.id,
  userId: user.value?.sub,
}));

const { data: usersWhoReactedToPost } = useGetUsersWhoReactedToPost(() => ({
  excludeUserId: user.value?.sub,
  limit: 1,
  orderBy: 'created_at',
  postId: props.post.id,
  sortOrder: SortOrder.desc,
}));

const reactionsSummaryText = computed<string>(() => {
  if (props.post.reactions_count === 0) {
    return 'No reactions yet';
  }

  if (userReactionToPost.value) {
    if (props.post.reactions_count === 1) {
      return 'You';
    }

    if (props.post.reactions_count === 2) {
      if (
        usersWhoReactedToPost.value &&
        usersWhoReactedToPost.value.length === 1
      ) {
        return `You and ${getUserFullname(usersWhoReactedToPost.value[0]!)}`;
      }

      return 'You and 1 other person';
    }

    if (usersWhoReactedToPost.value && usersWhoReactedToPost.value.length > 0) {
      return `You, ${getUserFullname(usersWhoReactedToPost.value[0]!)} and ${toNumericAbbreviation(props.post.reactions_count - 2)} others`;
    }

    return `You and ${toNumericAbbreviation(props.post.reactions_count - 1)} others`;
  }

  if (props.post.reactions_count === 1) {
    if (
      usersWhoReactedToPost.value &&
      usersWhoReactedToPost.value.length === 1
    ) {
      return `${getUserFullname(usersWhoReactedToPost.value[0]!)}`;
    }

    return '1 person';
  }

  if (usersWhoReactedToPost.value && usersWhoReactedToPost.value.length === 1) {
    if (props.post.reactions_count === 2) {
      return `${getUserFullname(usersWhoReactedToPost.value[0]!)} and 1 other`;
    }

    return `${getUserFullname(usersWhoReactedToPost.value[0]!)} and ${toNumericAbbreviation(props.post.reactions_count - 1)} others`;
  }

  return `${props.post.reactions_count} others`;
});

const reactionButtonIcon = computed<string>(() => {
  if (userReactionToPost.value) {
    return ReactionStatusIcon.active[
      userReactionToPost.value.type as ReactionType
    ];
  }

  return ReactionStatusIcon.inactive[ReactionType.like];
});

const createReactionMutation = useCreateReaction();
const updateReactionMutation = useUpdateReaction();
const deleteReactionMutation = useDeleteReaction();

const handleReactToPost = async (reactionType: ReactionType) => {
  if (userReactionToPost.value) {
    if (userReactionToPost.value.type === reactionType) {
      await deleteReactionMutation.mutateAsync(userReactionToPost.value.id);
      return;
    }

    await updateReactionMutation.mutateAsync({
      id: userReactionToPost.value.id,
      type: reactionType,
    });
  }

  if (!user.value?.sub) {
    return;
  }

  createReactionMutation.mutate({
    post_id: props.post.id,
    type: reactionType,
    user_id: user.value?.sub,
  });
};

const handleToggleReaction = async () => {
  if (userReactionToPost.value) {
    await deleteReactionMutation.mutateAsync(userReactionToPost.value.id);
  } else {
    if (!user.value?.sub) {
      return;
    }

    await createReactionMutation.mutateAsync({
      post_id: props.post.id,
      type: ReactionType.like,
      user_id: user.value?.sub,
    });
  }
};
</script>
