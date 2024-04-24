<template>
  <div>
    <InputLabel
      label-for="firstName"
      label="First name"
      :is-required="true"
      :tooltip-text="tooltipText"
    />

    <PrimeInputText
      id="firstName"
      v-model="firstName"
      :class="{ 'p-invalid': haveError }"
    />

    <small id="email-or-isVisible-text-error" class="text-red-600">{{
      errorMessage || "&nbsp;"
    }}</small>
  </div>
</template>

<script lang="ts" setup>
const firstName = defineModel<string, string>("firstName");

interface UserFirstNameProps {
  errorMessage?: string;
}

const props = withDefaults(defineProps<UserFirstNameProps>(), {
  errorMessage: undefined,
});

const haveError = computed<boolean>(() => props.errorMessage !== undefined);

const tooltipText = computed<string>(() =>
  [
    `• ${userConfig.FIRST_NAME_MIN_LENGTH} characters min`,
    `• ${userConfig.FIRST_NAME_MAX_LENGTH} characters max`,
  ].join("\n"),
);
</script>
