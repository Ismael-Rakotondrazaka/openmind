import { subDays } from 'date-fns';
import slugify from 'slugify';
import { v4 as uuidV4 } from 'uuid';

import type { SeedConfig } from '../input/config.js';
import type { SeedUser } from '../input/users.js';
import type {
  ArticleJson,
  BuiltComment,
  BuiltFollow,
  BuiltPost,
  BuiltPostTag,
  BuiltReaction,
  BuiltSavedPost,
  BuiltTag,
  BuiltUser,
  BuiltUserTag,
  BuiltView,
  CommentContentJson,
  ReactionType,
} from './types.js';

import { createSeededRandom, intBetween, pick, pickMany } from './random.js';

const REACTION_TYPES: ReactionType[] = ['like', 'love', 'celebrate'];
const INSTANCE_ID = '00000000-0000-0000-0000-000000000000';
const BASE_DATE = new Date('2024-01-15T12:00:00.000Z');

export interface BuiltModel {
  comments: BuiltComment[];
  follows: BuiltFollow[];
  posts: BuiltPost[];
  postTags: BuiltPostTag[];
  reactions: BuiltReaction[];
  savedPosts: BuiltSavedPost[];
  tags: BuiltTag[];
  users: BuiltUser[];
  userTags: BuiltUserTag[];
  views: BuiltView[];
}

