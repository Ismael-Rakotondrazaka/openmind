<template>
  <div :id="comment.id">
    <CommentHeader
      :comment="comment"
      class="mb-3"
      @comment:delete="onDeleteCommentHandler(props.comment.id)"
      @comment:edit="showEditCommentInputForm"
    />

    <EditCommentForm
      v-model:is-visible="isEditCommentShown"
      class="mb-3"
      :comment="comment"
      :parent="parent"
      @comments:update="onUpdateCommentHandler"
      @update:cancel="hideEditCommentInputForm"
    />
    <CommentContentDisplayer
      v-if="!isEditCommentInputFormShown"
      :content="comment.content"
      class="mb-3"
      :is-collapsed="isContentCollapsed"
      :line-clamp="5"
    />

    <ReactionListPreview
      :auth-reaction="comment._auth.reaction"
      :article-id="null"
      :comment-id="comment.id"
      :reactions-count="props.comment._count.reactions"
      class="mb-3"
      @reaction-list:show="onReactionSidebarShow"
    />

    <CommentFooter
      :comment="comment"
      :level="level"
      @auth-reaction:update="onAuthReactionUpdate"
      @comments-count:update="onCommentsCountUpdate"
      @reactions-count:update="onReactionsCountUpdate"
      @comments:show="onCommentsShowHandler"
      @reply-form:show="onReplyFormShowHandler"
    />

    <ReactionSideBar
      v-model:is-visible="isReactionSidebar"
      :article-id="null"
      :comment-id="comment.id"
    />

    <PrimeButton
      v-if="canHaveReplies && isRepliesVisible"
      text
      :label="loadRepliesButtonLabel"
      :pt="{
        root: {
          class: 'p-0 my-5',
        },
      }"
      severity="secondary"
      @click="onLoadPreviousHandler"
    />

    <CommentList
      v-if="canHaveReplies"
      :comments="replies"
      :reflect-comments-update="reflectRepliesUpdate"
      :level="nextLevel"
      class="mb-5 ml-5"
      @reply-form:show="onReplyFormShowHandler"
      @comment:delete="onDeleteReplyHandler"
    />

    <span ref="formInputElement" class="invisible"></span>
    <CreateCommentForm
      v-model:is-visible="isCreateCommentVisible"
      class="ml-10"
      :current="comment"
      :parent="parent"
      @comments:store="onStoreCommentHandler"
    />
  </div>
</template>

<script lang="ts" setup>
import type { UseReflectCommentsUpdateFnData } from "~/composables";

interface CommentItemProps {
  comment: CommentFull;
  level: number;
}

const props = defineProps<CommentItemProps>();

const isCreateCommentVisible = ref<boolean>(false);

type CommentItemEmits = {
  "comment:update": [string, UseReflectCommentsUpdateFnData];
  "comments:show": [];
  "comment:delete": [string];
  "comment:store": [CommentFull];
  "reply-form:show": [CommentFull | null];
};

const formInputElement = ref<HTMLElement | null>(null);

const emit = defineEmits<CommentItemEmits>();

const { user: authUser } = inject(AuthUserToken) as AuthUserDI;

const nextLevel = computed(() => props.level + 1);

const canHaveReplies = computed<boolean>(() => props.level === 0);

const onAuthReactionUpdate = (newValue: Reaction | null) => {
  emit("comment:update", props.comment.id, {
    "_auth.reaction": newValue,
  });
};

const onCommentsCountUpdate = (newValue: number) => {
  emit("comment:update", props.comment.id, {
    "_count.replies": newValue,
  });
};

const onReactionsCountUpdate = (newValue: number) => {
  emit("comment:update", props.comment.id, {
    "_count.reactions": newValue,
  });
};

const isReactionSidebar = ref(false);

const onReactionSidebarShow = () => {
  isReactionSidebar.value = true;
};

const isContentCollapsed = ref(true);

const where = computed<IndexCommentQuery["where"]>(() => {
  return {
    articleId: props.comment.articleId,
    parentId: props.comment.id,
    deletedAt: null,
  };
});

const {
  comments: replies,
  reset,
  update: reflectRepliesUpdate,
  add,
  remove,
  loadPrevious: onLoadPreviousHandler,
} = useIndexSortedComment({
  pageSize: commentConfig.PAGE_SIZE_DEFAULT_VALUE,
  immediate: false,
  where,
  parent: () => props.comment,
});

watch(where, async () => {
  await reset();
});

const loadRepliesButtonLabel = computed(() =>
  replies.value.length > 0 ? "Load previous replies" : "Load replies",
);

const isRepliesVisible = ref<boolean>(false);

const onCommentsShowHandler = () => {
  if (props.level === 0) {
    if (!isRepliesVisible.value) {
      onLoadPreviousHandler();
    }

    isRepliesVisible.value = true;
  }
};

const isReplyInputFormShown = ref(false);

const showReplyInputForm = () => {
  isCreateCommentVisible.value = true;
  isReplyInputFormShown.value = true;
};

const scrollToCreatedComment = (id: string) => {
  nextTick(() => {
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element !== null) {
        element.scrollIntoView({
          behavior: "smooth",
        });
      }
    }, 500);
  });
};

const parent = ref<CommentFull | null>(null);

const onReplyFormShowHandler = (newParent: CommentFull | null) => {
  if (props.level === 0) {
    if (!isRepliesVisible.value) {
      onLoadPreviousHandler();

      isRepliesVisible.value = true;
    }

    parent.value = newParent;

    showReplyInputForm();
    // scrollToInputForm();
  } else {
    emit("reply-form:show", newParent);
  }
};

const onStoreCommentHandler = (newComment: CommentFull) => {
  add(newComment);

  emit("comment:update", props.comment.id, {
    "_count.replies": props.comment._count.replies + 1,
  });

  emit("comment:store", newComment);

  isCreateCommentVisible.value = false;
  // scrollToInputForm();
  scrollToCreatedComment(newComment.id);
};

const isCommentEditable = computed<boolean>(
  () => authUser.value !== null && props.comment.user.id === authUser.value.id,
);

const isEditCommentShown = ref(false);

const isEditCommentInputFormShown = computed<boolean>(
  () => isCommentEditable.value && isEditCommentShown.value,
);

const showEditCommentInputForm = () => {
  if (isCommentEditable.value) {
    isEditCommentShown.value = true;
  }
};

const hideEditCommentInputForm = () => {
  isEditCommentShown.value = false;
};

const onUpdateCommentHandler = (updatedComment: CommentFull) => {
  emit("comment:update", updatedComment.id, updatedComment);

  hideEditCommentInputForm();
};

const onDeleteCommentHandler = (id: string) => {
  if (props.level === 0) {
    remove(id);
  }

  // notify the parent, so it can decrement replies count
  emit("comment:delete", id);
};

const onDeleteReplyHandler = (id: string) => {
  // when a reply is deleted, we notify the parent to update this comment replies count
  emit("comment:update", props.comment.id, {
    "_count.replies": props.comment._count.replies - 1,
  });

  onDeleteCommentHandler(id);
};
</script>
