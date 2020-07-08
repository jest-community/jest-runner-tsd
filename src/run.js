// @ts-check

const tsd = require("tsd");
const { pass } = require("create-jest-runner");
const { fail } = require("./fail");

module.exports = async ({ testPath }) => {
  // Convert absolute path to relative path
  const testFile = testPath.replace(process.cwd(), "");
  const start = +new Date();
  const diagnose = await tsd.default({
    cwd: process.cwd(),
    testFiles: [testFile],
  });

  if (diagnose.length > 0) {
    const failures = diagnose.map((test) => ({
      path: test.fileName,
      errorMessage: test.message,
      title: "In " + testFile + ": " + test.message,
    }));
    return fail({
      start,
      end: +new Date(),
      failures: failures,
    });
  }

  // @TODO Include the number of successful tests
  return pass({
    start,
    end: +new Date(),
    test: {
      path: testPath,
    },
  });
};
