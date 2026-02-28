<script lang="ts" setup>
import { useClipboard } from '@vueuse/core';
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

const { copy } = useClipboard();

const handleCopyShareUrl = async () => {
  try {
    await copy(props.shareUrl);
    toast.success('Share URL copied to clipboard');
  } catch {
    toast.error('Failed to copy share URL');
  }
};
</script>

<template>
  <div class="mb-4 flex items-center justify-between">
    <div class="flex items-center gap-2">
      <NuxtLink v-if="isOwner" to="/posts/new" as-child>
        <Button>
          <Icon name="mdi:plus" />
          New article
        </Button>
      </NuxtLink>

      <Button
        v-if="isAuthenticated && !isOwner"
        :variant="isFollowing ? 'outline' : 'default'"
        :disabled="isFollowLoading"
        @click="emit('followToggle')"
      >
        <Icon :name="isFollowing ? 'mdi:account-check' : 'mdi:account-plus'" />
        {{ isFollowing ? 'Following' : 'Follow' }}
      </Button>
    </div>

    <div class="flex items-center gap-2">
      <Popover>
        <PopoverTrigger as-child>
          <Button variant="outline">
            <Icon name="mdi:share-variant" />
            Share
          </Button>
        </PopoverTrigger>
        <PopoverContent class="w-80">
          <div class="grid gap-4">
            <div class="space-y-2">
              <h4 class="leading-none font-medium">Share</h4>
            </div>

            <div class="flex flex-row flex-nowrap items-center gap-2">
              <Input disabled class="w-full" :default-value="shareUrl" />
              <Button
                variant="secondary"
                size="icon"
                @click="handleCopyShareUrl"
              >
                <Icon name="mdi:content-copy" />
                <span class="sr-only">Copy</span>
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
              <NuxtLink to="/profile/edit">Edit profile</NuxtLink>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </div>
</template>

<style></style>
