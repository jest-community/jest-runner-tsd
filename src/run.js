const tsdLite = require('tsd-lite');
const formatErrorMessage = require('./formatErrorMessage');
const { pass } = require('./pass');
const { fail } = require('./fail');

const TEST_TITLE = 'tsd typecheck';

module.exports = async ({ testPath }) => {
  const start = Date.now();

  const { assertionCount, diagnostics } = tsdLite.default(testPath);

  const end = Date.now();

  const numFailed = diagnostics.length;
  const numPassed = assertionCount - numFailed;

  if (diagnostics.length > 0) {
    const errorMessage = formatErrorMessage(diagnostics);

    return fail({
      start,
      end,
      test: { path: testPath, title: TEST_TITLE },
      numFailed,
      numPassed,
      errorMessage,
    });
  }

  return pass({
    start,
    end,
    numPassed,
    test: { path: testPath, title: TEST_TITLE },
  });
};
