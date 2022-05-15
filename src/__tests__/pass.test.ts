import { expect, test } from '@jest/globals';
import { pass } from '../pass';

test('pass', () => {
  const testResult = pass({
    start: 0,
    end: 1200,
    test: {
      path: '/path/to/e2e/__fixtures__/js-passing/index.test.ts',
      title: 'tsd typecheck',
    },
    numPassed: 5,
  });

  expect(testResult).toMatchSnapshot();
});
