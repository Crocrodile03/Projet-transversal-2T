/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  
  preset: 'ts-jest',
  testEnvironment: 'node',
  
  roots: ['<rootDir>/tests'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/**/*.d.ts",
    "!src/index.ts", 
  ],
};