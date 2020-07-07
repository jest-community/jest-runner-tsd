const { pass, fail } = require('create-jest-runner');
const tsd  = require('tsd')

module.exports = async ({ testPath }) => {
  const start = Date.now();
  const diagnose = await tsd({
    testFiles: [testPath]
  });
  const end = Date.now();

  if (diagnose.length > 0) {
    return fail({start, end, test: {path: diagnose[0].fileName, errorMessage: diagnose[0].message, title: diagnose[0].severity }});
  }

  return pass({start, end, test: {path: testPath}});
};
