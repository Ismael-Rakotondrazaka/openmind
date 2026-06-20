#!/bin/sh
set -e

: "${NUXT_S3_HOST:?Missing NUXT_S3_HOST}"
: "${NUXT_S3_REGION:?Missing NUXT_S3_REGION}"
: "${NUXT_S3_ACCESS_KEY:?Missing NUXT_S3_ACCESS_KEY}"
: "${NUXT_S3_SECRET_KEY:?Missing NUXT_S3_SECRET_KEY}"

create_bucket() {
  BUCKET=$1
  echo "Creating bucket: $BUCKET"
  CODE=$(curl -s -o /dev/null -w "%{http_code}" \
    -X PUT "$NUXT_S3_HOST/$BUCKET" \
    --aws-sigv4 "aws:amz:$NUXT_S3_REGION:s3" \
    --user "$NUXT_S3_ACCESS_KEY:$NUXT_S3_SECRET_KEY" \
    -H "Content-Length: 0")
  case $CODE in
    200) echo "Created: $BUCKET" ;;
    409) echo "Already exists, skipping: $BUCKET" ;;
    *)   echo "ERROR: Failed to create $BUCKET (HTTP $CODE)"; exit 1 ;;
  esac
}

apply_public_policy() {
  BUCKET=$1
  POLICY="{\"Version\":\"2012-10-17\",\"Statement\":[{\"Sid\":\"PublicReadGetObject\",\"Effect\":\"Allow\",\"Principal\":\"*\",\"Action\":\"s3:GetObject\",\"Resource\":\"arn:aws:s3:::$BUCKET/*\"}]}"
  echo "Applying public-read policy: $BUCKET"
  CODE=$(curl -s -o /dev/null -w "%{http_code}" \
    -X PUT "$NUXT_S3_HOST/$BUCKET?policy" \
    --aws-sigv4 "aws:amz:$NUXT_S3_REGION:s3" \
    --user "$NUXT_S3_ACCESS_KEY:$NUXT_S3_SECRET_KEY" \
    -H "Content-Type: application/json" \
    -d "$POLICY")
  case $CODE in
    200|204) echo "Policy applied: $BUCKET" ;;
    *)       echo "ERROR: Failed to apply policy on $BUCKET (HTTP $CODE)"; exit 1 ;;
  esac
}

for BUCKET in openmind-users-avatars openmind-post-covers openmind-post-files; do
  create_bucket "$BUCKET"
  apply_public_policy "$BUCKET"
done

echo "All buckets are ready."
