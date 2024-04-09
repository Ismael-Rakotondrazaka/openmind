<template>
  <div>
    <CommentInputDescription
      :parent="parent"
      :article="article"
      :label-for="inputElementId"
    />

    <PrimeEditor
      :id="inputElementId"
      v-model="content"
      editor-style="height: 320px"
    />

    <small id="email-text-error" class="text-red-600">{{
      errorMessage || "&nbsp;"
    }}</small>
  </div>
</template>

<script lang="ts" setup>
const content = defineModel<string, string>("content");

interface ICommentContentInputFormProps {
  errorMessage?: string;
  parent: CommentFull | null;
  current: CommentFull | null;
}

const props = defineProps<ICommentContentInputFormProps>();

const { article } = inject(ShowArticleToken) as ShowArticleDI;

const inputElementId = computed(() => {
  if (props.current !== null) {
    return `CommentContentInputForm:${props.current.id}`;
  } else {
    return `CommentContentInputForm:${article.value.id}`;
  }
});
</script>
