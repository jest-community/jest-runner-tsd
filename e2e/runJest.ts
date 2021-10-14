import path from 'path';
import execa from 'execa';

const rootDir = path.join(__dirname, '..');

const normalize = (output: string) =>
  output
    .replace(/\(?\d*\.?\d+ ?m?s\b\)?/g, '')
    .replace(/, estimated/g, '')
    .replace(new RegExp(rootDir, 'g'), '/mocked-path-to-jest-runner-mocha')
    .replace(new RegExp('.*at .*\\n', 'g'), 'mocked-stack-trace')
    .replace(/.*at .*\\n/g, 'mocked-stack-trace')
    .replace(/(mocked-stack-trace)+/, '      at mocked-stack-trace')
    .replace(/\s+\n/g, '\n');

const runJest = async (project: string, options = []) => {
  const { stdout, stderr } = await execa(
    'jest',
    [
      '--useStderr',
      '--no-watchman',
      '--no-cache',
      '--projects',
      path.join(__dirname, '__fixtures__', project),
    ].concat(options),
    {
      env: { FORCE_COLOR: '0' },
      reject: false,
    }
  );
  return `${normalize(stderr)}\n${normalize(stdout)}`;
};

export default runJest;
