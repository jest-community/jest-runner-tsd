// @ts-check

const tsd = require('mlh-tsd');
const { join } = require('path');
const { pass } = require('./pass');
const { fail } = require('./fail');
const { readFileSync } = require('fs');
const { parse } = require('jest-docblock');

/**
 * @param {string} testPath
 */
const findTypingsFile = testPath => {
  const fileContents = readFileSync(testPath).toString();
  const parsedDocblocks = parse(fileContents);
  const typingsFile = parsedDocblocks.type || '';

  if (typingsFile === 'undefined')
    return '';

  return String(typingsFile);
}

module.exports = async ({ testPath }) => {
  // Convert absolute path to relative path
  const testFile = testPath.replace(process.cwd() + '/', '');
  const start = +new Date();
  const typingsFileRelativePath = findTypingsFile(testPath);

  // Remove filename from the path and join it with typingsFile relative path
  const typingsFile = join(testFile.substring(0, testFile.lastIndexOf('/')), typingsFileRelativePath);

  const extendedDiagnostics = await tsd.default({
    cwd: process.cwd(),
    testFiles: [testFile],
    typingsFile,
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
