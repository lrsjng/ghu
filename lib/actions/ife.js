import {asFn} from '../util';

const identity = obj => obj;

export default function ife(expr, onTruthy = identity, onFalsy = identity) {
    return obj => Promise.resolve()
        .then(() => asFn(expr)(obj))
        .then(exprValue => exprValue ? asFn(onTruthy)(obj) : asFn(onFalsy)(obj));
}
