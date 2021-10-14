import { expect, test } from '@jest/globals';
import runJest from './runJest';

test('reads `types` property in package.json', async () => {
  expect(await runJest('pkg-types')).toMatchSnapshot();
});
