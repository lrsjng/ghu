import {stat} from '../util';
import paths from './paths';

export default function action(sequence, options) {
    const settings = Object.assign({}, {
        files: true,
        dirs: false
    }, options);

    return paths(sequence, settings)
        .then(allpaths => Promise.all(
            allpaths.map(path => stat(path)
                .then(stats => ({source: path, stats}))
                .catch(() => null)
            )
        ))
        .then(objs => objs.filter(obj => obj && (
            settings.files && obj.stats.isFile() ||
            settings.dirs && obj.stats.isDirectory()
        )));
}

action.file = stat;
