import {inspect} from 'util';
import chalk from 'chalk';
import dateformat from 'dateformat';
import {isNumber, isString, isBuffer} from '../util';

function align(value, width, right, fill) {
    fill = fill === undefined ? ' ' : String(fill);
    let s = String(value);
    while (s.length < width) {
        s = right ? fill + s : s + fill;
    }
    s = right ? s.slice(-width) : s.slice(0, width);
    return s;
}

function formatStringLine(content, len, idx, error) {
    len = isNumber(len) ? len : process.stdout.columns - 8;

    let s = '';

    if (isNumber(idx)) {
        s += error ? chalk.red.bold(align(idx, 3, true, 0)) : chalk.cyan(align(idx, 3, true, 0));
        s += '  ';
    }
    if (!isNumber(error)) {
        s += chalk.grey(content.slice(0, len));
    } else {
        error -= 1;
        s += chalk.grey(content.slice(0, error));
        s += chalk.white.bgRed(content.slice(error, error + 1));
        s += chalk.grey(content.slice(error + 1, len));
    }
    if (content.length > len) {
        s += ' ';
        s += chalk.cyan('→');
    }
    s += '\n';

    return s;
}

function formatStringLines(content, len, from, to, errors) {
    const lines = content.split('\n');
    from = from || 1;
    to = to || lines.length;
    errors = errors || {};

    let s = '';
    for (let i = Math.max(0, from - 1), l = lines.length; i < to && i < l; i += 1) {
        s += formatStringLine(lines[i], len, i + 1, errors[i + 1]);
    }

    return s;
}

function formatBufferLine(buffer, idx) {
    let s = '';
    for (let i = 0, l = buffer.length; i < l; i += 1) {
        const val = buffer[i];
        s += (val < 16 ? '0' : '') + val.toString(16);

        if ((i + 1) % 2 === 0) {
            s += ' ';
        }
    }
    s = chalk.grey(s);

    if (isNumber(idx)) {
        s = chalk.cyan(align(idx.toString(16), 3, true, 0)) + '  ' + s;
    }

    s += '\n';

    return s;
}

function formatBufferLines(buffer, bpl, from, to) {
    from = from || 0;
    to = to || buffer.length;

    let s = '';
    for (let i = from, l = buffer.length; i < to && i < l; i += bpl) {
        s += formatBufferLine(buffer.slice(i, i + Math.min(bpl, l - i)), i);
    }

    return s;
}

function formatString(content, lines, len) {
    const byteCount = Buffer.byteLength(content, 'utf-8');

    if (!byteCount) {
        return chalk.cyan('———  [empty]');
    }

    const charCount = content.length;
    const lineCount = byteCount ? content.split('\n').length : 0;
    const s = lines ? formatStringLines(content, len, 1, lines) : '';
    return s + chalk.cyan((lineCount > lines ? '···' : '———') + '  ' + lineCount + ' lines  ' + charCount + ' chars  ' + byteCount + ' bytes');
}

function formatBuffer(buffer, lines, len) {
    const byteCount = buffer.length;

    if (!byteCount) {
        return chalk.cyan('———  [empty]');
    }

    len = isNumber(len) ? len : process.stdout.columns - 8;
    const bpl = parseInt(len / 5, 10) * 2;
    const s = lines ? formatBufferLines(buffer, bpl, 0, lines * bpl) : '';
    return s + chalk.cyan((byteCount > lines * bpl ? '···' : '———') + '  ' + byteCount + ' bytes');
}

function formatHeader(idx, type, source, time) {
    let s = '';
    if (isNumber(idx)) {
        s += chalk.yellow.bold('[' + idx + ']');
    } else {
        s += chalk.cyan('———');
    }
    if (type) {
        s += '  ' + chalk.cyan(type);
    }
    s += '  ' + chalk.white.bold(source);
    s += time ? '  ' + chalk.cyan(dateformat(time, 'yyyy-mm-dd HH:MM:ss')) : '';
    return s;
}

function formatFile(file, lines, len, idx, path, line, column) {
    lines = isNumber(lines) ? lines : 10;

    let type = chalk.red.bold('UNK');
    if (isString(file.content)) {
        type = chalk.green('STR');
    } else if (isBuffer(file.content)) {
        type = chalk.yellow('BUF');
    }

    let time = 0;
    if (file.time) {
        time = file.time;
    } else if (file.stats && file.stats.mtime) {
        time = file.stats.mtime.getTime();
    }

    let s = formatHeader(idx, type, file.source, time);
    if (line) {
        s += '\n';
        if (path && path !== file.source) {
            s += chalk.red.bold('>>>  ' + path + ':' + line + ':' + column + '\n');
        } else {
            const marks = {};
            marks[line] = column || true;
            s += formatStringLines(file.content, null, line - 3, line + 3, marks);
        }
    } else {
        s += lines > 0 ? '\n' : '  ';
        if (isString(file.content)) {
            s += formatString(file.content, lines, len);
        } else if (isBuffer(file.content)) {
            s += formatBuffer(file.content, lines, len);
        } else {
            s += chalk.red.bold('———  [unsupported content]');
        }
    }
    return s;
}

function formatFiles(files, lines, len) {
    return files.map((file, idx) => formatFile(file, lines, len, idx)).join(lines ? '\n\n' : '\n');
}

function isFilesArray(objs) {
    return Array.isArray(objs) && objs.every(obj => obj.source);
}

function formatValue(x) {
    return inspect(x, {showhidden: true, colors: true});
}

function prefix(x) {
    return chalk.grey('log ') + String(x).replace(/\n/g, '\n' + chalk.grey('... '));
}

function format(x, lines, len) {
    return '\n' + (isFilesArray(x) ? formatFiles(x, lines, len) : prefix(formatValue(x))) + '\n';
}

export default function log(lines = 10, len = null) {
    return obj => {
        console.log(format(obj, lines, len));
        return Promise.resolve(obj);
    };
}
