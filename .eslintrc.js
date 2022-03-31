module.exports = {
  extends: ['@loveholidays/eslint-config-loveholidays/react'],
  env: {
    browser: true,
    node: true,
    es2021: true
  },
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
  },
  overrides: [
    {
      rules: {
        'import/no-default-export': 'off',
      },
      files: [
        'src/**/*.stories.tsx',
      ],
    },
  ],
};
