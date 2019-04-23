const fs = require('fs')
var Fabric_Client = require('fabric-client');
var path = require('path');
var util = require('util');
var os = require('os');
const exec = util.promisify(require('child_process').exec);
let obj, errorMessage;
var fabric_client = new Fabric_Client();
// CONVERT var TO const

async function fetchValues() {

   var uidaiAdminPath = 'ls "../basic-network/crypto-config/peerOrganizations/orguidai.example.com/users/Admin@orguidai.example.com/msp/keystore"';
   obj = await exec(uidaiAdminPath);
   newUidaiAdminKey = obj.stdout.substring(0, obj.stdout.length - 1)
   if (obj.stderr) {
      console.log('stderr:', stderr);
   }

   var dlAdminPath = 'ls "../basic-network/crypto-config/peerOrganizations/orgdl.example.com/users/Admin@orgdl.example.com/msp/keystore"';
   obj = await exec(dlAdminPath);
   newDlAdminKey = obj.stdout.substring(0, obj.stdout.length - 1)
   if (obj.stderr) {
      console.log('stderr:', obj.stderr);
   }

   obj = JSON.parse(fs.readFileSync('./count.json', 'utf8'));
   obj.uidai = 500000000000;

   oldUidaiAdminKey = obj.uidaiAdminKey;
   obj.uidaiAdminKey = newUidaiAdminKey.toString();

   oldDlAdminKey = obj.dlAdminKey;
   obj.dlAdminKey = newDlAdminKey.toString();

   let data = JSON.stringify(obj);
   fs.writeFileSync('./count.json', data);

   let connection_profile = fs.readFileSync('./connection-profile.yaml', 'utf8');
   connection_profile = connection_profile.replace(oldUidaiAdminKey, newUidaiAdminKey)
   connection_profile = connection_profile.replace(oldDlAdminKey, newDlAdminKey)
   fs.writeFileSync('./connection-profile.yaml', connection_profile)

}

function incrementCountUidai() {
   obj.uidai = obj.uidai + 1;
   let data = JSON.stringify(obj);
   fs.writeFileSync('./count.json', data);
};

async function readConnectionConfig() {
   fabric_client.loadFromConfig('./connection-profile.yaml')
}


async function createUIDAI(basicInfo1) {
   console.log("\n**********************************************\ncreateUIDAI\n\n");
   var uid = obj.uidai.toString()
   var fname = basicInfo1.firstname.toString()
   var lname = basicInfo1.lastname.toString()
   var gender = basicInfo1.gender.toString()
   var dob = basicInfo1.dob.toString()
   var age = (parseInt(dob.substring(0, 5), 10) - (new Date().getFullYear())).toString()
   var contact_number = basicInfo1.contact_number.toString()
   var emailid = basicInfo1.emailid.toString()
   // var photohash = basicInfo1.photohash.toString()
   var photohash = "basicInfo1.photohash.toString()"
   // var dochash = basicInfo1.dochash.toString()
   var dochash = "basicInfo1.dochash.toString()"

   let channel = fabric_client.getChannel('channeluidai');
   let peer = fabric_client.getPeer('peer0.orguidai.example.com');
   var order = fabric_client.getOrderer('orderer.example.com')

   var member_user = null;
   var store_path = path.join(__dirname, '/nodejsfiles/hfc-key-store/OrguidaiMSP');
   console.log('Store path:' + store_path);
   var tx_id = null;

   try {
      const state_store = await Fabric_Client.newDefaultKeyValueStore({
         path: store_path
      });

      fabric_client.setStateStore(state_store);
      var crypto_suite = Fabric_Client.newCryptoSuite();
      var crypto_store = Fabric_Client.newCryptoKeyStore({
         path: store_path
      });
      crypto_suite.setCryptoKeyStore(crypto_store);
      fabric_client.setCryptoSuite(crypto_suite);
      const user_from_store = await fabric_client.getUserContext('userOrguidai', true);

      if (user_from_store && user_from_store.isEnrolled()) {
         console.log('Successfully loaded user from persistence');
         member_user = user_from_store;
      } else {
         throw new Error('Failed to get user.... run registerUser.js');
      }
      tx_id = fabric_client.newTransactionID();
      console.log("Assigning transaction_id: ", tx_id._transaction_id);

      var request = {
         chaincodeId: 'fabuidai',
         fcn: 'CreateUserAccount',
         // args: ["865219083234", "Ishan", "Sanganeria", "Male", "05/11/1998", "20", "8108152250", "sdkasbdkhab@gmail.com", "sdasd", "askdaskdn"],
         args: [uid, fname, lname, gender, dob, age, contact_number, emailid, photohash, dochash],
         chainId: 'channeluidai',
         txId: tx_id
      };

      const results1 = await channel.sendTransactionProposal(request);

      var proposalResponses = results1[0];
      var proposal = results1[1];
      let isProposalGood = false;
      if (proposalResponses && proposalResponses[0].response && proposalResponses[0].response.status === 200) {
         isProposalGood = true;
         console.log('Transaction proposal was good');
      } else {
         errorMessage = "\nERROR: " + proposalResponses[0].message + "\n"
         console.log(errorMessage);
         console.error('Transaction proposal was bad');
      }
      if (isProposalGood) {
         console.log(util.format(
            'Successfully sent Proposal and received ProposalResponse: Status - %s, message - "%s"',
            proposalResponses[0].response.status, proposalResponses[0].response.message));

         var request = {
            proposalResponses: proposalResponses,
            proposal: proposal
         };

         var transaction_id_string = tx_id.getTransactionID(); //Get the transaction ID string to be used by the event processing
         var promises = [];

         var sendPromise = channel.sendTransaction(request);
         promises.push(sendPromise);
         let event_hub = channel.newChannelEventHub(peer);
         let txPromise = new Promise((resolve, reject) => {
            let handle = setTimeout(() => {
               event_hub.unregisterTxEvent(transaction_id_string);
               event_hub.disconnect();
               resolve({
                  event_status: 'TIMEOUT'
               });
            }, 10000);
            event_hub.registerTxEvent(transaction_id_string, (tx, code) => {
               clearTimeout(handle);

               var return_status = {
                  event_status: code,
                  tx_id: transaction_id_string
               };
               if (code !== 'VALID') {
                  console.error('The transaction was invalid, code = ' + code);
                  resolve(return_status);
               } else {
                  console.log('The transaction has been committed on peer ' + event_hub.getPeerAddr());
                  resolve(return_status);
               }
            }, (err) => {
               reject(new Error('There was a problem with the eventhub ::' + err));
            }, {
               disconnect: true
            });
            event_hub.connect();

         });
         promises.push(txPromise);

         var results = await Promise.all(promises);
      } else {
         console.error('Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...');
         throw new Error('Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...');
      }

      console.log('Send transaction promise and event listener promise have completed');
      if (results && results[0] && results[0].status === 'SUCCESS') {
         console.log('Successfully sent transaction to the orderer.');
      } else {
         console.error('Failed to order the transaction. Error code: ' + results[0].status);
      }

      if (results && results[1] && results[1].event_status === 'VALID') {
         console.log('Successfully committed the change to the ledger by the peer');
         incrementCountUidai();
         return ({
            status: "success",
            message: uid
         })
      } else {
         console.log('Transaction failed to be committed to the ledger due to ::' + results[1].event_status);
      }
   } catch (err) {
      console.error('Failed to invoke successfully :: ' + err);
      return ({
         status: "failed",
         message: errorMessage
      })
   };
}

