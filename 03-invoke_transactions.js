

var fs = require('fs');
var Fabric_Client = require('fabric-client');
var util = require('util'); 
var tx_id=null;
var client=new Fabric_Client();
var channel = client.newChannel('mychannel');
//创建一个Client
Fabric_Client.newDefaultKeyValueStore({ path: '/tmp/xx/' }).then((state_store) => {
    //client=new Fabric_Client();
    client.setStateStore(state_store);


    //设置用户信息    
    var userOpt = {
        username: 'Admin@org1.example.com',
        mspid: 'Org1MSP',
        cryptoContent: { 
            privateKey: './peer/msp/keystore/1da4c964007adc53382c3a67cdf0198ef6f506c2a202fcb4bbea858b8b929902_sk',
            signedCert: './peer/msp/signcerts/peer0.org1.example.com-cert.pem'
        }
    }

    return client.createUser(userOpt)

}).then((user)=>{

    //设置要连接的Channel
   
//var channel = client.newChannel('mychannel');
    //设置要连接的Peer
    var peer = client.newPeer(
        'grpcs://peer0.org1.example.com:7051',
        {
            pem: fs.readFileSync('./peer/tls/ca.crt', { encoding: 'utf8' }),
            clientKey: fs.readFileSync('./peer/tls/client.key', { encoding: 'utf8' }),
            clientCert: fs.readFileSync('./peer/tls/client.crt', { encoding: 'utf8' }),
            'ssl-target-name-override': 'peer0.org1.example.com'
        }
    );

   channel.addPeer(peer);
   

	//设置要连接的orderer
	var ordererUserOpt={
	pem:fs.readFileSync('./orderer/tls/ca.crt', { encoding: 'utf8' }),
	'ssl-target-name-override':'orderer.example.com'
	}
	orderer=client.newOrderer('grpcs://orderer.example.com:7050',ordererUserOpt);
	channel.addOrderer(orderer);
	//targets.push(peer);
	

tx_id=client.newTransactionID();
console.log("Assigning transaction_id: ", tx_id._transaction_id); 
    //调用chaincode
    const request = {
        
		//targers:targets,
		chaincodeId: 'demo',   //chaincode名称
        fcn: 'write',          //调用的函数名
        args: ['key1','key1valueisabc'],         //参数
		chainId:'mychannel',
		txId:tx_id,
    };

    // send the query proposal to the peer
    return channel.sendTransactionProposal(request);


}).then((results)=>{
    var proposalResponses = results[0]; 
    var proposal = results[1]; 
    var header = results[2]; 
	
let isProposalGood = false; 
    if (proposalResponses && proposalResponses[0].response && 
        proposalResponses[0].response.status === 200) { 
        isProposalGood = true; 
        console.log('transaction proposal was good'); 
    } else { 
        console.error('transaction proposal was bad'); 
    } 
    if (isProposalGood) { 
        console.log(util.format( 
            'Successfully sent Proposal and received ProposalResponse: Status - %s, message - "%s", metadata - "%s", endorsement signature: %s', 
            proposalResponses[0].response.status, proposalResponses[0].response.message, 
            proposalResponses[0].response.payload, proposalResponses[0].endorsement.signature)); 
        var request = { 
            proposalResponses: proposalResponses, 
             proposal: proposal, 
            header: header 
        }; 
		
	}
	var transactionID = tx_id.getTransactionID(); 
        var eventPromises = []; 
        let eh = client.newEventHub(); 
	//var sendPromise = channel.sendTransaction(request); 
//var transactionID = tx_id.getTransactionID(); 
       // var eventPromises = []; 
        //let eh = client.newEventHub(); 
        //接下来设置EventHub，用于监听Transaction是否成功写入，这里也是启用了TLS 
        //let data = fs.readFileSync(options.peer_tls_cacerts); 
        let grpcOpts = { 
             pem: fs.readFileSync('./peer/tls/ca.crt', { encoding: 'utf8' }),
            'ssl-target-name-override': 'peer0.org1.example.com'
        } 
        eh.setPeerAddr('grpcs://0.0.0.0:7051',grpcOpts); 
        eh.connect();
		

        let txPromise = new Promise((resolve, reject) => { 
            let handle = setTimeout(() => { 
                eh.disconnect(); 
                reject(); 
            }, 30000); 
	
		 eh.registerTxEvent(transactionID, (tx, code) => { 
                clearTimeout(handle); 
                eh.unregisterTxEvent(transactionID); 
                eh.disconnect();

                if (code !== 'VALID') { 
                    console.error( 
                        'The transaction was invalid, code = ' + code); 
                    reject(); 
                 } else { 
                    console.log( 
                         'The transaction has been committed on peer ' + 
                         eh._ep._endpoint.addr); 
                    resolve(); 
                } 
            }); 
        }); 
		/*var sendPromise = channel.sendTransaction(request); */
		//var channel = client.addChannel('mychannel');
		 eventPromises.push(txPromise); 
        var sendPromise = channel.sendTransaction(request); 
		return Promise.all([sendPromise].concat(eventPromises));
       // return Promise.all([sendPromise].concat(eventPromises)).then((results) => { 
        //console.log(' event promise all complete and testing complete'); 
        //return results[0]; // the first returned value is from the 'sendPromise' which is from the 'sendTransaction()' call 
		})
