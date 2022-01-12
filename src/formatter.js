const { posix, relative, sep } = require('path');
const { codeFrameColumns } = require('@babel/code-frame');
const chalk = require('chalk');

const NOT_EMPTY_LINE_REGEXP = /^(?!$)/gm;
const INDENT = '  ';

/**
 * @param {string} lines
 * @param {number} level
 */
const indentEachLine = (lines, level) =>
  lines.replace(NOT_EMPTY_LINE_REGEXP, INDENT.repeat(level));

const BULLET = '\u25cf ';

/**
 * @param {string} title
 */
const makeTitle = title => indentEachLine(BULLET + title + '\n', 1);

/**
 * @param {string} input
 */
const normalizeSlashes = input => input.split(sep).join(posix.sep);

function getCodeFrameAndLocation(file, start) {
  const { line, character } = file.getLineAndCharacterOfPosition(start);

  const codeFrame = codeFrameColumns(
    file.text,
    { start: { line: line + 1, column: character + 1 } },
    { highlightCode: true, linesAbove: 0, linesBelow: 0 }
  );

  const location =
    chalk.dim('at ') +
    chalk.cyan(normalizeSlashes(relative('', file.fileName))) +
    chalk.dim(':' + (line + 1) + ':' + (character + 1));

  return { codeFrame, location };
}

module.exports.formatTsdErrors = tsdErrors => {
  const messages = tsdErrors.map(error => {
    if (error.file) {
      const { codeFrame, location } = getCodeFrameAndLocation(
        error.file,
        error.start
      );

      return [error.message, codeFrame, location].join('\n\n');
    }

    return error.message;
  });

  return messages.join('\n\n');
};

module.exports.formatTsdResults = tsdResults => {
  const title = chalk.bold.red(makeTitle('tsd typecheck'));

  const messages = tsdResults.map(result => {
    const { codeFrame, location } = getCodeFrameAndLocation(
      result.file,
      result.start
    );

    return [
      indentEachLine(result.message, 2),
      indentEachLine(codeFrame, 2),
      indentEachLine(location, 3),
    ].join('\n\n');
  });

  return [title, messages.join('\n\n'), ''].join('\n');
};
