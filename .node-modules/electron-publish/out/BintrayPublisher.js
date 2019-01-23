"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BintrayPublisher = void 0;

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

function _bintray() {
  const data = require("builder-util-runtime/out/bintray");

  _bintray = function () {
    return data;
  };

  return data;
}

function _nodeHttpExecutor() {
  const data = require("builder-util/out/nodeHttpExecutor");

  _nodeHttpExecutor = function () {
    return data;
  };

  return data;
}

function _lazyVal() {
  const data = require("lazy-val");

  _lazyVal = function () {
    return data;
  };

  return data;
}

function _publisher() {
  const data = require("./publisher");

  _publisher = function () {
    return data;
  };

  return data;
}

class BintrayPublisher extends _publisher().HttpPublisher {
  constructor(context, info, version, options = {}) {
    super(context);
    this.version = version;
    this.options = options;
    this._versionPromise = new (_lazyVal().Lazy)(() => this.init());
    this.providerName = "Bintray";
    let token = info.token;

    if ((0, _builderUtil().isEmptyOrSpaces)(token)) {
      token = process.env.BT_TOKEN;

      if ((0, _builderUtil().isEmptyOrSpaces)(token)) {
        throw new (_builderUtil().InvalidConfigurationError)(`Bintray token is not set, neither programmatically, nor using env "BT_TOKEN" (see https://www.electron.build/configuration/publish#bintrayoptions)`);
      }

      token = token.trim();

      if (!(0, _builderUtil().isTokenCharValid)(token)) {
        throw new (_builderUtil().InvalidConfigurationError)(`Bintray token (${JSON.stringify(token)}) contains invalid characters, please check env "BT_TOKEN"`);
      }
    }

    this.client = new (_bintray().BintrayClient)(info, _nodeHttpExecutor().httpExecutor, this.context.cancellationToken, token);
  }

  init() {
    var _this = this;

    return (0, _bluebirdLst().coroutine)(function* () {
      try {
        return yield _this.client.getVersion(_this.version);
      } catch (e) {
        if (e instanceof _builderUtilRuntime().HttpError && e.statusCode === 404) {
          if (_this.options.publish !== "onTagOrDraft") {
            _builderUtil().log.info({
              version: _this.version
            }, "version doesn't exist, creating one");

            return _this.client.createVersion(_this.version);
          } else {
            _builderUtil().log.notice({
              reason: "version doesn't exist",
              version: _this.version
            }, "skipped publishing");
          }
        }

        throw e;
      }
    })();
  }

  doUpload(fileName, arch, dataLength, requestProcessor) {
    var _this2 = this;

    return (0, _bluebirdLst().coroutine)(function* () {
      const version = yield _this2._versionPromise.value;

      if (version == null) {
        _builderUtil().log.notice({
          file: fileName,
          reason: "version doesn't exist and is not created",
          version: _this2.version
        }, "skipped publishing");

        return;
      }

      const options = {
        hostname: "api.bintray.com",
        path: `/content/${_this2.client.owner}/${_this2.client.repo}/${_this2.client.packageName}/${encodeURI(`${version.name}/${fileName}`)}`,
        method: "PUT",
        headers: {
          "Content-Length": dataLength,
          "X-Bintray-Override": "1",
          "X-Bintray-Publish": "1",
          "X-Bintray-Debian-Architecture": (0, _builderUtil().toLinuxArchString)(arch)
        }
      };

      if (_this2.client.distribution != null) {
        options.headers["X-Bintray-Debian-Distribution"] = _this2.client.distribution;
      }

      if (_this2.client.component != null) {
        options.headers["X-Bintray-Debian-Component"] = _this2.client.component;
      }

      for (let attemptNumber = 0;; attemptNumber++) {
        try {
          return yield _nodeHttpExecutor().httpExecutor.doApiRequest((0, _builderUtilRuntime().configureRequestOptions)(options, _this2.client.auth), _this2.context.cancellationToken, requestProcessor);
        } catch (e) {
          if (attemptNumber < 3 && (e instanceof _builderUtilRuntime().HttpError && e.statusCode === 502 || e.code === "EPIPE")) {
            continue;
          }

          throw e;
        }
      }
    })();
  } //noinspection JSUnusedGlobalSymbols


  deleteRelease(isForce = false) {
    var _this3 = this;

    return (0, _bluebirdLst().coroutine)(function* () {
      if (!isForce && !_this3._versionPromise.hasValue) {
        return;
      }

      const version = yield _this3._versionPromise.value;

      if (version != null) {
        yield _this3.client.deleteVersion(version.name);
      }
    })();
  }

  toString() {
    return `Bintray (user: ${this.client.user || this.client.owner}, owner: ${this.client.owner},  package: ${this.client.packageName}, repository: ${this.client.repo}, version: ${this.version})`;
  }

} exports.BintrayPublisher = BintrayPublisher;
// __ts-babel@6.0.4
//# sourceMappingURL=BintrayPublisher.js.map