async function createUIDAI2(uid, basicInfo2) {
   console.log("\n**********************************************\ncreateUIDAI2\n\n");
   var relfname = basicInfo2.relfname.toString()
   var rellname = basicInfo2.rellname.toString()
   var birthplace = basicInfo2.birthplace.toString()
   var nationality = basicInfo2.nationality.toString()
   var emergency_number = basicInfo2.emergency_number.toString()
   var bloodgroup = basicInfo2.bloodgroup.toString()

   let channel = fabric_client.getChannel('channeluidai');
   let peer = fabric_client.getPeer('peer0.orguidai.example.com');
   var order = fabric_client.getOrderer('orderer.example.com')

   var member_user = null;
   var store_path = path.join(__dirname, '/nodejsfiles/hfc-key-store/OrguidaiMSP');
   console.log('Store path:' + store_path);
   var tx_id = null;

   try {
      const state_store = await Fabric_Client.newDefaultKeyValueStore({
         path: store_path
      });

      fabric_client.setStateStore(state_store);
      var crypto_suite = Fabric_Client.newCryptoSuite();
      var crypto_store = Fabric_Client.newCryptoKeyStore({
         path: store_path
      });
      crypto_suite.setCryptoKeyStore(crypto_store);
      fabric_client.setCryptoSuite(crypto_suite);
      const user_from_store = await fabric_client.getUserContext('userOrguidai', true);

      if (user_from_store && user_from_store.isEnrolled()) {
         console.log('Successfully loaded user from persistence');
         member_user = user_from_store;
      } else {
         throw new Error('Failed to get user.... run registerUser.js');
      }
      tx_id = fabric_client.newTransactionID();
      console.log("Assigning transaction_id: ", tx_id._transaction_id);

      var request = {
         chaincodeId: 'fabuidai',
         fcn: 'AddBaseData2',
         args: [uid, relfname, rellname, birthplace, nationality, emergency_number, bloodgroup],
         chainId: 'channeluidai',
         txId: tx_id
      };

      const results1 = await channel.sendTransactionProposal(request);

      var proposalResponses = results1[0];
      var proposal = results1[1];
      let isProposalGood = false;
      if (proposalResponses && proposalResponses[0].response && proposalResponses[0].response.status === 200) {
         isProposalGood = true;
         console.log('Transaction proposal was good');
      } else {
         errorMessage = "\nERROR: " + proposalResponses[0].message + "\n"
         console.log(errorMessage);
         console.error('Transaction proposal was bad');
      }
      if (isProposalGood) {
         console.log(util.format(
            'Successfully sent Proposal and received ProposalResponse: Status - %s, message - "%s"',
            proposalResponses[0].response.status, proposalResponses[0].response.message));

         var request = {
            proposalResponses: proposalResponses,
            proposal: proposal
         };

         var transaction_id_string = tx_id.getTransactionID(); //Get the transaction ID string to be used by the event processing
         var promises = [];

         var sendPromise = channel.sendTransaction(request);
         promises.push(sendPromise);
         let event_hub = channel.newChannelEventHub(peer);
         let txPromise = new Promise((resolve, reject) => {
            let handle = setTimeout(() => {
               event_hub.unregisterTxEvent(transaction_id_string);
               event_hub.disconnect();
               resolve({
                  event_status: 'TIMEOUT'
               });
            }, 10000);
            event_hub.registerTxEvent(transaction_id_string, (tx, code) => {
               clearTimeout(handle);

               var return_status = {
                  event_status: code,
                  tx_id: transaction_id_string
               };
               if (code !== 'VALID') {
                  console.error('The transaction was invalid, code = ' + code);
                  resolve(return_status);
               } else {
                  console.log('The transaction has been committed on peer ' + event_hub.getPeerAddr());
                  resolve(return_status);
               }
            }, (err) => {
               reject(new Error('There was a problem with the eventhub ::' + err));
            }, {
               disconnect: true
            });
            event_hub.connect();

         });
         promises.push(txPromise);

         var results = await Promise.all(promises);
      } else {
         console.error('Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...');
         throw new Error('Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...');
      }

      console.log('Send transaction promise and event listener promise have completed');
      if (results && results[0] && results[0].status === 'SUCCESS') {
         console.log('Successfully sent transaction to the orderer.');
      } else {
         console.error('Failed to order the transaction. Error code: ' + results[0].status);
      }

      if (results && results[1] && results[1].event_status === 'VALID') {
         console.log('Successfully committed the change to the ledger by the peer');
         return ({
            status: "success",
            message: uid
         })
      } else {
         console.log('Transaction failed to be committed to the ledger due to ::' + results[1].event_status);
      }
   } catch (err) {
      console.error('Failed to invoke successfully :: ' + err);
      return ({
         status: "failed",
         message: errorMessage
      })
   };
}

