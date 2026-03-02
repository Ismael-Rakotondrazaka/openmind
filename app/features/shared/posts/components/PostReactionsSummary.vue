<script lang="ts" setup>
import type { Post } from '../post.model';

import { useGetUserReactionToPost } from '../../reactions/composables/useGetUserReactionToPost';
import { useGetUsersWhoReactedToPost } from '../../reactions/composables/useGetUsersWhoReactedToPost';
import {
  ReactionStatusIcon,
  ReactionType,
} from '../../reactions/reaction.model';
import { getUserFullname } from '../../users/composables/useUserFullname';

type Props = {
  post: Post;
};

const emit = defineEmits<{
  'reactions-drawer:open': [];
}>();

const props = defineProps<Props>();

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
</script>

<template>
  <button
    v-if="post.reactions_count"
    class="group mb-2 flex flex-row items-center justify-start gap-2"
    type="button"
    @click="emit('reactions-drawer:open')"
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

    <span
      class="text-secondary-foreground group-hover:text-primary text-xs group-hover:underline"
    >
      {{ reactionsSummaryText }}
    </span>
  </button>
</template>
