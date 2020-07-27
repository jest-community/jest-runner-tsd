// @ts-check

const { toMultipleTestResults } = require("./toMultipleTestResults");

module.exports.fail = ({ start, end, failures }) => {
  return toMultipleTestResults({
    stats: {
      failures: failures.length,
      pending: 0,
      passes: 0,
      todo: 0,
      start,
      end,
    },
    tests: failures,
    jestTestPath: failures[0].path,
    skipped: false,
  });
}
