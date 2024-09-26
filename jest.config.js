module.exports = {
  // collectCoverageFrom: ['src/**/*.ts', '!src/**/index.ts', '!src/**/*.interface.ts'],
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./test/setupTests.ts'],
  transform: {
    '^.+.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.spec.json' }],
  },
  // globals: {
  //   'ts-jest': {
  //     tsconfig: 'tsconfig.spec5.json',
  //   },
  // },
};
