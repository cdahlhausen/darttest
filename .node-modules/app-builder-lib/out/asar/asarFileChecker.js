"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkFileInArchive = checkFileInArchive;

function _bluebirdLst() {
  const data = require("bluebird-lst");

  _bluebirdLst = function () {
    return data;
  };

  return data;
}

function _fs() {
  const data = require("builder-util/out/fs");

  _fs = function () {
    return data;
  };

  return data;
}

function _asar() {
  const data = require("./asar");

  _asar = function () {
    return data;
  };

  return data;
}

/** @internal */
function checkFileInArchive(_x, _x2, _x3) {
  return _checkFileInArchive.apply(this, arguments);
} function _checkFileInArchive() {
  _checkFileInArchive = (0, _bluebirdLst().coroutine)(function* (asarFile, relativeFile, messagePrefix) {
    function error(text) {
      return new Error(`${messagePrefix} "${relativeFile}" in the "${asarFile}" ${text}`);
    }

    let fs;

    try {
      fs = yield (0, _asar().readAsar)(asarFile);
    } catch (e) {
      throw error(`is corrupted: ${e}`);
    }

    let stat;

    try {
      stat = fs.getFile(relativeFile);
    } catch (e) {
      const fileStat = yield (0, _fs().statOrNull)(asarFile);

      if (fileStat == null) {
        throw error(`does not exist. Seems like a wrong configuration.`);
      } // asar throws error on access to undefined object (info.link)


      stat = null;
    }

    if (stat == null) {
      throw error(`does not exist. Seems like a wrong configuration.`);
    }

    if (stat.size === 0) {
      throw error(`is corrupted: size 0`);
    }
  });
  return _checkFileInArchive.apply(this, arguments);
}
// __ts-babel@6.0.4
//# sourceMappingURL=asarFileChecker.js.map