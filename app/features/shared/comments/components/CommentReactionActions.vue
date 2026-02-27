<script lang="ts" setup>
import { Button } from '@/components/ui/button';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

import type { Comment } from '../comment.model';

import { useCreateReaction } from '../../reactions/composables/useCreateReaction';
import { useDeleteReaction } from '../../reactions/composables/useDeleteReaction';
import { useGetUserReactionToComment } from '../../reactions/composables/useGetUserReactionToComment';
import { useUpdateReaction } from '../../reactions/composables/useUpdateReaction';
import {
  ReactionStatusIcon,
  ReactionType,
  ReactionTypeLabel,
  ReactionTypes,
} from '../../reactions/reaction.model';

type Props = {
  comment: Comment;
};

const props = defineProps<Props>();

const formattedReactionsCount = useNumericAbbreviation(
  () => props.comment.reactions_count
);

const user = useSupabaseUser();

const { data: userReactionToComment } = useGetUserReactionToComment(() => ({
  commentId: props.comment.id,
  userId: user.value?.sub,
}));

const reactionButtonIcon = computed<string>(() => {
  if (userReactionToComment.value) {
    return ReactionStatusIcon.active[
      userReactionToComment.value.type as ReactionType
    ];
  }

  return ReactionStatusIcon.inactive[ReactionType.like];
});

const createReactionMutation = useCreateReaction();
const updateReactionMutation = useUpdateReaction();
const deleteReactionMutation = useDeleteReaction();

const handleReactToComment = async (reactionType: ReactionType) => {
  if (userReactionToComment.value) {
    if (userReactionToComment.value.type === reactionType) {
      await deleteReactionMutation.mutateAsync(userReactionToComment.value.id);
      return;
    }

    await updateReactionMutation.mutateAsync({
      id: userReactionToComment.value.id,
      type: reactionType,
    });
    return;
  }

  if (!user.value?.sub) {
    return;
  }

  createReactionMutation.mutate({
    comment_id: props.comment.id,
    type: reactionType,
    user_id: user.value?.sub,
  });
};

const handleToggleReaction = async () => {
  if (userReactionToComment.value) {
    await deleteReactionMutation.mutateAsync(userReactionToComment.value.id);
  } else {
    if (!user.value?.sub) {
      return;
    }

    await createReactionMutation.mutateAsync({
      comment_id: props.comment.id,
      type: ReactionType.like,
      user_id: user.value?.sub,
    });
  }
};
</script>

<template>
  <HoverCard>
    <HoverCardTrigger>
      <Button
        :variant="userReactionToComment ? 'default' : 'ghost'"
        size="sm"
        class="h-6 rounded-full px-2 text-xs"
        @click="handleToggleReaction"
      >
        <Icon :name="reactionButtonIcon" class="size-3" />
        <span v-if="comment.reactions_count">{{
          formattedReactionsCount
        }}</span>
      </Button>
    </HoverCardTrigger>
    <HoverCardContent class="flex w-min flex-row flex-nowrap gap-4 p-2">
      <button
        v-for="reaction in ReactionTypes"
        :key="reaction"
        class="flex cursor-pointer flex-col items-center justify-center gap-2"
        type="button"
        @click="() => handleReactToComment(reaction)"
      >
        <Button
          :variant="
            userReactionToComment?.type === reaction ? 'default' : 'secondary'
          "
          size="icon"
          class="rounded-full"
          as="div"
        >
          <Icon
            :name="
              userReactionToComment?.type === reaction
                ? ReactionStatusIcon.active[reaction]
                : ReactionStatusIcon.inactive[reaction]
            "
          />
        </Button>
        <span
          class="text-xs font-medium"
          :class="
            userReactionToComment?.type === reaction
              ? 'text-primary'
              : 'text-secondary-foreground'
          "
        >
          {{ ReactionTypeLabel[reaction] }}
        </span>
      </button>
    </HoverCardContent>
  </HoverCard>
</template>
