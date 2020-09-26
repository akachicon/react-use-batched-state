import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';

const isProd = process.env.NODE_ENV === 'production';

const baseConfig = {
  input: './lib/index.ts',
  external: [/@babel\/runtime/, /core-js-pure\//, 'react', 'react-dom'],
  plugins: [
    resolve(),
    commonjs(),
    babel({
      exclude: /\/node_modules\//,
      extensions: ['.ts'],
      babelHelpers: 'runtime',
    }),
    isProd && terser(),
  ],
};

const esConfig = {
  ...baseConfig,
  output: {
    format: 'es',
    file: './dist/index.es.js',
    interop: 'auto',
    indent: false,
    sourcemap: !isProd && 'inline',
  },
};

const cjsConfig = {
  ...baseConfig,
  output: {
    format: 'cjs',
    file: './dist/index.cjs.js',
    interop: 'auto',
    exports: 'auto',
    indent: false,
    sourcemap: !isProd && 'inline',
  },
};

const umdConfig = {
  ...baseConfig,

  // No helpers/polyfills in external since they are bundled.
  external: ['react', 'react-dom'],
  plugins: [
    resolve(),
    commonjs(),
    babel({
      exclude: /\/node_modules\//,
      extensions: ['.ts'],
      babelHelpers: 'bundled',
    }),
    isProd && terser(),
  ],
  output: {
    format: 'umd',
    file: isProd ? './dist/index.umd.min.js' : './dist/index.umd.js',
    name: 'React.useBatchedState',
    globals: {
      react: 'React',
      'react-dom': 'ReactDOM',
    },
    interop: 'auto',
    indent: false,
    sourcemap: !isProd && 'inline',
  },
};

const expectedConfig =
  process.env.MODULE_FORMAT === 'es'
    ? esConfig
    : process.env.MODULE_FORMAT === 'cjs'
    ? cjsConfig
    : umdConfig;

export default expectedConfig;
