"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function wrap(code) {
    return '!(function () {' + code + '})();';
}
function default_1(compiler, next) {
    compiler.shims.push(wrap(compiler.getHeader()));
    compiler.shims.push(wrap("\n    if (process.argv[1] && process.env.NODE_UNIQUE_ID) {\n      const cluster = require('cluster')\n      cluster._setupWorker()\n      delete process.env.NODE_UNIQUE_ID\n    }\n  "));
    if (compiler.options.resources.length) {
        compiler.shims.push(wrap("\"use strict\";\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar assert_1 = require(\"assert\");\nvar binary = process.__nexe;\nassert_1.ok(binary);\nvar manifest = binary.resources, directories = {}, isString = function (x) { return typeof x === 'string' || x instanceof String; }, isNotFile = function () { return false; }, isNotDirectory = isNotFile, isFile = function () { return true; }, noop = function () { }, isDirectory = isFile, fs = require('fs'), path = require('path'), originalExistsSync = fs.existsSync, originalReadFile = fs.readFile, originalReadFileSync = fs.readFileSync, originalCreateReadStream = fs.createReadStream, originalReaddir = fs.readdir, originalReaddirSync = fs.readdirSync, originalStatSync = fs.statSync, originalStat = fs.stat, originalRealpath = fs.realpath, originalRealpathSync = fs.realpathSync, resourceStart = binary.layout.resourceStart;\nvar getKey = process.platform.startsWith('win')\n    ? function getKey(filepath) {\n        var key = path.resolve(filepath);\n        if (key.substr(1, 2) === ':\\\\') {\n            key = key[0].toUpperCase() + key.substr(1);\n        }\n        return key;\n    }\n    : path.resolve;\nvar statTime = function () {\n    var stat = binary.layout.stat;\n    return {\n        dev: 0,\n        ino: 0,\n        nlink: 0,\n        rdev: 0,\n        uid: 123,\n        gid: 500,\n        blksize: 4096,\n        blocks: 0,\n        atime: new Date(stat.atime),\n        atimeMs: stat.atime.getTime(),\n        mtime: new Date(stat.mtime),\n        mtimeMs: stat.mtime.getTime(),\n        ctime: new Date(stat.ctime),\n        ctimMs: stat.ctime.getTime(),\n        birthtime: new Date(stat.birthtime),\n        birthtimeMs: stat.birthtime.getTime()\n    };\n};\nvar createStat = function (directoryExtensions, fileExtensions) {\n    if (!fileExtensions) {\n        return Object.assign({}, binary.layout.stat, directoryExtensions, { size: 0 }, statTime());\n    }\n    var size = directoryExtensions[1];\n    return Object.assign({}, binary.layout.stat, fileExtensions, { size: size }, statTime());\n};\nvar ownStat = function (filepath) {\n    setupManifest();\n    var key = getKey(filepath);\n    if (directories[key]) {\n        return createStat({ isDirectory: isDirectory, isFile: isNotFile });\n    }\n    if (manifest[key]) {\n        return createStat(manifest[key], { isFile: isFile, isDirectory: isNotDirectory });\n    }\n};\nfunction makeLong(filepath) {\n    return path._makeLong && path._makeLong(filepath);\n}\nfunction fileOpts(options) {\n    return !options ? {} : isString(options) ? { encoding: options } : options;\n}\nvar setupManifest = function () {\n    Object.keys(manifest).forEach(function (filepath) {\n        var entry = manifest[filepath];\n        var absolutePath = getKey(filepath);\n        var longPath = makeLong(absolutePath);\n        var normalizedPath = path.normalize(filepath);\n        if (!manifest[absolutePath]) {\n            manifest[absolutePath] = entry;\n        }\n        if (longPath && !manifest[longPath]) {\n            manifest[longPath] = entry;\n        }\n        if (!manifest[normalizedPath]) {\n            manifest[normalizedPath] = manifest[filepath];\n        }\n        var currentDir = path.dirname(absolutePath);\n        var prevDir = absolutePath;\n        while (currentDir !== prevDir) {\n            directories[currentDir] = directories[currentDir] || {};\n            directories[currentDir][path.basename(prevDir)] = true;\n            var longDir = makeLong(currentDir);\n            if (longDir && !directories[longDir]) {\n                directories[longDir] = directories[currentDir];\n            }\n            prevDir = currentDir;\n            currentDir = path.dirname(currentDir);\n        }\n    });\n    setupManifest = noop;\n};\n//naive patches intended to work for most use cases\nvar nfs = {\n    existsSync: function existsSync(filepath) {\n        setupManifest();\n        var key = getKey(filepath);\n        if (manifest[key] || directories[key]) {\n            return true;\n        }\n        return originalExistsSync.apply(fs, arguments);\n    },\n    realpath: function realpath(filepath, options, cb) {\n        setupManifest();\n        var key = getKey(filepath);\n        if (isString(filepath) && (manifest[filepath] || manifest[key])) {\n            return process.nextTick(function () { return cb(null, filepath); });\n        }\n        return originalRealpath.call(fs, filepath, options, cb);\n    },\n    realpathSync: function realpathSync(filepath, options) {\n        setupManifest();\n        var key = getKey(filepath);\n        if (isString(filepath) && (manifest[filepath] || manifest[key])) {\n            return filepath;\n        }\n        return originalRealpathSync.call(fs, filepath, options);\n    },\n    readdir: function readdir(filepath, options, callback) {\n        setupManifest();\n        filepath = filepath.toString();\n        if ('function' === typeof options) {\n            callback = options;\n            options = { encoding: 'utf8' };\n        }\n        var dir = directories[getKey(filepath)];\n        if (dir) {\n            process.nextTick(function () {\n                //todo merge with original?\n                callback(null, Object.keys(dir));\n            });\n        }\n        else {\n            return originalReaddir.apply(fs, arguments);\n        }\n    },\n    readdirSync: function readdirSync(filepath, options) {\n        setupManifest();\n        filepath = filepath.toString();\n        var dir = directories[getKey(filepath)];\n        if (dir) {\n            return Object.keys(dir);\n        }\n        return originalReaddirSync.apply(fs, arguments);\n    },\n    readFile: function readFile(filepath, options, callback) {\n        setupManifest();\n        var entry = manifest[filepath] || manifest[getKey(filepath)];\n        if (!entry || !isString(filepath)) {\n            return originalReadFile.apply(fs, arguments);\n        }\n        var offset = entry[0], length = entry[1];\n        var resourceOffset = resourceStart + offset;\n        var encoding = fileOpts(options).encoding;\n        callback = typeof options === 'function' ? options : callback;\n        fs.open(process.execPath, 'r', function (err, fd) {\n            if (err)\n                return callback(err, null);\n            fs.read(fd, Buffer.alloc(length), 0, length, resourceOffset, function (error, bytesRead, result) {\n                if (error) {\n                    return fs.close(fd, function () {\n                        callback(error, null);\n                    });\n                }\n                fs.close(fd, function (err) {\n                    if (err) {\n                        return callback(err, result);\n                    }\n                    callback(err, encoding ? result.toString(encoding) : result);\n                });\n            });\n        });\n    },\n    createReadStream: function createReadStream(filepath, options) {\n        setupManifest();\n        var entry = manifest[filepath] || manifest[getKey(filepath)];\n        if (!entry || !isString(filepath)) {\n            return originalCreateReadStream.apply(fs, arguments);\n        }\n        var offset = entry[0], length = entry[1];\n        var resourceOffset = resourceStart + offset;\n        var opts = fileOpts(options);\n        return fs.createReadStream(process.execPath, Object.assign({}, opts, {\n            start: resourceOffset,\n            end: resourceOffset + length - 1\n        }));\n    },\n    readFileSync: function readFileSync(filepath, options) {\n        setupManifest();\n        var entry = manifest[filepath] || manifest[getKey(filepath)];\n        if (!entry || !isString(filepath)) {\n            return originalReadFileSync.apply(fs, arguments);\n        }\n        var offset = entry[0], length = entry[1];\n        var resourceOffset = resourceStart + offset;\n        var encoding = fileOpts(options).encoding;\n        var fd = fs.openSync(process.execPath, 'r');\n        var result = Buffer.alloc(length);\n        fs.readSync(fd, result, 0, length, resourceOffset);\n        fs.closeSync(fd);\n        return encoding ? result.toString(encoding) : result;\n    },\n    statSync: function statSync(filepath) {\n        var stat = isString(filepath) && ownStat(filepath);\n        if (stat) {\n            return stat;\n        }\n        return originalStatSync.apply(fs, arguments);\n    },\n    stat: function stat(filepath, callback) {\n        var stat = isString(filepath) && ownStat(filepath);\n        if (stat) {\n            process.nextTick(function () {\n                callback(null, stat);\n            });\n        }\n        else {\n            return originalStat.apply(fs, arguments);\n        }\n    }\n};\nif (typeof fs.exists === 'function') {\n    nfs.exists = function (filepath, cb) {\n        cb = cb || noop;\n        var exists = nfs.existsSync(filepath);\n        process.nextTick(function () { return cb(exists); });\n    };\n}\nObject.assign(fs, nfs);\n"));
    }
    //compiler.shims.push(wrap('{/{replace:lib/steps/shim-require.js}}'))
    if (compiler.options.fakeArgv !== false) {
        var nty = !process.stdin.isTTY;
        var input = nty ? '[stdin]' : JSON.stringify(compiler.options.input);
        compiler.shims.push(wrap("\n      var r = require('path').resolve; \n      process.argv.splice(1,0, " + (nty ? "'" + input + "'" : "r(" + input + ")") + ");"));
    }
    return next();
}
exports.default = default_1;