async function createUIDAI3(uid, basicInfo3) {
   console.log("\n**********************************************\ncreateUIDAI3\n\n");
   var addressline1 = basicInfo3.addressline1.toString()
   var addressline2 = basicInfo3.addressline2.toString()
   var city = basicInfo3.city.toString()
   var pincode = basicInfo3.pincode.toString()
   var state = basicInfo3.state.toString()

   let channel = fabric_client.getChannel('channeluidai');
   let peer = fabric_client.getPeer('peer0.orguidai.example.com');
   var order = fabric_client.getOrderer('orderer.example.com')

   var member_user = null;
   var store_path = path.join(__dirname, '/nodejsfiles/hfc-key-store/OrguidaiMSP');
   console.log('Store path:' + store_path);
   var tx_id = null;

   try {
      const state_store = await Fabric_Client.newDefaultKeyValueStore({
         path: store_path
      });

      fabric_client.setStateStore(state_store);
      var crypto_suite = Fabric_Client.newCryptoSuite();
      var crypto_store = Fabric_Client.newCryptoKeyStore({
         path: store_path
      });
      crypto_suite.setCryptoKeyStore(crypto_store);
      fabric_client.setCryptoSuite(crypto_suite);
      const user_from_store = await fabric_client.getUserContext('userOrguidai', true);

      if (user_from_store && user_from_store.isEnrolled()) {
         console.log('Successfully loaded user from persistence');
         member_user = user_from_store;
      } else {
         throw new Error('Failed to get user.... run registerUser.js');
      }
      tx_id = fabric_client.newTransactionID();
      console.log("Assigning transaction_id: ", tx_id._transaction_id);

      var request = {
         chaincodeId: 'fabuidai',
         fcn: 'AddBaseData3',
         args: [uid, addressline1, addressline2, city, pincode, state],
         chainId: 'channeluidai',
         txId: tx_id
      };

      const results1 = await channel.sendTransactionProposal(request);

      var proposalResponses = results1[0];
      var proposal = results1[1];
      let isProposalGood = false;
      if (proposalResponses && proposalResponses[0].response && proposalResponses[0].response.status === 200) {
         isProposalGood = true;
         console.log('Transaction proposal was good');
      } else {
         errorMessage = "\nERROR: " + proposalResponses[0].message + "\n"
         console.log(errorMessage);
         console.error('Transaction proposal was bad');
      }
      if (isProposalGood) {
         console.log(util.format(
            'Successfully sent Proposal and received ProposalResponse: Status - %s, message - "%s"',
            proposalResponses[0].response.status, proposalResponses[0].response.message));

         var request = {
            proposalResponses: proposalResponses,
            proposal: proposal
         };

         var transaction_id_string = tx_id.getTransactionID(); //Get the transaction ID string to be used by the event processing
         var promises = [];

         var sendPromise = channel.sendTransaction(request);
         promises.push(sendPromise);
         let event_hub = channel.newChannelEventHub(peer);
         let txPromise = new Promise((resolve, reject) => {
            let handle = setTimeout(() => {
               event_hub.unregisterTxEvent(transaction_id_string);
               event_hub.disconnect();
               resolve({
                  event_status: 'TIMEOUT'
               });
            }, 10000);
            event_hub.registerTxEvent(transaction_id_string, (tx, code) => {
               clearTimeout(handle);

               var return_status = {
                  event_status: code,
                  tx_id: transaction_id_string
               };
               if (code !== 'VALID') {
                  console.error('The transaction was invalid, code = ' + code);
                  resolve(return_status);
               } else {
                  console.log('The transaction has been committed on peer ' + event_hub.getPeerAddr());
                  resolve(return_status);
               }
            }, (err) => {
               reject(new Error('There was a problem with the eventhub ::' + err));
            }, {
               disconnect: true
            });
            event_hub.connect();

         });
         promises.push(txPromise);

         var results = await Promise.all(promises);
      } else {
         console.error('Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...');
         throw new Error('Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...');
      }

      console.log('Send transaction promise and event listener promise have completed');
      if (results && results[0] && results[0].status === 'SUCCESS') {
         console.log('Successfully sent transaction to the orderer.');
      } else {
         console.error('Failed to order the transaction. Error code: ' + results[0].status);
      }

      if (results && results[1] && results[1].event_status === 'VALID') {
         console.log('Successfully committed the change to the ledger by the peer');
         return ({
            status: "success",
            message: uid
         })
      } else {
         console.log('Transaction failed to be committed to the ledger due to ::' + results[1].event_status);
      }
   } catch (err) {
      console.error('Failed to invoke successfully :: ' + err);
      return ({
         status: "failed",
         message: errorMessage
      })
   };
}

async function checkIfHaveData(uid) {

   console.log("\n**********************************************\checkIfHaveData\n\n");
   let channel = fabric_client.getChannel('channeldl');
   let peer = fabric_client.getPeer('peer0.orgdl.example.com');

   var member_user = null;
   var store_path = path.join(__dirname, '/nodejsfiles/hfc-key-store/OrgdlMSP');
   console.log('Store path:' + store_path);
   var tx_id = null;

   return Fabric_Client.newDefaultKeyValueStore({
      path: store_path
   }).then((state_store) => {
      fabric_client.setStateStore(state_store);
      var crypto_suite = Fabric_Client.newCryptoSuite();
      var crypto_store = Fabric_Client.newCryptoKeyStore({
         path: store_path
      });
      crypto_suite.setCryptoKeyStore(crypto_store);
      fabric_client.setCryptoSuite(crypto_suite);

      return fabric_client.getUserContext('userOrgdl', true);
   }).then((user_from_store) => {
      if (user_from_store && user_from_store.isEnrolled()) {
         console.log('Successfully loaded user from persistence');
         member_user = user_from_store;
      } else {
         throw new Error('Failed to get user.... run registerUser.js');
      }

      const request = {
         chaincodeId: 'fabdl',
         fcn: 'CheckIfHaveData',
         args: [uid]
      };

      // send the query proposal to the peer
      return channel.queryByChaincode(request);
   }).then((query_responses) => {
      console.log("Query has completed, checking results");
      // query_responses could have more than one  results if there multiple peers were used as targets
      if (query_responses && query_responses.length == 1) {
         if (query_responses[0] instanceof Error) {
            console.error("error from query = ", query_responses[0]);
            return {
               status: "failed",
               message: query_responses[0].Error
            }
         } else {
            console.log("Response is ", query_responses[0].toString());
            return {
               status: "success",
               message: query_responses[0].toString()
            }
         }
      } else {
         console.log("No payloads were returned from query");
      }
   }).catch((err) => {
      console.error('Failed to query successfully :: ' + err);
      return {
         status: "failed",
         message: err
      }
   });

}

