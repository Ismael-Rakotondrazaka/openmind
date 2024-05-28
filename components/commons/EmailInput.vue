<template>
  <div class="flex flex-col gap-2">
    <InputLabel
      label-for="email"
      label="Email"
      :is-required="isRequired"
      :tooltip-text="tooltipText"
    />

    <PrimeInputText
      id="email"
      v-model="email"
      :class="{
        'p-invalid': haveError,
        'w-full': true,
      }"
    />

    <small id="email-text-error" class="text-red-600">{{
      errorMessage || "&nbsp;"
    }}</small>
  </div>
</template>

<script lang="ts" setup>
const email = defineModel<string, string>("email");

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
  [`• ${userConfig.EMAIL_MAX_LENGTH} characters max`].join("\n"),
);
</script>
