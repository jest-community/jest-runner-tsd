const { basename } = require('path');
const { codeFrameColumns } = require('@babel/code-frame');
const chalk = require('chalk');

const BULLET = '\u25cf ';

const TITLE_INDENT = '  ';
const MESSAGE_INDENT = '    ';
const CODE_INDENT = '    ';
const LOCATION_INDENT = '      ';

const NOT_EMPTY_LINE_REGEXP = /^(?!$)/gm;

/**
 * @param {string} lines
 * @param {string} indent
 */
const indentAllLines = (lines, indent) =>
  lines.replace(NOT_EMPTY_LINE_REGEXP, indent);

module.exports = diagnostics => {
  const title = chalk.bold.red(TITLE_INDENT + BULLET + 'tsd typecheck') + '\n';

  const messages = [];

  diagnostics.forEach(error => {
    const { column, fileName, fileText, line, message } = error;

    const codeFrame = codeFrameColumns(
      fileText,
      { start: { column, line } },
      { highlightCode: true, linesAbove: 0, linesBelow: 0 }
    );

    const location =
      chalk.dim('at ') +
      chalk.cyan(basename(fileName)) +
      chalk.dim(':' + line + ':' + column);

    messages.push(
      indentAllLines(message, MESSAGE_INDENT) +
        '\n\n' +
        indentAllLines(codeFrame, CODE_INDENT) +
        '\n\n' +
        indentAllLines(location, LOCATION_INDENT) +
        '\n'
    );
  });

  return title + '\n' + messages.join('\n\n');
};
