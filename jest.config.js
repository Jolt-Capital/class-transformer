module.exports = {
  collectCoverageFrom: ['src/**/*.ts', '!src/**/index.ts', '!src/**/*.interface.ts'],
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./test/setupTest.ts'],
  transform: {
    '^.+.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.spec.json' }],
  },
};
