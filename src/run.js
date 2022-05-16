const tsdLite = require('tsd-lite');
const { formatTsdResults } = require('./formatter');

/** @typedef {import('@jest/test-result').TestCaseResult} TestCaseResult */

const TEST_TITLE = 'tsd typecheck';

/**
 * @param {'failed' | 'passed'} status
 * @param {number} duration
 * @param {string=} errorMessage
 * @returns {TestCaseResult}
 */
function toJestResult(status, duration, errorMessage) {
  return {
    ancestorTitles: [],
    failureDetails: [],
    failureMessages: errorMessage ? [errorMessage] : [],
    fullName: TEST_TITLE,
    numPassingAsserts: status === 'passed' ? 1 : 0,
    status,
    title: TEST_TITLE,
    duration,
  };
}

/** @type {import('create-jest-runner').RunTest} */
module.exports = ({ testPath, config }) => {
  const start = Date.now();

  const { assertionsCount, tsdResults } = tsdLite.default(testPath);

  const end = Date.now();

  const runtime = end - start;
  const slow = runtime / 1000 > config.slowTestThreshold;

  const numFailingTests = tsdResults.length;
  const numPassingTests = assertionsCount - numFailingTests;

  /** @type {string | null} */
  let failureMessage = null;

  /** @type {TestCaseResult | undefined} */
  let testResult = undefined;

  if (numFailingTests) {
    failureMessage = formatTsdResults(tsdResults);
    testResult = toJestResult('failed', runtime, failureMessage);
  } else if (numPassingTests) {
    testResult = toJestResult('passed', runtime);
  }

  return {
    failureMessage,
    leaks: false,
    numFailingTests,
    numPassingTests,
    numPendingTests: 0,
    numTodoTests: 0,
    openHandles: [],
    perfStats: {
      end,
      runtime,
      slow,
      start,
    },
    skipped: false,
    snapshot: {
      added: 0,
      fileDeleted: false,
      matched: 0,
      unchecked: 0,
      uncheckedKeys: [],
      unmatched: 0,
      updated: 0,
    },
    testFilePath: testPath,
    testResults: testResult ? [testResult] : [],
  };
};
