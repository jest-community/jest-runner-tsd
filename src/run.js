const tsdLite = require('tsd-lite');
const { formatTsdErrors, formatTsdResults } = require('./formatter');
const { fail } = require('./fail');
const { pass } = require('./pass');

const TEST_TITLE = 'tsd typecheck';

module.exports = async ({ testPath }) => {
  const start = Date.now();

  const { assertionsCount, tsdErrors, tsdResults } = tsdLite.default(testPath);

  const end = Date.now();

  if (tsdErrors !== undefined) {
    const message = formatTsdErrors(tsdErrors);

    throw { message, stack: '' };
  }

  const numFailed = tsdResults.length;
  const numPassed = assertionsCount - numFailed;

  if (tsdResults.length > 0) {
    const errorMessage = formatTsdResults(tsdResults);

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
