<script setup lang="ts">
import { useQuery } from '@pinia/colada';
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
import { useNotificationRealtime } from '~/features/shared/notifications/composables/useNotificationRealtime';
import { unreadNotificationsCountQuery } from '~/features/shared/notifications/notification.query';

interface Props {
  imageUrl: string;
  username: string;
}

defineProps<Props>();

const fetchFn = useRequestFetch();

const { data: unreadData } = useQuery(
  unreadNotificationsCountQuery({ fetchFn })
);

const unreadCount = computed(() => unreadData.value?.count ?? 0);
const badgeLabel = computed(() =>
  unreadCount.value > 99 ? '+99' : String(unreadCount.value)
);

useNotificationRealtime();

const { close: closeWs, open: openWs } = useGlobalWs();
onMounted(openWs);

const localePath = useLocalePath();

const { fetch: fetchSession } = useUserSession();
const { t } = useI18n();

const handleLogout = async () => {
  try {
    await $fetch('/api/auth/logout', { method: 'POST' });
    closeWs();
    await fetchSession();
    toast.success(t('toasts.loggedOutSuccessfully'));
  } catch {
    toast.error(t('toasts.failedToLogOut'));
  }
  navigateTo(localePath({ name: 'index' }));
};
</script>

<template>
  <header
    class="fixed top-0 right-0 left-0 z-2 container mx-auto w-full rounded-b-md border-x border-b bg-[#e5fcd5] p-2"
  >
    <nav class="flex items-center justify-between gap-4">
      <div class="flex items-center">
        <NuxtLinkLocale :to="{ name: 'index' }" as-child>
          <Button variant="ghost">
            <NuxtImg
              src="/images/logo-150x150.png"
              :alt="t('common.brand.name')"
              class="h-6 w-6"
              width="24"
              height="24"
            />

            <span class="sr-only text-base font-bold md:not-sr-only">{{
              t('common.brand.name')
            }}</span>
          </Button>
        </NuxtLinkLocale>
      </div>

      <div class="flex items-center gap-2">
        <HeaderLocaleSwitcher />

        <NuxtLinkLocale :to="{ name: 'notifications' }" as-child>
          <Button variant="ghost" size="icon" class="relative rounded-full">
            <Icon name="mdi:bell-outline" size="1.25rem" />
            <span
              v-if="unreadCount > 0"
              class="bg-primary text-primary-foreground absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] leading-none font-bold"
            >
              {{ badgeLabel }}
            </span>
            <span class="sr-only">{{ t('buttons.notifications') }}</span>
          </Button>
        </NuxtLinkLocale>

        <NuxtLinkLocale
          :to="{
            name: 'posts-new',
          }"
          as-child
        >
          <Button variant="default" size="icon" class="rounded-full">
            <Icon name="mdi:add" size="1rem" />
            <span class="sr-only">{{ t('header.newPost') }}</span>
          </Button>
        </NuxtLinkLocale>

        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Avatar>
              <AvatarImage :src="imageUrl" :alt="username" />
              <AvatarFallback>{{ username.charAt(0) }}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>

          <DropdownMenuContent class="w-56" align="start">
            <DropdownMenuGroup>
              <NuxtLinkLocale :to="{ name: 'profile' }" as-child>
                <DropdownMenuItem>
                  {{ t('buttons.profile') }}
                  <DropdownMenuShortcut>
                    <Icon name="mdi:account" size="1rem" />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              </NuxtLinkLocale>

              <NuxtLinkLocale :to="{ name: 'settings' }" as-child>
                <DropdownMenuItem>
                  {{ t('buttons.settings') }}
                  <DropdownMenuShortcut>
                    <Icon name="mdi:cog" size="1rem" />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              </NuxtLinkLocale>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem @click="handleLogout">
              {{ t('buttons.logout') }}
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