export function buildModel(
  seedUsers: SeedUser[],
  config: SeedConfig,
  articles: ArticleJson[],
  commentsContent: CommentContentJson[],
  repliesContent: CommentContentJson[]
): BuiltModel {
  const rng = createSeededRandom(config.seed);

  const toIso = (d: Date) =>
    d.toISOString().replace('T', ' ').replace('Z', '+00');

  const users: BuiltUser[] = seedUsers.map((u, i) => {
    const id = uuidV4();
    const created = subDays(BASE_DATE, seedUsers.length - i + 10);
    return {
      created_at: toIso(created),
      email: u.email,
      first_name: u.first_name,
      id,
      last_name: u.last_name,
      role: u.role,
      updated_at: toIso(created),
      username: u.username,
    };
  });

  const tagValues = [...new Set(articles.flatMap(a => a.tags))];
  const tags: BuiltTag[] = tagValues.map(value => ({
    id: uuidV4(),
    value,
  }));
  const tagValueToId = new Map(tags.map(t => [t.value, t.id]));

  const posts: BuiltPost[] = articles.map((a, i) => {
    const id = uuidV4();
    const author = pick(rng, users);
    const created = subDays(BASE_DATE, articles.length - i);
    return {
      author_id: author.id,
      content: a.content,
      cover_url: a.coverUrl ?? null,
      created_at: toIso(created),
      id,
      is_visible: true,
      slug: slugify(a.title, { lower: true, strict: true }) || `post-${i + 1}`,
      title: a.title,
      updated_at: toIso(created),
    };
  });

  const postTags: BuiltPostTag[] = [];
  for (const [idx, article] of articles.entries()) {
    const post = posts[idx]!;
    for (const tagValue of article.tags) {
      const tagId = tagValueToId.get(tagValue);
      if (tagId) postTags.push({ post_id: post.id, tag_id: tagId });
    }
  }

  const userTags: BuiltUserTag[] = [];
  for (const user of users) {
    const chosen = pickMany(
      rng,
      tags,
      config.userTagsPerUser.min,
      config.userTagsPerUser.max
    );
    for (const tag of chosen) {
      userTags.push({ tag_id: tag.id, user_id: user.id });
    }
  }

  const comments: BuiltComment[] = [];
  const commentIdsByPost = new Map<string, BuiltComment[]>();

  for (const post of posts) {
    const postComments: BuiltComment[] = [];
    const nTop = intBetween(
      rng,
      config.commentsPerPost.min,
      config.commentsPerPost.max
    );
    for (let i = 0; i < nTop; i++) {
      const id = uuidV4();
      const contentObj = commentsContent[i % commentsContent.length]!;
      const contentStr = JSON.stringify(contentObj);
      const author = pick(rng, users);
      const created = subDays(BASE_DATE, 5);
      const c: BuiltComment = {
        author_id: author.id,
        content: contentStr,
        created_at: toIso(created),
        depth: 0,
        id,
        parent_id: null,
        post_id: post.id,
        updated_at: toIso(created),
      };
      comments.push(c);
      postComments.push(c);

      const nReplies = intBetween(
        rng,
        config.repliesPerComment.min,
        config.repliesPerComment.max
      );
      for (let r = 0; r < nReplies; r++) {
        const rid = uuidV4();
        const replyContent = repliesContent[(i + r) % repliesContent.length]!;
        const replyAuthor = pick(rng, users);
        const replyCreated = subDays(created, -1);
        const reply: BuiltComment = {
          author_id: replyAuthor.id,
          content: JSON.stringify(replyContent),
          created_at: toIso(replyCreated),
          depth: 1,
          id: rid,
          parent_id: id,
          post_id: post.id,
          updated_at: toIso(replyCreated),
        };
        comments.push(reply);
        postComments.push(reply);
      }
    }
    commentIdsByPost.set(post.id, postComments);
  }

  const follows: BuiltFollow[] = [];
  for (const user of users) {
    const others = users.filter(u => u.id !== user.id);
    const n = intBetween(
      rng,
      config.followsPerUser.min,
      config.followsPerUser.max
    );
    const following = pickMany(rng, others, n, n);
    for (const other of following) {
      follows.push({
        created_at: toIso(BASE_DATE),
        follower_id: user.id,
        following_id: other.id,
        id: uuidV4(),
      });
    }
  }

  const reactions: BuiltReaction[] = [];
  for (const post of posts) {
    const n = intBetween(
      rng,
      config.reactionsPerPost.min,
      config.reactionsPerPost.max
    );
    const chosen = pickMany(rng, users, n, n);
    for (const user of chosen) {
      reactions.push({
        comment_id: null,
        created_at: toIso(BASE_DATE),
        id: uuidV4(),
        post_id: post.id,
        type: pick(rng, REACTION_TYPES),
        user_id: user.id,
      });
    }
  }
  for (const comment of comments) {
    const n = intBetween(
      rng,
      config.reactionsPerComment.min,
      config.reactionsPerComment.max
    );
    const chosen = pickMany(rng, users, n, n);
    for (const user of chosen) {
      reactions.push({
        comment_id: comment.id,
        created_at: toIso(BASE_DATE),
        id: uuidV4(),
        post_id: null,
        type: pick(rng, REACTION_TYPES),
        user_id: user.id,
      });
    }
  }

  const views: BuiltView[] = [];
  for (const post of posts) {
    const n = intBetween(rng, config.viewsPerPost.min, config.viewsPerPost.max);
    const chosen = pickMany(rng, users, n, n);
    for (const user of chosen) {
      const created = subDays(BASE_DATE, 2);
      views.push({
        created_at: toIso(created),
        id: uuidV4(),
        post_id: post.id,
        updated_at: toIso(created),
        user_id: user.id,
      });
    }
  }

  const savedPosts: BuiltSavedPost[] = [];
  for (const user of users) {
    const n = intBetween(
      rng,
      config.savedPostsPerUser.min,
      config.savedPostsPerUser.max
    );
    const chosen = pickMany(rng, posts, n, n);
    for (const post of chosen) {
      savedPosts.push({
        created_at: toIso(BASE_DATE),
        post_id: post.id,
        user_id: user.id,
      });
    }
  }

  return {
    comments,
    follows,
    posts,
    postTags,
    reactions,
    savedPosts,
    tags,
    users,
    userTags,
    views,
  };
}

export { INSTANCE_ID };
