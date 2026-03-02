<template>
  <div class="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
    <div class="w-full max-w-sm">
      <PasswordResetForm />
    </div>
  </div>
</template>

<script lang="ts" setup>
import PasswordResetForm from '@/features/auth/components/PasswordResetForm.vue';
</script>

<style scoped></style>
