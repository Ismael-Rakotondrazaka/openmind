<template>
  <div>
    <ReactionList v-if="reactions !== null" :reactions="reactions" />

    <PrimePaginator
      v-if="pagination !== null"
      :rows="pagination.pageSize"
      :total-records="pagination.totalCounts"
      class="mb-10"
      :rows-per-page-options="rowsPerPageOptions"
      @page="onPageChangeHandler"
    ></PrimePaginator>
  </div>
</template>

<script lang="ts" setup>
import type { PageState } from "primevue/paginator";

/* ---------------------------------- Props --------------------------------- */
interface ReactionTabBaseProps {
  reactionType: ReactionType | "*";
}

interface ArticleReactionTabProps {
  articleId: string;
  commentId: null;
}

interface CommentReactionTabProps {
  articleId: null;
  commentId: string;
}

type ReactionTab = ReactionTabBaseProps &
  (ArticleReactionTabProps | CommentReactionTabProps);

const props = defineProps<ReactionTab>();
/* -------------------------------------------------------------------------- */

/* ---------------------------------- Emits --------------------------------- */
type ReactionTabContentEmits = {
  "total-counts:update": [number];
};

const emit = defineEmits<ReactionTabContentEmits>();
/* -------------------------------------------------------------------------- */

const where = computed(() => {
  return {
    type: props.reactionType === "*" ? undefined : props.reactionType,
    articleId: props.articleId,
    commentId: props.commentId,
  };
});

const page = ref<number>(1);

const pageSize = ref<number>(reactionConfig.PAGE_SIZE_DEFAULT_VALUE);

const query = computed<IndexReactionQuery>(() => {
  return {
    where: where.value,
    page: page.value,
    pageSize: pageSize.value,
    orderBy: {
      createdAt: "desc",
    },
  };
});

const { reactions, pagination } = useIndexReaction({
  query,
  immediate: true,
});

watchImmediate(pagination, (newValue) => {
  if (newValue === null) {
    emit("total-counts:update", 0);
  } else {
    emit("total-counts:update", newValue.totalCounts);
  }
});

const rowsPerPageOptions: ComputedRef<number[]> = computed(() => {
  const size: number = 4;
  const result: number[] = [];

  for (let i = 0; i < size; i++) {
    result.push((i + 1) * reactionConfig.PAGE_SIZE_DEFAULT_VALUE);
  }

  return result;
});

const onPageChangeHandler = (event: PageState) => {
  if (page.value !== event.page + 1) {
    page.value = event.page + 1;
  }
  if (pageSize.value !== event.rows) {
    pageSize.value = event.rows;
  }
};
</script>
