module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/assets/scripts', '<rootDir>/tests'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/assets/scripts/$1',
    '^@core/(.*)$': '<rootDir>/assets/scripts/core/$1',
    '^@battle/(.*)$': '<rootDir>/assets/scripts/battle/$1',
    '^@data/(.*)$': '<rootDir>/assets/scripts/data/$1',
  },
  collectCoverageFrom: [
    'assets/scripts/**/*.ts',
    '!assets/scripts/**/*.d.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
};
