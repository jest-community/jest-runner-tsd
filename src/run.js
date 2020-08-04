// @ts-check

const tsd = require('tsd');
const { pass } = require('./pass');
const { fail } = require('./fail');
const { readFileSync } = require('fs');
const { parse } = require('jest-docblock');

/**
 * @param {string} testPath 
 * @returns {string}
 */
const findTypingsFile = testPath => {
  const fileContents = readFileSync(testPath).toString();
  const parsedDocblocks = parse(fileContents);
  const typingsFile = String(parsedDocblocks.type);

  return typingsFile;
}

module.exports = async ({ testPath }) => {
  // Convert absolute path to relative path
  const testFile = testPath.replace(process.cwd(), '');
  const start = +new Date();
  const typingsFile = findTypingsFile(testPath);
  const extendedDiagnostics = await tsd.default({
    cwd: process.cwd(),
    testFiles: [testFile],
  });

  const numTests = extendedDiagnostics.numTests;
  const numFailed = extendedDiagnostics.diagnostics.length;
  const numPassed = numTests - numFailed;

  const failedTests = extendedDiagnostics.diagnostics;

  if (numFailed > 0) {
    const failures = failedTests.map((test) => ({
      path: test.fileName,
      errorMessage: test.message,
      title: `${testFile}:${test.line}:${test.column} - ${test.severity} - ${test.message}`
    }));

    return fail({
      start,
      end: +new Date(),
      failures,
      numPassed
    });
  }

  return pass({
    start,
    end: +new Date(),
    numPassed,
    test: {
      path: testPath,
    },
  });
};