async function fetchDataUidaiToCommonChannel(uid) {
   console.log("\n**********************************************\nfetchDataUidaiToCommonChannel\n\n");
   let channel = fabric_client.getChannel('channelboth');
   let peer = fabric_client.getPeer('peer0.orguidai.example.com');
   var order = fabric_client.getOrderer('orderer.example.com')

   var member_user = null;
   var store_path = path.join(__dirname, '/nodejsfiles/hfc-key-store/OrguidaiMSP');
   console.log('Store path:' + store_path);
   var tx_id = null;

   try {
      const state_store = await Fabric_Client.newDefaultKeyValueStore({
         path: store_path
      });

      fabric_client.setStateStore(state_store);
      var crypto_suite = Fabric_Client.newCryptoSuite();
      var crypto_store = Fabric_Client.newCryptoKeyStore({
         path: store_path
      });
      crypto_suite.setCryptoKeyStore(crypto_store);
      fabric_client.setCryptoSuite(crypto_suite);
      const user_from_store = await fabric_client.getUserContext('userOrguidai', true);

      if (user_from_store && user_from_store.isEnrolled()) {
         console.log('Successfully loaded user from persistence');
         member_user = user_from_store;
      } else {
         throw new Error('Failed to get user.... run registerUser.js');
      }
      tx_id = fabric_client.newTransactionID();
      console.log("Assigning transaction_id: ", tx_id._transaction_id);

      var request = {
         chaincodeId: 'fabboth',
         fcn: 'FetchAccountDetails',
         args: [uid],
         chainId: 'channelboth',
         txId: tx_id
      };

      const results1 = await channel.sendTransactionProposal(request);

      var proposalResponses = results1[0];
      var proposal = results1[1];
      let isProposalGood = false;
      if (proposalResponses && proposalResponses[0].response && proposalResponses[0].response.status === 200) {
         isProposalGood = true;
         console.log('Transaction proposal was good');
      } else {
         errorMessage = "\nERROR: " + proposalResponses[0].message + "\n"
         console.log(errorMessage);
         console.error('Transaction proposal was bad');
      }
      if (isProposalGood) {
         console.log(util.format(
            'Successfully sent Proposal and received ProposalResponse: Status - %s, message - "%s"',
            proposalResponses[0].response.status, proposalResponses[0].response.message));

         var request = {
            proposalResponses: proposalResponses,
            proposal: proposal
         };

         var transaction_id_string = tx_id.getTransactionID(); //Get the transaction ID string to be used by the event processing
         var promises = [];

         var sendPromise = channel.sendTransaction(request);
         promises.push(sendPromise);
         let event_hub = channel.newChannelEventHub(peer);
         let txPromise = new Promise((resolve, reject) => {
            let handle = setTimeout(() => {
               event_hub.unregisterTxEvent(transaction_id_string);
               event_hub.disconnect();
               resolve({
                  event_status: 'TIMEOUT'
               });
            }, 10000);
            event_hub.registerTxEvent(transaction_id_string, (tx, code) => {
               clearTimeout(handle);

               var return_status = {
                  event_status: code,
                  tx_id: transaction_id_string
               };
               if (code !== 'VALID') {
                  console.error('The transaction was invalid, code = ' + code);
                  resolve(return_status);
               } else {
                  console.log('The transaction has been committed on peer ' + event_hub.getPeerAddr());
                  resolve(return_status);
               }
            }, (err) => {
               reject(new Error('There was a problem with the eventhub ::' + err));
            }, {
               disconnect: true
            });
            event_hub.connect();

         });
         promises.push(txPromise);

         var results = await Promise.all(promises);
      } else {
         console.error('Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...');
         throw new Error('Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...');
      }

      console.log('Send transaction promise and event listener promise have completed');
      if (results && results[0] && results[0].status === 'SUCCESS') {
         console.log('Successfully sent transaction to the orderer.');
      } else {
         console.error('Failed to order the transaction. Error code: ' + results[0].status);
      }

      if (results && results[1] && results[1].event_status === 'VALID') {
         console.log('Successfully committed the change to the ledger by the peer');
         return ({
            status: "success",
            message: results[0].message
         })
      } else {
         console.log('Transaction failed to be committed to the ledger due to ::' + results[1].event_status);
      }
   } catch (err) {
      console.error('Failed to invoke successfully :: ' + err);
      return ({
         status: "failed",
         message: errorMessage
      })
   };
}

