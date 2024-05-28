<template>
  <PrimeTimeline
    :value="comments"
    align="left"
    class="customized-timeline"
    :pt="{
      content: {
        class: 'pr-0 w-full',
      },
    }"
  >
    <template #content="slotProps">
      <CommentItem
        :key="`comments:${slotProps.item.id}:${level}`"
        :comment="slotProps.item"
        :level="level"
        class="mb-7"
        @comment:update="onCommentUpdate"
        @reply-form:show="onReplyShowHandler"
        @comment:delete="onCommentDelete"
      />
    </template>
  </PrimeTimeline>
</template>

<script lang="ts" setup>
interface CommentListProps {
  comments: CommentFull[];
  level: number;
  reflectCommentsUpdate: UseReflectCommentsUpdateFn;
}

const props = defineProps<CommentListProps>();

const onCommentUpdate = (id: string, data: UseReflectCommentsUpdateFnData) => {
  props.reflectCommentsUpdate(id, data);
};

type ICommentListEmits = {
  "reply-form:show": [CommentFull | null];
  "comment:delete": [string];
};

const emit = defineEmits<ICommentListEmits>();

const onReplyShowHandler = (parent: CommentFull | null) => {
  emit("reply-form:show", parent);
};

const onCommentDelete = (id: string) => {
  emit("comment:delete", id);
};
</script>
