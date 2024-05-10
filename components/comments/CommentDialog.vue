<template>
  <PrimeDialog v-model:visible="isVisible" modal maximizable header="Comments">
    <div class="w-full max-w-2xl mx-auto">
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

      <CommentList
        v-if="comments !== null"
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
        label="New comment"
        icon="pi pi-plus"
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
  update: reflectCommentsUpdate,
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

const onCommentDeleteHandler = (id: string) => {
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
