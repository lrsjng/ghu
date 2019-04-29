const {as_fn} = require('../util');

const identity = x => x;

module.exports = (expr, on_if = identity, on_else = identity) => {
    return obj => Promise.resolve()
        .then(() => as_fn(expr)(obj))
        .then(expr_val => expr_val ? as_fn(on_if)(obj) : as_fn(on_else)(obj));
};
