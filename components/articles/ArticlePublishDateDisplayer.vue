<template>
  <p class="text-base text-gray-500 dark:text-gray-400">
    <time
      pubdate
      :datetime="createdAtDateTimeFormatted"
      :title="createdAtTitleFormatted"
      >{{ createdAtTextFormatted }}</time
    >
  </p>
</template>

<script lang="ts" setup>
interface ArticlePublishDateDisplayerProps {
  date: Date;
}

const props = defineProps<ArticlePublishDateDisplayerProps>();

const createdAtDateTimeFormatted = useDateFormat(
  () => props.date,
  "YYYY-MM-DD",
);

const createdAtTitleFormatted = useDateFormat(
  () => props.date,
  "MMMM Do, YYYY",
);

const createdAtTextFormatted = useDateFormat(() => props.date, "MMM. M, YYYY");
</script>
