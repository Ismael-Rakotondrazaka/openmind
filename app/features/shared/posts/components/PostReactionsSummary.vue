<script lang="ts" setup>
import type { PostReactionsDetails, PostView } from '#shared/features/posts';

import { useQuery } from '@pinia/colada';
import {
  ReactionStatusIcon,
  ReactionType,
} from '#shared/features/reactions';
import { useI18n } from 'vue-i18n';

import { reactionsQuery } from '../../reactions/reaction.query';
import { getUserFullname } from '../../users/composables/useUserFullname';

type Props = {
  post: Serialize<PostView>;
};

const emit = defineEmits<{
  'reactions-drawer:open': [];
}>();

const props = defineProps<Props>();

const { t } = useI18n();

const reactionsDetails = computed(
  () => props.post.reactionsDetails as PostReactionsDetails
);

const { user } = useUserSession();

const fetchFn = useRequestFetch();

const { data: myReactionPage } = useQuery(() => ({
  ...reactionsQuery({
    fetchFn,
    pageSize: 1,
    postId: props.post.id,
    userId: user.value?.id ?? undefined,
  }),
  enabled: Boolean(user.value?.id),
}));

const userReactionToPost = computed(
  () => myReactionPage.value?.data[0] ?? null
);

const { data: othersReactionPage } = useQuery(() =>
  reactionsQuery({
    excludeUserId: user.value?.id,
    fetchFn,
    pageSize: 1,
    postId: props.post.id,
  })
);

const usersWhoReactedToPost = computed(
  () => othersReactionPage.value?.data.map(r => r.user) ?? []
);

const reactionsSummaryText = computed<string>(() => {
  if (props.post.reactionsCount === 0) {
    return t('reactions.noReactionsYet');
  }

  if (userReactionToPost.value) {
    if (props.post.reactionsCount === 1) {
      return t('reactions.you');
    }

    if (props.post.reactionsCount === 2) {
      if (
        usersWhoReactedToPost.value &&
        usersWhoReactedToPost.value.length === 1
      ) {
        return `${t('reactions.you')} and ${getUserFullname(usersWhoReactedToPost.value[0]!, t('users.defaultUsername'))}`;
      }

      return t('reactions.youAndOne');
    }

    if (usersWhoReactedToPost.value && usersWhoReactedToPost.value.length > 0) {
      return t('reactions.youNameAndOthers', {
        count: toNumericAbbreviation(props.post.reactionsCount - 2),
        name: getUserFullname(
          usersWhoReactedToPost.value[0]!,
          t('users.defaultUsername')
        ),
      });
    }

    return t('reactions.youAndOthers', {
      count: toNumericAbbreviation(props.post.reactionsCount - 1),
    });
  }

  if (props.post.reactionsCount === 1) {
    if (
      usersWhoReactedToPost.value &&
      usersWhoReactedToPost.value.length === 1
    ) {
      return `${getUserFullname(usersWhoReactedToPost.value[0]!, t('users.defaultUsername'))}`;
    }

    return t('reactions.onePerson');
  }

  if (usersWhoReactedToPost.value && usersWhoReactedToPost.value.length === 1) {
    if (props.post.reactionsCount === 2) {
      return t('reactions.nameAndOneOther', {
        name: getUserFullname(
          usersWhoReactedToPost.value[0]!,
          t('users.defaultUsername')
        ),
      });
    }

    return `${getUserFullname(usersWhoReactedToPost.value[0]!, t('users.defaultUsername'))} and ${toNumericAbbreviation(props.post.reactionsCount - 1)} others`;
  }

  return `${props.post.reactionsCount} others`;
});
</script>

<template>
  <button
    v-if="post.reactionsCount"
    class="group mb-2 flex flex-row items-center justify-start gap-2"
    type="button"
    @click="emit('reactions-drawer:open')"
  >
    <div
      class="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale"
    >
      <Avatar v-if="reactionsDetails.like">
        <AvatarFallback class="">
          <Icon
            :name="ReactionStatusIcon.active[ReactionType.like]"
            size="1rem"
          />
        </AvatarFallback>
      </Avatar>
      <Avatar v-if="reactionsDetails.love">
        <AvatarFallback class="">
          <Icon
            :name="ReactionStatusIcon.active[ReactionType.love]"
            size="1rem"
          />
        </AvatarFallback>
      </Avatar>
      <Avatar v-if="reactionsDetails.celebrate">
        <AvatarFallback class="">
          <Icon
            :name="ReactionStatusIcon.active[ReactionType.celebrate]"
            size="1rem"
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
          {{ post.reactionsCount }}
        </span>
      </template>
    </ClientOnly>
  </button>
</template>
