import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const UPLOAD_TTL = 5 * 60; // 5 min - enough for a single upload
const DOWNLOAD_TTL = 60 * 60; // 1 hour

let _client: null | S3Client = null;
let _publicClient: null | S3Client = null;

export async function createS3DownloadUrl(
  bucket: string,
  key: string
): Promise<string> {
  const command = new GetObjectCommand({ Bucket: bucket, Key: key });
  return getSignedUrl(getS3PublicClient(), command, {
    expiresIn: DOWNLOAD_TTL,
  });
}

export async function createS3UploadUrl(
  bucket: string,
  key: string,
  contentType: string
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: bucket,
    ContentType: contentType,
    Key: key,
  });
  return getSignedUrl(getS3PublicClient(), command, { expiresIn: UPLOAD_TTL });
}

export async function deleteS3Object(
  bucket: string,
  key: string
): Promise<void> {
  await getS3Client().send(
    new DeleteObjectCommand({ Bucket: bucket, Key: key })
  );
}

export function getS3PublicUrl(bucket: string, key: string): string {
  const { s3 } = useRuntimeConfig();
  return `${s3.publicHost}/${bucket}/${key}`;
}

// Internal client — used for server-side operations (delete, etc.)
function getS3Client(): S3Client {
  if (_client) return _client;
  const { s3 } = useRuntimeConfig();
  _client = new S3Client({
    credentials: {
      accessKeyId: s3.accessKey,
      secretAccessKey: s3.secretKey,
    },
    endpoint: s3.host,
    forcePathStyle: true,
    region: s3.region,
    requestChecksumCalculation: 'WHEN_REQUIRED',
  });
  return _client;
}

// Public client — used for presigned URLs handed to browsers
function getS3PublicClient(): S3Client {
  if (_publicClient) return _publicClient;
  const { s3 } = useRuntimeConfig();
  _publicClient = new S3Client({
    credentials: {
      accessKeyId: s3.accessKey,
      secretAccessKey: s3.secretKey,
    },
    endpoint: s3.publicHost,
    forcePathStyle: true,
    region: s3.region,
    requestChecksumCalculation: 'WHEN_REQUIRED',
  });
  return _publicClient;
}
