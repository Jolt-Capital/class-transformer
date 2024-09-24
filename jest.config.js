module.exports = {
  // preset: 'ts-jest',
  // testEnvironment: 'node',
  // collectCoverageFrom: ['src/**/*.ts', '!src/**/index.ts', '!src/**/*.interface.ts'],
  testEnvironment: 'node',
  transform: {
    '^.+.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.spec5.json' }],
  },
  // globals: {
  //   'ts-jest': {
  //     tsconfig: 'tsconfig.spec5.json',
  //   },
  // },
};