async function fetchDataUidaiFromCommonChannel(uid) {

   console.log("\n**********************************************\nfetchDataUidaiFromCommonChannel\n\n");
   let channel = fabric_client.getChannel('channeldl');
   let peer = fabric_client.getPeer('peer0.orgdl.example.com');
   var order = fabric_client.getOrderer('orderer.example.com')

   var member_user = null;
   var store_path = path.join(__dirname, '/nodejsfiles/hfc-key-store/OrgdlMSP');
   console.log('Store path:' + store_path);
   var tx_id = null;

   try {
      const state_store = await Fabric_Client.newDefaultKeyValueStore({
         path: store_path
      });

      fabric_client.setStateStore(state_store);
      var crypto_suite = Fabric_Client.newCryptoSuite();
      var crypto_store = Fabric_Client.newCryptoKeyStore({
         path: store_path
      });
      crypto_suite.setCryptoKeyStore(crypto_store);
      fabric_client.setCryptoSuite(crypto_suite);
      const user_from_store = await fabric_client.getUserContext('userOrgdl', true);

      if (user_from_store && user_from_store.isEnrolled()) {
         console.log('Successfully loaded user from persistence');
         member_user = user_from_store;
      } else {
         throw new Error('Failed to get user.... run registerUser.js');
      }
      tx_id = fabric_client.newTransactionID();
      console.log("Assigning transaction_id: ", tx_id._transaction_id);

      var request = {
         chaincodeId: 'fabdl',
         fcn: 'FetchAccountDetails',
         args: [uid],
         chainId: 'channeldl',
         txId: tx_id
      };

      const results1 = await channel.sendTransactionProposal(request);

      var proposalResponses = results1[0];
      var proposal = results1[1];
      let isProposalGood = false;
      if (proposalResponses && proposalResponses[0].response && proposalResponses[0].response.status === 200) {
         isProposalGood = true;
         console.log('Transaction proposal was good');
      } else {
         errorMessage = "\nERROR: " + proposalResponses[0].message + "\n"
         console.log(errorMessage);
         console.error('Transaction proposal was bad');
      }
      if (isProposalGood) {
         console.log(util.format(
            'Successfully sent Proposal and received ProposalResponse: Status - %s, message - "%s"',
            proposalResponses[0].response.status, proposalResponses[0].response.message));

         var request = {
            proposalResponses: proposalResponses,
            proposal: proposal
         };

         var transaction_id_string = tx_id.getTransactionID(); //Get the transaction ID string to be used by the event processing
         var promises = [];
         var sendPromise = channel.sendTransaction(request);
         promises.push(sendPromise);
         let event_hub = channel.newChannelEventHub(peer);

         let txPromise = new Promise((resolve, reject) => {
            let handle = setTimeout(() => {
               event_hub.unregisterTxEvent(transaction_id_string);
               event_hub.disconnect();
               resolve({
                  event_status: 'TIMEOUT'
               });
            }, 10000);
            event_hub.registerTxEvent(transaction_id_string, (tx, code) => {
               clearTimeout(handle);
               var return_status = {
                  event_status: code,
                  tx_id: transaction_id_string
               };
               if (code !== 'VALID') {
                  console.error('The transaction was invalid, code = ' + code);
                  resolve(return_status);
               } else {
                  console.log('The transaction has been committed on peer ' + event_hub.getPeerAddr());
                  resolve(return_status);
               }
            }, (err) => {
               reject(new Error('There was a problem with the eventhub ::' + err));
            }, {
               disconnect: true
            });
            event_hub.connect();

         });
         promises.push(txPromise);

         var results = await Promise.all(promises);
      } else {
         console.error('Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...');
         throw new Error('Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...');
      }

      console.log('Send transaction promise and event listener promise have completed');
      if (results && results[0] && results[0].status === 'SUCCESS') {
         console.log('Successfully sent transaction to the orderer.');
      } else {
         console.error('Failed to order the transaction. Error code: ' + results[0].status);
      }

      if (results && results[1] && results[1].event_status === 'VALID') {
         console.log('Successfully committed the change to the ledger by the peer');
         // return ({
         //    status: "success",
         //    message: results[0].message
         // })
      } else {
         console.log('Transaction failed to be committed to the ledger due to ::' + results[1].event_status);
      }
   } catch (err) {
      console.error('Failed to invoke successfully :: ' + err);
      return ({
         status: "failed",
         message: err
      })
   };

   channel = fabric_client.getChannel('channelboth');
   peer = fabric_client.getPeer('peer0.orgdl.example.com');

   try {
      const state_store = await Fabric_Client.newDefaultKeyValueStore({
         path: store_path
      });

      fabric_client.setStateStore(state_store);
      var crypto_suite = Fabric_Client.newCryptoSuite();
      var crypto_store = Fabric_Client.newCryptoKeyStore({
         path: store_path
      });
      crypto_suite.setCryptoKeyStore(crypto_store);
      fabric_client.setCryptoSuite(crypto_suite);
      const user_from_store = await fabric_client.getUserContext('userOrgdl', true);

      if (user_from_store && user_from_store.isEnrolled()) {
         console.log('Successfully loaded user from persistence');
         member_user = user_from_store;
      } else {
         throw new Error('Failed to get user.... run registerUser.js');
      }
      tx_id = fabric_client.newTransactionID();
      console.log("Assigning transaction_id: ", tx_id._transaction_id);

      var request = {
         chaincodeId: 'fabboth',
         fcn: 'DeleteAccountDetails',
         args: [uid],
         chainId: 'channelboth',
         txId: tx_id
      };

      const results1 = await channel.sendTransactionProposal(request);

      var proposalResponses = results1[0];
      var proposal = results1[1];
      let isProposalGood = false;
      if (proposalResponses && proposalResponses[0].response && proposalResponses[0].response.status === 200) {
         isProposalGood = true;
         console.log('Transaction proposal was good');
      } else {
         errorMessage = "\nERROR: " + proposalResponses[0].message + "\n"
         console.log(errorMessage);
         console.error('Transaction proposal was bad');
      }
      if (isProposalGood) {
         console.log(util.format(
            'Successfully sent Proposal and received ProposalResponse: Status - %s, message - "%s"',
            proposalResponses[0].response.status, proposalResponses[0].response.message));

         var request = {
            proposalResponses: proposalResponses,
            proposal: proposal
         };

         var transaction_id_string = tx_id.getTransactionID(); //Get the transaction ID string to be used by the event processing
         var promises = [];
         var sendPromise = channel.sendTransaction(request);
         promises.push(sendPromise);
         let event_hub = channel.newChannelEventHub(peer);

         let txPromise = new Promise((resolve, reject) => {
            let handle = setTimeout(() => {
               event_hub.unregisterTxEvent(transaction_id_string);
               event_hub.disconnect();
               resolve({
                  event_status: 'TIMEOUT'
               });
            }, 10000);
            event_hub.registerTxEvent(transaction_id_string, (tx, code) => {
               clearTimeout(handle);
               var return_status = {
                  event_status: code,
                  tx_id: transaction_id_string
               };
               if (code !== 'VALID') {
                  console.error('The transaction was invalid, code = ' + code);
                  resolve(return_status);
               } else {
                  console.log('The transaction has been committed on peer ' + event_hub.getPeerAddr());
                  resolve(return_status);
               }
            }, (err) => {
               reject(new Error('There was a problem with the eventhub ::' + err));
            }, {
               disconnect: true
            });
            event_hub.connect();

         });
         promises.push(txPromise);

         var results = await Promise.all(promises);
      } else {
         console.error('Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...');
         throw new Error('Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...');
      }

      console.log('Send transaction promise and event listener promise have completed');
      if (results && results[0] && results[0].status === 'SUCCESS') {
         console.log('Successfully sent transaction to the orderer.');
      } else {
         console.error('Failed to order the transaction. Error code: ' + results[0].status);
      }

      if (results && results[1] && results[1].event_status === 'VALID') {
         console.log('Successfully committed the change to the ledger by the peer. Data deleted');
         return ({
            status: "success",
            message: results[0].message
         })
      } else {
         console.log('Transaction failed to be committed to the ledger due to ::' + results[1].event_status);
      }
   } catch (err) {
      console.error('Failed to invoke successfully :: ' + err);
      return ({
         status: "failed",
         message: err
      })
   };
}

