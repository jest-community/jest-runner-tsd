const { dirname, join, posix, relative, sep } = require('path');
const { readFileSync } = require('graceful-fs');
const { parse } = require('jest-docblock');
const tsd = require('mlh-tsd');
const formatErrorMessage = require('./formatErrorMessage');
const { pass } = require('./pass');
const { fail } = require('./fail');

const TEST_TITLE = 'tsd typecheck';

/**
 * @param {string} testFile
 * @param {string} fileContents
 */
function resolveTypingsFile(testFile, fileContents) {
  let { type } = parse(fileContents);

  if (Array.isArray(type)) {
    type = type[0];
  }

  if (type !== undefined) {
    return join(dirname(testFile), type);
  }

  return undefined;
}

/**
 * @param {string} input
 */
const normalizeSlashes = input => input.split(sep).join(posix.sep);

module.exports = async ({ config: { rootDir }, testPath }) => {
  const testFileContents = readFileSync(testPath, 'utf8');

  const testFile = relative(rootDir, testPath);
  const typingsFile = resolveTypingsFile(testFile, testFileContents);

  const start = Date.now();

  const { diagnostics, numTests } = await tsd.default({
    cwd: rootDir,
    testFiles: [normalizeSlashes(testFile)],
    typingsFile,
  });

  const end = Date.now();

  const numFailed = diagnostics.length;
  const numPassed = numTests - numFailed;

  if (diagnostics.length > 0) {
    const errorMessage = formatErrorMessage(
      diagnostics,
      normalizeSlashes(testFile),
      testFileContents
    );

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
