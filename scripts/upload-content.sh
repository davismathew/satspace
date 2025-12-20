#!/bin/bash

# SatSpace Content Upload Script
# Uploads sample content to S3 content bucket

set -e

# Configuration
ENV=${1:-dev}
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONTENT_DIR="$SCRIPT_DIR/../content-samples"

echo "📝 Uploading SatSpace content to $ENV environment..."

# Get bucket name from CDK outputs
BUCKET_NAME=$(aws cloudformation describe-stacks \
  --stack-name "SatSpaceStack-$ENV" \
  --query "Stacks[0].Outputs[?OutputKey=='ContentBucketName'].OutputValue" \
  --output text)

if [ -z "$BUCKET_NAME" ]; then
  echo "❌ Error: Could not retrieve content bucket name from CloudFormation stack"
  echo "Make sure the infrastructure is deployed first: cd infrastructure && npm run deploy"
  exit 1
fi

echo "📤 Uploading content to S3 bucket: $BUCKET_NAME..."

# Upload posts-index.json
echo "  - Uploading posts-index.json..."
aws s3 cp "$CONTENT_DIR/posts-index.json" "s3://$BUCKET_NAME/posts-index.json" \
  --content-type "application/json"

# Upload each post directory
for post_dir in "$CONTENT_DIR"/*/ ; do
  if [ -d "$post_dir" ]; then
    post_slug=$(basename "$post_dir")
    echo "  - Uploading post: $post_slug..."
    
    # Upload meta.json
    if [ -f "$post_dir/meta.json" ]; then
      aws s3 cp "$post_dir/meta.json" "s3://$BUCKET_NAME/posts/$post_slug/meta.json" \
        --content-type "application/json"
    fi
    
    # Upload article.md
    if [ -f "$post_dir/article.md" ]; then
      aws s3 cp "$post_dir/article.md" "s3://$BUCKET_NAME/posts/$post_slug/article.md" \
        --content-type "text/markdown"
    fi
    
    # Upload hero image if exists
    if [ -f "$post_dir/hero.jpg" ]; then
      aws s3 cp "$post_dir/hero.jpg" "s3://$BUCKET_NAME/posts/$post_slug/hero.jpg" \
        --content-type "image/jpeg"
    fi
  fi
done

echo "✅ Content upload complete!"
echo ""
echo "📊 Summary:"
aws s3 ls "s3://$BUCKET_NAME/" --recursive --human-readable --summarize | tail -n 2
