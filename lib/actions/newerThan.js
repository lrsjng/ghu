const stats = require('./stats');

const selectToTimes = x => {
    return stats(x).then(objs => Promise.all(objs.map(obj => obj.stats.mtime.getTime())));
};

const toTimes = (x, obj, idx, objs) => Promise.resolve().then(() => {
    if (Array.isArray(x)) {
        return Promise.all(x.map(xi => toTimes(xi)))
            .then(times => [].concat(...times));
    }

    if (typeof x === 'function') {
        return toTimes(x(obj, idx, objs));
    }

    if (typeof x === 'string') {
        return selectToTimes(x);
    }

    if (x && x.stats && x.stats.mtime) {
        return [x.stats.mtime.getTime()];
    }

    return [];
});

const isAnyNewerThan = (x, y, obj, idx, objs) => Promise.resolve()
    .then(() => Promise.all([
        toTimes(x, obj, idx, objs),
        toTimes(y, obj, idx, objs)
    ]))
    .then(([xTimes, yTimes]) => {
        if (yTimes.length === 0) {
            return true;
        }
        return Math.max(...xTimes) > Math.min(...yTimes);
    });

module.exports = (targets, deps, keepAll = false) => {
    return objs => {
        const promises = objs.map((obj, idx) => {
            return isAnyNewerThan([obj, deps], targets, obj, idx, objs)
                .then(isNewer => isNewer ? obj : undefined);
        });

        return Promise.all(promises).then(allNewerFiles => {
            allNewerFiles = allNewerFiles.filter(x => x);
            return allNewerFiles.length && keepAll ? objs : allNewerFiles;
        });
    };
};
