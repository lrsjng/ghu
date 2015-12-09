import {isString, asFn, asArray, runSequential, runConcurrent} from '../util';

const DEFAULTS = {
    sequential: false,
    filter: obj => obj && isString(obj.content)
};

export default (fn, options) => {
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
