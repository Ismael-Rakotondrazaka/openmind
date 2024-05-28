<template>
  <div class="flex flex-col gap-2">
    <InputLabel
      label-for="emailOrUsername"
      label="Email or Username"
      :is-required="isRequired"
      :tooltip-text="tooltipText"
    />

    <PrimeInputText
      id="emailOrUsername"
      v-model="emailOrUsername"
      :class="{
        'p-invalid': haveError,
        'w-full': true,
      }"
    />

    <small id="email-or-isVisible-text-error" class="text-red-600">{{
      errorMessage || "&nbsp;"
    }}</small>
  </div>
</template>

<script lang="ts" setup>
const emailOrUsername = defineModel<string, string>("emailOrUsername");

interface UserFirstNameProps {
  errorMessage?: string;
  isRequired?: boolean;
}

const props = withDefaults(defineProps<UserFirstNameProps>(), {
  errorMessage: undefined,
  isRequired: false,
});

const haveError = computed<boolean>(() => props.errorMessage !== undefined);

const tooltipText = computed<string>(() =>
  [
    `• ${Math.max(
      userConfig.EMAIL_MAX_LENGTH,
      userConfig.USERNAME_MAX_LENGTH,
    )} characters max`,
  ].join("\n"),
);
</script>
