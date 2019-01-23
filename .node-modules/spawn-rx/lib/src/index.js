"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var net = require("net");
var sfs = require("fs");
var assign = require("lodash.assign");
require("rxjs/add/observable/of");
require("rxjs/add/observable/merge");
require("rxjs/add/operator/pluck");
require("rxjs/add/operator/reduce");
var Observable_1 = require("rxjs/Observable");
var Subscription_1 = require("rxjs/Subscription");
var AsyncSubject_1 = require("rxjs/AsyncSubject");
var spawnOg = require('child_process').spawn; //tslint:disable-line:no-var-requires
var isWindows = process.platform === 'win32';
var d = require('debug')('spawn-rx'); //tslint:disable-line:no-var-requires
/**
 * stat a file but don't throw if it doesn't exist
 *
 * @param  {string} file The path to a file
 * @return {Stats}       The stats structure
 *
 * @private
 */
function statSyncNoException(file) {
    try {
        return sfs.statSync(file);
    }
    catch (e) {
        return null;
    }
}
/**
 * Search PATH to see if a file exists in any of the path folders.
 *
 * @param  {string} exe The file to search for
 * @return {string}     A fully qualified path, or the original path if nothing
 *                      is found
 *
 * @private
 */
function runDownPath(exe) {
    // NB: Windows won't search PATH looking for executables in spawn like
    // Posix does
    // Files with any directory path don't get this applied
    if (exe.match(/[\\\/]/)) {
        d('Path has slash in directory, bailing');
        return exe;
    }
    var target = path.join('.', exe);
    if (statSyncNoException(target)) {
        d("Found executable in currect directory: " + target);
        return target;
    }
    var haystack = process.env.PATH.split(isWindows ? ';' : ':');
    for (var _i = 0, haystack_1 = haystack; _i < haystack_1.length; _i++) {
        var p = haystack_1[_i];
        var needle = path.join(p, exe);
        if (statSyncNoException(needle)) {
            return needle;
        }
        ;
    }
    d('Failed to find executable anywhere in path');
    return exe;
}
/**
 * Finds the actual executable and parameters to run on Windows. This method
 * mimics the POSIX behavior of being able to run scripts as executables by
 * replacing the passed-in executable with the script runner, for PowerShell,
 * CMD, and node scripts.
 *
 * This method also does the work of running down PATH, which spawn on Windows
 * also doesn't do, unlike on POSIX.
 *
 * @param  {string} exe           The executable to run
 * @param  {Array<string>} args   The arguments to run
 *
 * @return {Object}               The cmd and args to run
 * @property {string} cmd         The command to pass to spawn
 * @property {Array<string>} args The arguments to pass to spawn
 */
