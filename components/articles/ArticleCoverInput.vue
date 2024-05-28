<template>
  <ImageInput
    id="article-cover-input"
    v-model:image="cover"
    :error-message="errorMessage"
    :initial-url="initialUrl"
    :accept="accept"
    :tooltip-text="tooltipText"
    description="Choose an eye-catching image to grab your audience's attention."
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

const accept = computed<string>(() => articleImageConfig.MIME_TYPES.join(","));

const tooltipText = computed<string>(() => {
  const size: number = Math.floor(articleImageConfig.MAX_SIZE / 1000000);

  return `Upload an image\n• (PNG, JPEG, WebP, JPG, SVG)\n• ${size}Mb max`;
});
</script>
