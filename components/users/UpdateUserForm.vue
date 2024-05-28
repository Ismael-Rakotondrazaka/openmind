<template>
  <form class="w-full" @submit.prevent="">
    <div class="mb-3 text-2xl font-bold text-text">Update your profile</div>

    <div class="mb-7 text-text">
      Ready to refresh your profile? Use the form below to update your personal
      details or change your profile picture. Keep your information current and
      let others know more about you. It's quick and easy!
    </div>

    <UpdateUserTabView :user="user" />
  </form>
</template>

<script setup lang="ts">
interface EditUserFormProps {
  user: UserFull;
}

const props = defineProps<EditUserFormProps>();

const user = computed<UserFull>(() => props.user);
</script>
