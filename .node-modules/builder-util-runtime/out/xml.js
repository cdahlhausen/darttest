"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseXml = parseXml;
exports.XElement = void 0;

function sax() {
  const data = _interopRequireWildcard(require("sax"));

  sax = function () {
    return data;
  };

  return data;
}

function _index() {
  const data = require("./index");

  _index = function () {
    return data;
  };

  return data;
}

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

class XElement {
  constructor(name) {
    this.name = name;
    this.value = "";
    this.attributes = null;
    this.isCData = false;
    this.elements = null;

    if (!name) {
      throw (0, _index().newError)("Element name cannot be empty", "ERR_XML_ELEMENT_NAME_EMPTY");
    }

    if (!isValidName(name)) {
      throw (0, _index().newError)(`Invalid element name: ${name}`, "ERR_XML_ELEMENT_INVALID_NAME");
    }
  }

  attribute(name) {
    const result = this.attributes === null ? null : this.attributes[name];

    if (result == null) {
      throw (0, _index().newError)(`No attribute "${name}"`, "ERR_XML_MISSED_ATTRIBUTE");
    }

    return result;
  }

  removeAttribute(name) {
    if (this.attributes !== null) {
      delete this.attributes[name];
    }
  }

  element(name, ignoreCase = false, errorIfMissed = null) {
    const result = this.elementOrNull(name, ignoreCase);

    if (result === null) {
      throw (0, _index().newError)(errorIfMissed || `No element "${name}"`, "ERR_XML_MISSED_ELEMENT");
    }

    return result;
  }

  elementOrNull(name, ignoreCase = false) {
    if (this.elements === null) {
      return null;
    }

    for (const element of this.elements) {
      if (isNameEquals(element, name, ignoreCase)) {
        return element;
      }
    }

    return null;
  }

  getElements(name, ignoreCase = false) {
    if (this.elements === null) {
      return [];
    }

    return this.elements.filter(it => isNameEquals(it, name, ignoreCase));
  }

  elementValueOrEmpty(name, ignoreCase = false) {
    const element = this.elementOrNull(name, ignoreCase);
    return element === null ? "" : element.value;
  }

}

exports.XElement = XElement;
const NAME_REG_EXP = new RegExp(/^[A-Za-z_][:A-Za-z0-9_-]*$/i);

function isValidName(name) {
  return NAME_REG_EXP.test(name);
}

function isNameEquals(element, name, ignoreCase) {
  const elementName = element.name;
  return elementName === name || ignoreCase === true && elementName.length === name.length && elementName.toLowerCase() === name.toLowerCase();
}

function parseXml(data) {
  let rootElement = null;
  const parser = sax().parser(true, {});
  const elements = [];

  parser.onopentag = saxElement => {
    const element = new XElement(saxElement.name);
    element.attributes = saxElement.attributes;

    if (rootElement === null) {
      rootElement = element;
    } else {
      const parent = elements[elements.length - 1];

      if (parent.elements == null) {
        parent.elements = [];
      }

      parent.elements.push(element);
    }

    elements.push(element);
  };

  parser.onclosetag = () => {
    elements.pop();
  };

  parser.ontext = text => {
    if (elements.length > 0) {
      elements[elements.length - 1].value = text;
    }
  };

  parser.oncdata = cdata => {
    const element = elements[elements.length - 1];
    element.value = cdata;
    element.isCData = true;
  };

  parser.onerror = err => {
    throw err;
  };

  parser.write(data);
  return rootElement;
} 
// __ts-babel@6.0.4
//# sourceMappingURL=xml.js.map