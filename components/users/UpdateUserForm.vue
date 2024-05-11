<template>
  <form class="w-full" @submit.prevent="">
    <div class="text-text text-2xl font-bold mb-3">Update your profile</div>

    <div class="text-text mb-7">
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
