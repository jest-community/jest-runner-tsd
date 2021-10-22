import { expect, test } from '@jest/globals';
import runJest from './runJest';

test('runs a test file with no assertions', async () => {
  expect(await runJest('no-assertions')).toMatchSnapshot();
});
