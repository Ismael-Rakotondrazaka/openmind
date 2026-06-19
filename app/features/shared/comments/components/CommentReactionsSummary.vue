<script lang="ts" setup>
import type { Comment } from '#shared/features/comments';

import { useQuery } from '@pinia/colada';
import {
  ReactionStatusIcon,
  ReactionType,
} from '#shared/features/reactions';
import { useI18n } from 'vue-i18n';

import { reactionsQuery } from '../../reactions/reaction.query';
import { getUserFullname } from '../../users/composables/useUserFullname';

type Props = {
  comment: Serialize<Comment>;
};

const emit = defineEmits<{
  'reactions-drawer:open': [];
}>();

const props = defineProps<Props>();

const { t } = useI18n();

const { user } = useUserSession();

const fetchFn = useRequestFetch();

const { data: myReactionPage } = useQuery(() => ({
  ...reactionsQuery({
    commentId: props.comment.id,
    fetchFn,
    pageSize: 1,
    userId: user.value?.id ?? undefined,
  }),
  enabled: Boolean(user.value?.id),
}));

const userReactionToComment = computed(
  () => myReactionPage.value?.data[0] ?? null
);

const { data: othersReactionPage } = useQuery(() =>
  reactionsQuery({
    commentId: props.comment.id,
    excludeUserId: user.value?.id,
    fetchFn,
    pageSize: 1,
  })
);

const usersWhoReactedToComment = computed(
  () => othersReactionPage.value?.data.map(r => r.user) ?? []
);

const reactionsSummaryText = computed<string>(() => {
  if (props.comment.reactionsCount === 0) {
    return '';
  }

  if (userReactionToComment.value) {
    if (props.comment.reactionsCount === 1) {
      return t('reactions.you');
    }

    if (props.comment.reactionsCount === 2) {
      if (
        usersWhoReactedToComment.value &&
        usersWhoReactedToComment.value.length === 1
      ) {
        return `${t('reactions.you')} and ${getUserFullname(usersWhoReactedToComment.value[0]!, t('users.defaultUsername'))}`;
      }

      return t('reactions.youAndOne');
    }

    if (
      usersWhoReactedToComment.value &&
      usersWhoReactedToComment.value.length > 0
    ) {
      return t('reactions.youNameAndOthers', {
        count: toNumericAbbreviation(props.comment.reactionsCount - 2),
        name: getUserFullname(
          usersWhoReactedToComment.value[0]!,
          t('users.defaultUsername')
        ),
      });
    }

    return t('reactions.youAndOthers', {
      count: toNumericAbbreviation(props.comment.reactionsCount - 1),
    });
  }

  if (props.comment.reactionsCount === 1) {
    if (
      usersWhoReactedToComment.value &&
      usersWhoReactedToComment.value.length === 1
    ) {
      return `${getUserFullname(usersWhoReactedToComment.value[0]!, t('users.defaultUsername'))}`;
    }

    return t('reactions.onePerson');
  }

  if (
    usersWhoReactedToComment.value &&
    usersWhoReactedToComment.value.length === 1
  ) {
    if (props.comment.reactionsCount === 2) {
      return t('reactions.nameAndOneOther', {
        name: getUserFullname(
          usersWhoReactedToComment.value[0]!,
          t('users.defaultUsername')
        ),
      });
    }

    return `${getUserFullname(usersWhoReactedToComment.value[0]!, t('users.defaultUsername'))} and ${toNumericAbbreviation(props.comment.reactionsCount - 1)} others`;
  }

  return `${props.comment.reactionsCount} others`;
});
</script>

<template>
  <button
    v-if="comment.reactionsCount"
    class="group flex flex-row items-center justify-start gap-1"
    type="button"
    @click="emit('reactions-drawer:open')"
  >
    <div
      class="*:data-[slot=avatar]:ring-background flex -space-x-1 *:data-[slot=avatar]:ring-1 *:data-[slot=avatar]:grayscale"
    >
      <Avatar v-if="comment.reactionsDetails.like" class="size-4">
        <AvatarFallback class="text-[8px]">
          <Icon
            :name="ReactionStatusIcon.active[ReactionType.like]"
            size="0.6rem"
          />
        </AvatarFallback>
      </Avatar>
      <Avatar v-if="comment.reactionsDetails.love" class="size-4">
        <AvatarFallback class="text-[8px]">
          <Icon
            :name="ReactionStatusIcon.active[ReactionType.love]"
            size="0.6rem"
          />
        </AvatarFallback>
      </Avatar>
      <Avatar v-if="comment.reactionsDetails.celebrate" class="size-4">
        <AvatarFallback class="text-[8px]">
          <Icon
            :name="ReactionStatusIcon.active[ReactionType.celebrate]"
            size="0.6rem"
          />
        </AvatarFallback>
      </Avatar>
    </div>

    <ClientOnly>
      <span
        class="text-secondary-foreground group-hover:text-primary text-xs group-hover:underline"
      >
        {{ reactionsSummaryText }}
      </span>
      <template #fallback>
        <span
          class="text-secondary-foreground group-hover:text-primary text-xs group-hover:underline"
        >
          {{ comment.reactionsCount }}
        </span>
      </template>
    </ClientOnly>
  </button>
</template>
