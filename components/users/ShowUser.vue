<template>
  <div class="w-full max-w-2xl mx-auto my-7">
    <main class="mb-5 text-center">
      <UserAvatar size="2xlarge" :user="user" preview class="mb-3" />

      <h1
        class="mb-2 text-2xl font-extrabold leading-tight text-text dark:text-white"
      >
        {{ user.firstName }} {{ user.name }}
      </h1>

      <h2 class="mb-4 text-lg text-text-secondary">{{ user.username }}</h2>
    </main>

    <div class="flex items-center justify-start gap-5">
      <FollowingButton v-if="user._auth.follower !== null" />
      <FollowButton v-else-if="authUser !== null && user.id !== authUser.id" />

      <ShareUserButton :user="user" />
    </div>

    <PrimeDivider />

    <ShowUserTabView />
  </div>
</template>

<script lang="ts" setup>
import { ShowUserToken } from "~/di";

const { user } = inject(ShowUserToken) as ShowUserDI;

const { user: authUser } = useAuthUser();
</script>
