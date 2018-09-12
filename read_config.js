const YAML = require('yamljs');
const fs = require("fs");
var data = YAML.parse(fs.readFileSync('../Configuration/HyperledgerFabric.yaml').toString());
var CHANNEL_NAME=data.CHANNEL_NAME;
var USER_NAME=data.USER_NAME;
var MSPID=data.MSPID;
var PRIVATE_KEY=data.PRIVATE_KEY;
var SIGN_CERT=data.SIGN_CERT;
var PEER_ADDRESS=data.PEER_ADDRESS;
var PEER_SSL_TARGET=data.PEER_SSL_TARGET;
var ORDERER_SSL_TARGET=data.ORDERER_SSL_TARGET;
var ORDERER_ADDRESS=data.ORDERER_ADDRESS;
var CHAINCODE_ID=data.CHAINCODE_ID;
var CHANNEL_ID=data.CHANNEL_ID;

/*var host = data.CHANNELNAME;
var paths = data.USERNAME;*/
console.log(CHANNEL_NAME);
console.log(USER_NAME);
console.log(MSPID);
console.log(PRIVATE_KEY);
console.log(SIGN_CERT);
console.log(PEER_ADDRESS);
console.log(PEER_SSL_TARGET);
console.log(ORDERER_SSL_TARGET);
console.log(ORDERER_ADDRESS);
console.log(CHAINCODE_ID);
console.log(CHANNEL_ID);
