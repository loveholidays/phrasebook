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
    minify: true,
    splitting: true,
    format: 'esm',
    target: ['es2019'],
    external: ['react', 'react-dom'],
  })
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });
