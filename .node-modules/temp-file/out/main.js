"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTempName = getTempName;
exports.TmpDir = void 0;

function _bluebirdLst() {
  const data = _interopRequireDefault(require("bluebird-lst"));

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

function _os() {
  const data = require("os");

  _os = function () {
    return data;
  };

  return data;
}

var path = _interopRequireWildcard(require("path"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let tmpFileCounter = 0;
const tmpDirManagers = new Set(); // add date to avoid use stale temp dir

const tempDirPrefix = `${process.pid.toString(36)}-${Date.now().toString(36)}`;

function getTempName(prefix) {
  return `${prefix == null ? "" : `${prefix}-`}${tempDirPrefix}-${(tmpFileCounter++).toString(36)}`;
}

let tempDirPromise;
let tempBaseDir;

function getBaseTempDir() {
  if (tempDirPromise != null) {
    return tempDirPromise;
  }

  if (tempBaseDir != null) {
    return Promise.resolve(tempBaseDir);
  }

  const systemTmpDir = process.env.APP_BUILDER_TMP_DIR || (0, _os().tmpdir)();
  const isEnsureRemovedOnExit = process.env.TMP_DIR_MANAGER_ENSURE_REMOVED_ON_EXIT !== "false";
  tempDirPromise = (0, _fsExtraP().mkdtemp)(path.join(systemTmpDir, "t-")).then(it => (0, _fsExtraP().realpath)(it)).then(dir => {
    if (isEnsureRemovedOnExit) {
      addExitHook(dir);
    }

    tempBaseDir = dir;
    return dir;
  });
  return tempDirPromise;
}

function addExitHook(dir) {
  require("async-exit-hook")(callback => {
    const managers = Array.from(tmpDirManagers);
    tmpDirManagers.clear();

    if (callback == null) {
      for (const manager of managers) {
        manager.cleanupSync();
      }

      try {
        (0, _fsExtraP().removeSync)(dir);
      } catch (e) {
        handleError(e, dir);
      }

      return;
    } // each instead of map to avoid fs overload


    _bluebirdLst().default.each(managers, it => it.cleanup()).then(() => (0, _fsExtraP().remove)(dir)).then(() => callback()).catch(e => {
      try {
        handleError(e, dir);
      } finally {
        callback();
      }
    });
  });
}

function handleError(e, file) {
  if (e.code !== "EPERM" && e.code !== "ENOENT") {
    // use only console.* instead of our warn on exit (otherwise nodeEmoji can be required on request)
    console.warn(`Cannot delete temporary "${file}": ${(e.stack || e).toString()}`);
  }
}

class TmpDir {
  constructor(debugName = "") {
    this.debugName = debugName;
    this.tempFiles = [];
    this.registered = false;
  } // noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols


  get rootTempDir() {
    return getBaseTempDir();
  }

  getTempDir(options) {
    return this.getTempFile(options, true);
  }

  createTempDir(options) {
    return this.getTempFile(options, true).then(it => (0, _fsExtraP().ensureDir)(it).then(() => it));
  }

  getTempFile(options, isDir = false) {
    return getBaseTempDir().then(baseTempDir => {
      if (!this.registered) {
        this.registered = true;
        tmpDirManagers.add(this);
      }

      const prefix = nullize(options == null ? null : options.prefix);
      const suffix = nullize(options == null ? null : options.suffix);
      const namePrefix = prefix == null ? "" : `${prefix}-`;
      const nameSuffix = suffix == null ? "" : suffix.startsWith(".") ? suffix : `-${suffix}`;
      const result = `${baseTempDir}${path.sep}${namePrefix}${(tmpFileCounter++).toString(36)}${nameSuffix}`;
      this.tempFiles.push({
        path: result,
        isDir,
        disposer: options == null ? null : options.disposer
      });
      return result;
    });
  }

  cleanupSync() {
    const tempFiles = this.tempFiles;
    tmpDirManagers.delete(this);
    this.registered = false;

    if (tempFiles.length === 0) {
      return;
    }

    this.tempFiles = [];

    for (const file of tempFiles) {
      if (file.disposer != null) {
        // noinspection JSIgnoredPromiseFromCall
        file.disposer(file.path);
        continue;
      }

      try {
        if (file.isDir) {
          (0, _fsExtraP().removeSync)(file.path);
        } else {
          (0, _fsExtraP().unlinkSync)(file.path);
        }
      } catch (e) {
        handleError(e, file.path);
      }
    }
  }

  cleanup() {
    const tempFiles = this.tempFiles;
    tmpDirManagers.delete(this);
    this.registered = false;

    if (tempFiles.length === 0) {
      return Promise.resolve();
    }

    this.tempFiles = [];

    if (tmpDirManagers.size === 0) {
      const dir = tempBaseDir;

      if (dir == null) {
        return Promise.resolve();
      }

      tempBaseDir = null;
      tempDirPromise = null;
      return (0, _fsExtraP().remove)(dir);
    }

    return _bluebirdLst().default.map(tempFiles, it => {
      if (it.disposer != null) {
        return it.disposer(it.path);
      }

      return (it.isDir ? (0, _fsExtraP().remove)(it.path) : (0, _fsExtraP().unlink)(it.path)).catch(e => {
        handleError(e, it.path);
      });
    }, {
      concurrency: 4
    });
  }

  toString() {
    return this.debugName;
  }

}

exports.TmpDir = TmpDir;

function nullize(s) {
  return s == null || s.length === 0 ? null : s;
} 
// __ts-babel@6.0.4
//# sourceMappingURL=main.js.map