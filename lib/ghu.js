const Runner = require('./tasks/runner');

module.exports = {
    Runner,
    ghu: Runner(),

    once: require('./util').once,

    concat: require('./actions/concat'),
    each: require('./actions/each'),
    hash: require('./actions/hash'),
    ife: require('./actions/ife'),
    log: require('./actions/log'),
    mapfn: require('./actions/mapfn'),
    newerThan: require('./actions/newerThan'),
    paths: require('./actions/paths'),
    read: require('./actions/read'),
    remove: require('./actions/remove'),
    run: require('./actions/run'),
    stats: require('./actions/stats'),
    wrap: require('./actions/wrap'),
    write: require('./actions/write'),

    autoprefixer: require('./builtins/autoprefixer'),
    babel: require('./builtins/babel'),
    cssmin: require('./builtins/cssmin'),
    eslint: require('./builtins/eslint'),
    htmlminifier: require('./builtins/htmlminifier'),
    includeit: require('./builtins/includeit'),
    jszip: require('./builtins/jszip'),
    less: require('./builtins/less'),
    pug: require('./builtins/pug'),
    uglify: require('./builtins/uglify'),
    watch: require('./builtins/watch'),
    webpack: require('./builtins/webpack')
};
