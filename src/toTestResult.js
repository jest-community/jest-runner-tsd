/** @typedef {import('@jest/test-result').TestResult} TestResult */

/**
 * @typedef {object} Stats
 * @property {number} failures
 * @property {number} passes
 * @property {number} pending
 * @property {number} todo
 * @property {number} start
 * @property {number} end
 */

/**
 * @typedef {object} Test
 * @property {number} duration
 * @property {string} path
 * @property {string=} errorMessage
 * @property {string=} title
 */

/**
 * @typedef {object} Options
 * @property {Stats} stats
 * @property {boolean} skipped
 * @property {string=} errorMessage
 * @property {Array<Test>} tests
 * @property {string} jestTestPath
 */

/**
 * @param {Options} options
 * @returns {TestResult}
 */
module.exports.toTestResult = ({
  stats,
  skipped,
  errorMessage,
  tests,
  jestTestPath,
}) => {
  return {
    failureMessage: errorMessage || null,
    leaks: false,
    numFailingTests: stats.failures,
    numPassingTests: stats.passes,
    numPendingTests: stats.pending,
    numTodoTests: stats.todo,
    openHandles: [],
    perfStats: {
      end: stats.end,
      start: stats.start,
      runtime: stats.end - stats.start,
      slow: false,
    },
    skipped,
    snapshot: {
      added: 0,
      fileDeleted: false,
      matched: 0,
      unchecked: 0,
      uncheckedKeys: [],
      unmatched: 0,
      updated: 0,
    },
    testFilePath: jestTestPath,
    testResults: tests.map(test => {
      return {
        ancestorTitles: [],
        duration: test.duration,
        failureDetails: [],
        failureMessages: test.errorMessage ? [test.errorMessage] : [],
        fullName: test.path,
        numPassingAsserts: test.errorMessage ? 1 : 0,
        status: test.errorMessage ? 'failed' : 'passed',
        title: test.title || '',
      };
    }),
  };
};
