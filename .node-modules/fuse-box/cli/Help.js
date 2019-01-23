"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log = require("./log");
class Help {
    constructor(args) {
        log.help({
            "install --search [name]": "Searches for a skeleton (or lists them)",
            "install [name]": "Install skeleton into the current folder",
            "install [name] [dir]": "Install skeleton into the specific directory",
            "install --update": "Updates the skeleton repository",
        });
    }
}
exports.Help = Help;
