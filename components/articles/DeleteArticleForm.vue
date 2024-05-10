<template>
  <ConfirmDialog
    v-model:is-visible="isConfirmationVisible"
    header="Delete Article"
    message="Are you sure you want to delete this article ?"
    severity="danger"
    resolve-button-label="Yes, Delete"
    reject-button-label="Cancel"
    :info-list="infoList"
    @dialog:resolved="destroyArticleHandler"
  />

  <PrimeButton
    icon="pi pi-trash"
    outlined
    severity="danger"
    :pt="{
      root: {
        class: 'w-full',
      },
    }"
    label="Delete"
    :disabled="!isArticleEditable"
    @click="onShowConfirmation"
  ></PrimeButton>
</template>

<script setup lang="ts">
import { useDestroyArticle } from "~/composables";

/* ---------------------------------- Props --------------------------------- */
interface IDeleteArticleFormProps {
  article: ArticleFull;
}

const props = defineProps<IDeleteArticleFormProps>();
/* -------------------------------------------------------------------------- */

type IDeleteArticleFormEmits = {
  "article:delete": [string];
};

const emit = defineEmits<IDeleteArticleFormEmits>();

const { user: authUser } = inject(AuthUserToken) as AuthUserDI;

const toast = useToast();

const param = computed(() => ({
  slug: props.article.slug,
}));

const fatalError = ref<string | null>(null);

const {
  article: deletedArticle,
  execute: destroyArticle,
  error: fetchError,
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

const isArticleEditable = computed<boolean>(
  () => authUser.value !== null && props.article.user.id === authUser.value.id,
);

const infoList: string[] = ["Once deleted, it cannot be undone."];

const isConfirmationVisible = ref<boolean>(false);

const onShowConfirmation = () => {
  isConfirmationVisible.value = true;
};
</script>
