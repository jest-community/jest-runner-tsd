import { expect, test } from '@jest/globals';
import runJest from './runJest';

test('works with passing JS test', async () => {
  expect(await runJest('js-passing')).toMatchSnapshot();
});

test('works with passing TS test', async () => {
  expect(await runJest('ts-passing')).toMatchSnapshot();
});
