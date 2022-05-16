const { toTestResult } = require('./toTestResult');

/**
 * @typedef {object} Test
 * @property {string} path
 * @property {string} title
 */

/**
 * @typedef {object} Options
 * @property {number} start
 * @property {number} end
 * @property {Test} test
 * @property {number} numFailed
 * @property {number} numPassed
 * @property {string=} errorMessage
 */

/**
 * @param {Options} options
 */
module.exports.fail = ({
  start,
  end,
  test,
  errorMessage,
  numFailed,
  numPassed,
}) => {
  const stats = {
    failures: numFailed,
    passes: numPassed,
    pending: 0,
    todo: 0,
    end,
    start,
  };

  return toTestResult({
    stats,
    errorMessage,
    skipped: false,
    tests: [{ duration: end - start, ...test, errorMessage }],
    jestTestPath: test.path,
  });
};
