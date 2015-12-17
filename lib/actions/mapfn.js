const {isString, isRegExp} = require('util');
const esc = require('escape-string-regexp');

const compose = (fn1, fn2) => x => fn2(fn1(x));

const replaceFn = (re, to) => {
    if (!isRegExp(re)) {
        re = new RegExp(esc(String(re)), 'g');
    }
    return x => String(x).replace(re, to);
};
const prefixFn = (head, to) => replaceFn(new RegExp('^' + esc(head)), to);
const suffixFn = (tail, to) => replaceFn(new RegExp(esc(tail) + '$'), to);

const extendFn = fn => Object.assign(fn, {
    r: (re, to) => extendFn(compose(fn, replaceFn(re, to))),
    p: (head, to) => extendFn(compose(fn, prefixFn(head, to))),
    s: (tail, to) => extendFn(compose(fn, suffixFn(tail, to)))
});

const objToStr = obj => {
    if (obj && isString(obj.source)) {
        return obj.source;
    }
    return String(obj);
};

module.exports = extendFn(objToStr);
