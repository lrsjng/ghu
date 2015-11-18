import {readFile} from '../util';
import stats from './stats';

export default function read(arg, options, charset) {
    options = Object.assign({}, options, {files: true, dirs: false});
    return stats(arg, options)
        .then(objs => Promise.all(
            objs.map(obj => readFile(obj.source, charset)
                .catch(() => null)
                .then(content => {
                    obj.content = content;
                    return obj;
                })
            )
        ));
}

read.file = readFile;
read.json = (...args) => readFile(...args).then(content => JSON.parse(content));
