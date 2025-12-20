#!/usr/bin/env node
const cdk = require('aws-cdk-lib');
const { SatSpaceStack } = require('./satspace-stack');

const app = new cdk.App();

const env = app.node.tryGetContext('env') || 'dev';

new SatSpaceStack(app, `SatSpaceStack-${env}`, {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION || 'us-east-1',
    },
    stackEnv: env,
    tags: {
        Project: 'SatSpace',
        Environment: env,
        ManagedBy: 'CDK',
    },
});

app.synth();
