const { dirname, join, posix, relative, sep } = require('path');
const { readFileSync } = require('graceful-fs');
const { parse } = require('jest-docblock');
const tsd = require('mlh-tsd');
const { pass } = require('./pass');
const { fail } = require('./fail');

/**
 * @param {string} rootDir
 * @param {string} testFile
 */
function resolveTypingsFile(rootDir, testFile) {
  const fileContents = readFileSync(join(rootDir, testFile), 'utf8');
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
  const testFile = relative(rootDir, testPath);
  const typingsFile = resolveTypingsFile(rootDir, testFile);

  const start = Date.now();

  const { diagnostics, numTests } = await tsd.default({
    cwd: rootDir,
    testFiles: [normalizeSlashes(testFile)],
    typingsFile,
  });

  const end = Date.now();

  const numFailed = diagnostics.length;
  const numPassed = numTests - numFailed;

  if (numFailed > 0) {
    let errorMessage = [];

    diagnostics.forEach(test => {
      errorMessage.push(
        `${normalizeSlashes(testFile)}:${test.line}:${test.column} - ${
          test.severity
        } - ${test.message}`
      );
    });

    return fail({
      start,
      end,
      test: {
        path: testFile,
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
      path: testFile,
    },
  });
};
