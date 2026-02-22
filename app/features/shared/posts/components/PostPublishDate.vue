<template>
  <p class="text-muted-foreground text-xs">
    <time
      pubdate
      :datetime="createdAtDateTimeFormatted"
      :title="createdAtTitleFormatted"
      >{{ createdAtTextFormatted }}</time
    >
  </p>
</template>

<script lang="ts" setup>
interface Props {
  date: string;
}

const props = defineProps<Props>();

const createdAtDateTimeFormatted = useDateFormat(
  () => props.date,
  'YYYY-MM-DD'
);

const createdAtTitleFormatted = useDateFormat(
  () => props.date,
  'MMMM Do, YYYY'
);

const createdAtTextFormatted = useDateFormat(() => props.date, 'MMM. M, YYYY');
</script>
