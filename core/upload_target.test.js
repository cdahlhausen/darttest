const fs = require('fs');
const path = require('path');
const { Context } = require('./context');
const { UploadTarget } = require('./upload_target');
const { TestUtil } = require('./test_util');
const { Util } = require('./util');

beforeEach(() => {
    TestUtil.deleteJsonFile('UploadTarget');
});

afterAll(() => {
    TestUtil.deleteJsonFile('UploadTarget');
});

test('Constructor sets expected properties', () => {
    let obj = new UploadTarget('name1');
    expect(obj.type).toEqual('UploadTarget');
    expect(Util.looksLikeUUID(obj.id)).toEqual(true);
    expect(obj.name).toEqual('name1');
});


test('validate()', () => {
    let obj = new UploadTarget('');
    let originalId = obj.id;
    obj.id = null;
    obj.port = 'Port of Spain';
    let result1 = obj.validate();
    expect(result1).toEqual(false);
    expect(obj.errors['name']).toEqual('Name cannot be empty.');
    expect(obj.errors['id']).toEqual('Id cannot be empty.');
    expect(obj.errors['protocol']).toEqual('Protocol cannot be empty.');
    expect(obj.errors['host']).toEqual('Host cannot be empty.');
    expect(obj.errors['port']).toEqual('Port must be a whole number, or leave blank to use the default port.');

    obj.id = originalId;
    obj.name = 'Something';
    obj.protocol = 's3';
    obj.host = 's3.amazonaws.com';
    obj.port = null;
    expect(obj.validate()).toEqual(true);
    obj.port = 443;  // port can be empty or a valid integer
    expect(obj.validate()).toEqual(true);
});

test('find()', () => {
    let objs = makeObjects(3);
    let obj = objs[1];
    expect(UploadTarget.find(obj.id)).toEqual(obj);
});

test('sort()', () => {
    let objs = makeObjects(3);
    let sortedAsc = UploadTarget.sort("name", "asc");
    expect(sortedAsc[0].name).toEqual("Name 1");
    expect(sortedAsc[2].name).toEqual("Name 3");
    let sortedDesc = UploadTarget.sort("name", "desc");
    expect(sortedDesc[0].name).toEqual("Name 3");
    expect(sortedDesc[2].name).toEqual("Name 1");
});

test('findMatching()', () => {
    let objs = makeObjects(3);
    let matches = UploadTarget.findMatching("host", "Host 3");
    expect(matches.length).toEqual(1);
    expect(matches[0].host).toEqual("Host 3");
    matches = UploadTarget.findMatching("protocol", "s3");
    expect(matches.length).toEqual(2);
    matches = UploadTarget.findMatching("protocol", "sneakernet");
    expect(matches.length).toEqual(0);
});

test('firstMatching()', () => {
    let objs = makeObjects(3);
    let match = UploadTarget.firstMatching("protocol", "sftp");
    expect(match).not.toBeNull();
    expect(match.protocol).toEqual("sftp");
});

test('list()', () => {
    let objs = makeObjects(3);
    let fn = function(obj) {
        return obj.host != null;
    }
    let opts = {
        limit: 2,
        offset: 1,
        orderBy: "host",
        sortDirection: "asc"
    }
    let matches = UploadTarget.list(fn, opts);
    expect(matches.length).toEqual(2);
    expect(matches[0].host).toEqual("Host 2");
    expect(matches[1].host).toEqual("Host 3");
});

test('first()', () => {
    let objs = makeObjects(3);
    let fn = function(obj) {
        return obj.host != null;
    }
    let opts = {
        orderBy: "host",
        sortDirection: "desc"
    }
    let match = UploadTarget.first(fn, opts);
    expect(match).not.toBeNull();
    expect(match.host).toEqual("Host 3");
});

function makeObjects(howMany) {
    let list = [];
    for(let i=0; i < howMany; i++) {
        let name = `Name ${i + 1}`;
        let obj = new UploadTarget(name);
        obj.host = `Host ${i + 1}`;
        if (i % 2 == 0) {
            obj.protocol = 's3';
        } else {
            obj.protocol = 'sftp';
        }
        obj.save();
        list.push(obj);
    }
    return list;
}
