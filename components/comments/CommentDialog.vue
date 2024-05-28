<template>
  <PrimeDialog
    v-model:visible="isVisible"
    modal
    maximizable
    header="Comments"
    :pt="{
      footer: {
        class: '!justify-center md:!justify-end',
      },
    }"
  >
    <div class="mx-auto w-full max-w-2xl">
      <PrimeButton
        text
        :label="loadCommentsButtonLabel"
        :pt="{
          root: {
            class: 'p-0 my-5',
          },
        }"
        severity="secondary"
        @click="onLoadPreviousHandler"
      />

      <p
        v-if="comments === null || comments.length === 0"
        class="text-center text-lg font-bold text-text"
      >
        No comments yet.
      </p>
      <CommentList
        v-else
        :comments="comments"
        :reflect-comments-update="reflectCommentsUpdate"
        :level="0"
        class="w-full"
        @comment:delete="onCommentDeleteHandler"
      />

      <span ref="formInputElement" class="invisible"></span>
      <CreateCommentForm
        v-model:is-visible="isCreateCommentFormVisible"
        class=""
        :current="null"
        :parent="null"
        @comments:store="onStoreCommentHandler"
      />
    </div>

    <template #footer>
      <PrimeButton
        v-if="authUser !== null"
        :label="label"
        icon="pi pi-plus"
        :rounded="isRounded"
        @click="onShowCreateCommentHandler"
      />
    </template>
  </PrimeDialog>
</template>

<script lang="ts" setup>
const { article } = inject(ShowArticleToken) as ShowArticleDI;

const isVisible = defineModel<boolean>("isVisible", {
  required: true,
});

const { user: authUser } = useAuthUser();

const where = computed<IndexCommentQuery["where"]>(() => {
  return {
    articleId: article.value.id,
    parentId: null,
    deletedAt: null,
  };
});

const { width } = useWindowSize();
const label = computed(() => (width.value > 767 ? "New comment" : undefined));
const isRounded = computed(() => (width.value > 767 ? false : true));

const formInputElement = ref<HTMLElement | null>(null);

const isCreateCommentFormVisible = ref<boolean>(false);

const onShowCreateCommentHandler = () => {
  isCreateCommentFormVisible.value = true;
};

const onHideCreateCommentHandler = () => {
  isCreateCommentFormVisible.value = false;
};

const {
  comments,
  reset,
  remove,
  update,
  loadPrevious: onLoadPreviousHandler,
  add: addComment,
} = useIndexSortedComment({
  pageSize: commentConfig.PAGE_SIZE_DEFAULT_VALUE,
  immediate: true,
  where,
  parent: null,
});

watch(where, async () => {
  await reset();
});

const loadCommentsButtonLabel = computed(() =>
  comments.value.length > 0 ? "Load previous comments" : "Load comments",
);

const onWSCommentStore: OnWSCommentStore = (ws, comment) => {
  if (comment.parentId === null && comment.articleId === article.value.id) {
    addComment(comment);

    article.value._count.comments += 1;
  }
};

const onWSCommentUpdate: OnWSCommentUpdate = (ws, comment) => {
  if (comment.parentId === null && comment.articleId === article.value.id) {
    update(comment.id, {
      ...comment,
      // _auth is not sent with the broadcast data
      _auth: undefined,
    });

    article.value._count.comments += 1;
  }
};

const onWSCommentDestroy: OnWSCommentDestroy = (ws, commentId) => {
  remove(commentId);
};

const useWSReturn = inject(WSCommentToken) as WSCommentDI;

useWSComment({
  onCommentStore: onWSCommentStore,
  onCommentUpdate: onWSCommentUpdate,
  onCommentDestroy: onWSCommentDestroy,
  useWSReturn,
});

const reflectCommentsUpdate: UseReflectCommentsUpdateFn = (id, data) => {
  const body: WSCommentBody = {
    commentId: id,
    eventType: "update",
    userId: authUser.value!.id,
  };

  useWSReturn.send(JSON.stringify(body));

  update(id, data);
};

const onCommentDeleteHandler = (id: string) => {
  const body: WSCommentBody = {
    commentId: id,
    eventType: "destroy",
    userId: authUser.value!.id,
  };
  useWSReturn.send(JSON.stringify(body));
  remove(id);
  article.value._count.comments -= 1;
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

const onStoreCommentHandler = (newComment: CommentFull) => {
  const body: WSCommentBody = {
    commentId: newComment.id,
    eventType: "store",
    userId: authUser.value!.id,
  };
  useWSReturn.send(JSON.stringify(body));
  addComment(newComment);

  article.value._count.comments += 1;

  onHideCreateCommentHandler();
  scrollToCreatedComment(newComment.id);
};
</script>

<style lang="css">
.p-timeline-event-opposite {
  display: none;
}

@media screen and (max-width: 960px) {
  ::v-deep(.customized-timeline) {
    .p-timeline-event:nth-child(even) {
      flex-direction: row;

      .p-timeline-event-content {
        text-align: left;
      }
    }

    .p-timeline-event-opposite {
      flex: 0;
    }
  }
}
</style>
