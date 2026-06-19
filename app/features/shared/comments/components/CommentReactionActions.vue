<script lang="ts" setup>
import type { Comment } from '#shared/features/comments';

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
  comment: Serialize<Comment>;
};

const props = defineProps<Props>();

const formattedReactionsCount = useNumericAbbreviation(
  () => props.comment.reactionsCount
);

const { user } = useUserSession();

const fetchFn = useRequestFetch();

const { data: myReactionPage } = useQuery(() => ({
  ...reactionsQuery({
    commentId: props.comment.id,
    fetchFn,
    pageSize: 1,
    userId: user.value?.id,
  }),
  enabled: Boolean(user.value?.id),
}));

const userReactionToComment = computed(() => {
  if (!user.value?.id) return null;
  return myReactionPage.value?.data[0] ?? null;
});

const reactionButtonIcon = computed<string>(() => {
  if (userReactionToComment.value) {
    return ReactionStatusIcon.active[
      userReactionToComment.value.type as ReactionType
    ];
  }
  return ReactionStatusIcon.inactive[ReactionType.like];
});

const { mutateAsync: toggleReaction } = useMutation(useToggleReaction());

const { t } = useI18n();
const loginPromptOpen = ref(false);

const handleReactToComment = async (reactionType: ReactionType) => {
  if (!user.value?.id) {
    loginPromptOpen.value = true;
    return;
  }
  const current = userReactionToComment.value;
  if (current && current.type !== reactionType) {
    await toggleReaction({
      body: { commentId: props.comment.id, type: current.type as ReactionType },
    });
    await toggleReaction({
      body: { commentId: props.comment.id, type: reactionType },
    });
  } else {
    await toggleReaction({
      body: { commentId: props.comment.id, type: reactionType },
    });
  }
};

const handleToggleReaction = async () => {
  if (!user.value?.id) {
    loginPromptOpen.value = true;
    return;
  }
  const type =
    (userReactionToComment.value?.type as ReactionType) ?? ReactionType.like;
  await toggleReaction({ body: { commentId: props.comment.id, type } });
};
</script>

<template>
  <LoginPromptModal
    v-model:open="loginPromptOpen"
    :action="t('reactions.reactToComments')"
  />
  <ClientOnly>
    <HoverCard>
      <HoverCardTrigger>
        <Button
          :variant="userReactionToComment ? 'default' : 'ghost'"
          size="sm"
          class="h-6 rounded-full px-2 text-xs"
          @click="handleToggleReaction"
        >
          <Icon :name="reactionButtonIcon" class="size-3" />
          <span v-if="comment.reactionsCount">{{
            formattedReactionsCount
          }}</span>
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
            {{ t(ReactionTypeLabel[reaction]) }}
          </span>
        </button>
      </HoverCardContent>
    </HoverCard>
    <template #fallback>
      <Button
        variant="ghost"
        size="sm"
        class="h-6 rounded-full px-2 text-xs"
        @click="handleToggleReaction"
      >
        <Icon :name="reactionButtonIcon" class="size-3" />
        <span v-if="comment.reactionsCount">{{ formattedReactionsCount }}</span>
      </Button>
    </template>
  </ClientOnly>
</template>
