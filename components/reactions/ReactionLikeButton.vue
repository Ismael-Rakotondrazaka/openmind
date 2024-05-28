<template>
  <PrimeButton
    :text="isButtonText"
    class="inline-block"
    :severity="buttonSeverity"
    :loading="isLoading"
    @click="onButtonClickHandler"
  >
    <i class="px-3 text-2xl" :class="iconClass"></i><br /><span
      class="p-button-label"
      >Like</span
    >
  </PrimeButton>
</template>

<script lang="ts" setup>
type ReactionLikeButtonEmits = {
  "reaction:delete": [];
  "reaction:create": [];
  "reaction:edit": [];
};

const emit = defineEmits<ReactionLikeButtonEmits>();

interface ReactionLikeButtonProps {
  reaction: Reaction | null;
  isLoading?: boolean;
}

const props = withDefaults(defineProps<ReactionLikeButtonProps>(), {
  isLoading: false,
});

const isActive = computed(
  () => props.reaction !== null && props.reaction.type === "like",
);

const onButtonClickHandler = () => {
  if (props.reaction === null) {
    emit("reaction:create");
  } else if (props.reaction.type === "like") {
    emit("reaction:delete");
  } else {
    emit("reaction:edit");
  }
};

const iconClass = computed<string>(() =>
  isActive.value ? "pi pi-thumbs-up-fill" : "pi pi-thumbs-up",
);

const buttonSeverity = computed(() =>
  isActive.value ? "primary" : "secondary",
);

const isButtonText = computed(() => !isActive.value);
</script>
