const { toMultipleTestResults } = require('./toMultipleTestResults');

module.exports.pass = ({ start, end, test, numPassed }) => {
  return toMultipleTestResults({
    stats: {
      failures: 0,
      pending: 0,
      passes: numPassed,
      todo: 0,
      start,
      end,
    },
    tests: [{ duration: end - start, ...test }],
    jestTestPath: test.path,
  });
};
