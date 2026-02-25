<script lang="ts" setup>
import { Button } from '@/components/ui/button';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

import type { Post } from '../post.model';

import { useCreateReaction } from '../../reactions/composables/useCreateReaction';
import { useDeleteReaction } from '../../reactions/composables/useDeleteReaction';
import { useGetUserReactionToPost } from '../../reactions/composables/useGetUserReactionToPost';
import { useUpdateReaction } from '../../reactions/composables/useUpdateReaction';
import {
  ReactionStatusIcon,
  ReactionType,
  ReactionTypeLabel,
  ReactionTypes,
} from '../../reactions/reaction.model';

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

<template>
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
</template>
