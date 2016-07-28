const typeOf = x => Reflect.apply(Object.prototype.toString, x, []);

const isNumber = x => typeOf(x) === '[object Number]';
const isString = x => typeOf(x) === '[object String]';
const isFn = x => typeOf(x) === '[object Function]';
const asFn = x => isFn(x) ? x : () => x;
const asArray = x => Array.isArray(x) ? x : x && !isString(x) && !Buffer.isBuffer(x) && !isFn(x) && isNumber(x.length) ? Array.from(x) : [x];

const runConcurrent = fns => Promise.all(fns.map(fn => asFn(fn)()));
const runSequential = fns => fns.reduce((p, fn) => p.then(asFn(fn)), Promise.resolve());

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

const promisedCbCall = (fn, args) => {
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

const passerr = fn => err => Promise.resolve()
    .then(() => fn(err))
    .then(() => Promise.reject(err));

module.exports = {
    asArray,
    asFn,
    diff,
    isFn,
    isNumber,
    isString,
    once,
    pass,
    passerr,
    promisedCbCall,
    runConcurrent,
    runSequential,
    union,
    uniq,
    uniqdiff,
    uniqunion
};
