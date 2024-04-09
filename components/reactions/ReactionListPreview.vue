<template>
  <button
    v-if="haveReactions"
    class="inline-flex items-center hover:text-[--primary-color] hover:underline hover:underline-[--primary-color] text-sm text-[--text-color-secondary]"
    @click="onToggleReactionListSideBar"
  >
    <ReactionTypeListPreview :reactions="reactions" class="inline-flex mr-1" />

    {{ buttonLabel }}
  </button>
</template>

<script setup lang="ts">
/* --------------------------------- Injects -------------------------------- */
const { user: authUser } = inject(AuthUserToken) as AuthUserDI;
/* -------------------------------------------------------------------------- */

/* ---------------------------------- Props --------------------------------- */
interface IReactionListPreviewBaseProps {
  reactionsCount: number;
  authReaction: Reaction | null;
}

interface ArticleReactionListPreviewProps {
  articleId: null;
  commentId: string;
}

interface CommentReactionListPreviewProps {
  articleId: string;
  commentId: null;
}

type ReactionListPreviewProps = IReactionListPreviewBaseProps &
  (ArticleReactionListPreviewProps | CommentReactionListPreviewProps);

const props = defineProps<ReactionListPreviewProps>();
/* -------------------------------------------------------------------------- */

/* ---------------------------------- Emits --------------------------------- */
type IReactionListPreviewEmits = {
  "reaction-list:show": [];
};

const emit = defineEmits<IReactionListPreviewEmits>();
/* -------------------------------------------------------------------------- */

const {
  authReaction,
  reactions,
  otherReactionsExtract,
  execute: refetchReactions,
} = useReactionListPreview({
  articleId: () => props.articleId,
  commentId: () => props.commentId,
  authUserId: () => (authUser.value !== null ? authUser.value.id : null),
  immediate: true,
} as IUseReactionListPreviewArg);

const haveReactions = computed<boolean>(() => reactions.value.length > 0);

const buttonLabel = useReactionPreviewText({
  authReaction,
  otherReactionsExtract,
  count: () => props.reactionsCount,
});

watchDeep([() => props.reactionsCount, () => props.authReaction], async () => {
  await refetchReactions();
});

const onToggleReactionListSideBar = () => {
  emit("reaction-list:show");
};
</script>
