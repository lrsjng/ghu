const {isString, isRegExp} = require('util');
const esc = require('escape-string-regexp');

const compose = (fn1, fn2) => x => fn2(fn1(x));

const replace_fn = (re, to) => {
    if (!isRegExp(re)) {
        re = new RegExp(esc(String(re)), 'g');
    }
    return x => String(x).replace(re, to);
};
const prefix_fn = (head, to) => replace_fn(new RegExp('^' + esc(head)), to);
const suffix_fn = (tail, to) => replace_fn(new RegExp(esc(tail) + '$'), to);
const to_fn = to => replace_fn(/^(.*\/)?/, to);

const extend_fn = fn => Object.assign(fn, {
    r: (re, to) => extend_fn(compose(fn, replace_fn(re, to))),
    p: (head, to) => extend_fn(compose(fn, prefix_fn(head, to))),
    s: (tail, to) => extend_fn(compose(fn, suffix_fn(tail, to))),
    t: to => extend_fn(compose(fn, to_fn(to)))
});

const obj_to_str = obj => {
    if (obj && isString(obj.source)) {
        return obj.source;
    }
    return String(obj);
};

module.exports = extend_fn(obj_to_str);
