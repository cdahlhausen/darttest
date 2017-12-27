// These are default BagIt profiles that the system will load into
// its database the first time it starts up.

const APTrustProfileId = "043f1c22-c9ff-4112-86f8-8f8f1e6a2dca";
const DPNProfileId = "09c834a7-6b51-49dd-9498-b310ee3e5a6a";

const ProfilesAvailable = { "APTrust Profile": APTrustProfileId, "DPN Profile": DPNProfileId };

const APTrustProfile = {
    "id": "043f1c22-c9ff-4112-86f8-8f8f1e6a2dca",
    "name": "APTrust",
    "description": "APTrust 2.0 default BagIt profile.",
    "acceptBagItVersion": [
        "0.97"
    ],
    "acceptSerialization": [
        "application/tar"
    ],
    "allowFetchTxt": false,
    "allowMiscTopLevelFiles": true,
    "allowMiscDirectories": true,
    "bagItProfileInfo": {
        "bagItProfileIdentifier": "https://wiki.aptrust.org/APTrust_BagIt_Profile-2.1",
        "contactEmail": "support@aptrust.org",
        "contactName": "A. Diamond",
        "externalDescription": "BagIt profile for ingesting content into APTrust.",
        "sourceOrganization": "aptrust.org",
        "version": "2.1"
    },
    "manifestsRequired": [
        "md5"
    ],
    "requiredTags": [
        {
            "id": "39b8ac8a-8e3d-47c3-9cda-5edd0d4ad1fb",
            "tagFile": "bagit.txt",
            "tagName": "BagIt-Version",
            "required": true,
            "emptyOk": false,
            "values": [
                "0.97"
            ],
            "defaultValue": "0.97",
            "userValue": "",
            "isBuiltIn": true
        },
        {
            "id": "2a914ea2-ee3b-4c53-96e1-4f93f641338b",
            "tagFile": "bagit.txt",
            "tagName": "Tag-File-Character-Encoding",
            "required": true,
            "emptyOk": false,
            "values": [
                "UTF-8"
            ],
            "defaultValue": "UTF-8",
            "userValue": "",
            "isBuiltIn": true
        },
        {
            "id": "567451b6-1f30-4bda-b66b-9a657426d5e5",
            "tagFile": "bag-info.txt",
            "tagName": "Source-Organization",
            "required": true,
            "emptyOk": false,
            "values": [],
            "defaultValue": null,
            "userValue": "",
            "isBuiltIn": true
        },
        {
            "id": "117e46d8-096f-41f1-8c94-7d9202b9477b",
            "tagFile": "bag-info.txt",
            "tagName": "Bag-Count",
            "required": false,
            "emptyOk": true,
            "values": [],
            "defaultValue": null,
            "userValue": "",
            "isBuiltIn": true
        },
        {
            "id": "41b75504-e54d-49a1-aad4-c8a4921d15ce",
            "tagFile": "bag-info.txt",
            "tagName": "Bagging-Date",
            "required": false,
            "emptyOk": true,
            "values": [],
            "defaultValue": null,
            "userValue": "",
            "isBuiltIn": true
        },
        {
            "id": "917fc560-5bd1-4a5b-acb6-b7a4ce749252",
            "tagFile": "bag-info.txt",
            "tagName": "Internal-Sender-Description",
            "required": false,
            "emptyOk": true,
            "values": [],
            "defaultValue": null,
            "userValue": "",
            "isBuiltIn": true
        },
        {
            "id": "018c0706-5597-4406-a705-205c608d827f",
            "tagFile": "bag-info.txt",
            "tagName": "Internal-Sender-Identifier",
            "required": false,
            "emptyOk": true,
            "values": [],
            "defaultValue": null,
            "userValue": "",
            "isBuiltIn": true
        },
        {
            "id": "de2c8f3e-fadb-4811-88a2-83aafa44fb50",
            "tagFile": "bag-info.txt",
            "tagName": "Payload-Oxum",
            "required": false,
            "emptyOk": true,
            "values": [],
            "defaultValue": null,
            "userValue": "",
            "isBuiltIn": true
        },
        {
            "id": "9b7344ae-9d06-4444-9d8a-dda7e5c2b8dc",
            "tagFile": "aptrust-info.txt",
            "tagName": "Title",
            "required": true,
            "emptyOk": false,
            "values": [],
            "defaultValue": null,
            "userValue": "",
            "isBuiltIn": true
        },
        {
            "id": "60ef466a-6d9c-4825-92cf-e472fb05f3d4",
            "tagFile": "aptrust-info.txt",
            "tagName": "Access",
            "required": true,
            "emptyOk": false,
            "values": [
                "Consortia",
                "Institution",
                "Restricted"
            ],
            "defaultValue": null,
            "userValue": "",
            "isBuiltIn": true
        },
        {
            "id": "d94d1d47-49cb-4569-8d27-d9ebbf25c9b2",
            "tagFile": "aptrust-info.txt",
            "tagName": "Description",
            "required": false,
            "emptyOk": true,
            "values": [],
            "defaultValue": null,
            "userValue": "",
            "isBuiltIn": true
        }
    ],
    "serialization": "required",
    "tagManifestsRequired": [],
    "baseProfileId": "",
    "isBuiltIn": true
}

