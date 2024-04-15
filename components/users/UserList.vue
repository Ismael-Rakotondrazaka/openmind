<template>
  <ul class="flex flex-wrap items-stretch justify-evenly, w-full gap-5">
    <UserListItem
      v-for="user in users"
      :key="user.id"
      :user="user"
      class="w-full"
    />
  </ul>
</template>

<script lang="ts" setup>
type UserListProps = {
  users: UserFull[];
};

defineProps<UserListProps>();
</script>
