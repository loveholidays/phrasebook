const { pathsToModuleNameMapper } = require('ts-jest');

const { compilerOptions } = require('./tsconfig.json');

module.exports = {
  preset: 'ts-jest',
  globals: {
    'ts-jest': {
      babelConfig: 'babel.config.js',
    },
  },
  testMatch: [
    '**/src/**/?(*.)+(spec).[jt]s?(x)',
  ],
  clearMocks: true,
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: [
    '<rootDir>/jest.setup.ts',
  ],
};