async function fetchDataUidaiFromDlChannel(uid) {

   console.log("\n**********************************************\nfetchDataUidaiFromDlChannel\n\n");
   let channel = fabric_client.getChannel('channeldl');
   let peer = fabric_client.getPeer('peer0.orgdl.example.com');

   var member_user = null;
   var store_path = path.join(__dirname, '/nodejsfiles/hfc-key-store/OrgdlMSP');
   console.log('Store path:' + store_path);
   var tx_id = null;

   return Fabric_Client.newDefaultKeyValueStore({
      path: store_path
   }).then((state_store) => {
      fabric_client.setStateStore(state_store);
      var crypto_suite = Fabric_Client.newCryptoSuite();
      var crypto_store = Fabric_Client.newCryptoKeyStore({
         path: store_path
      });
      crypto_suite.setCryptoKeyStore(crypto_store);
      fabric_client.setCryptoSuite(crypto_suite);

      return fabric_client.getUserContext('userOrgdl', true);
   }).then((user_from_store) => {
      if (user_from_store && user_from_store.isEnrolled()) {
         console.log('Successfully loaded user from persistence');
         member_user = user_from_store;
      } else {
         throw new Error('Failed to get user.... run registerUser.js');
      }

      const request = {
         chaincodeId: 'fabdl',
         fcn: 'ReturnUserData',
         args: [uid]
      };

      // send the query proposal to the peer
      return channel.queryByChaincode(request);
   }).then((query_responses) => {
      console.log("Query has completed, checking results");
      // query_responses could have more than one  results if there multiple peers were used as targets
      if (query_responses && query_responses.length == 1) {
         if (query_responses[0] instanceof Error) {
            console.error("error from query = ", query_responses[0]);
            return {
               status: "failed",
               message: query_responses[0].Error
            }
         } else {
            console.log("Response is ", query_responses[0].toString());
            return {
               status: "success",
               message: query_responses[0].toString()
            }
         }
      } else {
         console.log("No payloads were returned from query");
      }
   }).catch((err) => {
      console.error('Failed to query successfully :: ' + err);
      return {
         status: "failed",
         message: err
      }
   });

}

async function addRto(rto) {
   console.log("\n**********************************************\addRto\n\n");
   rto = JSON.parse(rto)
   var addressline1 = rto.addressline1.toString();
   var addressline2 = rto.addressline2.toString();
   var city = rto.city.toString();
   var pincode = rto.pincode.toString();
   var state = rto.state.toString();
   var contactno = rto.contactno.toString();
   let channel = fabric_client.getChannel('channeldl');
   let peer = fabric_client.getPeer('peer0.orgdl.example.com');
   var order = fabric_client.getOrderer('orderer.example.com')

   var member_user = null;
   var store_path = path.join(__dirname, '/nodejsfiles/hfc-key-store/OrgdlMSP');
   console.log('Store path:' + store_path);
   var tx_id = null;

   try {
      const state_store = await Fabric_Client.newDefaultKeyValueStore({
         path: store_path
      });

      fabric_client.setStateStore(state_store);
      var crypto_suite = Fabric_Client.newCryptoSuite();
      var crypto_store = Fabric_Client.newCryptoKeyStore({
         path: store_path
      });
      crypto_suite.setCryptoKeyStore(crypto_store);
      fabric_client.setCryptoSuite(crypto_suite);
      const user_from_store = await fabric_client.getUserContext('userOrgdl', true);

      if (user_from_store && user_from_store.isEnrolled()) {
         console.log('Successfully loaded user from persistence');
         member_user = user_from_store;
      } else {
         throw new Error('Failed to get user.... run registerUser.js');
      }
      tx_id = fabric_client.newTransactionID();
      console.log("Assigning transaction_id: ", tx_id._transaction_id);

      var request = {
         chaincodeId: 'fabdl',
         fcn: 'AddRTO',
         // args: ["865219083234", "Ishan", "Sanganeria", "Male", "05/11/1998", "20", "8108152250", "sdkasbdkhab@gmail.com", "sdasd", "askdaskdn"],
         args: [pincode, addressline1, addressline2, city, state, contactno],
         chainId: 'channeldl',
         txId: tx_id
      };

      const results1 = await channel.sendTransactionProposal(request);

      var proposalResponses = results1[0];
      var proposal = results1[1];
      let isProposalGood = false;
      if (proposalResponses && proposalResponses[0].response && proposalResponses[0].response.status === 200) {
         isProposalGood = true;
         console.log('Transaction proposal was good');
      } else {
         errorMessage = "\nERROR: " + proposalResponses[0].message + "\n"
         console.log(errorMessage);
         console.error('Transaction proposal was bad');
      }
      if (isProposalGood) {
         console.log(util.format(
            'Successfully sent Proposal and received ProposalResponse: Status - %s, message - "%s"',
            proposalResponses[0].response.status, proposalResponses[0].response.message));

         var request = {
            proposalResponses: proposalResponses,
            proposal: proposal
         };

         var transaction_id_string = tx_id.getTransactionID(); //Get the transaction ID string to be used by the event processing
         var promises = [];

         var sendPromise = channel.sendTransaction(request);
         promises.push(sendPromise);
         let event_hub = channel.newChannelEventHub(peer);
         let txPromise = new Promise((resolve, reject) => {
            let handle = setTimeout(() => {
               event_hub.unregisterTxEvent(transaction_id_string);
               event_hub.disconnect();
               resolve({
                  event_status: 'TIMEOUT'
               });
            }, 10000);
            event_hub.registerTxEvent(transaction_id_string, (tx, code) => {
               clearTimeout(handle);

               var return_status = {
                  event_status: code,
                  tx_id: transaction_id_string
               };
               if (code !== 'VALID') {
                  console.error('The transaction was invalid, code = ' + code);
                  resolve(return_status);
               } else {
                  console.log('The transaction has been committed on peer ' + event_hub.getPeerAddr());
                  resolve(return_status);
               }
            }, (err) => {
               reject(new Error('There was a problem with the eventhub ::' + err));
            }, {
               disconnect: true
            });
            event_hub.connect();

         });
         promises.push(txPromise);

         var results = await Promise.all(promises);
      } else {
         console.error('Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...');
         throw new Error('Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...');
      }

      console.log('Send transaction promise and event listener promise have completed');
      if (results && results[0] && results[0].status === 'SUCCESS') {
         console.log('Successfully sent transaction to the orderer.');
      } else {
         console.error('Failed to order the transaction. Error code: ' + results[0].status);
      }

      if (results && results[1] && results[1].event_status === 'VALID') {
         console.log('Successfully committed the change to the ledger by the peer');
         return ({
            status: "success",
            message: "RTO added successfully"
         })
      } else {
         console.log('Transaction failed to be committed to the ledger due to ::' + results[1].event_status);
      }
   } catch (err) {
      console.error('Failed to invoke successfully :: ' + err);
      return ({
         status: "failed",
         message: errorMessage
      })
   };
}

