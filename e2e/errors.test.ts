import runJest from './runJest';

test('throws if syntax error is encountered', async () => {
  expect(await runJest('errors-syntax')).toMatchSnapshot();
});

test('throws if nearest tsconfig.json is not valid', async () => {
  expect(await runJest('errors-tsconfig')).toMatchSnapshot();
});
