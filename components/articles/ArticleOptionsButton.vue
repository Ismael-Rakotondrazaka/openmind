<template>
  <PrimeButton
    v-if="haveOptions"
    icon="pi pi-ellipsis-h"
    text
    size="small"
    severity="secondary"
    :pt="{
      root: {
        class: 'px-1 py-0 w-[unset]',
      },
    }"
    @click="toggleOverLayPanel"
  />

  <PrimeOverlayPanel ref="overlayPanel">
    <div class="flex flex-col gap-3 flex-nowrap">
      <PrimeButton
        v-if="isArticleEditable"
        icon="pi pi-pencil"
        outlined
        severity="info"
        :pt="{
          root: {
            class: 'w-full',
          },
        }"
        label="Edit"
        @click="onEditHandler"
      />

      <DeleteArticleForm v-if="isArticleDeletable" :article="article" />
    </div>
  </PrimeOverlayPanel>
</template>

<script lang="ts" setup>
import type { PrimeOverlayPanel } from "#build/components";

interface IUserArticleOptionsButtonProps {
  article: ArticleFull;
}

const props = defineProps<IUserArticleOptionsButtonProps>();

const { user: authUser } = inject(AuthUserToken) as AuthUserDI;

const overlayPanel = ref<InstanceType<typeof PrimeOverlayPanel>>();

const isArticleEditable = computed<boolean>(
  () =>
    authUser.value !== null &&
    props.article.user.id === authUser.value.id &&
    props.article.deletedAt === null,
);

const isArticleDeletable = computed<boolean>(
  () =>
    authUser.value !== null &&
    props.article.user.id === authUser.value.id &&
    props.article.deletedAt === null,
);

const haveOptions = computed<boolean>(() =>
  [isArticleEditable.value, isArticleDeletable.value].includes(true),
);

const toggleOverLayPanel = (event: Event) => {
  if (overlayPanel.value !== undefined) {
    overlayPanel.value.toggle(event);
  }
};

const onEditHandler = () => {
  navigateTo({
    name: "articles-slug-edit",
    params: {
      slug: props.article.slug,
    },
  });
};
</script>
