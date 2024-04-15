<template>
  <div class="flex items-center justify-between">
    <div class="flex items-center justify-start gap-3">
      <UserAvatar :user="comment.user" size="normal" />

      <UserNameLink :user="comment.user" class="text-text" />

      <span class="text-[--text-color-secondary]">{{
        formattedPublishDate
      }}</span>
    </div>

    <CommentOptionsButton
      :comment="comment"
      @comment:delete="emit('comment:delete')"
      @comment:edit="emit('comment:edit')"
    />
  </div>
</template>

<script lang="ts" setup>
interface CommentHeaderProps {
  comment: CommentFull;
}

const props = defineProps<CommentHeaderProps>();

type ICommentHeaderEmits = {
  "comment:edit": [];
  "comment:delete": [];
};

const emit = defineEmits<ICommentHeaderEmits>();

const formattedPublishDate = useTimeAgo(() => props.comment.createdAt);
</script>
