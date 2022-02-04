const tsdLite = require('tsd-lite');
const { formatTsdResults } = require('./formatter');
const { fail } = require('./fail');
const { pass } = require('./pass');

const TEST_TITLE = 'tsd typecheck';

module.exports = ({ testPath }) => {
  const start = Date.now();

  const { assertionsCount, tsdResults } = tsdLite.default(testPath);

  const end = Date.now();

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
