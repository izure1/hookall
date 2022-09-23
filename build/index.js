const esbuild = require('esbuild')

esbuild.buildSync({
  entryPoints: ['./src/index.js'],
  outfile: './dist/esm/index.js',
  bundle: true,
  format: 'esm',
  target: 'esnext',
})

esbuild.buildSync({
  entryPoints: ['./src/index.js'],
  outfile: './dist/cjm/index.js',
  bundle: true,
  format: 'cjs',
  target: 'esnext',
})
