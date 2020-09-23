const umd = process.env.MODULE_FORMAT === 'umd';

module.exports = {
  plugins: [
    [
      '@babel/plugin-transform-runtime',
      {
        regenerator: false,
        useESModules: true,
        helpers: !umd,
        version: '^7.11.6',
      },
    ],
    [
      'polyfill-corejs3',
      {
        method: 'usage-pure',
        exclude: [/promise/],
        targets: { ie: 11 },
      },
    ],
  ],
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          ie: 11,
        },
        bugfixes: true,
        modules: false,
        loose: true,
      },
    ],
    [
      '@babel/preset-typescript',
      {
        allowDeclareFields: true,
        onlyRemoveTypeImports: true,
      },
    ],
  ],
};
