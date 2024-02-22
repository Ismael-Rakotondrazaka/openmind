<template>
  <div>
    <PrimeButton
      :severity="buttonSeverity"
      :label="formattedCount"
      :text="isButtonText"
      class="reaction-button"
      @click="onButtonClickHandler"
      @mouseenter="showOverlayPanel"
    >
      <template #icon>
        <ReactionButtonIcon :reaction="reaction" />
      </template>
    </PrimeButton>

    <PrimeOverlayPanel ref="overlayPanel">
      <ReactionForm
        v-model:count="count"
        v-model:reaction="reaction"
        :article-id="articleId"
        :comment-id="null"
      />
    </PrimeOverlayPanel>
  </div>
</template>

<script lang="ts" setup>
import type { PrimeOverlayPanel } from "#build/components";

interface ReactionButtonProps {
  articleId: string;
}

const props = defineProps<ReactionButtonProps>();

const count = defineModel<number>("count", {
  required: true,
});

const reaction = defineModel<Reaction | null>("reaction", {
  required: true,
});

const isActive = computed(() => reaction.value !== null);

const buttonSeverity = computed(() =>
  isActive.value ? "primary" : "secondary",
);

const isButtonText = computed(() => !isActive.value);

const overlayPanel = ref<InstanceType<typeof PrimeOverlayPanel>>();

const showOverlayPanel = (event: Event) => {
  if (overlayPanel.value !== undefined) {
    overlayPanel.value.show(event);
  }
};

const formattedCount = useNumericAbbreviation(count);

const { execute: destroyReaction } = useDestroyReaction({
  reactionId: () => reaction.value?.id ?? -1,
});

const selectedReactionType = ref<ReactionType>("like");

const storeReactionBody = computed(() => {
  return {
    articleId: props.articleId,
    type: selectedReactionType.value,
  };
});

const { reaction: createdReaction, execute: storeReaction } = useStoreReaction({
  body: storeReactionBody,
});

const deleteReaction = async () => {
  reaction.value = null;
  count.value--;

  await destroyReaction();
};

const createReaction = async (reactionType: ReactionType) => {
  selectedReactionType.value = reactionType;
  count.value++;

  await storeReaction();

  reaction.value = toValue(createdReaction);
};

const onButtonClickHandler = () => {
  if (isActive.value) {
    deleteReaction();
  } else {
    createReaction("like");
  }
};
</script>

<style lang="css">
.reaction-button > .pi {
  margin-right: 0.5rem;
}
</style>
