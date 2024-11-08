const {inspect} = require('util');
const chalk = require('chalk').default;
const dateformat = require('dateformat').default;
const {is_number, is_string} = require('../util');

const align = (value, width, right, fill) => {
    fill = fill === undefined ? ' ' : String(fill);
    let s = String(value);
    while (s.length < width) {
        s = right ? fill + s : s + fill;
    }
    s = right ? s.slice(-width) : s.slice(0, width);
    return s;
};

const format_string_line = (content, len, idx, error) => {
    len = is_number(len) ? len : process.stdout.columns - 8;

    let s = '';

    if (is_number(idx)) {
        s += error ? chalk.red.bold(align(idx, 3, true, 0)) : chalk.cyan(align(idx, 3, true, 0));
        s += '  ';
    }
    if (!is_number(error)) {
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
};

const format_string_lines = (content, len, from, to, errors) => {
    const lines = content.split('\n');
    from = from || 1;
    to = to || lines.length;
    errors = errors || {};

    let s = '';
    for (let i = Math.max(0, from - 1), l = lines.length; i < to && i < l; i += 1) {
        s += format_string_line(lines[i], len, i + 1, errors[i + 1]);
    }

    return s;
};

const format_buffer_line = (buffer, idx) => {
    let s = '';
    for (let i = 0, l = buffer.length; i < l; i += 1) {
        const val = buffer[i];
        s += (val < 16 ? '0' : '') + val.toString(16);

        if ((i + 1) % 2 === 0) {
            s += ' ';
        }
    }
    s = chalk.grey(s);

    if (is_number(idx)) {
        s = chalk.cyan(align(idx.toString(16), 3, true, 0)) + '  ' + s;
    }

    s += '\n';

    return s;
};

const format_buffer_lines = (buffer, bpl, from, to) => {
    from = from || 0;
    to = to || buffer.length;

    let s = '';
    for (let i = from, l = buffer.length; i < to && i < l; i += bpl) {
        s += format_buffer_line(buffer.slice(i, i + Math.min(bpl, l - i)), i);
    }

    return s;
};

const format_string = (content, lines, len) => {
    const byte_len = Buffer.byteLength(content, 'utf-8');

    if (!byte_len) {
        return chalk.cyan('———  [empty]');
    }

    const char_count = content.length;
    const line_count = byte_len ? content.split('\n').length : 0;
    const s = lines ? format_string_lines(content, len, 1, lines) : '';
    return s + chalk.cyan((line_count > lines ? '···' : '———') + '  ' + line_count + ' lines  ' + char_count + ' chars  ' + byte_len + ' bytes');
};

const format_buffer = (buffer, lines, len) => {
    const byte_len = buffer.length;

    if (!byte_len) {
        return chalk.cyan('———  [empty]');
    }

    len = is_number(len) ? len : process.stdout.columns - 8;
    const bpl = parseInt(len / 5, 10) * 2;
    const s = lines ? format_buffer_lines(buffer, bpl, 0, lines * bpl) : '';
    return s + chalk.cyan((byte_len > lines * bpl ? '···' : '———') + '  ' + byte_len + ' bytes');
};

const format_header = (idx, type, source, time) => {
    let s = '';
    if (is_number(idx)) {
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
};

const format_file = ({file, lines, len, idx, path, line, column}) => {
    lines = is_number(lines) ? lines : 10;

    let type = chalk.red.bold('UNK');
    if (is_string(file.content)) {
        type = chalk.green('STR');
    } else if (Buffer.isBuffer(file.content)) {
        type = chalk.yellow('BUF');
    }

    let time = 0;
    if (file.time) {
        time = file.time;
    } else if (file.stats && file.stats.mtime) {
        time = file.stats.mtime.getTime();
    }

    let s = format_header(idx, type, file.source, time);
    if (line) {
        s += '\n';
        if (path && path !== file.source) {
            s += chalk.red.bold('>>>  ' + path + ':' + line + ':' + column + '\n');
        } else {
            const marks = {};
            marks[line] = column || true;
            s += format_string_lines(file.content, null, line - 3, line + 3, marks);
        }
    } else {
        s += lines > 0 ? '\n' : '  ';
        if (is_string(file.content)) {
            s += format_string(file.content, lines, len);
        } else if (Buffer.isBuffer(file.content)) {
            s += format_buffer(file.content, lines, len);
        } else {
            s += chalk.red.bold('———  [unsupported content]');
        }
    }
    return s;
};

const format_files = (files, lines, len) => {
    return files.map((file, idx) => format_file({file, lines, len, idx})).join(lines ? '\n\n' : '\n');
};

const is_files_array = objs => {
    return Array.isArray(objs) && objs.every(obj => obj.source);
};

const format_value = x => {
    return inspect(x, {showhidden: true, colors: true});
};

const prefix = x => {
    return chalk.grey('log ') + String(x).replace(/\n/g, '\n' + chalk.grey('... '));
};

const format = (x, lines, len) => {
    return '\n' + (is_files_array(x) ? format_files(x, lines, len) : prefix(format_value(x))) + '\n';
};

module.exports = (lines = 10, len = null) => {
    return obj => {
        console.log(format(obj, lines, len));
        return Promise.resolve(obj);
    };
};
