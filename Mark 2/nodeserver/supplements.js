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
  var uidaiAdminPath = 'ls "/root/MEGA/Projects/HyperLedger/Smart-India-Hackathon/Mark\ 2/basic-network/crypto-config/peerOrganizations/orguidai.example.com/users/Admin@orguidai.example.com/msp/keystore"';
  const {
    stdout,
    stderr
  } = await exec(uidaiAdminPath);
  newkey = stdout.substring(0, stdout.length - 1)
  if (stderr) {
    console.log('stderr:', stderr);
  }
  obj = JSON.parse(fs.readFileSync('./count.json', 'utf8'));
  oldkey = obj.uidaiAdminKey;
  obj.uidai = 500000000000;
  obj.uidaiAdminKey = newkey.toString();
  let data = JSON.stringify(obj);
  fs.writeFileSync('./count.json', data);

  let connection_profile = fs.readFileSync('../basic-network/connection-profile.yaml', 'utf8');
  connection_profile = connection_profile.replace(oldkey, newkey)
  fs.writeFileSync('../basic-network/connection-profile.yaml', connection_profile)

}

async function readConnectionConfig() {
  fabric_client.loadFromConfig('../basic-network/connection-profile.yaml')
}
// fabric_client.loadFromConfig('../basic-network/connection-profile.yaml')

// /root/MEGA/Projects/HyperLedger/Smart-India-Hackathon/Mark 2/basic-network/crypto-config/peerOrganizations/orguidai.example.com/users/Admin@orguidai.example.com/msp/keystore/4b4ad2afaa1715a0994f4f4b71fe428b111ef7e76267c61e6492f3f9c1e2699a_sk

function readF() {
  return JSON.parse(fs.readFileSync('./count.json', 'utf8'));
};

function incrementCountUidai() {
  obj.uidai = obj.uidai + 1;
  let data = JSON.stringify(obj);
  fs.writeFileSync('./count.json', data);
};

async function createUIDAI(basicInfo1) {
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

  var channel = fabric_client.getChannel('channeluidai');
  var peer = fabric_client.getPeer('peer0.orguidai.example.com');
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
        }, 3000);
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

module.exports = {
  incrementCountUidai,
  readF,
  createUIDAI,
  fetchValues,
  readConnectionConfig
};