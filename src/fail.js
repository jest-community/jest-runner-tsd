const { toTestResult } = require('./toTestResult');

module.exports.fail = ({ start, end, test, errorMessage, numFailed, numPassed }) => {
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
    title: 'Type Checks',
    errorMessage: errorMessage.join('\n'),
    tests: [{duration: end - start, ...test}],
    jestTestPath: test.path,
  });
};
