import { z } from 'zod';
import type { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const UserScalarFieldEnumSchema = z.enum(['id','username','name','firstName','email','emailVerifiedAt','password','profileUrl','role','createdAt','updatedAt','deletedAt']);

export const PasswordResetTokenScalarFieldEnumSchema = z.enum(['token','expiresAt','userId']);

export const ActivationTokenScalarFieldEnumSchema = z.enum(['token','expiresAt','userId']);

export const ArticleScalarFieldEnumSchema = z.enum(['id','title','slug','userId','summary','coverUrl','content','isVisible','createdAt','updatedAt','deletedAt']);

export const SavedArticleScalarFieldEnumSchema = z.enum(['articleId','userId','createdAt']);

export const TagScalarFieldEnumSchema = z.enum(['id','value']);

export const CommentScalarFieldEnumSchema = z.enum(['id','content','parentId','userId','articleId','createdAt','updatedAt','deletedAt']);

export const ReactionScalarFieldEnumSchema = z.enum(['id','type','createdAt','userId','articleId','commentId']);

export const ViewScalarFieldEnumSchema = z.enum(['id','createdAt','updatedAt','userId','articleId']);

export const FollowScalarFieldEnumSchema = z.enum(['id','createdAt','followerId','followingId']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const QueryModeSchema = z.enum(['default','insensitive']);

export const NullsOrderSchema = z.enum(['first','last']);

export const RoleSchema = z.enum(['admin','modo','user']);

export type RoleType = `${z.infer<typeof RoleSchema>}`

export const ReactionTypeSchema = z.enum(['like','love','celebrate']);

export type ReactionTypeType = `${z.infer<typeof ReactionTypeSchema>}`

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  role: RoleSchema,
  id: z.number().int(),
  username: z.string(),
  name: z.string(),
  firstName: z.string(),
  email: z.string(),
  emailVerifiedAt: z.coerce.date().nullable(),
  password: z.string(),
  profileUrl: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullable(),
})

export type User = z.infer<typeof UserSchema>

/////////////////////////////////////////
// PASSWORD RESET TOKEN SCHEMA
/////////////////////////////////////////

export const PasswordResetTokenSchema = z.object({
  token: z.string(),
  expiresAt: z.coerce.date(),
  userId: z.number().int(),
})

export type PasswordResetToken = z.infer<typeof PasswordResetTokenSchema>

/////////////////////////////////////////
// ACTIVATION TOKEN SCHEMA
/////////////////////////////////////////

export const ActivationTokenSchema = z.object({
  token: z.string(),
  expiresAt: z.coerce.date(),
  userId: z.number().int(),
})

export type ActivationToken = z.infer<typeof ActivationTokenSchema>

/////////////////////////////////////////
// ARTICLE SCHEMA
/////////////////////////////////////////

export const ArticleSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  userId: z.number().int(),
  summary: z.string().nullable(),
  coverUrl: z.string().nullable(),
  content: z.string(),
  isVisible: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullable(),
})

export type Article = z.infer<typeof ArticleSchema>

/////////////////////////////////////////
// SAVED ARTICLE SCHEMA
/////////////////////////////////////////

export const SavedArticleSchema = z.object({
  articleId: z.string(),
  userId: z.number().int(),
  createdAt: z.coerce.date(),
})

export type SavedArticle = z.infer<typeof SavedArticleSchema>

/////////////////////////////////////////
// TAG SCHEMA
/////////////////////////////////////////

export const TagSchema = z.object({
  id: z.number().int(),
  value: z.string(),
})

export type Tag = z.infer<typeof TagSchema>

/////////////////////////////////////////
// COMMENT SCHEMA
/////////////////////////////////////////

export const CommentSchema = z.object({
  id: z.string(),
  content: z.string(),
  parentId: z.string().nullable(),
  userId: z.number().int(),
  articleId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullable(),
})

export type Comment = z.infer<typeof CommentSchema>

/////////////////////////////////////////
// REACTION SCHEMA
/////////////////////////////////////////

export const ReactionSchema = z.object({
  type: ReactionTypeSchema,
  id: z.number().int(),
  createdAt: z.coerce.date(),
  userId: z.number().int(),
  articleId: z.string().nullable(),
  commentId: z.string().nullable(),
})

export type Reaction = z.infer<typeof ReactionSchema>

/////////////////////////////////////////
// VIEW SCHEMA
/////////////////////////////////////////

export const ViewSchema = z.object({
  id: z.number().int(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  userId: z.number().int(),
  articleId: z.string(),
})

export type View = z.infer<typeof ViewSchema>

/////////////////////////////////////////
// FOLLOW SCHEMA
/////////////////////////////////////////

export const FollowSchema = z.object({
  id: z.number().int(),
  createdAt: z.coerce.date(),
  followerId: z.number().int(),
  followingId: z.number().int(),
})

export type Follow = z.infer<typeof FollowSchema>

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// USER
//------------------------------------------------------

export const UserIncludeSchema: z.ZodType<Prisma.UserInclude> = z.object({
  activationToken: z.union([z.boolean(),z.lazy(() => ActivationTokenArgsSchema)]).optional(),
  passwordResetToken: z.union([z.boolean(),z.lazy(() => PasswordResetTokenArgsSchema)]).optional(),
  articles: z.union([z.boolean(),z.lazy(() => ArticleFindManyArgsSchema)]).optional(),
  savedArticles: z.union([z.boolean(),z.lazy(() => SavedArticleFindManyArgsSchema)]).optional(),
  tags: z.union([z.boolean(),z.lazy(() => TagFindManyArgsSchema)]).optional(),
  comments: z.union([z.boolean(),z.lazy(() => CommentFindManyArgsSchema)]).optional(),
  reactions: z.union([z.boolean(),z.lazy(() => ReactionFindManyArgsSchema)]).optional(),
  views: z.union([z.boolean(),z.lazy(() => ViewFindManyArgsSchema)]).optional(),
  following: z.union([z.boolean(),z.lazy(() => FollowFindManyArgsSchema)]).optional(),
  followers: z.union([z.boolean(),z.lazy(() => FollowFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const UserArgsSchema: z.ZodType<Prisma.UserDefaultArgs> = z.object({
  select: z.lazy(() => UserSelectSchema).optional(),
  include: z.lazy(() => UserIncludeSchema).optional(),
}).strict();

export const UserCountOutputTypeArgsSchema: z.ZodType<Prisma.UserCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => UserCountOutputTypeSelectSchema).nullish(),
}).strict();

export const UserCountOutputTypeSelectSchema: z.ZodType<Prisma.UserCountOutputTypeSelect> = z.object({
  articles: z.boolean().optional(),
  savedArticles: z.boolean().optional(),
  tags: z.boolean().optional(),
  comments: z.boolean().optional(),
  reactions: z.boolean().optional(),
  views: z.boolean().optional(),
  following: z.boolean().optional(),
  followers: z.boolean().optional(),
}).strict();

export const UserSelectSchema: z.ZodType<Prisma.UserSelect> = z.object({
  id: z.boolean().optional(),
  username: z.boolean().optional(),
  name: z.boolean().optional(),
  firstName: z.boolean().optional(),
  email: z.boolean().optional(),
  emailVerifiedAt: z.boolean().optional(),
  password: z.boolean().optional(),
  profileUrl: z.boolean().optional(),
  role: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  deletedAt: z.boolean().optional(),
  activationToken: z.union([z.boolean(),z.lazy(() => ActivationTokenArgsSchema)]).optional(),
  passwordResetToken: z.union([z.boolean(),z.lazy(() => PasswordResetTokenArgsSchema)]).optional(),
  articles: z.union([z.boolean(),z.lazy(() => ArticleFindManyArgsSchema)]).optional(),
  savedArticles: z.union([z.boolean(),z.lazy(() => SavedArticleFindManyArgsSchema)]).optional(),
  tags: z.union([z.boolean(),z.lazy(() => TagFindManyArgsSchema)]).optional(),
  comments: z.union([z.boolean(),z.lazy(() => CommentFindManyArgsSchema)]).optional(),
  reactions: z.union([z.boolean(),z.lazy(() => ReactionFindManyArgsSchema)]).optional(),
  views: z.union([z.boolean(),z.lazy(() => ViewFindManyArgsSchema)]).optional(),
  following: z.union([z.boolean(),z.lazy(() => FollowFindManyArgsSchema)]).optional(),
  followers: z.union([z.boolean(),z.lazy(() => FollowFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict()

// PASSWORD RESET TOKEN
//------------------------------------------------------

export const PasswordResetTokenIncludeSchema: z.ZodType<Prisma.PasswordResetTokenInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

export const PasswordResetTokenArgsSchema: z.ZodType<Prisma.PasswordResetTokenDefaultArgs> = z.object({
  select: z.lazy(() => PasswordResetTokenSelectSchema).optional(),
  include: z.lazy(() => PasswordResetTokenIncludeSchema).optional(),
}).strict();

export const PasswordResetTokenSelectSchema: z.ZodType<Prisma.PasswordResetTokenSelect> = z.object({
  token: z.boolean().optional(),
  expiresAt: z.boolean().optional(),
  userId: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

// ACTIVATION TOKEN
//------------------------------------------------------

export const ActivationTokenIncludeSchema: z.ZodType<Prisma.ActivationTokenInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

export const ActivationTokenArgsSchema: z.ZodType<Prisma.ActivationTokenDefaultArgs> = z.object({
  select: z.lazy(() => ActivationTokenSelectSchema).optional(),
  include: z.lazy(() => ActivationTokenIncludeSchema).optional(),
}).strict();

export const ActivationTokenSelectSchema: z.ZodType<Prisma.ActivationTokenSelect> = z.object({
  token: z.boolean().optional(),
  expiresAt: z.boolean().optional(),
  userId: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

// ARTICLE
//------------------------------------------------------

export const ArticleIncludeSchema: z.ZodType<Prisma.ArticleInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  tags: z.union([z.boolean(),z.lazy(() => TagFindManyArgsSchema)]).optional(),
  savedArticles: z.union([z.boolean(),z.lazy(() => SavedArticleFindManyArgsSchema)]).optional(),
  comments: z.union([z.boolean(),z.lazy(() => CommentFindManyArgsSchema)]).optional(),
  reactions: z.union([z.boolean(),z.lazy(() => ReactionFindManyArgsSchema)]).optional(),
  views: z.union([z.boolean(),z.lazy(() => ViewFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ArticleCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const ArticleArgsSchema: z.ZodType<Prisma.ArticleDefaultArgs> = z.object({
  select: z.lazy(() => ArticleSelectSchema).optional(),
  include: z.lazy(() => ArticleIncludeSchema).optional(),
}).strict();

export const ArticleCountOutputTypeArgsSchema: z.ZodType<Prisma.ArticleCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => ArticleCountOutputTypeSelectSchema).nullish(),
}).strict();

export const ArticleCountOutputTypeSelectSchema: z.ZodType<Prisma.ArticleCountOutputTypeSelect> = z.object({
  tags: z.boolean().optional(),
  savedArticles: z.boolean().optional(),
  comments: z.boolean().optional(),
  reactions: z.boolean().optional(),
  views: z.boolean().optional(),
}).strict();

export const ArticleSelectSchema: z.ZodType<Prisma.ArticleSelect> = z.object({
  id: z.boolean().optional(),
  title: z.boolean().optional(),
  slug: z.boolean().optional(),
  userId: z.boolean().optional(),
  summary: z.boolean().optional(),
  coverUrl: z.boolean().optional(),
  content: z.boolean().optional(),
  isVisible: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  deletedAt: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  tags: z.union([z.boolean(),z.lazy(() => TagFindManyArgsSchema)]).optional(),
  savedArticles: z.union([z.boolean(),z.lazy(() => SavedArticleFindManyArgsSchema)]).optional(),
  comments: z.union([z.boolean(),z.lazy(() => CommentFindManyArgsSchema)]).optional(),
  reactions: z.union([z.boolean(),z.lazy(() => ReactionFindManyArgsSchema)]).optional(),
  views: z.union([z.boolean(),z.lazy(() => ViewFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ArticleCountOutputTypeArgsSchema)]).optional(),
}).strict()

// SAVED ARTICLE
//------------------------------------------------------

export const SavedArticleIncludeSchema: z.ZodType<Prisma.SavedArticleInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  article: z.union([z.boolean(),z.lazy(() => ArticleArgsSchema)]).optional(),
}).strict()

export const SavedArticleArgsSchema: z.ZodType<Prisma.SavedArticleDefaultArgs> = z.object({
  select: z.lazy(() => SavedArticleSelectSchema).optional(),
  include: z.lazy(() => SavedArticleIncludeSchema).optional(),
}).strict();

export const SavedArticleSelectSchema: z.ZodType<Prisma.SavedArticleSelect> = z.object({
  articleId: z.boolean().optional(),
  userId: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  article: z.union([z.boolean(),z.lazy(() => ArticleArgsSchema)]).optional(),
}).strict()

// TAG
//------------------------------------------------------

export const TagIncludeSchema: z.ZodType<Prisma.TagInclude> = z.object({
  articles: z.union([z.boolean(),z.lazy(() => ArticleFindManyArgsSchema)]).optional(),
  users: z.union([z.boolean(),z.lazy(() => UserFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => TagCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const TagArgsSchema: z.ZodType<Prisma.TagDefaultArgs> = z.object({
  select: z.lazy(() => TagSelectSchema).optional(),
  include: z.lazy(() => TagIncludeSchema).optional(),
}).strict();

export const TagCountOutputTypeArgsSchema: z.ZodType<Prisma.TagCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => TagCountOutputTypeSelectSchema).nullish(),
}).strict();

export const TagCountOutputTypeSelectSchema: z.ZodType<Prisma.TagCountOutputTypeSelect> = z.object({
  articles: z.boolean().optional(),
  users: z.boolean().optional(),
}).strict();

export const TagSelectSchema: z.ZodType<Prisma.TagSelect> = z.object({
  id: z.boolean().optional(),
  value: z.boolean().optional(),
  articles: z.union([z.boolean(),z.lazy(() => ArticleFindManyArgsSchema)]).optional(),
  users: z.union([z.boolean(),z.lazy(() => UserFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => TagCountOutputTypeArgsSchema)]).optional(),
}).strict()

// COMMENT
//------------------------------------------------------

export const CommentIncludeSchema: z.ZodType<Prisma.CommentInclude> = z.object({
  parent: z.union([z.boolean(),z.lazy(() => CommentArgsSchema)]).optional(),
  replies: z.union([z.boolean(),z.lazy(() => CommentFindManyArgsSchema)]).optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  article: z.union([z.boolean(),z.lazy(() => ArticleArgsSchema)]).optional(),
  reactions: z.union([z.boolean(),z.lazy(() => ReactionFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => CommentCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const CommentArgsSchema: z.ZodType<Prisma.CommentDefaultArgs> = z.object({
  select: z.lazy(() => CommentSelectSchema).optional(),
  include: z.lazy(() => CommentIncludeSchema).optional(),
}).strict();

export const CommentCountOutputTypeArgsSchema: z.ZodType<Prisma.CommentCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => CommentCountOutputTypeSelectSchema).nullish(),
}).strict();

export const CommentCountOutputTypeSelectSchema: z.ZodType<Prisma.CommentCountOutputTypeSelect> = z.object({
  replies: z.boolean().optional(),
  reactions: z.boolean().optional(),
}).strict();

export const CommentSelectSchema: z.ZodType<Prisma.CommentSelect> = z.object({
  id: z.boolean().optional(),
  content: z.boolean().optional(),
  parentId: z.boolean().optional(),
  userId: z.boolean().optional(),
  articleId: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  deletedAt: z.boolean().optional(),
  parent: z.union([z.boolean(),z.lazy(() => CommentArgsSchema)]).optional(),
  replies: z.union([z.boolean(),z.lazy(() => CommentFindManyArgsSchema)]).optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  article: z.union([z.boolean(),z.lazy(() => ArticleArgsSchema)]).optional(),
  reactions: z.union([z.boolean(),z.lazy(() => ReactionFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => CommentCountOutputTypeArgsSchema)]).optional(),
}).strict()

// REACTION
//------------------------------------------------------

export const ReactionIncludeSchema: z.ZodType<Prisma.ReactionInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  article: z.union([z.boolean(),z.lazy(() => ArticleArgsSchema)]).optional(),
  comment: z.union([z.boolean(),z.lazy(() => CommentArgsSchema)]).optional(),
}).strict()

export const ReactionArgsSchema: z.ZodType<Prisma.ReactionDefaultArgs> = z.object({
  select: z.lazy(() => ReactionSelectSchema).optional(),
  include: z.lazy(() => ReactionIncludeSchema).optional(),
}).strict();

export const ReactionSelectSchema: z.ZodType<Prisma.ReactionSelect> = z.object({
  id: z.boolean().optional(),
  type: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  userId: z.boolean().optional(),
  articleId: z.boolean().optional(),
  commentId: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  article: z.union([z.boolean(),z.lazy(() => ArticleArgsSchema)]).optional(),
  comment: z.union([z.boolean(),z.lazy(() => CommentArgsSchema)]).optional(),
}).strict()

// VIEW
//------------------------------------------------------

export const ViewIncludeSchema: z.ZodType<Prisma.ViewInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  article: z.union([z.boolean(),z.lazy(() => ArticleArgsSchema)]).optional(),
}).strict()

export const ViewArgsSchema: z.ZodType<Prisma.ViewDefaultArgs> = z.object({
  select: z.lazy(() => ViewSelectSchema).optional(),
  include: z.lazy(() => ViewIncludeSchema).optional(),
}).strict();

export const ViewSelectSchema: z.ZodType<Prisma.ViewSelect> = z.object({
  id: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  userId: z.boolean().optional(),
  articleId: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  article: z.union([z.boolean(),z.lazy(() => ArticleArgsSchema)]).optional(),
}).strict()

// FOLLOW
//------------------------------------------------------

export const FollowIncludeSchema: z.ZodType<Prisma.FollowInclude> = z.object({
  follower: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  following: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

export const FollowArgsSchema: z.ZodType<Prisma.FollowDefaultArgs> = z.object({
  select: z.lazy(() => FollowSelectSchema).optional(),
  include: z.lazy(() => FollowIncludeSchema).optional(),
}).strict();

export const FollowSelectSchema: z.ZodType<Prisma.FollowSelect> = z.object({
  id: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  followerId: z.boolean().optional(),
  followingId: z.boolean().optional(),
  follower: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  following: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()


/////////////////////////////////////////
// INPUT TYPES
/////////////////////////////////////////

export const UserWhereInputSchema: z.ZodType<Prisma.UserWhereInput> = z.object({
  AND: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  username: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  firstName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  // email: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  // emailVerifiedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  // password: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  profileUrl: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  // role: z.union([ z.lazy(() => EnumRoleFilterSchema),z.lazy(() => RoleSchema) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  // activationToken: z.union([ z.lazy(() => ActivationTokenNullableRelationFilterSchema),z.lazy(() => ActivationTokenWhereInputSchema) ]).optional().nullable(),
  // passwordResetToken: z.union([ z.lazy(() => PasswordResetTokenNullableRelationFilterSchema),z.lazy(() => PasswordResetTokenWhereInputSchema) ]).optional().nullable(),
  articles: z.lazy(() => ArticleListRelationFilterSchema).optional(),
  // savedArticles: z.lazy(() => SavedArticleListRelationFilterSchema).optional(),
  // tags: z.lazy(() => TagListRelationFilterSchema).optional(),
  comments: z.lazy(() => CommentListRelationFilterSchema).optional(),
  reactions: z.lazy(() => ReactionListRelationFilterSchema).optional(),
  // views: z.lazy(() => ViewListRelationFilterSchema).optional(),
  following: z.lazy(() => FollowListRelationFilterSchema).optional(),
  followers: z.lazy(() => FollowListRelationFilterSchema).optional()
}).strict();

export const UserOrderByWithRelationInputSchema: z.ZodType<Prisma.UserOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  username: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.lazy(() => SortOrderSchema).optional(),
  // email: z.lazy(() => SortOrderSchema).optional(),
  // emailVerifiedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  // password: z.lazy(() => SortOrderSchema).optional(),
  profileUrl: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  // role: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  // activationToken: z.lazy(() => ActivationTokenOrderByWithRelationInputSchema).optional(),
  // passwordResetToken: z.lazy(() => PasswordResetTokenOrderByWithRelationInputSchema).optional(),
  articles: z.lazy(() => ArticleOrderByRelationAggregateInputSchema).optional(),
  // savedArticles: z.lazy(() => SavedArticleOrderByRelationAggregateInputSchema).optional(),
  // tags: z.lazy(() => TagOrderByRelationAggregateInputSchema).optional(),
  comments: z.lazy(() => CommentOrderByRelationAggregateInputSchema).optional(),
  reactions: z.lazy(() => ReactionOrderByRelationAggregateInputSchema).optional(),
  // views: z.lazy(() => ViewOrderByRelationAggregateInputSchema).optional(),
  following: z.lazy(() => FollowOrderByRelationAggregateInputSchema).optional(),
  followers: z.lazy(() => FollowOrderByRelationAggregateInputSchema).optional()
}).strict();

export const UserWhereUniqueInputSchema: z.ZodType<Prisma.UserWhereUniqueInput> = z.union([
  z.object({
    id: z.number().int(),
    username: z.string(),
    email: z.string()
  }),
  z.object({
    id: z.number().int(),
    username: z.string(),
  }),
  z.object({
    id: z.number().int(),
    email: z.string(),
  }),
  z.object({
    id: z.number().int(),
  }),
  z.object({
    username: z.string(),
    email: z.string(),
  }),
  z.object({
    username: z.string(),
  }),
  z.object({
    email: z.string(),
  }),
])
.and(z.object({
  id: z.number().int().optional(),
  username: z.string().optional(),
  email: z.string().optional(),
  AND: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  firstName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  emailVerifiedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  password: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  profileUrl: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  role: z.union([ z.lazy(() => EnumRoleFilterSchema),z.lazy(() => RoleSchema) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  activationToken: z.union([ z.lazy(() => ActivationTokenNullableRelationFilterSchema),z.lazy(() => ActivationTokenWhereInputSchema) ]).optional().nullable(),
  passwordResetToken: z.union([ z.lazy(() => PasswordResetTokenNullableRelationFilterSchema),z.lazy(() => PasswordResetTokenWhereInputSchema) ]).optional().nullable(),
  articles: z.lazy(() => ArticleListRelationFilterSchema).optional(),
  savedArticles: z.lazy(() => SavedArticleListRelationFilterSchema).optional(),
  tags: z.lazy(() => TagListRelationFilterSchema).optional(),
  comments: z.lazy(() => CommentListRelationFilterSchema).optional(),
  reactions: z.lazy(() => ReactionListRelationFilterSchema).optional(),
  views: z.lazy(() => ViewListRelationFilterSchema).optional(),
  following: z.lazy(() => FollowListRelationFilterSchema).optional(),
  followers: z.lazy(() => FollowListRelationFilterSchema).optional()
}).strict());

export const UserOrderByWithAggregationInputSchema: z.ZodType<Prisma.UserOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  username: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  emailVerifiedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  profileUrl: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => UserCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => UserAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => UserMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => UserMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => UserSumOrderByAggregateInputSchema).optional()
}).strict();

export const UserScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.UserScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema),z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema),z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  username: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  firstName: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  emailVerifiedAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  password: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  profileUrl: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  role: z.union([ z.lazy(() => EnumRoleWithAggregatesFilterSchema),z.lazy(() => RoleSchema) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
}).strict();

export const PasswordResetTokenWhereInputSchema: z.ZodType<Prisma.PasswordResetTokenWhereInput> = z.object({
  AND: z.union([ z.lazy(() => PasswordResetTokenWhereInputSchema),z.lazy(() => PasswordResetTokenWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PasswordResetTokenWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PasswordResetTokenWhereInputSchema),z.lazy(() => PasswordResetTokenWhereInputSchema).array() ]).optional(),
  token: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  expiresAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  userId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict();

export const PasswordResetTokenOrderByWithRelationInputSchema: z.ZodType<Prisma.PasswordResetTokenOrderByWithRelationInput> = z.object({
  token: z.lazy(() => SortOrderSchema).optional(),
  expiresAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional()
}).strict();

export const PasswordResetTokenWhereUniqueInputSchema: z.ZodType<Prisma.PasswordResetTokenWhereUniqueInput> = z.union([
  z.object({
    token: z.string(),
    userId: z.number().int()
  }),
  z.object({
    token: z.string(),
  }),
  z.object({
    userId: z.number().int(),
  }),
])
.and(z.object({
  token: z.string().optional(),
  userId: z.number().int().optional(),
  AND: z.union([ z.lazy(() => PasswordResetTokenWhereInputSchema),z.lazy(() => PasswordResetTokenWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PasswordResetTokenWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PasswordResetTokenWhereInputSchema),z.lazy(() => PasswordResetTokenWhereInputSchema).array() ]).optional(),
  expiresAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict());

export const PasswordResetTokenOrderByWithAggregationInputSchema: z.ZodType<Prisma.PasswordResetTokenOrderByWithAggregationInput> = z.object({
  token: z.lazy(() => SortOrderSchema).optional(),
  expiresAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => PasswordResetTokenCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => PasswordResetTokenAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => PasswordResetTokenMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => PasswordResetTokenMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => PasswordResetTokenSumOrderByAggregateInputSchema).optional()
}).strict();

export const PasswordResetTokenScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.PasswordResetTokenScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => PasswordResetTokenScalarWhereWithAggregatesInputSchema),z.lazy(() => PasswordResetTokenScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => PasswordResetTokenScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PasswordResetTokenScalarWhereWithAggregatesInputSchema),z.lazy(() => PasswordResetTokenScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  token: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  expiresAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  userId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
}).strict();

export const ActivationTokenWhereInputSchema: z.ZodType<Prisma.ActivationTokenWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ActivationTokenWhereInputSchema),z.lazy(() => ActivationTokenWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ActivationTokenWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ActivationTokenWhereInputSchema),z.lazy(() => ActivationTokenWhereInputSchema).array() ]).optional(),
  token: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  expiresAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  userId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict();

export const ActivationTokenOrderByWithRelationInputSchema: z.ZodType<Prisma.ActivationTokenOrderByWithRelationInput> = z.object({
  token: z.lazy(() => SortOrderSchema).optional(),
  expiresAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional()
}).strict();

export const ActivationTokenWhereUniqueInputSchema: z.ZodType<Prisma.ActivationTokenWhereUniqueInput> = z.union([
  z.object({
    token: z.string(),
    userId: z.number().int()
  }),
  z.object({
    token: z.string(),
  }),
  z.object({
    userId: z.number().int(),
  }),
])
.and(z.object({
  token: z.string().optional(),
  userId: z.number().int().optional(),
  AND: z.union([ z.lazy(() => ActivationTokenWhereInputSchema),z.lazy(() => ActivationTokenWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ActivationTokenWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ActivationTokenWhereInputSchema),z.lazy(() => ActivationTokenWhereInputSchema).array() ]).optional(),
  expiresAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict());

export const ActivationTokenOrderByWithAggregationInputSchema: z.ZodType<Prisma.ActivationTokenOrderByWithAggregationInput> = z.object({
  token: z.lazy(() => SortOrderSchema).optional(),
  expiresAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ActivationTokenCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => ActivationTokenAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ActivationTokenMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ActivationTokenMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => ActivationTokenSumOrderByAggregateInputSchema).optional()
}).strict();

export const ActivationTokenScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ActivationTokenScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ActivationTokenScalarWhereWithAggregatesInputSchema),z.lazy(() => ActivationTokenScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ActivationTokenScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ActivationTokenScalarWhereWithAggregatesInputSchema),z.lazy(() => ActivationTokenScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  token: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  expiresAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  userId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
}).strict();

export const ArticleWhereInputSchema: z.ZodType<Prisma.ArticleWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ArticleWhereInputSchema),z.lazy(() => ArticleWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ArticleWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ArticleWhereInputSchema),z.lazy(() => ArticleWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  slug: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  summary: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  coverUrl: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  content: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  // isVisible: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  tags: z.lazy(() => TagListRelationFilterSchema).optional(),
  // savedArticles: z.lazy(() => SavedArticleListRelationFilterSchema).optional(),
  comments: z.lazy(() => CommentListRelationFilterSchema).optional(),
  reactions: z.lazy(() => ReactionListRelationFilterSchema).optional(),
  views: z.lazy(() => ViewListRelationFilterSchema).optional()
}).strict();

export const ArticleOrderByWithRelationInputSchema: z.ZodType<Prisma.ArticleOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  slug: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  summary: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  coverUrl: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  content: z.lazy(() => SortOrderSchema).optional(),
  // isVisible: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  tags: z.lazy(() => TagOrderByRelationAggregateInputSchema).optional(),
  // savedArticles: z.lazy(() => SavedArticleOrderByRelationAggregateInputSchema).optional(),
  comments: z.lazy(() => CommentOrderByRelationAggregateInputSchema).optional(),
  reactions: z.lazy(() => ReactionOrderByRelationAggregateInputSchema).optional(),
  views: z.lazy(() => ViewOrderByRelationAggregateInputSchema).optional()
}).strict();

export const ArticleWhereUniqueInputSchema: z.ZodType<Prisma.ArticleWhereUniqueInput> = z.object({
  id: z.string()
})
.and(z.object({
  id: z.string().optional(),
  AND: z.union([ z.lazy(() => ArticleWhereInputSchema),z.lazy(() => ArticleWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ArticleWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ArticleWhereInputSchema),z.lazy(() => ArticleWhereInputSchema).array() ]).optional(),
  title: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  slug: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  summary: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  coverUrl: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  content: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  isVisible: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  tags: z.lazy(() => TagListRelationFilterSchema).optional(),
  savedArticles: z.lazy(() => SavedArticleListRelationFilterSchema).optional(),
  comments: z.lazy(() => CommentListRelationFilterSchema).optional(),
  reactions: z.lazy(() => ReactionListRelationFilterSchema).optional(),
  views: z.lazy(() => ViewListRelationFilterSchema).optional()
}).strict());

export const ArticleOrderByWithAggregationInputSchema: z.ZodType<Prisma.ArticleOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  slug: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  summary: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  coverUrl: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  content: z.lazy(() => SortOrderSchema).optional(),
  isVisible: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => ArticleCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => ArticleAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ArticleMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ArticleMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => ArticleSumOrderByAggregateInputSchema).optional()
}).strict();

export const ArticleScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ArticleScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ArticleScalarWhereWithAggregatesInputSchema),z.lazy(() => ArticleScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ArticleScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ArticleScalarWhereWithAggregatesInputSchema),z.lazy(() => ArticleScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  slug: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  summary: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  coverUrl: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  content: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  isVisible: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
}).strict();

export const SavedArticleWhereInputSchema: z.ZodType<Prisma.SavedArticleWhereInput> = z.object({
  AND: z.union([ z.lazy(() => SavedArticleWhereInputSchema),z.lazy(() => SavedArticleWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => SavedArticleWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SavedArticleWhereInputSchema),z.lazy(() => SavedArticleWhereInputSchema).array() ]).optional(),
  articleId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  // userId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  // user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  // article: z.union([ z.lazy(() => ArticleRelationFilterSchema),z.lazy(() => ArticleWhereInputSchema) ]).optional(),
}).strict();

export const SavedArticleOrderByWithRelationInputSchema: z.ZodType<Prisma.SavedArticleOrderByWithRelationInput> = z.object({
  articleId: z.lazy(() => SortOrderSchema).optional(),
  // userId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  // user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  // article: z.lazy(() => ArticleOrderByWithRelationInputSchema).optional()
}).strict();

export const SavedArticleWhereUniqueInputSchema: z.ZodType<Prisma.SavedArticleWhereUniqueInput> = z.object({
  userId_articleId: z.lazy(() => SavedArticleUserIdArticleIdCompoundUniqueInputSchema)
})
.and(z.object({
  userId_articleId: z.lazy(() => SavedArticleUserIdArticleIdCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => SavedArticleWhereInputSchema),z.lazy(() => SavedArticleWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => SavedArticleWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SavedArticleWhereInputSchema),z.lazy(() => SavedArticleWhereInputSchema).array() ]).optional(),
  articleId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  article: z.union([ z.lazy(() => ArticleRelationFilterSchema),z.lazy(() => ArticleWhereInputSchema) ]).optional(),
}).strict());

export const SavedArticleOrderByWithAggregationInputSchema: z.ZodType<Prisma.SavedArticleOrderByWithAggregationInput> = z.object({
  articleId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => SavedArticleCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => SavedArticleAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => SavedArticleMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => SavedArticleMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => SavedArticleSumOrderByAggregateInputSchema).optional()
}).strict();

export const SavedArticleScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.SavedArticleScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => SavedArticleScalarWhereWithAggregatesInputSchema),z.lazy(() => SavedArticleScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => SavedArticleScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SavedArticleScalarWhereWithAggregatesInputSchema),z.lazy(() => SavedArticleScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  articleId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const TagWhereInputSchema: z.ZodType<Prisma.TagWhereInput> = z.object({
  AND: z.union([ z.lazy(() => TagWhereInputSchema),z.lazy(() => TagWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TagWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TagWhereInputSchema),z.lazy(() => TagWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  value: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  articles: z.lazy(() => ArticleListRelationFilterSchema).optional(),
  users: z.lazy(() => UserListRelationFilterSchema).optional()
}).strict();

export const TagOrderByWithRelationInputSchema: z.ZodType<Prisma.TagOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  articles: z.lazy(() => ArticleOrderByRelationAggregateInputSchema).optional(),
  users: z.lazy(() => UserOrderByRelationAggregateInputSchema).optional()
}).strict();

export const TagWhereUniqueInputSchema: z.ZodType<Prisma.TagWhereUniqueInput> = z.union([
  z.object({
    id: z.number().int(),
    value: z.string()
  }),
  z.object({
    id: z.number().int(),
  }),
  z.object({
    value: z.string(),
  }),
])
.and(z.object({
  id: z.number().int().optional(),
  value: z.string().optional(),
  AND: z.union([ z.lazy(() => TagWhereInputSchema),z.lazy(() => TagWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TagWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TagWhereInputSchema),z.lazy(() => TagWhereInputSchema).array() ]).optional(),
  articles: z.lazy(() => ArticleListRelationFilterSchema).optional(),
  users: z.lazy(() => UserListRelationFilterSchema).optional()
}).strict());

export const TagOrderByWithAggregationInputSchema: z.ZodType<Prisma.TagOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => TagCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => TagAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => TagMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => TagMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => TagSumOrderByAggregateInputSchema).optional()
}).strict();

export const TagScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.TagScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => TagScalarWhereWithAggregatesInputSchema),z.lazy(() => TagScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => TagScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TagScalarWhereWithAggregatesInputSchema),z.lazy(() => TagScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  value: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const CommentWhereInputSchema: z.ZodType<Prisma.CommentWhereInput> = z.object({
  AND: z.union([ z.lazy(() => CommentWhereInputSchema),z.lazy(() => CommentWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CommentWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CommentWhereInputSchema),z.lazy(() => CommentWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  content: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  parentId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  userId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  articleId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  parent: z.union([ z.lazy(() => CommentNullableRelationFilterSchema),z.lazy(() => CommentWhereInputSchema) ]).optional().nullable(),
  replies: z.lazy(() => CommentListRelationFilterSchema).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  article: z.union([ z.lazy(() => ArticleRelationFilterSchema),z.lazy(() => ArticleWhereInputSchema) ]).optional(),
  reactions: z.lazy(() => ReactionListRelationFilterSchema).optional()
}).strict();

export const CommentOrderByWithRelationInputSchema: z.ZodType<Prisma.CommentOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  content: z.lazy(() => SortOrderSchema).optional(),
  parentId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  articleId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  parent: z.lazy(() => CommentOrderByWithRelationInputSchema).optional(),
  replies: z.lazy(() => CommentOrderByRelationAggregateInputSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  article: z.lazy(() => ArticleOrderByWithRelationInputSchema).optional(),
  reactions: z.lazy(() => ReactionOrderByRelationAggregateInputSchema).optional()
}).strict();

export const CommentWhereUniqueInputSchema: z.ZodType<Prisma.CommentWhereUniqueInput> = z.object({
  id: z.string()
})
.and(z.object({
  id: z.string().optional(),
  AND: z.union([ z.lazy(() => CommentWhereInputSchema),z.lazy(() => CommentWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CommentWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CommentWhereInputSchema),z.lazy(() => CommentWhereInputSchema).array() ]).optional(),
  content: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  parentId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  userId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  articleId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  parent: z.union([ z.lazy(() => CommentNullableRelationFilterSchema),z.lazy(() => CommentWhereInputSchema) ]).optional().nullable(),
  replies: z.lazy(() => CommentListRelationFilterSchema).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  article: z.union([ z.lazy(() => ArticleRelationFilterSchema),z.lazy(() => ArticleWhereInputSchema) ]).optional(),
  reactions: z.lazy(() => ReactionListRelationFilterSchema).optional()
}).strict());

export const CommentOrderByWithAggregationInputSchema: z.ZodType<Prisma.CommentOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  content: z.lazy(() => SortOrderSchema).optional(),
  parentId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  articleId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => CommentCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => CommentAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => CommentMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => CommentMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => CommentSumOrderByAggregateInputSchema).optional()
}).strict();

export const CommentScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.CommentScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => CommentScalarWhereWithAggregatesInputSchema),z.lazy(() => CommentScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => CommentScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CommentScalarWhereWithAggregatesInputSchema),z.lazy(() => CommentScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  content: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  parentId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  userId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  articleId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
}).strict();

export const ReactionWhereInputSchema: z.ZodType<Prisma.ReactionWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ReactionWhereInputSchema),z.lazy(() => ReactionWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ReactionWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ReactionWhereInputSchema),z.lazy(() => ReactionWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  type: z.union([ z.lazy(() => EnumReactionTypeFilterSchema),z.lazy(() => ReactionTypeSchema) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  userId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  articleId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  commentId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  article: z.union([ z.lazy(() => ArticleNullableRelationFilterSchema),z.lazy(() => ArticleWhereInputSchema) ]).optional().nullable(),
  comment: z.union([ z.lazy(() => CommentNullableRelationFilterSchema),z.lazy(() => CommentWhereInputSchema) ]).optional().nullable(),
}).strict();

export const ReactionOrderByWithRelationInputSchema: z.ZodType<Prisma.ReactionOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  articleId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  commentId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  article: z.lazy(() => ArticleOrderByWithRelationInputSchema).optional(),
  comment: z.lazy(() => CommentOrderByWithRelationInputSchema).optional()
}).strict();

export const ReactionWhereUniqueInputSchema: z.ZodType<Prisma.ReactionWhereUniqueInput> = z.union([
  z.object({
    id: z.number().int(),
    userId_articleId: z.lazy(() => ReactionUserIdArticleIdCompoundUniqueInputSchema),
    userId_commentId: z.lazy(() => ReactionUserIdCommentIdCompoundUniqueInputSchema)
  }),
  z.object({
    id: z.number().int(),
    userId_articleId: z.lazy(() => ReactionUserIdArticleIdCompoundUniqueInputSchema),
  }),
  z.object({
    id: z.number().int(),
    userId_commentId: z.lazy(() => ReactionUserIdCommentIdCompoundUniqueInputSchema),
  }),
  z.object({
    id: z.number().int(),
  }),
  z.object({
    userId_articleId: z.lazy(() => ReactionUserIdArticleIdCompoundUniqueInputSchema),
    userId_commentId: z.lazy(() => ReactionUserIdCommentIdCompoundUniqueInputSchema),
  }),
  z.object({
    userId_articleId: z.lazy(() => ReactionUserIdArticleIdCompoundUniqueInputSchema),
  }),
  z.object({
    userId_commentId: z.lazy(() => ReactionUserIdCommentIdCompoundUniqueInputSchema),
  }),
])
.and(z.object({
  id: z.number().int().optional(),
  userId_articleId: z.lazy(() => ReactionUserIdArticleIdCompoundUniqueInputSchema).optional(),
  userId_commentId: z.lazy(() => ReactionUserIdCommentIdCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => ReactionWhereInputSchema),z.lazy(() => ReactionWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ReactionWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ReactionWhereInputSchema),z.lazy(() => ReactionWhereInputSchema).array() ]).optional(),
  type: z.union([ z.lazy(() => EnumReactionTypeFilterSchema),z.lazy(() => ReactionTypeSchema) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  userId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  articleId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  commentId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  article: z.union([ z.lazy(() => ArticleNullableRelationFilterSchema),z.lazy(() => ArticleWhereInputSchema) ]).optional().nullable(),
  comment: z.union([ z.lazy(() => CommentNullableRelationFilterSchema),z.lazy(() => CommentWhereInputSchema) ]).optional().nullable(),
}).strict());

export const ReactionOrderByWithAggregationInputSchema: z.ZodType<Prisma.ReactionOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  articleId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  commentId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => ReactionCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => ReactionAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ReactionMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ReactionMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => ReactionSumOrderByAggregateInputSchema).optional()
}).strict();

export const ReactionScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ReactionScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ReactionScalarWhereWithAggregatesInputSchema),z.lazy(() => ReactionScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ReactionScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ReactionScalarWhereWithAggregatesInputSchema),z.lazy(() => ReactionScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  type: z.union([ z.lazy(() => EnumReactionTypeWithAggregatesFilterSchema),z.lazy(() => ReactionTypeSchema) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  userId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  articleId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  commentId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
}).strict();

export const ViewWhereInputSchema: z.ZodType<Prisma.ViewWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ViewWhereInputSchema),z.lazy(() => ViewWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ViewWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ViewWhereInputSchema),z.lazy(() => ViewWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  userId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  articleId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  article: z.union([ z.lazy(() => ArticleRelationFilterSchema),z.lazy(() => ArticleWhereInputSchema) ]).optional(),
}).strict();

export const ViewOrderByWithRelationInputSchema: z.ZodType<Prisma.ViewOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  articleId: z.lazy(() => SortOrderSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  article: z.lazy(() => ArticleOrderByWithRelationInputSchema).optional()
}).strict();

export const ViewWhereUniqueInputSchema: z.ZodType<Prisma.ViewWhereUniqueInput> = z.object({
  id: z.number().int()
})
.and(z.object({
  id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => ViewWhereInputSchema),z.lazy(() => ViewWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ViewWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ViewWhereInputSchema),z.lazy(() => ViewWhereInputSchema).array() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  userId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  articleId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  article: z.union([ z.lazy(() => ArticleRelationFilterSchema),z.lazy(() => ArticleWhereInputSchema) ]).optional(),
}).strict());

export const ViewOrderByWithAggregationInputSchema: z.ZodType<Prisma.ViewOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  articleId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ViewCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => ViewAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ViewMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ViewMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => ViewSumOrderByAggregateInputSchema).optional()
}).strict();

export const ViewScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ViewScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ViewScalarWhereWithAggregatesInputSchema),z.lazy(() => ViewScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ViewScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ViewScalarWhereWithAggregatesInputSchema),z.lazy(() => ViewScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  userId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  articleId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const FollowWhereInputSchema: z.ZodType<Prisma.FollowWhereInput> = z.object({
  AND: z.union([ z.lazy(() => FollowWhereInputSchema),z.lazy(() => FollowWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => FollowWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => FollowWhereInputSchema),z.lazy(() => FollowWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  followerId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  followingId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  follower: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  following: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict();

export const FollowOrderByWithRelationInputSchema: z.ZodType<Prisma.FollowOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  followerId: z.lazy(() => SortOrderSchema).optional(),
  followingId: z.lazy(() => SortOrderSchema).optional(),
  follower: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  following: z.lazy(() => UserOrderByWithRelationInputSchema).optional()
}).strict();

export const FollowWhereUniqueInputSchema: z.ZodType<Prisma.FollowWhereUniqueInput> = z.union([
  z.object({
    id: z.number().int(),
    followerId_followingId: z.lazy(() => FollowFollowerIdFollowingIdCompoundUniqueInputSchema)
  }),
  z.object({
    id: z.number().int(),
  }),
  z.object({
    followerId_followingId: z.lazy(() => FollowFollowerIdFollowingIdCompoundUniqueInputSchema),
  }),
])
.and(z.object({
  id: z.number().int().optional(),
  followerId_followingId: z.lazy(() => FollowFollowerIdFollowingIdCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => FollowWhereInputSchema),z.lazy(() => FollowWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => FollowWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => FollowWhereInputSchema),z.lazy(() => FollowWhereInputSchema).array() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  followerId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  followingId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  follower: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  following: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict());

export const FollowOrderByWithAggregationInputSchema: z.ZodType<Prisma.FollowOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  followerId: z.lazy(() => SortOrderSchema).optional(),
  followingId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => FollowCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => FollowAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => FollowMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => FollowMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => FollowSumOrderByAggregateInputSchema).optional()
}).strict();

export const FollowScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.FollowScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => FollowScalarWhereWithAggregatesInputSchema),z.lazy(() => FollowScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => FollowScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => FollowScalarWhereWithAggregatesInputSchema),z.lazy(() => FollowScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  followerId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  followingId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
}).strict();

export const UserCreateInputSchema: z.ZodType<Prisma.UserCreateInput> = z.object({
  username: z.string(),
  name: z.string(),
  firstName: z.string(),
  email: z.string(),
  emailVerifiedAt: z.coerce.date().optional().nullable(),
  password: z.string(),
  profileUrl: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  activationToken: z.lazy(() => ActivationTokenCreateNestedOneWithoutUserInputSchema).optional(),
  passwordResetToken: z.lazy(() => PasswordResetTokenCreateNestedOneWithoutUserInputSchema).optional(),
  articles: z.lazy(() => ArticleCreateNestedManyWithoutUserInputSchema).optional(),
  savedArticles: z.lazy(() => SavedArticleCreateNestedManyWithoutUserInputSchema).optional(),
  tags: z.lazy(() => TagCreateNestedManyWithoutUsersInputSchema).optional(),
  comments: z.lazy(() => CommentCreateNestedManyWithoutUserInputSchema).optional(),
  reactions: z.lazy(() => ReactionCreateNestedManyWithoutUserInputSchema).optional(),
  views: z.lazy(() => ViewCreateNestedManyWithoutUserInputSchema).optional(),
  following: z.lazy(() => FollowCreateNestedManyWithoutFollowerInputSchema).optional(),
  followers: z.lazy(() => FollowCreateNestedManyWithoutFollowingInputSchema).optional()
}).strict();

export const UserUncheckedCreateInputSchema: z.ZodType<Prisma.UserUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  username: z.string(),
  name: z.string(),
  firstName: z.string(),
  email: z.string(),
  emailVerifiedAt: z.coerce.date().optional().nullable(),
  password: z.string(),
  profileUrl: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  activationToken: z.lazy(() => ActivationTokenUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
  passwordResetToken: z.lazy(() => PasswordResetTokenUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
  articles: z.lazy(() => ArticleUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  savedArticles: z.lazy(() => SavedArticleUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  tags: z.lazy(() => TagUncheckedCreateNestedManyWithoutUsersInputSchema).optional(),
  comments: z.lazy(() => CommentUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  reactions: z.lazy(() => ReactionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  views: z.lazy(() => ViewUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  following: z.lazy(() => FollowUncheckedCreateNestedManyWithoutFollowerInputSchema).optional(),
  followers: z.lazy(() => FollowUncheckedCreateNestedManyWithoutFollowingInputSchema).optional()
}).strict();

export const UserUpdateInputSchema: z.ZodType<Prisma.UserUpdateInput> = z.object({
  username: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerifiedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  profileUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  activationToken: z.lazy(() => ActivationTokenUpdateOneWithoutUserNestedInputSchema).optional(),
  passwordResetToken: z.lazy(() => PasswordResetTokenUpdateOneWithoutUserNestedInputSchema).optional(),
  articles: z.lazy(() => ArticleUpdateManyWithoutUserNestedInputSchema).optional(),
  savedArticles: z.lazy(() => SavedArticleUpdateManyWithoutUserNestedInputSchema).optional(),
  tags: z.lazy(() => TagUpdateManyWithoutUsersNestedInputSchema).optional(),
  comments: z.lazy(() => CommentUpdateManyWithoutUserNestedInputSchema).optional(),
  reactions: z.lazy(() => ReactionUpdateManyWithoutUserNestedInputSchema).optional(),
  views: z.lazy(() => ViewUpdateManyWithoutUserNestedInputSchema).optional(),
  following: z.lazy(() => FollowUpdateManyWithoutFollowerNestedInputSchema).optional(),
  followers: z.lazy(() => FollowUpdateManyWithoutFollowingNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateInputSchema: z.ZodType<Prisma.UserUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerifiedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  profileUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  activationToken: z.lazy(() => ActivationTokenUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
  passwordResetToken: z.lazy(() => PasswordResetTokenUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
  articles: z.lazy(() => ArticleUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  savedArticles: z.lazy(() => SavedArticleUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  tags: z.lazy(() => TagUncheckedUpdateManyWithoutUsersNestedInputSchema).optional(),
  comments: z.lazy(() => CommentUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  reactions: z.lazy(() => ReactionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  views: z.lazy(() => ViewUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  following: z.lazy(() => FollowUncheckedUpdateManyWithoutFollowerNestedInputSchema).optional(),
  followers: z.lazy(() => FollowUncheckedUpdateManyWithoutFollowingNestedInputSchema).optional()
}).strict();

export const UserCreateManyInputSchema: z.ZodType<Prisma.UserCreateManyInput> = z.object({
  id: z.number().int().optional(),
  username: z.string(),
  name: z.string(),
  firstName: z.string(),
  email: z.string(),
  emailVerifiedAt: z.coerce.date().optional().nullable(),
  password: z.string(),
  profileUrl: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const UserUpdateManyMutationInputSchema: z.ZodType<Prisma.UserUpdateManyMutationInput> = z.object({
  username: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerifiedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  profileUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const UserUncheckedUpdateManyInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerifiedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  profileUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const PasswordResetTokenCreateInputSchema: z.ZodType<Prisma.PasswordResetTokenCreateInput> = z.object({
  token: z.string(),
  expiresAt: z.coerce.date(),
  user: z.lazy(() => UserCreateNestedOneWithoutPasswordResetTokenInputSchema)
}).strict();

export const PasswordResetTokenUncheckedCreateInputSchema: z.ZodType<Prisma.PasswordResetTokenUncheckedCreateInput> = z.object({
  token: z.string(),
  expiresAt: z.coerce.date(),
  userId: z.number().int()
}).strict();

export const PasswordResetTokenUpdateInputSchema: z.ZodType<Prisma.PasswordResetTokenUpdateInput> = z.object({
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutPasswordResetTokenNestedInputSchema).optional()
}).strict();

export const PasswordResetTokenUncheckedUpdateInputSchema: z.ZodType<Prisma.PasswordResetTokenUncheckedUpdateInput> = z.object({
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PasswordResetTokenCreateManyInputSchema: z.ZodType<Prisma.PasswordResetTokenCreateManyInput> = z.object({
  token: z.string(),
  expiresAt: z.coerce.date(),
  userId: z.number().int()
}).strict();

export const PasswordResetTokenUpdateManyMutationInputSchema: z.ZodType<Prisma.PasswordResetTokenUpdateManyMutationInput> = z.object({
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PasswordResetTokenUncheckedUpdateManyInputSchema: z.ZodType<Prisma.PasswordResetTokenUncheckedUpdateManyInput> = z.object({
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ActivationTokenCreateInputSchema: z.ZodType<Prisma.ActivationTokenCreateInput> = z.object({
  token: z.string(),
  expiresAt: z.coerce.date(),
  user: z.lazy(() => UserCreateNestedOneWithoutActivationTokenInputSchema)
}).strict();

export const ActivationTokenUncheckedCreateInputSchema: z.ZodType<Prisma.ActivationTokenUncheckedCreateInput> = z.object({
  token: z.string(),
  expiresAt: z.coerce.date(),
  userId: z.number().int()
}).strict();

export const ActivationTokenUpdateInputSchema: z.ZodType<Prisma.ActivationTokenUpdateInput> = z.object({
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutActivationTokenNestedInputSchema).optional()
}).strict();

export const ActivationTokenUncheckedUpdateInputSchema: z.ZodType<Prisma.ActivationTokenUncheckedUpdateInput> = z.object({
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ActivationTokenCreateManyInputSchema: z.ZodType<Prisma.ActivationTokenCreateManyInput> = z.object({
  token: z.string(),
  expiresAt: z.coerce.date(),
  userId: z.number().int()
}).strict();

export const ActivationTokenUpdateManyMutationInputSchema: z.ZodType<Prisma.ActivationTokenUpdateManyMutationInput> = z.object({
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ActivationTokenUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ActivationTokenUncheckedUpdateManyInput> = z.object({
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ArticleCreateInputSchema: z.ZodType<Prisma.ArticleCreateInput> = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  summary: z.string().optional().nullable(),
  coverUrl: z.string().optional().nullable(),
  content: z.string(),
  isVisible: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  user: z.lazy(() => UserCreateNestedOneWithoutArticlesInputSchema),
  tags: z.lazy(() => TagCreateNestedManyWithoutArticlesInputSchema).optional(),
  savedArticles: z.lazy(() => SavedArticleCreateNestedManyWithoutArticleInputSchema).optional(),
  comments: z.lazy(() => CommentCreateNestedManyWithoutArticleInputSchema).optional(),
  reactions: z.lazy(() => ReactionCreateNestedManyWithoutArticleInputSchema).optional(),
  views: z.lazy(() => ViewCreateNestedManyWithoutArticleInputSchema).optional()
}).strict();

export const ArticleUncheckedCreateInputSchema: z.ZodType<Prisma.ArticleUncheckedCreateInput> = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  userId: z.number().int(),
  summary: z.string().optional().nullable(),
  coverUrl: z.string().optional().nullable(),
  content: z.string(),
  isVisible: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  tags: z.lazy(() => TagUncheckedCreateNestedManyWithoutArticlesInputSchema).optional(),
  savedArticles: z.lazy(() => SavedArticleUncheckedCreateNestedManyWithoutArticleInputSchema).optional(),
  comments: z.lazy(() => CommentUncheckedCreateNestedManyWithoutArticleInputSchema).optional(),
  reactions: z.lazy(() => ReactionUncheckedCreateNestedManyWithoutArticleInputSchema).optional(),
  views: z.lazy(() => ViewUncheckedCreateNestedManyWithoutArticleInputSchema).optional()
}).strict();

export const ArticleUpdateInputSchema: z.ZodType<Prisma.ArticleUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  summary: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  coverUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  content: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isVisible: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutArticlesNestedInputSchema).optional(),
  tags: z.lazy(() => TagUpdateManyWithoutArticlesNestedInputSchema).optional(),
  savedArticles: z.lazy(() => SavedArticleUpdateManyWithoutArticleNestedInputSchema).optional(),
  comments: z.lazy(() => CommentUpdateManyWithoutArticleNestedInputSchema).optional(),
  reactions: z.lazy(() => ReactionUpdateManyWithoutArticleNestedInputSchema).optional(),
  views: z.lazy(() => ViewUpdateManyWithoutArticleNestedInputSchema).optional()
}).strict();

export const ArticleUncheckedUpdateInputSchema: z.ZodType<Prisma.ArticleUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  summary: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  coverUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  content: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isVisible: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  tags: z.lazy(() => TagUncheckedUpdateManyWithoutArticlesNestedInputSchema).optional(),
  savedArticles: z.lazy(() => SavedArticleUncheckedUpdateManyWithoutArticleNestedInputSchema).optional(),
  comments: z.lazy(() => CommentUncheckedUpdateManyWithoutArticleNestedInputSchema).optional(),
  reactions: z.lazy(() => ReactionUncheckedUpdateManyWithoutArticleNestedInputSchema).optional(),
  views: z.lazy(() => ViewUncheckedUpdateManyWithoutArticleNestedInputSchema).optional()
}).strict();

export const ArticleCreateManyInputSchema: z.ZodType<Prisma.ArticleCreateManyInput> = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  userId: z.number().int(),
  summary: z.string().optional().nullable(),
  coverUrl: z.string().optional().nullable(),
  content: z.string(),
  isVisible: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const ArticleUpdateManyMutationInputSchema: z.ZodType<Prisma.ArticleUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  summary: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  coverUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  content: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isVisible: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ArticleUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ArticleUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  summary: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  coverUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  content: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isVisible: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const SavedArticleCreateInputSchema: z.ZodType<Prisma.SavedArticleCreateInput> = z.object({
  createdAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutSavedArticlesInputSchema),
  article: z.lazy(() => ArticleCreateNestedOneWithoutSavedArticlesInputSchema)
}).strict();

export const SavedArticleUncheckedCreateInputSchema: z.ZodType<Prisma.SavedArticleUncheckedCreateInput> = z.object({
  articleId: z.string(),
  userId: z.number().int(),
  createdAt: z.coerce.date().optional()
}).strict();

export const SavedArticleUpdateInputSchema: z.ZodType<Prisma.SavedArticleUpdateInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutSavedArticlesNestedInputSchema).optional(),
  article: z.lazy(() => ArticleUpdateOneRequiredWithoutSavedArticlesNestedInputSchema).optional()
}).strict();

export const SavedArticleUncheckedUpdateInputSchema: z.ZodType<Prisma.SavedArticleUncheckedUpdateInput> = z.object({
  articleId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const SavedArticleCreateManyInputSchema: z.ZodType<Prisma.SavedArticleCreateManyInput> = z.object({
  articleId: z.string(),
  userId: z.number().int(),
  createdAt: z.coerce.date().optional()
}).strict();

export const SavedArticleUpdateManyMutationInputSchema: z.ZodType<Prisma.SavedArticleUpdateManyMutationInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const SavedArticleUncheckedUpdateManyInputSchema: z.ZodType<Prisma.SavedArticleUncheckedUpdateManyInput> = z.object({
  articleId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TagCreateInputSchema: z.ZodType<Prisma.TagCreateInput> = z.object({
  value: z.string(),
  articles: z.lazy(() => ArticleCreateNestedManyWithoutTagsInputSchema).optional(),
  users: z.lazy(() => UserCreateNestedManyWithoutTagsInputSchema).optional()
}).strict();

export const TagUncheckedCreateInputSchema: z.ZodType<Prisma.TagUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  value: z.string(),
  articles: z.lazy(() => ArticleUncheckedCreateNestedManyWithoutTagsInputSchema).optional(),
  users: z.lazy(() => UserUncheckedCreateNestedManyWithoutTagsInputSchema).optional()
}).strict();

export const TagUpdateInputSchema: z.ZodType<Prisma.TagUpdateInput> = z.object({
  value: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  articles: z.lazy(() => ArticleUpdateManyWithoutTagsNestedInputSchema).optional(),
  users: z.lazy(() => UserUpdateManyWithoutTagsNestedInputSchema).optional()
}).strict();

export const TagUncheckedUpdateInputSchema: z.ZodType<Prisma.TagUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  articles: z.lazy(() => ArticleUncheckedUpdateManyWithoutTagsNestedInputSchema).optional(),
  users: z.lazy(() => UserUncheckedUpdateManyWithoutTagsNestedInputSchema).optional()
}).strict();

export const TagCreateManyInputSchema: z.ZodType<Prisma.TagCreateManyInput> = z.object({
  id: z.number().int().optional(),
  value: z.string()
}).strict();

export const TagUpdateManyMutationInputSchema: z.ZodType<Prisma.TagUpdateManyMutationInput> = z.object({
  value: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TagUncheckedUpdateManyInputSchema: z.ZodType<Prisma.TagUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CommentCreateInputSchema: z.ZodType<Prisma.CommentCreateInput> = z.object({
  id: z.string(),
  content: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  parent: z.lazy(() => CommentCreateNestedOneWithoutRepliesInputSchema).optional(),
  replies: z.lazy(() => CommentCreateNestedManyWithoutParentInputSchema).optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutCommentsInputSchema),
  article: z.lazy(() => ArticleCreateNestedOneWithoutCommentsInputSchema),
  reactions: z.lazy(() => ReactionCreateNestedManyWithoutCommentInputSchema).optional()
}).strict();

export const CommentUncheckedCreateInputSchema: z.ZodType<Prisma.CommentUncheckedCreateInput> = z.object({
  id: z.string(),
  content: z.string(),
  parentId: z.string().optional().nullable(),
  userId: z.number().int(),
  articleId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  replies: z.lazy(() => CommentUncheckedCreateNestedManyWithoutParentInputSchema).optional(),
  reactions: z.lazy(() => ReactionUncheckedCreateNestedManyWithoutCommentInputSchema).optional()
}).strict();

export const CommentUpdateInputSchema: z.ZodType<Prisma.CommentUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  parent: z.lazy(() => CommentUpdateOneWithoutRepliesNestedInputSchema).optional(),
  replies: z.lazy(() => CommentUpdateManyWithoutParentNestedInputSchema).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutCommentsNestedInputSchema).optional(),
  article: z.lazy(() => ArticleUpdateOneRequiredWithoutCommentsNestedInputSchema).optional(),
  reactions: z.lazy(() => ReactionUpdateManyWithoutCommentNestedInputSchema).optional()
}).strict();

export const CommentUncheckedUpdateInputSchema: z.ZodType<Prisma.CommentUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  parentId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  articleId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  replies: z.lazy(() => CommentUncheckedUpdateManyWithoutParentNestedInputSchema).optional(),
  reactions: z.lazy(() => ReactionUncheckedUpdateManyWithoutCommentNestedInputSchema).optional()
}).strict();

export const CommentCreateManyInputSchema: z.ZodType<Prisma.CommentCreateManyInput> = z.object({
  id: z.string(),
  content: z.string(),
  parentId: z.string().optional().nullable(),
  userId: z.number().int(),
  articleId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const CommentUpdateManyMutationInputSchema: z.ZodType<Prisma.CommentUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const CommentUncheckedUpdateManyInputSchema: z.ZodType<Prisma.CommentUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  parentId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  articleId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ReactionCreateInputSchema: z.ZodType<Prisma.ReactionCreateInput> = z.object({
  type: z.lazy(() => ReactionTypeSchema),
  createdAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutReactionsInputSchema),
  article: z.lazy(() => ArticleCreateNestedOneWithoutReactionsInputSchema).optional(),
  comment: z.lazy(() => CommentCreateNestedOneWithoutReactionsInputSchema).optional()
}).strict();

export const ReactionUncheckedCreateInputSchema: z.ZodType<Prisma.ReactionUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  type: z.lazy(() => ReactionTypeSchema),
  createdAt: z.coerce.date().optional(),
  userId: z.number().int(),
  articleId: z.string().optional().nullable(),
  commentId: z.string().optional().nullable()
}).strict();

export const ReactionUpdateInputSchema: z.ZodType<Prisma.ReactionUpdateInput> = z.object({
  type: z.union([ z.lazy(() => ReactionTypeSchema),z.lazy(() => EnumReactionTypeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutReactionsNestedInputSchema).optional(),
  article: z.lazy(() => ArticleUpdateOneWithoutReactionsNestedInputSchema).optional(),
  comment: z.lazy(() => CommentUpdateOneWithoutReactionsNestedInputSchema).optional()
}).strict();

export const ReactionUncheckedUpdateInputSchema: z.ZodType<Prisma.ReactionUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => ReactionTypeSchema),z.lazy(() => EnumReactionTypeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  articleId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  commentId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ReactionCreateManyInputSchema: z.ZodType<Prisma.ReactionCreateManyInput> = z.object({
  id: z.number().int().optional(),
  type: z.lazy(() => ReactionTypeSchema),
  createdAt: z.coerce.date().optional(),
  userId: z.number().int(),
  articleId: z.string().optional().nullable(),
  commentId: z.string().optional().nullable()
}).strict();

export const ReactionUpdateManyMutationInputSchema: z.ZodType<Prisma.ReactionUpdateManyMutationInput> = z.object({
  type: z.union([ z.lazy(() => ReactionTypeSchema),z.lazy(() => EnumReactionTypeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ReactionUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ReactionUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => ReactionTypeSchema),z.lazy(() => EnumReactionTypeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  articleId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  commentId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ViewCreateInputSchema: z.ZodType<Prisma.ViewCreateInput> = z.object({
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutViewsInputSchema),
  article: z.lazy(() => ArticleCreateNestedOneWithoutViewsInputSchema)
}).strict();

export const ViewUncheckedCreateInputSchema: z.ZodType<Prisma.ViewUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  userId: z.number().int(),
  articleId: z.string()
}).strict();

export const ViewUpdateInputSchema: z.ZodType<Prisma.ViewUpdateInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutViewsNestedInputSchema).optional(),
  article: z.lazy(() => ArticleUpdateOneRequiredWithoutViewsNestedInputSchema).optional()
}).strict();

export const ViewUncheckedUpdateInputSchema: z.ZodType<Prisma.ViewUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  articleId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ViewCreateManyInputSchema: z.ZodType<Prisma.ViewCreateManyInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  userId: z.number().int(),
  articleId: z.string()
}).strict();

export const ViewUpdateManyMutationInputSchema: z.ZodType<Prisma.ViewUpdateManyMutationInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ViewUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ViewUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  articleId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const FollowCreateInputSchema: z.ZodType<Prisma.FollowCreateInput> = z.object({
  createdAt: z.coerce.date().optional(),
  follower: z.lazy(() => UserCreateNestedOneWithoutFollowingInputSchema),
  following: z.lazy(() => UserCreateNestedOneWithoutFollowersInputSchema)
}).strict();

export const FollowUncheckedCreateInputSchema: z.ZodType<Prisma.FollowUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  followerId: z.number().int(),
  followingId: z.number().int()
}).strict();

export const FollowUpdateInputSchema: z.ZodType<Prisma.FollowUpdateInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  follower: z.lazy(() => UserUpdateOneRequiredWithoutFollowingNestedInputSchema).optional(),
  following: z.lazy(() => UserUpdateOneRequiredWithoutFollowersNestedInputSchema).optional()
}).strict();

export const FollowUncheckedUpdateInputSchema: z.ZodType<Prisma.FollowUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  followerId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  followingId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const FollowCreateManyInputSchema: z.ZodType<Prisma.FollowCreateManyInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  followerId: z.number().int(),
  followingId: z.number().int()
}).strict();

export const FollowUpdateManyMutationInputSchema: z.ZodType<Prisma.FollowUpdateManyMutationInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const FollowUncheckedUpdateManyInputSchema: z.ZodType<Prisma.FollowUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  followerId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  followingId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const IntFilterSchema: z.ZodType<Prisma.IntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict();

export const StringFilterSchema: z.ZodType<Prisma.StringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const DateTimeNullableFilterSchema: z.ZodType<Prisma.DateTimeNullableFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const StringNullableFilterSchema: z.ZodType<Prisma.StringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const EnumRoleFilterSchema: z.ZodType<Prisma.EnumRoleFilter> = z.object({
  equals: z.lazy(() => RoleSchema).optional(),
  in: z.lazy(() => RoleSchema).array().optional(),
  notIn: z.lazy(() => RoleSchema).array().optional(),
  not: z.union([ z.lazy(() => RoleSchema),z.lazy(() => NestedEnumRoleFilterSchema) ]).optional(),
}).strict();

export const DateTimeFilterSchema: z.ZodType<Prisma.DateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const ActivationTokenNullableRelationFilterSchema: z.ZodType<Prisma.ActivationTokenNullableRelationFilter> = z.object({
  is: z.lazy(() => ActivationTokenWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => ActivationTokenWhereInputSchema).optional().nullable()
}).strict();

export const PasswordResetTokenNullableRelationFilterSchema: z.ZodType<Prisma.PasswordResetTokenNullableRelationFilter> = z.object({
  is: z.lazy(() => PasswordResetTokenWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => PasswordResetTokenWhereInputSchema).optional().nullable()
}).strict();

export const ArticleListRelationFilterSchema: z.ZodType<Prisma.ArticleListRelationFilter> = z.object({
  every: z.lazy(() => ArticleWhereInputSchema).optional(),
  some: z.lazy(() => ArticleWhereInputSchema).optional(),
  none: z.lazy(() => ArticleWhereInputSchema).optional()
}).strict();

export const SavedArticleListRelationFilterSchema: z.ZodType<Prisma.SavedArticleListRelationFilter> = z.object({
  every: z.lazy(() => SavedArticleWhereInputSchema).optional(),
  some: z.lazy(() => SavedArticleWhereInputSchema).optional(),
  none: z.lazy(() => SavedArticleWhereInputSchema).optional()
}).strict();

export const TagListRelationFilterSchema: z.ZodType<Prisma.TagListRelationFilter> = z.object({
  every: z.lazy(() => TagWhereInputSchema).optional(),
  some: z.lazy(() => TagWhereInputSchema).optional(),
  none: z.lazy(() => TagWhereInputSchema).optional()
}).strict();

export const CommentListRelationFilterSchema: z.ZodType<Prisma.CommentListRelationFilter> = z.object({
  every: z.lazy(() => CommentWhereInputSchema).optional(),
  some: z.lazy(() => CommentWhereInputSchema).optional(),
  none: z.lazy(() => CommentWhereInputSchema).optional()
}).strict();

export const ReactionListRelationFilterSchema: z.ZodType<Prisma.ReactionListRelationFilter> = z.object({
  every: z.lazy(() => ReactionWhereInputSchema).optional(),
  some: z.lazy(() => ReactionWhereInputSchema).optional(),
  none: z.lazy(() => ReactionWhereInputSchema).optional()
}).strict();

export const ViewListRelationFilterSchema: z.ZodType<Prisma.ViewListRelationFilter> = z.object({
  every: z.lazy(() => ViewWhereInputSchema).optional(),
  some: z.lazy(() => ViewWhereInputSchema).optional(),
  none: z.lazy(() => ViewWhereInputSchema).optional()
}).strict();

export const FollowListRelationFilterSchema: z.ZodType<Prisma.FollowListRelationFilter> = z.object({
  every: z.lazy(() => FollowWhereInputSchema).optional(),
  some: z.lazy(() => FollowWhereInputSchema).optional(),
  none: z.lazy(() => FollowWhereInputSchema).optional()
}).strict();

export const SortOrderInputSchema: z.ZodType<Prisma.SortOrderInput> = z.object({
  sort: z.lazy(() => SortOrderSchema),
  nulls: z.lazy(() => NullsOrderSchema).optional()
}).strict();

export const ArticleOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ArticleOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SavedArticleOrderByRelationAggregateInputSchema: z.ZodType<Prisma.SavedArticleOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TagOrderByRelationAggregateInputSchema: z.ZodType<Prisma.TagOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CommentOrderByRelationAggregateInputSchema: z.ZodType<Prisma.CommentOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ReactionOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ReactionOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ViewOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ViewOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const FollowOrderByRelationAggregateInputSchema: z.ZodType<Prisma.FollowOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserCountOrderByAggregateInputSchema: z.ZodType<Prisma.UserCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  username: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  emailVerifiedAt: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  profileUrl: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserAvgOrderByAggregateInputSchema: z.ZodType<Prisma.UserAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserMaxOrderByAggregateInputSchema: z.ZodType<Prisma.UserMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  username: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  emailVerifiedAt: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  profileUrl: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserMinOrderByAggregateInputSchema: z.ZodType<Prisma.UserMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  username: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  emailVerifiedAt: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  profileUrl: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserSumOrderByAggregateInputSchema: z.ZodType<Prisma.UserSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const IntWithAggregatesFilterSchema: z.ZodType<Prisma.IntWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional()
}).strict();

export const StringWithAggregatesFilterSchema: z.ZodType<Prisma.StringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const DateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeNullableWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional()
}).strict();

export const StringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.StringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict();

export const EnumRoleWithAggregatesFilterSchema: z.ZodType<Prisma.EnumRoleWithAggregatesFilter> = z.object({
  equals: z.lazy(() => RoleSchema).optional(),
  in: z.lazy(() => RoleSchema).array().optional(),
  notIn: z.lazy(() => RoleSchema).array().optional(),
  not: z.union([ z.lazy(() => RoleSchema),z.lazy(() => NestedEnumRoleWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumRoleFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumRoleFilterSchema).optional()
}).strict();

export const DateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const UserRelationFilterSchema: z.ZodType<Prisma.UserRelationFilter> = z.object({
  is: z.lazy(() => UserWhereInputSchema).optional(),
  isNot: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const PasswordResetTokenCountOrderByAggregateInputSchema: z.ZodType<Prisma.PasswordResetTokenCountOrderByAggregateInput> = z.object({
  token: z.lazy(() => SortOrderSchema).optional(),
  expiresAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PasswordResetTokenAvgOrderByAggregateInputSchema: z.ZodType<Prisma.PasswordResetTokenAvgOrderByAggregateInput> = z.object({
  userId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PasswordResetTokenMaxOrderByAggregateInputSchema: z.ZodType<Prisma.PasswordResetTokenMaxOrderByAggregateInput> = z.object({
  token: z.lazy(() => SortOrderSchema).optional(),
  expiresAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PasswordResetTokenMinOrderByAggregateInputSchema: z.ZodType<Prisma.PasswordResetTokenMinOrderByAggregateInput> = z.object({
  token: z.lazy(() => SortOrderSchema).optional(),
  expiresAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PasswordResetTokenSumOrderByAggregateInputSchema: z.ZodType<Prisma.PasswordResetTokenSumOrderByAggregateInput> = z.object({
  userId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ActivationTokenCountOrderByAggregateInputSchema: z.ZodType<Prisma.ActivationTokenCountOrderByAggregateInput> = z.object({
  token: z.lazy(() => SortOrderSchema).optional(),
  expiresAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ActivationTokenAvgOrderByAggregateInputSchema: z.ZodType<Prisma.ActivationTokenAvgOrderByAggregateInput> = z.object({
  userId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ActivationTokenMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ActivationTokenMaxOrderByAggregateInput> = z.object({
  token: z.lazy(() => SortOrderSchema).optional(),
  expiresAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ActivationTokenMinOrderByAggregateInputSchema: z.ZodType<Prisma.ActivationTokenMinOrderByAggregateInput> = z.object({
  token: z.lazy(() => SortOrderSchema).optional(),
  expiresAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ActivationTokenSumOrderByAggregateInputSchema: z.ZodType<Prisma.ActivationTokenSumOrderByAggregateInput> = z.object({
  userId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BoolFilterSchema: z.ZodType<Prisma.BoolFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
}).strict();

export const ArticleCountOrderByAggregateInputSchema: z.ZodType<Prisma.ArticleCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  slug: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  summary: z.lazy(() => SortOrderSchema).optional(),
  coverUrl: z.lazy(() => SortOrderSchema).optional(),
  content: z.lazy(() => SortOrderSchema).optional(),
  isVisible: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ArticleAvgOrderByAggregateInputSchema: z.ZodType<Prisma.ArticleAvgOrderByAggregateInput> = z.object({
  userId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ArticleMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ArticleMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  slug: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  summary: z.lazy(() => SortOrderSchema).optional(),
  coverUrl: z.lazy(() => SortOrderSchema).optional(),
  content: z.lazy(() => SortOrderSchema).optional(),
  isVisible: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ArticleMinOrderByAggregateInputSchema: z.ZodType<Prisma.ArticleMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  slug: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  summary: z.lazy(() => SortOrderSchema).optional(),
  coverUrl: z.lazy(() => SortOrderSchema).optional(),
  content: z.lazy(() => SortOrderSchema).optional(),
  isVisible: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ArticleSumOrderByAggregateInputSchema: z.ZodType<Prisma.ArticleSumOrderByAggregateInput> = z.object({
  userId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BoolWithAggregatesFilterSchema: z.ZodType<Prisma.BoolWithAggregatesFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional()
}).strict();

export const ArticleRelationFilterSchema: z.ZodType<Prisma.ArticleRelationFilter> = z.object({
  is: z.lazy(() => ArticleWhereInputSchema).optional(),
  isNot: z.lazy(() => ArticleWhereInputSchema).optional()
}).strict();

export const SavedArticleUserIdArticleIdCompoundUniqueInputSchema: z.ZodType<Prisma.SavedArticleUserIdArticleIdCompoundUniqueInput> = z.object({
  userId: z.number(),
  articleId: z.string()
}).strict();

export const SavedArticleCountOrderByAggregateInputSchema: z.ZodType<Prisma.SavedArticleCountOrderByAggregateInput> = z.object({
  articleId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SavedArticleAvgOrderByAggregateInputSchema: z.ZodType<Prisma.SavedArticleAvgOrderByAggregateInput> = z.object({
  userId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SavedArticleMaxOrderByAggregateInputSchema: z.ZodType<Prisma.SavedArticleMaxOrderByAggregateInput> = z.object({
  articleId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SavedArticleMinOrderByAggregateInputSchema: z.ZodType<Prisma.SavedArticleMinOrderByAggregateInput> = z.object({
  articleId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SavedArticleSumOrderByAggregateInputSchema: z.ZodType<Prisma.SavedArticleSumOrderByAggregateInput> = z.object({
  userId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserListRelationFilterSchema: z.ZodType<Prisma.UserListRelationFilter> = z.object({
  every: z.lazy(() => UserWhereInputSchema).optional(),
  some: z.lazy(() => UserWhereInputSchema).optional(),
  none: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserOrderByRelationAggregateInputSchema: z.ZodType<Prisma.UserOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TagCountOrderByAggregateInputSchema: z.ZodType<Prisma.TagCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TagAvgOrderByAggregateInputSchema: z.ZodType<Prisma.TagAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TagMaxOrderByAggregateInputSchema: z.ZodType<Prisma.TagMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TagMinOrderByAggregateInputSchema: z.ZodType<Prisma.TagMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TagSumOrderByAggregateInputSchema: z.ZodType<Prisma.TagSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CommentNullableRelationFilterSchema: z.ZodType<Prisma.CommentNullableRelationFilter> = z.object({
  is: z.lazy(() => CommentWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => CommentWhereInputSchema).optional().nullable()
}).strict();

export const CommentCountOrderByAggregateInputSchema: z.ZodType<Prisma.CommentCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  content: z.lazy(() => SortOrderSchema).optional(),
  parentId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  articleId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CommentAvgOrderByAggregateInputSchema: z.ZodType<Prisma.CommentAvgOrderByAggregateInput> = z.object({
  userId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CommentMaxOrderByAggregateInputSchema: z.ZodType<Prisma.CommentMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  content: z.lazy(() => SortOrderSchema).optional(),
  parentId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  articleId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CommentMinOrderByAggregateInputSchema: z.ZodType<Prisma.CommentMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  content: z.lazy(() => SortOrderSchema).optional(),
  parentId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  articleId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CommentSumOrderByAggregateInputSchema: z.ZodType<Prisma.CommentSumOrderByAggregateInput> = z.object({
  userId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumReactionTypeFilterSchema: z.ZodType<Prisma.EnumReactionTypeFilter> = z.object({
  equals: z.lazy(() => ReactionTypeSchema).optional(),
  in: z.lazy(() => ReactionTypeSchema).array().optional(),
  notIn: z.lazy(() => ReactionTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => ReactionTypeSchema),z.lazy(() => NestedEnumReactionTypeFilterSchema) ]).optional(),
}).strict();

export const ArticleNullableRelationFilterSchema: z.ZodType<Prisma.ArticleNullableRelationFilter> = z.object({
  is: z.lazy(() => ArticleWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => ArticleWhereInputSchema).optional().nullable()
}).strict();

export const ReactionUserIdArticleIdCompoundUniqueInputSchema: z.ZodType<Prisma.ReactionUserIdArticleIdCompoundUniqueInput> = z.object({
  userId: z.number(),
  articleId: z.string()
}).strict();

export const ReactionUserIdCommentIdCompoundUniqueInputSchema: z.ZodType<Prisma.ReactionUserIdCommentIdCompoundUniqueInput> = z.object({
  userId: z.number(),
  commentId: z.string()
}).strict();

export const ReactionCountOrderByAggregateInputSchema: z.ZodType<Prisma.ReactionCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  articleId: z.lazy(() => SortOrderSchema).optional(),
  commentId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ReactionAvgOrderByAggregateInputSchema: z.ZodType<Prisma.ReactionAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ReactionMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ReactionMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  articleId: z.lazy(() => SortOrderSchema).optional(),
  commentId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ReactionMinOrderByAggregateInputSchema: z.ZodType<Prisma.ReactionMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  articleId: z.lazy(() => SortOrderSchema).optional(),
  commentId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ReactionSumOrderByAggregateInputSchema: z.ZodType<Prisma.ReactionSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumReactionTypeWithAggregatesFilterSchema: z.ZodType<Prisma.EnumReactionTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => ReactionTypeSchema).optional(),
  in: z.lazy(() => ReactionTypeSchema).array().optional(),
  notIn: z.lazy(() => ReactionTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => ReactionTypeSchema),z.lazy(() => NestedEnumReactionTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumReactionTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumReactionTypeFilterSchema).optional()
}).strict();

export const ViewCountOrderByAggregateInputSchema: z.ZodType<Prisma.ViewCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  articleId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ViewAvgOrderByAggregateInputSchema: z.ZodType<Prisma.ViewAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ViewMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ViewMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  articleId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ViewMinOrderByAggregateInputSchema: z.ZodType<Prisma.ViewMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  articleId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ViewSumOrderByAggregateInputSchema: z.ZodType<Prisma.ViewSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const FollowFollowerIdFollowingIdCompoundUniqueInputSchema: z.ZodType<Prisma.FollowFollowerIdFollowingIdCompoundUniqueInput> = z.object({
  followerId: z.number(),
  followingId: z.number()
}).strict();

export const FollowCountOrderByAggregateInputSchema: z.ZodType<Prisma.FollowCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  followerId: z.lazy(() => SortOrderSchema).optional(),
  followingId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const FollowAvgOrderByAggregateInputSchema: z.ZodType<Prisma.FollowAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  followerId: z.lazy(() => SortOrderSchema).optional(),
  followingId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const FollowMaxOrderByAggregateInputSchema: z.ZodType<Prisma.FollowMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  followerId: z.lazy(() => SortOrderSchema).optional(),
  followingId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const FollowMinOrderByAggregateInputSchema: z.ZodType<Prisma.FollowMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  followerId: z.lazy(() => SortOrderSchema).optional(),
  followingId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const FollowSumOrderByAggregateInputSchema: z.ZodType<Prisma.FollowSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  followerId: z.lazy(() => SortOrderSchema).optional(),
  followingId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ActivationTokenCreateNestedOneWithoutUserInputSchema: z.ZodType<Prisma.ActivationTokenCreateNestedOneWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => ActivationTokenCreateWithoutUserInputSchema),z.lazy(() => ActivationTokenUncheckedCreateWithoutUserInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ActivationTokenCreateOrConnectWithoutUserInputSchema).optional(),
  connect: z.lazy(() => ActivationTokenWhereUniqueInputSchema).optional()
}).strict();

export const PasswordResetTokenCreateNestedOneWithoutUserInputSchema: z.ZodType<Prisma.PasswordResetTokenCreateNestedOneWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => PasswordResetTokenCreateWithoutUserInputSchema),z.lazy(() => PasswordResetTokenUncheckedCreateWithoutUserInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PasswordResetTokenCreateOrConnectWithoutUserInputSchema).optional(),
  connect: z.lazy(() => PasswordResetTokenWhereUniqueInputSchema).optional()
}).strict();

export const ArticleCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.ArticleCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => ArticleCreateWithoutUserInputSchema),z.lazy(() => ArticleCreateWithoutUserInputSchema).array(),z.lazy(() => ArticleUncheckedCreateWithoutUserInputSchema),z.lazy(() => ArticleUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ArticleCreateOrConnectWithoutUserInputSchema),z.lazy(() => ArticleCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ArticleCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ArticleWhereUniqueInputSchema),z.lazy(() => ArticleWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const SavedArticleCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.SavedArticleCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => SavedArticleCreateWithoutUserInputSchema),z.lazy(() => SavedArticleCreateWithoutUserInputSchema).array(),z.lazy(() => SavedArticleUncheckedCreateWithoutUserInputSchema),z.lazy(() => SavedArticleUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SavedArticleCreateOrConnectWithoutUserInputSchema),z.lazy(() => SavedArticleCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => SavedArticleCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => SavedArticleWhereUniqueInputSchema),z.lazy(() => SavedArticleWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const TagCreateNestedManyWithoutUsersInputSchema: z.ZodType<Prisma.TagCreateNestedManyWithoutUsersInput> = z.object({
  create: z.union([ z.lazy(() => TagCreateWithoutUsersInputSchema),z.lazy(() => TagCreateWithoutUsersInputSchema).array(),z.lazy(() => TagUncheckedCreateWithoutUsersInputSchema),z.lazy(() => TagUncheckedCreateWithoutUsersInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TagCreateOrConnectWithoutUsersInputSchema),z.lazy(() => TagCreateOrConnectWithoutUsersInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TagWhereUniqueInputSchema),z.lazy(() => TagWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const CommentCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.CommentCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => CommentCreateWithoutUserInputSchema),z.lazy(() => CommentCreateWithoutUserInputSchema).array(),z.lazy(() => CommentUncheckedCreateWithoutUserInputSchema),z.lazy(() => CommentUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CommentCreateOrConnectWithoutUserInputSchema),z.lazy(() => CommentCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CommentCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CommentWhereUniqueInputSchema),z.lazy(() => CommentWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ReactionCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.ReactionCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => ReactionCreateWithoutUserInputSchema),z.lazy(() => ReactionCreateWithoutUserInputSchema).array(),z.lazy(() => ReactionUncheckedCreateWithoutUserInputSchema),z.lazy(() => ReactionUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ReactionCreateOrConnectWithoutUserInputSchema),z.lazy(() => ReactionCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ReactionCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ReactionWhereUniqueInputSchema),z.lazy(() => ReactionWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ViewCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.ViewCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => ViewCreateWithoutUserInputSchema),z.lazy(() => ViewCreateWithoutUserInputSchema).array(),z.lazy(() => ViewUncheckedCreateWithoutUserInputSchema),z.lazy(() => ViewUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ViewCreateOrConnectWithoutUserInputSchema),z.lazy(() => ViewCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ViewCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ViewWhereUniqueInputSchema),z.lazy(() => ViewWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const FollowCreateNestedManyWithoutFollowerInputSchema: z.ZodType<Prisma.FollowCreateNestedManyWithoutFollowerInput> = z.object({
  create: z.union([ z.lazy(() => FollowCreateWithoutFollowerInputSchema),z.lazy(() => FollowCreateWithoutFollowerInputSchema).array(),z.lazy(() => FollowUncheckedCreateWithoutFollowerInputSchema),z.lazy(() => FollowUncheckedCreateWithoutFollowerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => FollowCreateOrConnectWithoutFollowerInputSchema),z.lazy(() => FollowCreateOrConnectWithoutFollowerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => FollowCreateManyFollowerInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => FollowWhereUniqueInputSchema),z.lazy(() => FollowWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const FollowCreateNestedManyWithoutFollowingInputSchema: z.ZodType<Prisma.FollowCreateNestedManyWithoutFollowingInput> = z.object({
  create: z.union([ z.lazy(() => FollowCreateWithoutFollowingInputSchema),z.lazy(() => FollowCreateWithoutFollowingInputSchema).array(),z.lazy(() => FollowUncheckedCreateWithoutFollowingInputSchema),z.lazy(() => FollowUncheckedCreateWithoutFollowingInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => FollowCreateOrConnectWithoutFollowingInputSchema),z.lazy(() => FollowCreateOrConnectWithoutFollowingInputSchema).array() ]).optional(),
  createMany: z.lazy(() => FollowCreateManyFollowingInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => FollowWhereUniqueInputSchema),z.lazy(() => FollowWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ActivationTokenUncheckedCreateNestedOneWithoutUserInputSchema: z.ZodType<Prisma.ActivationTokenUncheckedCreateNestedOneWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => ActivationTokenCreateWithoutUserInputSchema),z.lazy(() => ActivationTokenUncheckedCreateWithoutUserInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ActivationTokenCreateOrConnectWithoutUserInputSchema).optional(),
  connect: z.lazy(() => ActivationTokenWhereUniqueInputSchema).optional()
}).strict();

export const PasswordResetTokenUncheckedCreateNestedOneWithoutUserInputSchema: z.ZodType<Prisma.PasswordResetTokenUncheckedCreateNestedOneWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => PasswordResetTokenCreateWithoutUserInputSchema),z.lazy(() => PasswordResetTokenUncheckedCreateWithoutUserInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PasswordResetTokenCreateOrConnectWithoutUserInputSchema).optional(),
  connect: z.lazy(() => PasswordResetTokenWhereUniqueInputSchema).optional()
}).strict();

export const ArticleUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.ArticleUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => ArticleCreateWithoutUserInputSchema),z.lazy(() => ArticleCreateWithoutUserInputSchema).array(),z.lazy(() => ArticleUncheckedCreateWithoutUserInputSchema),z.lazy(() => ArticleUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ArticleCreateOrConnectWithoutUserInputSchema),z.lazy(() => ArticleCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ArticleCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ArticleWhereUniqueInputSchema),z.lazy(() => ArticleWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const SavedArticleUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.SavedArticleUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => SavedArticleCreateWithoutUserInputSchema),z.lazy(() => SavedArticleCreateWithoutUserInputSchema).array(),z.lazy(() => SavedArticleUncheckedCreateWithoutUserInputSchema),z.lazy(() => SavedArticleUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SavedArticleCreateOrConnectWithoutUserInputSchema),z.lazy(() => SavedArticleCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => SavedArticleCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => SavedArticleWhereUniqueInputSchema),z.lazy(() => SavedArticleWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const TagUncheckedCreateNestedManyWithoutUsersInputSchema: z.ZodType<Prisma.TagUncheckedCreateNestedManyWithoutUsersInput> = z.object({
  create: z.union([ z.lazy(() => TagCreateWithoutUsersInputSchema),z.lazy(() => TagCreateWithoutUsersInputSchema).array(),z.lazy(() => TagUncheckedCreateWithoutUsersInputSchema),z.lazy(() => TagUncheckedCreateWithoutUsersInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TagCreateOrConnectWithoutUsersInputSchema),z.lazy(() => TagCreateOrConnectWithoutUsersInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TagWhereUniqueInputSchema),z.lazy(() => TagWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const CommentUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.CommentUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => CommentCreateWithoutUserInputSchema),z.lazy(() => CommentCreateWithoutUserInputSchema).array(),z.lazy(() => CommentUncheckedCreateWithoutUserInputSchema),z.lazy(() => CommentUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CommentCreateOrConnectWithoutUserInputSchema),z.lazy(() => CommentCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CommentCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CommentWhereUniqueInputSchema),z.lazy(() => CommentWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ReactionUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.ReactionUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => ReactionCreateWithoutUserInputSchema),z.lazy(() => ReactionCreateWithoutUserInputSchema).array(),z.lazy(() => ReactionUncheckedCreateWithoutUserInputSchema),z.lazy(() => ReactionUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ReactionCreateOrConnectWithoutUserInputSchema),z.lazy(() => ReactionCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ReactionCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ReactionWhereUniqueInputSchema),z.lazy(() => ReactionWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ViewUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.ViewUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => ViewCreateWithoutUserInputSchema),z.lazy(() => ViewCreateWithoutUserInputSchema).array(),z.lazy(() => ViewUncheckedCreateWithoutUserInputSchema),z.lazy(() => ViewUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ViewCreateOrConnectWithoutUserInputSchema),z.lazy(() => ViewCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ViewCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ViewWhereUniqueInputSchema),z.lazy(() => ViewWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const FollowUncheckedCreateNestedManyWithoutFollowerInputSchema: z.ZodType<Prisma.FollowUncheckedCreateNestedManyWithoutFollowerInput> = z.object({
  create: z.union([ z.lazy(() => FollowCreateWithoutFollowerInputSchema),z.lazy(() => FollowCreateWithoutFollowerInputSchema).array(),z.lazy(() => FollowUncheckedCreateWithoutFollowerInputSchema),z.lazy(() => FollowUncheckedCreateWithoutFollowerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => FollowCreateOrConnectWithoutFollowerInputSchema),z.lazy(() => FollowCreateOrConnectWithoutFollowerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => FollowCreateManyFollowerInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => FollowWhereUniqueInputSchema),z.lazy(() => FollowWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const FollowUncheckedCreateNestedManyWithoutFollowingInputSchema: z.ZodType<Prisma.FollowUncheckedCreateNestedManyWithoutFollowingInput> = z.object({
  create: z.union([ z.lazy(() => FollowCreateWithoutFollowingInputSchema),z.lazy(() => FollowCreateWithoutFollowingInputSchema).array(),z.lazy(() => FollowUncheckedCreateWithoutFollowingInputSchema),z.lazy(() => FollowUncheckedCreateWithoutFollowingInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => FollowCreateOrConnectWithoutFollowingInputSchema),z.lazy(() => FollowCreateOrConnectWithoutFollowingInputSchema).array() ]).optional(),
  createMany: z.lazy(() => FollowCreateManyFollowingInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => FollowWhereUniqueInputSchema),z.lazy(() => FollowWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional()
}).strict();

export const NullableDateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableDateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional().nullable()
}).strict();

export const NullableStringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableStringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional().nullable()
}).strict();

export const EnumRoleFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumRoleFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => RoleSchema).optional()
}).strict();

export const DateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional()
}).strict();

export const ActivationTokenUpdateOneWithoutUserNestedInputSchema: z.ZodType<Prisma.ActivationTokenUpdateOneWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => ActivationTokenCreateWithoutUserInputSchema),z.lazy(() => ActivationTokenUncheckedCreateWithoutUserInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ActivationTokenCreateOrConnectWithoutUserInputSchema).optional(),
  upsert: z.lazy(() => ActivationTokenUpsertWithoutUserInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => ActivationTokenWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => ActivationTokenWhereInputSchema) ]).optional(),
  connect: z.lazy(() => ActivationTokenWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ActivationTokenUpdateToOneWithWhereWithoutUserInputSchema),z.lazy(() => ActivationTokenUpdateWithoutUserInputSchema),z.lazy(() => ActivationTokenUncheckedUpdateWithoutUserInputSchema) ]).optional(),
}).strict();

export const PasswordResetTokenUpdateOneWithoutUserNestedInputSchema: z.ZodType<Prisma.PasswordResetTokenUpdateOneWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => PasswordResetTokenCreateWithoutUserInputSchema),z.lazy(() => PasswordResetTokenUncheckedCreateWithoutUserInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PasswordResetTokenCreateOrConnectWithoutUserInputSchema).optional(),
  upsert: z.lazy(() => PasswordResetTokenUpsertWithoutUserInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => PasswordResetTokenWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => PasswordResetTokenWhereInputSchema) ]).optional(),
  connect: z.lazy(() => PasswordResetTokenWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => PasswordResetTokenUpdateToOneWithWhereWithoutUserInputSchema),z.lazy(() => PasswordResetTokenUpdateWithoutUserInputSchema),z.lazy(() => PasswordResetTokenUncheckedUpdateWithoutUserInputSchema) ]).optional(),
}).strict();

export const ArticleUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.ArticleUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => ArticleCreateWithoutUserInputSchema),z.lazy(() => ArticleCreateWithoutUserInputSchema).array(),z.lazy(() => ArticleUncheckedCreateWithoutUserInputSchema),z.lazy(() => ArticleUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ArticleCreateOrConnectWithoutUserInputSchema),z.lazy(() => ArticleCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ArticleUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ArticleUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ArticleCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ArticleWhereUniqueInputSchema),z.lazy(() => ArticleWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ArticleWhereUniqueInputSchema),z.lazy(() => ArticleWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ArticleWhereUniqueInputSchema),z.lazy(() => ArticleWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ArticleWhereUniqueInputSchema),z.lazy(() => ArticleWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ArticleUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ArticleUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ArticleUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => ArticleUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ArticleScalarWhereInputSchema),z.lazy(() => ArticleScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const SavedArticleUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.SavedArticleUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => SavedArticleCreateWithoutUserInputSchema),z.lazy(() => SavedArticleCreateWithoutUserInputSchema).array(),z.lazy(() => SavedArticleUncheckedCreateWithoutUserInputSchema),z.lazy(() => SavedArticleUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SavedArticleCreateOrConnectWithoutUserInputSchema),z.lazy(() => SavedArticleCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => SavedArticleUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => SavedArticleUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => SavedArticleCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => SavedArticleWhereUniqueInputSchema),z.lazy(() => SavedArticleWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => SavedArticleWhereUniqueInputSchema),z.lazy(() => SavedArticleWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => SavedArticleWhereUniqueInputSchema),z.lazy(() => SavedArticleWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => SavedArticleWhereUniqueInputSchema),z.lazy(() => SavedArticleWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => SavedArticleUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => SavedArticleUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => SavedArticleUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => SavedArticleUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => SavedArticleScalarWhereInputSchema),z.lazy(() => SavedArticleScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const TagUpdateManyWithoutUsersNestedInputSchema: z.ZodType<Prisma.TagUpdateManyWithoutUsersNestedInput> = z.object({
  create: z.union([ z.lazy(() => TagCreateWithoutUsersInputSchema),z.lazy(() => TagCreateWithoutUsersInputSchema).array(),z.lazy(() => TagUncheckedCreateWithoutUsersInputSchema),z.lazy(() => TagUncheckedCreateWithoutUsersInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TagCreateOrConnectWithoutUsersInputSchema),z.lazy(() => TagCreateOrConnectWithoutUsersInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TagUpsertWithWhereUniqueWithoutUsersInputSchema),z.lazy(() => TagUpsertWithWhereUniqueWithoutUsersInputSchema).array() ]).optional(),
  set: z.union([ z.lazy(() => TagWhereUniqueInputSchema),z.lazy(() => TagWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TagWhereUniqueInputSchema),z.lazy(() => TagWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TagWhereUniqueInputSchema),z.lazy(() => TagWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TagWhereUniqueInputSchema),z.lazy(() => TagWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TagUpdateWithWhereUniqueWithoutUsersInputSchema),z.lazy(() => TagUpdateWithWhereUniqueWithoutUsersInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TagUpdateManyWithWhereWithoutUsersInputSchema),z.lazy(() => TagUpdateManyWithWhereWithoutUsersInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TagScalarWhereInputSchema),z.lazy(() => TagScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const CommentUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.CommentUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => CommentCreateWithoutUserInputSchema),z.lazy(() => CommentCreateWithoutUserInputSchema).array(),z.lazy(() => CommentUncheckedCreateWithoutUserInputSchema),z.lazy(() => CommentUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CommentCreateOrConnectWithoutUserInputSchema),z.lazy(() => CommentCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CommentUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => CommentUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CommentCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CommentWhereUniqueInputSchema),z.lazy(() => CommentWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CommentWhereUniqueInputSchema),z.lazy(() => CommentWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CommentWhereUniqueInputSchema),z.lazy(() => CommentWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CommentWhereUniqueInputSchema),z.lazy(() => CommentWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CommentUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => CommentUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CommentUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => CommentUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CommentScalarWhereInputSchema),z.lazy(() => CommentScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ReactionUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.ReactionUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => ReactionCreateWithoutUserInputSchema),z.lazy(() => ReactionCreateWithoutUserInputSchema).array(),z.lazy(() => ReactionUncheckedCreateWithoutUserInputSchema),z.lazy(() => ReactionUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ReactionCreateOrConnectWithoutUserInputSchema),z.lazy(() => ReactionCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ReactionUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ReactionUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ReactionCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ReactionWhereUniqueInputSchema),z.lazy(() => ReactionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ReactionWhereUniqueInputSchema),z.lazy(() => ReactionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ReactionWhereUniqueInputSchema),z.lazy(() => ReactionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ReactionWhereUniqueInputSchema),z.lazy(() => ReactionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ReactionUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ReactionUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ReactionUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => ReactionUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ReactionScalarWhereInputSchema),z.lazy(() => ReactionScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ViewUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.ViewUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => ViewCreateWithoutUserInputSchema),z.lazy(() => ViewCreateWithoutUserInputSchema).array(),z.lazy(() => ViewUncheckedCreateWithoutUserInputSchema),z.lazy(() => ViewUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ViewCreateOrConnectWithoutUserInputSchema),z.lazy(() => ViewCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ViewUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ViewUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ViewCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ViewWhereUniqueInputSchema),z.lazy(() => ViewWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ViewWhereUniqueInputSchema),z.lazy(() => ViewWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ViewWhereUniqueInputSchema),z.lazy(() => ViewWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ViewWhereUniqueInputSchema),z.lazy(() => ViewWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ViewUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ViewUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ViewUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => ViewUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ViewScalarWhereInputSchema),z.lazy(() => ViewScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const FollowUpdateManyWithoutFollowerNestedInputSchema: z.ZodType<Prisma.FollowUpdateManyWithoutFollowerNestedInput> = z.object({
  create: z.union([ z.lazy(() => FollowCreateWithoutFollowerInputSchema),z.lazy(() => FollowCreateWithoutFollowerInputSchema).array(),z.lazy(() => FollowUncheckedCreateWithoutFollowerInputSchema),z.lazy(() => FollowUncheckedCreateWithoutFollowerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => FollowCreateOrConnectWithoutFollowerInputSchema),z.lazy(() => FollowCreateOrConnectWithoutFollowerInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => FollowUpsertWithWhereUniqueWithoutFollowerInputSchema),z.lazy(() => FollowUpsertWithWhereUniqueWithoutFollowerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => FollowCreateManyFollowerInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => FollowWhereUniqueInputSchema),z.lazy(() => FollowWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => FollowWhereUniqueInputSchema),z.lazy(() => FollowWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => FollowWhereUniqueInputSchema),z.lazy(() => FollowWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => FollowWhereUniqueInputSchema),z.lazy(() => FollowWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => FollowUpdateWithWhereUniqueWithoutFollowerInputSchema),z.lazy(() => FollowUpdateWithWhereUniqueWithoutFollowerInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => FollowUpdateManyWithWhereWithoutFollowerInputSchema),z.lazy(() => FollowUpdateManyWithWhereWithoutFollowerInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => FollowScalarWhereInputSchema),z.lazy(() => FollowScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const FollowUpdateManyWithoutFollowingNestedInputSchema: z.ZodType<Prisma.FollowUpdateManyWithoutFollowingNestedInput> = z.object({
  create: z.union([ z.lazy(() => FollowCreateWithoutFollowingInputSchema),z.lazy(() => FollowCreateWithoutFollowingInputSchema).array(),z.lazy(() => FollowUncheckedCreateWithoutFollowingInputSchema),z.lazy(() => FollowUncheckedCreateWithoutFollowingInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => FollowCreateOrConnectWithoutFollowingInputSchema),z.lazy(() => FollowCreateOrConnectWithoutFollowingInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => FollowUpsertWithWhereUniqueWithoutFollowingInputSchema),z.lazy(() => FollowUpsertWithWhereUniqueWithoutFollowingInputSchema).array() ]).optional(),
  createMany: z.lazy(() => FollowCreateManyFollowingInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => FollowWhereUniqueInputSchema),z.lazy(() => FollowWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => FollowWhereUniqueInputSchema),z.lazy(() => FollowWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => FollowWhereUniqueInputSchema),z.lazy(() => FollowWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => FollowWhereUniqueInputSchema),z.lazy(() => FollowWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => FollowUpdateWithWhereUniqueWithoutFollowingInputSchema),z.lazy(() => FollowUpdateWithWhereUniqueWithoutFollowingInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => FollowUpdateManyWithWhereWithoutFollowingInputSchema),z.lazy(() => FollowUpdateManyWithWhereWithoutFollowingInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => FollowScalarWhereInputSchema),z.lazy(() => FollowScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const IntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.IntFieldUpdateOperationsInput> = z.object({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const ActivationTokenUncheckedUpdateOneWithoutUserNestedInputSchema: z.ZodType<Prisma.ActivationTokenUncheckedUpdateOneWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => ActivationTokenCreateWithoutUserInputSchema),z.lazy(() => ActivationTokenUncheckedCreateWithoutUserInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ActivationTokenCreateOrConnectWithoutUserInputSchema).optional(),
  upsert: z.lazy(() => ActivationTokenUpsertWithoutUserInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => ActivationTokenWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => ActivationTokenWhereInputSchema) ]).optional(),
  connect: z.lazy(() => ActivationTokenWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ActivationTokenUpdateToOneWithWhereWithoutUserInputSchema),z.lazy(() => ActivationTokenUpdateWithoutUserInputSchema),z.lazy(() => ActivationTokenUncheckedUpdateWithoutUserInputSchema) ]).optional(),
}).strict();

export const PasswordResetTokenUncheckedUpdateOneWithoutUserNestedInputSchema: z.ZodType<Prisma.PasswordResetTokenUncheckedUpdateOneWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => PasswordResetTokenCreateWithoutUserInputSchema),z.lazy(() => PasswordResetTokenUncheckedCreateWithoutUserInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PasswordResetTokenCreateOrConnectWithoutUserInputSchema).optional(),
  upsert: z.lazy(() => PasswordResetTokenUpsertWithoutUserInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => PasswordResetTokenWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => PasswordResetTokenWhereInputSchema) ]).optional(),
  connect: z.lazy(() => PasswordResetTokenWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => PasswordResetTokenUpdateToOneWithWhereWithoutUserInputSchema),z.lazy(() => PasswordResetTokenUpdateWithoutUserInputSchema),z.lazy(() => PasswordResetTokenUncheckedUpdateWithoutUserInputSchema) ]).optional(),
}).strict();

export const ArticleUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.ArticleUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => ArticleCreateWithoutUserInputSchema),z.lazy(() => ArticleCreateWithoutUserInputSchema).array(),z.lazy(() => ArticleUncheckedCreateWithoutUserInputSchema),z.lazy(() => ArticleUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ArticleCreateOrConnectWithoutUserInputSchema),z.lazy(() => ArticleCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ArticleUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ArticleUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ArticleCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ArticleWhereUniqueInputSchema),z.lazy(() => ArticleWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ArticleWhereUniqueInputSchema),z.lazy(() => ArticleWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ArticleWhereUniqueInputSchema),z.lazy(() => ArticleWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ArticleWhereUniqueInputSchema),z.lazy(() => ArticleWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ArticleUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ArticleUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ArticleUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => ArticleUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ArticleScalarWhereInputSchema),z.lazy(() => ArticleScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const SavedArticleUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.SavedArticleUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => SavedArticleCreateWithoutUserInputSchema),z.lazy(() => SavedArticleCreateWithoutUserInputSchema).array(),z.lazy(() => SavedArticleUncheckedCreateWithoutUserInputSchema),z.lazy(() => SavedArticleUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SavedArticleCreateOrConnectWithoutUserInputSchema),z.lazy(() => SavedArticleCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => SavedArticleUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => SavedArticleUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => SavedArticleCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => SavedArticleWhereUniqueInputSchema),z.lazy(() => SavedArticleWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => SavedArticleWhereUniqueInputSchema),z.lazy(() => SavedArticleWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => SavedArticleWhereUniqueInputSchema),z.lazy(() => SavedArticleWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => SavedArticleWhereUniqueInputSchema),z.lazy(() => SavedArticleWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => SavedArticleUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => SavedArticleUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => SavedArticleUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => SavedArticleUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => SavedArticleScalarWhereInputSchema),z.lazy(() => SavedArticleScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const TagUncheckedUpdateManyWithoutUsersNestedInputSchema: z.ZodType<Prisma.TagUncheckedUpdateManyWithoutUsersNestedInput> = z.object({
  create: z.union([ z.lazy(() => TagCreateWithoutUsersInputSchema),z.lazy(() => TagCreateWithoutUsersInputSchema).array(),z.lazy(() => TagUncheckedCreateWithoutUsersInputSchema),z.lazy(() => TagUncheckedCreateWithoutUsersInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TagCreateOrConnectWithoutUsersInputSchema),z.lazy(() => TagCreateOrConnectWithoutUsersInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TagUpsertWithWhereUniqueWithoutUsersInputSchema),z.lazy(() => TagUpsertWithWhereUniqueWithoutUsersInputSchema).array() ]).optional(),
  set: z.union([ z.lazy(() => TagWhereUniqueInputSchema),z.lazy(() => TagWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TagWhereUniqueInputSchema),z.lazy(() => TagWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TagWhereUniqueInputSchema),z.lazy(() => TagWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TagWhereUniqueInputSchema),z.lazy(() => TagWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TagUpdateWithWhereUniqueWithoutUsersInputSchema),z.lazy(() => TagUpdateWithWhereUniqueWithoutUsersInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TagUpdateManyWithWhereWithoutUsersInputSchema),z.lazy(() => TagUpdateManyWithWhereWithoutUsersInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TagScalarWhereInputSchema),z.lazy(() => TagScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const CommentUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.CommentUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => CommentCreateWithoutUserInputSchema),z.lazy(() => CommentCreateWithoutUserInputSchema).array(),z.lazy(() => CommentUncheckedCreateWithoutUserInputSchema),z.lazy(() => CommentUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CommentCreateOrConnectWithoutUserInputSchema),z.lazy(() => CommentCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CommentUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => CommentUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CommentCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CommentWhereUniqueInputSchema),z.lazy(() => CommentWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CommentWhereUniqueInputSchema),z.lazy(() => CommentWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CommentWhereUniqueInputSchema),z.lazy(() => CommentWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CommentWhereUniqueInputSchema),z.lazy(() => CommentWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CommentUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => CommentUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CommentUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => CommentUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CommentScalarWhereInputSchema),z.lazy(() => CommentScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ReactionUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.ReactionUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => ReactionCreateWithoutUserInputSchema),z.lazy(() => ReactionCreateWithoutUserInputSchema).array(),z.lazy(() => ReactionUncheckedCreateWithoutUserInputSchema),z.lazy(() => ReactionUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ReactionCreateOrConnectWithoutUserInputSchema),z.lazy(() => ReactionCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ReactionUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ReactionUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ReactionCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ReactionWhereUniqueInputSchema),z.lazy(() => ReactionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ReactionWhereUniqueInputSchema),z.lazy(() => ReactionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ReactionWhereUniqueInputSchema),z.lazy(() => ReactionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ReactionWhereUniqueInputSchema),z.lazy(() => ReactionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ReactionUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ReactionUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ReactionUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => ReactionUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ReactionScalarWhereInputSchema),z.lazy(() => ReactionScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ViewUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.ViewUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => ViewCreateWithoutUserInputSchema),z.lazy(() => ViewCreateWithoutUserInputSchema).array(),z.lazy(() => ViewUncheckedCreateWithoutUserInputSchema),z.lazy(() => ViewUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ViewCreateOrConnectWithoutUserInputSchema),z.lazy(() => ViewCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ViewUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ViewUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ViewCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ViewWhereUniqueInputSchema),z.lazy(() => ViewWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ViewWhereUniqueInputSchema),z.lazy(() => ViewWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ViewWhereUniqueInputSchema),z.lazy(() => ViewWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ViewWhereUniqueInputSchema),z.lazy(() => ViewWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ViewUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ViewUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ViewUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => ViewUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ViewScalarWhereInputSchema),z.lazy(() => ViewScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const FollowUncheckedUpdateManyWithoutFollowerNestedInputSchema: z.ZodType<Prisma.FollowUncheckedUpdateManyWithoutFollowerNestedInput> = z.object({
  create: z.union([ z.lazy(() => FollowCreateWithoutFollowerInputSchema),z.lazy(() => FollowCreateWithoutFollowerInputSchema).array(),z.lazy(() => FollowUncheckedCreateWithoutFollowerInputSchema),z.lazy(() => FollowUncheckedCreateWithoutFollowerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => FollowCreateOrConnectWithoutFollowerInputSchema),z.lazy(() => FollowCreateOrConnectWithoutFollowerInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => FollowUpsertWithWhereUniqueWithoutFollowerInputSchema),z.lazy(() => FollowUpsertWithWhereUniqueWithoutFollowerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => FollowCreateManyFollowerInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => FollowWhereUniqueInputSchema),z.lazy(() => FollowWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => FollowWhereUniqueInputSchema),z.lazy(() => FollowWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => FollowWhereUniqueInputSchema),z.lazy(() => FollowWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => FollowWhereUniqueInputSchema),z.lazy(() => FollowWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => FollowUpdateWithWhereUniqueWithoutFollowerInputSchema),z.lazy(() => FollowUpdateWithWhereUniqueWithoutFollowerInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => FollowUpdateManyWithWhereWithoutFollowerInputSchema),z.lazy(() => FollowUpdateManyWithWhereWithoutFollowerInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => FollowScalarWhereInputSchema),z.lazy(() => FollowScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const FollowUncheckedUpdateManyWithoutFollowingNestedInputSchema: z.ZodType<Prisma.FollowUncheckedUpdateManyWithoutFollowingNestedInput> = z.object({
  create: z.union([ z.lazy(() => FollowCreateWithoutFollowingInputSchema),z.lazy(() => FollowCreateWithoutFollowingInputSchema).array(),z.lazy(() => FollowUncheckedCreateWithoutFollowingInputSchema),z.lazy(() => FollowUncheckedCreateWithoutFollowingInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => FollowCreateOrConnectWithoutFollowingInputSchema),z.lazy(() => FollowCreateOrConnectWithoutFollowingInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => FollowUpsertWithWhereUniqueWithoutFollowingInputSchema),z.lazy(() => FollowUpsertWithWhereUniqueWithoutFollowingInputSchema).array() ]).optional(),
  createMany: z.lazy(() => FollowCreateManyFollowingInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => FollowWhereUniqueInputSchema),z.lazy(() => FollowWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => FollowWhereUniqueInputSchema),z.lazy(() => FollowWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => FollowWhereUniqueInputSchema),z.lazy(() => FollowWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => FollowWhereUniqueInputSchema),z.lazy(() => FollowWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => FollowUpdateWithWhereUniqueWithoutFollowingInputSchema),z.lazy(() => FollowUpdateWithWhereUniqueWithoutFollowingInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => FollowUpdateManyWithWhereWithoutFollowingInputSchema),z.lazy(() => FollowUpdateManyWithWhereWithoutFollowingInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => FollowScalarWhereInputSchema),z.lazy(() => FollowScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutPasswordResetTokenInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutPasswordResetTokenInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutPasswordResetTokenInputSchema),z.lazy(() => UserUncheckedCreateWithoutPasswordResetTokenInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutPasswordResetTokenInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const UserUpdateOneRequiredWithoutPasswordResetTokenNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutPasswordResetTokenNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutPasswordResetTokenInputSchema),z.lazy(() => UserUncheckedCreateWithoutPasswordResetTokenInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutPasswordResetTokenInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutPasswordResetTokenInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutPasswordResetTokenInputSchema),z.lazy(() => UserUpdateWithoutPasswordResetTokenInputSchema),z.lazy(() => UserUncheckedUpdateWithoutPasswordResetTokenInputSchema) ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutActivationTokenInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutActivationTokenInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutActivationTokenInputSchema),z.lazy(() => UserUncheckedCreateWithoutActivationTokenInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutActivationTokenInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const UserUpdateOneRequiredWithoutActivationTokenNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutActivationTokenNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutActivationTokenInputSchema),z.lazy(() => UserUncheckedCreateWithoutActivationTokenInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutActivationTokenInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutActivationTokenInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutActivationTokenInputSchema),z.lazy(() => UserUpdateWithoutActivationTokenInputSchema),z.lazy(() => UserUncheckedUpdateWithoutActivationTokenInputSchema) ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutArticlesInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutArticlesInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutArticlesInputSchema),z.lazy(() => UserUncheckedCreateWithoutArticlesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutArticlesInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const TagCreateNestedManyWithoutArticlesInputSchema: z.ZodType<Prisma.TagCreateNestedManyWithoutArticlesInput> = z.object({
  create: z.union([ z.lazy(() => TagCreateWithoutArticlesInputSchema),z.lazy(() => TagCreateWithoutArticlesInputSchema).array(),z.lazy(() => TagUncheckedCreateWithoutArticlesInputSchema),z.lazy(() => TagUncheckedCreateWithoutArticlesInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TagCreateOrConnectWithoutArticlesInputSchema),z.lazy(() => TagCreateOrConnectWithoutArticlesInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TagWhereUniqueInputSchema),z.lazy(() => TagWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const SavedArticleCreateNestedManyWithoutArticleInputSchema: z.ZodType<Prisma.SavedArticleCreateNestedManyWithoutArticleInput> = z.object({
  create: z.union([ z.lazy(() => SavedArticleCreateWithoutArticleInputSchema),z.lazy(() => SavedArticleCreateWithoutArticleInputSchema).array(),z.lazy(() => SavedArticleUncheckedCreateWithoutArticleInputSchema),z.lazy(() => SavedArticleUncheckedCreateWithoutArticleInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SavedArticleCreateOrConnectWithoutArticleInputSchema),z.lazy(() => SavedArticleCreateOrConnectWithoutArticleInputSchema).array() ]).optional(),
  createMany: z.lazy(() => SavedArticleCreateManyArticleInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => SavedArticleWhereUniqueInputSchema),z.lazy(() => SavedArticleWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const CommentCreateNestedManyWithoutArticleInputSchema: z.ZodType<Prisma.CommentCreateNestedManyWithoutArticleInput> = z.object({
  create: z.union([ z.lazy(() => CommentCreateWithoutArticleInputSchema),z.lazy(() => CommentCreateWithoutArticleInputSchema).array(),z.lazy(() => CommentUncheckedCreateWithoutArticleInputSchema),z.lazy(() => CommentUncheckedCreateWithoutArticleInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CommentCreateOrConnectWithoutArticleInputSchema),z.lazy(() => CommentCreateOrConnectWithoutArticleInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CommentCreateManyArticleInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CommentWhereUniqueInputSchema),z.lazy(() => CommentWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ReactionCreateNestedManyWithoutArticleInputSchema: z.ZodType<Prisma.ReactionCreateNestedManyWithoutArticleInput> = z.object({
  create: z.union([ z.lazy(() => ReactionCreateWithoutArticleInputSchema),z.lazy(() => ReactionCreateWithoutArticleInputSchema).array(),z.lazy(() => ReactionUncheckedCreateWithoutArticleInputSchema),z.lazy(() => ReactionUncheckedCreateWithoutArticleInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ReactionCreateOrConnectWithoutArticleInputSchema),z.lazy(() => ReactionCreateOrConnectWithoutArticleInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ReactionCreateManyArticleInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ReactionWhereUniqueInputSchema),z.lazy(() => ReactionWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ViewCreateNestedManyWithoutArticleInputSchema: z.ZodType<Prisma.ViewCreateNestedManyWithoutArticleInput> = z.object({
  create: z.union([ z.lazy(() => ViewCreateWithoutArticleInputSchema),z.lazy(() => ViewCreateWithoutArticleInputSchema).array(),z.lazy(() => ViewUncheckedCreateWithoutArticleInputSchema),z.lazy(() => ViewUncheckedCreateWithoutArticleInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ViewCreateOrConnectWithoutArticleInputSchema),z.lazy(() => ViewCreateOrConnectWithoutArticleInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ViewCreateManyArticleInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ViewWhereUniqueInputSchema),z.lazy(() => ViewWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const TagUncheckedCreateNestedManyWithoutArticlesInputSchema: z.ZodType<Prisma.TagUncheckedCreateNestedManyWithoutArticlesInput> = z.object({
  create: z.union([ z.lazy(() => TagCreateWithoutArticlesInputSchema),z.lazy(() => TagCreateWithoutArticlesInputSchema).array(),z.lazy(() => TagUncheckedCreateWithoutArticlesInputSchema),z.lazy(() => TagUncheckedCreateWithoutArticlesInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TagCreateOrConnectWithoutArticlesInputSchema),z.lazy(() => TagCreateOrConnectWithoutArticlesInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TagWhereUniqueInputSchema),z.lazy(() => TagWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const SavedArticleUncheckedCreateNestedManyWithoutArticleInputSchema: z.ZodType<Prisma.SavedArticleUncheckedCreateNestedManyWithoutArticleInput> = z.object({
  create: z.union([ z.lazy(() => SavedArticleCreateWithoutArticleInputSchema),z.lazy(() => SavedArticleCreateWithoutArticleInputSchema).array(),z.lazy(() => SavedArticleUncheckedCreateWithoutArticleInputSchema),z.lazy(() => SavedArticleUncheckedCreateWithoutArticleInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SavedArticleCreateOrConnectWithoutArticleInputSchema),z.lazy(() => SavedArticleCreateOrConnectWithoutArticleInputSchema).array() ]).optional(),
  createMany: z.lazy(() => SavedArticleCreateManyArticleInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => SavedArticleWhereUniqueInputSchema),z.lazy(() => SavedArticleWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const CommentUncheckedCreateNestedManyWithoutArticleInputSchema: z.ZodType<Prisma.CommentUncheckedCreateNestedManyWithoutArticleInput> = z.object({
  create: z.union([ z.lazy(() => CommentCreateWithoutArticleInputSchema),z.lazy(() => CommentCreateWithoutArticleInputSchema).array(),z.lazy(() => CommentUncheckedCreateWithoutArticleInputSchema),z.lazy(() => CommentUncheckedCreateWithoutArticleInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CommentCreateOrConnectWithoutArticleInputSchema),z.lazy(() => CommentCreateOrConnectWithoutArticleInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CommentCreateManyArticleInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CommentWhereUniqueInputSchema),z.lazy(() => CommentWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ReactionUncheckedCreateNestedManyWithoutArticleInputSchema: z.ZodType<Prisma.ReactionUncheckedCreateNestedManyWithoutArticleInput> = z.object({
  create: z.union([ z.lazy(() => ReactionCreateWithoutArticleInputSchema),z.lazy(() => ReactionCreateWithoutArticleInputSchema).array(),z.lazy(() => ReactionUncheckedCreateWithoutArticleInputSchema),z.lazy(() => ReactionUncheckedCreateWithoutArticleInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ReactionCreateOrConnectWithoutArticleInputSchema),z.lazy(() => ReactionCreateOrConnectWithoutArticleInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ReactionCreateManyArticleInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ReactionWhereUniqueInputSchema),z.lazy(() => ReactionWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ViewUncheckedCreateNestedManyWithoutArticleInputSchema: z.ZodType<Prisma.ViewUncheckedCreateNestedManyWithoutArticleInput> = z.object({
  create: z.union([ z.lazy(() => ViewCreateWithoutArticleInputSchema),z.lazy(() => ViewCreateWithoutArticleInputSchema).array(),z.lazy(() => ViewUncheckedCreateWithoutArticleInputSchema),z.lazy(() => ViewUncheckedCreateWithoutArticleInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ViewCreateOrConnectWithoutArticleInputSchema),z.lazy(() => ViewCreateOrConnectWithoutArticleInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ViewCreateManyArticleInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ViewWhereUniqueInputSchema),z.lazy(() => ViewWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const BoolFieldUpdateOperationsInputSchema: z.ZodType<Prisma.BoolFieldUpdateOperationsInput> = z.object({
  set: z.boolean().optional()
}).strict();

export const UserUpdateOneRequiredWithoutArticlesNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutArticlesNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutArticlesInputSchema),z.lazy(() => UserUncheckedCreateWithoutArticlesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutArticlesInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutArticlesInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutArticlesInputSchema),z.lazy(() => UserUpdateWithoutArticlesInputSchema),z.lazy(() => UserUncheckedUpdateWithoutArticlesInputSchema) ]).optional(),
}).strict();

export const TagUpdateManyWithoutArticlesNestedInputSchema: z.ZodType<Prisma.TagUpdateManyWithoutArticlesNestedInput> = z.object({
  create: z.union([ z.lazy(() => TagCreateWithoutArticlesInputSchema),z.lazy(() => TagCreateWithoutArticlesInputSchema).array(),z.lazy(() => TagUncheckedCreateWithoutArticlesInputSchema),z.lazy(() => TagUncheckedCreateWithoutArticlesInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TagCreateOrConnectWithoutArticlesInputSchema),z.lazy(() => TagCreateOrConnectWithoutArticlesInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TagUpsertWithWhereUniqueWithoutArticlesInputSchema),z.lazy(() => TagUpsertWithWhereUniqueWithoutArticlesInputSchema).array() ]).optional(),
  set: z.union([ z.lazy(() => TagWhereUniqueInputSchema),z.lazy(() => TagWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TagWhereUniqueInputSchema),z.lazy(() => TagWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TagWhereUniqueInputSchema),z.lazy(() => TagWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TagWhereUniqueInputSchema),z.lazy(() => TagWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TagUpdateWithWhereUniqueWithoutArticlesInputSchema),z.lazy(() => TagUpdateWithWhereUniqueWithoutArticlesInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TagUpdateManyWithWhereWithoutArticlesInputSchema),z.lazy(() => TagUpdateManyWithWhereWithoutArticlesInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TagScalarWhereInputSchema),z.lazy(() => TagScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const SavedArticleUpdateManyWithoutArticleNestedInputSchema: z.ZodType<Prisma.SavedArticleUpdateManyWithoutArticleNestedInput> = z.object({
  create: z.union([ z.lazy(() => SavedArticleCreateWithoutArticleInputSchema),z.lazy(() => SavedArticleCreateWithoutArticleInputSchema).array(),z.lazy(() => SavedArticleUncheckedCreateWithoutArticleInputSchema),z.lazy(() => SavedArticleUncheckedCreateWithoutArticleInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SavedArticleCreateOrConnectWithoutArticleInputSchema),z.lazy(() => SavedArticleCreateOrConnectWithoutArticleInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => SavedArticleUpsertWithWhereUniqueWithoutArticleInputSchema),z.lazy(() => SavedArticleUpsertWithWhereUniqueWithoutArticleInputSchema).array() ]).optional(),
  createMany: z.lazy(() => SavedArticleCreateManyArticleInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => SavedArticleWhereUniqueInputSchema),z.lazy(() => SavedArticleWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => SavedArticleWhereUniqueInputSchema),z.lazy(() => SavedArticleWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => SavedArticleWhereUniqueInputSchema),z.lazy(() => SavedArticleWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => SavedArticleWhereUniqueInputSchema),z.lazy(() => SavedArticleWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => SavedArticleUpdateWithWhereUniqueWithoutArticleInputSchema),z.lazy(() => SavedArticleUpdateWithWhereUniqueWithoutArticleInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => SavedArticleUpdateManyWithWhereWithoutArticleInputSchema),z.lazy(() => SavedArticleUpdateManyWithWhereWithoutArticleInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => SavedArticleScalarWhereInputSchema),z.lazy(() => SavedArticleScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const CommentUpdateManyWithoutArticleNestedInputSchema: z.ZodType<Prisma.CommentUpdateManyWithoutArticleNestedInput> = z.object({
  create: z.union([ z.lazy(() => CommentCreateWithoutArticleInputSchema),z.lazy(() => CommentCreateWithoutArticleInputSchema).array(),z.lazy(() => CommentUncheckedCreateWithoutArticleInputSchema),z.lazy(() => CommentUncheckedCreateWithoutArticleInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CommentCreateOrConnectWithoutArticleInputSchema),z.lazy(() => CommentCreateOrConnectWithoutArticleInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CommentUpsertWithWhereUniqueWithoutArticleInputSchema),z.lazy(() => CommentUpsertWithWhereUniqueWithoutArticleInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CommentCreateManyArticleInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CommentWhereUniqueInputSchema),z.lazy(() => CommentWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CommentWhereUniqueInputSchema),z.lazy(() => CommentWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CommentWhereUniqueInputSchema),z.lazy(() => CommentWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CommentWhereUniqueInputSchema),z.lazy(() => CommentWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CommentUpdateWithWhereUniqueWithoutArticleInputSchema),z.lazy(() => CommentUpdateWithWhereUniqueWithoutArticleInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CommentUpdateManyWithWhereWithoutArticleInputSchema),z.lazy(() => CommentUpdateManyWithWhereWithoutArticleInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CommentScalarWhereInputSchema),z.lazy(() => CommentScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ReactionUpdateManyWithoutArticleNestedInputSchema: z.ZodType<Prisma.ReactionUpdateManyWithoutArticleNestedInput> = z.object({
  create: z.union([ z.lazy(() => ReactionCreateWithoutArticleInputSchema),z.lazy(() => ReactionCreateWithoutArticleInputSchema).array(),z.lazy(() => ReactionUncheckedCreateWithoutArticleInputSchema),z.lazy(() => ReactionUncheckedCreateWithoutArticleInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ReactionCreateOrConnectWithoutArticleInputSchema),z.lazy(() => ReactionCreateOrConnectWithoutArticleInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ReactionUpsertWithWhereUniqueWithoutArticleInputSchema),z.lazy(() => ReactionUpsertWithWhereUniqueWithoutArticleInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ReactionCreateManyArticleInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ReactionWhereUniqueInputSchema),z.lazy(() => ReactionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ReactionWhereUniqueInputSchema),z.lazy(() => ReactionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ReactionWhereUniqueInputSchema),z.lazy(() => ReactionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ReactionWhereUniqueInputSchema),z.lazy(() => ReactionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ReactionUpdateWithWhereUniqueWithoutArticleInputSchema),z.lazy(() => ReactionUpdateWithWhereUniqueWithoutArticleInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ReactionUpdateManyWithWhereWithoutArticleInputSchema),z.lazy(() => ReactionUpdateManyWithWhereWithoutArticleInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ReactionScalarWhereInputSchema),z.lazy(() => ReactionScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ViewUpdateManyWithoutArticleNestedInputSchema: z.ZodType<Prisma.ViewUpdateManyWithoutArticleNestedInput> = z.object({
  create: z.union([ z.lazy(() => ViewCreateWithoutArticleInputSchema),z.lazy(() => ViewCreateWithoutArticleInputSchema).array(),z.lazy(() => ViewUncheckedCreateWithoutArticleInputSchema),z.lazy(() => ViewUncheckedCreateWithoutArticleInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ViewCreateOrConnectWithoutArticleInputSchema),z.lazy(() => ViewCreateOrConnectWithoutArticleInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ViewUpsertWithWhereUniqueWithoutArticleInputSchema),z.lazy(() => ViewUpsertWithWhereUniqueWithoutArticleInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ViewCreateManyArticleInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ViewWhereUniqueInputSchema),z.lazy(() => ViewWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ViewWhereUniqueInputSchema),z.lazy(() => ViewWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ViewWhereUniqueInputSchema),z.lazy(() => ViewWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ViewWhereUniqueInputSchema),z.lazy(() => ViewWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ViewUpdateWithWhereUniqueWithoutArticleInputSchema),z.lazy(() => ViewUpdateWithWhereUniqueWithoutArticleInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ViewUpdateManyWithWhereWithoutArticleInputSchema),z.lazy(() => ViewUpdateManyWithWhereWithoutArticleInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ViewScalarWhereInputSchema),z.lazy(() => ViewScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const TagUncheckedUpdateManyWithoutArticlesNestedInputSchema: z.ZodType<Prisma.TagUncheckedUpdateManyWithoutArticlesNestedInput> = z.object({
  create: z.union([ z.lazy(() => TagCreateWithoutArticlesInputSchema),z.lazy(() => TagCreateWithoutArticlesInputSchema).array(),z.lazy(() => TagUncheckedCreateWithoutArticlesInputSchema),z.lazy(() => TagUncheckedCreateWithoutArticlesInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TagCreateOrConnectWithoutArticlesInputSchema),z.lazy(() => TagCreateOrConnectWithoutArticlesInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TagUpsertWithWhereUniqueWithoutArticlesInputSchema),z.lazy(() => TagUpsertWithWhereUniqueWithoutArticlesInputSchema).array() ]).optional(),
  set: z.union([ z.lazy(() => TagWhereUniqueInputSchema),z.lazy(() => TagWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TagWhereUniqueInputSchema),z.lazy(() => TagWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TagWhereUniqueInputSchema),z.lazy(() => TagWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TagWhereUniqueInputSchema),z.lazy(() => TagWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TagUpdateWithWhereUniqueWithoutArticlesInputSchema),z.lazy(() => TagUpdateWithWhereUniqueWithoutArticlesInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TagUpdateManyWithWhereWithoutArticlesInputSchema),z.lazy(() => TagUpdateManyWithWhereWithoutArticlesInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TagScalarWhereInputSchema),z.lazy(() => TagScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const SavedArticleUncheckedUpdateManyWithoutArticleNestedInputSchema: z.ZodType<Prisma.SavedArticleUncheckedUpdateManyWithoutArticleNestedInput> = z.object({
  create: z.union([ z.lazy(() => SavedArticleCreateWithoutArticleInputSchema),z.lazy(() => SavedArticleCreateWithoutArticleInputSchema).array(),z.lazy(() => SavedArticleUncheckedCreateWithoutArticleInputSchema),z.lazy(() => SavedArticleUncheckedCreateWithoutArticleInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SavedArticleCreateOrConnectWithoutArticleInputSchema),z.lazy(() => SavedArticleCreateOrConnectWithoutArticleInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => SavedArticleUpsertWithWhereUniqueWithoutArticleInputSchema),z.lazy(() => SavedArticleUpsertWithWhereUniqueWithoutArticleInputSchema).array() ]).optional(),
  createMany: z.lazy(() => SavedArticleCreateManyArticleInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => SavedArticleWhereUniqueInputSchema),z.lazy(() => SavedArticleWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => SavedArticleWhereUniqueInputSchema),z.lazy(() => SavedArticleWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => SavedArticleWhereUniqueInputSchema),z.lazy(() => SavedArticleWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => SavedArticleWhereUniqueInputSchema),z.lazy(() => SavedArticleWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => SavedArticleUpdateWithWhereUniqueWithoutArticleInputSchema),z.lazy(() => SavedArticleUpdateWithWhereUniqueWithoutArticleInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => SavedArticleUpdateManyWithWhereWithoutArticleInputSchema),z.lazy(() => SavedArticleUpdateManyWithWhereWithoutArticleInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => SavedArticleScalarWhereInputSchema),z.lazy(() => SavedArticleScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const CommentUncheckedUpdateManyWithoutArticleNestedInputSchema: z.ZodType<Prisma.CommentUncheckedUpdateManyWithoutArticleNestedInput> = z.object({
  create: z.union([ z.lazy(() => CommentCreateWithoutArticleInputSchema),z.lazy(() => CommentCreateWithoutArticleInputSchema).array(),z.lazy(() => CommentUncheckedCreateWithoutArticleInputSchema),z.lazy(() => CommentUncheckedCreateWithoutArticleInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CommentCreateOrConnectWithoutArticleInputSchema),z.lazy(() => CommentCreateOrConnectWithoutArticleInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CommentUpsertWithWhereUniqueWithoutArticleInputSchema),z.lazy(() => CommentUpsertWithWhereUniqueWithoutArticleInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CommentCreateManyArticleInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CommentWhereUniqueInputSchema),z.lazy(() => CommentWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CommentWhereUniqueInputSchema),z.lazy(() => CommentWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CommentWhereUniqueInputSchema),z.lazy(() => CommentWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CommentWhereUniqueInputSchema),z.lazy(() => CommentWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CommentUpdateWithWhereUniqueWithoutArticleInputSchema),z.lazy(() => CommentUpdateWithWhereUniqueWithoutArticleInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CommentUpdateManyWithWhereWithoutArticleInputSchema),z.lazy(() => CommentUpdateManyWithWhereWithoutArticleInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CommentScalarWhereInputSchema),z.lazy(() => CommentScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ReactionUncheckedUpdateManyWithoutArticleNestedInputSchema: z.ZodType<Prisma.ReactionUncheckedUpdateManyWithoutArticleNestedInput> = z.object({
  create: z.union([ z.lazy(() => ReactionCreateWithoutArticleInputSchema),z.lazy(() => ReactionCreateWithoutArticleInputSchema).array(),z.lazy(() => ReactionUncheckedCreateWithoutArticleInputSchema),z.lazy(() => ReactionUncheckedCreateWithoutArticleInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ReactionCreateOrConnectWithoutArticleInputSchema),z.lazy(() => ReactionCreateOrConnectWithoutArticleInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ReactionUpsertWithWhereUniqueWithoutArticleInputSchema),z.lazy(() => ReactionUpsertWithWhereUniqueWithoutArticleInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ReactionCreateManyArticleInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ReactionWhereUniqueInputSchema),z.lazy(() => ReactionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ReactionWhereUniqueInputSchema),z.lazy(() => ReactionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ReactionWhereUniqueInputSchema),z.lazy(() => ReactionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ReactionWhereUniqueInputSchema),z.lazy(() => ReactionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ReactionUpdateWithWhereUniqueWithoutArticleInputSchema),z.lazy(() => ReactionUpdateWithWhereUniqueWithoutArticleInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ReactionUpdateManyWithWhereWithoutArticleInputSchema),z.lazy(() => ReactionUpdateManyWithWhereWithoutArticleInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ReactionScalarWhereInputSchema),z.lazy(() => ReactionScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ViewUncheckedUpdateManyWithoutArticleNestedInputSchema: z.ZodType<Prisma.ViewUncheckedUpdateManyWithoutArticleNestedInput> = z.object({
  create: z.union([ z.lazy(() => ViewCreateWithoutArticleInputSchema),z.lazy(() => ViewCreateWithoutArticleInputSchema).array(),z.lazy(() => ViewUncheckedCreateWithoutArticleInputSchema),z.lazy(() => ViewUncheckedCreateWithoutArticleInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ViewCreateOrConnectWithoutArticleInputSchema),z.lazy(() => ViewCreateOrConnectWithoutArticleInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ViewUpsertWithWhereUniqueWithoutArticleInputSchema),z.lazy(() => ViewUpsertWithWhereUniqueWithoutArticleInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ViewCreateManyArticleInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ViewWhereUniqueInputSchema),z.lazy(() => ViewWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ViewWhereUniqueInputSchema),z.lazy(() => ViewWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ViewWhereUniqueInputSchema),z.lazy(() => ViewWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ViewWhereUniqueInputSchema),z.lazy(() => ViewWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ViewUpdateWithWhereUniqueWithoutArticleInputSchema),z.lazy(() => ViewUpdateWithWhereUniqueWithoutArticleInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ViewUpdateManyWithWhereWithoutArticleInputSchema),z.lazy(() => ViewUpdateManyWithWhereWithoutArticleInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ViewScalarWhereInputSchema),z.lazy(() => ViewScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutSavedArticlesInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutSavedArticlesInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutSavedArticlesInputSchema),z.lazy(() => UserUncheckedCreateWithoutSavedArticlesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutSavedArticlesInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const ArticleCreateNestedOneWithoutSavedArticlesInputSchema: z.ZodType<Prisma.ArticleCreateNestedOneWithoutSavedArticlesInput> = z.object({
  create: z.union([ z.lazy(() => ArticleCreateWithoutSavedArticlesInputSchema),z.lazy(() => ArticleUncheckedCreateWithoutSavedArticlesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ArticleCreateOrConnectWithoutSavedArticlesInputSchema).optional(),
  connect: z.lazy(() => ArticleWhereUniqueInputSchema).optional()
}).strict();

export const UserUpdateOneRequiredWithoutSavedArticlesNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutSavedArticlesNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutSavedArticlesInputSchema),z.lazy(() => UserUncheckedCreateWithoutSavedArticlesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutSavedArticlesInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutSavedArticlesInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutSavedArticlesInputSchema),z.lazy(() => UserUpdateWithoutSavedArticlesInputSchema),z.lazy(() => UserUncheckedUpdateWithoutSavedArticlesInputSchema) ]).optional(),
}).strict();

export const ArticleUpdateOneRequiredWithoutSavedArticlesNestedInputSchema: z.ZodType<Prisma.ArticleUpdateOneRequiredWithoutSavedArticlesNestedInput> = z.object({
  create: z.union([ z.lazy(() => ArticleCreateWithoutSavedArticlesInputSchema),z.lazy(() => ArticleUncheckedCreateWithoutSavedArticlesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ArticleCreateOrConnectWithoutSavedArticlesInputSchema).optional(),
  upsert: z.lazy(() => ArticleUpsertWithoutSavedArticlesInputSchema).optional(),
  connect: z.lazy(() => ArticleWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ArticleUpdateToOneWithWhereWithoutSavedArticlesInputSchema),z.lazy(() => ArticleUpdateWithoutSavedArticlesInputSchema),z.lazy(() => ArticleUncheckedUpdateWithoutSavedArticlesInputSchema) ]).optional(),
}).strict();

export const ArticleCreateNestedManyWithoutTagsInputSchema: z.ZodType<Prisma.ArticleCreateNestedManyWithoutTagsInput> = z.object({
  create: z.union([ z.lazy(() => ArticleCreateWithoutTagsInputSchema),z.lazy(() => ArticleCreateWithoutTagsInputSchema).array(),z.lazy(() => ArticleUncheckedCreateWithoutTagsInputSchema),z.lazy(() => ArticleUncheckedCreateWithoutTagsInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ArticleCreateOrConnectWithoutTagsInputSchema),z.lazy(() => ArticleCreateOrConnectWithoutTagsInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ArticleWhereUniqueInputSchema),z.lazy(() => ArticleWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const UserCreateNestedManyWithoutTagsInputSchema: z.ZodType<Prisma.UserCreateNestedManyWithoutTagsInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutTagsInputSchema),z.lazy(() => UserCreateWithoutTagsInputSchema).array(),z.lazy(() => UserUncheckedCreateWithoutTagsInputSchema),z.lazy(() => UserUncheckedCreateWithoutTagsInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserCreateOrConnectWithoutTagsInputSchema),z.lazy(() => UserCreateOrConnectWithoutTagsInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ArticleUncheckedCreateNestedManyWithoutTagsInputSchema: z.ZodType<Prisma.ArticleUncheckedCreateNestedManyWithoutTagsInput> = z.object({
  create: z.union([ z.lazy(() => ArticleCreateWithoutTagsInputSchema),z.lazy(() => ArticleCreateWithoutTagsInputSchema).array(),z.lazy(() => ArticleUncheckedCreateWithoutTagsInputSchema),z.lazy(() => ArticleUncheckedCreateWithoutTagsInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ArticleCreateOrConnectWithoutTagsInputSchema),z.lazy(() => ArticleCreateOrConnectWithoutTagsInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ArticleWhereUniqueInputSchema),z.lazy(() => ArticleWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const UserUncheckedCreateNestedManyWithoutTagsInputSchema: z.ZodType<Prisma.UserUncheckedCreateNestedManyWithoutTagsInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutTagsInputSchema),z.lazy(() => UserCreateWithoutTagsInputSchema).array(),z.lazy(() => UserUncheckedCreateWithoutTagsInputSchema),z.lazy(() => UserUncheckedCreateWithoutTagsInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserCreateOrConnectWithoutTagsInputSchema),z.lazy(() => UserCreateOrConnectWithoutTagsInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ArticleUpdateManyWithoutTagsNestedInputSchema: z.ZodType<Prisma.ArticleUpdateManyWithoutTagsNestedInput> = z.object({
  create: z.union([ z.lazy(() => ArticleCreateWithoutTagsInputSchema),z.lazy(() => ArticleCreateWithoutTagsInputSchema).array(),z.lazy(() => ArticleUncheckedCreateWithoutTagsInputSchema),z.lazy(() => ArticleUncheckedCreateWithoutTagsInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ArticleCreateOrConnectWithoutTagsInputSchema),z.lazy(() => ArticleCreateOrConnectWithoutTagsInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ArticleUpsertWithWhereUniqueWithoutTagsInputSchema),z.lazy(() => ArticleUpsertWithWhereUniqueWithoutTagsInputSchema).array() ]).optional(),
  set: z.union([ z.lazy(() => ArticleWhereUniqueInputSchema),z.lazy(() => ArticleWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ArticleWhereUniqueInputSchema),z.lazy(() => ArticleWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ArticleWhereUniqueInputSchema),z.lazy(() => ArticleWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ArticleWhereUniqueInputSchema),z.lazy(() => ArticleWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ArticleUpdateWithWhereUniqueWithoutTagsInputSchema),z.lazy(() => ArticleUpdateWithWhereUniqueWithoutTagsInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ArticleUpdateManyWithWhereWithoutTagsInputSchema),z.lazy(() => ArticleUpdateManyWithWhereWithoutTagsInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ArticleScalarWhereInputSchema),z.lazy(() => ArticleScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserUpdateManyWithoutTagsNestedInputSchema: z.ZodType<Prisma.UserUpdateManyWithoutTagsNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutTagsInputSchema),z.lazy(() => UserCreateWithoutTagsInputSchema).array(),z.lazy(() => UserUncheckedCreateWithoutTagsInputSchema),z.lazy(() => UserUncheckedCreateWithoutTagsInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserCreateOrConnectWithoutTagsInputSchema),z.lazy(() => UserCreateOrConnectWithoutTagsInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => UserUpsertWithWhereUniqueWithoutTagsInputSchema),z.lazy(() => UserUpsertWithWhereUniqueWithoutTagsInputSchema).array() ]).optional(),
  set: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => UserUpdateWithWhereUniqueWithoutTagsInputSchema),z.lazy(() => UserUpdateWithWhereUniqueWithoutTagsInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => UserUpdateManyWithWhereWithoutTagsInputSchema),z.lazy(() => UserUpdateManyWithWhereWithoutTagsInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => UserScalarWhereInputSchema),z.lazy(() => UserScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ArticleUncheckedUpdateManyWithoutTagsNestedInputSchema: z.ZodType<Prisma.ArticleUncheckedUpdateManyWithoutTagsNestedInput> = z.object({
  create: z.union([ z.lazy(() => ArticleCreateWithoutTagsInputSchema),z.lazy(() => ArticleCreateWithoutTagsInputSchema).array(),z.lazy(() => ArticleUncheckedCreateWithoutTagsInputSchema),z.lazy(() => ArticleUncheckedCreateWithoutTagsInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ArticleCreateOrConnectWithoutTagsInputSchema),z.lazy(() => ArticleCreateOrConnectWithoutTagsInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ArticleUpsertWithWhereUniqueWithoutTagsInputSchema),z.lazy(() => ArticleUpsertWithWhereUniqueWithoutTagsInputSchema).array() ]).optional(),
  set: z.union([ z.lazy(() => ArticleWhereUniqueInputSchema),z.lazy(() => ArticleWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ArticleWhereUniqueInputSchema),z.lazy(() => ArticleWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ArticleWhereUniqueInputSchema),z.lazy(() => ArticleWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ArticleWhereUniqueInputSchema),z.lazy(() => ArticleWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ArticleUpdateWithWhereUniqueWithoutTagsInputSchema),z.lazy(() => ArticleUpdateWithWhereUniqueWithoutTagsInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ArticleUpdateManyWithWhereWithoutTagsInputSchema),z.lazy(() => ArticleUpdateManyWithWhereWithoutTagsInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ArticleScalarWhereInputSchema),z.lazy(() => ArticleScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserUncheckedUpdateManyWithoutTagsNestedInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyWithoutTagsNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutTagsInputSchema),z.lazy(() => UserCreateWithoutTagsInputSchema).array(),z.lazy(() => UserUncheckedCreateWithoutTagsInputSchema),z.lazy(() => UserUncheckedCreateWithoutTagsInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserCreateOrConnectWithoutTagsInputSchema),z.lazy(() => UserCreateOrConnectWithoutTagsInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => UserUpsertWithWhereUniqueWithoutTagsInputSchema),z.lazy(() => UserUpsertWithWhereUniqueWithoutTagsInputSchema).array() ]).optional(),
  set: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => UserUpdateWithWhereUniqueWithoutTagsInputSchema),z.lazy(() => UserUpdateWithWhereUniqueWithoutTagsInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => UserUpdateManyWithWhereWithoutTagsInputSchema),z.lazy(() => UserUpdateManyWithWhereWithoutTagsInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => UserScalarWhereInputSchema),z.lazy(() => UserScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const CommentCreateNestedOneWithoutRepliesInputSchema: z.ZodType<Prisma.CommentCreateNestedOneWithoutRepliesInput> = z.object({
  create: z.union([ z.lazy(() => CommentCreateWithoutRepliesInputSchema),z.lazy(() => CommentUncheckedCreateWithoutRepliesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CommentCreateOrConnectWithoutRepliesInputSchema).optional(),
  connect: z.lazy(() => CommentWhereUniqueInputSchema).optional()
}).strict();

export const CommentCreateNestedManyWithoutParentInputSchema: z.ZodType<Prisma.CommentCreateNestedManyWithoutParentInput> = z.object({
  create: z.union([ z.lazy(() => CommentCreateWithoutParentInputSchema),z.lazy(() => CommentCreateWithoutParentInputSchema).array(),z.lazy(() => CommentUncheckedCreateWithoutParentInputSchema),z.lazy(() => CommentUncheckedCreateWithoutParentInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CommentCreateOrConnectWithoutParentInputSchema),z.lazy(() => CommentCreateOrConnectWithoutParentInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CommentCreateManyParentInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CommentWhereUniqueInputSchema),z.lazy(() => CommentWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutCommentsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutCommentsInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutCommentsInputSchema),z.lazy(() => UserUncheckedCreateWithoutCommentsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutCommentsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const ArticleCreateNestedOneWithoutCommentsInputSchema: z.ZodType<Prisma.ArticleCreateNestedOneWithoutCommentsInput> = z.object({
  create: z.union([ z.lazy(() => ArticleCreateWithoutCommentsInputSchema),z.lazy(() => ArticleUncheckedCreateWithoutCommentsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ArticleCreateOrConnectWithoutCommentsInputSchema).optional(),
  connect: z.lazy(() => ArticleWhereUniqueInputSchema).optional()
}).strict();

export const ReactionCreateNestedManyWithoutCommentInputSchema: z.ZodType<Prisma.ReactionCreateNestedManyWithoutCommentInput> = z.object({
  create: z.union([ z.lazy(() => ReactionCreateWithoutCommentInputSchema),z.lazy(() => ReactionCreateWithoutCommentInputSchema).array(),z.lazy(() => ReactionUncheckedCreateWithoutCommentInputSchema),z.lazy(() => ReactionUncheckedCreateWithoutCommentInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ReactionCreateOrConnectWithoutCommentInputSchema),z.lazy(() => ReactionCreateOrConnectWithoutCommentInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ReactionCreateManyCommentInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ReactionWhereUniqueInputSchema),z.lazy(() => ReactionWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const CommentUncheckedCreateNestedManyWithoutParentInputSchema: z.ZodType<Prisma.CommentUncheckedCreateNestedManyWithoutParentInput> = z.object({
  create: z.union([ z.lazy(() => CommentCreateWithoutParentInputSchema),z.lazy(() => CommentCreateWithoutParentInputSchema).array(),z.lazy(() => CommentUncheckedCreateWithoutParentInputSchema),z.lazy(() => CommentUncheckedCreateWithoutParentInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CommentCreateOrConnectWithoutParentInputSchema),z.lazy(() => CommentCreateOrConnectWithoutParentInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CommentCreateManyParentInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CommentWhereUniqueInputSchema),z.lazy(() => CommentWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ReactionUncheckedCreateNestedManyWithoutCommentInputSchema: z.ZodType<Prisma.ReactionUncheckedCreateNestedManyWithoutCommentInput> = z.object({
  create: z.union([ z.lazy(() => ReactionCreateWithoutCommentInputSchema),z.lazy(() => ReactionCreateWithoutCommentInputSchema).array(),z.lazy(() => ReactionUncheckedCreateWithoutCommentInputSchema),z.lazy(() => ReactionUncheckedCreateWithoutCommentInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ReactionCreateOrConnectWithoutCommentInputSchema),z.lazy(() => ReactionCreateOrConnectWithoutCommentInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ReactionCreateManyCommentInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ReactionWhereUniqueInputSchema),z.lazy(() => ReactionWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const CommentUpdateOneWithoutRepliesNestedInputSchema: z.ZodType<Prisma.CommentUpdateOneWithoutRepliesNestedInput> = z.object({
  create: z.union([ z.lazy(() => CommentCreateWithoutRepliesInputSchema),z.lazy(() => CommentUncheckedCreateWithoutRepliesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CommentCreateOrConnectWithoutRepliesInputSchema).optional(),
  upsert: z.lazy(() => CommentUpsertWithoutRepliesInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => CommentWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => CommentWhereInputSchema) ]).optional(),
  connect: z.lazy(() => CommentWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => CommentUpdateToOneWithWhereWithoutRepliesInputSchema),z.lazy(() => CommentUpdateWithoutRepliesInputSchema),z.lazy(() => CommentUncheckedUpdateWithoutRepliesInputSchema) ]).optional(),
}).strict();

export const CommentUpdateManyWithoutParentNestedInputSchema: z.ZodType<Prisma.CommentUpdateManyWithoutParentNestedInput> = z.object({
  create: z.union([ z.lazy(() => CommentCreateWithoutParentInputSchema),z.lazy(() => CommentCreateWithoutParentInputSchema).array(),z.lazy(() => CommentUncheckedCreateWithoutParentInputSchema),z.lazy(() => CommentUncheckedCreateWithoutParentInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CommentCreateOrConnectWithoutParentInputSchema),z.lazy(() => CommentCreateOrConnectWithoutParentInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CommentUpsertWithWhereUniqueWithoutParentInputSchema),z.lazy(() => CommentUpsertWithWhereUniqueWithoutParentInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CommentCreateManyParentInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CommentWhereUniqueInputSchema),z.lazy(() => CommentWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CommentWhereUniqueInputSchema),z.lazy(() => CommentWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CommentWhereUniqueInputSchema),z.lazy(() => CommentWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CommentWhereUniqueInputSchema),z.lazy(() => CommentWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CommentUpdateWithWhereUniqueWithoutParentInputSchema),z.lazy(() => CommentUpdateWithWhereUniqueWithoutParentInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CommentUpdateManyWithWhereWithoutParentInputSchema),z.lazy(() => CommentUpdateManyWithWhereWithoutParentInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CommentScalarWhereInputSchema),z.lazy(() => CommentScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserUpdateOneRequiredWithoutCommentsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutCommentsNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutCommentsInputSchema),z.lazy(() => UserUncheckedCreateWithoutCommentsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutCommentsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutCommentsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutCommentsInputSchema),z.lazy(() => UserUpdateWithoutCommentsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutCommentsInputSchema) ]).optional(),
}).strict();

export const ArticleUpdateOneRequiredWithoutCommentsNestedInputSchema: z.ZodType<Prisma.ArticleUpdateOneRequiredWithoutCommentsNestedInput> = z.object({
  create: z.union([ z.lazy(() => ArticleCreateWithoutCommentsInputSchema),z.lazy(() => ArticleUncheckedCreateWithoutCommentsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ArticleCreateOrConnectWithoutCommentsInputSchema).optional(),
  upsert: z.lazy(() => ArticleUpsertWithoutCommentsInputSchema).optional(),
  connect: z.lazy(() => ArticleWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ArticleUpdateToOneWithWhereWithoutCommentsInputSchema),z.lazy(() => ArticleUpdateWithoutCommentsInputSchema),z.lazy(() => ArticleUncheckedUpdateWithoutCommentsInputSchema) ]).optional(),
}).strict();

export const ReactionUpdateManyWithoutCommentNestedInputSchema: z.ZodType<Prisma.ReactionUpdateManyWithoutCommentNestedInput> = z.object({
  create: z.union([ z.lazy(() => ReactionCreateWithoutCommentInputSchema),z.lazy(() => ReactionCreateWithoutCommentInputSchema).array(),z.lazy(() => ReactionUncheckedCreateWithoutCommentInputSchema),z.lazy(() => ReactionUncheckedCreateWithoutCommentInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ReactionCreateOrConnectWithoutCommentInputSchema),z.lazy(() => ReactionCreateOrConnectWithoutCommentInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ReactionUpsertWithWhereUniqueWithoutCommentInputSchema),z.lazy(() => ReactionUpsertWithWhereUniqueWithoutCommentInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ReactionCreateManyCommentInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ReactionWhereUniqueInputSchema),z.lazy(() => ReactionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ReactionWhereUniqueInputSchema),z.lazy(() => ReactionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ReactionWhereUniqueInputSchema),z.lazy(() => ReactionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ReactionWhereUniqueInputSchema),z.lazy(() => ReactionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ReactionUpdateWithWhereUniqueWithoutCommentInputSchema),z.lazy(() => ReactionUpdateWithWhereUniqueWithoutCommentInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ReactionUpdateManyWithWhereWithoutCommentInputSchema),z.lazy(() => ReactionUpdateManyWithWhereWithoutCommentInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ReactionScalarWhereInputSchema),z.lazy(() => ReactionScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const CommentUncheckedUpdateManyWithoutParentNestedInputSchema: z.ZodType<Prisma.CommentUncheckedUpdateManyWithoutParentNestedInput> = z.object({
  create: z.union([ z.lazy(() => CommentCreateWithoutParentInputSchema),z.lazy(() => CommentCreateWithoutParentInputSchema).array(),z.lazy(() => CommentUncheckedCreateWithoutParentInputSchema),z.lazy(() => CommentUncheckedCreateWithoutParentInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CommentCreateOrConnectWithoutParentInputSchema),z.lazy(() => CommentCreateOrConnectWithoutParentInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CommentUpsertWithWhereUniqueWithoutParentInputSchema),z.lazy(() => CommentUpsertWithWhereUniqueWithoutParentInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CommentCreateManyParentInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CommentWhereUniqueInputSchema),z.lazy(() => CommentWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CommentWhereUniqueInputSchema),z.lazy(() => CommentWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CommentWhereUniqueInputSchema),z.lazy(() => CommentWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CommentWhereUniqueInputSchema),z.lazy(() => CommentWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CommentUpdateWithWhereUniqueWithoutParentInputSchema),z.lazy(() => CommentUpdateWithWhereUniqueWithoutParentInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CommentUpdateManyWithWhereWithoutParentInputSchema),z.lazy(() => CommentUpdateManyWithWhereWithoutParentInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CommentScalarWhereInputSchema),z.lazy(() => CommentScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ReactionUncheckedUpdateManyWithoutCommentNestedInputSchema: z.ZodType<Prisma.ReactionUncheckedUpdateManyWithoutCommentNestedInput> = z.object({
  create: z.union([ z.lazy(() => ReactionCreateWithoutCommentInputSchema),z.lazy(() => ReactionCreateWithoutCommentInputSchema).array(),z.lazy(() => ReactionUncheckedCreateWithoutCommentInputSchema),z.lazy(() => ReactionUncheckedCreateWithoutCommentInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ReactionCreateOrConnectWithoutCommentInputSchema),z.lazy(() => ReactionCreateOrConnectWithoutCommentInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ReactionUpsertWithWhereUniqueWithoutCommentInputSchema),z.lazy(() => ReactionUpsertWithWhereUniqueWithoutCommentInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ReactionCreateManyCommentInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ReactionWhereUniqueInputSchema),z.lazy(() => ReactionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ReactionWhereUniqueInputSchema),z.lazy(() => ReactionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ReactionWhereUniqueInputSchema),z.lazy(() => ReactionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ReactionWhereUniqueInputSchema),z.lazy(() => ReactionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ReactionUpdateWithWhereUniqueWithoutCommentInputSchema),z.lazy(() => ReactionUpdateWithWhereUniqueWithoutCommentInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ReactionUpdateManyWithWhereWithoutCommentInputSchema),z.lazy(() => ReactionUpdateManyWithWhereWithoutCommentInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ReactionScalarWhereInputSchema),z.lazy(() => ReactionScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutReactionsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutReactionsInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutReactionsInputSchema),z.lazy(() => UserUncheckedCreateWithoutReactionsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutReactionsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const ArticleCreateNestedOneWithoutReactionsInputSchema: z.ZodType<Prisma.ArticleCreateNestedOneWithoutReactionsInput> = z.object({
  create: z.union([ z.lazy(() => ArticleCreateWithoutReactionsInputSchema),z.lazy(() => ArticleUncheckedCreateWithoutReactionsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ArticleCreateOrConnectWithoutReactionsInputSchema).optional(),
  connect: z.lazy(() => ArticleWhereUniqueInputSchema).optional()
}).strict();

export const CommentCreateNestedOneWithoutReactionsInputSchema: z.ZodType<Prisma.CommentCreateNestedOneWithoutReactionsInput> = z.object({
  create: z.union([ z.lazy(() => CommentCreateWithoutReactionsInputSchema),z.lazy(() => CommentUncheckedCreateWithoutReactionsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CommentCreateOrConnectWithoutReactionsInputSchema).optional(),
  connect: z.lazy(() => CommentWhereUniqueInputSchema).optional()
}).strict();

export const EnumReactionTypeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumReactionTypeFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => ReactionTypeSchema).optional()
}).strict();

export const UserUpdateOneRequiredWithoutReactionsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutReactionsNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutReactionsInputSchema),z.lazy(() => UserUncheckedCreateWithoutReactionsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutReactionsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutReactionsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutReactionsInputSchema),z.lazy(() => UserUpdateWithoutReactionsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutReactionsInputSchema) ]).optional(),
}).strict();

export const ArticleUpdateOneWithoutReactionsNestedInputSchema: z.ZodType<Prisma.ArticleUpdateOneWithoutReactionsNestedInput> = z.object({
  create: z.union([ z.lazy(() => ArticleCreateWithoutReactionsInputSchema),z.lazy(() => ArticleUncheckedCreateWithoutReactionsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ArticleCreateOrConnectWithoutReactionsInputSchema).optional(),
  upsert: z.lazy(() => ArticleUpsertWithoutReactionsInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => ArticleWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => ArticleWhereInputSchema) ]).optional(),
  connect: z.lazy(() => ArticleWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ArticleUpdateToOneWithWhereWithoutReactionsInputSchema),z.lazy(() => ArticleUpdateWithoutReactionsInputSchema),z.lazy(() => ArticleUncheckedUpdateWithoutReactionsInputSchema) ]).optional(),
}).strict();

export const CommentUpdateOneWithoutReactionsNestedInputSchema: z.ZodType<Prisma.CommentUpdateOneWithoutReactionsNestedInput> = z.object({
  create: z.union([ z.lazy(() => CommentCreateWithoutReactionsInputSchema),z.lazy(() => CommentUncheckedCreateWithoutReactionsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CommentCreateOrConnectWithoutReactionsInputSchema).optional(),
  upsert: z.lazy(() => CommentUpsertWithoutReactionsInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => CommentWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => CommentWhereInputSchema) ]).optional(),
  connect: z.lazy(() => CommentWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => CommentUpdateToOneWithWhereWithoutReactionsInputSchema),z.lazy(() => CommentUpdateWithoutReactionsInputSchema),z.lazy(() => CommentUncheckedUpdateWithoutReactionsInputSchema) ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutViewsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutViewsInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutViewsInputSchema),z.lazy(() => UserUncheckedCreateWithoutViewsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutViewsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const ArticleCreateNestedOneWithoutViewsInputSchema: z.ZodType<Prisma.ArticleCreateNestedOneWithoutViewsInput> = z.object({
  create: z.union([ z.lazy(() => ArticleCreateWithoutViewsInputSchema),z.lazy(() => ArticleUncheckedCreateWithoutViewsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ArticleCreateOrConnectWithoutViewsInputSchema).optional(),
  connect: z.lazy(() => ArticleWhereUniqueInputSchema).optional()
}).strict();

export const UserUpdateOneRequiredWithoutViewsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutViewsNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutViewsInputSchema),z.lazy(() => UserUncheckedCreateWithoutViewsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutViewsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutViewsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutViewsInputSchema),z.lazy(() => UserUpdateWithoutViewsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutViewsInputSchema) ]).optional(),
}).strict();

export const ArticleUpdateOneRequiredWithoutViewsNestedInputSchema: z.ZodType<Prisma.ArticleUpdateOneRequiredWithoutViewsNestedInput> = z.object({
  create: z.union([ z.lazy(() => ArticleCreateWithoutViewsInputSchema),z.lazy(() => ArticleUncheckedCreateWithoutViewsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ArticleCreateOrConnectWithoutViewsInputSchema).optional(),
  upsert: z.lazy(() => ArticleUpsertWithoutViewsInputSchema).optional(),
  connect: z.lazy(() => ArticleWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ArticleUpdateToOneWithWhereWithoutViewsInputSchema),z.lazy(() => ArticleUpdateWithoutViewsInputSchema),z.lazy(() => ArticleUncheckedUpdateWithoutViewsInputSchema) ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutFollowingInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutFollowingInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutFollowingInputSchema),z.lazy(() => UserUncheckedCreateWithoutFollowingInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutFollowingInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const UserCreateNestedOneWithoutFollowersInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutFollowersInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutFollowersInputSchema),z.lazy(() => UserUncheckedCreateWithoutFollowersInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutFollowersInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const UserUpdateOneRequiredWithoutFollowingNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutFollowingNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutFollowingInputSchema),z.lazy(() => UserUncheckedCreateWithoutFollowingInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutFollowingInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutFollowingInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutFollowingInputSchema),z.lazy(() => UserUpdateWithoutFollowingInputSchema),z.lazy(() => UserUncheckedUpdateWithoutFollowingInputSchema) ]).optional(),
}).strict();

export const UserUpdateOneRequiredWithoutFollowersNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutFollowersNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutFollowersInputSchema),z.lazy(() => UserUncheckedCreateWithoutFollowersInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutFollowersInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutFollowersInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutFollowersInputSchema),z.lazy(() => UserUpdateWithoutFollowersInputSchema),z.lazy(() => UserUncheckedUpdateWithoutFollowersInputSchema) ]).optional(),
}).strict();

export const NestedIntFilterSchema: z.ZodType<Prisma.NestedIntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict();

export const NestedStringFilterSchema: z.ZodType<Prisma.NestedStringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const NestedDateTimeNullableFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedStringNullableFilterSchema: z.ZodType<Prisma.NestedStringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedEnumRoleFilterSchema: z.ZodType<Prisma.NestedEnumRoleFilter> = z.object({
  equals: z.lazy(() => RoleSchema).optional(),
  in: z.lazy(() => RoleSchema).array().optional(),
  notIn: z.lazy(() => RoleSchema).array().optional(),
  not: z.union([ z.lazy(() => RoleSchema),z.lazy(() => NestedEnumRoleFilterSchema) ]).optional(),
}).strict();

export const NestedDateTimeFilterSchema: z.ZodType<Prisma.NestedDateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const NestedIntWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional()
}).strict();

export const NestedFloatFilterSchema: z.ZodType<Prisma.NestedFloatFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatFilterSchema) ]).optional(),
}).strict();

export const NestedStringWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const NestedDateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional()
}).strict();

export const NestedIntNullableFilterSchema: z.ZodType<Prisma.NestedIntNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedStringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict();

export const NestedEnumRoleWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumRoleWithAggregatesFilter> = z.object({
  equals: z.lazy(() => RoleSchema).optional(),
  in: z.lazy(() => RoleSchema).array().optional(),
  notIn: z.lazy(() => RoleSchema).array().optional(),
  not: z.union([ z.lazy(() => RoleSchema),z.lazy(() => NestedEnumRoleWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumRoleFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumRoleFilterSchema).optional()
}).strict();

export const NestedDateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const NestedBoolFilterSchema: z.ZodType<Prisma.NestedBoolFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
}).strict();

export const NestedBoolWithAggregatesFilterSchema: z.ZodType<Prisma.NestedBoolWithAggregatesFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional()
}).strict();

export const NestedEnumReactionTypeFilterSchema: z.ZodType<Prisma.NestedEnumReactionTypeFilter> = z.object({
  equals: z.lazy(() => ReactionTypeSchema).optional(),
  in: z.lazy(() => ReactionTypeSchema).array().optional(),
  notIn: z.lazy(() => ReactionTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => ReactionTypeSchema),z.lazy(() => NestedEnumReactionTypeFilterSchema) ]).optional(),
}).strict();

export const NestedEnumReactionTypeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumReactionTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => ReactionTypeSchema).optional(),
  in: z.lazy(() => ReactionTypeSchema).array().optional(),
  notIn: z.lazy(() => ReactionTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => ReactionTypeSchema),z.lazy(() => NestedEnumReactionTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumReactionTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumReactionTypeFilterSchema).optional()
}).strict();

export const ActivationTokenCreateWithoutUserInputSchema: z.ZodType<Prisma.ActivationTokenCreateWithoutUserInput> = z.object({
  token: z.string(),
  expiresAt: z.coerce.date()
}).strict();

export const ActivationTokenUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.ActivationTokenUncheckedCreateWithoutUserInput> = z.object({
  token: z.string(),
  expiresAt: z.coerce.date()
}).strict();

export const ActivationTokenCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.ActivationTokenCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => ActivationTokenWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ActivationTokenCreateWithoutUserInputSchema),z.lazy(() => ActivationTokenUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const PasswordResetTokenCreateWithoutUserInputSchema: z.ZodType<Prisma.PasswordResetTokenCreateWithoutUserInput> = z.object({
  token: z.string(),
  expiresAt: z.coerce.date()
}).strict();

export const PasswordResetTokenUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.PasswordResetTokenUncheckedCreateWithoutUserInput> = z.object({
  token: z.string(),
  expiresAt: z.coerce.date()
}).strict();

export const PasswordResetTokenCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.PasswordResetTokenCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => PasswordResetTokenWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PasswordResetTokenCreateWithoutUserInputSchema),z.lazy(() => PasswordResetTokenUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const ArticleCreateWithoutUserInputSchema: z.ZodType<Prisma.ArticleCreateWithoutUserInput> = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  summary: z.string().optional().nullable(),
  coverUrl: z.string().optional().nullable(),
  content: z.string(),
  isVisible: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  tags: z.lazy(() => TagCreateNestedManyWithoutArticlesInputSchema).optional(),
  savedArticles: z.lazy(() => SavedArticleCreateNestedManyWithoutArticleInputSchema).optional(),
  comments: z.lazy(() => CommentCreateNestedManyWithoutArticleInputSchema).optional(),
  reactions: z.lazy(() => ReactionCreateNestedManyWithoutArticleInputSchema).optional(),
  views: z.lazy(() => ViewCreateNestedManyWithoutArticleInputSchema).optional()
}).strict();

export const ArticleUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.ArticleUncheckedCreateWithoutUserInput> = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  summary: z.string().optional().nullable(),
  coverUrl: z.string().optional().nullable(),
  content: z.string(),
  isVisible: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  tags: z.lazy(() => TagUncheckedCreateNestedManyWithoutArticlesInputSchema).optional(),
  savedArticles: z.lazy(() => SavedArticleUncheckedCreateNestedManyWithoutArticleInputSchema).optional(),
  comments: z.lazy(() => CommentUncheckedCreateNestedManyWithoutArticleInputSchema).optional(),
  reactions: z.lazy(() => ReactionUncheckedCreateNestedManyWithoutArticleInputSchema).optional(),
  views: z.lazy(() => ViewUncheckedCreateNestedManyWithoutArticleInputSchema).optional()
}).strict();

export const ArticleCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.ArticleCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => ArticleWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ArticleCreateWithoutUserInputSchema),z.lazy(() => ArticleUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const ArticleCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.ArticleCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ArticleCreateManyUserInputSchema),z.lazy(() => ArticleCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const SavedArticleCreateWithoutUserInputSchema: z.ZodType<Prisma.SavedArticleCreateWithoutUserInput> = z.object({
  createdAt: z.coerce.date().optional(),
  article: z.lazy(() => ArticleCreateNestedOneWithoutSavedArticlesInputSchema)
}).strict();

export const SavedArticleUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.SavedArticleUncheckedCreateWithoutUserInput> = z.object({
  articleId: z.string(),
  createdAt: z.coerce.date().optional()
}).strict();

export const SavedArticleCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.SavedArticleCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => SavedArticleWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => SavedArticleCreateWithoutUserInputSchema),z.lazy(() => SavedArticleUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const SavedArticleCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.SavedArticleCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => SavedArticleCreateManyUserInputSchema),z.lazy(() => SavedArticleCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const TagCreateWithoutUsersInputSchema: z.ZodType<Prisma.TagCreateWithoutUsersInput> = z.object({
  value: z.string(),
  articles: z.lazy(() => ArticleCreateNestedManyWithoutTagsInputSchema).optional()
}).strict();

export const TagUncheckedCreateWithoutUsersInputSchema: z.ZodType<Prisma.TagUncheckedCreateWithoutUsersInput> = z.object({
  id: z.number().int().optional(),
  value: z.string(),
  articles: z.lazy(() => ArticleUncheckedCreateNestedManyWithoutTagsInputSchema).optional()
}).strict();

export const TagCreateOrConnectWithoutUsersInputSchema: z.ZodType<Prisma.TagCreateOrConnectWithoutUsersInput> = z.object({
  where: z.lazy(() => TagWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => TagCreateWithoutUsersInputSchema),z.lazy(() => TagUncheckedCreateWithoutUsersInputSchema) ]),
}).strict();

export const CommentCreateWithoutUserInputSchema: z.ZodType<Prisma.CommentCreateWithoutUserInput> = z.object({
  id: z.string(),
  content: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  parent: z.lazy(() => CommentCreateNestedOneWithoutRepliesInputSchema).optional(),
  replies: z.lazy(() => CommentCreateNestedManyWithoutParentInputSchema).optional(),
  article: z.lazy(() => ArticleCreateNestedOneWithoutCommentsInputSchema),
  reactions: z.lazy(() => ReactionCreateNestedManyWithoutCommentInputSchema).optional()
}).strict();

export const CommentUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.CommentUncheckedCreateWithoutUserInput> = z.object({
  id: z.string(),
  content: z.string(),
  parentId: z.string().optional().nullable(),
  articleId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  replies: z.lazy(() => CommentUncheckedCreateNestedManyWithoutParentInputSchema).optional(),
  reactions: z.lazy(() => ReactionUncheckedCreateNestedManyWithoutCommentInputSchema).optional()
}).strict();

export const CommentCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.CommentCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => CommentWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CommentCreateWithoutUserInputSchema),z.lazy(() => CommentUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const CommentCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.CommentCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => CommentCreateManyUserInputSchema),z.lazy(() => CommentCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const ReactionCreateWithoutUserInputSchema: z.ZodType<Prisma.ReactionCreateWithoutUserInput> = z.object({
  type: z.lazy(() => ReactionTypeSchema),
  createdAt: z.coerce.date().optional(),
  article: z.lazy(() => ArticleCreateNestedOneWithoutReactionsInputSchema).optional(),
  comment: z.lazy(() => CommentCreateNestedOneWithoutReactionsInputSchema).optional()
}).strict();

export const ReactionUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.ReactionUncheckedCreateWithoutUserInput> = z.object({
  id: z.number().int().optional(),
  type: z.lazy(() => ReactionTypeSchema),
  createdAt: z.coerce.date().optional(),
  articleId: z.string().optional().nullable(),
  commentId: z.string().optional().nullable()
}).strict();

export const ReactionCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.ReactionCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => ReactionWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ReactionCreateWithoutUserInputSchema),z.lazy(() => ReactionUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const ReactionCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.ReactionCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ReactionCreateManyUserInputSchema),z.lazy(() => ReactionCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const ViewCreateWithoutUserInputSchema: z.ZodType<Prisma.ViewCreateWithoutUserInput> = z.object({
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  article: z.lazy(() => ArticleCreateNestedOneWithoutViewsInputSchema)
}).strict();

export const ViewUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.ViewUncheckedCreateWithoutUserInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  articleId: z.string()
}).strict();

export const ViewCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.ViewCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => ViewWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ViewCreateWithoutUserInputSchema),z.lazy(() => ViewUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const ViewCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.ViewCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ViewCreateManyUserInputSchema),z.lazy(() => ViewCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const FollowCreateWithoutFollowerInputSchema: z.ZodType<Prisma.FollowCreateWithoutFollowerInput> = z.object({
  createdAt: z.coerce.date().optional(),
  following: z.lazy(() => UserCreateNestedOneWithoutFollowersInputSchema)
}).strict();

export const FollowUncheckedCreateWithoutFollowerInputSchema: z.ZodType<Prisma.FollowUncheckedCreateWithoutFollowerInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  followingId: z.number().int()
}).strict();

export const FollowCreateOrConnectWithoutFollowerInputSchema: z.ZodType<Prisma.FollowCreateOrConnectWithoutFollowerInput> = z.object({
  where: z.lazy(() => FollowWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => FollowCreateWithoutFollowerInputSchema),z.lazy(() => FollowUncheckedCreateWithoutFollowerInputSchema) ]),
}).strict();

export const FollowCreateManyFollowerInputEnvelopeSchema: z.ZodType<Prisma.FollowCreateManyFollowerInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => FollowCreateManyFollowerInputSchema),z.lazy(() => FollowCreateManyFollowerInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const FollowCreateWithoutFollowingInputSchema: z.ZodType<Prisma.FollowCreateWithoutFollowingInput> = z.object({
  createdAt: z.coerce.date().optional(),
  follower: z.lazy(() => UserCreateNestedOneWithoutFollowingInputSchema)
}).strict();

export const FollowUncheckedCreateWithoutFollowingInputSchema: z.ZodType<Prisma.FollowUncheckedCreateWithoutFollowingInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  followerId: z.number().int()
}).strict();

export const FollowCreateOrConnectWithoutFollowingInputSchema: z.ZodType<Prisma.FollowCreateOrConnectWithoutFollowingInput> = z.object({
  where: z.lazy(() => FollowWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => FollowCreateWithoutFollowingInputSchema),z.lazy(() => FollowUncheckedCreateWithoutFollowingInputSchema) ]),
}).strict();

export const FollowCreateManyFollowingInputEnvelopeSchema: z.ZodType<Prisma.FollowCreateManyFollowingInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => FollowCreateManyFollowingInputSchema),z.lazy(() => FollowCreateManyFollowingInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const ActivationTokenUpsertWithoutUserInputSchema: z.ZodType<Prisma.ActivationTokenUpsertWithoutUserInput> = z.object({
  update: z.union([ z.lazy(() => ActivationTokenUpdateWithoutUserInputSchema),z.lazy(() => ActivationTokenUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => ActivationTokenCreateWithoutUserInputSchema),z.lazy(() => ActivationTokenUncheckedCreateWithoutUserInputSchema) ]),
  where: z.lazy(() => ActivationTokenWhereInputSchema).optional()
}).strict();

export const ActivationTokenUpdateToOneWithWhereWithoutUserInputSchema: z.ZodType<Prisma.ActivationTokenUpdateToOneWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => ActivationTokenWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ActivationTokenUpdateWithoutUserInputSchema),z.lazy(() => ActivationTokenUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const ActivationTokenUpdateWithoutUserInputSchema: z.ZodType<Prisma.ActivationTokenUpdateWithoutUserInput> = z.object({
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ActivationTokenUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.ActivationTokenUncheckedUpdateWithoutUserInput> = z.object({
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PasswordResetTokenUpsertWithoutUserInputSchema: z.ZodType<Prisma.PasswordResetTokenUpsertWithoutUserInput> = z.object({
  update: z.union([ z.lazy(() => PasswordResetTokenUpdateWithoutUserInputSchema),z.lazy(() => PasswordResetTokenUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => PasswordResetTokenCreateWithoutUserInputSchema),z.lazy(() => PasswordResetTokenUncheckedCreateWithoutUserInputSchema) ]),
  where: z.lazy(() => PasswordResetTokenWhereInputSchema).optional()
}).strict();

export const PasswordResetTokenUpdateToOneWithWhereWithoutUserInputSchema: z.ZodType<Prisma.PasswordResetTokenUpdateToOneWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => PasswordResetTokenWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => PasswordResetTokenUpdateWithoutUserInputSchema),z.lazy(() => PasswordResetTokenUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const PasswordResetTokenUpdateWithoutUserInputSchema: z.ZodType<Prisma.PasswordResetTokenUpdateWithoutUserInput> = z.object({
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PasswordResetTokenUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.PasswordResetTokenUncheckedUpdateWithoutUserInput> = z.object({
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ArticleUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.ArticleUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => ArticleWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ArticleUpdateWithoutUserInputSchema),z.lazy(() => ArticleUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => ArticleCreateWithoutUserInputSchema),z.lazy(() => ArticleUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const ArticleUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.ArticleUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => ArticleWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ArticleUpdateWithoutUserInputSchema),z.lazy(() => ArticleUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const ArticleUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.ArticleUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => ArticleScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ArticleUpdateManyMutationInputSchema),z.lazy(() => ArticleUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const ArticleScalarWhereInputSchema: z.ZodType<Prisma.ArticleScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ArticleScalarWhereInputSchema),z.lazy(() => ArticleScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ArticleScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ArticleScalarWhereInputSchema),z.lazy(() => ArticleScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  slug: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  summary: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  coverUrl: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  content: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  isVisible: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
}).strict();

export const SavedArticleUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.SavedArticleUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => SavedArticleWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => SavedArticleUpdateWithoutUserInputSchema),z.lazy(() => SavedArticleUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => SavedArticleCreateWithoutUserInputSchema),z.lazy(() => SavedArticleUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const SavedArticleUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.SavedArticleUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => SavedArticleWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => SavedArticleUpdateWithoutUserInputSchema),z.lazy(() => SavedArticleUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const SavedArticleUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.SavedArticleUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => SavedArticleScalarWhereInputSchema),
  data: z.union([ z.lazy(() => SavedArticleUpdateManyMutationInputSchema),z.lazy(() => SavedArticleUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const SavedArticleScalarWhereInputSchema: z.ZodType<Prisma.SavedArticleScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => SavedArticleScalarWhereInputSchema),z.lazy(() => SavedArticleScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => SavedArticleScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SavedArticleScalarWhereInputSchema),z.lazy(() => SavedArticleScalarWhereInputSchema).array() ]).optional(),
  articleId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const TagUpsertWithWhereUniqueWithoutUsersInputSchema: z.ZodType<Prisma.TagUpsertWithWhereUniqueWithoutUsersInput> = z.object({
  where: z.lazy(() => TagWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => TagUpdateWithoutUsersInputSchema),z.lazy(() => TagUncheckedUpdateWithoutUsersInputSchema) ]),
  create: z.union([ z.lazy(() => TagCreateWithoutUsersInputSchema),z.lazy(() => TagUncheckedCreateWithoutUsersInputSchema) ]),
}).strict();

export const TagUpdateWithWhereUniqueWithoutUsersInputSchema: z.ZodType<Prisma.TagUpdateWithWhereUniqueWithoutUsersInput> = z.object({
  where: z.lazy(() => TagWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => TagUpdateWithoutUsersInputSchema),z.lazy(() => TagUncheckedUpdateWithoutUsersInputSchema) ]),
}).strict();

export const TagUpdateManyWithWhereWithoutUsersInputSchema: z.ZodType<Prisma.TagUpdateManyWithWhereWithoutUsersInput> = z.object({
  where: z.lazy(() => TagScalarWhereInputSchema),
  data: z.union([ z.lazy(() => TagUpdateManyMutationInputSchema),z.lazy(() => TagUncheckedUpdateManyWithoutUsersInputSchema) ]),
}).strict();

export const TagScalarWhereInputSchema: z.ZodType<Prisma.TagScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => TagScalarWhereInputSchema),z.lazy(() => TagScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TagScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TagScalarWhereInputSchema),z.lazy(() => TagScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  value: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
}).strict();

export const CommentUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.CommentUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => CommentWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => CommentUpdateWithoutUserInputSchema),z.lazy(() => CommentUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => CommentCreateWithoutUserInputSchema),z.lazy(() => CommentUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const CommentUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.CommentUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => CommentWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => CommentUpdateWithoutUserInputSchema),z.lazy(() => CommentUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const CommentUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.CommentUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => CommentScalarWhereInputSchema),
  data: z.union([ z.lazy(() => CommentUpdateManyMutationInputSchema),z.lazy(() => CommentUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const CommentScalarWhereInputSchema: z.ZodType<Prisma.CommentScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => CommentScalarWhereInputSchema),z.lazy(() => CommentScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CommentScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CommentScalarWhereInputSchema),z.lazy(() => CommentScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  content: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  parentId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  userId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  articleId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
}).strict();

export const ReactionUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.ReactionUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => ReactionWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ReactionUpdateWithoutUserInputSchema),z.lazy(() => ReactionUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => ReactionCreateWithoutUserInputSchema),z.lazy(() => ReactionUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const ReactionUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.ReactionUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => ReactionWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ReactionUpdateWithoutUserInputSchema),z.lazy(() => ReactionUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const ReactionUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.ReactionUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => ReactionScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ReactionUpdateManyMutationInputSchema),z.lazy(() => ReactionUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const ReactionScalarWhereInputSchema: z.ZodType<Prisma.ReactionScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ReactionScalarWhereInputSchema),z.lazy(() => ReactionScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ReactionScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ReactionScalarWhereInputSchema),z.lazy(() => ReactionScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  type: z.union([ z.lazy(() => EnumReactionTypeFilterSchema),z.lazy(() => ReactionTypeSchema) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  userId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  articleId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  commentId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
}).strict();

export const ViewUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.ViewUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => ViewWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ViewUpdateWithoutUserInputSchema),z.lazy(() => ViewUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => ViewCreateWithoutUserInputSchema),z.lazy(() => ViewUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const ViewUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.ViewUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => ViewWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ViewUpdateWithoutUserInputSchema),z.lazy(() => ViewUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const ViewUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.ViewUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => ViewScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ViewUpdateManyMutationInputSchema),z.lazy(() => ViewUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const ViewScalarWhereInputSchema: z.ZodType<Prisma.ViewScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ViewScalarWhereInputSchema),z.lazy(() => ViewScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ViewScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ViewScalarWhereInputSchema),z.lazy(() => ViewScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  userId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  articleId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
}).strict();

export const FollowUpsertWithWhereUniqueWithoutFollowerInputSchema: z.ZodType<Prisma.FollowUpsertWithWhereUniqueWithoutFollowerInput> = z.object({
  where: z.lazy(() => FollowWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => FollowUpdateWithoutFollowerInputSchema),z.lazy(() => FollowUncheckedUpdateWithoutFollowerInputSchema) ]),
  create: z.union([ z.lazy(() => FollowCreateWithoutFollowerInputSchema),z.lazy(() => FollowUncheckedCreateWithoutFollowerInputSchema) ]),
}).strict();

export const FollowUpdateWithWhereUniqueWithoutFollowerInputSchema: z.ZodType<Prisma.FollowUpdateWithWhereUniqueWithoutFollowerInput> = z.object({
  where: z.lazy(() => FollowWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => FollowUpdateWithoutFollowerInputSchema),z.lazy(() => FollowUncheckedUpdateWithoutFollowerInputSchema) ]),
}).strict();

export const FollowUpdateManyWithWhereWithoutFollowerInputSchema: z.ZodType<Prisma.FollowUpdateManyWithWhereWithoutFollowerInput> = z.object({
  where: z.lazy(() => FollowScalarWhereInputSchema),
  data: z.union([ z.lazy(() => FollowUpdateManyMutationInputSchema),z.lazy(() => FollowUncheckedUpdateManyWithoutFollowerInputSchema) ]),
}).strict();

export const FollowScalarWhereInputSchema: z.ZodType<Prisma.FollowScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => FollowScalarWhereInputSchema),z.lazy(() => FollowScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => FollowScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => FollowScalarWhereInputSchema),z.lazy(() => FollowScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  followerId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  followingId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
}).strict();

export const FollowUpsertWithWhereUniqueWithoutFollowingInputSchema: z.ZodType<Prisma.FollowUpsertWithWhereUniqueWithoutFollowingInput> = z.object({
  where: z.lazy(() => FollowWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => FollowUpdateWithoutFollowingInputSchema),z.lazy(() => FollowUncheckedUpdateWithoutFollowingInputSchema) ]),
  create: z.union([ z.lazy(() => FollowCreateWithoutFollowingInputSchema),z.lazy(() => FollowUncheckedCreateWithoutFollowingInputSchema) ]),
}).strict();

export const FollowUpdateWithWhereUniqueWithoutFollowingInputSchema: z.ZodType<Prisma.FollowUpdateWithWhereUniqueWithoutFollowingInput> = z.object({
  where: z.lazy(() => FollowWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => FollowUpdateWithoutFollowingInputSchema),z.lazy(() => FollowUncheckedUpdateWithoutFollowingInputSchema) ]),
}).strict();

export const FollowUpdateManyWithWhereWithoutFollowingInputSchema: z.ZodType<Prisma.FollowUpdateManyWithWhereWithoutFollowingInput> = z.object({
  where: z.lazy(() => FollowScalarWhereInputSchema),
  data: z.union([ z.lazy(() => FollowUpdateManyMutationInputSchema),z.lazy(() => FollowUncheckedUpdateManyWithoutFollowingInputSchema) ]),
}).strict();

export const UserCreateWithoutPasswordResetTokenInputSchema: z.ZodType<Prisma.UserCreateWithoutPasswordResetTokenInput> = z.object({
  username: z.string(),
  name: z.string(),
  firstName: z.string(),
  email: z.string(),
  emailVerifiedAt: z.coerce.date().optional().nullable(),
  password: z.string(),
  profileUrl: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  activationToken: z.lazy(() => ActivationTokenCreateNestedOneWithoutUserInputSchema).optional(),
  articles: z.lazy(() => ArticleCreateNestedManyWithoutUserInputSchema).optional(),
  savedArticles: z.lazy(() => SavedArticleCreateNestedManyWithoutUserInputSchema).optional(),
  tags: z.lazy(() => TagCreateNestedManyWithoutUsersInputSchema).optional(),
  comments: z.lazy(() => CommentCreateNestedManyWithoutUserInputSchema).optional(),
  reactions: z.lazy(() => ReactionCreateNestedManyWithoutUserInputSchema).optional(),
  views: z.lazy(() => ViewCreateNestedManyWithoutUserInputSchema).optional(),
  following: z.lazy(() => FollowCreateNestedManyWithoutFollowerInputSchema).optional(),
  followers: z.lazy(() => FollowCreateNestedManyWithoutFollowingInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutPasswordResetTokenInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutPasswordResetTokenInput> = z.object({
  id: z.number().int().optional(),
  username: z.string(),
  name: z.string(),
  firstName: z.string(),
  email: z.string(),
  emailVerifiedAt: z.coerce.date().optional().nullable(),
  password: z.string(),
  profileUrl: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  activationToken: z.lazy(() => ActivationTokenUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
  articles: z.lazy(() => ArticleUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  savedArticles: z.lazy(() => SavedArticleUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  tags: z.lazy(() => TagUncheckedCreateNestedManyWithoutUsersInputSchema).optional(),
  comments: z.lazy(() => CommentUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  reactions: z.lazy(() => ReactionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  views: z.lazy(() => ViewUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  following: z.lazy(() => FollowUncheckedCreateNestedManyWithoutFollowerInputSchema).optional(),
  followers: z.lazy(() => FollowUncheckedCreateNestedManyWithoutFollowingInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutPasswordResetTokenInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutPasswordResetTokenInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutPasswordResetTokenInputSchema),z.lazy(() => UserUncheckedCreateWithoutPasswordResetTokenInputSchema) ]),
}).strict();

export const UserUpsertWithoutPasswordResetTokenInputSchema: z.ZodType<Prisma.UserUpsertWithoutPasswordResetTokenInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutPasswordResetTokenInputSchema),z.lazy(() => UserUncheckedUpdateWithoutPasswordResetTokenInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutPasswordResetTokenInputSchema),z.lazy(() => UserUncheckedCreateWithoutPasswordResetTokenInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutPasswordResetTokenInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutPasswordResetTokenInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutPasswordResetTokenInputSchema),z.lazy(() => UserUncheckedUpdateWithoutPasswordResetTokenInputSchema) ]),
}).strict();

export const UserUpdateWithoutPasswordResetTokenInputSchema: z.ZodType<Prisma.UserUpdateWithoutPasswordResetTokenInput> = z.object({
  username: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerifiedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  profileUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  activationToken: z.lazy(() => ActivationTokenUpdateOneWithoutUserNestedInputSchema).optional(),
  articles: z.lazy(() => ArticleUpdateManyWithoutUserNestedInputSchema).optional(),
  savedArticles: z.lazy(() => SavedArticleUpdateManyWithoutUserNestedInputSchema).optional(),
  tags: z.lazy(() => TagUpdateManyWithoutUsersNestedInputSchema).optional(),
  comments: z.lazy(() => CommentUpdateManyWithoutUserNestedInputSchema).optional(),
  reactions: z.lazy(() => ReactionUpdateManyWithoutUserNestedInputSchema).optional(),
  views: z.lazy(() => ViewUpdateManyWithoutUserNestedInputSchema).optional(),
  following: z.lazy(() => FollowUpdateManyWithoutFollowerNestedInputSchema).optional(),
  followers: z.lazy(() => FollowUpdateManyWithoutFollowingNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutPasswordResetTokenInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutPasswordResetTokenInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerifiedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  profileUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  activationToken: z.lazy(() => ActivationTokenUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
  articles: z.lazy(() => ArticleUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  savedArticles: z.lazy(() => SavedArticleUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  tags: z.lazy(() => TagUncheckedUpdateManyWithoutUsersNestedInputSchema).optional(),
  comments: z.lazy(() => CommentUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  reactions: z.lazy(() => ReactionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  views: z.lazy(() => ViewUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  following: z.lazy(() => FollowUncheckedUpdateManyWithoutFollowerNestedInputSchema).optional(),
  followers: z.lazy(() => FollowUncheckedUpdateManyWithoutFollowingNestedInputSchema).optional()
}).strict();

export const UserCreateWithoutActivationTokenInputSchema: z.ZodType<Prisma.UserCreateWithoutActivationTokenInput> = z.object({
  username: z.string(),
  name: z.string(),
  firstName: z.string(),
  email: z.string(),
  emailVerifiedAt: z.coerce.date().optional().nullable(),
  password: z.string(),
  profileUrl: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  passwordResetToken: z.lazy(() => PasswordResetTokenCreateNestedOneWithoutUserInputSchema).optional(),
  articles: z.lazy(() => ArticleCreateNestedManyWithoutUserInputSchema).optional(),
  savedArticles: z.lazy(() => SavedArticleCreateNestedManyWithoutUserInputSchema).optional(),
  tags: z.lazy(() => TagCreateNestedManyWithoutUsersInputSchema).optional(),
  comments: z.lazy(() => CommentCreateNestedManyWithoutUserInputSchema).optional(),
  reactions: z.lazy(() => ReactionCreateNestedManyWithoutUserInputSchema).optional(),
  views: z.lazy(() => ViewCreateNestedManyWithoutUserInputSchema).optional(),
  following: z.lazy(() => FollowCreateNestedManyWithoutFollowerInputSchema).optional(),
  followers: z.lazy(() => FollowCreateNestedManyWithoutFollowingInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutActivationTokenInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutActivationTokenInput> = z.object({
  id: z.number().int().optional(),
  username: z.string(),
  name: z.string(),
  firstName: z.string(),
  email: z.string(),
  emailVerifiedAt: z.coerce.date().optional().nullable(),
  password: z.string(),
  profileUrl: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  passwordResetToken: z.lazy(() => PasswordResetTokenUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
  articles: z.lazy(() => ArticleUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  savedArticles: z.lazy(() => SavedArticleUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  tags: z.lazy(() => TagUncheckedCreateNestedManyWithoutUsersInputSchema).optional(),
  comments: z.lazy(() => CommentUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  reactions: z.lazy(() => ReactionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  views: z.lazy(() => ViewUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  following: z.lazy(() => FollowUncheckedCreateNestedManyWithoutFollowerInputSchema).optional(),
  followers: z.lazy(() => FollowUncheckedCreateNestedManyWithoutFollowingInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutActivationTokenInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutActivationTokenInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutActivationTokenInputSchema),z.lazy(() => UserUncheckedCreateWithoutActivationTokenInputSchema) ]),
}).strict();

export const UserUpsertWithoutActivationTokenInputSchema: z.ZodType<Prisma.UserUpsertWithoutActivationTokenInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutActivationTokenInputSchema),z.lazy(() => UserUncheckedUpdateWithoutActivationTokenInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutActivationTokenInputSchema),z.lazy(() => UserUncheckedCreateWithoutActivationTokenInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutActivationTokenInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutActivationTokenInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutActivationTokenInputSchema),z.lazy(() => UserUncheckedUpdateWithoutActivationTokenInputSchema) ]),
}).strict();

export const UserUpdateWithoutActivationTokenInputSchema: z.ZodType<Prisma.UserUpdateWithoutActivationTokenInput> = z.object({
  username: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerifiedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  profileUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  passwordResetToken: z.lazy(() => PasswordResetTokenUpdateOneWithoutUserNestedInputSchema).optional(),
  articles: z.lazy(() => ArticleUpdateManyWithoutUserNestedInputSchema).optional(),
  savedArticles: z.lazy(() => SavedArticleUpdateManyWithoutUserNestedInputSchema).optional(),
  tags: z.lazy(() => TagUpdateManyWithoutUsersNestedInputSchema).optional(),
  comments: z.lazy(() => CommentUpdateManyWithoutUserNestedInputSchema).optional(),
  reactions: z.lazy(() => ReactionUpdateManyWithoutUserNestedInputSchema).optional(),
  views: z.lazy(() => ViewUpdateManyWithoutUserNestedInputSchema).optional(),
  following: z.lazy(() => FollowUpdateManyWithoutFollowerNestedInputSchema).optional(),
  followers: z.lazy(() => FollowUpdateManyWithoutFollowingNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutActivationTokenInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutActivationTokenInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerifiedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  profileUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  passwordResetToken: z.lazy(() => PasswordResetTokenUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
  articles: z.lazy(() => ArticleUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  savedArticles: z.lazy(() => SavedArticleUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  tags: z.lazy(() => TagUncheckedUpdateManyWithoutUsersNestedInputSchema).optional(),
  comments: z.lazy(() => CommentUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  reactions: z.lazy(() => ReactionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  views: z.lazy(() => ViewUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  following: z.lazy(() => FollowUncheckedUpdateManyWithoutFollowerNestedInputSchema).optional(),
  followers: z.lazy(() => FollowUncheckedUpdateManyWithoutFollowingNestedInputSchema).optional()
}).strict();

export const UserCreateWithoutArticlesInputSchema: z.ZodType<Prisma.UserCreateWithoutArticlesInput> = z.object({
  username: z.string(),
  name: z.string(),
  firstName: z.string(),
  email: z.string(),
  emailVerifiedAt: z.coerce.date().optional().nullable(),
  password: z.string(),
  profileUrl: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  activationToken: z.lazy(() => ActivationTokenCreateNestedOneWithoutUserInputSchema).optional(),
  passwordResetToken: z.lazy(() => PasswordResetTokenCreateNestedOneWithoutUserInputSchema).optional(),
  savedArticles: z.lazy(() => SavedArticleCreateNestedManyWithoutUserInputSchema).optional(),
  tags: z.lazy(() => TagCreateNestedManyWithoutUsersInputSchema).optional(),
  comments: z.lazy(() => CommentCreateNestedManyWithoutUserInputSchema).optional(),
  reactions: z.lazy(() => ReactionCreateNestedManyWithoutUserInputSchema).optional(),
  views: z.lazy(() => ViewCreateNestedManyWithoutUserInputSchema).optional(),
  following: z.lazy(() => FollowCreateNestedManyWithoutFollowerInputSchema).optional(),
  followers: z.lazy(() => FollowCreateNestedManyWithoutFollowingInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutArticlesInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutArticlesInput> = z.object({
  id: z.number().int().optional(),
  username: z.string(),
  name: z.string(),
  firstName: z.string(),
  email: z.string(),
  emailVerifiedAt: z.coerce.date().optional().nullable(),
  password: z.string(),
  profileUrl: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  activationToken: z.lazy(() => ActivationTokenUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
  passwordResetToken: z.lazy(() => PasswordResetTokenUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
  savedArticles: z.lazy(() => SavedArticleUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  tags: z.lazy(() => TagUncheckedCreateNestedManyWithoutUsersInputSchema).optional(),
  comments: z.lazy(() => CommentUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  reactions: z.lazy(() => ReactionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  views: z.lazy(() => ViewUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  following: z.lazy(() => FollowUncheckedCreateNestedManyWithoutFollowerInputSchema).optional(),
  followers: z.lazy(() => FollowUncheckedCreateNestedManyWithoutFollowingInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutArticlesInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutArticlesInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutArticlesInputSchema),z.lazy(() => UserUncheckedCreateWithoutArticlesInputSchema) ]),
}).strict();

export const TagCreateWithoutArticlesInputSchema: z.ZodType<Prisma.TagCreateWithoutArticlesInput> = z.object({
  value: z.string(),
  users: z.lazy(() => UserCreateNestedManyWithoutTagsInputSchema).optional()
}).strict();

export const TagUncheckedCreateWithoutArticlesInputSchema: z.ZodType<Prisma.TagUncheckedCreateWithoutArticlesInput> = z.object({
  id: z.number().int().optional(),
  value: z.string(),
  users: z.lazy(() => UserUncheckedCreateNestedManyWithoutTagsInputSchema).optional()
}).strict();

export const TagCreateOrConnectWithoutArticlesInputSchema: z.ZodType<Prisma.TagCreateOrConnectWithoutArticlesInput> = z.object({
  where: z.lazy(() => TagWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => TagCreateWithoutArticlesInputSchema),z.lazy(() => TagUncheckedCreateWithoutArticlesInputSchema) ]),
}).strict();

export const SavedArticleCreateWithoutArticleInputSchema: z.ZodType<Prisma.SavedArticleCreateWithoutArticleInput> = z.object({
  createdAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutSavedArticlesInputSchema)
}).strict();

export const SavedArticleUncheckedCreateWithoutArticleInputSchema: z.ZodType<Prisma.SavedArticleUncheckedCreateWithoutArticleInput> = z.object({
  userId: z.number().int(),
  createdAt: z.coerce.date().optional()
}).strict();

export const SavedArticleCreateOrConnectWithoutArticleInputSchema: z.ZodType<Prisma.SavedArticleCreateOrConnectWithoutArticleInput> = z.object({
  where: z.lazy(() => SavedArticleWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => SavedArticleCreateWithoutArticleInputSchema),z.lazy(() => SavedArticleUncheckedCreateWithoutArticleInputSchema) ]),
}).strict();

export const SavedArticleCreateManyArticleInputEnvelopeSchema: z.ZodType<Prisma.SavedArticleCreateManyArticleInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => SavedArticleCreateManyArticleInputSchema),z.lazy(() => SavedArticleCreateManyArticleInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const CommentCreateWithoutArticleInputSchema: z.ZodType<Prisma.CommentCreateWithoutArticleInput> = z.object({
  id: z.string(),
  content: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  parent: z.lazy(() => CommentCreateNestedOneWithoutRepliesInputSchema).optional(),
  replies: z.lazy(() => CommentCreateNestedManyWithoutParentInputSchema).optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutCommentsInputSchema),
  reactions: z.lazy(() => ReactionCreateNestedManyWithoutCommentInputSchema).optional()
}).strict();

export const CommentUncheckedCreateWithoutArticleInputSchema: z.ZodType<Prisma.CommentUncheckedCreateWithoutArticleInput> = z.object({
  id: z.string(),
  content: z.string(),
  parentId: z.string().optional().nullable(),
  userId: z.number().int(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  replies: z.lazy(() => CommentUncheckedCreateNestedManyWithoutParentInputSchema).optional(),
  reactions: z.lazy(() => ReactionUncheckedCreateNestedManyWithoutCommentInputSchema).optional()
}).strict();

export const CommentCreateOrConnectWithoutArticleInputSchema: z.ZodType<Prisma.CommentCreateOrConnectWithoutArticleInput> = z.object({
  where: z.lazy(() => CommentWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CommentCreateWithoutArticleInputSchema),z.lazy(() => CommentUncheckedCreateWithoutArticleInputSchema) ]),
}).strict();

export const CommentCreateManyArticleInputEnvelopeSchema: z.ZodType<Prisma.CommentCreateManyArticleInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => CommentCreateManyArticleInputSchema),z.lazy(() => CommentCreateManyArticleInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const ReactionCreateWithoutArticleInputSchema: z.ZodType<Prisma.ReactionCreateWithoutArticleInput> = z.object({
  type: z.lazy(() => ReactionTypeSchema),
  createdAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutReactionsInputSchema),
  comment: z.lazy(() => CommentCreateNestedOneWithoutReactionsInputSchema).optional()
}).strict();

export const ReactionUncheckedCreateWithoutArticleInputSchema: z.ZodType<Prisma.ReactionUncheckedCreateWithoutArticleInput> = z.object({
  id: z.number().int().optional(),
  type: z.lazy(() => ReactionTypeSchema),
  createdAt: z.coerce.date().optional(),
  userId: z.number().int(),
  commentId: z.string().optional().nullable()
}).strict();

export const ReactionCreateOrConnectWithoutArticleInputSchema: z.ZodType<Prisma.ReactionCreateOrConnectWithoutArticleInput> = z.object({
  where: z.lazy(() => ReactionWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ReactionCreateWithoutArticleInputSchema),z.lazy(() => ReactionUncheckedCreateWithoutArticleInputSchema) ]),
}).strict();

export const ReactionCreateManyArticleInputEnvelopeSchema: z.ZodType<Prisma.ReactionCreateManyArticleInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ReactionCreateManyArticleInputSchema),z.lazy(() => ReactionCreateManyArticleInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const ViewCreateWithoutArticleInputSchema: z.ZodType<Prisma.ViewCreateWithoutArticleInput> = z.object({
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutViewsInputSchema)
}).strict();

export const ViewUncheckedCreateWithoutArticleInputSchema: z.ZodType<Prisma.ViewUncheckedCreateWithoutArticleInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  userId: z.number().int()
}).strict();

export const ViewCreateOrConnectWithoutArticleInputSchema: z.ZodType<Prisma.ViewCreateOrConnectWithoutArticleInput> = z.object({
  where: z.lazy(() => ViewWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ViewCreateWithoutArticleInputSchema),z.lazy(() => ViewUncheckedCreateWithoutArticleInputSchema) ]),
}).strict();

export const ViewCreateManyArticleInputEnvelopeSchema: z.ZodType<Prisma.ViewCreateManyArticleInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ViewCreateManyArticleInputSchema),z.lazy(() => ViewCreateManyArticleInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const UserUpsertWithoutArticlesInputSchema: z.ZodType<Prisma.UserUpsertWithoutArticlesInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutArticlesInputSchema),z.lazy(() => UserUncheckedUpdateWithoutArticlesInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutArticlesInputSchema),z.lazy(() => UserUncheckedCreateWithoutArticlesInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutArticlesInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutArticlesInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutArticlesInputSchema),z.lazy(() => UserUncheckedUpdateWithoutArticlesInputSchema) ]),
}).strict();

export const UserUpdateWithoutArticlesInputSchema: z.ZodType<Prisma.UserUpdateWithoutArticlesInput> = z.object({
  username: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerifiedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  profileUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  activationToken: z.lazy(() => ActivationTokenUpdateOneWithoutUserNestedInputSchema).optional(),
  passwordResetToken: z.lazy(() => PasswordResetTokenUpdateOneWithoutUserNestedInputSchema).optional(),
  savedArticles: z.lazy(() => SavedArticleUpdateManyWithoutUserNestedInputSchema).optional(),
  tags: z.lazy(() => TagUpdateManyWithoutUsersNestedInputSchema).optional(),
  comments: z.lazy(() => CommentUpdateManyWithoutUserNestedInputSchema).optional(),
  reactions: z.lazy(() => ReactionUpdateManyWithoutUserNestedInputSchema).optional(),
  views: z.lazy(() => ViewUpdateManyWithoutUserNestedInputSchema).optional(),
  following: z.lazy(() => FollowUpdateManyWithoutFollowerNestedInputSchema).optional(),
  followers: z.lazy(() => FollowUpdateManyWithoutFollowingNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutArticlesInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutArticlesInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerifiedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  profileUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  activationToken: z.lazy(() => ActivationTokenUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
  passwordResetToken: z.lazy(() => PasswordResetTokenUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
  savedArticles: z.lazy(() => SavedArticleUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  tags: z.lazy(() => TagUncheckedUpdateManyWithoutUsersNestedInputSchema).optional(),
  comments: z.lazy(() => CommentUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  reactions: z.lazy(() => ReactionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  views: z.lazy(() => ViewUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  following: z.lazy(() => FollowUncheckedUpdateManyWithoutFollowerNestedInputSchema).optional(),
  followers: z.lazy(() => FollowUncheckedUpdateManyWithoutFollowingNestedInputSchema).optional()
}).strict();

export const TagUpsertWithWhereUniqueWithoutArticlesInputSchema: z.ZodType<Prisma.TagUpsertWithWhereUniqueWithoutArticlesInput> = z.object({
  where: z.lazy(() => TagWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => TagUpdateWithoutArticlesInputSchema),z.lazy(() => TagUncheckedUpdateWithoutArticlesInputSchema) ]),
  create: z.union([ z.lazy(() => TagCreateWithoutArticlesInputSchema),z.lazy(() => TagUncheckedCreateWithoutArticlesInputSchema) ]),
}).strict();

export const TagUpdateWithWhereUniqueWithoutArticlesInputSchema: z.ZodType<Prisma.TagUpdateWithWhereUniqueWithoutArticlesInput> = z.object({
  where: z.lazy(() => TagWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => TagUpdateWithoutArticlesInputSchema),z.lazy(() => TagUncheckedUpdateWithoutArticlesInputSchema) ]),
}).strict();

export const TagUpdateManyWithWhereWithoutArticlesInputSchema: z.ZodType<Prisma.TagUpdateManyWithWhereWithoutArticlesInput> = z.object({
  where: z.lazy(() => TagScalarWhereInputSchema),
  data: z.union([ z.lazy(() => TagUpdateManyMutationInputSchema),z.lazy(() => TagUncheckedUpdateManyWithoutArticlesInputSchema) ]),
}).strict();

export const SavedArticleUpsertWithWhereUniqueWithoutArticleInputSchema: z.ZodType<Prisma.SavedArticleUpsertWithWhereUniqueWithoutArticleInput> = z.object({
  where: z.lazy(() => SavedArticleWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => SavedArticleUpdateWithoutArticleInputSchema),z.lazy(() => SavedArticleUncheckedUpdateWithoutArticleInputSchema) ]),
  create: z.union([ z.lazy(() => SavedArticleCreateWithoutArticleInputSchema),z.lazy(() => SavedArticleUncheckedCreateWithoutArticleInputSchema) ]),
}).strict();

export const SavedArticleUpdateWithWhereUniqueWithoutArticleInputSchema: z.ZodType<Prisma.SavedArticleUpdateWithWhereUniqueWithoutArticleInput> = z.object({
  where: z.lazy(() => SavedArticleWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => SavedArticleUpdateWithoutArticleInputSchema),z.lazy(() => SavedArticleUncheckedUpdateWithoutArticleInputSchema) ]),
}).strict();

export const SavedArticleUpdateManyWithWhereWithoutArticleInputSchema: z.ZodType<Prisma.SavedArticleUpdateManyWithWhereWithoutArticleInput> = z.object({
  where: z.lazy(() => SavedArticleScalarWhereInputSchema),
  data: z.union([ z.lazy(() => SavedArticleUpdateManyMutationInputSchema),z.lazy(() => SavedArticleUncheckedUpdateManyWithoutArticleInputSchema) ]),
}).strict();

export const CommentUpsertWithWhereUniqueWithoutArticleInputSchema: z.ZodType<Prisma.CommentUpsertWithWhereUniqueWithoutArticleInput> = z.object({
  where: z.lazy(() => CommentWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => CommentUpdateWithoutArticleInputSchema),z.lazy(() => CommentUncheckedUpdateWithoutArticleInputSchema) ]),
  create: z.union([ z.lazy(() => CommentCreateWithoutArticleInputSchema),z.lazy(() => CommentUncheckedCreateWithoutArticleInputSchema) ]),
}).strict();

export const CommentUpdateWithWhereUniqueWithoutArticleInputSchema: z.ZodType<Prisma.CommentUpdateWithWhereUniqueWithoutArticleInput> = z.object({
  where: z.lazy(() => CommentWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => CommentUpdateWithoutArticleInputSchema),z.lazy(() => CommentUncheckedUpdateWithoutArticleInputSchema) ]),
}).strict();

export const CommentUpdateManyWithWhereWithoutArticleInputSchema: z.ZodType<Prisma.CommentUpdateManyWithWhereWithoutArticleInput> = z.object({
  where: z.lazy(() => CommentScalarWhereInputSchema),
  data: z.union([ z.lazy(() => CommentUpdateManyMutationInputSchema),z.lazy(() => CommentUncheckedUpdateManyWithoutArticleInputSchema) ]),
}).strict();

export const ReactionUpsertWithWhereUniqueWithoutArticleInputSchema: z.ZodType<Prisma.ReactionUpsertWithWhereUniqueWithoutArticleInput> = z.object({
  where: z.lazy(() => ReactionWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ReactionUpdateWithoutArticleInputSchema),z.lazy(() => ReactionUncheckedUpdateWithoutArticleInputSchema) ]),
  create: z.union([ z.lazy(() => ReactionCreateWithoutArticleInputSchema),z.lazy(() => ReactionUncheckedCreateWithoutArticleInputSchema) ]),
}).strict();

export const ReactionUpdateWithWhereUniqueWithoutArticleInputSchema: z.ZodType<Prisma.ReactionUpdateWithWhereUniqueWithoutArticleInput> = z.object({
  where: z.lazy(() => ReactionWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ReactionUpdateWithoutArticleInputSchema),z.lazy(() => ReactionUncheckedUpdateWithoutArticleInputSchema) ]),
}).strict();

export const ReactionUpdateManyWithWhereWithoutArticleInputSchema: z.ZodType<Prisma.ReactionUpdateManyWithWhereWithoutArticleInput> = z.object({
  where: z.lazy(() => ReactionScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ReactionUpdateManyMutationInputSchema),z.lazy(() => ReactionUncheckedUpdateManyWithoutArticleInputSchema) ]),
}).strict();

export const ViewUpsertWithWhereUniqueWithoutArticleInputSchema: z.ZodType<Prisma.ViewUpsertWithWhereUniqueWithoutArticleInput> = z.object({
  where: z.lazy(() => ViewWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ViewUpdateWithoutArticleInputSchema),z.lazy(() => ViewUncheckedUpdateWithoutArticleInputSchema) ]),
  create: z.union([ z.lazy(() => ViewCreateWithoutArticleInputSchema),z.lazy(() => ViewUncheckedCreateWithoutArticleInputSchema) ]),
}).strict();

export const ViewUpdateWithWhereUniqueWithoutArticleInputSchema: z.ZodType<Prisma.ViewUpdateWithWhereUniqueWithoutArticleInput> = z.object({
  where: z.lazy(() => ViewWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ViewUpdateWithoutArticleInputSchema),z.lazy(() => ViewUncheckedUpdateWithoutArticleInputSchema) ]),
}).strict();

export const ViewUpdateManyWithWhereWithoutArticleInputSchema: z.ZodType<Prisma.ViewUpdateManyWithWhereWithoutArticleInput> = z.object({
  where: z.lazy(() => ViewScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ViewUpdateManyMutationInputSchema),z.lazy(() => ViewUncheckedUpdateManyWithoutArticleInputSchema) ]),
}).strict();

export const UserCreateWithoutSavedArticlesInputSchema: z.ZodType<Prisma.UserCreateWithoutSavedArticlesInput> = z.object({
  username: z.string(),
  name: z.string(),
  firstName: z.string(),
  email: z.string(),
  emailVerifiedAt: z.coerce.date().optional().nullable(),
  password: z.string(),
  profileUrl: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  activationToken: z.lazy(() => ActivationTokenCreateNestedOneWithoutUserInputSchema).optional(),
  passwordResetToken: z.lazy(() => PasswordResetTokenCreateNestedOneWithoutUserInputSchema).optional(),
  articles: z.lazy(() => ArticleCreateNestedManyWithoutUserInputSchema).optional(),
  tags: z.lazy(() => TagCreateNestedManyWithoutUsersInputSchema).optional(),
  comments: z.lazy(() => CommentCreateNestedManyWithoutUserInputSchema).optional(),
  reactions: z.lazy(() => ReactionCreateNestedManyWithoutUserInputSchema).optional(),
  views: z.lazy(() => ViewCreateNestedManyWithoutUserInputSchema).optional(),
  following: z.lazy(() => FollowCreateNestedManyWithoutFollowerInputSchema).optional(),
  followers: z.lazy(() => FollowCreateNestedManyWithoutFollowingInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutSavedArticlesInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutSavedArticlesInput> = z.object({
  id: z.number().int().optional(),
  username: z.string(),
  name: z.string(),
  firstName: z.string(),
  email: z.string(),
  emailVerifiedAt: z.coerce.date().optional().nullable(),
  password: z.string(),
  profileUrl: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  activationToken: z.lazy(() => ActivationTokenUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
  passwordResetToken: z.lazy(() => PasswordResetTokenUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
  articles: z.lazy(() => ArticleUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  tags: z.lazy(() => TagUncheckedCreateNestedManyWithoutUsersInputSchema).optional(),
  comments: z.lazy(() => CommentUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  reactions: z.lazy(() => ReactionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  views: z.lazy(() => ViewUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  following: z.lazy(() => FollowUncheckedCreateNestedManyWithoutFollowerInputSchema).optional(),
  followers: z.lazy(() => FollowUncheckedCreateNestedManyWithoutFollowingInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutSavedArticlesInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutSavedArticlesInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutSavedArticlesInputSchema),z.lazy(() => UserUncheckedCreateWithoutSavedArticlesInputSchema) ]),
}).strict();

export const ArticleCreateWithoutSavedArticlesInputSchema: z.ZodType<Prisma.ArticleCreateWithoutSavedArticlesInput> = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  summary: z.string().optional().nullable(),
  coverUrl: z.string().optional().nullable(),
  content: z.string(),
  isVisible: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  user: z.lazy(() => UserCreateNestedOneWithoutArticlesInputSchema),
  tags: z.lazy(() => TagCreateNestedManyWithoutArticlesInputSchema).optional(),
  comments: z.lazy(() => CommentCreateNestedManyWithoutArticleInputSchema).optional(),
  reactions: z.lazy(() => ReactionCreateNestedManyWithoutArticleInputSchema).optional(),
  views: z.lazy(() => ViewCreateNestedManyWithoutArticleInputSchema).optional()
}).strict();

export const ArticleUncheckedCreateWithoutSavedArticlesInputSchema: z.ZodType<Prisma.ArticleUncheckedCreateWithoutSavedArticlesInput> = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  userId: z.number().int(),
  summary: z.string().optional().nullable(),
  coverUrl: z.string().optional().nullable(),
  content: z.string(),
  isVisible: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  tags: z.lazy(() => TagUncheckedCreateNestedManyWithoutArticlesInputSchema).optional(),
  comments: z.lazy(() => CommentUncheckedCreateNestedManyWithoutArticleInputSchema).optional(),
  reactions: z.lazy(() => ReactionUncheckedCreateNestedManyWithoutArticleInputSchema).optional(),
  views: z.lazy(() => ViewUncheckedCreateNestedManyWithoutArticleInputSchema).optional()
}).strict();

export const ArticleCreateOrConnectWithoutSavedArticlesInputSchema: z.ZodType<Prisma.ArticleCreateOrConnectWithoutSavedArticlesInput> = z.object({
  where: z.lazy(() => ArticleWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ArticleCreateWithoutSavedArticlesInputSchema),z.lazy(() => ArticleUncheckedCreateWithoutSavedArticlesInputSchema) ]),
}).strict();

export const UserUpsertWithoutSavedArticlesInputSchema: z.ZodType<Prisma.UserUpsertWithoutSavedArticlesInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutSavedArticlesInputSchema),z.lazy(() => UserUncheckedUpdateWithoutSavedArticlesInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutSavedArticlesInputSchema),z.lazy(() => UserUncheckedCreateWithoutSavedArticlesInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutSavedArticlesInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutSavedArticlesInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutSavedArticlesInputSchema),z.lazy(() => UserUncheckedUpdateWithoutSavedArticlesInputSchema) ]),
}).strict();

export const UserUpdateWithoutSavedArticlesInputSchema: z.ZodType<Prisma.UserUpdateWithoutSavedArticlesInput> = z.object({
  username: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerifiedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  profileUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  activationToken: z.lazy(() => ActivationTokenUpdateOneWithoutUserNestedInputSchema).optional(),
  passwordResetToken: z.lazy(() => PasswordResetTokenUpdateOneWithoutUserNestedInputSchema).optional(),
  articles: z.lazy(() => ArticleUpdateManyWithoutUserNestedInputSchema).optional(),
  tags: z.lazy(() => TagUpdateManyWithoutUsersNestedInputSchema).optional(),
  comments: z.lazy(() => CommentUpdateManyWithoutUserNestedInputSchema).optional(),
  reactions: z.lazy(() => ReactionUpdateManyWithoutUserNestedInputSchema).optional(),
  views: z.lazy(() => ViewUpdateManyWithoutUserNestedInputSchema).optional(),
  following: z.lazy(() => FollowUpdateManyWithoutFollowerNestedInputSchema).optional(),
  followers: z.lazy(() => FollowUpdateManyWithoutFollowingNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutSavedArticlesInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutSavedArticlesInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerifiedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  profileUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  activationToken: z.lazy(() => ActivationTokenUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
  passwordResetToken: z.lazy(() => PasswordResetTokenUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
  articles: z.lazy(() => ArticleUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  tags: z.lazy(() => TagUncheckedUpdateManyWithoutUsersNestedInputSchema).optional(),
  comments: z.lazy(() => CommentUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  reactions: z.lazy(() => ReactionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  views: z.lazy(() => ViewUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  following: z.lazy(() => FollowUncheckedUpdateManyWithoutFollowerNestedInputSchema).optional(),
  followers: z.lazy(() => FollowUncheckedUpdateManyWithoutFollowingNestedInputSchema).optional()
}).strict();

export const ArticleUpsertWithoutSavedArticlesInputSchema: z.ZodType<Prisma.ArticleUpsertWithoutSavedArticlesInput> = z.object({
  update: z.union([ z.lazy(() => ArticleUpdateWithoutSavedArticlesInputSchema),z.lazy(() => ArticleUncheckedUpdateWithoutSavedArticlesInputSchema) ]),
  create: z.union([ z.lazy(() => ArticleCreateWithoutSavedArticlesInputSchema),z.lazy(() => ArticleUncheckedCreateWithoutSavedArticlesInputSchema) ]),
  where: z.lazy(() => ArticleWhereInputSchema).optional()
}).strict();

export const ArticleUpdateToOneWithWhereWithoutSavedArticlesInputSchema: z.ZodType<Prisma.ArticleUpdateToOneWithWhereWithoutSavedArticlesInput> = z.object({
  where: z.lazy(() => ArticleWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ArticleUpdateWithoutSavedArticlesInputSchema),z.lazy(() => ArticleUncheckedUpdateWithoutSavedArticlesInputSchema) ]),
}).strict();

export const ArticleUpdateWithoutSavedArticlesInputSchema: z.ZodType<Prisma.ArticleUpdateWithoutSavedArticlesInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  summary: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  coverUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  content: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isVisible: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutArticlesNestedInputSchema).optional(),
  tags: z.lazy(() => TagUpdateManyWithoutArticlesNestedInputSchema).optional(),
  comments: z.lazy(() => CommentUpdateManyWithoutArticleNestedInputSchema).optional(),
  reactions: z.lazy(() => ReactionUpdateManyWithoutArticleNestedInputSchema).optional(),
  views: z.lazy(() => ViewUpdateManyWithoutArticleNestedInputSchema).optional()
}).strict();

export const ArticleUncheckedUpdateWithoutSavedArticlesInputSchema: z.ZodType<Prisma.ArticleUncheckedUpdateWithoutSavedArticlesInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  summary: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  coverUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  content: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isVisible: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  tags: z.lazy(() => TagUncheckedUpdateManyWithoutArticlesNestedInputSchema).optional(),
  comments: z.lazy(() => CommentUncheckedUpdateManyWithoutArticleNestedInputSchema).optional(),
  reactions: z.lazy(() => ReactionUncheckedUpdateManyWithoutArticleNestedInputSchema).optional(),
  views: z.lazy(() => ViewUncheckedUpdateManyWithoutArticleNestedInputSchema).optional()
}).strict();

export const ArticleCreateWithoutTagsInputSchema: z.ZodType<Prisma.ArticleCreateWithoutTagsInput> = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  summary: z.string().optional().nullable(),
  coverUrl: z.string().optional().nullable(),
  content: z.string(),
  isVisible: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  user: z.lazy(() => UserCreateNestedOneWithoutArticlesInputSchema),
  savedArticles: z.lazy(() => SavedArticleCreateNestedManyWithoutArticleInputSchema).optional(),
  comments: z.lazy(() => CommentCreateNestedManyWithoutArticleInputSchema).optional(),
  reactions: z.lazy(() => ReactionCreateNestedManyWithoutArticleInputSchema).optional(),
  views: z.lazy(() => ViewCreateNestedManyWithoutArticleInputSchema).optional()
}).strict();

export const ArticleUncheckedCreateWithoutTagsInputSchema: z.ZodType<Prisma.ArticleUncheckedCreateWithoutTagsInput> = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  userId: z.number().int(),
  summary: z.string().optional().nullable(),
  coverUrl: z.string().optional().nullable(),
  content: z.string(),
  isVisible: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  savedArticles: z.lazy(() => SavedArticleUncheckedCreateNestedManyWithoutArticleInputSchema).optional(),
  comments: z.lazy(() => CommentUncheckedCreateNestedManyWithoutArticleInputSchema).optional(),
  reactions: z.lazy(() => ReactionUncheckedCreateNestedManyWithoutArticleInputSchema).optional(),
  views: z.lazy(() => ViewUncheckedCreateNestedManyWithoutArticleInputSchema).optional()
}).strict();

export const ArticleCreateOrConnectWithoutTagsInputSchema: z.ZodType<Prisma.ArticleCreateOrConnectWithoutTagsInput> = z.object({
  where: z.lazy(() => ArticleWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ArticleCreateWithoutTagsInputSchema),z.lazy(() => ArticleUncheckedCreateWithoutTagsInputSchema) ]),
}).strict();

export const UserCreateWithoutTagsInputSchema: z.ZodType<Prisma.UserCreateWithoutTagsInput> = z.object({
  username: z.string(),
  name: z.string(),
  firstName: z.string(),
  email: z.string(),
  emailVerifiedAt: z.coerce.date().optional().nullable(),
  password: z.string(),
  profileUrl: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  activationToken: z.lazy(() => ActivationTokenCreateNestedOneWithoutUserInputSchema).optional(),
  passwordResetToken: z.lazy(() => PasswordResetTokenCreateNestedOneWithoutUserInputSchema).optional(),
  articles: z.lazy(() => ArticleCreateNestedManyWithoutUserInputSchema).optional(),
  savedArticles: z.lazy(() => SavedArticleCreateNestedManyWithoutUserInputSchema).optional(),
  comments: z.lazy(() => CommentCreateNestedManyWithoutUserInputSchema).optional(),
  reactions: z.lazy(() => ReactionCreateNestedManyWithoutUserInputSchema).optional(),
  views: z.lazy(() => ViewCreateNestedManyWithoutUserInputSchema).optional(),
  following: z.lazy(() => FollowCreateNestedManyWithoutFollowerInputSchema).optional(),
  followers: z.lazy(() => FollowCreateNestedManyWithoutFollowingInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutTagsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutTagsInput> = z.object({
  id: z.number().int().optional(),
  username: z.string(),
  name: z.string(),
  firstName: z.string(),
  email: z.string(),
  emailVerifiedAt: z.coerce.date().optional().nullable(),
  password: z.string(),
  profileUrl: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  activationToken: z.lazy(() => ActivationTokenUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
  passwordResetToken: z.lazy(() => PasswordResetTokenUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
  articles: z.lazy(() => ArticleUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  savedArticles: z.lazy(() => SavedArticleUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  comments: z.lazy(() => CommentUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  reactions: z.lazy(() => ReactionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  views: z.lazy(() => ViewUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  following: z.lazy(() => FollowUncheckedCreateNestedManyWithoutFollowerInputSchema).optional(),
  followers: z.lazy(() => FollowUncheckedCreateNestedManyWithoutFollowingInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutTagsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutTagsInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutTagsInputSchema),z.lazy(() => UserUncheckedCreateWithoutTagsInputSchema) ]),
}).strict();

export const ArticleUpsertWithWhereUniqueWithoutTagsInputSchema: z.ZodType<Prisma.ArticleUpsertWithWhereUniqueWithoutTagsInput> = z.object({
  where: z.lazy(() => ArticleWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ArticleUpdateWithoutTagsInputSchema),z.lazy(() => ArticleUncheckedUpdateWithoutTagsInputSchema) ]),
  create: z.union([ z.lazy(() => ArticleCreateWithoutTagsInputSchema),z.lazy(() => ArticleUncheckedCreateWithoutTagsInputSchema) ]),
}).strict();

export const ArticleUpdateWithWhereUniqueWithoutTagsInputSchema: z.ZodType<Prisma.ArticleUpdateWithWhereUniqueWithoutTagsInput> = z.object({
  where: z.lazy(() => ArticleWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ArticleUpdateWithoutTagsInputSchema),z.lazy(() => ArticleUncheckedUpdateWithoutTagsInputSchema) ]),
}).strict();

export const ArticleUpdateManyWithWhereWithoutTagsInputSchema: z.ZodType<Prisma.ArticleUpdateManyWithWhereWithoutTagsInput> = z.object({
  where: z.lazy(() => ArticleScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ArticleUpdateManyMutationInputSchema),z.lazy(() => ArticleUncheckedUpdateManyWithoutTagsInputSchema) ]),
}).strict();

export const UserUpsertWithWhereUniqueWithoutTagsInputSchema: z.ZodType<Prisma.UserUpsertWithWhereUniqueWithoutTagsInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => UserUpdateWithoutTagsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutTagsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutTagsInputSchema),z.lazy(() => UserUncheckedCreateWithoutTagsInputSchema) ]),
}).strict();

export const UserUpdateWithWhereUniqueWithoutTagsInputSchema: z.ZodType<Prisma.UserUpdateWithWhereUniqueWithoutTagsInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => UserUpdateWithoutTagsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutTagsInputSchema) ]),
}).strict();

export const UserUpdateManyWithWhereWithoutTagsInputSchema: z.ZodType<Prisma.UserUpdateManyWithWhereWithoutTagsInput> = z.object({
  where: z.lazy(() => UserScalarWhereInputSchema),
  data: z.union([ z.lazy(() => UserUpdateManyMutationInputSchema),z.lazy(() => UserUncheckedUpdateManyWithoutTagsInputSchema) ]),
}).strict();

export const UserScalarWhereInputSchema: z.ZodType<Prisma.UserScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => UserScalarWhereInputSchema),z.lazy(() => UserScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserScalarWhereInputSchema),z.lazy(() => UserScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  username: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  firstName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  emailVerifiedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  password: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  profileUrl: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  role: z.union([ z.lazy(() => EnumRoleFilterSchema),z.lazy(() => RoleSchema) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
}).strict();

export const CommentCreateWithoutRepliesInputSchema: z.ZodType<Prisma.CommentCreateWithoutRepliesInput> = z.object({
  id: z.string(),
  content: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  parent: z.lazy(() => CommentCreateNestedOneWithoutRepliesInputSchema).optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutCommentsInputSchema),
  article: z.lazy(() => ArticleCreateNestedOneWithoutCommentsInputSchema),
  reactions: z.lazy(() => ReactionCreateNestedManyWithoutCommentInputSchema).optional()
}).strict();

export const CommentUncheckedCreateWithoutRepliesInputSchema: z.ZodType<Prisma.CommentUncheckedCreateWithoutRepliesInput> = z.object({
  id: z.string(),
  content: z.string(),
  parentId: z.string().optional().nullable(),
  userId: z.number().int(),
  articleId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  reactions: z.lazy(() => ReactionUncheckedCreateNestedManyWithoutCommentInputSchema).optional()
}).strict();

export const CommentCreateOrConnectWithoutRepliesInputSchema: z.ZodType<Prisma.CommentCreateOrConnectWithoutRepliesInput> = z.object({
  where: z.lazy(() => CommentWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CommentCreateWithoutRepliesInputSchema),z.lazy(() => CommentUncheckedCreateWithoutRepliesInputSchema) ]),
}).strict();

export const CommentCreateWithoutParentInputSchema: z.ZodType<Prisma.CommentCreateWithoutParentInput> = z.object({
  id: z.string(),
  content: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  replies: z.lazy(() => CommentCreateNestedManyWithoutParentInputSchema).optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutCommentsInputSchema),
  article: z.lazy(() => ArticleCreateNestedOneWithoutCommentsInputSchema),
  reactions: z.lazy(() => ReactionCreateNestedManyWithoutCommentInputSchema).optional()
}).strict();

export const CommentUncheckedCreateWithoutParentInputSchema: z.ZodType<Prisma.CommentUncheckedCreateWithoutParentInput> = z.object({
  id: z.string(),
  content: z.string(),
  userId: z.number().int(),
  articleId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  replies: z.lazy(() => CommentUncheckedCreateNestedManyWithoutParentInputSchema).optional(),
  reactions: z.lazy(() => ReactionUncheckedCreateNestedManyWithoutCommentInputSchema).optional()
}).strict();

export const CommentCreateOrConnectWithoutParentInputSchema: z.ZodType<Prisma.CommentCreateOrConnectWithoutParentInput> = z.object({
  where: z.lazy(() => CommentWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CommentCreateWithoutParentInputSchema),z.lazy(() => CommentUncheckedCreateWithoutParentInputSchema) ]),
}).strict();

export const CommentCreateManyParentInputEnvelopeSchema: z.ZodType<Prisma.CommentCreateManyParentInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => CommentCreateManyParentInputSchema),z.lazy(() => CommentCreateManyParentInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const UserCreateWithoutCommentsInputSchema: z.ZodType<Prisma.UserCreateWithoutCommentsInput> = z.object({
  username: z.string(),
  name: z.string(),
  firstName: z.string(),
  email: z.string(),
  emailVerifiedAt: z.coerce.date().optional().nullable(),
  password: z.string(),
  profileUrl: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  activationToken: z.lazy(() => ActivationTokenCreateNestedOneWithoutUserInputSchema).optional(),
  passwordResetToken: z.lazy(() => PasswordResetTokenCreateNestedOneWithoutUserInputSchema).optional(),
  articles: z.lazy(() => ArticleCreateNestedManyWithoutUserInputSchema).optional(),
  savedArticles: z.lazy(() => SavedArticleCreateNestedManyWithoutUserInputSchema).optional(),
  tags: z.lazy(() => TagCreateNestedManyWithoutUsersInputSchema).optional(),
  reactions: z.lazy(() => ReactionCreateNestedManyWithoutUserInputSchema).optional(),
  views: z.lazy(() => ViewCreateNestedManyWithoutUserInputSchema).optional(),
  following: z.lazy(() => FollowCreateNestedManyWithoutFollowerInputSchema).optional(),
  followers: z.lazy(() => FollowCreateNestedManyWithoutFollowingInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutCommentsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutCommentsInput> = z.object({
  id: z.number().int().optional(),
  username: z.string(),
  name: z.string(),
  firstName: z.string(),
  email: z.string(),
  emailVerifiedAt: z.coerce.date().optional().nullable(),
  password: z.string(),
  profileUrl: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  activationToken: z.lazy(() => ActivationTokenUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
  passwordResetToken: z.lazy(() => PasswordResetTokenUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
  articles: z.lazy(() => ArticleUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  savedArticles: z.lazy(() => SavedArticleUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  tags: z.lazy(() => TagUncheckedCreateNestedManyWithoutUsersInputSchema).optional(),
  reactions: z.lazy(() => ReactionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  views: z.lazy(() => ViewUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  following: z.lazy(() => FollowUncheckedCreateNestedManyWithoutFollowerInputSchema).optional(),
  followers: z.lazy(() => FollowUncheckedCreateNestedManyWithoutFollowingInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutCommentsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutCommentsInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutCommentsInputSchema),z.lazy(() => UserUncheckedCreateWithoutCommentsInputSchema) ]),
}).strict();

export const ArticleCreateWithoutCommentsInputSchema: z.ZodType<Prisma.ArticleCreateWithoutCommentsInput> = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  summary: z.string().optional().nullable(),
  coverUrl: z.string().optional().nullable(),
  content: z.string(),
  isVisible: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  user: z.lazy(() => UserCreateNestedOneWithoutArticlesInputSchema),
  tags: z.lazy(() => TagCreateNestedManyWithoutArticlesInputSchema).optional(),
  savedArticles: z.lazy(() => SavedArticleCreateNestedManyWithoutArticleInputSchema).optional(),
  reactions: z.lazy(() => ReactionCreateNestedManyWithoutArticleInputSchema).optional(),
  views: z.lazy(() => ViewCreateNestedManyWithoutArticleInputSchema).optional()
}).strict();

export const ArticleUncheckedCreateWithoutCommentsInputSchema: z.ZodType<Prisma.ArticleUncheckedCreateWithoutCommentsInput> = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  userId: z.number().int(),
  summary: z.string().optional().nullable(),
  coverUrl: z.string().optional().nullable(),
  content: z.string(),
  isVisible: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  tags: z.lazy(() => TagUncheckedCreateNestedManyWithoutArticlesInputSchema).optional(),
  savedArticles: z.lazy(() => SavedArticleUncheckedCreateNestedManyWithoutArticleInputSchema).optional(),
  reactions: z.lazy(() => ReactionUncheckedCreateNestedManyWithoutArticleInputSchema).optional(),
  views: z.lazy(() => ViewUncheckedCreateNestedManyWithoutArticleInputSchema).optional()
}).strict();

export const ArticleCreateOrConnectWithoutCommentsInputSchema: z.ZodType<Prisma.ArticleCreateOrConnectWithoutCommentsInput> = z.object({
  where: z.lazy(() => ArticleWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ArticleCreateWithoutCommentsInputSchema),z.lazy(() => ArticleUncheckedCreateWithoutCommentsInputSchema) ]),
}).strict();

export const ReactionCreateWithoutCommentInputSchema: z.ZodType<Prisma.ReactionCreateWithoutCommentInput> = z.object({
  type: z.lazy(() => ReactionTypeSchema),
  createdAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutReactionsInputSchema),
  article: z.lazy(() => ArticleCreateNestedOneWithoutReactionsInputSchema).optional()
}).strict();

export const ReactionUncheckedCreateWithoutCommentInputSchema: z.ZodType<Prisma.ReactionUncheckedCreateWithoutCommentInput> = z.object({
  id: z.number().int().optional(),
  type: z.lazy(() => ReactionTypeSchema),
  createdAt: z.coerce.date().optional(),
  userId: z.number().int(),
  articleId: z.string().optional().nullable()
}).strict();

export const ReactionCreateOrConnectWithoutCommentInputSchema: z.ZodType<Prisma.ReactionCreateOrConnectWithoutCommentInput> = z.object({
  where: z.lazy(() => ReactionWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ReactionCreateWithoutCommentInputSchema),z.lazy(() => ReactionUncheckedCreateWithoutCommentInputSchema) ]),
}).strict();

export const ReactionCreateManyCommentInputEnvelopeSchema: z.ZodType<Prisma.ReactionCreateManyCommentInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ReactionCreateManyCommentInputSchema),z.lazy(() => ReactionCreateManyCommentInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const CommentUpsertWithoutRepliesInputSchema: z.ZodType<Prisma.CommentUpsertWithoutRepliesInput> = z.object({
  update: z.union([ z.lazy(() => CommentUpdateWithoutRepliesInputSchema),z.lazy(() => CommentUncheckedUpdateWithoutRepliesInputSchema) ]),
  create: z.union([ z.lazy(() => CommentCreateWithoutRepliesInputSchema),z.lazy(() => CommentUncheckedCreateWithoutRepliesInputSchema) ]),
  where: z.lazy(() => CommentWhereInputSchema).optional()
}).strict();

export const CommentUpdateToOneWithWhereWithoutRepliesInputSchema: z.ZodType<Prisma.CommentUpdateToOneWithWhereWithoutRepliesInput> = z.object({
  where: z.lazy(() => CommentWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => CommentUpdateWithoutRepliesInputSchema),z.lazy(() => CommentUncheckedUpdateWithoutRepliesInputSchema) ]),
}).strict();

export const CommentUpdateWithoutRepliesInputSchema: z.ZodType<Prisma.CommentUpdateWithoutRepliesInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  parent: z.lazy(() => CommentUpdateOneWithoutRepliesNestedInputSchema).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutCommentsNestedInputSchema).optional(),
  article: z.lazy(() => ArticleUpdateOneRequiredWithoutCommentsNestedInputSchema).optional(),
  reactions: z.lazy(() => ReactionUpdateManyWithoutCommentNestedInputSchema).optional()
}).strict();

export const CommentUncheckedUpdateWithoutRepliesInputSchema: z.ZodType<Prisma.CommentUncheckedUpdateWithoutRepliesInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  parentId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  articleId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  reactions: z.lazy(() => ReactionUncheckedUpdateManyWithoutCommentNestedInputSchema).optional()
}).strict();

export const CommentUpsertWithWhereUniqueWithoutParentInputSchema: z.ZodType<Prisma.CommentUpsertWithWhereUniqueWithoutParentInput> = z.object({
  where: z.lazy(() => CommentWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => CommentUpdateWithoutParentInputSchema),z.lazy(() => CommentUncheckedUpdateWithoutParentInputSchema) ]),
  create: z.union([ z.lazy(() => CommentCreateWithoutParentInputSchema),z.lazy(() => CommentUncheckedCreateWithoutParentInputSchema) ]),
}).strict();

export const CommentUpdateWithWhereUniqueWithoutParentInputSchema: z.ZodType<Prisma.CommentUpdateWithWhereUniqueWithoutParentInput> = z.object({
  where: z.lazy(() => CommentWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => CommentUpdateWithoutParentInputSchema),z.lazy(() => CommentUncheckedUpdateWithoutParentInputSchema) ]),
}).strict();

export const CommentUpdateManyWithWhereWithoutParentInputSchema: z.ZodType<Prisma.CommentUpdateManyWithWhereWithoutParentInput> = z.object({
  where: z.lazy(() => CommentScalarWhereInputSchema),
  data: z.union([ z.lazy(() => CommentUpdateManyMutationInputSchema),z.lazy(() => CommentUncheckedUpdateManyWithoutParentInputSchema) ]),
}).strict();

export const UserUpsertWithoutCommentsInputSchema: z.ZodType<Prisma.UserUpsertWithoutCommentsInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutCommentsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutCommentsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutCommentsInputSchema),z.lazy(() => UserUncheckedCreateWithoutCommentsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutCommentsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutCommentsInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutCommentsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutCommentsInputSchema) ]),
}).strict();

export const UserUpdateWithoutCommentsInputSchema: z.ZodType<Prisma.UserUpdateWithoutCommentsInput> = z.object({
  username: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerifiedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  profileUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  activationToken: z.lazy(() => ActivationTokenUpdateOneWithoutUserNestedInputSchema).optional(),
  passwordResetToken: z.lazy(() => PasswordResetTokenUpdateOneWithoutUserNestedInputSchema).optional(),
  articles: z.lazy(() => ArticleUpdateManyWithoutUserNestedInputSchema).optional(),
  savedArticles: z.lazy(() => SavedArticleUpdateManyWithoutUserNestedInputSchema).optional(),
  tags: z.lazy(() => TagUpdateManyWithoutUsersNestedInputSchema).optional(),
  reactions: z.lazy(() => ReactionUpdateManyWithoutUserNestedInputSchema).optional(),
  views: z.lazy(() => ViewUpdateManyWithoutUserNestedInputSchema).optional(),
  following: z.lazy(() => FollowUpdateManyWithoutFollowerNestedInputSchema).optional(),
  followers: z.lazy(() => FollowUpdateManyWithoutFollowingNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutCommentsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutCommentsInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerifiedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  profileUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  activationToken: z.lazy(() => ActivationTokenUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
  passwordResetToken: z.lazy(() => PasswordResetTokenUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
  articles: z.lazy(() => ArticleUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  savedArticles: z.lazy(() => SavedArticleUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  tags: z.lazy(() => TagUncheckedUpdateManyWithoutUsersNestedInputSchema).optional(),
  reactions: z.lazy(() => ReactionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  views: z.lazy(() => ViewUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  following: z.lazy(() => FollowUncheckedUpdateManyWithoutFollowerNestedInputSchema).optional(),
  followers: z.lazy(() => FollowUncheckedUpdateManyWithoutFollowingNestedInputSchema).optional()
}).strict();

export const ArticleUpsertWithoutCommentsInputSchema: z.ZodType<Prisma.ArticleUpsertWithoutCommentsInput> = z.object({
  update: z.union([ z.lazy(() => ArticleUpdateWithoutCommentsInputSchema),z.lazy(() => ArticleUncheckedUpdateWithoutCommentsInputSchema) ]),
  create: z.union([ z.lazy(() => ArticleCreateWithoutCommentsInputSchema),z.lazy(() => ArticleUncheckedCreateWithoutCommentsInputSchema) ]),
  where: z.lazy(() => ArticleWhereInputSchema).optional()
}).strict();

export const ArticleUpdateToOneWithWhereWithoutCommentsInputSchema: z.ZodType<Prisma.ArticleUpdateToOneWithWhereWithoutCommentsInput> = z.object({
  where: z.lazy(() => ArticleWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ArticleUpdateWithoutCommentsInputSchema),z.lazy(() => ArticleUncheckedUpdateWithoutCommentsInputSchema) ]),
}).strict();

export const ArticleUpdateWithoutCommentsInputSchema: z.ZodType<Prisma.ArticleUpdateWithoutCommentsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  summary: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  coverUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  content: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isVisible: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutArticlesNestedInputSchema).optional(),
  tags: z.lazy(() => TagUpdateManyWithoutArticlesNestedInputSchema).optional(),
  savedArticles: z.lazy(() => SavedArticleUpdateManyWithoutArticleNestedInputSchema).optional(),
  reactions: z.lazy(() => ReactionUpdateManyWithoutArticleNestedInputSchema).optional(),
  views: z.lazy(() => ViewUpdateManyWithoutArticleNestedInputSchema).optional()
}).strict();

export const ArticleUncheckedUpdateWithoutCommentsInputSchema: z.ZodType<Prisma.ArticleUncheckedUpdateWithoutCommentsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  summary: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  coverUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  content: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isVisible: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  tags: z.lazy(() => TagUncheckedUpdateManyWithoutArticlesNestedInputSchema).optional(),
  savedArticles: z.lazy(() => SavedArticleUncheckedUpdateManyWithoutArticleNestedInputSchema).optional(),
  reactions: z.lazy(() => ReactionUncheckedUpdateManyWithoutArticleNestedInputSchema).optional(),
  views: z.lazy(() => ViewUncheckedUpdateManyWithoutArticleNestedInputSchema).optional()
}).strict();

export const ReactionUpsertWithWhereUniqueWithoutCommentInputSchema: z.ZodType<Prisma.ReactionUpsertWithWhereUniqueWithoutCommentInput> = z.object({
  where: z.lazy(() => ReactionWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ReactionUpdateWithoutCommentInputSchema),z.lazy(() => ReactionUncheckedUpdateWithoutCommentInputSchema) ]),
  create: z.union([ z.lazy(() => ReactionCreateWithoutCommentInputSchema),z.lazy(() => ReactionUncheckedCreateWithoutCommentInputSchema) ]),
}).strict();

export const ReactionUpdateWithWhereUniqueWithoutCommentInputSchema: z.ZodType<Prisma.ReactionUpdateWithWhereUniqueWithoutCommentInput> = z.object({
  where: z.lazy(() => ReactionWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ReactionUpdateWithoutCommentInputSchema),z.lazy(() => ReactionUncheckedUpdateWithoutCommentInputSchema) ]),
}).strict();

export const ReactionUpdateManyWithWhereWithoutCommentInputSchema: z.ZodType<Prisma.ReactionUpdateManyWithWhereWithoutCommentInput> = z.object({
  where: z.lazy(() => ReactionScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ReactionUpdateManyMutationInputSchema),z.lazy(() => ReactionUncheckedUpdateManyWithoutCommentInputSchema) ]),
}).strict();

export const UserCreateWithoutReactionsInputSchema: z.ZodType<Prisma.UserCreateWithoutReactionsInput> = z.object({
  username: z.string(),
  name: z.string(),
  firstName: z.string(),
  email: z.string(),
  emailVerifiedAt: z.coerce.date().optional().nullable(),
  password: z.string(),
  profileUrl: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  activationToken: z.lazy(() => ActivationTokenCreateNestedOneWithoutUserInputSchema).optional(),
  passwordResetToken: z.lazy(() => PasswordResetTokenCreateNestedOneWithoutUserInputSchema).optional(),
  articles: z.lazy(() => ArticleCreateNestedManyWithoutUserInputSchema).optional(),
  savedArticles: z.lazy(() => SavedArticleCreateNestedManyWithoutUserInputSchema).optional(),
  tags: z.lazy(() => TagCreateNestedManyWithoutUsersInputSchema).optional(),
  comments: z.lazy(() => CommentCreateNestedManyWithoutUserInputSchema).optional(),
  views: z.lazy(() => ViewCreateNestedManyWithoutUserInputSchema).optional(),
  following: z.lazy(() => FollowCreateNestedManyWithoutFollowerInputSchema).optional(),
  followers: z.lazy(() => FollowCreateNestedManyWithoutFollowingInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutReactionsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutReactionsInput> = z.object({
  id: z.number().int().optional(),
  username: z.string(),
  name: z.string(),
  firstName: z.string(),
  email: z.string(),
  emailVerifiedAt: z.coerce.date().optional().nullable(),
  password: z.string(),
  profileUrl: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  activationToken: z.lazy(() => ActivationTokenUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
  passwordResetToken: z.lazy(() => PasswordResetTokenUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
  articles: z.lazy(() => ArticleUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  savedArticles: z.lazy(() => SavedArticleUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  tags: z.lazy(() => TagUncheckedCreateNestedManyWithoutUsersInputSchema).optional(),
  comments: z.lazy(() => CommentUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  views: z.lazy(() => ViewUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  following: z.lazy(() => FollowUncheckedCreateNestedManyWithoutFollowerInputSchema).optional(),
  followers: z.lazy(() => FollowUncheckedCreateNestedManyWithoutFollowingInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutReactionsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutReactionsInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutReactionsInputSchema),z.lazy(() => UserUncheckedCreateWithoutReactionsInputSchema) ]),
}).strict();

export const ArticleCreateWithoutReactionsInputSchema: z.ZodType<Prisma.ArticleCreateWithoutReactionsInput> = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  summary: z.string().optional().nullable(),
  coverUrl: z.string().optional().nullable(),
  content: z.string(),
  isVisible: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  user: z.lazy(() => UserCreateNestedOneWithoutArticlesInputSchema),
  tags: z.lazy(() => TagCreateNestedManyWithoutArticlesInputSchema).optional(),
  savedArticles: z.lazy(() => SavedArticleCreateNestedManyWithoutArticleInputSchema).optional(),
  comments: z.lazy(() => CommentCreateNestedManyWithoutArticleInputSchema).optional(),
  views: z.lazy(() => ViewCreateNestedManyWithoutArticleInputSchema).optional()
}).strict();

export const ArticleUncheckedCreateWithoutReactionsInputSchema: z.ZodType<Prisma.ArticleUncheckedCreateWithoutReactionsInput> = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  userId: z.number().int(),
  summary: z.string().optional().nullable(),
  coverUrl: z.string().optional().nullable(),
  content: z.string(),
  isVisible: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  tags: z.lazy(() => TagUncheckedCreateNestedManyWithoutArticlesInputSchema).optional(),
  savedArticles: z.lazy(() => SavedArticleUncheckedCreateNestedManyWithoutArticleInputSchema).optional(),
  comments: z.lazy(() => CommentUncheckedCreateNestedManyWithoutArticleInputSchema).optional(),
  views: z.lazy(() => ViewUncheckedCreateNestedManyWithoutArticleInputSchema).optional()
}).strict();

export const ArticleCreateOrConnectWithoutReactionsInputSchema: z.ZodType<Prisma.ArticleCreateOrConnectWithoutReactionsInput> = z.object({
  where: z.lazy(() => ArticleWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ArticleCreateWithoutReactionsInputSchema),z.lazy(() => ArticleUncheckedCreateWithoutReactionsInputSchema) ]),
}).strict();

export const CommentCreateWithoutReactionsInputSchema: z.ZodType<Prisma.CommentCreateWithoutReactionsInput> = z.object({
  id: z.string(),
  content: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  parent: z.lazy(() => CommentCreateNestedOneWithoutRepliesInputSchema).optional(),
  replies: z.lazy(() => CommentCreateNestedManyWithoutParentInputSchema).optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutCommentsInputSchema),
  article: z.lazy(() => ArticleCreateNestedOneWithoutCommentsInputSchema)
}).strict();

export const CommentUncheckedCreateWithoutReactionsInputSchema: z.ZodType<Prisma.CommentUncheckedCreateWithoutReactionsInput> = z.object({
  id: z.string(),
  content: z.string(),
  parentId: z.string().optional().nullable(),
  userId: z.number().int(),
  articleId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  replies: z.lazy(() => CommentUncheckedCreateNestedManyWithoutParentInputSchema).optional()
}).strict();

export const CommentCreateOrConnectWithoutReactionsInputSchema: z.ZodType<Prisma.CommentCreateOrConnectWithoutReactionsInput> = z.object({
  where: z.lazy(() => CommentWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CommentCreateWithoutReactionsInputSchema),z.lazy(() => CommentUncheckedCreateWithoutReactionsInputSchema) ]),
}).strict();

export const UserUpsertWithoutReactionsInputSchema: z.ZodType<Prisma.UserUpsertWithoutReactionsInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutReactionsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutReactionsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutReactionsInputSchema),z.lazy(() => UserUncheckedCreateWithoutReactionsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutReactionsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutReactionsInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutReactionsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutReactionsInputSchema) ]),
}).strict();

export const UserUpdateWithoutReactionsInputSchema: z.ZodType<Prisma.UserUpdateWithoutReactionsInput> = z.object({
  username: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerifiedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  profileUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  activationToken: z.lazy(() => ActivationTokenUpdateOneWithoutUserNestedInputSchema).optional(),
  passwordResetToken: z.lazy(() => PasswordResetTokenUpdateOneWithoutUserNestedInputSchema).optional(),
  articles: z.lazy(() => ArticleUpdateManyWithoutUserNestedInputSchema).optional(),
  savedArticles: z.lazy(() => SavedArticleUpdateManyWithoutUserNestedInputSchema).optional(),
  tags: z.lazy(() => TagUpdateManyWithoutUsersNestedInputSchema).optional(),
  comments: z.lazy(() => CommentUpdateManyWithoutUserNestedInputSchema).optional(),
  views: z.lazy(() => ViewUpdateManyWithoutUserNestedInputSchema).optional(),
  following: z.lazy(() => FollowUpdateManyWithoutFollowerNestedInputSchema).optional(),
  followers: z.lazy(() => FollowUpdateManyWithoutFollowingNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutReactionsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutReactionsInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerifiedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  profileUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  activationToken: z.lazy(() => ActivationTokenUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
  passwordResetToken: z.lazy(() => PasswordResetTokenUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
  articles: z.lazy(() => ArticleUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  savedArticles: z.lazy(() => SavedArticleUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  tags: z.lazy(() => TagUncheckedUpdateManyWithoutUsersNestedInputSchema).optional(),
  comments: z.lazy(() => CommentUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  views: z.lazy(() => ViewUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  following: z.lazy(() => FollowUncheckedUpdateManyWithoutFollowerNestedInputSchema).optional(),
  followers: z.lazy(() => FollowUncheckedUpdateManyWithoutFollowingNestedInputSchema).optional()
}).strict();

export const ArticleUpsertWithoutReactionsInputSchema: z.ZodType<Prisma.ArticleUpsertWithoutReactionsInput> = z.object({
  update: z.union([ z.lazy(() => ArticleUpdateWithoutReactionsInputSchema),z.lazy(() => ArticleUncheckedUpdateWithoutReactionsInputSchema) ]),
  create: z.union([ z.lazy(() => ArticleCreateWithoutReactionsInputSchema),z.lazy(() => ArticleUncheckedCreateWithoutReactionsInputSchema) ]),
  where: z.lazy(() => ArticleWhereInputSchema).optional()
}).strict();

export const ArticleUpdateToOneWithWhereWithoutReactionsInputSchema: z.ZodType<Prisma.ArticleUpdateToOneWithWhereWithoutReactionsInput> = z.object({
  where: z.lazy(() => ArticleWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ArticleUpdateWithoutReactionsInputSchema),z.lazy(() => ArticleUncheckedUpdateWithoutReactionsInputSchema) ]),
}).strict();

export const ArticleUpdateWithoutReactionsInputSchema: z.ZodType<Prisma.ArticleUpdateWithoutReactionsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  summary: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  coverUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  content: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isVisible: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutArticlesNestedInputSchema).optional(),
  tags: z.lazy(() => TagUpdateManyWithoutArticlesNestedInputSchema).optional(),
  savedArticles: z.lazy(() => SavedArticleUpdateManyWithoutArticleNestedInputSchema).optional(),
  comments: z.lazy(() => CommentUpdateManyWithoutArticleNestedInputSchema).optional(),
  views: z.lazy(() => ViewUpdateManyWithoutArticleNestedInputSchema).optional()
}).strict();

export const ArticleUncheckedUpdateWithoutReactionsInputSchema: z.ZodType<Prisma.ArticleUncheckedUpdateWithoutReactionsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  summary: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  coverUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  content: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isVisible: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  tags: z.lazy(() => TagUncheckedUpdateManyWithoutArticlesNestedInputSchema).optional(),
  savedArticles: z.lazy(() => SavedArticleUncheckedUpdateManyWithoutArticleNestedInputSchema).optional(),
  comments: z.lazy(() => CommentUncheckedUpdateManyWithoutArticleNestedInputSchema).optional(),
  views: z.lazy(() => ViewUncheckedUpdateManyWithoutArticleNestedInputSchema).optional()
}).strict();

export const CommentUpsertWithoutReactionsInputSchema: z.ZodType<Prisma.CommentUpsertWithoutReactionsInput> = z.object({
  update: z.union([ z.lazy(() => CommentUpdateWithoutReactionsInputSchema),z.lazy(() => CommentUncheckedUpdateWithoutReactionsInputSchema) ]),
  create: z.union([ z.lazy(() => CommentCreateWithoutReactionsInputSchema),z.lazy(() => CommentUncheckedCreateWithoutReactionsInputSchema) ]),
  where: z.lazy(() => CommentWhereInputSchema).optional()
}).strict();

export const CommentUpdateToOneWithWhereWithoutReactionsInputSchema: z.ZodType<Prisma.CommentUpdateToOneWithWhereWithoutReactionsInput> = z.object({
  where: z.lazy(() => CommentWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => CommentUpdateWithoutReactionsInputSchema),z.lazy(() => CommentUncheckedUpdateWithoutReactionsInputSchema) ]),
}).strict();

export const CommentUpdateWithoutReactionsInputSchema: z.ZodType<Prisma.CommentUpdateWithoutReactionsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  parent: z.lazy(() => CommentUpdateOneWithoutRepliesNestedInputSchema).optional(),
  replies: z.lazy(() => CommentUpdateManyWithoutParentNestedInputSchema).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutCommentsNestedInputSchema).optional(),
  article: z.lazy(() => ArticleUpdateOneRequiredWithoutCommentsNestedInputSchema).optional()
}).strict();

export const CommentUncheckedUpdateWithoutReactionsInputSchema: z.ZodType<Prisma.CommentUncheckedUpdateWithoutReactionsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  parentId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  articleId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  replies: z.lazy(() => CommentUncheckedUpdateManyWithoutParentNestedInputSchema).optional()
}).strict();

export const UserCreateWithoutViewsInputSchema: z.ZodType<Prisma.UserCreateWithoutViewsInput> = z.object({
  username: z.string(),
  name: z.string(),
  firstName: z.string(),
  email: z.string(),
  emailVerifiedAt: z.coerce.date().optional().nullable(),
  password: z.string(),
  profileUrl: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  activationToken: z.lazy(() => ActivationTokenCreateNestedOneWithoutUserInputSchema).optional(),
  passwordResetToken: z.lazy(() => PasswordResetTokenCreateNestedOneWithoutUserInputSchema).optional(),
  articles: z.lazy(() => ArticleCreateNestedManyWithoutUserInputSchema).optional(),
  savedArticles: z.lazy(() => SavedArticleCreateNestedManyWithoutUserInputSchema).optional(),
  tags: z.lazy(() => TagCreateNestedManyWithoutUsersInputSchema).optional(),
  comments: z.lazy(() => CommentCreateNestedManyWithoutUserInputSchema).optional(),
  reactions: z.lazy(() => ReactionCreateNestedManyWithoutUserInputSchema).optional(),
  following: z.lazy(() => FollowCreateNestedManyWithoutFollowerInputSchema).optional(),
  followers: z.lazy(() => FollowCreateNestedManyWithoutFollowingInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutViewsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutViewsInput> = z.object({
  id: z.number().int().optional(),
  username: z.string(),
  name: z.string(),
  firstName: z.string(),
  email: z.string(),
  emailVerifiedAt: z.coerce.date().optional().nullable(),
  password: z.string(),
  profileUrl: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  activationToken: z.lazy(() => ActivationTokenUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
  passwordResetToken: z.lazy(() => PasswordResetTokenUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
  articles: z.lazy(() => ArticleUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  savedArticles: z.lazy(() => SavedArticleUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  tags: z.lazy(() => TagUncheckedCreateNestedManyWithoutUsersInputSchema).optional(),
  comments: z.lazy(() => CommentUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  reactions: z.lazy(() => ReactionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  following: z.lazy(() => FollowUncheckedCreateNestedManyWithoutFollowerInputSchema).optional(),
  followers: z.lazy(() => FollowUncheckedCreateNestedManyWithoutFollowingInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutViewsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutViewsInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutViewsInputSchema),z.lazy(() => UserUncheckedCreateWithoutViewsInputSchema) ]),
}).strict();

export const ArticleCreateWithoutViewsInputSchema: z.ZodType<Prisma.ArticleCreateWithoutViewsInput> = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  summary: z.string().optional().nullable(),
  coverUrl: z.string().optional().nullable(),
  content: z.string(),
  isVisible: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  user: z.lazy(() => UserCreateNestedOneWithoutArticlesInputSchema),
  tags: z.lazy(() => TagCreateNestedManyWithoutArticlesInputSchema).optional(),
  savedArticles: z.lazy(() => SavedArticleCreateNestedManyWithoutArticleInputSchema).optional(),
  comments: z.lazy(() => CommentCreateNestedManyWithoutArticleInputSchema).optional(),
  reactions: z.lazy(() => ReactionCreateNestedManyWithoutArticleInputSchema).optional()
}).strict();

export const ArticleUncheckedCreateWithoutViewsInputSchema: z.ZodType<Prisma.ArticleUncheckedCreateWithoutViewsInput> = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  userId: z.number().int(),
  summary: z.string().optional().nullable(),
  coverUrl: z.string().optional().nullable(),
  content: z.string(),
  isVisible: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  tags: z.lazy(() => TagUncheckedCreateNestedManyWithoutArticlesInputSchema).optional(),
  savedArticles: z.lazy(() => SavedArticleUncheckedCreateNestedManyWithoutArticleInputSchema).optional(),
  comments: z.lazy(() => CommentUncheckedCreateNestedManyWithoutArticleInputSchema).optional(),
  reactions: z.lazy(() => ReactionUncheckedCreateNestedManyWithoutArticleInputSchema).optional()
}).strict();

export const ArticleCreateOrConnectWithoutViewsInputSchema: z.ZodType<Prisma.ArticleCreateOrConnectWithoutViewsInput> = z.object({
  where: z.lazy(() => ArticleWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ArticleCreateWithoutViewsInputSchema),z.lazy(() => ArticleUncheckedCreateWithoutViewsInputSchema) ]),
}).strict();

export const UserUpsertWithoutViewsInputSchema: z.ZodType<Prisma.UserUpsertWithoutViewsInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutViewsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutViewsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutViewsInputSchema),z.lazy(() => UserUncheckedCreateWithoutViewsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutViewsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutViewsInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutViewsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutViewsInputSchema) ]),
}).strict();

export const UserUpdateWithoutViewsInputSchema: z.ZodType<Prisma.UserUpdateWithoutViewsInput> = z.object({
  username: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerifiedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  profileUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  activationToken: z.lazy(() => ActivationTokenUpdateOneWithoutUserNestedInputSchema).optional(),
  passwordResetToken: z.lazy(() => PasswordResetTokenUpdateOneWithoutUserNestedInputSchema).optional(),
  articles: z.lazy(() => ArticleUpdateManyWithoutUserNestedInputSchema).optional(),
  savedArticles: z.lazy(() => SavedArticleUpdateManyWithoutUserNestedInputSchema).optional(),
  tags: z.lazy(() => TagUpdateManyWithoutUsersNestedInputSchema).optional(),
  comments: z.lazy(() => CommentUpdateManyWithoutUserNestedInputSchema).optional(),
  reactions: z.lazy(() => ReactionUpdateManyWithoutUserNestedInputSchema).optional(),
  following: z.lazy(() => FollowUpdateManyWithoutFollowerNestedInputSchema).optional(),
  followers: z.lazy(() => FollowUpdateManyWithoutFollowingNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutViewsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutViewsInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerifiedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  profileUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  activationToken: z.lazy(() => ActivationTokenUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
  passwordResetToken: z.lazy(() => PasswordResetTokenUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
  articles: z.lazy(() => ArticleUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  savedArticles: z.lazy(() => SavedArticleUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  tags: z.lazy(() => TagUncheckedUpdateManyWithoutUsersNestedInputSchema).optional(),
  comments: z.lazy(() => CommentUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  reactions: z.lazy(() => ReactionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  following: z.lazy(() => FollowUncheckedUpdateManyWithoutFollowerNestedInputSchema).optional(),
  followers: z.lazy(() => FollowUncheckedUpdateManyWithoutFollowingNestedInputSchema).optional()
}).strict();

export const ArticleUpsertWithoutViewsInputSchema: z.ZodType<Prisma.ArticleUpsertWithoutViewsInput> = z.object({
  update: z.union([ z.lazy(() => ArticleUpdateWithoutViewsInputSchema),z.lazy(() => ArticleUncheckedUpdateWithoutViewsInputSchema) ]),
  create: z.union([ z.lazy(() => ArticleCreateWithoutViewsInputSchema),z.lazy(() => ArticleUncheckedCreateWithoutViewsInputSchema) ]),
  where: z.lazy(() => ArticleWhereInputSchema).optional()
}).strict();

export const ArticleUpdateToOneWithWhereWithoutViewsInputSchema: z.ZodType<Prisma.ArticleUpdateToOneWithWhereWithoutViewsInput> = z.object({
  where: z.lazy(() => ArticleWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ArticleUpdateWithoutViewsInputSchema),z.lazy(() => ArticleUncheckedUpdateWithoutViewsInputSchema) ]),
}).strict();

export const ArticleUpdateWithoutViewsInputSchema: z.ZodType<Prisma.ArticleUpdateWithoutViewsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  summary: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  coverUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  content: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isVisible: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutArticlesNestedInputSchema).optional(),
  tags: z.lazy(() => TagUpdateManyWithoutArticlesNestedInputSchema).optional(),
  savedArticles: z.lazy(() => SavedArticleUpdateManyWithoutArticleNestedInputSchema).optional(),
  comments: z.lazy(() => CommentUpdateManyWithoutArticleNestedInputSchema).optional(),
  reactions: z.lazy(() => ReactionUpdateManyWithoutArticleNestedInputSchema).optional()
}).strict();

export const ArticleUncheckedUpdateWithoutViewsInputSchema: z.ZodType<Prisma.ArticleUncheckedUpdateWithoutViewsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  summary: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  coverUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  content: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isVisible: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  tags: z.lazy(() => TagUncheckedUpdateManyWithoutArticlesNestedInputSchema).optional(),
  savedArticles: z.lazy(() => SavedArticleUncheckedUpdateManyWithoutArticleNestedInputSchema).optional(),
  comments: z.lazy(() => CommentUncheckedUpdateManyWithoutArticleNestedInputSchema).optional(),
  reactions: z.lazy(() => ReactionUncheckedUpdateManyWithoutArticleNestedInputSchema).optional()
}).strict();

export const UserCreateWithoutFollowingInputSchema: z.ZodType<Prisma.UserCreateWithoutFollowingInput> = z.object({
  username: z.string(),
  name: z.string(),
  firstName: z.string(),
  email: z.string(),
  emailVerifiedAt: z.coerce.date().optional().nullable(),
  password: z.string(),
  profileUrl: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  activationToken: z.lazy(() => ActivationTokenCreateNestedOneWithoutUserInputSchema).optional(),
  passwordResetToken: z.lazy(() => PasswordResetTokenCreateNestedOneWithoutUserInputSchema).optional(),
  articles: z.lazy(() => ArticleCreateNestedManyWithoutUserInputSchema).optional(),
  savedArticles: z.lazy(() => SavedArticleCreateNestedManyWithoutUserInputSchema).optional(),
  tags: z.lazy(() => TagCreateNestedManyWithoutUsersInputSchema).optional(),
  comments: z.lazy(() => CommentCreateNestedManyWithoutUserInputSchema).optional(),
  reactions: z.lazy(() => ReactionCreateNestedManyWithoutUserInputSchema).optional(),
  views: z.lazy(() => ViewCreateNestedManyWithoutUserInputSchema).optional(),
  followers: z.lazy(() => FollowCreateNestedManyWithoutFollowingInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutFollowingInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutFollowingInput> = z.object({
  id: z.number().int().optional(),
  username: z.string(),
  name: z.string(),
  firstName: z.string(),
  email: z.string(),
  emailVerifiedAt: z.coerce.date().optional().nullable(),
  password: z.string(),
  profileUrl: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  activationToken: z.lazy(() => ActivationTokenUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
  passwordResetToken: z.lazy(() => PasswordResetTokenUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
  articles: z.lazy(() => ArticleUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  savedArticles: z.lazy(() => SavedArticleUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  tags: z.lazy(() => TagUncheckedCreateNestedManyWithoutUsersInputSchema).optional(),
  comments: z.lazy(() => CommentUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  reactions: z.lazy(() => ReactionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  views: z.lazy(() => ViewUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  followers: z.lazy(() => FollowUncheckedCreateNestedManyWithoutFollowingInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutFollowingInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutFollowingInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutFollowingInputSchema),z.lazy(() => UserUncheckedCreateWithoutFollowingInputSchema) ]),
}).strict();

export const UserCreateWithoutFollowersInputSchema: z.ZodType<Prisma.UserCreateWithoutFollowersInput> = z.object({
  username: z.string(),
  name: z.string(),
  firstName: z.string(),
  email: z.string(),
  emailVerifiedAt: z.coerce.date().optional().nullable(),
  password: z.string(),
  profileUrl: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  activationToken: z.lazy(() => ActivationTokenCreateNestedOneWithoutUserInputSchema).optional(),
  passwordResetToken: z.lazy(() => PasswordResetTokenCreateNestedOneWithoutUserInputSchema).optional(),
  articles: z.lazy(() => ArticleCreateNestedManyWithoutUserInputSchema).optional(),
  savedArticles: z.lazy(() => SavedArticleCreateNestedManyWithoutUserInputSchema).optional(),
  tags: z.lazy(() => TagCreateNestedManyWithoutUsersInputSchema).optional(),
  comments: z.lazy(() => CommentCreateNestedManyWithoutUserInputSchema).optional(),
  reactions: z.lazy(() => ReactionCreateNestedManyWithoutUserInputSchema).optional(),
  views: z.lazy(() => ViewCreateNestedManyWithoutUserInputSchema).optional(),
  following: z.lazy(() => FollowCreateNestedManyWithoutFollowerInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutFollowersInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutFollowersInput> = z.object({
  id: z.number().int().optional(),
  username: z.string(),
  name: z.string(),
  firstName: z.string(),
  email: z.string(),
  emailVerifiedAt: z.coerce.date().optional().nullable(),
  password: z.string(),
  profileUrl: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  activationToken: z.lazy(() => ActivationTokenUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
  passwordResetToken: z.lazy(() => PasswordResetTokenUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
  articles: z.lazy(() => ArticleUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  savedArticles: z.lazy(() => SavedArticleUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  tags: z.lazy(() => TagUncheckedCreateNestedManyWithoutUsersInputSchema).optional(),
  comments: z.lazy(() => CommentUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  reactions: z.lazy(() => ReactionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  views: z.lazy(() => ViewUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  following: z.lazy(() => FollowUncheckedCreateNestedManyWithoutFollowerInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutFollowersInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutFollowersInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutFollowersInputSchema),z.lazy(() => UserUncheckedCreateWithoutFollowersInputSchema) ]),
}).strict();

export const UserUpsertWithoutFollowingInputSchema: z.ZodType<Prisma.UserUpsertWithoutFollowingInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutFollowingInputSchema),z.lazy(() => UserUncheckedUpdateWithoutFollowingInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutFollowingInputSchema),z.lazy(() => UserUncheckedCreateWithoutFollowingInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutFollowingInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutFollowingInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutFollowingInputSchema),z.lazy(() => UserUncheckedUpdateWithoutFollowingInputSchema) ]),
}).strict();

export const UserUpdateWithoutFollowingInputSchema: z.ZodType<Prisma.UserUpdateWithoutFollowingInput> = z.object({
  username: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerifiedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  profileUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  activationToken: z.lazy(() => ActivationTokenUpdateOneWithoutUserNestedInputSchema).optional(),
  passwordResetToken: z.lazy(() => PasswordResetTokenUpdateOneWithoutUserNestedInputSchema).optional(),
  articles: z.lazy(() => ArticleUpdateManyWithoutUserNestedInputSchema).optional(),
  savedArticles: z.lazy(() => SavedArticleUpdateManyWithoutUserNestedInputSchema).optional(),
  tags: z.lazy(() => TagUpdateManyWithoutUsersNestedInputSchema).optional(),
  comments: z.lazy(() => CommentUpdateManyWithoutUserNestedInputSchema).optional(),
  reactions: z.lazy(() => ReactionUpdateManyWithoutUserNestedInputSchema).optional(),
  views: z.lazy(() => ViewUpdateManyWithoutUserNestedInputSchema).optional(),
  followers: z.lazy(() => FollowUpdateManyWithoutFollowingNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutFollowingInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutFollowingInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerifiedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  profileUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  activationToken: z.lazy(() => ActivationTokenUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
  passwordResetToken: z.lazy(() => PasswordResetTokenUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
  articles: z.lazy(() => ArticleUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  savedArticles: z.lazy(() => SavedArticleUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  tags: z.lazy(() => TagUncheckedUpdateManyWithoutUsersNestedInputSchema).optional(),
  comments: z.lazy(() => CommentUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  reactions: z.lazy(() => ReactionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  views: z.lazy(() => ViewUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  followers: z.lazy(() => FollowUncheckedUpdateManyWithoutFollowingNestedInputSchema).optional()
}).strict();

export const UserUpsertWithoutFollowersInputSchema: z.ZodType<Prisma.UserUpsertWithoutFollowersInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutFollowersInputSchema),z.lazy(() => UserUncheckedUpdateWithoutFollowersInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutFollowersInputSchema),z.lazy(() => UserUncheckedCreateWithoutFollowersInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutFollowersInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutFollowersInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutFollowersInputSchema),z.lazy(() => UserUncheckedUpdateWithoutFollowersInputSchema) ]),
}).strict();

export const UserUpdateWithoutFollowersInputSchema: z.ZodType<Prisma.UserUpdateWithoutFollowersInput> = z.object({
  username: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerifiedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  profileUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  activationToken: z.lazy(() => ActivationTokenUpdateOneWithoutUserNestedInputSchema).optional(),
  passwordResetToken: z.lazy(() => PasswordResetTokenUpdateOneWithoutUserNestedInputSchema).optional(),
  articles: z.lazy(() => ArticleUpdateManyWithoutUserNestedInputSchema).optional(),
  savedArticles: z.lazy(() => SavedArticleUpdateManyWithoutUserNestedInputSchema).optional(),
  tags: z.lazy(() => TagUpdateManyWithoutUsersNestedInputSchema).optional(),
  comments: z.lazy(() => CommentUpdateManyWithoutUserNestedInputSchema).optional(),
  reactions: z.lazy(() => ReactionUpdateManyWithoutUserNestedInputSchema).optional(),
  views: z.lazy(() => ViewUpdateManyWithoutUserNestedInputSchema).optional(),
  following: z.lazy(() => FollowUpdateManyWithoutFollowerNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutFollowersInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutFollowersInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerifiedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  profileUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  activationToken: z.lazy(() => ActivationTokenUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
  passwordResetToken: z.lazy(() => PasswordResetTokenUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
  articles: z.lazy(() => ArticleUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  savedArticles: z.lazy(() => SavedArticleUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  tags: z.lazy(() => TagUncheckedUpdateManyWithoutUsersNestedInputSchema).optional(),
  comments: z.lazy(() => CommentUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  reactions: z.lazy(() => ReactionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  views: z.lazy(() => ViewUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  following: z.lazy(() => FollowUncheckedUpdateManyWithoutFollowerNestedInputSchema).optional()
}).strict();

export const ArticleCreateManyUserInputSchema: z.ZodType<Prisma.ArticleCreateManyUserInput> = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  summary: z.string().optional().nullable(),
  coverUrl: z.string().optional().nullable(),
  content: z.string(),
  isVisible: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const SavedArticleCreateManyUserInputSchema: z.ZodType<Prisma.SavedArticleCreateManyUserInput> = z.object({
  articleId: z.string(),
  createdAt: z.coerce.date().optional()
}).strict();

export const CommentCreateManyUserInputSchema: z.ZodType<Prisma.CommentCreateManyUserInput> = z.object({
  id: z.string(),
  content: z.string(),
  parentId: z.string().optional().nullable(),
  articleId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const ReactionCreateManyUserInputSchema: z.ZodType<Prisma.ReactionCreateManyUserInput> = z.object({
  id: z.number().int().optional(),
  type: z.lazy(() => ReactionTypeSchema),
  createdAt: z.coerce.date().optional(),
  articleId: z.string().optional().nullable(),
  commentId: z.string().optional().nullable()
}).strict();

export const ViewCreateManyUserInputSchema: z.ZodType<Prisma.ViewCreateManyUserInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  articleId: z.string()
}).strict();

export const FollowCreateManyFollowerInputSchema: z.ZodType<Prisma.FollowCreateManyFollowerInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  followingId: z.number().int()
}).strict();

export const FollowCreateManyFollowingInputSchema: z.ZodType<Prisma.FollowCreateManyFollowingInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  followerId: z.number().int()
}).strict();

export const ArticleUpdateWithoutUserInputSchema: z.ZodType<Prisma.ArticleUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  summary: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  coverUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  content: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isVisible: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  tags: z.lazy(() => TagUpdateManyWithoutArticlesNestedInputSchema).optional(),
  savedArticles: z.lazy(() => SavedArticleUpdateManyWithoutArticleNestedInputSchema).optional(),
  comments: z.lazy(() => CommentUpdateManyWithoutArticleNestedInputSchema).optional(),
  reactions: z.lazy(() => ReactionUpdateManyWithoutArticleNestedInputSchema).optional(),
  views: z.lazy(() => ViewUpdateManyWithoutArticleNestedInputSchema).optional()
}).strict();

export const ArticleUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.ArticleUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  summary: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  coverUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  content: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isVisible: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  tags: z.lazy(() => TagUncheckedUpdateManyWithoutArticlesNestedInputSchema).optional(),
  savedArticles: z.lazy(() => SavedArticleUncheckedUpdateManyWithoutArticleNestedInputSchema).optional(),
  comments: z.lazy(() => CommentUncheckedUpdateManyWithoutArticleNestedInputSchema).optional(),
  reactions: z.lazy(() => ReactionUncheckedUpdateManyWithoutArticleNestedInputSchema).optional(),
  views: z.lazy(() => ViewUncheckedUpdateManyWithoutArticleNestedInputSchema).optional()
}).strict();

export const ArticleUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.ArticleUncheckedUpdateManyWithoutUserInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  summary: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  coverUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  content: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isVisible: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const SavedArticleUpdateWithoutUserInputSchema: z.ZodType<Prisma.SavedArticleUpdateWithoutUserInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  article: z.lazy(() => ArticleUpdateOneRequiredWithoutSavedArticlesNestedInputSchema).optional()
}).strict();

export const SavedArticleUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.SavedArticleUncheckedUpdateWithoutUserInput> = z.object({
  articleId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const SavedArticleUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.SavedArticleUncheckedUpdateManyWithoutUserInput> = z.object({
  articleId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TagUpdateWithoutUsersInputSchema: z.ZodType<Prisma.TagUpdateWithoutUsersInput> = z.object({
  value: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  articles: z.lazy(() => ArticleUpdateManyWithoutTagsNestedInputSchema).optional()
}).strict();

export const TagUncheckedUpdateWithoutUsersInputSchema: z.ZodType<Prisma.TagUncheckedUpdateWithoutUsersInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  articles: z.lazy(() => ArticleUncheckedUpdateManyWithoutTagsNestedInputSchema).optional()
}).strict();

export const TagUncheckedUpdateManyWithoutUsersInputSchema: z.ZodType<Prisma.TagUncheckedUpdateManyWithoutUsersInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CommentUpdateWithoutUserInputSchema: z.ZodType<Prisma.CommentUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  parent: z.lazy(() => CommentUpdateOneWithoutRepliesNestedInputSchema).optional(),
  replies: z.lazy(() => CommentUpdateManyWithoutParentNestedInputSchema).optional(),
  article: z.lazy(() => ArticleUpdateOneRequiredWithoutCommentsNestedInputSchema).optional(),
  reactions: z.lazy(() => ReactionUpdateManyWithoutCommentNestedInputSchema).optional()
}).strict();

export const CommentUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.CommentUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  parentId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  articleId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  replies: z.lazy(() => CommentUncheckedUpdateManyWithoutParentNestedInputSchema).optional(),
  reactions: z.lazy(() => ReactionUncheckedUpdateManyWithoutCommentNestedInputSchema).optional()
}).strict();

export const CommentUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.CommentUncheckedUpdateManyWithoutUserInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  parentId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  articleId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ReactionUpdateWithoutUserInputSchema: z.ZodType<Prisma.ReactionUpdateWithoutUserInput> = z.object({
  type: z.union([ z.lazy(() => ReactionTypeSchema),z.lazy(() => EnumReactionTypeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  article: z.lazy(() => ArticleUpdateOneWithoutReactionsNestedInputSchema).optional(),
  comment: z.lazy(() => CommentUpdateOneWithoutReactionsNestedInputSchema).optional()
}).strict();

export const ReactionUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.ReactionUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => ReactionTypeSchema),z.lazy(() => EnumReactionTypeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  articleId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  commentId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ReactionUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.ReactionUncheckedUpdateManyWithoutUserInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => ReactionTypeSchema),z.lazy(() => EnumReactionTypeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  articleId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  commentId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ViewUpdateWithoutUserInputSchema: z.ZodType<Prisma.ViewUpdateWithoutUserInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  article: z.lazy(() => ArticleUpdateOneRequiredWithoutViewsNestedInputSchema).optional()
}).strict();

export const ViewUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.ViewUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  articleId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ViewUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.ViewUncheckedUpdateManyWithoutUserInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  articleId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const FollowUpdateWithoutFollowerInputSchema: z.ZodType<Prisma.FollowUpdateWithoutFollowerInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  following: z.lazy(() => UserUpdateOneRequiredWithoutFollowersNestedInputSchema).optional()
}).strict();

export const FollowUncheckedUpdateWithoutFollowerInputSchema: z.ZodType<Prisma.FollowUncheckedUpdateWithoutFollowerInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  followingId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const FollowUncheckedUpdateManyWithoutFollowerInputSchema: z.ZodType<Prisma.FollowUncheckedUpdateManyWithoutFollowerInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  followingId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const FollowUpdateWithoutFollowingInputSchema: z.ZodType<Prisma.FollowUpdateWithoutFollowingInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  follower: z.lazy(() => UserUpdateOneRequiredWithoutFollowingNestedInputSchema).optional()
}).strict();

export const FollowUncheckedUpdateWithoutFollowingInputSchema: z.ZodType<Prisma.FollowUncheckedUpdateWithoutFollowingInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  followerId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const FollowUncheckedUpdateManyWithoutFollowingInputSchema: z.ZodType<Prisma.FollowUncheckedUpdateManyWithoutFollowingInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  followerId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const SavedArticleCreateManyArticleInputSchema: z.ZodType<Prisma.SavedArticleCreateManyArticleInput> = z.object({
  userId: z.number().int(),
  createdAt: z.coerce.date().optional()
}).strict();

export const CommentCreateManyArticleInputSchema: z.ZodType<Prisma.CommentCreateManyArticleInput> = z.object({
  id: z.string(),
  content: z.string(),
  parentId: z.string().optional().nullable(),
  userId: z.number().int(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const ReactionCreateManyArticleInputSchema: z.ZodType<Prisma.ReactionCreateManyArticleInput> = z.object({
  id: z.number().int().optional(),
  type: z.lazy(() => ReactionTypeSchema),
  createdAt: z.coerce.date().optional(),
  userId: z.number().int(),
  commentId: z.string().optional().nullable()
}).strict();

export const ViewCreateManyArticleInputSchema: z.ZodType<Prisma.ViewCreateManyArticleInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  userId: z.number().int()
}).strict();

export const TagUpdateWithoutArticlesInputSchema: z.ZodType<Prisma.TagUpdateWithoutArticlesInput> = z.object({
  value: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  users: z.lazy(() => UserUpdateManyWithoutTagsNestedInputSchema).optional()
}).strict();

export const TagUncheckedUpdateWithoutArticlesInputSchema: z.ZodType<Prisma.TagUncheckedUpdateWithoutArticlesInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  users: z.lazy(() => UserUncheckedUpdateManyWithoutTagsNestedInputSchema).optional()
}).strict();

export const TagUncheckedUpdateManyWithoutArticlesInputSchema: z.ZodType<Prisma.TagUncheckedUpdateManyWithoutArticlesInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const SavedArticleUpdateWithoutArticleInputSchema: z.ZodType<Prisma.SavedArticleUpdateWithoutArticleInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutSavedArticlesNestedInputSchema).optional()
}).strict();

export const SavedArticleUncheckedUpdateWithoutArticleInputSchema: z.ZodType<Prisma.SavedArticleUncheckedUpdateWithoutArticleInput> = z.object({
  userId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const SavedArticleUncheckedUpdateManyWithoutArticleInputSchema: z.ZodType<Prisma.SavedArticleUncheckedUpdateManyWithoutArticleInput> = z.object({
  userId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CommentUpdateWithoutArticleInputSchema: z.ZodType<Prisma.CommentUpdateWithoutArticleInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  parent: z.lazy(() => CommentUpdateOneWithoutRepliesNestedInputSchema).optional(),
  replies: z.lazy(() => CommentUpdateManyWithoutParentNestedInputSchema).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutCommentsNestedInputSchema).optional(),
  reactions: z.lazy(() => ReactionUpdateManyWithoutCommentNestedInputSchema).optional()
}).strict();

export const CommentUncheckedUpdateWithoutArticleInputSchema: z.ZodType<Prisma.CommentUncheckedUpdateWithoutArticleInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  parentId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  replies: z.lazy(() => CommentUncheckedUpdateManyWithoutParentNestedInputSchema).optional(),
  reactions: z.lazy(() => ReactionUncheckedUpdateManyWithoutCommentNestedInputSchema).optional()
}).strict();

export const CommentUncheckedUpdateManyWithoutArticleInputSchema: z.ZodType<Prisma.CommentUncheckedUpdateManyWithoutArticleInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  parentId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ReactionUpdateWithoutArticleInputSchema: z.ZodType<Prisma.ReactionUpdateWithoutArticleInput> = z.object({
  type: z.union([ z.lazy(() => ReactionTypeSchema),z.lazy(() => EnumReactionTypeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutReactionsNestedInputSchema).optional(),
  comment: z.lazy(() => CommentUpdateOneWithoutReactionsNestedInputSchema).optional()
}).strict();

export const ReactionUncheckedUpdateWithoutArticleInputSchema: z.ZodType<Prisma.ReactionUncheckedUpdateWithoutArticleInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => ReactionTypeSchema),z.lazy(() => EnumReactionTypeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  commentId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ReactionUncheckedUpdateManyWithoutArticleInputSchema: z.ZodType<Prisma.ReactionUncheckedUpdateManyWithoutArticleInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => ReactionTypeSchema),z.lazy(() => EnumReactionTypeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  commentId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ViewUpdateWithoutArticleInputSchema: z.ZodType<Prisma.ViewUpdateWithoutArticleInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutViewsNestedInputSchema).optional()
}).strict();

export const ViewUncheckedUpdateWithoutArticleInputSchema: z.ZodType<Prisma.ViewUncheckedUpdateWithoutArticleInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ViewUncheckedUpdateManyWithoutArticleInputSchema: z.ZodType<Prisma.ViewUncheckedUpdateManyWithoutArticleInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ArticleUpdateWithoutTagsInputSchema: z.ZodType<Prisma.ArticleUpdateWithoutTagsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  summary: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  coverUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  content: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isVisible: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutArticlesNestedInputSchema).optional(),
  savedArticles: z.lazy(() => SavedArticleUpdateManyWithoutArticleNestedInputSchema).optional(),
  comments: z.lazy(() => CommentUpdateManyWithoutArticleNestedInputSchema).optional(),
  reactions: z.lazy(() => ReactionUpdateManyWithoutArticleNestedInputSchema).optional(),
  views: z.lazy(() => ViewUpdateManyWithoutArticleNestedInputSchema).optional()
}).strict();

export const ArticleUncheckedUpdateWithoutTagsInputSchema: z.ZodType<Prisma.ArticleUncheckedUpdateWithoutTagsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  summary: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  coverUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  content: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isVisible: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  savedArticles: z.lazy(() => SavedArticleUncheckedUpdateManyWithoutArticleNestedInputSchema).optional(),
  comments: z.lazy(() => CommentUncheckedUpdateManyWithoutArticleNestedInputSchema).optional(),
  reactions: z.lazy(() => ReactionUncheckedUpdateManyWithoutArticleNestedInputSchema).optional(),
  views: z.lazy(() => ViewUncheckedUpdateManyWithoutArticleNestedInputSchema).optional()
}).strict();

export const ArticleUncheckedUpdateManyWithoutTagsInputSchema: z.ZodType<Prisma.ArticleUncheckedUpdateManyWithoutTagsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  summary: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  coverUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  content: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isVisible: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const UserUpdateWithoutTagsInputSchema: z.ZodType<Prisma.UserUpdateWithoutTagsInput> = z.object({
  username: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerifiedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  profileUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  activationToken: z.lazy(() => ActivationTokenUpdateOneWithoutUserNestedInputSchema).optional(),
  passwordResetToken: z.lazy(() => PasswordResetTokenUpdateOneWithoutUserNestedInputSchema).optional(),
  articles: z.lazy(() => ArticleUpdateManyWithoutUserNestedInputSchema).optional(),
  savedArticles: z.lazy(() => SavedArticleUpdateManyWithoutUserNestedInputSchema).optional(),
  comments: z.lazy(() => CommentUpdateManyWithoutUserNestedInputSchema).optional(),
  reactions: z.lazy(() => ReactionUpdateManyWithoutUserNestedInputSchema).optional(),
  views: z.lazy(() => ViewUpdateManyWithoutUserNestedInputSchema).optional(),
  following: z.lazy(() => FollowUpdateManyWithoutFollowerNestedInputSchema).optional(),
  followers: z.lazy(() => FollowUpdateManyWithoutFollowingNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutTagsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutTagsInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerifiedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  profileUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  activationToken: z.lazy(() => ActivationTokenUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
  passwordResetToken: z.lazy(() => PasswordResetTokenUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
  articles: z.lazy(() => ArticleUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  savedArticles: z.lazy(() => SavedArticleUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  comments: z.lazy(() => CommentUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  reactions: z.lazy(() => ReactionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  views: z.lazy(() => ViewUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  following: z.lazy(() => FollowUncheckedUpdateManyWithoutFollowerNestedInputSchema).optional(),
  followers: z.lazy(() => FollowUncheckedUpdateManyWithoutFollowingNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateManyWithoutTagsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyWithoutTagsInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerifiedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  profileUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const CommentCreateManyParentInputSchema: z.ZodType<Prisma.CommentCreateManyParentInput> = z.object({
  id: z.string(),
  content: z.string(),
  userId: z.number().int(),
  articleId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable()
}).strict();

export const ReactionCreateManyCommentInputSchema: z.ZodType<Prisma.ReactionCreateManyCommentInput> = z.object({
  id: z.number().int().optional(),
  type: z.lazy(() => ReactionTypeSchema),
  createdAt: z.coerce.date().optional(),
  userId: z.number().int(),
  articleId: z.string().optional().nullable()
}).strict();

export const CommentUpdateWithoutParentInputSchema: z.ZodType<Prisma.CommentUpdateWithoutParentInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  replies: z.lazy(() => CommentUpdateManyWithoutParentNestedInputSchema).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutCommentsNestedInputSchema).optional(),
  article: z.lazy(() => ArticleUpdateOneRequiredWithoutCommentsNestedInputSchema).optional(),
  reactions: z.lazy(() => ReactionUpdateManyWithoutCommentNestedInputSchema).optional()
}).strict();

export const CommentUncheckedUpdateWithoutParentInputSchema: z.ZodType<Prisma.CommentUncheckedUpdateWithoutParentInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  articleId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  replies: z.lazy(() => CommentUncheckedUpdateManyWithoutParentNestedInputSchema).optional(),
  reactions: z.lazy(() => ReactionUncheckedUpdateManyWithoutCommentNestedInputSchema).optional()
}).strict();

export const CommentUncheckedUpdateManyWithoutParentInputSchema: z.ZodType<Prisma.CommentUncheckedUpdateManyWithoutParentInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  articleId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ReactionUpdateWithoutCommentInputSchema: z.ZodType<Prisma.ReactionUpdateWithoutCommentInput> = z.object({
  type: z.union([ z.lazy(() => ReactionTypeSchema),z.lazy(() => EnumReactionTypeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutReactionsNestedInputSchema).optional(),
  article: z.lazy(() => ArticleUpdateOneWithoutReactionsNestedInputSchema).optional()
}).strict();

export const ReactionUncheckedUpdateWithoutCommentInputSchema: z.ZodType<Prisma.ReactionUncheckedUpdateWithoutCommentInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => ReactionTypeSchema),z.lazy(() => EnumReactionTypeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  articleId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ReactionUncheckedUpdateManyWithoutCommentInputSchema: z.ZodType<Prisma.ReactionUncheckedUpdateManyWithoutCommentInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => ReactionTypeSchema),z.lazy(() => EnumReactionTypeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  articleId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

export const UserFindFirstArgsSchema: z.ZodType<Prisma.UserFindFirstArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserFindFirstOrThrowArgsSchema: z.ZodType<Prisma.UserFindFirstOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserFindManyArgsSchema: z.ZodType<Prisma.UserFindManyArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserAggregateArgsSchema: z.ZodType<Prisma.UserAggregateArgs> = z.object({
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserGroupByArgsSchema: z.ZodType<Prisma.UserGroupByArgs> = z.object({
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithAggregationInputSchema.array(),UserOrderByWithAggregationInputSchema ]).optional(),
  by: UserScalarFieldEnumSchema.array(),
  having: UserScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserFindUniqueArgsSchema: z.ZodType<Prisma.UserFindUniqueArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.UserFindUniqueOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const PasswordResetTokenFindFirstArgsSchema: z.ZodType<Prisma.PasswordResetTokenFindFirstArgs> = z.object({
  select: PasswordResetTokenSelectSchema.optional(),
  include: PasswordResetTokenIncludeSchema.optional(),
  where: PasswordResetTokenWhereInputSchema.optional(),
  orderBy: z.union([ PasswordResetTokenOrderByWithRelationInputSchema.array(),PasswordResetTokenOrderByWithRelationInputSchema ]).optional(),
  cursor: PasswordResetTokenWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PasswordResetTokenScalarFieldEnumSchema,PasswordResetTokenScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PasswordResetTokenFindFirstOrThrowArgsSchema: z.ZodType<Prisma.PasswordResetTokenFindFirstOrThrowArgs> = z.object({
  select: PasswordResetTokenSelectSchema.optional(),
  include: PasswordResetTokenIncludeSchema.optional(),
  where: PasswordResetTokenWhereInputSchema.optional(),
  orderBy: z.union([ PasswordResetTokenOrderByWithRelationInputSchema.array(),PasswordResetTokenOrderByWithRelationInputSchema ]).optional(),
  cursor: PasswordResetTokenWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PasswordResetTokenScalarFieldEnumSchema,PasswordResetTokenScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PasswordResetTokenFindManyArgsSchema: z.ZodType<Prisma.PasswordResetTokenFindManyArgs> = z.object({
  select: PasswordResetTokenSelectSchema.optional(),
  include: PasswordResetTokenIncludeSchema.optional(),
  where: PasswordResetTokenWhereInputSchema.optional(),
  orderBy: z.union([ PasswordResetTokenOrderByWithRelationInputSchema.array(),PasswordResetTokenOrderByWithRelationInputSchema ]).optional(),
  cursor: PasswordResetTokenWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PasswordResetTokenScalarFieldEnumSchema,PasswordResetTokenScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PasswordResetTokenAggregateArgsSchema: z.ZodType<Prisma.PasswordResetTokenAggregateArgs> = z.object({
  where: PasswordResetTokenWhereInputSchema.optional(),
  orderBy: z.union([ PasswordResetTokenOrderByWithRelationInputSchema.array(),PasswordResetTokenOrderByWithRelationInputSchema ]).optional(),
  cursor: PasswordResetTokenWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const PasswordResetTokenGroupByArgsSchema: z.ZodType<Prisma.PasswordResetTokenGroupByArgs> = z.object({
  where: PasswordResetTokenWhereInputSchema.optional(),
  orderBy: z.union([ PasswordResetTokenOrderByWithAggregationInputSchema.array(),PasswordResetTokenOrderByWithAggregationInputSchema ]).optional(),
  by: PasswordResetTokenScalarFieldEnumSchema.array(),
  having: PasswordResetTokenScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const PasswordResetTokenFindUniqueArgsSchema: z.ZodType<Prisma.PasswordResetTokenFindUniqueArgs> = z.object({
  select: PasswordResetTokenSelectSchema.optional(),
  include: PasswordResetTokenIncludeSchema.optional(),
  where: PasswordResetTokenWhereUniqueInputSchema,
}).strict() ;

export const PasswordResetTokenFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.PasswordResetTokenFindUniqueOrThrowArgs> = z.object({
  select: PasswordResetTokenSelectSchema.optional(),
  include: PasswordResetTokenIncludeSchema.optional(),
  where: PasswordResetTokenWhereUniqueInputSchema,
}).strict() ;

export const ActivationTokenFindFirstArgsSchema: z.ZodType<Prisma.ActivationTokenFindFirstArgs> = z.object({
  select: ActivationTokenSelectSchema.optional(),
  include: ActivationTokenIncludeSchema.optional(),
  where: ActivationTokenWhereInputSchema.optional(),
  orderBy: z.union([ ActivationTokenOrderByWithRelationInputSchema.array(),ActivationTokenOrderByWithRelationInputSchema ]).optional(),
  cursor: ActivationTokenWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ActivationTokenScalarFieldEnumSchema,ActivationTokenScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ActivationTokenFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ActivationTokenFindFirstOrThrowArgs> = z.object({
  select: ActivationTokenSelectSchema.optional(),
  include: ActivationTokenIncludeSchema.optional(),
  where: ActivationTokenWhereInputSchema.optional(),
  orderBy: z.union([ ActivationTokenOrderByWithRelationInputSchema.array(),ActivationTokenOrderByWithRelationInputSchema ]).optional(),
  cursor: ActivationTokenWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ActivationTokenScalarFieldEnumSchema,ActivationTokenScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ActivationTokenFindManyArgsSchema: z.ZodType<Prisma.ActivationTokenFindManyArgs> = z.object({
  select: ActivationTokenSelectSchema.optional(),
  include: ActivationTokenIncludeSchema.optional(),
  where: ActivationTokenWhereInputSchema.optional(),
  orderBy: z.union([ ActivationTokenOrderByWithRelationInputSchema.array(),ActivationTokenOrderByWithRelationInputSchema ]).optional(),
  cursor: ActivationTokenWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ActivationTokenScalarFieldEnumSchema,ActivationTokenScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ActivationTokenAggregateArgsSchema: z.ZodType<Prisma.ActivationTokenAggregateArgs> = z.object({
  where: ActivationTokenWhereInputSchema.optional(),
  orderBy: z.union([ ActivationTokenOrderByWithRelationInputSchema.array(),ActivationTokenOrderByWithRelationInputSchema ]).optional(),
  cursor: ActivationTokenWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ActivationTokenGroupByArgsSchema: z.ZodType<Prisma.ActivationTokenGroupByArgs> = z.object({
  where: ActivationTokenWhereInputSchema.optional(),
  orderBy: z.union([ ActivationTokenOrderByWithAggregationInputSchema.array(),ActivationTokenOrderByWithAggregationInputSchema ]).optional(),
  by: ActivationTokenScalarFieldEnumSchema.array(),
  having: ActivationTokenScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ActivationTokenFindUniqueArgsSchema: z.ZodType<Prisma.ActivationTokenFindUniqueArgs> = z.object({
  select: ActivationTokenSelectSchema.optional(),
  include: ActivationTokenIncludeSchema.optional(),
  where: ActivationTokenWhereUniqueInputSchema,
}).strict() ;

export const ActivationTokenFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ActivationTokenFindUniqueOrThrowArgs> = z.object({
  select: ActivationTokenSelectSchema.optional(),
  include: ActivationTokenIncludeSchema.optional(),
  where: ActivationTokenWhereUniqueInputSchema,
}).strict() ;

export const ArticleFindFirstArgsSchema: z.ZodType<Prisma.ArticleFindFirstArgs> = z.object({
  select: ArticleSelectSchema.optional(),
  include: ArticleIncludeSchema.optional(),
  where: ArticleWhereInputSchema.optional(),
  orderBy: z.union([ ArticleOrderByWithRelationInputSchema.array(),ArticleOrderByWithRelationInputSchema ]).optional(),
  cursor: ArticleWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ArticleScalarFieldEnumSchema,ArticleScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ArticleFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ArticleFindFirstOrThrowArgs> = z.object({
  select: ArticleSelectSchema.optional(),
  include: ArticleIncludeSchema.optional(),
  where: ArticleWhereInputSchema.optional(),
  orderBy: z.union([ ArticleOrderByWithRelationInputSchema.array(),ArticleOrderByWithRelationInputSchema ]).optional(),
  cursor: ArticleWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ArticleScalarFieldEnumSchema,ArticleScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ArticleFindManyArgsSchema: z.ZodType<Prisma.ArticleFindManyArgs> = z.object({
  select: ArticleSelectSchema.optional(),
  include: ArticleIncludeSchema.optional(),
  where: ArticleWhereInputSchema.optional(),
  orderBy: z.union([ ArticleOrderByWithRelationInputSchema.array(),ArticleOrderByWithRelationInputSchema ]).optional(),
  cursor: ArticleWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ArticleScalarFieldEnumSchema,ArticleScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ArticleAggregateArgsSchema: z.ZodType<Prisma.ArticleAggregateArgs> = z.object({
  where: ArticleWhereInputSchema.optional(),
  orderBy: z.union([ ArticleOrderByWithRelationInputSchema.array(),ArticleOrderByWithRelationInputSchema ]).optional(),
  cursor: ArticleWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ArticleGroupByArgsSchema: z.ZodType<Prisma.ArticleGroupByArgs> = z.object({
  where: ArticleWhereInputSchema.optional(),
  orderBy: z.union([ ArticleOrderByWithAggregationInputSchema.array(),ArticleOrderByWithAggregationInputSchema ]).optional(),
  by: ArticleScalarFieldEnumSchema.array(),
  having: ArticleScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ArticleFindUniqueArgsSchema: z.ZodType<Prisma.ArticleFindUniqueArgs> = z.object({
  select: ArticleSelectSchema.optional(),
  include: ArticleIncludeSchema.optional(),
  where: ArticleWhereUniqueInputSchema,
}).strict() ;

export const ArticleFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ArticleFindUniqueOrThrowArgs> = z.object({
  select: ArticleSelectSchema.optional(),
  include: ArticleIncludeSchema.optional(),
  where: ArticleWhereUniqueInputSchema,
}).strict() ;

export const SavedArticleFindFirstArgsSchema: z.ZodType<Prisma.SavedArticleFindFirstArgs> = z.object({
  select: SavedArticleSelectSchema.optional(),
  include: SavedArticleIncludeSchema.optional(),
  where: SavedArticleWhereInputSchema.optional(),
  orderBy: z.union([ SavedArticleOrderByWithRelationInputSchema.array(),SavedArticleOrderByWithRelationInputSchema ]).optional(),
  cursor: SavedArticleWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ SavedArticleScalarFieldEnumSchema,SavedArticleScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const SavedArticleFindFirstOrThrowArgsSchema: z.ZodType<Prisma.SavedArticleFindFirstOrThrowArgs> = z.object({
  select: SavedArticleSelectSchema.optional(),
  include: SavedArticleIncludeSchema.optional(),
  where: SavedArticleWhereInputSchema.optional(),
  orderBy: z.union([ SavedArticleOrderByWithRelationInputSchema.array(),SavedArticleOrderByWithRelationInputSchema ]).optional(),
  cursor: SavedArticleWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ SavedArticleScalarFieldEnumSchema,SavedArticleScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const SavedArticleFindManyArgsSchema: z.ZodType<Prisma.SavedArticleFindManyArgs> = z.object({
  select: SavedArticleSelectSchema.optional(),
  include: SavedArticleIncludeSchema.optional(),
  where: SavedArticleWhereInputSchema.optional(),
  orderBy: z.union([ SavedArticleOrderByWithRelationInputSchema.array(),SavedArticleOrderByWithRelationInputSchema ]).optional(),
  cursor: SavedArticleWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ SavedArticleScalarFieldEnumSchema,SavedArticleScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const SavedArticleAggregateArgsSchema: z.ZodType<Prisma.SavedArticleAggregateArgs> = z.object({
  where: SavedArticleWhereInputSchema.optional(),
  orderBy: z.union([ SavedArticleOrderByWithRelationInputSchema.array(),SavedArticleOrderByWithRelationInputSchema ]).optional(),
  cursor: SavedArticleWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const SavedArticleGroupByArgsSchema: z.ZodType<Prisma.SavedArticleGroupByArgs> = z.object({
  where: SavedArticleWhereInputSchema.optional(),
  orderBy: z.union([ SavedArticleOrderByWithAggregationInputSchema.array(),SavedArticleOrderByWithAggregationInputSchema ]).optional(),
  by: SavedArticleScalarFieldEnumSchema.array(),
  having: SavedArticleScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const SavedArticleFindUniqueArgsSchema: z.ZodType<Prisma.SavedArticleFindUniqueArgs> = z.object({
  select: SavedArticleSelectSchema.optional(),
  include: SavedArticleIncludeSchema.optional(),
  where: SavedArticleWhereUniqueInputSchema,
}).strict() ;

export const SavedArticleFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.SavedArticleFindUniqueOrThrowArgs> = z.object({
  select: SavedArticleSelectSchema.optional(),
  include: SavedArticleIncludeSchema.optional(),
  where: SavedArticleWhereUniqueInputSchema,
}).strict() ;

export const TagFindFirstArgsSchema: z.ZodType<Prisma.TagFindFirstArgs> = z.object({
  select: TagSelectSchema.optional(),
  include: TagIncludeSchema.optional(),
  where: TagWhereInputSchema.optional(),
  orderBy: z.union([ TagOrderByWithRelationInputSchema.array(),TagOrderByWithRelationInputSchema ]).optional(),
  cursor: TagWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TagScalarFieldEnumSchema,TagScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const TagFindFirstOrThrowArgsSchema: z.ZodType<Prisma.TagFindFirstOrThrowArgs> = z.object({
  select: TagSelectSchema.optional(),
  include: TagIncludeSchema.optional(),
  where: TagWhereInputSchema.optional(),
  orderBy: z.union([ TagOrderByWithRelationInputSchema.array(),TagOrderByWithRelationInputSchema ]).optional(),
  cursor: TagWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TagScalarFieldEnumSchema,TagScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const TagFindManyArgsSchema: z.ZodType<Prisma.TagFindManyArgs> = z.object({
  select: TagSelectSchema.optional(),
  include: TagIncludeSchema.optional(),
  where: TagWhereInputSchema.optional(),
  orderBy: z.union([ TagOrderByWithRelationInputSchema.array(),TagOrderByWithRelationInputSchema ]).optional(),
  cursor: TagWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TagScalarFieldEnumSchema,TagScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const TagAggregateArgsSchema: z.ZodType<Prisma.TagAggregateArgs> = z.object({
  where: TagWhereInputSchema.optional(),
  orderBy: z.union([ TagOrderByWithRelationInputSchema.array(),TagOrderByWithRelationInputSchema ]).optional(),
  cursor: TagWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const TagGroupByArgsSchema: z.ZodType<Prisma.TagGroupByArgs> = z.object({
  where: TagWhereInputSchema.optional(),
  orderBy: z.union([ TagOrderByWithAggregationInputSchema.array(),TagOrderByWithAggregationInputSchema ]).optional(),
  by: TagScalarFieldEnumSchema.array(),
  having: TagScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const TagFindUniqueArgsSchema: z.ZodType<Prisma.TagFindUniqueArgs> = z.object({
  select: TagSelectSchema.optional(),
  include: TagIncludeSchema.optional(),
  where: TagWhereUniqueInputSchema,
}).strict() ;

export const TagFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.TagFindUniqueOrThrowArgs> = z.object({
  select: TagSelectSchema.optional(),
  include: TagIncludeSchema.optional(),
  where: TagWhereUniqueInputSchema,
}).strict() ;

export const CommentFindFirstArgsSchema: z.ZodType<Prisma.CommentFindFirstArgs> = z.object({
  select: CommentSelectSchema.optional(),
  include: CommentIncludeSchema.optional(),
  where: CommentWhereInputSchema.optional(),
  orderBy: z.union([ CommentOrderByWithRelationInputSchema.array(),CommentOrderByWithRelationInputSchema ]).optional(),
  cursor: CommentWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CommentScalarFieldEnumSchema,CommentScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CommentFindFirstOrThrowArgsSchema: z.ZodType<Prisma.CommentFindFirstOrThrowArgs> = z.object({
  select: CommentSelectSchema.optional(),
  include: CommentIncludeSchema.optional(),
  where: CommentWhereInputSchema.optional(),
  orderBy: z.union([ CommentOrderByWithRelationInputSchema.array(),CommentOrderByWithRelationInputSchema ]).optional(),
  cursor: CommentWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CommentScalarFieldEnumSchema,CommentScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CommentFindManyArgsSchema: z.ZodType<Prisma.CommentFindManyArgs> = z.object({
  select: CommentSelectSchema.optional(),
  include: CommentIncludeSchema.optional(),
  where: CommentWhereInputSchema.optional(),
  orderBy: z.union([ CommentOrderByWithRelationInputSchema.array(),CommentOrderByWithRelationInputSchema ]).optional(),
  cursor: CommentWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CommentScalarFieldEnumSchema,CommentScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CommentAggregateArgsSchema: z.ZodType<Prisma.CommentAggregateArgs> = z.object({
  where: CommentWhereInputSchema.optional(),
  orderBy: z.union([ CommentOrderByWithRelationInputSchema.array(),CommentOrderByWithRelationInputSchema ]).optional(),
  cursor: CommentWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const CommentGroupByArgsSchema: z.ZodType<Prisma.CommentGroupByArgs> = z.object({
  where: CommentWhereInputSchema.optional(),
  orderBy: z.union([ CommentOrderByWithAggregationInputSchema.array(),CommentOrderByWithAggregationInputSchema ]).optional(),
  by: CommentScalarFieldEnumSchema.array(),
  having: CommentScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const CommentFindUniqueArgsSchema: z.ZodType<Prisma.CommentFindUniqueArgs> = z.object({
  select: CommentSelectSchema.optional(),
  include: CommentIncludeSchema.optional(),
  where: CommentWhereUniqueInputSchema,
}).strict() ;

export const CommentFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.CommentFindUniqueOrThrowArgs> = z.object({
  select: CommentSelectSchema.optional(),
  include: CommentIncludeSchema.optional(),
  where: CommentWhereUniqueInputSchema,
}).strict() ;

export const ReactionFindFirstArgsSchema: z.ZodType<Prisma.ReactionFindFirstArgs> = z.object({
  select: ReactionSelectSchema.optional(),
  include: ReactionIncludeSchema.optional(),
  where: ReactionWhereInputSchema.optional(),
  orderBy: z.union([ ReactionOrderByWithRelationInputSchema.array(),ReactionOrderByWithRelationInputSchema ]).optional(),
  cursor: ReactionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ReactionScalarFieldEnumSchema,ReactionScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ReactionFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ReactionFindFirstOrThrowArgs> = z.object({
  select: ReactionSelectSchema.optional(),
  include: ReactionIncludeSchema.optional(),
  where: ReactionWhereInputSchema.optional(),
  orderBy: z.union([ ReactionOrderByWithRelationInputSchema.array(),ReactionOrderByWithRelationInputSchema ]).optional(),
  cursor: ReactionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ReactionScalarFieldEnumSchema,ReactionScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ReactionFindManyArgsSchema: z.ZodType<Prisma.ReactionFindManyArgs> = z.object({
  select: ReactionSelectSchema.optional(),
  include: ReactionIncludeSchema.optional(),
  where: ReactionWhereInputSchema.optional(),
  orderBy: z.union([ ReactionOrderByWithRelationInputSchema.array(),ReactionOrderByWithRelationInputSchema ]).optional(),
  cursor: ReactionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ReactionScalarFieldEnumSchema,ReactionScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ReactionAggregateArgsSchema: z.ZodType<Prisma.ReactionAggregateArgs> = z.object({
  where: ReactionWhereInputSchema.optional(),
  orderBy: z.union([ ReactionOrderByWithRelationInputSchema.array(),ReactionOrderByWithRelationInputSchema ]).optional(),
  cursor: ReactionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ReactionGroupByArgsSchema: z.ZodType<Prisma.ReactionGroupByArgs> = z.object({
  where: ReactionWhereInputSchema.optional(),
  orderBy: z.union([ ReactionOrderByWithAggregationInputSchema.array(),ReactionOrderByWithAggregationInputSchema ]).optional(),
  by: ReactionScalarFieldEnumSchema.array(),
  having: ReactionScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ReactionFindUniqueArgsSchema: z.ZodType<Prisma.ReactionFindUniqueArgs> = z.object({
  select: ReactionSelectSchema.optional(),
  include: ReactionIncludeSchema.optional(),
  where: ReactionWhereUniqueInputSchema,
}).strict() ;

export const ReactionFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ReactionFindUniqueOrThrowArgs> = z.object({
  select: ReactionSelectSchema.optional(),
  include: ReactionIncludeSchema.optional(),
  where: ReactionWhereUniqueInputSchema,
}).strict() ;

export const ViewFindFirstArgsSchema: z.ZodType<Prisma.ViewFindFirstArgs> = z.object({
  select: ViewSelectSchema.optional(),
  include: ViewIncludeSchema.optional(),
  where: ViewWhereInputSchema.optional(),
  orderBy: z.union([ ViewOrderByWithRelationInputSchema.array(),ViewOrderByWithRelationInputSchema ]).optional(),
  cursor: ViewWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ViewScalarFieldEnumSchema,ViewScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ViewFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ViewFindFirstOrThrowArgs> = z.object({
  select: ViewSelectSchema.optional(),
  include: ViewIncludeSchema.optional(),
  where: ViewWhereInputSchema.optional(),
  orderBy: z.union([ ViewOrderByWithRelationInputSchema.array(),ViewOrderByWithRelationInputSchema ]).optional(),
  cursor: ViewWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ViewScalarFieldEnumSchema,ViewScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ViewFindManyArgsSchema: z.ZodType<Prisma.ViewFindManyArgs> = z.object({
  select: ViewSelectSchema.optional(),
  include: ViewIncludeSchema.optional(),
  where: ViewWhereInputSchema.optional(),
  orderBy: z.union([ ViewOrderByWithRelationInputSchema.array(),ViewOrderByWithRelationInputSchema ]).optional(),
  cursor: ViewWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ViewScalarFieldEnumSchema,ViewScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ViewAggregateArgsSchema: z.ZodType<Prisma.ViewAggregateArgs> = z.object({
  where: ViewWhereInputSchema.optional(),
  orderBy: z.union([ ViewOrderByWithRelationInputSchema.array(),ViewOrderByWithRelationInputSchema ]).optional(),
  cursor: ViewWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ViewGroupByArgsSchema: z.ZodType<Prisma.ViewGroupByArgs> = z.object({
  where: ViewWhereInputSchema.optional(),
  orderBy: z.union([ ViewOrderByWithAggregationInputSchema.array(),ViewOrderByWithAggregationInputSchema ]).optional(),
  by: ViewScalarFieldEnumSchema.array(),
  having: ViewScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ViewFindUniqueArgsSchema: z.ZodType<Prisma.ViewFindUniqueArgs> = z.object({
  select: ViewSelectSchema.optional(),
  include: ViewIncludeSchema.optional(),
  where: ViewWhereUniqueInputSchema,
}).strict() ;

export const ViewFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ViewFindUniqueOrThrowArgs> = z.object({
  select: ViewSelectSchema.optional(),
  include: ViewIncludeSchema.optional(),
  where: ViewWhereUniqueInputSchema,
}).strict() ;

export const FollowFindFirstArgsSchema: z.ZodType<Prisma.FollowFindFirstArgs> = z.object({
  select: FollowSelectSchema.optional(),
  include: FollowIncludeSchema.optional(),
  where: FollowWhereInputSchema.optional(),
  orderBy: z.union([ FollowOrderByWithRelationInputSchema.array(),FollowOrderByWithRelationInputSchema ]).optional(),
  cursor: FollowWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ FollowScalarFieldEnumSchema,FollowScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const FollowFindFirstOrThrowArgsSchema: z.ZodType<Prisma.FollowFindFirstOrThrowArgs> = z.object({
  select: FollowSelectSchema.optional(),
  include: FollowIncludeSchema.optional(),
  where: FollowWhereInputSchema.optional(),
  orderBy: z.union([ FollowOrderByWithRelationInputSchema.array(),FollowOrderByWithRelationInputSchema ]).optional(),
  cursor: FollowWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ FollowScalarFieldEnumSchema,FollowScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const FollowFindManyArgsSchema: z.ZodType<Prisma.FollowFindManyArgs> = z.object({
  select: FollowSelectSchema.optional(),
  include: FollowIncludeSchema.optional(),
  where: FollowWhereInputSchema.optional(),
  orderBy: z.union([ FollowOrderByWithRelationInputSchema.array(),FollowOrderByWithRelationInputSchema ]).optional(),
  cursor: FollowWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ FollowScalarFieldEnumSchema,FollowScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const FollowAggregateArgsSchema: z.ZodType<Prisma.FollowAggregateArgs> = z.object({
  where: FollowWhereInputSchema.optional(),
  orderBy: z.union([ FollowOrderByWithRelationInputSchema.array(),FollowOrderByWithRelationInputSchema ]).optional(),
  cursor: FollowWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const FollowGroupByArgsSchema: z.ZodType<Prisma.FollowGroupByArgs> = z.object({
  where: FollowWhereInputSchema.optional(),
  orderBy: z.union([ FollowOrderByWithAggregationInputSchema.array(),FollowOrderByWithAggregationInputSchema ]).optional(),
  by: FollowScalarFieldEnumSchema.array(),
  having: FollowScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const FollowFindUniqueArgsSchema: z.ZodType<Prisma.FollowFindUniqueArgs> = z.object({
  select: FollowSelectSchema.optional(),
  include: FollowIncludeSchema.optional(),
  where: FollowWhereUniqueInputSchema,
}).strict() ;

export const FollowFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.FollowFindUniqueOrThrowArgs> = z.object({
  select: FollowSelectSchema.optional(),
  include: FollowIncludeSchema.optional(),
  where: FollowWhereUniqueInputSchema,
}).strict() ;

export const UserCreateArgsSchema: z.ZodType<Prisma.UserCreateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserCreateInputSchema,UserUncheckedCreateInputSchema ]),
}).strict() ;

export const UserUpsertArgsSchema: z.ZodType<Prisma.UserUpsertArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
  create: z.union([ UserCreateInputSchema,UserUncheckedCreateInputSchema ]),
  update: z.union([ UserUpdateInputSchema,UserUncheckedUpdateInputSchema ]),
}).strict() ;

export const UserCreateManyArgsSchema: z.ZodType<Prisma.UserCreateManyArgs> = z.object({
  data: z.union([ UserCreateManyInputSchema,UserCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const UserDeleteArgsSchema: z.ZodType<Prisma.UserDeleteArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserUpdateArgsSchema: z.ZodType<Prisma.UserUpdateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserUpdateInputSchema,UserUncheckedUpdateInputSchema ]),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserUpdateManyArgsSchema: z.ZodType<Prisma.UserUpdateManyArgs> = z.object({
  data: z.union([ UserUpdateManyMutationInputSchema,UserUncheckedUpdateManyInputSchema ]),
  where: UserWhereInputSchema.optional(),
}).strict() ;

export const UserDeleteManyArgsSchema: z.ZodType<Prisma.UserDeleteManyArgs> = z.object({
  where: UserWhereInputSchema.optional(),
}).strict() ;

export const PasswordResetTokenCreateArgsSchema: z.ZodType<Prisma.PasswordResetTokenCreateArgs> = z.object({
  select: PasswordResetTokenSelectSchema.optional(),
  include: PasswordResetTokenIncludeSchema.optional(),
  data: z.union([ PasswordResetTokenCreateInputSchema,PasswordResetTokenUncheckedCreateInputSchema ]),
}).strict() ;

export const PasswordResetTokenUpsertArgsSchema: z.ZodType<Prisma.PasswordResetTokenUpsertArgs> = z.object({
  select: PasswordResetTokenSelectSchema.optional(),
  include: PasswordResetTokenIncludeSchema.optional(),
  where: PasswordResetTokenWhereUniqueInputSchema,
  create: z.union([ PasswordResetTokenCreateInputSchema,PasswordResetTokenUncheckedCreateInputSchema ]),
  update: z.union([ PasswordResetTokenUpdateInputSchema,PasswordResetTokenUncheckedUpdateInputSchema ]),
}).strict() ;

export const PasswordResetTokenCreateManyArgsSchema: z.ZodType<Prisma.PasswordResetTokenCreateManyArgs> = z.object({
  data: z.union([ PasswordResetTokenCreateManyInputSchema,PasswordResetTokenCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const PasswordResetTokenDeleteArgsSchema: z.ZodType<Prisma.PasswordResetTokenDeleteArgs> = z.object({
  select: PasswordResetTokenSelectSchema.optional(),
  include: PasswordResetTokenIncludeSchema.optional(),
  where: PasswordResetTokenWhereUniqueInputSchema,
}).strict() ;

export const PasswordResetTokenUpdateArgsSchema: z.ZodType<Prisma.PasswordResetTokenUpdateArgs> = z.object({
  select: PasswordResetTokenSelectSchema.optional(),
  include: PasswordResetTokenIncludeSchema.optional(),
  data: z.union([ PasswordResetTokenUpdateInputSchema,PasswordResetTokenUncheckedUpdateInputSchema ]),
  where: PasswordResetTokenWhereUniqueInputSchema,
}).strict() ;

export const PasswordResetTokenUpdateManyArgsSchema: z.ZodType<Prisma.PasswordResetTokenUpdateManyArgs> = z.object({
  data: z.union([ PasswordResetTokenUpdateManyMutationInputSchema,PasswordResetTokenUncheckedUpdateManyInputSchema ]),
  where: PasswordResetTokenWhereInputSchema.optional(),
}).strict() ;

export const PasswordResetTokenDeleteManyArgsSchema: z.ZodType<Prisma.PasswordResetTokenDeleteManyArgs> = z.object({
  where: PasswordResetTokenWhereInputSchema.optional(),
}).strict() ;

export const ActivationTokenCreateArgsSchema: z.ZodType<Prisma.ActivationTokenCreateArgs> = z.object({
  select: ActivationTokenSelectSchema.optional(),
  include: ActivationTokenIncludeSchema.optional(),
  data: z.union([ ActivationTokenCreateInputSchema,ActivationTokenUncheckedCreateInputSchema ]),
}).strict() ;

export const ActivationTokenUpsertArgsSchema: z.ZodType<Prisma.ActivationTokenUpsertArgs> = z.object({
  select: ActivationTokenSelectSchema.optional(),
  include: ActivationTokenIncludeSchema.optional(),
  where: ActivationTokenWhereUniqueInputSchema,
  create: z.union([ ActivationTokenCreateInputSchema,ActivationTokenUncheckedCreateInputSchema ]),
  update: z.union([ ActivationTokenUpdateInputSchema,ActivationTokenUncheckedUpdateInputSchema ]),
}).strict() ;

export const ActivationTokenCreateManyArgsSchema: z.ZodType<Prisma.ActivationTokenCreateManyArgs> = z.object({
  data: z.union([ ActivationTokenCreateManyInputSchema,ActivationTokenCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ActivationTokenDeleteArgsSchema: z.ZodType<Prisma.ActivationTokenDeleteArgs> = z.object({
  select: ActivationTokenSelectSchema.optional(),
  include: ActivationTokenIncludeSchema.optional(),
  where: ActivationTokenWhereUniqueInputSchema,
}).strict() ;

export const ActivationTokenUpdateArgsSchema: z.ZodType<Prisma.ActivationTokenUpdateArgs> = z.object({
  select: ActivationTokenSelectSchema.optional(),
  include: ActivationTokenIncludeSchema.optional(),
  data: z.union([ ActivationTokenUpdateInputSchema,ActivationTokenUncheckedUpdateInputSchema ]),
  where: ActivationTokenWhereUniqueInputSchema,
}).strict() ;

export const ActivationTokenUpdateManyArgsSchema: z.ZodType<Prisma.ActivationTokenUpdateManyArgs> = z.object({
  data: z.union([ ActivationTokenUpdateManyMutationInputSchema,ActivationTokenUncheckedUpdateManyInputSchema ]),
  where: ActivationTokenWhereInputSchema.optional(),
}).strict() ;

export const ActivationTokenDeleteManyArgsSchema: z.ZodType<Prisma.ActivationTokenDeleteManyArgs> = z.object({
  where: ActivationTokenWhereInputSchema.optional(),
}).strict() ;

export const ArticleCreateArgsSchema: z.ZodType<Prisma.ArticleCreateArgs> = z.object({
  select: ArticleSelectSchema.optional(),
  include: ArticleIncludeSchema.optional(),
  data: z.union([ ArticleCreateInputSchema,ArticleUncheckedCreateInputSchema ]),
}).strict() ;

export const ArticleUpsertArgsSchema: z.ZodType<Prisma.ArticleUpsertArgs> = z.object({
  select: ArticleSelectSchema.optional(),
  include: ArticleIncludeSchema.optional(),
  where: ArticleWhereUniqueInputSchema,
  create: z.union([ ArticleCreateInputSchema,ArticleUncheckedCreateInputSchema ]),
  update: z.union([ ArticleUpdateInputSchema,ArticleUncheckedUpdateInputSchema ]),
}).strict() ;

export const ArticleCreateManyArgsSchema: z.ZodType<Prisma.ArticleCreateManyArgs> = z.object({
  data: z.union([ ArticleCreateManyInputSchema,ArticleCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ArticleDeleteArgsSchema: z.ZodType<Prisma.ArticleDeleteArgs> = z.object({
  select: ArticleSelectSchema.optional(),
  include: ArticleIncludeSchema.optional(),
  where: ArticleWhereUniqueInputSchema,
}).strict() ;

export const ArticleUpdateArgsSchema: z.ZodType<Prisma.ArticleUpdateArgs> = z.object({
  select: ArticleSelectSchema.optional(),
  include: ArticleIncludeSchema.optional(),
  data: z.union([ ArticleUpdateInputSchema,ArticleUncheckedUpdateInputSchema ]),
  where: ArticleWhereUniqueInputSchema,
}).strict() ;

export const ArticleUpdateManyArgsSchema: z.ZodType<Prisma.ArticleUpdateManyArgs> = z.object({
  data: z.union([ ArticleUpdateManyMutationInputSchema,ArticleUncheckedUpdateManyInputSchema ]),
  where: ArticleWhereInputSchema.optional(),
}).strict() ;

export const ArticleDeleteManyArgsSchema: z.ZodType<Prisma.ArticleDeleteManyArgs> = z.object({
  where: ArticleWhereInputSchema.optional(),
}).strict() ;

export const SavedArticleCreateArgsSchema: z.ZodType<Prisma.SavedArticleCreateArgs> = z.object({
  select: SavedArticleSelectSchema.optional(),
  include: SavedArticleIncludeSchema.optional(),
  data: z.union([ SavedArticleCreateInputSchema,SavedArticleUncheckedCreateInputSchema ]),
}).strict() ;

export const SavedArticleUpsertArgsSchema: z.ZodType<Prisma.SavedArticleUpsertArgs> = z.object({
  select: SavedArticleSelectSchema.optional(),
  include: SavedArticleIncludeSchema.optional(),
  where: SavedArticleWhereUniqueInputSchema,
  create: z.union([ SavedArticleCreateInputSchema,SavedArticleUncheckedCreateInputSchema ]),
  update: z.union([ SavedArticleUpdateInputSchema,SavedArticleUncheckedUpdateInputSchema ]),
}).strict() ;

export const SavedArticleCreateManyArgsSchema: z.ZodType<Prisma.SavedArticleCreateManyArgs> = z.object({
  data: z.union([ SavedArticleCreateManyInputSchema,SavedArticleCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const SavedArticleDeleteArgsSchema: z.ZodType<Prisma.SavedArticleDeleteArgs> = z.object({
  select: SavedArticleSelectSchema.optional(),
  include: SavedArticleIncludeSchema.optional(),
  where: SavedArticleWhereUniqueInputSchema,
}).strict() ;

export const SavedArticleUpdateArgsSchema: z.ZodType<Prisma.SavedArticleUpdateArgs> = z.object({
  select: SavedArticleSelectSchema.optional(),
  include: SavedArticleIncludeSchema.optional(),
  data: z.union([ SavedArticleUpdateInputSchema,SavedArticleUncheckedUpdateInputSchema ]),
  where: SavedArticleWhereUniqueInputSchema,
}).strict() ;

export const SavedArticleUpdateManyArgsSchema: z.ZodType<Prisma.SavedArticleUpdateManyArgs> = z.object({
  data: z.union([ SavedArticleUpdateManyMutationInputSchema,SavedArticleUncheckedUpdateManyInputSchema ]),
  where: SavedArticleWhereInputSchema.optional(),
}).strict() ;

export const SavedArticleDeleteManyArgsSchema: z.ZodType<Prisma.SavedArticleDeleteManyArgs> = z.object({
  where: SavedArticleWhereInputSchema.optional(),
}).strict() ;

export const TagCreateArgsSchema: z.ZodType<Prisma.TagCreateArgs> = z.object({
  select: TagSelectSchema.optional(),
  include: TagIncludeSchema.optional(),
  data: z.union([ TagCreateInputSchema,TagUncheckedCreateInputSchema ]),
}).strict() ;

export const TagUpsertArgsSchema: z.ZodType<Prisma.TagUpsertArgs> = z.object({
  select: TagSelectSchema.optional(),
  include: TagIncludeSchema.optional(),
  where: TagWhereUniqueInputSchema,
  create: z.union([ TagCreateInputSchema,TagUncheckedCreateInputSchema ]),
  update: z.union([ TagUpdateInputSchema,TagUncheckedUpdateInputSchema ]),
}).strict() ;

export const TagCreateManyArgsSchema: z.ZodType<Prisma.TagCreateManyArgs> = z.object({
  data: z.union([ TagCreateManyInputSchema,TagCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const TagDeleteArgsSchema: z.ZodType<Prisma.TagDeleteArgs> = z.object({
  select: TagSelectSchema.optional(),
  include: TagIncludeSchema.optional(),
  where: TagWhereUniqueInputSchema,
}).strict() ;

export const TagUpdateArgsSchema: z.ZodType<Prisma.TagUpdateArgs> = z.object({
  select: TagSelectSchema.optional(),
  include: TagIncludeSchema.optional(),
  data: z.union([ TagUpdateInputSchema,TagUncheckedUpdateInputSchema ]),
  where: TagWhereUniqueInputSchema,
}).strict() ;

export const TagUpdateManyArgsSchema: z.ZodType<Prisma.TagUpdateManyArgs> = z.object({
  data: z.union([ TagUpdateManyMutationInputSchema,TagUncheckedUpdateManyInputSchema ]),
  where: TagWhereInputSchema.optional(),
}).strict() ;

export const TagDeleteManyArgsSchema: z.ZodType<Prisma.TagDeleteManyArgs> = z.object({
  where: TagWhereInputSchema.optional(),
}).strict() ;

export const CommentCreateArgsSchema: z.ZodType<Prisma.CommentCreateArgs> = z.object({
  select: CommentSelectSchema.optional(),
  include: CommentIncludeSchema.optional(),
  data: z.union([ CommentCreateInputSchema,CommentUncheckedCreateInputSchema ]),
}).strict() ;

export const CommentUpsertArgsSchema: z.ZodType<Prisma.CommentUpsertArgs> = z.object({
  select: CommentSelectSchema.optional(),
  include: CommentIncludeSchema.optional(),
  where: CommentWhereUniqueInputSchema,
  create: z.union([ CommentCreateInputSchema,CommentUncheckedCreateInputSchema ]),
  update: z.union([ CommentUpdateInputSchema,CommentUncheckedUpdateInputSchema ]),
}).strict() ;

export const CommentCreateManyArgsSchema: z.ZodType<Prisma.CommentCreateManyArgs> = z.object({
  data: z.union([ CommentCreateManyInputSchema,CommentCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const CommentDeleteArgsSchema: z.ZodType<Prisma.CommentDeleteArgs> = z.object({
  select: CommentSelectSchema.optional(),
  include: CommentIncludeSchema.optional(),
  where: CommentWhereUniqueInputSchema,
}).strict() ;

export const CommentUpdateArgsSchema: z.ZodType<Prisma.CommentUpdateArgs> = z.object({
  select: CommentSelectSchema.optional(),
  include: CommentIncludeSchema.optional(),
  data: z.union([ CommentUpdateInputSchema,CommentUncheckedUpdateInputSchema ]),
  where: CommentWhereUniqueInputSchema,
}).strict() ;

export const CommentUpdateManyArgsSchema: z.ZodType<Prisma.CommentUpdateManyArgs> = z.object({
  data: z.union([ CommentUpdateManyMutationInputSchema,CommentUncheckedUpdateManyInputSchema ]),
  where: CommentWhereInputSchema.optional(),
}).strict() ;

export const CommentDeleteManyArgsSchema: z.ZodType<Prisma.CommentDeleteManyArgs> = z.object({
  where: CommentWhereInputSchema.optional(),
}).strict() ;

export const ReactionCreateArgsSchema: z.ZodType<Prisma.ReactionCreateArgs> = z.object({
  select: ReactionSelectSchema.optional(),
  include: ReactionIncludeSchema.optional(),
  data: z.union([ ReactionCreateInputSchema,ReactionUncheckedCreateInputSchema ]),
}).strict() ;

export const ReactionUpsertArgsSchema: z.ZodType<Prisma.ReactionUpsertArgs> = z.object({
  select: ReactionSelectSchema.optional(),
  include: ReactionIncludeSchema.optional(),
  where: ReactionWhereUniqueInputSchema,
  create: z.union([ ReactionCreateInputSchema,ReactionUncheckedCreateInputSchema ]),
  update: z.union([ ReactionUpdateInputSchema,ReactionUncheckedUpdateInputSchema ]),
}).strict() ;

export const ReactionCreateManyArgsSchema: z.ZodType<Prisma.ReactionCreateManyArgs> = z.object({
  data: z.union([ ReactionCreateManyInputSchema,ReactionCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ReactionDeleteArgsSchema: z.ZodType<Prisma.ReactionDeleteArgs> = z.object({
  select: ReactionSelectSchema.optional(),
  include: ReactionIncludeSchema.optional(),
  where: ReactionWhereUniqueInputSchema,
}).strict() ;

export const ReactionUpdateArgsSchema: z.ZodType<Prisma.ReactionUpdateArgs> = z.object({
  select: ReactionSelectSchema.optional(),
  include: ReactionIncludeSchema.optional(),
  data: z.union([ ReactionUpdateInputSchema,ReactionUncheckedUpdateInputSchema ]),
  where: ReactionWhereUniqueInputSchema,
}).strict() ;

export const ReactionUpdateManyArgsSchema: z.ZodType<Prisma.ReactionUpdateManyArgs> = z.object({
  data: z.union([ ReactionUpdateManyMutationInputSchema,ReactionUncheckedUpdateManyInputSchema ]),
  where: ReactionWhereInputSchema.optional(),
}).strict() ;

export const ReactionDeleteManyArgsSchema: z.ZodType<Prisma.ReactionDeleteManyArgs> = z.object({
  where: ReactionWhereInputSchema.optional(),
}).strict() ;

export const ViewCreateArgsSchema: z.ZodType<Prisma.ViewCreateArgs> = z.object({
  select: ViewSelectSchema.optional(),
  include: ViewIncludeSchema.optional(),
  data: z.union([ ViewCreateInputSchema,ViewUncheckedCreateInputSchema ]),
}).strict() ;

export const ViewUpsertArgsSchema: z.ZodType<Prisma.ViewUpsertArgs> = z.object({
  select: ViewSelectSchema.optional(),
  include: ViewIncludeSchema.optional(),
  where: ViewWhereUniqueInputSchema,
  create: z.union([ ViewCreateInputSchema,ViewUncheckedCreateInputSchema ]),
  update: z.union([ ViewUpdateInputSchema,ViewUncheckedUpdateInputSchema ]),
}).strict() ;

export const ViewCreateManyArgsSchema: z.ZodType<Prisma.ViewCreateManyArgs> = z.object({
  data: z.union([ ViewCreateManyInputSchema,ViewCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ViewDeleteArgsSchema: z.ZodType<Prisma.ViewDeleteArgs> = z.object({
  select: ViewSelectSchema.optional(),
  include: ViewIncludeSchema.optional(),
  where: ViewWhereUniqueInputSchema,
}).strict() ;

export const ViewUpdateArgsSchema: z.ZodType<Prisma.ViewUpdateArgs> = z.object({
  select: ViewSelectSchema.optional(),
  include: ViewIncludeSchema.optional(),
  data: z.union([ ViewUpdateInputSchema,ViewUncheckedUpdateInputSchema ]),
  where: ViewWhereUniqueInputSchema,
}).strict() ;

export const ViewUpdateManyArgsSchema: z.ZodType<Prisma.ViewUpdateManyArgs> = z.object({
  data: z.union([ ViewUpdateManyMutationInputSchema,ViewUncheckedUpdateManyInputSchema ]),
  where: ViewWhereInputSchema.optional(),
}).strict() ;

export const ViewDeleteManyArgsSchema: z.ZodType<Prisma.ViewDeleteManyArgs> = z.object({
  where: ViewWhereInputSchema.optional(),
}).strict() ;

export const FollowCreateArgsSchema: z.ZodType<Prisma.FollowCreateArgs> = z.object({
  select: FollowSelectSchema.optional(),
  include: FollowIncludeSchema.optional(),
  data: z.union([ FollowCreateInputSchema,FollowUncheckedCreateInputSchema ]),
}).strict() ;

export const FollowUpsertArgsSchema: z.ZodType<Prisma.FollowUpsertArgs> = z.object({
  select: FollowSelectSchema.optional(),
  include: FollowIncludeSchema.optional(),
  where: FollowWhereUniqueInputSchema,
  create: z.union([ FollowCreateInputSchema,FollowUncheckedCreateInputSchema ]),
  update: z.union([ FollowUpdateInputSchema,FollowUncheckedUpdateInputSchema ]),
}).strict() ;

export const FollowCreateManyArgsSchema: z.ZodType<Prisma.FollowCreateManyArgs> = z.object({
  data: z.union([ FollowCreateManyInputSchema,FollowCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const FollowDeleteArgsSchema: z.ZodType<Prisma.FollowDeleteArgs> = z.object({
  select: FollowSelectSchema.optional(),
  include: FollowIncludeSchema.optional(),
  where: FollowWhereUniqueInputSchema,
}).strict() ;

export const FollowUpdateArgsSchema: z.ZodType<Prisma.FollowUpdateArgs> = z.object({
  select: FollowSelectSchema.optional(),
  include: FollowIncludeSchema.optional(),
  data: z.union([ FollowUpdateInputSchema,FollowUncheckedUpdateInputSchema ]),
  where: FollowWhereUniqueInputSchema,
}).strict() ;

export const FollowUpdateManyArgsSchema: z.ZodType<Prisma.FollowUpdateManyArgs> = z.object({
  data: z.union([ FollowUpdateManyMutationInputSchema,FollowUncheckedUpdateManyInputSchema ]),
  where: FollowWhereInputSchema.optional(),
}).strict() ;

export const FollowDeleteManyArgsSchema: z.ZodType<Prisma.FollowDeleteManyArgs> = z.object({
  where: FollowWhereInputSchema.optional(),
}).strict() ;