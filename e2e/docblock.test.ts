import {expect, test} from '@jest/globals';
import runJest from './runJest';

test('reads `@type` comment in docblock', async () => {
  expect(await runJest('docblock')).toMatchSnapshot();
});