async function addOfficer(uid, rtoid) {
   console.log("\n**********************************************\addOfficer\n\n");

   let channel = fabric_client.getChannel('channeldl');
   let peer = fabric_client.getPeer('peer0.orgdl.example.com');
   var order = fabric_client.getOrderer('orderer.example.com')

   var member_user = null;
   var store_path = path.join(__dirname, '/nodejsfiles/hfc-key-store/OrgdlMSP');
   console.log('Store path:' + store_path);
   var tx_id = null;

   try {
      const state_store = await Fabric_Client.newDefaultKeyValueStore({
         path: store_path
      });

      fabric_client.setStateStore(state_store);
      var crypto_suite = Fabric_Client.newCryptoSuite();
      var crypto_store = Fabric_Client.newCryptoKeyStore({
         path: store_path
      });
      crypto_suite.setCryptoKeyStore(crypto_store);
      fabric_client.setCryptoSuite(crypto_suite);
      const user_from_store = await fabric_client.getUserContext('userOrgdl', true);

      if (user_from_store && user_from_store.isEnrolled()) {
         console.log('Successfully loaded user from persistence');
         member_user = user_from_store;
      } else {
         throw new Error('Failed to get user.... run registerUser.js');
      }
      tx_id = fabric_client.newTransactionID();
      console.log("Assigning transaction_id: ", tx_id._transaction_id);

      var request = {
         chaincodeId: 'fabdl',
         fcn: 'AddOfficer',
         args: [uid, rtoid],
         chainId: 'channeldl',
         txId: tx_id
      };

      const results1 = await channel.sendTransactionProposal(request);

      var proposalResponses = results1[0];
      var proposal = results1[1];
      let isProposalGood = false;
      if (proposalResponses && proposalResponses[0].response && proposalResponses[0].response.status === 200) {
         isProposalGood = true;
         console.log('Transaction proposal was good');
      } else {
         errorMessage = "\nERROR: " + proposalResponses[0].message + "\n"
         console.log(errorMessage);
         console.error('Transaction proposal was bad');
      }
      if (isProposalGood) {
         console.log(util.format(
            'Successfully sent Proposal and received ProposalResponse: Status - %s, message - "%s"',
            proposalResponses[0].response.status, proposalResponses[0].response.message));

         var request = {
            proposalResponses: proposalResponses,
            proposal: proposal
         };

         var transaction_id_string = tx_id.getTransactionID(); //Get the transaction ID string to be used by the event processing
         var promises = [];

         var sendPromise = channel.sendTransaction(request);
         promises.push(sendPromise);
         let event_hub = channel.newChannelEventHub(peer);
         let txPromise = new Promise((resolve, reject) => {
            let handle = setTimeout(() => {
               event_hub.unregisterTxEvent(transaction_id_string);
               event_hub.disconnect();
               resolve({
                  event_status: 'TIMEOUT'
               });
            }, 10000);
            event_hub.registerTxEvent(transaction_id_string, (tx, code) => {
               clearTimeout(handle);

               var return_status = {
                  event_status: code,
                  tx_id: transaction_id_string
               };
               if (code !== 'VALID') {
                  console.error('The transaction was invalid, code = ' + code);
                  resolve(return_status);
               } else {
                  console.log('The transaction has been committed on peer ' + event_hub.getPeerAddr());
                  resolve(return_status);
               }
            }, (err) => {
               reject(new Error('There was a problem with the eventhub ::' + err));
            }, {
               disconnect: true
            });
            event_hub.connect();

         });
         promises.push(txPromise);

         var results = await Promise.all(promises);
      } else {
         console.error('Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...');
         throw new Error('Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...');
      }

      console.log('Send transaction promise and event listener promise have completed');
      if (results && results[0] && results[0].status === 'SUCCESS') {
         console.log('Successfully sent transaction to the orderer.');
      } else {
         console.error('Failed to order the transaction. Error code: ' + results[0].status);
      }

      if (results && results[1] && results[1].event_status === 'VALID') {
         console.log('Successfully committed the change to the ledger by the peer');
         return ({
            status: "success",
            message: "Officer added successfully with officer id OFF" + uid
         })
      } else {
         console.log('Transaction failed to be committed to the ledger due to ::' + results[1].event_status);
      }
   } catch (err) {
      console.error('Failed to invoke successfully :: ' + err);
      return ({
         status: "failed",
         message: errorMessage
      })
   };
}

