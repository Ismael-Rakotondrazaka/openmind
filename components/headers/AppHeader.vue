<template>
  <div class="card">
    <PrimeMenubar
      :model="items"
      :pt="{
        root: {
          class:
            'fixed top-0 left-0 right-0 w-full mx-auto max-w-[1200px] z-50 !border-t-0 !rounded-t-none',
        },
      }"
    >
      <template #item="{ item, props, hasSubmenu }">
        <NuxtLink v-if="item.route" :to="item.route">
          <span v-if="item.image" v-ripple v-bind="props.action">
            <img :src="item.image" :alt="item.alt" class="h-6 w-6" />
            <span v-if="item.label" class="ml-2">{{ item.label }}</span>
          </span>
          <span v-else v-ripple v-bind="props.action">
            <span :class="item.icon" />
            <span class="ml-2">{{ item.label }}</span>
          </span>
        </NuxtLink>
        <a
          v-else
          v-ripple
          :href="item.url"
          :target="item.target"
          v-bind="props.action"
        >
          <span :class="item.icon" />
          <span class="ml-2">{{ item.label }}</span>
          <span v-if="hasSubmenu" class="pi pi-fw pi-angle-down ml-2" />
        </a>
      </template>

      <template #end>
        <div v-if="authUser != null">
          <button
            type="button"
            aria-haspopup="true"
            aria-controls="overlay_menu"
            @click="toggle"
          >
            <UserAvatar :user="authUser" size="large" />
          </button>

          <PrimeMenu
            id="overlay_menu"
            ref="endMenu"
            :model="endMenuItems"
            :popup="true"
          />
        </div>
        <div v-else class="flex items-center gap-3">
          <NuxtLink
            :to="{
              name: 'signin',
            }"
          >
            <PrimeButton
              label="Sign In"
              icon="pi pi-sign-in"
              severity="secondary"
              size="small"
            />
          </NuxtLink>
          <NuxtLink
            :to="{
              name: 'register',
            }"
          >
            <PrimeButton label="Register" icon="pi pi-user-plus" size="small" />
          </NuxtLink>
        </div>
      </template>
    </PrimeMenubar>
  </div>
</template>

<script setup lang="ts">
import type PrimeMenu from "primevue/menu";
import { type MenuProps } from "primevue/menu";

type MenuItem = Exclude<MenuProps["model"], undefined>[0];

const router = useRouter();
const endMenu = ref<InstanceType<typeof PrimeMenu>>();

const toggle = (event: Event) => {
  endMenu.value?.toggle(event);
};

const { signOut } = useAuth();

const homeItem: MenuItem = {
  image: "/images/logo-150x150.png",
  label: "OpenMind",
  alt: "logo",
  route: {
    name: "index",
  },
};

const articlesItem: MenuItem = {
  label: "Articles",
  icon: "pi pi-align-left",
  route: {
    name: "articles",
  },
};

const usersItem: MenuItem = {
  label: "Users",
  icon: "pi pi-users",
  route: {
    name: "users",
  },
};

const items: MenuItem[] = [homeItem, articlesItem, usersItem];

const { user: authUser } = useAuthUser();

const endMenuItems: MenuItem[] = [
  {
    label: "Profile",
    icon: "pi pi-user",
    command: () => {
      router.push({
        name: "users-username",
        params: {
          username: authUser.value!.username,
        },
      });
    },
  },
  {
    label: "Saved articles",
    icon: "pi pi-align-left",
    command: () => {
      router.push({
        name: "saved-articles",
      });
    },
  },
  {
    label: "Logout",
    icon: "pi pi-sign-out",
    command: async () => {
      await signOut({
        callbackUrl: "/",
        redirect: true,
      });
    },
  },
];
</script>
