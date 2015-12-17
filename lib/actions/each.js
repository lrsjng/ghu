const {isString, asFn, asArray, runSequential, runConcurrent} = require('../util');

const DEFAULTS = {
    sequential: false,
    filter: obj => obj && isString(obj.content)
};

module.exports = (fn, options) => {
    return objs => {
        fn = asFn(fn);
        objs = asArray(objs);
        const settings = Object.assign({}, DEFAULTS, options);
        const run = settings.sequential ? runSequential : runConcurrent;
        const filter = asFn(settings.filter);

        const fns = objs.map((obj, idx) => filter(obj) ? () => fn(obj, idx, objs) : null);
        return run(fns).then(() => objs);
    };
};
