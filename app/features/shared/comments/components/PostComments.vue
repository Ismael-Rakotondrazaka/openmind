<script lang="ts" setup>
import type { Post } from '~/features/shared/posts/post.model';

import CommentForm from './CommentForm.vue';
import CommentList from './CommentList.vue';

type Props = {
  post: Post;
};

const props = defineProps<Props>();

const supabase = useSupabaseClient();
const queryClient = useQueryClient();

onMounted(() => {
  const channel = supabase
    .channel(`post:${props.post.id}:comments`)
    .on('broadcast', { event: 'UPDATE' }, () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    })
    .on('broadcast', { event: 'DELETE' }, () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    })
    .subscribe();

  onUnmounted(() => {
    supabase.removeChannel(channel);
  });
});
</script>

<template>
  <div class="mt-10 space-y-6">
    <h2 class="text-xl font-semibold">
      Comments
      <span
        v-if="post.comments_count"
        class="text-muted-foreground text-base font-normal"
      >
        ({{ post.comments_count }})
      </span>
    </h2>

    <CommentList :post-id="post.id" />

    <CommentForm :post-id="post.id" />
  </div>
</template>
