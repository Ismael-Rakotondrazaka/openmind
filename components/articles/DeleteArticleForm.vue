<template>
  <ConfirmDialog
    v-model:is-visible="isVisible"
    header="Delete Article"
    message="Are you sure you want to delete this article ?"
    severity="danger"
    resolve-button-label="Yes, Delete"
    reject-button-label="Cancel"
    :info-list="infoList"
    :is-loading="isStatusPending"
    @dialog:resolved="destroyArticleHandler"
  />
</template>

<script setup lang="ts">
import { useDestroyArticle } from "~/composables";

/* ---------------------------------- Props --------------------------------- */
interface IDeleteArticleFormProps {
  article: ArticleFull;
}

const props = defineProps<IDeleteArticleFormProps>();
/* -------------------------------------------------------------------------- */

const isVisible = defineModel<boolean>("isVisible", {
  default: false,
  required: false,
});

type IDeleteArticleFormEmits = {
  "article:delete": [string];
};

const emit = defineEmits<IDeleteArticleFormEmits>();

const toast = useToast();

const param = computed(() => ({
  slug: props.article.slug,
}));

const fatalError = ref<string | null>(null);

const {
  article: deletedArticle,
  execute: destroyArticle,
  error: fetchError,
  isStatusPending,
} = useDestroyArticle({
  param,
  immediate: false,
});

const destroyArticleHandler = async () => {
  await destroyArticle();

  if (fetchError.value === null) {
    fatalError.value = null;

    toast.add({
      severity: "info",
      summary: "Article successfully deleted!",
      life: notificationConfig.LIFE,
    });

    if (deletedArticle.value !== null) {
      emit("article:delete", deletedArticle.value.id);

      navigateTo({
        name: "users-username",
        params: {
          username: deletedArticle.value.user.username,
        },
      });
    }
  } else {
    fatalError.value =
      fetchError.value.message ?? errorConfig.DEFAULT_GENERAL_ERROR_MESSAGE;

    toast.add({
      severity: "error",
      summary: fatalError.value,
      life: notificationConfig.LIFE,
    });
  }
};

const infoList: string[] = ["Once deleted, it cannot be undone."];
</script>
