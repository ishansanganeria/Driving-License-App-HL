'use strict';

let caIP = process.argv[2];
let mspid = process.argv[3];

let orgname = mspid.substring(0, mspid.length - 3)
let caName = 'ca.' + orgname.toLowerCase() + '.example.com'
let caport;
if (orgname === "Orguidai") {
    caport = "8054"
} else {
    caport = "9054"
}
let caUrl = 'http://' + caIP + ':' + caport;
let username = 'admin';

var Fabric_Client = require('fabric-client');
var Fabric_CA_Client = require('fabric-ca-client');
var path = require('path');
var util = require('util');
var os = require('os');

var fabric_client = new Fabric_Client();
var fabric_ca_client = null;
var admin_user = null;
var member_user = null;
var store_path = path.join(__dirname, 'hfc-key-store/' + mspid);
console.log(' Store path:' + store_path + '\n');


Fabric_Client.newDefaultKeyValueStore({
    path: store_path
}).then((state_store) => {
    fabric_client.setStateStore(state_store);
    var crypto_suite = Fabric_Client.newCryptoSuite();

    var crypto_store = Fabric_Client.newCryptoKeyStore({
        path: store_path
    });
    crypto_suite.setCryptoKeyStore(crypto_store);
    fabric_client.setCryptoSuite(crypto_suite);
    var tlsOptions = {
        trustedRoots: [],
        verify: false
    };

    fabric_ca_client = new Fabric_CA_Client(caUrl , tlsOptions, caName , crypto_suite);

    return fabric_client.getUserContext(username, true);
}).then((user_from_store) => {
    if (user_from_store && user_from_store.isEnrolled()) {
        console.log('Successfully loaded admin from persistence');
        admin_user = user_from_store;
        return null;
    } else {
        return fabric_ca_client.enroll({
            enrollmentID: username,
            enrollmentSecret: 'adminpw'
        }).then((enrollment) => {
            console.log('Successfully enrolled admin: ' + username + ' \n');
            return fabric_client.createUser({
                username: username,
                mspid: mspid,
                cryptoContent: {
                    privateKeyPEM: enrollment.key.toBytes(),
                    signedCertPEM: enrollment.certificate
                }
            });
        }).then((user) => {
            admin_user = user;
            return fabric_client.setUserContext(admin_user);
        }).catch((err) => {
            console.error('Failed to enroll and persist admin. Error: ' + err.stack ? err.stack : err);
            throw new Error('Failed to enroll admin');
        });
    }
}).then(() => {
    console.log('Assigned the admin user to the fabric client ::\n\n' + admin_user.toString());
}).catch((err) => {
    console.error('Failed to enroll admin: ' + err);
});