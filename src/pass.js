const { toTestResult } = require('./toTestResult');

module.exports.pass = ({ start, end, test, numPassed }) => {
  return toTestResult({
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
