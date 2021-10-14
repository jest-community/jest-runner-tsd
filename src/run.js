// @ts-check

const { dirname, join, relative } = require('path');
const { readFileSync } = require('graceful-fs');
const { parse } = require('jest-docblock');
const tsd = require('mlh-tsd');
const { pass } = require('./pass');
const { fail } = require('./fail');

/**
 * @param {string} testPath
 * */
const findTypingsFile = testPath => {
  const fileContents = readFileSync(testPath, 'utf8');
  const parsedDocblocks = parse(fileContents);

  if (Array.isArray(parsedDocblocks.type)) {
    return parsedDocblocks.type[0];
  }

  return parsedDocblocks.type || '';
};

module.exports = async ({ testPath }) => {
  const testFile = relative(process.cwd(), testPath);
  const typingsFile = join(dirname(testFile), findTypingsFile(testPath));

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
