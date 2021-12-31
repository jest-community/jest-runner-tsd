const { posix, relative, sep } = require('path');
const { readFileSync } = require('graceful-fs');
const tsd = require('mlh-tsd');
const formatErrorMessage = require('./formatErrorMessage');
const { pass } = require('./pass');
const { fail } = require('./fail');

const TEST_TITLE = 'tsd typecheck';

/**
 * @param {string} input
 */
const normalizeSlashes = input => input.split(sep).join(posix.sep);

module.exports = async ({ config: { rootDir }, testPath }) => {
  const testFile = relative(rootDir, testPath);

  const start = Date.now();

  const { diagnostics, numTests } = await tsd.default({
    cwd: rootDir,
    testFiles: [normalizeSlashes(testFile)],
    typingsFile: '.', // silence `tsd` error: The type definition [file] does not exist.
  });

  const end = Date.now();

  const numFailed = diagnostics.length;
  const numPassed = numTests - numFailed;

  if (diagnostics.length > 0) {
    const testFileContents = readFileSync(testPath, 'utf8');
    const errorMessage = formatErrorMessage(diagnostics, testFileContents);

    return fail({
      start,
      end,
      test: { path: testFile, title: TEST_TITLE },
      numFailed,
      numPassed,
      errorMessage,
    });
  }

  return pass({
    start,
    end,
    numPassed,
    test: { path: testFile, title: TEST_TITLE },
  });
};
