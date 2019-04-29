const {is_string, as_fn, as_array, run_sequential, run_concurrent} = require('../util');

const DEFAULTS = {
    sequential: false,
    filter: obj => obj && is_string(obj.content)
};

module.exports = (fn, options) => {
    return objs => {
        fn = as_fn(fn);
        objs = as_array(objs);
        const settings = Object.assign({}, DEFAULTS, options);
        const run = settings.sequential ? run_sequential : run_concurrent;
        const filter = as_fn(settings.filter);

        const fns = objs.map((obj, idx) => filter(obj) ? () => fn(obj, idx, objs) : null);
        return run(fns).then(() => objs);
    };
};
