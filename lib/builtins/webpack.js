const {join, dirname, basename, resolve} = require('path');
const webpackCb = require('webpack');
const {promisedCbCall, readFile, writeFile, deletePath, pass, passerr} = require('../util');
const each = require('../actions/each');

const webpack = config => promisedCbCall(webpackCb, [config]);

const formatWebpackStats = (stats, len) => {
    const json = stats.toJson();
    const align = (s, i) => `          ${s}`.substr(-i);
    const cmp = (a, b) => a < b ? -1 : a > b ? 1 : 0;
    const sortBy = (arr, selector = x => x) => Array.from(arr).sort((a, b) => cmp(selector(a), selector(b)));
    let res = sortBy(json.modules, x => x.size);
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
        showStats: true,
        showLargest: false
    }, options);

    const dir = resolve(dirname(filename));
    const base = basename(filename);
    const baseIn = '__TMP_WEBPACK_IN__' + base;
    const baseOut = '__TMP_WEBPACK_OUT__' + base;

    const cleanup = (data, throwit = false) => {
        return deletePath(join(dir, baseIn), join(dir, baseOut))
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
    config.entry = './' + baseIn;
    config.output = config.output || {};
    config.output.path = dir;
    config.output.filename = baseOut;

    return writeFile(join(dir, baseIn), content, true, settings.encoding)
        .then(() => webpack(config))
        .then(stats => {
            if (settings.showStats) {
                console.log(stats.toString({colors: true}));
            }
            if (settings.showLargest) {
                console.log(formatWebpackStats(stats, settings.showLargest));
            }

            if (stats.hasErrors()) {
                throw stats.compilation.errors[0];
            }

            return readFile(join(dir, baseOut), settings.encoding)
                .then(out => {
                    return {stats, out};
                });
        })
        .then(pass(cleanup), passerr(cleanup));
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
