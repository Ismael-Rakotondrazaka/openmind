<template>
  <div class="flex flex-col gap-2">
    <InputLabel
      label-for="username"
      label="Username"
      :is-required="true"
      :tooltip-text="tooltipText"
    />

    <PrimeInputText
      id="username"
      v-model="username"
      :class="{ 'p-invalid': haveError }"
    />

    <small id="username-text-error" class="text-red-600">{{
      errorMessage || "&nbsp;"
    }}</small>
  </div>
</template>

<script lang="ts" setup>
const username = defineModel<string>("username");

interface UserFirstNameProps {
  errorMessage?: string;
}

const props = withDefaults(defineProps<UserFirstNameProps>(), {
  errorMessage: undefined,
});

const haveError = computed<boolean>(() => props.errorMessage !== undefined);

const tooltipText = computed<string>(() =>
  [
    `• ${userConfig.USERNAME_MIN_LENGTH} characters min`,
    `• ${userConfig.USERNAME_MAX_LENGTH} characters max`,
  ].join("\n"),
);
</script>