function findActualExecutable(exe, args) {
    // POSIX can just execute scripts directly, no need for silly goosery
    if (process.platform !== 'win32') {
        return { cmd: runDownPath(exe), args: args };
    }
    if (!sfs.existsSync(exe)) {
        // NB: When you write something like `surf-client ... -- surf-build` on Windows,
        // a shell would normally convert that to surf-build.cmd, but since it's passed
        // in as an argument, it doesn't happen
        var possibleExts = ['.exe', '.bat', '.cmd', '.ps1'];
        for (var _i = 0, possibleExts_1 = possibleExts; _i < possibleExts_1.length; _i++) {
            var ext = possibleExts_1[_i];
            var possibleFullPath = runDownPath("" + exe + ext);
            if (sfs.existsSync(possibleFullPath)) {
                return findActualExecutable(possibleFullPath, args);
            }
        }
    }
    if (exe.match(/\.ps1$/i)) {
        var cmd = path.join(process.env.SYSTEMROOT, 'System32', 'WindowsPowerShell', 'v1.0', 'PowerShell.exe');
        var psargs = ['-ExecutionPolicy', 'Unrestricted', '-NoLogo', '-NonInteractive', '-File', exe];
        return { cmd: cmd, args: psargs.concat(args) };
    }
    if (exe.match(/\.(bat|cmd)$/i)) {
        var cmd = path.join(process.env.SYSTEMROOT, 'System32', 'cmd.exe');
        var cmdArgs = ['/C', exe].concat(args);
        return { cmd: cmd, args: cmdArgs };
    }
    if (exe.match(/\.(js)$/i)) {
        var cmd = process.execPath;
        var nodeArgs = [exe];
        return { cmd: cmd, args: nodeArgs.concat(args) };
    }
    // Dunno lol
    return { cmd: exe, args: args };
}
exports.findActualExecutable = findActualExecutable;
/**
 * Spawns a process but detached from the current process. The process is put
 * into its own Process Group that can be killed by unsubscribing from the
 * return Observable.
 *
 * @param  {string} exe               The executable to run
 * @param  {Array<string>} params     The parameters to pass to the child
 * @param  {Object} opts              Options to pass to spawn.
 *
 * @return {Observable<string>}       Returns an Observable that when subscribed
 *                                    to, will create a detached process. The
 *                                    process output will be streamed to this
 *                                    Observable, and if unsubscribed from, the
 *                                    process will be terminated early. If the
 *                                    process terminates with a non-zero value,
 *                                    the Observable will terminate with onError.
 */
function spawnDetached(exe, params, opts) {
    if (opts === void 0) { opts = null; }
    var _a = findActualExecutable(exe, params), cmd = _a.cmd, args = _a.args;
    if (!isWindows) {
        return spawn(cmd, args, assign({}, opts || {}, { detached: true }));
    }
    ;
    var newParams = [cmd].concat(args);
    var target = path.join(__dirname, '..', '..', 'vendor', 'jobber', 'Jobber.exe');
    var options = assign({}, opts || {}, { detached: true, jobber: true });
    d("spawnDetached: " + target + ", " + newParams);
    return spawn(target, newParams, options);
}
exports.spawnDetached = spawnDetached;
/**
 * Spawns a process attached as a child of the current process.
 *
 * @param  {string} exe               The executable to run
 * @param  {Array<string>} params     The parameters to pass to the child
 * @param  {Object} opts              Options to pass to spawn.
 *
 * @return {Observable<string>}       Returns an Observable that when subscribed
 *                                    to, will create a child process. The
 *                                    process output will be streamed to this
 *                                    Observable, and if unsubscribed from, the
 *                                    process will be terminated early. If the
 *                                    process terminates with a non-zero value,
 *                                    the Observable will terminate with onError.
 */
