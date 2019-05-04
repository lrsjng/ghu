const {inspect} = require('util');
const {is_string, is_fn, as_fn, uniq, run_sequential} = require('../util');
const reporter = require('./reporter');
const {cli_before_exit_hook} = require('./cli');

const resolve_deps = (tasks, sequence, stack = []) => {
    let result = [];

    sequence.forEach(name => {
        if (!tasks[name]) {
            throw new Error(`unknown task: ${name}`);
        } else if (stack.indexOf(name) >= 0) {
            throw new Error(`circular dependencies: ${stack.join(', ')} -> ${name}`);
        }

        tasks[name].deps.forEach(dep => {
            result = result.concat(resolve_deps(tasks, [dep], [...stack, name]));
        });

        result.push(name);
    });

    return uniq(result);
};

class Runner {
    constructor() {
        this._defaults = [];
        this._before = null;
        this._after = null;
        this._tasks = Object.create(null);
        this._reporter = reporter;
        this.exit_code_on_err = 1;
        this.cli_before_exit = true;
        cli_before_exit_hook(this);
    }

    defaults(...sequence) {
        this._defaults = sequence;
    }

    before(fn) {
        this._before = fn;
    }

    after(fn) {
        this._after = fn;
    }

    task(...args) {
        const strings = args.filter(x => is_string(x));
        const arrays = args.filter(x => Array.isArray(x));
        const fns = args.filter(x => is_fn(x));
        const task = {
            name: strings[0] || null,
            desc: strings[1] || '',
            deps: arrays[0] || [],
            fn: fns[0] || null
        };
        if (!is_string(task.name)) {
            throw new Error(`tasks must have a name: task(${args.map(x => inspect(x)).join(', ')}) -> ${inspect(task)}`);
        }
        this._tasks[task.name] = task;
    }

    run(sequence = [], args = {}, dontPanic = false) {
        const runtime = {
            runner: this,
            sequence: sequence.length ? [...sequence] : this._defaults,
            args: Object.assign({}, args),
            starttime: Date.now()
        };
        const report = type => as_fn(this._reporter)(type, runtime);

        return Promise.resolve()
            .then(() => {
                runtime.sequence = resolve_deps(this._tasks, runtime.sequence);
                report('before');
            })
            .then(() => as_fn(this._before)(runtime))
            .then(() => run_sequential(runtime.sequence.map(name => () => Promise.resolve()
                .then(() => {
                    const task = this._tasks[name];
                    runtime.task = task;
                    report('beforeTask');
                    return as_fn(task.fn)(runtime);
                })
                .then(() => {
                    report('afterTask');
                    runtime.task = null;
                })
            )))
            .then(() => as_fn(this._after)(runtime))
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
                if (this.exit_code_on_err) {
                    process.exit(this.exit_code_on_err); // eslint-disable-line no-process-exit
                }
                throw err;
            });
    }
}

module.exports = Runner;
