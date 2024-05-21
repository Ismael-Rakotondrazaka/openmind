<template>
  <div class="flex flex-col gap-2">
    <InputLabel
      label-for="name"
      label="Name"
      :is-required="true"
      :tooltip-text="tooltipText"
    />

    <PrimeInputText
      id="name"
      v-model="name"
      :class="{ 'p-invalid': haveError }"
    />

    <small id="email-or-isVisible-text-error" class="text-red-600">{{
      errorMessage || "&nbsp;"
    }}</small>
  </div>
</template>

<script lang="ts" setup>
const name = defineModel<string>("name");

interface UserFirstNameProps {
  errorMessage?: string;
}

const props = withDefaults(defineProps<UserFirstNameProps>(), {
  errorMessage: undefined,
});

const haveError = computed<boolean>(() => props.errorMessage !== undefined);

const tooltipText = computed<string>(() =>
  [
    `• ${userConfig.NAME_MIN_LENGTH} characters min`,
    `• ${userConfig.NAME_MAX_LENGTH} characters max`,
  ].join("\n"),
);
</script>
