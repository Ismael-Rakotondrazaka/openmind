<template>
  <div
    @pointerenter="onMouseEnterEventHandler"
    @pointerleave="onMouseLeaveEventHandler"
  >
    <ul
      class="flex flex-row flex-nowrap justify-evenly gap-3 w-[25rem], text-center"
    >
      <li>
        <ReactionLikeButton
          :reaction="reaction"
          :is-loading="isStatusPending"
          @reaction:create="() => createReaction('like')"
          @reaction:edit="() => editReaction('like')"
          @reaction:delete="() => deleteReaction()"
        />
      </li>
      <li>
        <ReactionLoveButton
          :reaction="reaction"
          :is-loading="isStatusPending"
          @reaction:create="() => createReaction('love')"
          @reaction:edit="() => editReaction('love')"
          @reaction:delete="() => deleteReaction()"
        />
      </li>
      <li>
        <ReactionCelebrateButton
          :reaction="reaction"
          :is-loading="isStatusPending"
          @reaction:create="() => createReaction('celebrate')"
          @reaction:edit="() => editReaction('celebrate')"
          @reaction:delete="() => deleteReaction()"
        />
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { type ReactionType } from "@prisma/client";

interface ArticleReactionFormProps {
  articleId: null;
  commentId: string;
}

interface CommentReactionFormProps {
  articleId: string;
  commentId: null;
}

type ReactionFormProps = ArticleReactionFormProps | CommentReactionFormProps;

const props = defineProps<ReactionFormProps>();

const count = defineModel<number>("count", {
  required: true,
});

const reaction = defineModel<Reaction | null>("reaction", {
  required: true,
});

const selectedReactionType = ref<ReactionType | undefined>(
  reaction.value?.type,
);

const reactionId = computed<number | undefined>(() => reaction.value?.id);

const storeReactionBody = computed(() => {
  if (props.articleId === null) {
    return {
      commentId: props.commentId,
      type: selectedReactionType.value ?? "like",
    };
  } else {
    return {
      articleId: props.articleId,
      type: selectedReactionType.value ?? "like",
    };
  }
});

const {
  reaction: createdReaction,
  execute: storeReaction,
  isStatusPending,
} = useStoreReaction({
  body: storeReactionBody,
});

const { reaction: updatedReaction, execute: updateReaction } =
  useUpdateReaction({
    body: () => ({
      type: selectedReactionType.value ?? "like",
    }),
    reactionId: () => reactionId.value ?? -1,
  });

const { execute: destroyReaction } = useDestroyReaction({
  reactionId: () => reactionId.value ?? -1,
});

const createReaction = (reactionType: ReactionType) => {
  selectedReactionType.value = reactionType;

  count.value++;

  storeReaction().then(() => {
    reaction.value = createdReaction.value;
  });
};

const editReaction = (reactionType: ReactionType) => {
  selectedReactionType.value = reactionType;

  updateReaction().then(() => {
    reaction.value = updatedReaction.value;
  });
};

const deleteReaction = () => {
  selectedReactionType.value = undefined;

  count.value--;

  destroyReaction();
  reaction.value = null;
};

type ReactionFormEmits = {
  "form:hide": [];
};

const emit = defineEmits<ReactionFormEmits>();

const { isPending, start, stop } = useTimeoutFn(
  () => {
    emit("form:hide");
  },
  2000,
  {
    immediate: false,
  },
);

const onMouseEnterEventHandler = () => {
  if (isPending.value) {
    stop();
  }
};

const onMouseLeaveEventHandler = () => {
  start();
};
</script>
