<template>
  <div class="flex flex-row items-center justify-start gap-2">
    <Button variant="secondary" size="sm">
      <Icon name="mdi:thumbs-up" />
      {{ formattedReactionsCount }}
    </Button>

    <Button variant="secondary" size="sm">
      <Icon name="mdi:comment" />
      {{ formattedCommentsCount }}
    </Button>

    <Button variant="secondary" size="sm">
      <Icon name="mdi:eye" />
      {{ formattedViewsCount }}
    </Button>
  </div>
</template>

<script lang="ts" setup>
import type { Post } from '../post.model';

type Props = {
  post: Post;
};

const props = defineProps<Props>();

const formattedReactionsCount = useNumericAbbreviation(
  () => props.post.reactions_count
);
const formattedViewsCount = useNumericAbbreviation(
  () => props.post.views_count
);
const formattedCommentsCount = useNumericAbbreviation(
  () => props.post.comments_count
);
</script>
