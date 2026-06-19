#!/usr/bin/env tsx
/**
 * Creates the S3 buckets required by openmind on a SeaweedFS (or any
 * S3-compatible) backend and applies a public-read policy to public buckets.
 *
 * Reads credentials from .env via @dotenvx/dotenvx.
 *
 * Required env vars:
 *   NUXT_S3_HOST         e.g. http://localhost:8333
 *   NUXT_S3_REGION       e.g. us-east-1
 *   NUXT_S3_ACCESS_KEY
 *   NUXT_S3_SECRET_KEY
 *
 * Usage:
 *   tsx scripts/create-s3-buckets/cli.ts
 */

import '@dotenvx/dotenvx/config';
import {
  CreateBucketCommand,
  PutBucketPolicyCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { defineCommand, runMain } from 'citty';
import { createConsola } from 'consola';

const logger = createConsola({ defaults: { tag: 'create-s3-buckets' } });

const BUCKETS: { name: string; public: boolean }[] = [
  { name: 'openmind-users-avatars', public: true },
  { name: 'openmind-post-covers', public: true },
  { name: 'openmind-post-files', public: true },
];

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    logger.fatal(`Missing required environment variable: ${name}`);
    process.exit(1);
  }
  return value;
}

function buildClient(): S3Client {
  return new S3Client({
    credentials: {
      accessKeyId: requiredEnv('NUXT_S3_ACCESS_KEY'),
      secretAccessKey: requiredEnv('NUXT_S3_SECRET_KEY'),
    },
    endpoint: requiredEnv('NUXT_S3_HOST'),
    forcePathStyle: true,
    region: requiredEnv('NUXT_S3_REGION'),
  });
}

function publicReadPolicy(bucket: string): string {
  return JSON.stringify({
    Statement: [
      {
        Action: 's3:GetObject',
        Effect: 'Allow',
        Principal: '*',
        Resource: `arn:aws:s3:::${bucket}/*`,
        Sid: 'PublicReadGetObject',
      },
    ],
    Version: '2012-10-17',
  });
}

async function createBuckets(): Promise<void> {
  const client = buildClient();

  for (const bucket of BUCKETS) {
    logger.start(`Creating bucket: ${bucket.name}`);

    try {
      await client.send(new CreateBucketCommand({ Bucket: bucket.name }));
      logger.success(`Created: ${bucket.name}`);
    } catch (err) {
      const code =
        (err as { Code?: string; name?: string }).Code ??
        (err as { name?: string }).name;

      if (
        code === 'BucketAlreadyOwnedByYou' ||
        code === 'BucketAlreadyExists'
      ) {
        logger.warn(`Already exists, skipping: ${bucket.name}`);
      } else {
        logger.error(`Failed to create ${bucket.name}:`, err);
        process.exit(1);
      }
    }

    if (bucket.public) {
      logger.start(`Applying public-read policy: ${bucket.name}`);
      try {
        await client.send(
          new PutBucketPolicyCommand({
            Bucket: bucket.name,
            Policy: publicReadPolicy(bucket.name),
          })
        );
        logger.success(`Public-read policy applied: ${bucket.name}`);
      } catch (err) {
        logger.error(`Failed to apply policy on ${bucket.name}:`, err);
        process.exit(1);
      }
    }
  }

  logger.success('All buckets are ready.');
}

runMain(
  defineCommand({
    meta: {
      description:
        'Create openmind S3 buckets and apply public-read policies where needed',
      name: 'create-s3-buckets',
    },
    async run() {
      await createBuckets();
    },
  })
);
