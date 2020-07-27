// @ts-check

const { toMultipleTestResults } = require('./toMultipleTestResults');

module.exports.fail = ({ start, end, failures, numPassed }) => {
  return toMultipleTestResults({
    stats: {
      failures: failures.length,
      pending: 0,
      passes: numPassed,
      todo: 0,
      start,
      end,
    },
    tests: failures,
    jestTestPath: failures[0].path,
    skipped: false,
  });
}
