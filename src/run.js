// @ts-check

const tsd = require('tsd');
const { pass } = require('create-jest-runner');
const { fail } = require('./fail');

module.exports = async ({ testPath }) => {
  // Convert absolute path to relative path
  const testFile = testPath.replace(process.cwd(), '');
  const start = +new Date();
  const extendedDiagnostics = await tsd.default({
    cwd: process.cwd(),
    testFiles: [testFile],
  });

  const numTests = extendedDiagnostics.numTests;
  const numFailedTests = extendedDiagnostics.diagnostics.length;
  const numPassedTests = numTests - numFailedTests;

  const failedTests = extendedDiagnostics.diagnostics;

  if (numFailedTests > 0) {
    const failures = failedTests.map((test) => ({
      path: test.fileName,
      errorMessage: test.message,
      title: `${testFile}:${test.line}:${test.column} - ${test.severity} - ${test.message}`
    }));

    return fail({
      start,
      end: +new Date(),
      failures
    });
  }

  // @TODO Include the number of successful tests
  return pass({
    start,
    end: +new Date(),
    test: {
      path: testPath,
    },
  });
};
