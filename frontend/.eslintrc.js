module.exports = {
  env: {
    browser: true,
    es6: true,
  },

  extends: ['airbnb', 'prettier'],

  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },

  parser: '@babel/eslint-parser',

  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },

    ecmaVersion: 2018,
    sourceType: 'module',
    requireConfigFile: false,
  },

  plugins: ['react', 'prettier'],

  rules: {
    'prettier/prettier': 'error',
    'react/jsx-filename-extension': ['error', { extensions: ['.js', '.jsx'] }],
    'import/prefer-default-export': 'off',
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'react/jsx-one-expression-per-line': 'off',
    'global-require': 'off',
    'react-native/no-raw-text': 'off',
    'no-param-reassign': 'off',
    'no-underscore-dangle': 'off',
    camelcase: 'off',
    'no-console': ['error', { allow: ['tron'] }],
  },
};
