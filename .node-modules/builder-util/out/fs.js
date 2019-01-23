"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unlinkIfExists = unlinkIfExists;
exports.statOrNull = statOrNull;
exports.exists = exists;
exports.walk = walk;
exports.copyFile = copyFile;
exports.copyOrLinkFile = copyOrLinkFile;
exports.copyDir = copyDir;
exports.USE_HARD_LINKS = exports.DO_NOT_USE_HARD_LINKS = exports.FileCopier = exports.CopyFileTransformer = exports.CONCURRENCY = exports.MAX_FILE_REQUESTS = void 0;

function _bluebirdLst() {
  const data = _interopRequireWildcard(require("bluebird-lst"));

  _bluebirdLst = function () {
    return data;
  };

  return data;
}

function _fsExtraP() {
  const data = require("fs-extra-p");

  _fsExtraP = function () {
    return data;
  };

  return data;
}

var path = _interopRequireWildcard(require("path"));

function _statMode() {
  const data = _interopRequireDefault(require("stat-mode"));

  _statMode = function () {
    return data;
  };

  return data;
}

function _log() {
  const data = require("./log");

  _log = function () {
    return data;
  };

  return data;
}

function _promise() {
  const data = require("./promise");

  _promise = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

const MAX_FILE_REQUESTS = 8;
exports.MAX_FILE_REQUESTS = MAX_FILE_REQUESTS;
const CONCURRENCY = {
  concurrency: MAX_FILE_REQUESTS
};
exports.CONCURRENCY = CONCURRENCY;

class CopyFileTransformer {
  constructor(afterCopyTransformer) {
    this.afterCopyTransformer = afterCopyTransformer;
  }

}

exports.CopyFileTransformer = CopyFileTransformer;

function unlinkIfExists(file) {
  return (0, _fsExtraP().unlink)(file).catch(() => {});
}

function statOrNull(_x) {
  return _statOrNull.apply(this, arguments);
}

function _statOrNull() {
  _statOrNull = (0, _bluebirdLst().coroutine)(function* (file) {
    return (0, _promise().orNullIfFileNotExist)((0, _fsExtraP().stat)(file));
  });
  return _statOrNull.apply(this, arguments);
}

function exists(_x2) {
  return _exists.apply(this, arguments);
}
/**
 * Returns list of file paths (system-dependent file separator)
 */


function _exists() {
  _exists = (0, _bluebirdLst().coroutine)(function* (file) {
    try {
      yield (0, _fsExtraP().access)(file);
      return true;
    } catch (e) {
      return false;
    }
  });
  return _exists.apply(this, arguments);
}

function walk(_x3, _x4, _x5) {
  return _walk.apply(this, arguments);
}

function _walk() {
  _walk = (0, _bluebirdLst().coroutine)(function* (initialDirPath, filter, consumer) {
    let result = [];
    const queue = [initialDirPath];
    let addDirToResult = false;
    const isIncludeDir = consumer == null ? false : consumer.isIncludeDir === true;

    while (queue.length > 0) {
      const dirPath = queue.pop();

      if (isIncludeDir) {
        if (addDirToResult) {
          result.push(dirPath);
        } else {
          addDirToResult = true;
        }
      }

      const childNames = yield (0, _fsExtraP().readdir)(dirPath);
      childNames.sort();
      let nodeModuleContent = null;
      const dirs = []; // our handler is async, but we should add sorted files, so, we add file to result not in the mapper, but after map

      const sortedFilePaths = yield _bluebirdLst().default.map(childNames, name => {
        if (name === ".DS_Store" || name === ".gitkeep") {
          return null;
        }

        const filePath = dirPath + path.sep + name;
        return (0, _fsExtraP().lstat)(filePath).then(stat => {
          if (filter != null && !filter(filePath, stat)) {
            return null;
          }

          const consumerResult = consumer == null ? null : consumer.consume(filePath, stat, dirPath, childNames);

          if (consumerResult === false) {
            return null;
          } else if (consumerResult == null || !("then" in consumerResult)) {
            if (stat.isDirectory()) {
              dirs.push(name);
              return null;
            } else {
              return filePath;
            }
          } else {
            return consumerResult.then(it => {
              if (it != null && Array.isArray(it)) {
                nodeModuleContent = it;
                return null;
              } // asarUtil can return modified stat (symlink handling)


              if ((it != null && "isDirectory" in it ? it : stat).isDirectory()) {
                dirs.push(name);
                return null;
              } else {
                return filePath;
              }
            });
          }
        });
      }, CONCURRENCY);

      for (const child of sortedFilePaths) {
        if (child != null) {
          result.push(child);
        }
      }

      dirs.sort();

      for (const child of dirs) {
        queue.push(dirPath + path.sep + child);
      }

      if (nodeModuleContent != null) {
        result = result.concat(nodeModuleContent);
      }
    }

    return result;
  });
  return _walk.apply(this, arguments);
}

const _isUseHardLink = process.platform !== "win32" && process.env.USE_HARD_LINKS !== "false" && (require("is-ci") || process.env.USE_HARD_LINKS === "true");

function copyFile(src, dest, isEnsureDir = true) {
  return (isEnsureDir ? (0, _fsExtraP().ensureDir)(path.dirname(dest)) : Promise.resolve()).then(() => copyOrLinkFile(src, dest, null, false));
}
/**
 * Hard links is used if supported and allowed.
 * File permission is fixed — allow execute for all if owner can, allow read for all if owner can.
 *
 * ensureDir is not called, dest parent dir must exists
 */


function copyOrLinkFile(src, dest, stats, isUseHardLink, exDevErrorHandler) {
  if (isUseHardLink === undefined) {
    isUseHardLink = _isUseHardLink;
  }

  if (stats != null) {
    const originalModeNumber = stats.mode;
    const mode = new (_statMode().default)(stats);

    if (mode.owner.execute) {
      mode.group.execute = true;
      mode.others.execute = true;
    }

    mode.group.read = true;
    mode.others.read = true;

    if (originalModeNumber !== stats.mode) {
      if (_log().log.isDebugEnabled) {
        const oldMode = new (_statMode().default)({
          mode: originalModeNumber
        });

        _log().log.debug({
          file: dest,
          oldMode,
          mode
        }, "permissions fixed from");
      } // https://helgeklein.com/blog/2009/05/hard-links-and-permissions-acls/
      // Permissions on all hard links to the same data on disk are always identical. The same applies to attributes.
      // That means if you change the permissions/owner/attributes on one hard link, you will immediately see the changes on all other hard links.


      if (isUseHardLink) {
        isUseHardLink = false;

        _log().log.debug({
          dest
        }, "copied, but not linked, because file permissions need to be fixed");
      }
    }
  }

  if (isUseHardLink) {
    return (0, _fsExtraP().link)(src, dest).catch(e => {
      if (e.code === "EXDEV") {
        const isLog = exDevErrorHandler == null ? true : exDevErrorHandler();

        if (isLog && _log().log.isDebugEnabled) {
          _log().log.debug({
            error: e.message
          }, "cannot copy using hard link");
        }

        return doCopyFile(src, dest, stats);
      } else {
        throw e;
      }
    });
  }

  return doCopyFile(src, dest, stats);
}

function doCopyFile(src, dest, stats) {
  if (_fsExtraP().copyFile == null) {
    return new Promise((resolve, reject) => {
      const reader = (0, _fsExtraP().createReadStream)(src);
      const writer = (0, _fsExtraP().createWriteStream)(dest, stats == null ? undefined : {
        mode: stats.mode
      });
      reader.on("error", reject);
      writer.on("error", reject);
      writer.on("open", () => {
        reader.pipe(writer);
      });
      writer.once("close", resolve);
    });
  } // node 8.5.0+


  const promise = (0, _fsExtraP().copyFile)(src, dest);

  if (stats == null) {
    return promise;
  }

  return promise.then(() => (0, _fsExtraP().chmod)(dest, stats.mode));
}

class FileCopier {
  constructor(isUseHardLinkFunction, transformer) {
    this.isUseHardLinkFunction = isUseHardLinkFunction;
    this.transformer = transformer;

    if (isUseHardLinkFunction === USE_HARD_LINKS) {
      this.isUseHardLink = true;
    } else {
      this.isUseHardLink = _isUseHardLink && isUseHardLinkFunction !== DO_NOT_USE_HARD_LINKS;
    }
  }

  copy(src, dest, stat) {
    var _this = this;

    return (0, _bluebirdLst().coroutine)(function* () {
      let afterCopyTransformer = null;

      if (_this.transformer != null && stat != null && stat.isFile()) {
        let data = _this.transformer(src);

        if (data != null) {
          if (typeof data === "object" && "then" in data) {
            data = yield data;
          }

          if (data != null) {
            if (data instanceof CopyFileTransformer) {
              afterCopyTransformer = data.afterCopyTransformer;
            } else {
              yield (0, _fsExtraP().writeFile)(dest, data);
              return;
            }
          }
        }
      }

      const isUseHardLink = afterCopyTransformer == null && (!_this.isUseHardLink || _this.isUseHardLinkFunction == null ? _this.isUseHardLink : _this.isUseHardLinkFunction(dest));
      yield copyOrLinkFile(src, dest, stat, isUseHardLink, isUseHardLink ? () => {
        // files are copied concurrently, so, we must not check here currentIsUseHardLink — our code can be executed after that other handler will set currentIsUseHardLink to false
        if (_this.isUseHardLink) {
          _this.isUseHardLink = false;
          return true;
        } else {
          return false;
        }
      } : null);

      if (afterCopyTransformer != null) {
        yield afterCopyTransformer(dest);
      }
    })();
  }

}
/**
 * Empty directories is never created.
 * Hard links is used if supported and allowed.
 */


exports.FileCopier = FileCopier;

function copyDir(src, destination, options = {}) {
  const fileCopier = new FileCopier(options.isUseHardLink, options.transformer);

  if (_log().log.isDebugEnabled) {
    _log().log.debug({
      src,
      destination
    }, `copying${fileCopier.isUseHardLink ? " using hard links" : ""}`);
  }

  const createdSourceDirs = new Set();
  const links = [];
  return walk(src, options.filter, {
    consume: function () {
      var _ref = (0, _bluebirdLst().coroutine)(function* (file, stat, parent) {
        if (!stat.isFile() && !stat.isSymbolicLink()) {
          return;
        }

        if (!createdSourceDirs.has(parent)) {
          yield (0, _fsExtraP().ensureDir)(parent.replace(src, destination));
          createdSourceDirs.add(parent);
        }

        const destFile = file.replace(src, destination);

        if (stat.isFile()) {
          yield fileCopier.copy(file, destFile, stat);
        } else {
          links.push({
            file: destFile,
            link: yield (0, _fsExtraP().readlink)(file)
          });
        }
      });

      return function consume(_x6, _x7, _x8) {
        return _ref.apply(this, arguments);
      };
    }()
  }).then(() => _bluebirdLst().default.map(links, it => (0, _fsExtraP().symlink)(it.link, it.file), CONCURRENCY));
}

const DO_NOT_USE_HARD_LINKS = file => false;

exports.DO_NOT_USE_HARD_LINKS = DO_NOT_USE_HARD_LINKS;

const USE_HARD_LINKS = file => true; exports.USE_HARD_LINKS = USE_HARD_LINKS;
// __ts-babel@6.0.4
//# sourceMappingURL=fs.js.map