#!/bin/bash

# SatSpace - Install All Dependencies
# This script installs dependencies for all components of the project

set -e

echo "🔧 Installing SatSpace Dependencies..."
echo ""

# Infrastructure
echo "📦 Installing infrastructure dependencies..."
cd infrastructure
npm install
cd ..
echo "✅ Infrastructure dependencies installed"
echo ""

# Lambda Functions
echo "⚡ Installing Lambda function dependencies..."

cd lambda/get-posts
npm install
cd ../..
echo "  ✅ get-posts"

cd lambda/get-post-by-slug
npm install
cd ../..
echo "  ✅ get-post-by-slug"

cd lambda/ingest-webhook
npm install
cd ../..
echo "  ✅ ingest-webhook"

cd lambda/process-article
npm install
cd ../..
echo "  ✅ process-article"

echo ""
echo "🎨 Frontend dependencies should already be installed"
echo "   If not, run: cd publishing-portal/frontend && npm install"
echo ""
echo "✅ All dependencies installed successfully!"
echo ""
echo "📋 Next steps:"
echo "   1. Deploy infrastructure: cd infrastructure && cdk deploy --context env=dev"
echo "   2. Follow the DEPLOYMENT.md guide for complete setup"
