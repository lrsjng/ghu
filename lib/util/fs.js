const fs = require('fs');
const {dirname, resolve, relative} = require('path');
const {inspect} = require('util');
const globCb = require('glob');
const mkdirpCb = require('mkdirp');
const rimrafCb = require('rimraf');
const {isString, promisedCbCall} = require('./misc');

const EX = module.exports = {};
const DEFAULT_CHARSET = 'utf-8';

const bufferIsBinary = EX.bufferIsBinary = (buffer, charset = DEFAULT_CHARSET) => {
    for (const char of buffer.toString(charset, 0, 24)) {
        const code = char.charCodeAt(0);
        if (code <= 8 || code === 65533) {
            return true;
        }
    }
    return false;
};

const stat = EX.stat = path => promisedCbCall(fs.stat, [path]);
const mkdirp = EX.mkdirp = path => promisedCbCall(mkdirpCb, [path]);
const rimraf = EX.rimraf = path => promisedCbCall(rimrafCb, [path]);
EX.glob = (pattern, options) => promisedCbCall(globCb, [pattern, options]);

EX.readFile = (path, charset = DEFAULT_CHARSET) => {
    return promisedCbCall(fs.readFile, [path])
        .then(content => {
            if (charset && !bufferIsBinary(content, charset)) {
                content = content.toString(charset);
            }
            return content;
        })
        .catch(() => null);
};

EX.writeFile = (path, content, overwrite = false, charset = DEFAULT_CHARSET) => {
    return Promise.resolve()
        .then(() => {
            if (!isString(content) && !Buffer.isBuffer(content)) {
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
        .then(() => promisedCbCall(fs.writeFile, [path, content, charset]));
};

EX.deletePath = (...paths) => Promise.all(paths.map(rimraf));

EX.shortPath = path => {
    const absPath = resolve(path);
    const relPath = relative(process.cwd(), absPath);
    return relPath.length < absPath.length ? relPath : absPath;
};
