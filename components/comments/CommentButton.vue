<template>
  <PrimeButton
    icon="pi pi-comment"
    severity="secondary"
    :label="formattedCount"
    text
    @click="onButtonClickHandler"
  />
</template>

<script lang="ts" setup>
const count = defineModel<number>("count", {
  required: true,
});

const formattedCount = useNumericAbbreviation(count);

type ICommentButtonEmits = {
  "comments:show": [];
};

const emit = defineEmits<ICommentButtonEmits>();

const onButtonClickHandler = () => {
  emit("comments:show");
};
</script>
