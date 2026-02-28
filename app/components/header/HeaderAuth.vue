<script setup lang="ts">
import { toast } from 'vue-sonner';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Props {
  imageUrl: string;
  username: string;
}

defineProps<Props>();

const handleLogout = async () => {
  const userSBClient = useSupabaseClient();
  const { error } = await userSBClient.auth.signOut();
  if (error) {
    toast.error(getAuthErrorMessage(error));
    return;
  }
  toast.success('Logged out successfully');
  navigateTo({
    name: 'index',
  });
};
</script>

<template>
  <header
    class="fixed top-0 right-0 left-0 z-2 container mx-auto w-full rounded-b-md border-x border-b bg-[#e5fcd5] p-2"
  >
    <nav class="flex items-center justify-between gap-4">
      <div class="flex items-center">
        <NuxtLink :to="{ name: 'index' }" as-child>
          <Button variant="ghost">
            <NuxtImg
              src="/images/logo-150x150.png"
              alt="OpenMind"
              class="h-6 w-6"
              width="24"
              height="24"
            />

            <span class="sr-only text-base font-bold md:not-sr-only"
              >OpenMind</span
            >
          </Button>
        </NuxtLink>
      </div>

      <div class="flex items-center gap-2">
        <NuxtLink
          :to="{
            name: 'posts-new',
          }"
          as-child
        >
          <Button variant="default" size="icon" class="rounded-full">
            <Icon name="mdi:add" size="1rem" />
            <span class="sr-only">New post</span>
          </Button>
        </NuxtLink>

        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Avatar>
              <AvatarImage :src="imageUrl" :alt="username" />
              <AvatarFallback>{{ username.charAt(0) }}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>

          <DropdownMenuContent class="w-56" align="start">
            <DropdownMenuGroup>
              <NuxtLink :to="{ name: 'profile' }" as-child>
                <DropdownMenuItem>
                  Profile
                  <DropdownMenuShortcut>
                    <Icon name="mdi:account" size="1rem" />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              </NuxtLink>

              <NuxtLink :to="{ name: 'settings' }" as-child>
                <DropdownMenuItem>
                  Setting
                  <DropdownMenuShortcut>
                    <Icon name="mdi:cog" size="1rem" />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              </NuxtLink>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem @click="handleLogout">
              Log out
              <DropdownMenuShortcut>
                <Icon name="mdi:logout" size="1rem" />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  </header>
</template>
