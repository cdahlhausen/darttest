const path = require('path');
const fs = require('fs');
const Store = require('electron-store');
var db = new Store({name: 'internal'});

class Util {
    // Thanks https://gist.github.com/kaizhu256/4482069
    static uuid4() {
        var uuid = '', ii;
        for (ii = 0; ii < 32; ii += 1) {
            switch (ii) {
            case 8:
            case 20:
                uuid += '-';
                uuid += (Math.random() * 16 | 0).toString(16);
                break;
            case 12:
                uuid += '-';
                uuid += '4';
                break;
            case 16:
                uuid += '-';
                uuid += (Math.random() * 4 | 8).toString(16);
                break;
            default:
                uuid += (Math.random() * 16 | 0).toString(16);
            }
        }
        return uuid;
    }
    static looksLikeUUID(str) {
        var match = null
        try {
            var re = /^([a-f\d]{8}(-[a-f\d]{4}){3}-[a-f\d]{12}?)$/i;
            match = str.match(re);
        } catch (ex) {
            // null string or non-string
        }
        return match != null;
    }
    static sortByName(store) {
        return Util.sort(store, 'name', 'asc');
    }
    static sortByCreated(store) {
        return Util.sort(store, 'created', 'desc');
    }
    static sortByUpdated(store) {
        return Util.sort(store, 'updated', 'desc');
    }
    static sort(store, field, direction) {
        var list = [];
        for (var key in store) {
            list.push(store[key]);
        }
        if (direction == 'desc') {
            list.sort(function(a, b) {
                // descending sort
                if (a[field] < b[field]) { return 1; }
                if (a[field] > b[field]) { return -1; }
                return 0;
            });
        } else {
            list.sort(function(a, b) {
                // ascending sort
                if (a[field] < b[field]) { return -1; }
                if (a[field] > b[field]) { return 1; }
                return 0;
            });
        }
        return list;
    }
    static isEmpty(str) {
        return (str == null || ((typeof str) == "string" && str.trim() == ""));
    }
    static isEmptyArray(arr) {
        if(arr == null || arr.length == 0) {
            return true;
        }
        for(let str of arr) {
            if (!Util.isEmpty(str)) {
                return false;
            }
        }
        return true;
    }
    static filterEmpties(arr) {
        if(arr == null || !Array.isArray(arr)) {
            console.log(`filterEmpties: param arr is not an array. Value: ${arr}`)
            return [];
        }
        return arr.map(item => item.trim()).filter(item => item != "");
    }
    static listContains(list, item) {
        for (var i of list) {
            if (i == item || Util.boolEqual(i, item)) {
                return true;
            }
        }
        return false;
    }
    static boolEqual(a, b) {
        var aValue = Util.boolValue(a);
        var bValue = Util.boolValue(b);
        return (aValue != null && aValue == bValue);
    }
    static boolValue(str) {
        var lcString = String(str).toLowerCase();
        if (lcString == "true" || lcString == "yes") {
            return true;
        } else if (lcString == "false" || lcString == "no") {
            return false;
        }
        return null;
    }
    static getInternalVar(name) {
        return db.get(name);
    }
    static setInternalVar(name, value) {
        db.set(name, value);
    }
    static isDevMode() {
        return (process.execPath.includes('node_modules/electron') ||
                process.execPath.includes('node_modules\electron'));
    }
    // walkSync recursively lists all files in a directory and its
    // subdirectories and returns them in filelist. If you want to
    // filter the list, include a callback filterFunction, which takes
    // the filepath as its sole param (a string) and returns true or
    // false to indicate whether to include the file in the list.
    //
    // The returned list is a list of hashes, and each hash has keys
    // absPath: the absolute path to the file
    // stats: a Node fs.Stats object with info about the file
    static walkSync(dir, filelist, filterFunction) {
        var files = fs.readdirSync(dir);
        filelist = filelist || [];
        filterFunction = filterFunction || function(file) { return true };
        files.forEach(function(file) {
            var absPath = path.join(dir, file);
            var stats = fs.statSync(absPath);
            if (stats.isDirectory()) {
                filelist = Util.walkSync(absPath, filelist, filterFunction);
            }
            else if (filterFunction(absPath)) {
                filelist.push({
                    absPath: absPath,
                    stats: stats
                });
            }
        });
        return filelist;
    };
}

module.exports.Util = Util;
