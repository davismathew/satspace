#!/bin/bash

echo "🌐 SatSpace Deployment Information"
echo "=================================="
echo ""

# Get all outputs
echo "📋 All Resources:"
aws cloudformation describe-stacks \
  --stack-name SatSpaceStack-dev \
  --query 'Stacks[0].Outputs[*].[OutputKey,OutputValue]' \
  --output table

echo ""
echo "🌐 YOUR LIVE WEBSITE:"
CLOUDFRONT_URL=$(aws cloudformation describe-stacks \
  --stack-name SatSpaceStack-dev \
  --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontURL`].OutputValue' \
  --output text)
echo "$CLOUDFRONT_URL"

echo ""
echo "🔌 API ENDPOINT:"
API_URL=$(aws cloudformation describe-stacks \
  --stack-name SatSpaceStack-dev \
  --query 'Stacks[0].Outputs[?OutputKey==`ApiUrl`].OutputValue' \
  --output text)
echo "$API_URL"

echo ""
echo "✅ Deployment complete! Visit your website using the CloudFront URL above."
