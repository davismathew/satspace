const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');

// Ensure dist directory exists
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

// Build configuration
const buildConfig = {
    entryPoints: [
        'src/get-posts.ts',
        'src/get-post-by-slug.ts',
    ],
    bundle: true,
    platform: 'node',
    target: 'node20',
    outdir: 'dist',
    sourcemap: true,
    external: ['@aws-sdk/*'],
    format: 'cjs',
    minify: false,
};

esbuild.build(buildConfig).catch(() => process.exit(1));
