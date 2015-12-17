const {resolve, join} = require('path');
const {isString, uniq, uniqdiff, uniqunion, glob} = require('../util');

const GLOB_OPTIONS = {
    dot: true,
    silent: false
};

const DEFAULTS = {
    group: ';',
    prefix: ':',
    suffix: ',',
    negation: '!'
};

const globAndResolve = pattern => {
    return glob(pattern, GLOB_OPTIONS)
        .then(relpaths => relpaths.map(path => resolve(path)));
};

const splitPrefix = (sequence, settings) => {
    let prefix = '';
    let suffixes = sequence;
    let parts = sequence.split(settings.prefix);

    // win fix
    if (/^\w:\\/.test(sequence)) {
        parts = [`${parts[0]}:${parts[1]}`, ...parts.slice(2)];
    }

    if (parts.length === 2) {
        prefix = parts[0].trim();
        suffixes = parts[1];
    } else if (parts.length > 2) {
        throw new Error(`only one prefix allowed: '${sequence}'`);
    }

    suffixes = suffixes.split(settings.suffix).map(suffix => suffix.trim());

    return {prefix, suffixes};
};

const parseGroup = (sequence, settings) => {
    let promise = Promise.resolve([]);

    sequence = sequence.trim();
    if (!sequence) {
        return promise;
    }

    const split = splitPrefix(sequence, settings);

    split.suffixes.forEach(suffix => {
        let fn = uniqunion;
        if (suffix[0] === settings.negation) {
            suffix = suffix.slice(1).trim();
            fn = uniqdiff;
        }
        promise = promise.then(allpaths =>
            globAndResolve(join(split.prefix, suffix))
                .then(newpaths => fn(allpaths, newpaths))
        );
    });

    return promise;
};

const flatten = objs => [].concat(...objs);

module.exports = (sequence, options) => {
    const settings = Object.assign({}, DEFAULTS, options);
    return Promise.resolve()
        .then(() => {
            if (!isString(sequence) || !sequence.trim()) {
                return [];
            }

            return Promise.all(
                sequence
                    .split(settings.group)
                    .map(group => parseGroup(group, settings))
            );
        })
        .then(flatten)
        .then(uniq);
};