async function applyLicnese(uid) {
   console.log("\n**********************************************applyLicnese\n\n");

   let channel = fabric_client.getChannel('channeldl');
   let peer = fabric_client.getPeer('peer0.orgdl.example.com');
   var order = fabric_client.getOrderer('orderer.example.com')

   var member_user = null;
   var store_path = path.join(__dirname, '/nodejsfiles/hfc-key-store/OrgdlMSP');
   console.log('Store path:' + store_path);
   var tx_id = null;

   try {
      const state_store = await Fabric_Client.newDefaultKeyValueStore({
         path: store_path
      });

      fabric_client.setStateStore(state_store);
      var crypto_suite = Fabric_Client.newCryptoSuite();
      var crypto_store = Fabric_Client.newCryptoKeyStore({
         path: store_path
      });
      crypto_suite.setCryptoKeyStore(crypto_store);
      fabric_client.setCryptoSuite(crypto_suite);
      const user_from_store = await fabric_client.getUserContext('userOrgdl', true);

      if (user_from_store && user_from_store.isEnrolled()) {
         console.log('Successfully loaded user from persistence');
         member_user = user_from_store;
      } else {
         throw new Error('Failed to get user.... run registerUser.js');
      }
      tx_id = fabric_client.newTransactionID();
      console.log("Assigning transaction_id: ", tx_id._transaction_id);

      let today = new Date();
      let date  = today.getFullYear().toString()+'-'+(today.getMonth().toString()+1)+'-'+today.getDate().toString(); 
      let time  =  today.getHours().toString() + ":" + today.getMinutes().toString() + ":" + today.getSeconds().toString();
      var request = {
         chaincodeId: 'fabdl',
         fcn: 'LicenseApply',
         args: [uid, date, time],
         chainId: 'channeldl',
         txId: tx_id
      };

      const results1 = await channel.sendTransactionProposal(request);

      var proposalResponses = results1[0];
      var proposal = results1[1];
      let isProposalGood = false;
      if (proposalResponses && proposalResponses[0].response && proposalResponses[0].response.status === 200) {
         isProposalGood = true;
         console.log('Transaction proposal was good');
      } else {
         errorMessage = "\nERROR: " + proposalResponses[0].message + "\n"
         console.log(errorMessage);
         console.error('Transaction proposal was bad');
      }
      if (isProposalGood) {
         console.log(util.format(
            'Successfully sent Proposal and received ProposalResponse: Status - %s, message - "%s"',
            proposalResponses[0].response.status, proposalResponses[0].response.message));

         var request = {
            proposalResponses: proposalResponses,
            proposal: proposal
         };

         var transaction_id_string = tx_id.getTransactionID(); //Get the transaction ID string to be used by the event processing
         var promises = [];

         var sendPromise = channel.sendTransaction(request);
         promises.push(sendPromise);
         let event_hub = channel.newChannelEventHub(peer);
         let txPromise = new Promise((resolve, reject) => {
            let handle = setTimeout(() => {
               event_hub.unregisterTxEvent(transaction_id_string);
               event_hub.disconnect();
               resolve({
                  event_status: 'TIMEOUT'
               });
            }, 10000);
            event_hub.registerTxEvent(transaction_id_string, (tx, code) => {
               clearTimeout(handle);

               var return_status = {
                  event_status: code,
                  tx_id: transaction_id_string
               };
               if (code !== 'VALID') {
                  console.error('The transaction was invalid, code = ' + code);
                  resolve(return_status);
               } else {
                  console.log('The transaction has been committed on peer ' + event_hub.getPeerAddr());
                  resolve(return_status);
               }
            }, (err) => {
               reject(new Error('There was a problem with the eventhub ::' + err));
            }, {
               disconnect: true
            });
            event_hub.connect();

         });
         promises.push(txPromise);

         var results = await Promise.all(promises);
      } else {
         console.error('Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...');
         throw new Error('Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...');
      }

      console.log('Send transaction promise and event listener promise have completed');
      if (results && results[0] && results[0].status === 'SUCCESS') {
         console.log('Successfully sent transaction to the orderer.');
      } else {
         console.error('Failed to order the transaction. Error code: ' + results[0].status);
      }

      if (results && results[1] && results[1].event_status === 'VALID') {
         console.log('Successfully committed the change to the ledger by the peer');
         return ({
            status: "success",
            message: "Successfully applied for learning license. Your file number is L" + uid
         })
      } else {
         console.log('Transaction failed to be committed to the ledger due to ::' + results[1].event_status);
      }
   } catch (err) {
      console.error('Failed to invoke successfully :: ' + err);
      return ({
         status: "failed",
         message: errorMessage
      })
   };
}


async function ReturnStatus(uid,filenumber) {

   console.log("\n**********************************************\nfetchDataUidaiFromDlChannel\n\n");
   let channel = fabric_client.getChannel('channeldl');
   let peer = fabric_client.getPeer('peer0.orgdl.example.com');

   var member_user = null;
   var store_path = path.join(__dirname, '/nodejsfiles/hfc-key-store/OrgdlMSP');
   console.log('Store path:' + store_path);
   var tx_id = null;

   return Fabric_Client.newDefaultKeyValueStore({
      path: store_path
   }).then((state_store) => {
      fabric_client.setStateStore(state_store);
      var crypto_suite = Fabric_Client.newCryptoSuite();
      var crypto_store = Fabric_Client.newCryptoKeyStore({
         path: store_path
      });
      crypto_suite.setCryptoKeyStore(crypto_store);
      fabric_client.setCryptoSuite(crypto_suite);

      return fabric_client.getUserContext('userOrgdl', true);
   }).then((user_from_store) => {
      if (user_from_store && user_from_store.isEnrolled()) {
         console.log('Successfully loaded user from persistence');
         member_user = user_from_store;
      } else {
         throw new Error('Failed to get user.... run registerUser.js');
      }

      const request = {
         chaincodeId: 'fabdl',
         fcn: 'ReturnStatus',
         args: [uid,filenumber]
      };

      // send the query proposal to the peer
      return channel.queryByChaincode(request);
   }).then((query_responses) => {
      console.log("Query has completed, checking results");
      // query_responses could have more than one  results if there multiple peers were used as targets
      if (query_responses && query_responses.length == 1) {
         if (query_responses[0] instanceof Error) {
            console.error("error from query = ", query_responses[0]);
            return {
               status: "failed",
               message: query_responses[0].Error
            }
         } else {
            console.log("Response is ", query_responses[0].toString());
            return {
               status: "success",
               message: query_responses[0].toString()
            }
         }
      } else {
         console.log("No payloads were returned from query");
      }
   }).catch((err) => {
      console.error('Failed to query successfully :: ' + err);
      return {
         status: "failed",
         message: err
      }
   });

}

module.exports = {
   incrementCountUidai,
   createUIDAI,
   createUIDAI2,
   createUIDAI3,
   fetchValues,
   fetchDataUidaiToCommonChannel,
   fetchDataUidaiFromCommonChannel,
   fetchDataUidaiFromDlChannel,
   readConnectionConfig,
   addRto,
   addOfficer,
   applyLicnese,
   checkIfHaveData,
   ReturnStatus
};