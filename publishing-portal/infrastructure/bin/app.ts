#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { PublishingStack } from '../lib/publishing-stack';

const app = new cdk.App();

new PublishingStack(app, 'SatspacePublishingStack', {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: 'us-east-1',
    },
    description: 'Satspace.in Publishing Portal - Serverless News Platform',
    tags: {
        Project: 'SatspacePublishing',
        Environment: 'prod',
        ManagedBy: 'CDK',
    },
});
