const {join, dirname, basename, resolve} = require('path');
const webpack_cb = require('webpack');
const {promised_cb_call, read_file, write_file, delete_path, pass, pass_err} = require('../util');
const each = require('../actions/each');

const webpack = config => promised_cb_call(webpack_cb, [config]);

const format_stats = (stats, len) => {
    const json = stats.toJson();
    const align = (s, i) => `          ${s}`.substr(-i);
    const cmp = (a, b) => a < b ? -1 : a > b ? 1 : 0;
    const sort_by = (arr, selector = x => x) => Array.from(arr).sort((a, b) => cmp(selector(a), selector(b)));
    let res = sort_by(json.modules, x => x.size);
    if (len) {
        res = 'stats\n' + res.slice(-len).map(r => {
            return `${align(`[${r.id}]`, 7)}${align(r.size, 10)}   ${r.name}`;
        }).join('\n');
        res += `\n\n${align(json.modules.length, 7)}${align(json.assets[0].size, 10)}   ${json.assets[0].name}`;
    } else {
        res = `modules: ${json.modules.length}, bytes: ${json.assets[0].size}, bundle: ${json.assets[0].name}`;
    }
    return res;
};

const pack = (content, filename, config, options) => {
    const settings = Object.assign({
        encoding: 'utf-8',
        showStats: false,
        showLargest: false
    }, options);

    const dir = resolve(dirname(filename));
    const base = basename(filename);
    const base_in = '__TMP_WEBPACK_IN__' + base;
    const base_out = '__TMP_WEBPACK_OUT__' + base;

    const cleanup = (data, throwit = false) => {
        return delete_path(join(dir, base_in), join(dir, base_out))
            .catch(() => null)
            .then(() => {
                if (throwit) {
                    throw data;
                }
                return data;
            });
    };

    config = Object.assign({}, config);
    config.context = dir;
    config.entry = './' + base_in;
    config.output = config.output || {};
    config.output.path = dir;
    config.output.filename = base_out;

    return write_file(join(dir, base_in), content, true, settings.encoding)
        .then(() => webpack(config))
        .then(stats => {
            if (settings.showStats) {
                console.log(stats.toString({colors: true}));
            }
            if (settings.showLargest) {
                console.log(format_stats(stats, settings.showLargest));
            }

            if (stats.hasErrors()) {
                throw stats.compilation.errors[0];
            }

            return read_file(join(dir, base_out), settings.encoding)
                .then(out => {
                    return {stats, out};
                });
        })
        .then(pass(cleanup), pass_err(cleanup));
};

const cfg = include => {
    return {
        mode: 'none',
        module: {
            rules: [
                {
                    include,
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true,
                        presets: ['@babel/preset-env']
                    }
                }
            ]
        }
    };
};

const cfg_umd = (name, include) => {
    return Object.assign(cfg(include), {
        output: {
            library: name,
            libraryTarget: 'umd',
            umdNamedDefine: true,
            globalObject: '(typeof self !== \'undefined\' ? self : this)'
        }
    });
};

const action = module.exports = (config, options) => {
    return each(obj => {
        return pack(obj.content, obj.source, config, options)
            .then(data => {
                obj.content = data.out;
            });
    });
};

action.pack = pack;
action.cfg = cfg;
action.cfg_umd = cfg_umd;
