import {minify} from 'html-minifier';
import each from '../actions/each';

export default function action(options) {
    const settings = Object.assign({}, options);

    return each(obj => {
        obj.content = minify(obj.content, settings);
    });
}
