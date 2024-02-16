<template>
  <ImageInput
    id="article-cover-input"
    v-model:image="cover"
    :error-message="errorMessage"
    :initial-url="initialUrl"
    label="Cover"
    name="cover"
  />
</template>

<script lang="ts" setup>
/**
cover can be in 3 different state:\
`File`: modified with a file\
`null`: deleted (also considered as modified)\
`undefined`: not modified at all
 */
const cover = defineModel<File | null | undefined, string>("cover", {
  required: true,
});

interface ArticleCoverInputProps {
  errorMessage?: string;
  initialUrl?: string;
}

defineProps<ArticleCoverInputProps>();
</script>
