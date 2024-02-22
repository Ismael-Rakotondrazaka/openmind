<template>
  <PrimeButton
    :text="isButtonText"
    class="inline-block"
    :severity="buttonSeverity"
    @click="onButtonClickHandler"
  >
    <i class="text-2xl px-3" :class="iconClass"></i><br /><span
      class="p-button-label"
      >Love</span
    >
  </PrimeButton>
</template>

<script lang="ts" setup>
type ReactionLoveButtonEmits = {
  "reaction:delete": [];
  "reaction:create": [];
  "reaction:edit": [];
};

const emit = defineEmits<ReactionLoveButtonEmits>();

interface ReactionLoveButtonProps {
  reaction: Reaction | null;
}

const props = defineProps<ReactionLoveButtonProps>();

const onButtonClickHandler = () => {
  if (props.reaction === null) {
    emit("reaction:create");
  } else if (props.reaction.type === "love") {
    emit("reaction:delete");
  } else {
    emit("reaction:edit");
  }
};

const isActive = computed(
  () => props.reaction !== null && props.reaction.type === "love",
);

const iconClass = computed<string>(() =>
  isActive.value ? "pi pi-heart-fill" : "pi pi-heart",
);

const buttonSeverity = computed(() =>
  isActive.value ? "primary" : "secondary",
);

const isButtonText = computed(() => !isActive.value);
</script>
