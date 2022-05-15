import { expect, test } from '@jest/globals';
import { fail } from '../fail';

const errorMessage = `  ● tsd typecheck

  Argument of type 'number' is not assignable to parameter of type 'string'.

  > 5 | expectType<string>(concat(1, 2));
      | ^

    at e2e/__fixtures__/js-failing/index.test.ts:5:1`;

test('fails', () => {
  const testResult = fail({
    start: 0,
    end: 1200,
    test: {
      path: '/path/to/e2e/__fixtures__/js-failing/index.test.ts',
      title: 'tsd typecheck',
    },
    errorMessage,
    numFailed: 1,
    numPassed: 3,
  });

  expect(testResult).toMatchSnapshot();
});
