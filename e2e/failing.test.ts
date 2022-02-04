import { expect, test } from '@jest/globals';
import runJest from './runJest';

test('works with failing JS test', async () => {
  expect(await runJest('js-failing')).toMatchSnapshot();
});

test('works with failing TS test', async () => {
  expect(await runJest('ts-failing')).toMatchSnapshot();
});
