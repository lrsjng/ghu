const EX = module.exports = {};

const typeOf = x => Reflect.apply(Object.prototype.toString, x, []);

const isNumber = EX.isNumber = x => typeOf(x) === '[object Number]';
const isString = EX.isString = x => typeOf(x) === '[object String]';
const isFn = EX.isFn = x => typeOf(x) === '[object Function]';
const asFn = EX.asFn = x => isFn(x) ? x : () => x;
EX.asArray = x => Array.isArray(x) ? x : x && !isString(x) && isNumber(x.length) ? Array.from(x) : [x];

EX.runConcurrent = fns => Promise.all(fns.map(fn => asFn(fn)()));
EX.runSequential = fns => fns.reduce((p, fn) => p.then(asFn(fn)), Promise.resolve());

EX.once = fn => {
    let getter = () => {
        const value = fn();
        getter = () => value;
        return value;
    };
    return () => getter();
};

const uniq = EX.uniq = list => {
    const uniqs = [];
    for (const x of list) {
        if (uniqs.indexOf(x) < 0) {
            uniqs.push(x);
        }
    }
    return uniqs;
};

const diff = EX.diff = (listA, listB) => {
    const list = [];
    for (const a of listA) {
        if (listB.indexOf(a) < 0) {
            list.push(a);
        }
    }
    return list;
};

const union = EX.union = (listA, listB) => [...listA, ...diff(listB, listA)];
EX.uniqdiff = (listA, listB) => uniq(diff(listA, listB));
EX.uniqunion = (listA, listB) => uniq(union(listA, listB));

EX.promisedCbCall = (fn, args, ctx) => {
    return new Promise((resolve, reject) => {
        const cb = (err, ...data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data.length < 2 ? data[0] : data);
            }
        };
        Reflect.apply(fn, ctx, [...args, cb]);
    });
};

EX.pass = fn => x => Promise.resolve()
    .then(() => fn(x))
    .then(() => x);

EX.passerr = fn => err => Promise.resolve()
    .then(() => fn(err))
    .then(() => Promise.reject(err));