function spawn(exe, params, opts) {
    if (params === void 0) { params = []; }
    if (opts === void 0) { opts = null; }
    opts = opts || {};
    var spawnObs = Observable_1.Observable.create(function (subj) {
        var stdin = opts.stdin, optsWithoutStdIn = __rest(opts, ["stdin"]);
        var _a = findActualExecutable(exe, params), cmd = _a.cmd, args = _a.args;
        d("spawning process: " + cmd + " " + args.join() + ", " + JSON.stringify(optsWithoutStdIn));
        var origOpts = assign({}, optsWithoutStdIn);
        if ('jobber' in origOpts) {
            delete origOpts.jobber;
        }
        if ('split' in origOpts) {
            delete origOpts.split;
        }
        ;
        var proc = spawnOg(cmd, args, origOpts);
        var bufHandler = function (source) { return function (b) {
            if (b.length < 1) {
                return;
            }
            ;
            var chunk = '<< String sent back was too long >>';
            try {
                if (typeof b === 'string') {
                    chunk = b.toString();
                }
                else {
                    chunk = b.toString(origOpts.encoding || 'utf8');
                }
            }
            catch (e) {
                chunk = "<< Lost chunk of process output for " + exe + " - length was " + b.length + ">>";
            }
            subj.next({ source: source, text: chunk });
        }; };
        var ret = new Subscription_1.Subscription();
        if (opts.stdin) {
            if (proc.stdin) {
                ret.add(opts.stdin.subscribe(function (x) { return proc.stdin.write(x); }, subj.error.bind(subj), function () { return proc.stdin.end(); }));
            }
            else {
                subj.error(new Error("opts.stdio conflicts with provided spawn opts.stdin observable, 'pipe' is required"));
            }
        }
        var stderrCompleted = null;
        var stdoutCompleted = null;
        var noClose = false;
        if (proc.stdout) {
            stdoutCompleted = new AsyncSubject_1.AsyncSubject();
            proc.stdout.on('data', bufHandler('stdout'));
            proc.stdout.on('close', function () { stdoutCompleted.next(true); stdoutCompleted.complete(); });
        }
        else {
            stdoutCompleted = Observable_1.Observable.of(true);
        }
        if (proc.stderr) {
            stderrCompleted = new AsyncSubject_1.AsyncSubject();
            proc.stderr.on('data', bufHandler('stderr'));
            proc.stderr.on('close', function () { stderrCompleted.next(true); stderrCompleted.complete(); });
        }
        else {
            stderrCompleted = Observable_1.Observable.of(true);
        }
        proc.on('error', function (e) {
            noClose = true;
            subj.error(e);
        });
        proc.on('close', function (code) {
            noClose = true;
            var pipesClosed = Observable_1.Observable.merge(stdoutCompleted, stderrCompleted)
                .reduce(function (acc) { return acc; }, true);
            if (code === 0) {
                pipesClosed.subscribe(function () { return subj.complete(); });
            }
            else {
                pipesClosed.subscribe(function () { return subj.error(new Error("Failed with exit code: " + code)); });
            }
        });
        ret.add(new Subscription_1.Subscription(function () {
            if (noClose) {
                return;
            }
            ;
            d("Killing process: " + cmd + " " + args.join());
            if (opts.jobber) {
                // NB: Connecting to Jobber's named pipe will kill it
                net.connect("\\\\.\\pipe\\jobber-" + proc.pid);
                setTimeout(function () { return proc.kill(); }, 5 * 1000);
            }
            else {
                proc.kill();
            }
        }));
        return ret;
    });
    return opts.split ? spawnObs : spawnObs.pluck('text');
}
exports.spawn = spawn;
function wrapObservableInPromise(obs) {
    return new Promise(function (res, rej) {
        var out = '';
        obs.subscribe(function (x) { return out += x; }, function (e) { return rej(new Error(out + "\n" + e.message)); }, function () { return res(out); });
    });
}
/**
 * Spawns a process but detached from the current process. The process is put
 * into its own Process Group.
 *
 * @param  {string} exe               The executable to run
 * @param  {Array<string>} params     The parameters to pass to the child
 * @param  {Object} opts              Options to pass to spawn.
 *
 * @return {Promise<string>}       Returns an Promise that represents a detached
 *                                 process. The value returned is the process
 *                                 output. If the process terminates with a
 *                                 non-zero value, the Promise will resolve with
 *                                 an Error.
 */
function spawnDetachedPromise(exe, params, opts) {
    if (opts === void 0) { opts = null; }
    return wrapObservableInPromise(spawnDetached(exe, params, opts));
}
exports.spawnDetachedPromise = spawnDetachedPromise;
/**
 * Spawns a process as a child process.
 *
 * @param  {string} exe               The executable to run
 * @param  {Array<string>} params     The parameters to pass to the child
 * @param  {Object} opts              Options to pass to spawn.
 *
 * @return {Promise<string>}       Returns an Promise that represents a child
 *                                 process. The value returned is the process
 *                                 output. If the process terminates with a
 *                                 non-zero value, the Promise will resolve with
 *                                 an Error.
 */
function spawnPromise(exe, params, opts) {
    if (opts === void 0) { opts = null; }
    return wrapObservableInPromise(spawn(exe, params, opts));
}
exports.spawnPromise = spawnPromise;
//# sourceMappingURL=index.js.map