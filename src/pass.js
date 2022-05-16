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
 * @property {number} numPassed
 */

/**
 * @param {Options} options
 */
module.exports.pass = ({ start, end, test, numPassed }) => {
  return toTestResult({
    stats: {
      failures: 0,
      passes: numPassed,
      pending: 0,
      todo: 0,
      start,
      end,
    },
    skipped: false,
    tests: [{ duration: end - start, ...test }],
    jestTestPath: test.path,
  });
};
