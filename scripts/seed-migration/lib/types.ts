export interface ArticleJson {
  content: EditorJsContent;
  coverUrl?: string;
  summary?: string;
  tags: string[];
  title: string;
}

export interface BuiltComment {
  author_id: string;
  content: string;
  created_at: string;
  depth: number;
  id: string;
  parent_id: null | string;
  post_id: string;
  updated_at: string;
}

export interface BuiltFollow {
  created_at: string;
  follower_id: string;
  following_id: string;
  id: string;
}

export interface BuiltPost {
  author_id: string;
  content: unknown;
  cover_url: null | string;
  created_at: string;
  id: string;
  is_visible: boolean;
  slug: string;
  title: string;
  updated_at: string;
}

export interface BuiltPostTag {
  post_id: string;
  tag_id: string;
}

export interface BuiltReaction {
  comment_id: null | string;
  created_at: string;
  id: string;
  post_id: null | string;
  type: ReactionType;
  user_id: string;
}

export interface BuiltSavedPost {
  created_at: string;
  post_id: string;
  user_id: string;
}

export interface BuiltTag {
  id: string;
  slug: string;
  value: string;
}

export interface BuiltUser {
  created_at: string;
  email: string;
  first_name: string;
  id: string;
  last_name: string;
  role: string;
  updated_at: string;
  username: string;
}

export interface BuiltUserTag {
  tag_id: string;
  user_id: string;
}

export interface BuiltView {
  created_at: string;
  id: string;
  post_id: string;
  updated_at: string;
  user_id: string;
}

export type CommentContentJson = EditorJsContent;

export interface EditorJsContent {
  blocks: unknown[];
  time?: number;
  version?: string;
}

export type ReactionType = 'celebrate' | 'like' | 'love';
