"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLicenseButtonsFile = getLicenseButtonsFile;
exports.getLicenseButtons = getLicenseButtons;

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

function _license() {
  const data = require("app-builder-lib/out/util/license");

  _license = function () {
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

function iconv() {
  const data = _interopRequireWildcard(require("iconv-lite"));

  iconv = function () {
    return data;
  };

  return data;
}

function _jsYaml() {
  const data = require("js-yaml");

  _jsYaml = function () {
    return data;
  };

  return data;
}

function _dmgUtil() {
  const data = require("./dmgUtil");

  _dmgUtil = function () {
    return data;
  };

  return data;
}

function _licenseDefaultButtons() {
  const data = require("./licenseDefaultButtons");

  _licenseDefaultButtons = function () {
    return data;
  };

  return data;
}

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function getLicenseButtonsFile(_x) {
  return _getLicenseButtonsFile.apply(this, arguments);
}

function _getLicenseButtonsFile() {
  _getLicenseButtonsFile = (0, _bluebirdLst().coroutine)(function* (packager) {
    return (0, _license().getLicenseAssets)((yield packager.resourceList).filter(it => {
      const name = it.toLowerCase(); // noinspection SpellCheckingInspection

      return name.startsWith("licensebuttons_") && (name.endsWith(".json") || name.endsWith(".yml"));
    }), packager);
  });
  return _getLicenseButtonsFile.apply(this, arguments);
}

function getLicenseButtons(_x2, _x3, _x4, _x5) {
  return _getLicenseButtons.apply(this, arguments);
}

function _getLicenseButtons() {
  _getLicenseButtons = (0, _bluebirdLst().coroutine)(function* (licenseButtonFiles, langWithRegion, id, name) {
    let data = (0, _licenseDefaultButtons().getDefaultButtons)(langWithRegion, id, name);

    for (const item of licenseButtonFiles) {
      if (item.langWithRegion !== langWithRegion) {
        continue;
      }

      try {
        const fileData = (0, _jsYaml().safeLoad)((yield (0, _fsExtraP().readFile)(item.file, "utf-8")));
        const buttonsStr = labelToHex(fileData.lang, item.lang, item.langWithRegion) + labelToHex(fileData.agree, item.lang, item.langWithRegion) + labelToHex(fileData.disagree, item.lang, item.langWithRegion) + labelToHex(fileData.print, item.lang, item.langWithRegion) + labelToHex(fileData.save, item.lang, item.langWithRegion) + labelToHex(fileData.description, item.lang, item.langWithRegion);
        data = `data 'STR#' (${id}, "${name}") {\n`;
        data += (0, _dmgUtil().serializeString)("0006" + buttonsStr);
        data += `\n};`;

        if (_builderUtil().log.isDebugEnabled) {
          _builderUtil().log.debug({
            lang: item.langName,
            data
          }, `overwriting license buttons`);
        }

        return data;
      } catch (e) {
        _builderUtil().log.debug({
          error: e
        }, "cannot overwrite license buttons");

        return data;
      }
    }

    return data;
  });
  return _getLicenseButtons.apply(this, arguments);
}

function labelToHex(label, lang, langWithRegion) {
  const lbl = hexEncode(label, lang, langWithRegion).toString().toUpperCase();
  const len = numberToHex(lbl.length / 2);
  return len + lbl;
}

function numberToHex(nb) {
  return ("0" + nb.toString(16)).slice(-2);
}

function hexEncode(str, lang, langWithRegion) {
  const macCodePages = getMacCodePage(lang, langWithRegion);
  let result = "";

  for (let i = 0; i < str.length; i++) {
    try {
      let hex = getMacHexCode(str, i, macCodePages);

      if (hex === undefined) {
        hex = "3F"; //?
      }

      result += hex;
    } catch (e) {
      _builderUtil().log.debug({
        error: e,
        char: str[i]
      }, "cannot convert");

      result += "3F"; //?
    }
  }

  return result;
}

function getMacCodePage(lang, langWithRegion) {
  switch (lang) {
    case "ja":
      //japanese
      return ["euc-jp"];
    //Apple Japanese

    case "zh":
      //chinese
      if (langWithRegion === "zh_CN") {
        return ["gb2312"]; //Apple Simplified Chinese (GB 2312)
      }

      return ["big5"];
    //Apple Traditional Chinese (Big5)

    case "ko":
      //korean
      return ["euc-kr"];
    //Apple Korean

    case "ar": //arabic

    case "ur":
      //urdu
      return ["macarabic"];
    //Apple Arabic

    case "he":
      //hebrew
      return ["machebrew"];
    //Apple Hebrew

    case "el": //greek

    case "elc":
      //greek
      return ["macgreek"];
    //Apple Greek

    case "ru": //russian

    case "be": //belarussian

    case "sr": //serbian

    case "bg": //bulgarian

    case "uz":
      //uzbek
      return ["maccyrillic"];
    //Apple Macintosh Cyrillic

    case "ro":
      //romanian
      return ["macromania"];
    //Apple Romanian

    case "uk":
      //ukrainian
      return ["macukraine"];
    //Apple Ukrainian

    case "th":
      //thai
      return ["macthai"];
    //Apple Thai

    case "et": //estonian

    case "lt": //lithuanian

    case "lv": //latvian

    case "pl": //polish

    case "hu": //hungarian

    case "cs": //czech

    case "sk":
      //slovak
      return ["maccenteuro"];
    //Apple Macintosh Central Europe

    case "is": //icelandic

    case "fo":
      //faroese
      return ["maciceland"];
    //Apple Icelandic

    case "tr":
      //turkish
      return ["macturkish"];
    //Apple Turkish

    case "hr": //croatian

    case "sl":
      //slovenian
      return ["maccroatian"];
    //Apple Croatian

    default:
      return ["macroman"];
    //Apple Macintosh Roman
  }
}

function getMacHexCode(str, i, macCodePages) {
  const code = str.charCodeAt(i);

  if (code < 128) {
    return code.toString(16);
  } else if (code < 256) {
    return iconv().encode(str[i], "macroman").toString("hex");
  } else {
    for (let i = 0; i < macCodePages.length; i++) {
      const result = iconv().encode(str[i], macCodePages[i]).toString("hex");

      if (result !== undefined) {
        return result;
      }
    }
  }

  return code;
} 
// __ts-babel@6.0.4
//# sourceMappingURL=licenseButtons.js.map