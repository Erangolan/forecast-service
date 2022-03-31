module.exports = {
  root: true,
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    quotes: ['error', 'single'],
    indent: ['error', 2],
    'no-multi-spaces': ['error'],
    'no-trailing-spaces': ['error', { skipBlankLines: false }],
    'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0 }],
    'no-extra-semi': ['error'],
    semi: ['error', 'never'],
    'no-console': 'off',
    'linebreak-style': 0,
    'no-restricted-syntax': [
      'error',
      {
        selector: 'CallExpression[callee.object.name=\'console\'][callee.property.name!=/^(log|warn|error|info|trace)$/]',
        message: 'Unexpected property on console object was called',
      },
    ],
  },
}
