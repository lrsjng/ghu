const fs = require('fs');
const {dirname, resolve, relative} = require('path');
const {inspect} = require('util');
const {glob} = require('glob');
const {mkdirp} = require('mkdirp');
const {rimraf} = require('rimraf');
const {is_string, promised_cb_call} = require('./misc');

const DEFAULT_CHARSET = 'utf-8';

const buffer_is_binary = (buffer, charset = DEFAULT_CHARSET) => {
    for (const char of buffer.toString(charset, 0, 24)) {
        const code = char.charCodeAt(0);
        if (code <= 8 || code === 65533) {
            return true;
        }
    }
    return false;
};

const stat = path => promised_cb_call(fs.stat, [path]);

const read_file = (path, charset = DEFAULT_CHARSET) => {
    return promised_cb_call(fs.readFile, [path])
        .then(content => {
            if (charset && !buffer_is_binary(content, charset)) {
                content = content.toString(charset);
            }
            return content;
        })
        .catch(() => null);
};

const write_file = (path, content, overwrite = false, charset = DEFAULT_CHARSET) => {
    return Promise.resolve()
        .then(() => {
            if (!is_string(content) && !Buffer.isBuffer(content)) {
                throw new Error(`content for '${path}' must be string or buffer but is ${inspect(content)}`);
            }

            if (!overwrite) {
                return stat(path).then(() => {
                    throw new Error(`target file already exists: '${path}'`);
                }, () => null);
            }
            return undefined;
        })
        .then(() => mkdirp(dirname(path)))
        .then(() => promised_cb_call(fs.writeFile, [path, content, charset]));
};

const delete_path = (...paths) => Promise.all(paths.map(p => rimraf(p)));

const short_path = path => {
    const absPath = resolve(path);
    const relPath = relative(process.cwd(), absPath);
    return relPath.length < absPath.length ? relPath : absPath;
};

module.exports = {
    buffer_is_binary,
    delete_path,
    glob,
    mkdirp,
    read_file,
    rimraf,
    short_path,
    stat,
    write_file
};
