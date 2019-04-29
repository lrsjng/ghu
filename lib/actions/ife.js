const {as_fn} = require('../util');

const identity = obj => obj;

module.exports = (expr, onTruthy = identity, onFalsy = identity) => {
    return obj => Promise.resolve()
        .then(() => as_fn(expr)(obj))
        .then(exprValue => exprValue ? as_fn(onTruthy)(obj) : as_fn(onFalsy)(obj));
};
