const jsConfig = {
  parserOptions: {
    ecmaVersion: 2018,
  },
  env: {
    es2017: true,
    browser: false,
    node: true,
  },
  extends: [
    'plugin:react-hooks/recommended',

    // Disable eslint-plugin-react and rules that can conflict with prettier.
    'prettier/react',
  ],
  rules: {
    quotes: [
      'error',
      'single',
      {
        avoidEscape: true,
        allowTemplateLiterals: false,
      },
    ],
    'lines-around-comment': [
      'error',
      {
        beforeBlockComment: true,
        beforeLineComment: true,
        allowBlockStart: true,
        allowBlockEnd: true,
        allowObjectStart: true,
        allowObjectEnd: true,
        allowArrayStart: true,
        allowArrayEnd: true,
        allowClassStart: true,
        allowClassEnd: true,
      },
    ],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};

const tsConfig = {
  ...jsConfig,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: ['./tsconfig.json'],
  },
  env: {
    es2020: true,
    browser: true,
    node: true,
  },
  plugins: ['@typescript-eslint'],
  extends: [
    ...jsConfig.extends,
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',

    // Disable rules that can conflict with prettier.
    'prettier/@typescript-eslint',
  ],
  rules: {
    ...jsConfig.rules,
    '@typescript-eslint/ban-ts-comment': [
      2,
      {
        'ts-expect-error': false,
      },
    ],
    '@typescript-eslint/no-explicit-any': 'off',
    'react/prop-types': [0],
  },
};

module.exports = {
  root: true,
  ignorePatterns: ['node_modules/**/*', 'dist/**/*', '**/*.d.ts'],
  extends: [
    'eslint:recommended',
    'prettier', // disable general eslint rules that can conflict with prettier
  ],
  overrides: [
    {
      ...jsConfig,
      files: ['**/*.@(js|mjs|jsx)'],
      excludedFiles: ['rollup.config.js'],
    },
    {
      ...jsConfig,
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 2018,
      },
      files: ['rollup.config.js'],
    },
    {
      ...tsConfig,
      files: ['lib/**/*.@(ts|tsx)'],
    },
  ],
};
