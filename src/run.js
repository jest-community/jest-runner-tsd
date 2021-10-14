// @ts-check

const { dirname, join, relative } = require('path');
const { readFileSync } = require('graceful-fs');
const { parse } = require('jest-docblock');
const tsd = require('mlh-tsd');
const { pass } = require('./pass');
const { fail } = require('./fail');

/**
 * @param {string} testPath
 */
const resolveTypingsFile = testPath => {
  const fileContents = readFileSync(testPath, 'utf8');
  let { type } = parse(fileContents);

  if (Array.isArray(type)) {
    type = type[0];
  }

  return join(dirname(testPath), type || '.');
};

module.exports = async ({ testPath }) => {
  const testFile = relative(process.cwd(), testPath);
  const typingsFile = relative(process.cwd(), resolveTypingsFile(testPath));

  const start = Date.now();

  const extendedDiagnostics = await tsd.default({
    cwd: process.cwd(),
    testFiles: [testFile],
    typingsFile,
  });

  const end = Date.now();

  const numTests = extendedDiagnostics.numTests;
  const numFailed = extendedDiagnostics.diagnostics.length;
  const numPassed = numTests - numFailed;

  const failedTests = extendedDiagnostics.diagnostics;

  if (numFailed > 0) {
    let errorMessage = [];

    failedTests.forEach(test => {
      errorMessage.push(
        `${testFile}:${test.line}:${test.column} - ${test.severity} - ${test.message}`
      );
    });

    return fail({
      start,
      end,
      test: {
        path: testPath,
      },
      numFailed,
      numPassed,
      errorMessage,
    });
  }

  return pass({
    start,
    end,
    numPassed,
    test: {
      path: testPath,
    },
  });
};
