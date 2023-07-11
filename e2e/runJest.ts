import path from 'path';
import execa from 'execa';

const rootDir = path.join(__dirname, '..');

const normalize = (output: string) =>
  output
    .replace(/\(?\d*\.?\d+ ?m?s\b\)?/g, '')
    .replace(/, estimated/g, '')
    .replace(new RegExp(rootDir, 'g'), '/mocked-path-to-jest-runner-tsd')
    .replace(/.*at .*\\n/g, 'mocked-stack-trace')
    .replace(/(mocked-stack-trace)+/, '      at mocked-stack-trace')
    .replace(new RegExp('\u00D7', 'g'), '\u2715')
    .replace(new RegExp('\u221A', 'g'), '\u2713')
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
    },
  );
  return `${normalize(stderr)}\n${normalize(stdout)}`;
};

export default runJest;
