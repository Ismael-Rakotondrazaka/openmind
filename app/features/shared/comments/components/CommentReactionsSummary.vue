<script lang="ts" setup>
import type { Comment } from '../comment.model';

import { useGetUserReactionToComment } from '../../reactions/composables/useGetUserReactionToComment';
import { useGetUsersWhoReactedToComment } from '../../reactions/composables/useGetUsersWhoReactedToComment';
import {
  ReactionStatusIcon,
  ReactionType,
} from '../../reactions/reaction.model';
import { getUserFullname } from '../../users/composables/useUserFullname';

type Props = {
  comment: Comment;
};

const emit = defineEmits<{
  'reactions-drawer:open': [];
}>();

const props = defineProps<Props>();

const user = useSupabaseUser();

const { data: userReactionToComment } = useGetUserReactionToComment(() => ({
  commentId: props.comment.id,
  userId: user.value?.sub,
}));

const { data: usersWhoReactedToComment } = useGetUsersWhoReactedToComment(
  () => ({
    commentId: props.comment.id,
    excludeUserId: user.value?.sub,
  })
);

const reactionsSummaryText = computed<string>(() => {
  if (props.comment.reactions_count === 0) {
    return '';
  }

  if (userReactionToComment.value) {
    if (props.comment.reactions_count === 1) {
      return 'You';
    }

    if (props.comment.reactions_count === 2) {
      if (
        usersWhoReactedToComment.value &&
        usersWhoReactedToComment.value.length === 1
      ) {
        return `You and ${getUserFullname(usersWhoReactedToComment.value[0]!)}`;
      }

      return 'You and 1 other person';
    }

    if (
      usersWhoReactedToComment.value &&
      usersWhoReactedToComment.value.length > 0
    ) {
      return `You, ${getUserFullname(usersWhoReactedToComment.value[0]!)} and ${toNumericAbbreviation(props.comment.reactions_count - 2)} others`;
    }

    return `You and ${toNumericAbbreviation(props.comment.reactions_count - 1)} others`;
  }

  if (props.comment.reactions_count === 1) {
    if (
      usersWhoReactedToComment.value &&
      usersWhoReactedToComment.value.length === 1
    ) {
      return `${getUserFullname(usersWhoReactedToComment.value[0]!)}`;
    }

    return '1 person';
  }

  if (
    usersWhoReactedToComment.value &&
    usersWhoReactedToComment.value.length === 1
  ) {
    if (props.comment.reactions_count === 2) {
      return `${getUserFullname(usersWhoReactedToComment.value[0]!)} and 1 other`;
    }

    return `${getUserFullname(usersWhoReactedToComment.value[0]!)} and ${toNumericAbbreviation(props.comment.reactions_count - 1)} others`;
  }

  return `${props.comment.reactions_count} others`;
});
</script>

<template>
  <button
    v-if="comment.reactions_count"
    class="group flex flex-row items-center justify-start gap-1"
    type="button"
    @click="emit('reactions-drawer:open')"
  >
    <div
      class="*:data-[slot=avatar]:ring-background flex -space-x-1 *:data-[slot=avatar]:ring-1 *:data-[slot=avatar]:grayscale"
    >
      <Avatar v-if="comment.reactions_details.like" class="size-4">
        <AvatarFallback class="text-[8px]">
          <Icon
            :name="ReactionStatusIcon.active[ReactionType.like]"
            size="0.6rem"
          />
        </AvatarFallback>
      </Avatar>
      <Avatar v-if="comment.reactions_details.love" class="size-4">
        <AvatarFallback class="text-[8px]">
          <Icon
            :name="ReactionStatusIcon.active[ReactionType.love]"
            size="0.6rem"
          />
        </AvatarFallback>
      </Avatar>
      <Avatar v-if="comment.reactions_details.celebrate" class="size-4">
        <AvatarFallback class="text-[8px]">
          <Icon
            :name="ReactionStatusIcon.active[ReactionType.celebrate]"
            size="0.6rem"
          />
        </AvatarFallback>
      </Avatar>
    </div>

    <span
      class="text-secondary-foreground group-hover:text-primary text-xs group-hover:underline"
    >
      {{ reactionsSummaryText }}
    </span>
  </button>
</template>
