import runJest from './runJest';

test('overrides "strict": true in tsconfig', async () => {
  expect(await runJest('override-tsconfig')).toMatchSnapshot();
});
