// These are default BagIt profiles that the system will load into
// its database the first time it starts up.

const APTrust = {
    "BagIt-Profile-Info":{
        "BagIt-Profile-Identifier":"https://wiki.aptrust.org/APTrust_BagIt_Profile",
        "Source-Organization":"aptrust.org",
        "Contact-Name":"A. Diamond",
        "Contact-Email":"support@aptrust.org",
        "External-Description":"BagIt profile for ingesting content into APTrust.",
        "Version":"2.0"
    },
    "Accept-BagIt-Version":[
        "0.97"
    ],
    "Allow-Misc-Top-Level-Files":true,
    "Allow-Misc-Directories":true,
    "Allow-Fetch.txt":false,
    "Manifests-Required":[
        "md5"
    ],
    "Serialization":"required",
    "Accept-Serialization":[
        "application/tar"
    ],
    "Tag-Manifests-Required":[

    ],
    "Tag-Files-Required":{
        "bagit.txt":{
            "BagIt-Version":{
                "required":true,
                "values":["0.97"]
            },
            "Tag-File-Character-Encoding":{
                "required":true,
                "values":["UTF-8"]
            }
        },
        "bag-info.txt":{
            "Source-Organization":{
                "required":true,
                "emptyOk":true
            },
            "Bag-Count":{
                "required":false,
                "emptyOk":true
            },
            "Bagging-Date":{
                "required":false,
                "emptyOk":true
            },
            "Internal-Sender-Description":{
                "required":false,
                "emptyOk":true
            },
            "Internal-Sender-Identifier":{
                "required":false,
                "emptyOk":true
            },
            "Payload-Oxum":{
                "required":false,
                "emptyOk":true
            }
        },
        "aptrust-info.txt":{
            "Title":{
                "required":true,
                "emptyOk":false
            },
            "Access":{
                "required":true,
                "emptyOk":false,
                "values":[
                    "Consortia",
                    "Institution",
                    "Restricted"
                ]
            },
            "Description":{
                "required":false,
                "emptyOk":true
            }
        }
    }
}

const DPN = {
    "BagIt-Profile-Info": {
        "BagIt-Profile-Identifier": "https://wiki.aptrust.org/DPN_BagIt_Profile",
        "Source-Organization": "dpn.org",
        "Contact-Name": "A. Diamond",
        "Contact-Email": "support@dpn.org",
        "External-Description": "BagIt profile for ingesting content into DPN.",
        "Version": "2.0"
        },
    "Accept-BagIt-Version": [
        "0.97"
        ],
    "Allow-Misc-Top-Level-Files": false,
    "Allow-Misc-Directories": true,
    "Allow-Fetch.txt": false,
    "Manifests-Required": [
        "sha256"
        ],
    "Serialization": "required",
    "Accept-Serialization": [
        "application/tar"
        ],
    "Tag-Manifests-Required": [
        "sha256"
        ],
    "Tag-Files-Required": {
        "bagit.txt": {
            "BagIt-Version":{
                "required":true,
                "values":["0.97"]
            },
            "Tag-File-Character-Encoding":{
                "required":true,
                "values":["UTF-8"]
            }
        },
        "bag-info.txt": {
            "Source-Organization": {
                "required": true,
                "emptyOK": true
                },
            "Organization-Address": {
                "required": true,
                "emptyOK": true
                },
            "Contact-Name": {
                "required": true,
                "emptyOK": true
                },
            "Contact-Phone": {
                "required": true,
                "emptyOK": true
                },
            "Contact-Email": {
                "required": true,
                "emptyOK": true
                },
            "Bagging-Date": {
                "required": true,
                "emptyOK": true
                },
            "Bag-Size": {
                "required": true,
                "emptyOK": true
                },
            "Bag-Group-Identifier": {
                "required": true,
                "emptyOK": true
                },
            "Bag-Count": {
                "required": true,
                "emptyOK": true
                }
            },
        "dpn-tags/dpn-info.txt": {
            "DPN-Object-ID": {
                "required": true,
                "emptyOk": false
                },
            "Local-ID": {
                "required": true,
                "emptyOk": false
                },
            "Ingest-Node-Name": {
                "required": true,
                "emptyOk": false
                },
            "Ingest-Node-Address": {
                "required": true,
                "emptyOk": true
                },
            "Ingest-Node-Contact-Name": {
                "required": true,
                "emptyOk": true
                },
            "Ingest-Node-Contact-Email": {
                "required": true,
                "emptyOk": true
                },
            "Version-Number": {
                "required": true,
                "emptyOk": false
                },
            "First-Version-Object-ID": {
                "required": true,
                "emptyOk": false
                },
            "Interpretive-Object-ID": {
                "required": true,
                "emptyOk": true
                },
            "Rights-Object-ID": {
                "required": true,
                "emptyOk": true
                },
            "Bag-Type": {
                "required": true,
                "emptyOk": false,
                "values": ["data", "interpretive", "rights"]
            }
        }
    }
}

module.exports.APTrust = APTrust;
module.exports.DPN = DPN;