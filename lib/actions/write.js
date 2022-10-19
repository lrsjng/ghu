// const chalk = require('chalk');
const chalk = import('chalk');
const {as_fn, is_fn, is_number, is_string, write_file, short_path} = require('../util');

const get_byte_count = x => {
    if (is_string(x)) {
        return Buffer.byteLength(x, 'utf-8');
    } else if (Buffer.isBuffer(x)) {
        return x.length;
    }
    return 0;
};

const log = (obj, dest) => {
    const byte_count = get_byte_count(obj.content);
    let str = chalk.green('write') + ' ' + short_path(dest);
    str += is_number(byte_count) ? chalk.grey(` (${byte_count} bytes)`) : '';
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

            assert(is_fn(arg) || is_string(arg), 'argument must be string or function');
            assert(is_fn(arg) || objs.length < 2, 'argument must be a mapper function if more than one file is selected');

            const mapper = as_fn(arg);
            const promises = objs.map((obj, idx) => {
                const dest = mapper(obj, idx, objs);

                return write_file(dest, obj.content, settings.overwrite)
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
                        const byte_count = objs.map(obj => get_byte_count(obj.content)).reduce((sum, bytes) => sum + bytes, 0);
                        let str = chalk.green('write') + ` ${count} files`;
                        str += is_number(byte_count) ? chalk.grey(` (${byte_count} bytes)`) : '';
                        console.log(str);
                    }
                })
                .then(() => objs);
        });
    };
};

write.file = write_file;