const DPNProfile = {
    "id": "09c834a7-6b51-49dd-9498-b310ee3e5a6a",
    "name": "DPN",
    "description": "Digital Preservation Network default BagIt profile.",
    "acceptBagItVersion": [
        "0.97"
    ],
    "acceptSerialization": [
        "application/tar"
    ],
    "allowFetchTxt": false,
    "allowMiscTopLevelFiles": false,
    "allowMiscDirectories": true,
    "bagItProfileInfo": {
        "bagItProfileIdentifier": "https://wiki.aptrust.org/DPN_BagIt_Profile-2.1",
        "contactEmail": "support@dpn.org",
        "contactName": "A. Diamond",
        "externalDescription": "BagIt profile for ingesting content into DPN.",
        "sourceOrganization": "dpn.org",
        "version": "2.1"
    },
    "manifestsRequired": [
        "sha256"
    ],
    "requiredTags": [
        {
            "id": "ec7d7c7b-cf2f-4c0d-8e2e-a78438ca3e9f",
            "tagFile": "bagit.txt",
            "tagName": "BagIt-Version",
            "required": true,
            "emptyOk": false,
            "values": [
                "0.97"
            ],
            "defaultValue": "0.97",
            "userValue": "",
            "isBuiltIn": true
        },
        {
            "id": "78dddc07-0c02-4c6a-a1e8-a04d622d31e0",
            "tagFile": "bagit.txt",
            "tagName": "Tag-File-Character-Encoding",
            "required": true,
            "emptyOk": false,
            "values": [
                "UTF-8"
            ],
            "defaultValue": "UTF-8",
            "userValue": "",
            "isBuiltIn": true
        },
        {
            "id": "8bea5e39-4cc0-47a6-a04c-aa64022975ae",
            "tagFile": "bag-info.txt",
            "tagName": "Source-Organization",
            "required": true,
            "emptyOk": false,
            "values": [],
            "defaultValue": null,
            "userValue": "",
            "isBuiltIn": true
        },
        {
            "id": "dfb692aa-9701-469c-9de7-c94b6aa813cb",
            "tagFile": "bag-info.txt",
            "tagName": "Organization-Address",
            "required": true,
            "emptyOk": false,
            "values": [],
            "defaultValue": null,
            "userValue": "",
            "isBuiltIn": true
        },
        {
            "id": "4ba6f304-93de-4a19-8705-fdc5a00df54b",
            "tagFile": "bag-info.txt",
            "tagName": "Contact-Name",
            "required": true,
            "emptyOk": false,
            "values": [],
            "defaultValue": null,
            "userValue": "",
            "isBuiltIn": true
        },
        {
            "id": "b8a4d7c2-536f-47b3-b00f-f65c59acb873",
            "tagFile": "bag-info.txt",
            "tagName": "Contact-Phone",
            "required": true,
            "emptyOk": false,
            "values": [],
            "defaultValue": null,
            "userValue": "",
            "isBuiltIn": true
        },
        {
            "id": "0e1f6989-ec86-4474-b753-750844034f25",
            "tagFile": "bag-info.txt",
            "tagName": "Contact-Email",
            "required": true,
            "emptyOk": false,
            "values": [],
            "defaultValue": null,
            "userValue": "",
            "isBuiltIn": true
        },
        {
            "id": "ffcf7c2f-453c-496c-ac33-9e0c61bb87a9",
            "tagFile": "bag-info.txt",
            "tagName": "Bagging-Date",
            "required": true,
            "emptyOk": false,
            "values": [],
            "defaultValue": null,
            "userValue": "",
            "isBuiltIn": true
        },
        {
            "id": "a1cdc695-9bbd-4cd0-9510-80ac6de14c2f",
            "tagFile": "bag-info.txt",
            "tagName": "Bag-Size",
            "required": true,
            "emptyOk": false,
            "values": [],
            "defaultValue": null,
            "userValue": "",
            "isBuiltIn": true
        },
        {
            "id": "889ba3db-ef30-4e03-a9eb-a07a249dc17a",
            "tagFile": "bag-info.txt",
            "tagName": "Bag-Group-Identifier",
            "required": true,
            "emptyOk": false,
            "values": [],
            "defaultValue": null,
            "userValue": "",
            "isBuiltIn": true
        },
        {
            "id": "bda979b5-dda3-4fc4-84cb-6629df1fb5a1",
            "tagFile": "bag-info.txt",
            "tagName": "Bag-Count",
            "required": true,
            "emptyOk": false,
            "values": [],
            "defaultValue": null,
            "userValue": "",
            "isBuiltIn": true
        },
        {
            "id": "90bacdf2-f738-4900-8e31-507ba3483e94",
            "tagFile": "dpn-tags/dpn-info.txt",
            "tagName": "DPN-Object-ID",
            "required": true,
            "emptyOk": false,
            "values": [],
            "defaultValue": null,
            "userValue": "",
            "isBuiltIn": true
        },
        {
            "id": "14a2863d-b8cf-4d08-8604-d66faa0d8414",
            "tagFile": "dpn-tags/dpn-info.txt",
            "tagName": "Local-ID",
            "required": true,
            "emptyOk": false,
            "values": [],
            "defaultValue": null,
            "userValue": "",
            "isBuiltIn": true
        },
        {
            "id": "2e40458f-9e73-42b1-ad2f-4f7086f0fd35",
            "tagFile": "dpn-tags/dpn-info.txt",
            "tagName": "Ingest-Node-Name",
            "required": true,
            "emptyOk": false,
            "values": [],
            "defaultValue": null,
            "userValue": "",
            "isBuiltIn": true
        },
        {
            "id": "6dfd42bd-4acd-4149-a9cf-c04381278b98",
            "tagFile": "dpn-tags/dpn-info.txt",
            "tagName": "Ingest-Node-Address",
            "required": true,
            "emptyOk": true,
            "values": [],
            "defaultValue": null,
            "userValue": "",
            "isBuiltIn": true
        },
        {
            "id": "66d65c39-e2d4-45bb-9a67-f17804e753df",
            "tagFile": "dpn-tags/dpn-info.txt",
            "tagName": "Ingest-Node-Contact-Name",
            "required": true,
            "emptyOk": true,
            "values": [],
            "defaultValue": null,
            "userValue": "",
            "isBuiltIn": true
        },
        {
            "id": "9181f79e-9c23-4bfb-b042-31b54b79ab07",
            "tagFile": "dpn-tags/dpn-info.txt",
            "tagName": "Ingest-Node-Contact-Email",
            "required": true,
            "emptyOk": true,
            "values": [],
            "defaultValue": null,
            "userValue": "",
            "isBuiltIn": true
        },
        {
            "id": "ab8f2532-181b-45b9-aa3b-00100fcf4442",
            "tagFile": "dpn-tags/dpn-info.txt",
            "tagName": "Version-Number",
            "required": true,
            "emptyOk": false,
            "values": [],
            "defaultValue": null,
            "userValue": "",
            "isBuiltIn": true
        },
        {
            "id": "b08ae4ee-6b4a-4e94-9fe6-793af6bf4aaa",
            "tagFile": "dpn-tags/dpn-info.txt",
            "tagName": "First-Version-Object-ID",
            "required": true,
            "emptyOk": false,
            "values": [],
            "defaultValue": null,
            "userValue": "",
            "isBuiltIn": true
        },
        {
            "id": "1b3e1e6c-1744-43e3-84df-1986329606f4",
            "tagFile": "dpn-tags/dpn-info.txt",
            "tagName": "Interpretive-Object-ID",
            "required": true,
            "emptyOk": true,
            "values": [],
            "defaultValue": null,
            "userValue": "",
            "isBuiltIn": true
        },
        {
            "id": "bcd2c27e-c3ed-4e72-bc1b-82e0ad88b755",
            "tagFile": "dpn-tags/dpn-info.txt",
            "tagName": "Rights-Object-ID",
            "required": true,
            "emptyOk": true,
            "values": [],
            "defaultValue": null,
            "userValue": "",
            "isBuiltIn": true
        },
        {
            "id": "70d676c7-9c71-425c-af81-ff3cb80175ee",
            "tagFile": "dpn-tags/dpn-info.txt",
            "tagName": "Bag-Type",
            "required": true,
            "emptyOk": false,
            "values": [
                "data",
                "interpretive",
                "rights"
            ],
            "defaultValue": null,
            "userValue": "",
            "isBuiltIn": true
        }
    ],
    "serialization": "required",
    "tagManifestsRequired": [
        "sha256"
    ],
    "baseProfileId": null,
    "isBuiltIn": true
}



module.exports.APTrustProfile = APTrustProfile;
module.exports.APTrustProfileId = APTrustProfileId;
module.exports.DPNProfile = DPNProfile;
module.exports.DPNProfileId = DPNProfileId;
module.exports.ProfilesAvailable = ProfilesAvailable;