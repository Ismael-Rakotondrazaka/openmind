<template>
  <div class="flex flex-col gap-2">
    <InputLabel
      label-for="password"
      label="Password"
      :is-required="isRequired"
      :tooltip-text="tooltipText"
    />

    <PrimePassword
      id="password"
      v-model="password"
      toggle-mask
      :feedback="false"
      :input-class="{
        'w-full': true,
      }"
      :class="{
        '!p-invalid': haveError,
        'w-full block': true,
      }"
    />

    <small id="password-text-error" class="text-red-600">{{
      errorMessage || "&nbsp;"
    }}</small>
  </div>
</template>

<script lang="ts" setup>
const password = defineModel<string, string>("password");

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
