module.exports = {
  reporters: ['default', 'github-actions'],
  testMatch: ['<rootDir>/**/__tests__/*.test.ts', '<rootDir>/e2e/*.test.ts'],
  testTimeout: 30000,
};
