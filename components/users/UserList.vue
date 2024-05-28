<template>
  <ul v-auto-animate class="">
    <UserListItem
      v-for="user in users"
      :key="user.id"
      :user="user"
      class="w-full"
      @users:update="onUsersUpdateHandler"
    />
  </ul>
</template>

<script lang="ts" setup>
type UserListProps = {
  users: UserFull[];
};

defineProps<UserListProps>();

type UserListEmits = {
  "users:update": [number, UseMutateUserListUpdateData];
};

const emit = defineEmits<UserListEmits>();

const onUsersUpdateHandler = (
  id: number,
  data: UseMutateUserListUpdateData,
) => {
  emit("users:update", id, data);
};
</script>
