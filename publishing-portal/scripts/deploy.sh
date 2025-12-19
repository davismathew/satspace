#!/bin/bash

# Deployment script for Satspace Publishing Portal
# This script builds and deploys the infrastructure, backend, and frontend

set -e  # Exit on error

echo "🚀 Starting Satspace Publishing Portal Deployment"
echo "=================================================="

# Check if AWS CLI is configured
if ! aws sts get-caller-identity > /dev/null 2>&1; then
  echo "❌ Error: AWS CLI is not configured. Please run 'aws configure' first."
  exit 1
fi

# Build backend
echo ""
echo "📦 Building backend Lambda functions..."
cd backend
npm run build
cd ..

# Build frontend
echo ""
echo "🎨 Building frontend..."
cd frontend
npm run build
cd ..

# Deploy CDK infrastructure
echo ""
echo "☁️  Deploying AWS infrastructure with CDK..."
cd infrastructure
npm run build
npm run synth
echo "Review the changes above and confirm deployment"
npm run deploy
cd ..

# Get CloudFront distribution ID and API endpoint from CDK outputs
echo ""
echo "📊 Retrieving deployment outputs..."
API_URL=$(aws cloudformation describe-stacks --stack-name SatspacePublishingStack --query "Stacks[0].Outputs[?OutputKey=='ApiUrl'].OutputValue" --output text)
CONTENT_BUCKET=$(aws cloudformation describe-stacks --stack-name SatspacePublishingStack --query "Stacks[0].Outputs[?OutputKey=='ContentBucketName'].OutputValue" --output text)
FRONTEND_BUCKET=$(aws cloudformation describe-stacks --stack-name SatspacePublishingStack --query "Stacks[0].Outputs[?OutputKey=='FrontendBucketName'].OutputValue" --output text)
CF_DIST_ID=$(aws cloudformation describe-stacks --stack-name SatspacePublishingStack --query "Stacks[0].Outputs[?OutputKey=='CloudFrontDistributionId'].OutputValue" --output text)
CF_DOMAIN=$(aws cloudformation describe-stacks --stack-name SatspacePublishingStack --query "Stacks[0].Outputs[?OutputKey=='CloudFrontDomainName'].OutputValue" --output text)

echo "✅ API Endpoint: $API_URL"
echo "✅ Content Bucket: $CONTENT_BUCKET"
echo "✅ Frontend Bucket: $FRONTEND_BUCKET"
echo "✅ CloudFront Distribution: $CF_DIST_ID"
echo "✅ CloudFront Domain: $CF_DOMAIN"

# Upload sample content to S3
echo ""
echo "📝 Uploading sample content to S3..."
aws s3 sync content/ s3://$CONTENT_BUCKET/ --delete

# Upload frontend to S3
echo ""
echo "🌐 Uploading frontend to S3..."
aws s3 sync frontend/dist/ s3://$FRONTEND_BUCKET/ --delete

# Invalidate CloudFront cache
echo ""
echo "🔄 Invalidating CloudFront cache..."
aws cloudfront create-invalidation --distribution-id $CF_DIST_ID --paths "/*"

echo ""
echo "=================================================="
echo "✅ Deployment Complete!"
echo "=================================================="
echo ""
echo "🌍 Your site is available at: https://$CF_DOMAIN"
echo "🔌 API Endpoint: $API_URL"
echo ""
echo "⚠️  Note: CloudFront distribution may take 10-15 minutes to fully propagate."
echo ""
echo "Next steps:"
echo "1. Update frontend/.env with VITE_API_URL=$API_URL"
echo "2. Rebuild and redeploy frontend if needed"
echo "3. Configure custom domain in Route 53 (optional)"
