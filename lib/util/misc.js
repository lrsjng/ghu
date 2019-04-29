const type_of = x => Reflect.apply(Object.prototype.toString, x, []);

const is_number = x => type_of(x) === '[object Number]';
const is_string = x => type_of(x) === '[object String]';
const is_fn = x => type_of(x) === '[object Function]';
const as_fn = x => is_fn(x) ? x : () => x;
const as_array = x => Array.isArray(x) ? x : x && !is_string(x) && !Buffer.isBuffer(x) && !is_fn(x) && is_number(x.length) ? Array.from(x) : [x];

const REGEXP_ESC = /[|\\{}()[\]^$+*?.-]/g;
const esc_regexp = str => str.replace(REGEXP_ESC, '\\$&');
const is_regexp = x => x instanceof RegExp;

const run_concurrent = fns => Promise.all(fns.map(fn => as_fn(fn)()));
const run_sequential = fns => fns.reduce((p, fn) => p.then(as_fn(fn)), Promise.resolve());

const once = fn => {
    let getter = () => {
        const value = fn();
        getter = () => value;
        return value;
    };
    return () => getter();
};

const uniq = list => {
    const uniqs = [];
    for (const x of list) {
        if (uniqs.indexOf(x) < 0) {
            uniqs.push(x);
        }
    }
    return uniqs;
};

const diff = (listA, listB) => listA.filter(x => listB.indexOf(x) < 0);
const union = (listA, listB) => [...listA, ...diff(listB, listA)];
const uniqdiff = (listA, listB) => uniq(diff(listA, listB));
const uniqunion = (listA, listB) => uniq(union(listA, listB));

const promised_cb_call = (fn, args) => {
    return new Promise((resolve, reject) => {
        const cb = (err, ...data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data.length < 2 ? data[0] : data);
            }
        };
        fn(...args, cb);
    });
};

const pass = fn => x => Promise.resolve()
    .then(() => fn(x))
    .then(() => x);

const pass_err = fn => err => Promise.resolve()
    .then(() => fn(err))
    .then(() => Promise.reject(err));

module.exports = {
    as_array,
    as_fn,
    diff,
    is_fn,
    is_number,
    is_string,
    esc_regexp,
    is_regexp,
    once,
    pass,
    pass_err,
    promised_cb_call,
    run_concurrent,
    run_sequential,
    union,
    uniq,
    uniqdiff,
    uniqunion
};
