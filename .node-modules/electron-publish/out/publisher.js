"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCiTag = getCiTag;
Object.defineProperty(exports, "ProgressCallback", {
  enumerable: true,
  get: function () {
    return _progress().ProgressCallback;
  }
});
exports.HttpPublisher = exports.Publisher = void 0;

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

function _builderUtilRuntime() {
  const data = require("builder-util-runtime");

  _builderUtilRuntime = function () {
    return data;
  };

  return data;
}

function _log() {
  const data = require("builder-util/out/log");

  _log = function () {
    return data;
  };

  return data;
}

function _chalk() {
  const data = _interopRequireDefault(require("chalk"));

  _chalk = function () {
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

var _path = require("path");

function _progress() {
  const data = require("./progress");

  _progress = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const progressBarOptions = {
  incomplete: " ",
  width: 20
};

class Publisher {
  constructor(context) {
    this.context = context;
  }

  createProgressBar(fileName, size) {
    _builderUtil().log.info({
      file: fileName,
      provider: this.providerName
    }, "uploading");

    if (this.context.progress == null || size < 512 * 1024) {
      return null;
    }

    return this.context.progress.createBar(`${" ".repeat(_log().PADDING + 2)}[:bar] :percent :etas | ${_chalk().default.green(fileName)} to ${this.providerName}`, Object.assign({
      total: size
    }, progressBarOptions));
  }

  createReadStreamAndProgressBar(file, fileStat, progressBar, reject) {
    const fileInputStream = (0, _fsExtraP().createReadStream)(file);
    fileInputStream.on("error", reject);

    if (progressBar == null) {
      return fileInputStream;
    } else {
      const progressStream = new (_builderUtilRuntime().ProgressCallbackTransform)(fileStat.size, this.context.cancellationToken, it => progressBar.tick(it.delta));
      progressStream.on("error", reject);
      return fileInputStream.pipe(progressStream);
    }
  }

}

exports.Publisher = Publisher;

class HttpPublisher extends Publisher {
  constructor(context, useSafeArtifactName = false) {
    super(context);
    this.context = context;
    this.useSafeArtifactName = useSafeArtifactName;
  }

  upload(task) {
    var _this = this;

    return (0, _bluebirdLst().coroutine)(function* () {
      const fileName = (_this.useSafeArtifactName ? task.safeArtifactName : null) || (0, _path.basename)(task.file);

      if (task.fileContent != null) {
        yield _this.doUpload(fileName, task.arch || _builderUtil().Arch.x64, task.fileContent.length, it => it.end(task.fileContent));
        return;
      }

      const fileStat = yield (0, _fsExtraP().stat)(task.file);

      const progressBar = _this.createProgressBar(fileName, fileStat.size);

      yield _this.doUpload(fileName, task.arch || _builderUtil().Arch.x64, fileStat.size, (request, reject) => {
        if (progressBar != null) {
          // reset (because can be called several times (several attempts)
          progressBar.update(0);
        }

        return _this.createReadStreamAndProgressBar(task.file, fileStat, progressBar, reject).pipe(request);
      }, task.file);
    })();
  }

}

exports.HttpPublisher = HttpPublisher;

function getCiTag() {
  const tag = process.env.TRAVIS_TAG || process.env.APPVEYOR_REPO_TAG_NAME || process.env.CIRCLE_TAG || process.env.BITRISE_GIT_TAG || process.env.CI_BUILD_TAG;
  return tag != null && tag.length > 0 ? tag : null;
} 
// __ts-babel@6.0.4
//# sourceMappingURL=publisher.js.map