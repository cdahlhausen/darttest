"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDmgTemplatePath = getDmgTemplatePath;
exports.getDmgVendorPath = getDmgVendorPath;
exports.attachAndExecute = attachAndExecute;
exports.detach = detach;
exports.computeBackgroundColor = computeBackgroundColor;
exports.computeBackground = computeBackground;
exports.applyProperties = applyProperties;
exports.transformBackgroundFileIfNeed = transformBackgroundFileIfNeed;
exports.serializeString = serializeString;
Object.defineProperty(exports, "DmgTarget", {
  enumerable: true,
  get: function () {
    return _dmg().DmgTarget;
  }
});

function _bluebirdLst() {
  const data = require("bluebird-lst");

  _bluebirdLst = function () {
    return data;
  };

  return data;
}

function _builderUtil() {
  const data = require("builder-util");

  _builderUtil = function () {
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

function _promise() {
  const data = require("builder-util/out/promise");

  _promise = function () {
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

function _dmg() {
  const data = require("./dmg");

  _dmg = function () {
    return data;
  };

  return data;
}

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

const root = path.join(__dirname, "..");

function getDmgTemplatePath() {
  return path.join(root, "templates");
}

function getDmgVendorPath() {
  return path.join(root, "vendor");
}

function attachAndExecute(_x, _x2, _x3) {
  return _attachAndExecute.apply(this, arguments);
}

function _attachAndExecute() {
  _attachAndExecute = (0, _bluebirdLst().coroutine)(function* (dmgPath, readWrite, task) {
    //noinspection SpellCheckingInspection
    const args = ["attach", "-noverify", "-noautoopen"];

    if (readWrite) {
      args.push("-readwrite");
    }

    args.push(dmgPath);
    const attachResult = yield (0, _builderUtil().exec)("hdiutil", args);
    const deviceResult = attachResult == null ? null : /^(\/dev\/\w+)/.exec(attachResult);
    const device = deviceResult == null || deviceResult.length !== 2 ? null : deviceResult[1];

    if (device == null) {
      throw new Error(`Cannot mount: ${attachResult}`);
    }

    return yield (0, _promise().executeFinally)(task(), () => detach(device));
  });
  return _attachAndExecute.apply(this, arguments);
}

function detach(_x4) {
  return _detach.apply(this, arguments);
}

function _detach() {
  _detach = (0, _bluebirdLst().coroutine)(function* (name) {
    try {
      yield (0, _builderUtil().exec)("hdiutil", ["detach", "-quiet", name]);
    } catch (e) {
      yield new Promise((resolve, reject) => {
        setTimeout(() => {
          (0, _builderUtil().exec)("hdiutil", ["detach", "-force", name]).then(resolve).catch(reject);
        }, 1000);
      });
    }
  });
  return _detach.apply(this, arguments);
}

function computeBackgroundColor(rawValue) {
  return require("parse-color")(rawValue).hex;
}

function computeBackground(_x5) {
  return _computeBackground.apply(this, arguments);
}

function _computeBackground() {
  _computeBackground = (0, _bluebirdLst().coroutine)(function* (packager) {
    const resourceList = yield packager.resourceList;

    if (resourceList.includes("background.tiff")) {
      return path.join(packager.buildResourcesDir, "background.tiff");
    } else if (resourceList.includes("background.png")) {
      return path.join(packager.buildResourcesDir, "background.png");
    } else {
      return path.join(getDmgTemplatePath(), "background.tiff");
    }
  });
  return _computeBackground.apply(this, arguments);
}

function applyProperties(_x6, _x7, _x8, _x9) {
  return _applyProperties.apply(this, arguments);
}

function _applyProperties() {
  _applyProperties = (0, _bluebirdLst().coroutine)(function* (entries, env, asyncTaskManager, packager) {
    const dmgPropertiesFile = yield packager.getTempFile("dmgProperties.pl");
    asyncTaskManager.addTask((0, _fsExtraP().outputFile)(dmgPropertiesFile, (yield (0, _fsExtraP().readFile)(path.join(getDmgTemplatePath(), "dmgProperties.pl"), "utf-8")).replace("$ENTRIES", entries)));
    yield asyncTaskManager.awaitTasks();
    yield (0, _builderUtil().exec)("/usr/bin/perl", [dmgPropertiesFile], {
      cwd: getDmgVendorPath(),
      env
    });
  });
  return _applyProperties.apply(this, arguments);
}

function transformBackgroundFileIfNeed(_x10, _x11) {
  return _transformBackgroundFileIfNeed.apply(this, arguments);
}
/** @internal */


function _transformBackgroundFileIfNeed() {
  _transformBackgroundFileIfNeed = (0, _bluebirdLst().coroutine)(function* (file, tmpDir) {
    if (file.endsWith(".tiff") || file.endsWith(".TIFF")) {
      return file;
    }

    const retinaFile = file.replace(/\.([a-z]+)$/, "@2x.$1");

    if (yield (0, _fs().exists)(retinaFile)) {
      const tiffFile = yield tmpDir.getTempFile({
        suffix: ".tiff"
      });
      yield (0, _builderUtil().exec)("tiffutil", ["-cathidpicheck", file, retinaFile, "-out", tiffFile]);
      return tiffFile;
    }

    return file;
  });
  return _transformBackgroundFileIfNeed.apply(this, arguments);
}

function serializeString(data) {
  return '  $"' + data.match(/.{1,32}/g).map(it => it.match(/.{1,4}/g).join(" ")).join('"\n  $"') + '"';
} 
// __ts-babel@6.0.4
//# sourceMappingURL=dmgUtil.js.map