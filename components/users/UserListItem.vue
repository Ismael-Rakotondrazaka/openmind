<template>
  <li class="flex items-center justify-between w-full">
    <div class="flex items-center justify-start gap-5">
      <NuxtLink
        :to="{
          name: 'users-username',
          params: {
            username: user.username,
          },
        }"
      >
        <UserAvatar size="large" :user="user" />
      </NuxtLink>

      <NuxtLink
        :to="{
          name: 'users-username',
          params: {
            username: user.username,
          },
        }"
      >
        <h1 class="font-bold text-text">
          {{ user.firstName }}&nbsp;{{ user.name }}
        </h1>
      </NuxtLink>
    </div>

    <PrimeButton
      v-if="
        authUser !== null &&
        user._auth.follower === null &&
        user.id !== authUser.id
      "
      label="Follow"
      size="small"
    />
  </li>
</template>

<script lang="ts" setup>
type UserListItemProps = {
  user: UserFull;
};

defineProps<UserListItemProps>();

const { user: authUser } = inject(AuthUserToken) as AuthUserDI;
</script>
