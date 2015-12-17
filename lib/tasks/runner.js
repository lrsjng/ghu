const {inspect} = require('util');
const {isString, isFn, asFn, uniq, runSequential} = require('../util');
const reporter = require('./reporter');
const {cliBeforeExitHook} = require('./cli');

const resolveDeps = (tasks, sequence, stack = []) => {
    let result = [];

    sequence.forEach(name => {
        if (!tasks[name]) {
            throw new Error(`unknown task: ${name}`);
        } else if (stack.indexOf(name) >= 0) {
            throw new Error(`circular dependencies: ${stack.join(', ')} -> ${name}`);
        }

        tasks[name].deps.forEach(dep => {
            result = result.concat(resolveDeps(tasks, [dep], [...stack, name]));
        });

        result.push(name);
    });

    return uniq(result);
};

const Runner = module.exports = () => {
    const inst = Object.assign(Object.create(Runner.prototype), {
        _defaults: [],
        _before: null,
        _after: null,
        _tasks: Object.create(null),
        _reporter: reporter,
        exitCodeOnError: 1,
        cliBeforeExit: true
    });
    cliBeforeExitHook(inst);
    return inst;
};

Runner.prototype = {
    constructor: Runner,

    defaults(...sequence) {
        this._defaults = sequence;
    },

    before(fn) {
        this._before = fn;
    },

    after(fn) {
        this._after = fn;
    },

    task(...args) {
        const strings = args.filter(x => isString(x));
        const arrays = args.filter(x => Array.isArray(x));
        const fns = args.filter(x => isFn(x));
        const task = {
            name: strings[0] || null,
            desc: strings[1] || '',
            deps: arrays[0] || [],
            fn: fns[0] || null
        };
        if (!isString(task.name)) {
            throw new Error(`tasks must have a name: task(${args.map(x => inspect(x)).join(', ')}) -> ${inspect(task)}`);
        }
        this._tasks[task.name] = task;
    },

    run(sequence = [], args = {}, dontPanic = false) {
        const runtime = {
            runner: this,
            sequence: sequence.length ? [...sequence] : this._defaults,
            args: Object.assign({}, args),
            starttime: Date.now()
        };
        const report = type => asFn(this._reporter)(type, runtime);

        return Promise.resolve()
            .then(() => {
                runtime.sequence = resolveDeps(this._tasks, runtime.sequence);
                report('before');
            })
            .then(() => asFn(this._before)(runtime))
            .then(() => runSequential(runtime.sequence.map(name => () => Promise.resolve()
                .then(() => {
                    const task = this._tasks[name];
                    runtime.task = task;
                    report('beforeTask');
                    return asFn(task.fn)(runtime);
                })
                .then(() => {
                    report('afterTask');
                    runtime.task = null;
                })
            )))
            .then(() => asFn(this._after)(runtime))
            .then(() => {
                runtime.time = Date.now() - runtime.starttime;
                report('after');
            })
            .catch(err => {
                runtime.error = err;
                runtime.time = Date.now() - runtime.starttime;
                report('error');
                if (dontPanic) {
                    return;
                }
                if (this.exitCodeOnError) {
                    process.exit(this.exitCodeOnError); // eslint-disable-line no-process-exit
                }
                throw err;
            });
    }
};
