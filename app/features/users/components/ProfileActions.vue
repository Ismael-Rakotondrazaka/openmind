<script lang="ts" setup>
import { useClipboard } from '@vueuse/core';
import { useI18n } from 'vue-i18n';
import { toast } from 'vue-sonner';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface Props {
  isAuthenticated: boolean;
  isFollowing: boolean;
  isFollowLoading: boolean;
  isOwner: boolean;
  shareUrl: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  followToggle: [];
}>();

const { t } = useI18n();
const { copy } = useClipboard();

const handleCopyShareUrl = async () => {
  try {
    await copy(props.shareUrl);
    toast.success(t('posts.shareUrlCopied'));
  } catch {
    toast.error(t('posts.failedToCopyShareUrl'));
  }
};
</script>

<template>
  <div class="mb-4 flex items-center justify-between">
    <div class="flex items-center gap-2">
      <NuxtLinkLocale v-if="isOwner" :to="{ name: 'posts-new' }" as-child>
        <Button>
          <Icon name="mdi:plus" />
          {{ t('users.newArticleButton') }}
        </Button>
      </NuxtLinkLocale>

      <Button
        v-if="isAuthenticated && !isOwner"
        :variant="isFollowing ? 'outline' : 'default'"
        :disabled="isFollowLoading"
        @click="emit('followToggle')"
      >
        <Icon :name="isFollowing ? 'mdi:account-check' : 'mdi:account-plus'" />
        {{ isFollowing ? t('users.followingButton') : t('users.followButton') }}
      </Button>
    </div>

    <div class="flex items-center gap-2">
      <Popover>
        <PopoverTrigger as-child>
          <Button variant="outline">
            <Icon name="mdi:share-variant" />
            {{ t('buttons.share') }}
          </Button>
        </PopoverTrigger>
        <PopoverContent class="w-80">
          <div class="grid gap-4">
            <div class="space-y-2">
              <h4 class="leading-none font-medium">
                {{ t('posts.shareTitle') }}
              </h4>
            </div>

            <div class="flex flex-row flex-nowrap items-center gap-2">
              <Input disabled class="w-full" :default-value="shareUrl" />
              <Button
                variant="secondary"
                size="icon"
                @click="handleCopyShareUrl"
              >
                <Icon name="mdi:content-copy" />
                <span class="sr-only">{{ t('buttons.copy') }}</span>
              </Button>
            </div>

            <div class="flex flex-row items-center justify-start gap-2">
              <SocialShare
                network="email"
                :styled="true"
                :label="false"
                :url="shareUrl"
              />
              <SocialShare
                network="facebook"
                :styled="true"
                :label="false"
                :url="shareUrl"
              />
              <SocialShare
                network="x"
                :styled="true"
                :label="false"
                :url="shareUrl"
              />
              <SocialShare
                network="linkedin"
                :styled="true"
                :label="false"
                :url="shareUrl"
              />
              <SocialShare
                network="whatsapp"
                :styled="true"
                :label="false"
                :url="shareUrl"
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <DropdownMenu v-if="isOwner">
        <DropdownMenuTrigger as-child>
          <Button variant="ghost" size="icon">
            <Icon name="mdi:dots-horizontal" size="1rem" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" class="w-48">
          <DropdownMenuGroup>
            <DropdownMenuItem as-child>
              <NuxtLinkLocale :to="{ name: 'settings' }">{{
                t('users.editProfile')
              }}</NuxtLinkLocale>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </div>
</template>

<style></style>
