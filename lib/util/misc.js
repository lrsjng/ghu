export const isNumber = x => typeof x === 'number';
export const isString = x => typeof x === 'string';
export const isArray = x => Array.isArray(x);
export const isBuffer = x => Buffer.isBuffer(x);
export const isFn = x => typeof x === 'function';
export const asFn = x => isFn(x) ? x : () => x;
export const asArray = x => isArray(x) ? x : x && !isString(x) && isNumber(x.length) ? Array.from(x) : [x];

export const runParallel = fns => Promise.all(fns.map(fn => asFn(fn)()));
export const runSequential = fns => fns.reduce((p, fn) => p.then(asFn(fn)), Promise.resolve());

export const once = fn => {
    let getter = () => {
        const value = fn();
        getter = () => value;
        return value;
    };
    return () => getter();
};

export const uniq = list => {
    const uniqs = [];
    for (const x of list) {
        if (uniqs.indexOf(x) < 0) {
            uniqs.push(x);
        }
    }
    return uniqs;
};

export const diff = (listA, listB) => {
    const list = [];
    for (const a of listA) {
        if (listB.indexOf(a) < 0) {
            list.push(a);
        }
    }
    return list;
};

export const union = (listA, listB) => [...listA, ...diff(listB, listA)];
export const uniqdiff = (listA, listB) => uniq(diff(listA, listB));
export const uniqunion = (listA, listB) => uniq(union(listA, listB));

export const promisedCbCall = (fn, args, ctx) => {
    return new Promise((resolve, reject) => {
        const cb = (err, ...data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data.length < 2 ? data[0] : data);
            }
        };
        // Reflect.apply(fn, ctx, [...args, cb]);
        fn.apply(ctx, [...args, cb]); // eslint-disable-line prefer-reflect
    });
};

export const pass = fn => x => Promise.resolve()
    .then(() => fn(x))
    .then(() => x);

export const passerr = fn => err => Promise.resolve()
    .then(() => fn(err))
    .then(() => Promise.reject(err));
