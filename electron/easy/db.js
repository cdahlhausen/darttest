// TODO: put db in the right place
// init db - make sure aptrust and dpn profiles are loaded
//
// Look at this as an alternative:
// https://github.com/sindresorhus/electron-store
var Datastore = require('nedb'),
    db = new Datastore({ filename: 'electron/easy-store-db.json', autoload: true });

module.exports.db = db;