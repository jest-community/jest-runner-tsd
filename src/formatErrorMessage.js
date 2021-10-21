const { codeFrameColumns } = require('@babel/code-frame');
const chalk = require('chalk');

const TITLE_BULLET = '\u25cf ';
const TITLE_INDENT = '  ';
const CODE_INDENT = '    ';
const MESSAGE_INDENT = '      ';

const NOT_EMPTY_LINE_REGEXP = /^(?!$)/gm;

/**
 * @param {string} lines
 * @param {string} indent
 */
const indentAllLines = (lines, indent) =>
  lines.replace(NOT_EMPTY_LINE_REGEXP, indent);

module.exports = (diagnostics, testFile, fileContents) => {
  const title =
    chalk.bold.red(TITLE_INDENT + TITLE_BULLET + 'tsd typecheck') + '\n';

  const messages = [];

  diagnostics.forEach(error => {
    const { column, line, message, severity } = error;

    const codeFrame = codeFrameColumns(
      fileContents,
      { start: { column: column + 1, line } },
      { highlightCode: true, linesAbove: 0, linesBelow: 0 }
    );

    const fileLocationSeverityMessage =
      chalk.cyan(testFile) +
      chalk.dim(':' + line + ':' + (column + 1)) +
      ' - ' +
      chalk.red.bold(severity) +
      ' - ' +
      message +
      '\n';

    messages.push(
      indentAllLines(codeFrame, CODE_INDENT) +
        '\n' +
        indentAllLines(fileLocationSeverityMessage, MESSAGE_INDENT)
    );
  });

  return title + '\n' + messages.join('\n\n');
};
