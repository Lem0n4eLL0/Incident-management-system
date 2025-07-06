module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'react-app',
    'plugin:postcss-modules/recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],

  plugins: ['react', '@typescript-eslint', 'prettier'],

  rules: {
    'prettier/prettier': 'warn',
    'postcss-modules/no-undef-class': 'error',
    'postcss-modules/no-unused-class': 'warn',
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
  },

  settings: {
    'postcss-modules': {
      include: '**/*.module.(css|scss)',
      exclude: '**/node_modules/**/*',
    },
  },
};
