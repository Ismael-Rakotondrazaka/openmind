<script lang="ts" setup>
import type { PostView } from '#shared/features/posts';

import { useMutation, useQuery } from '@pinia/colada';
import {
  ReactionStatusIcon,
  ReactionType,
  ReactionTypeLabel,
  ReactionTypes,
} from '#shared/features/reactions';
import { useI18n } from 'vue-i18n';

import LoginPromptModal from '@/components/common/LoginPromptModal.vue';
import { Button } from '@/components/ui/button';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

import {
  reactionsQuery,
  useToggleReaction,
} from '../../reactions/reaction.query';

type Props = {
  post: Serialize<PostView>;
};

const props = defineProps<Props>();

const formattedReactionsCount = useNumericAbbreviation(
  () => props.post.reactionsCount
);
const formattedViewsCount = useNumericAbbreviation(() => props.post.viewsCount);
const formattedCommentsCount = useNumericAbbreviation(
  () => props.post.commentsCount
);

const { user } = useUserSession();

const fetchFn = useRequestFetch();

const { data: myReactionPage } = useQuery(() => ({
  ...reactionsQuery({
    fetchFn,
    pageSize: 1,
    postId: props.post.id,
    userId: user.value?.id,
  }),
  enabled: Boolean(user.value?.id),
}));

const userReactionToPost = computed(() => {
  if (!user.value?.id) return null;
  return myReactionPage.value?.data[0] ?? null;
});

const reactionButtonIcon = computed<string>(() => {
  if (userReactionToPost.value) {
    return ReactionStatusIcon.active[userReactionToPost.value.type];
  }
  return ReactionStatusIcon.inactive[ReactionType.like];
});

const { mutateAsync: toggleReaction } = useMutation(useToggleReaction());

const { t } = useI18n();
const loginPromptOpen = ref(false);

const handleReactToPost = async (reactionType: ReactionType) => {
  if (!user.value?.id) {
    loginPromptOpen.value = true;
    return;
  }
  const current = userReactionToPost.value;
  if (current && current.type !== reactionType) {
    await toggleReaction({
      body: { postId: props.post.id, type: current.type as ReactionType },
    });
    await toggleReaction({
      body: { postId: props.post.id, type: reactionType },
    });
  } else {
    await toggleReaction({
      body: { postId: props.post.id, type: reactionType },
    });
  }
};

const handleToggleReaction = async () => {
  if (!user.value?.id) {
    loginPromptOpen.value = true;
    return;
  }
  const type =
    (userReactionToPost.value?.type as ReactionType) ?? ReactionType.like;
  await toggleReaction({ body: { postId: props.post.id, type } });
};

const scrollToCommentForm = () => {
  document
    .getElementById('comment-form')
    ?.scrollIntoView({ behavior: 'smooth' });
};
</script>

<template>
  <LoginPromptModal
    v-model:open="loginPromptOpen"
    :action="t('reactions.reactToPosts')"
  />
  <div class="flex flex-row items-center justify-start gap-2">
    <ClientOnly>
      <HoverCard>
        <HoverCardTrigger>
          <Button
            :variant="userReactionToPost ? 'default' : 'secondary'"
            size="sm"
            class="rounded-full"
            @click="handleToggleReaction"
          >
            <Icon v-if="reactionButtonIcon" :name="reactionButtonIcon" />
            {{ formattedReactionsCount }}
          </Button>
        </HoverCardTrigger>
        <HoverCardContent
          v-if="user"
          class="flex w-min flex-row flex-nowrap gap-4 p-2"
        >
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
              {{ t(ReactionTypeLabel[reaction]) }}
            </span>
          </button>
        </HoverCardContent>
      </HoverCard>
      <template #fallback>
        <Button variant="secondary" size="sm" class="rounded-full">
          <Icon :name="ReactionStatusIcon.inactive[ReactionType.like]" />
          {{ formattedReactionsCount }}
        </Button>
      </template>
    </ClientOnly>
    <Button
      variant="secondary"
      size="sm"
      class="rounded-full"
      @click="scrollToCommentForm"
    >
      <Icon name="mdi:comment" />
      {{ formattedCommentsCount }}
    </Button>
    <Button variant="secondary" size="sm" class="rounded-full">
      <Icon name="mdi:eye" />
      {{ formattedViewsCount }}
    </Button>
  </div>
</template>
