const commonjs = require('@rollup/plugin-commonjs');
const dynamicImportVars = require('@rollup/plugin-dynamic-import-vars');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const typescript = require('@rollup/plugin-typescript');
const dts = require('rollup-plugin-dts');
const scss = require('rollup-plugin-scss');
const svg = require('rollup-plugin-svg');
const json = require('@rollup/plugin-json');
const image = require('@rollup/plugin-image');
const svgr = require('@svgr/rollup');
const nodePolyfills = require('rollup-plugin-polyfill-node');
const styles = require('rollup-plugin-styles'); // Import rollup-plugin-styles

const pkg = require('./package.json');

// const onwarn = (warning, warn) => {
//     if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
//         return;
//     }
//     warn(warning);
// };

module.exports = [
    {
        cache: false,
        input: './index.ts',
        output: [
            {
                file: pkg.main,
                format: 'cjs',
                inlineDynamicImports: true,
                sourcemap: true,
            },
            {
                file: pkg.umd,
                format: 'umd',
                inlineDynamicImports: true,
                name: 'core',
                sourcemap: true,
            },
            {
                file: pkg.module,
                format: 'esm',
                inlineDynamicImports: true,
                sourcemap: true,
            },
        ],
        plugins: [
            nodeResolve(),
            scss(),
            svg(),
            svgr(),
            json(),
            image(),
            nodePolyfills(),
            commonjs(),
            typescript({
                tsconfig: './tsconfig.lib.json',
                declaration: true,
                declarationDir: 'dist',
            }),
            dynamicImportVars(),
            styles({ // Include rollup-plugin-styles
                mode: 'inject'
            }),
        ],
        // onwarn,
    },
    {
        cache: false,
        input: 'dist/esm/index.d.ts',
        output: [{ file: 'dist/index.d.ts', format: 'esm' }],
        plugins: [dts.default()],
        external: [/\.(sass|scss|css)$/] 
    },
];
