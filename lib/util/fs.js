import fs from 'fs';
import {dirname, resolve, relative} from 'path';
import {inspect} from 'util';
import {default as globCb} from 'glob';
import {default as mkdirpCb} from 'mkdirp';
import {default as rimrafCb} from 'rimraf';
import {isString, isBuffer, promisedCbCall} from './misc';

export const DEFAULT_CHARSET = 'utf-8';

export const bufferIsBinary = (buffer, charset = DEFAULT_CHARSET) => {
    for (const char of buffer.toString(charset, 0, 24)) {
        const code = char.charCodeAt(0);
        if (code <= 8 || code === 65533) {
            return true;
        }
    }
    return false;
};

export const stat = path => promisedCbCall(fs.stat, [path]);
export const mkdirp = path => promisedCbCall(mkdirpCb, [path]);
export const rimraf = path => promisedCbCall(rimrafCb, [path]);
export const glob = (pattern, options) => promisedCbCall(globCb, [pattern, options]);

export const readFile = (path, charset = DEFAULT_CHARSET) => {
    return promisedCbCall(fs.readFile, [path])
        .then(content => {
            if (charset && !bufferIsBinary(content, charset)) {
                content = content.toString(charset);
            }
            return content;
        })
        .catch(() => null);
};

export const writeFile = (path, content, overwrite = false, charset = DEFAULT_CHARSET) => {
    return Promise.resolve()
        .then(() => {
            if (!isString(content) && !isBuffer(content)) {
                throw new Error(`content for '${path}' must be string or buffer but is ${inspect(content)}`);
            }

            if (!overwrite) {
                return stat(path).then(() => {
                    throw new Error(`target file already exists: '${path}'`);
                }, () => null);
            }
        })
        .then(() => mkdirp(dirname(path)))
        .then(() => promisedCbCall(fs.writeFile, [path, content, charset]));
};

export const deletePath = (...paths) => Promise.all(paths.map(rimraf));

export const shortPath = path => {
    const absPath = resolve(path);
    const relPath = relative(process.cwd(), absPath);
    return relPath.length < absPath.length ? relPath : absPath;
};
