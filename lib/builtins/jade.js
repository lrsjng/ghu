import jade from 'jade';
import each from '../actions/each';

export default function action(locals, options) {
    return each(obj => {
        const settings = Object.assign({}, options, {filename: obj.source});
        const render = jade.compile(obj.content, settings);
        obj.content = render(locals);
    });
}
