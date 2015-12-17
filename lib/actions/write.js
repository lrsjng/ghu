const chalk = require('chalk');
const {asFn, isFn, isNumber, isString, writeFile, shortPath} = require('../util');

const getByteCount = x => {
    if (isString(x)) {
        return Buffer.byteLength(x, 'utf-8');
    } else if (Buffer.isBuffer(x)) {
        return x.length;
    }
};

const log = (obj, dest) => {
    const byteCount = getByteCount(obj.content);
    let str = chalk.green(`write`) + ' ' + shortPath(dest);
    str += isNumber(byteCount) ? chalk.grey(` (${byteCount} bytes)`) : '';
    console.log(str);
};

const assert = (expr, message) => {
    if (!expr) {
        const err = new Error(message);
        err.ghu = {action: 'write'};
        throw err;
    }
};

const write = module.exports = (arg, options) => {
    return objs => {
        return Promise.resolve().then(() => {
            const settings = Object.assign({
                overwrite: false,
                silent: false,
                cluster: false
            }, options);

            assert(isFn(arg) || isString(arg), 'argument must be string or function');
            assert(isFn(arg) || objs.length < 2, 'argument must be a mapper function if more than one file is selected');

            const mapper = asFn(arg);
            const promises = objs.map((obj, idx) => {
                const dest = mapper(obj, idx, objs);

                return writeFile(dest, obj.content, settings.overwrite)
                    .then(() => {
                        if (!settings.silent && !settings.cluster) {
                            log(obj, dest);
                        }
                    })
                    .catch(err => {
                        err.ghu = {
                            action: 'write',
                            obj
                        };
                        throw err;
                    });
            });
            return Promise.all(promises)
                .then(() => {
                    if (!settings.silent && settings.cluster && objs.length) {
                        const count = objs.length;
                        const byteCount = objs.map(obj => getByteCount(obj.content)).reduce((sum, bytes) => sum + bytes, 0);
                        let str = chalk.green(`write`) + ` ${count} files`;
                        str += isNumber(byteCount) ? chalk.grey(` (${byteCount} bytes)`) : '';
                        console.log(str);
                    }
                })
                .then(() => objs);
        });
    };
};

write.file = writeFile;
