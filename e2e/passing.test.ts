import {expect, test} from '@jest/globals';
import runJest from './runJest';

test('works with passing test', async () => {
  expect(await runJest('passing')).toMatchSnapshot();
});
