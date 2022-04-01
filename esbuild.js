const esbuild = require('esbuild');
const glob = require('glob');

const entryPoints = glob.sync('./src/**/index.ts');

console.log('Entrypoints:', entryPoints);

esbuild
  .build({
    entryPoints,
    outdir: 'lib',
    bundle: true,
    sourcemap: true,
    minify: false,
    splitting: true,
    format: 'esm',
    target: ['es2019'],
    jsx: 'preserve',
    external: [
      'react',
      'react-dom',
    ],
  })
  .catch(() => process.exit(1));
