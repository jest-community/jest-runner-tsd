import { expect, test } from '@jest/globals';
import runJest from './runJest';

test('works with failing test', async () => {
  expect(await runJest('failing')).toMatchSnapshot();
});
