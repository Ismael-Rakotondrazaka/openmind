<template>
  <PrimeButton
    :icon="icon"
    :label="label"
    :text="isText"
    class="mr-3"
    :severity="severity"
    :loading="isLoading"
    size="small"
    @click="onSaveButtonClickHandler"
  />
</template>

<script lang="ts" setup>
import { type SavedArticle } from "@prisma/client";

interface SaveArticleButton {
  articleId: string;
}

const props = defineProps<SaveArticleButton>();
const toast = useToast();

const savedArticleModel = defineModel<SavedArticle | null>("savedArticle", {
  required: true,
});

const isArticleSaved = computed(() => savedArticleModel.value !== null);

const icon = computed<string>(() => {
  const savedArticleIcon = {
    SAVED: "pi pi-bookmark-fill",
    NOT_SAVED: "pi pi-bookmark",
  };

  if (isArticleSaved.value) {
    return savedArticleIcon.SAVED;
  } else {
    return savedArticleIcon.NOT_SAVED;
  }
});

const severity = computed(() => {
  const savedArticleSeverity = {
    SAVED: "primary",
    NOT_SAVED: "secondary",
  };

  if (isArticleSaved.value) {
    return savedArticleSeverity.SAVED;
  } else {
    return savedArticleSeverity.NOT_SAVED;
  }
});

const { width } = useWindowSize();

const savedArticleLabel = {
  SAVED: "Saved",
  NOT_SAVED: "Save for later",
};

const label = computed(() => {
  if (width.value > 767) {
    if (isArticleSaved.value) {
      return savedArticleLabel.SAVED;
    } else {
      return savedArticleLabel.NOT_SAVED;
    }
  }

  return undefined;
});

const isText = computed(() => !isArticleSaved.value);

const {
  savedArticle: newSavedArticle,
  execute: storeSavedArticle,
  isStatusPending: isStoreSavedArticlePending,
} = useStoreSavedArticle({
  body: () => ({
    articleId: props.articleId,
  }),
});

const {
  execute: destroySavedArticle,
  isStatusPending: isDestroySavedArticlePending,
} = useDestroySavedArticle({
  articleId: props.articleId,
});

const isLoading = computed<boolean>(
  () => isStoreSavedArticlePending.value || isDestroySavedArticlePending.value,
);

watch(newSavedArticle, (newValue) => {
  if (newValue !== null) {
    if (isRef<SavedArticle>(newValue)) {
      savedArticleModel.value = unref(newValue);
    } else {
      savedArticleModel.value = newValue;
    }
  }
});

const removeSavedArticle = async () => {
  try {
    await destroySavedArticle();

    savedArticleModel.value = null;

    toast.add({
      life: notificationConfig.LIFE,
      severity: "info",
      summary: "Removed from saved articles.",
    });
  } catch (error) {
    toast.add({
      life: notificationConfig.LIFE,
      severity: "error",
      summary: "Unable to remove from saved articles.",
    });
  }
};

const createSavedArticle = async () => {
  try {
    await storeSavedArticle();

    toast.add({
      life: notificationConfig.LIFE,
      severity: "success",
      summary: "Added to saved articles.",
    });
  } catch (error) {
    toast.add({
      life: notificationConfig.LIFE,
      severity: "error",
      summary: "Unable to save the article.",
    });
  }
};

const onSaveButtonClickHandler = () => {
  if (isArticleSaved.value) {
    removeSavedArticle();
  } else {
    createSavedArticle();
  }
};
</script>
