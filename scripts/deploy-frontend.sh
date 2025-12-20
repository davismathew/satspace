#!/bin/bash

# SatSpace Frontend Deployment Script
# Builds the React frontend and deploys to S3 + CloudFront

set -e

# Configuration
ENV=${1:-dev}
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="$SCRIPT_DIR/../publishing-portal/frontend"

echo "🚀 Building SatSpace Frontend for $ENV environment..."

# Navigate to frontend directory
cd "$FRONTEND_DIR"

# Build the frontend
echo "📦 Building production bundle..."
npm run build

# Get bucket name and distribution ID from CDK outputs
BUCKET_NAME=$(aws cloudformation describe-stacks \
  --stack-name "SatSpaceStack-$ENV" \
  --query "Stacks[0].Outputs[?OutputKey=='FrontendBucketName'].OutputValue" \
  --output text)

DISTRIBUTION_ID=$(aws cloudformation describe-stacks \
  --stack-name "SatSpaceStack-$ENV" \
  --query "Stacks[0].Outputs[?OutputKey=='CloudFrontDistributionId'].OutputValue" \
  --output text)

if [ -z "$BUCKET_NAME" ] || [ -z "$DISTRIBUTION_ID" ]; then
  echo "❌ Error: Could not retrieve bucket name or distribution ID from CloudFormation stack"
  echo "Make sure the infrastructure is deployed first: cd infrastructure && npm run deploy"
  exit 1
fi

echo "📤 Uploading to S3 bucket: $BUCKET_NAME..."
aws s3 sync dist/ "s3://$BUCKET_NAME/" --delete --cache-control "public,max-age=31536000,immutable"

# Update cache control for index.html (should not be cached)
aws s3 cp "s3://$BUCKET_NAME/index.html" "s3://$BUCKET_NAME/index.html" \
  --metadata-directive REPLACE \
  --cache-control "public,max-age=0,must-revalidate" \
  --content-type "text/html"

echo "🔄 Invalidating CloudFront cache..."
aws cloudfront create-invalidation \
  --distribution-id "$DISTRIBUTION_ID" \
  --paths "/*"

echo "✅ Deployment complete!"
echo ""
echo "🌐 Your site will be available at CloudFront URL (check CDK outputs)"
echo "⏱️  CloudFront invalidation may take a few minutes to complete"
