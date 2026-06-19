<script lang="ts" setup>
import type { PostView } from '#shared/features/posts';

import { useClipboard } from '@vueuse/core';
import { useI18n } from 'vue-i18n';
import { toast } from 'vue-sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

type Props = {
  post: Serialize<PostView>;
};

const props = defineProps<Props>();

const { t } = useI18n();
const router = useRouter();
const localePath = useLocalePath();
const config = useRuntimeConfig();

const shareUrl = computed(() => {
  const resolved = router.resolve(
    localePath({
      name: 'u-userKey-p-postId-postSlug',
      params: {
        postId: props.post.id,
        postSlug: props.post.slug,
        userKey: props.post.author.username || props.post.author.id,
      },
    })
  );
  return `${config.public.appUrl}${resolved.fullPath}`;
});

const { copy } = useClipboard();
const handleCopyShareUrl = async () => {
  try {
    await copy(shareUrl.value);
    toast.success(t('posts.shareUrlCopied'));
  } catch {
    toast.error(t('posts.failedToCopyShareUrl'));
  }
};
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button variant="secondary" size="icon" class="rounded-full">
        <Icon name="mdi:share-variant" />
        <span class="sr-only">{{ t('posts.shareTitle') }}</span>
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
            class=""
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
            :hashtags="
              post.tags.length > 0
                ? post.tags.map(tag => tag.tag.value).join(',')
                : undefined
            "
            :title="post.title"
            :image="post.coverUrl ?? undefined"
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
