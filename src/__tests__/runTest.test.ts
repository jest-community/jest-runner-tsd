import {
  afterEach,
  beforeEach,
  describe,
  expect,
  jest,
  test,
} from '@jest/globals';
import type { RunTestOptions } from 'create-jest-runner';
import tsdLite, { type TsdResult } from 'tsd-lite';
import type ts from 'typescript';
import { formatTsdResults } from '../formatter';
import runTest from '../run';

jest.mock('tsd-lite');
jest.mock('../formatter', () => ({
  ...jest.requireActual<typeof import('../formatter')>('../formatter'),
  formatTsdResults: jest.fn(() => '<mocked failure message>'),
}));

beforeEach(() => {
  jest.spyOn(Date, 'now').mockReturnValueOnce(1000).mockReturnValueOnce(2800);
});

afterEach(() => {
  jest.clearAllMocks();
});

const runOptions = { config: { slowTestThreshold: 5 } } as RunTestOptions;
const slowRunOptions = { config: { slowTestThreshold: 1 } } as RunTestOptions;

const tsdResults: Array<TsdResult> = [
  {
    file: {} as ts.SourceFile,
    messageText:
      "Argument of type 'string' is not assignable to parameter of type 'number'.",
    start: 64,
  },
  {
    file: {} as ts.SourceFile,
    messageText:
      "Argument of type 'number' is not assignable to parameter of type 'string'.",
    start: 106,
  },
];

describe('runs test', () => {
  test('with all failing results', () => {
    jest
      .mocked(tsdLite)
      .mockReturnValueOnce({ assertionsCount: 2, tsdResults });

    const testResult = runTest({
      ...runOptions,
      testPath: '/path/to/some/failing.test.ts',
    });

    expect(tsdLite).toBeCalledTimes(1);
    expect(tsdLite).toBeCalledWith('/path/to/some/failing.test.ts');

    expect(formatTsdResults).toBeCalledTimes(1);
    expect(formatTsdResults).toBeCalledWith(tsdResults);

    expect(testResult).toMatchSnapshot();
  });

  test('with some failing results', () => {
    jest
      .mocked(tsdLite)
      .mockReturnValueOnce({ assertionsCount: 4, tsdResults });

    const testResult = runTest({
      ...runOptions,
      testPath: '/path/to/some/failing.test.ts',
    });

    expect(tsdLite).toBeCalledTimes(1);
    expect(tsdLite).toBeCalledWith('/path/to/some/failing.test.ts');

    expect(formatTsdResults).toBeCalledTimes(1);
    expect(formatTsdResults).toBeCalledWith(tsdResults);

    expect(testResult).toMatchSnapshot();
  });

  test('with slow results', () => {
    jest
      .mocked(tsdLite)
      .mockReturnValueOnce({ assertionsCount: 2, tsdResults: [] });

    const testResult = runTest({
      ...slowRunOptions,
      testPath: '/path/to/some/slow.test.ts',
    });

    expect(testResult).toMatchObject({
      perfStats: { slow: true },
    });
  });

  test('with all passing results', () => {
    jest
      .mocked(tsdLite)
      .mockReturnValueOnce({ assertionsCount: 2, tsdResults: [] });

    const testResult = runTest({
      ...runOptions,
      testPath: '/path/to/some/passing.test.ts',
    });

    expect(tsdLite).toBeCalledTimes(1);
    expect(tsdLite).toBeCalledWith('/path/to/some/passing.test.ts');

    expect(formatTsdResults).not.toBeCalled();

    expect(testResult).toMatchSnapshot();
  });

  test('with empty results', () => {
    jest
      .mocked(tsdLite)
      .mockReturnValueOnce({ assertionsCount: 0, tsdResults: [] });

    const testResult = runTest({
      ...runOptions,
      testPath: '/path/to/some/empty.test.ts',
    });

    expect(tsdLite).toBeCalledTimes(1);
    expect(tsdLite).toBeCalledWith('/path/to/some/empty.test.ts');

    expect(formatTsdResults).not.toBeCalled();

    expect(testResult).toMatchSnapshot();
  });
});
