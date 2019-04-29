const stats = require('./stats');

const select_to_times = x => {
    return stats(x).then(objs => Promise.all(objs.map(obj => obj.stats.mtime.getTime())));
};

const to_times = (x, obj, idx, objs) => Promise.resolve().then(() => {
    if (Array.isArray(x)) {
        return Promise.all(x.map(xi => to_times(xi)))
            .then(times => [].concat(...times));
    }

    if (typeof x === 'function') {
        return to_times(x(obj, idx, objs));
    }

    if (typeof x === 'string') {
        return select_to_times(x);
    }

    if (x && x.stats && x.stats.mtime) {
        return [x.stats.mtime.getTime()];
    }

    return [];
});

const is_any_newer_than = (x, y, obj, idx, objs) => Promise.resolve()
    .then(() => Promise.all([
        to_times(x, obj, idx, objs),
        to_times(y, obj, idx, objs)
    ]))
    .then(([xTimes, yTimes]) => {
        if (yTimes.length === 0) {
            return true;
        }
        return Math.max(...xTimes) > Math.min(...yTimes);
    });

module.exports = (targets, deps, keep_all = false) => {
    return objs => {
        const promises = objs.map((obj, idx) => {
            return is_any_newer_than([obj, deps], targets, obj, idx, objs)
                .then(isNewer => isNewer ? obj : undefined);
        });

        return Promise.all(promises).then(all_newer_files => {
            all_newer_files = all_newer_files.filter(x => x);
            return all_newer_files.length && keep_all ? objs : all_newer_files;
        });
    };
};
