<script lang="ts" setup>
import { useClipboard } from '@vueuse/core';
import { toast } from 'vue-sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import type { Post } from '../post.model';

type Props = {
  post: Post;
};

defineProps<Props>();

const route = useRoute('u-userKey-p-postId-postSlug');
const config = useRuntimeConfig();

const shareUrl = computed(() => {
  return `${config.public.appUrl}${route.fullPath}`;
});

const { copy } = useClipboard();
const handleCopyShareUrl = async () => {
  try {
    await copy(shareUrl.value);
    toast.success('Share URL copied to clipboard');
  } catch {
    toast.error('Failed to copy share URL');
  }
};
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button variant="secondary" size="icon" class="rounded-full">
        <Icon name="mdi:share-variant" />
        <span class="sr-only">Share</span>
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
            class=""
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
            :hashtags="
              post.tags.length > 0
                ? post.tags.map(tag => tag.tag.value).join(',')
                : undefined
            "
            :title="post.title"
            :image="post.cover_url ?? undefined"
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
</template>
