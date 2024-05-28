<template>
  <div class="fle-row flex items-center justify-between border-y py-1">
    <div>
      <ReactionButton
        v-model:count="reactionsCount"
        v-model:reaction="reaction"
        :article-id="null"
        :comment-id="comment.id"
        class="mr-3 inline-block"
      />

      <CommentButton
        v-if="level === 0"
        v-model:count="commentsCount"
        class="mr-3"
        @comments:show="onCommentsShowHandler"
      />
    </div>

    <PrimeButton
      v-if="authUser !== null"
      text
      label="Reply"
      icon="pi pi-comment"
      severity="primary"
      @click="onReplyClickHandler"
    />
  </div>
</template>

<script lang="ts" setup>
interface CommentFooterProps {
  comment: CommentFull;
  level: number;
}

const props = defineProps<CommentFooterProps>();

type CommentFooterEmits = {
  "reactions-count:update": [number];
  "comments-count:update": [number];
  "auth-reaction:update": [Reaction | null];
  "comments:show": [];
  "reply-form:show": [CommentFull | null];
};

const emit = defineEmits<CommentFooterEmits>();

const { user: authUser } = useAuthUser();

const reactionsCount = ref<number>(props.comment._count.reactions);
watch(reactionsCount, (newValue) => {
  emit("reactions-count:update", newValue);
});
watch(
  () => props.comment._count.reactions,
  (newValue) => {
    if (newValue !== commentsCount.value) {
      commentsCount.value = newValue;
    }
  },
);

const reaction = ref<Reaction | null>(props.comment._auth.reaction);
watch(reaction, (newValue) => {
  emit("auth-reaction:update", newValue);
});
watch(
  () => props.comment._auth.reaction,
  (newValue) => {
    if (newValue !== reaction.value) {
      reaction.value = newValue;
    }
  },
);

const commentsCount = ref<number>(props.comment._count.replies);
watch(commentsCount, (newValue) => {
  emit("comments-count:update", newValue);
});
watch(
  () => props.comment._count.replies,
  (newValue) => {
    if (newValue !== commentsCount.value) {
      commentsCount.value = newValue;
    }
  },
);

const onCommentsShowHandler = () => {
  emit("comments:show");
};

const onReplyClickHandler = () => {
  emit("reply-form:show", props.comment);
};
</script>
