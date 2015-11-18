import {transform} from 'babel-core';
import each from '../actions/each';

export default options => {
    return each(obj => {
        const settings = Object.assign({}, options, {filename: obj.source});
        obj.content = transform(obj.content, settings).code;
    });
};
