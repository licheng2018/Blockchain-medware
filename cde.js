var inputstring;
var flag;
var inputvalue;
var type;
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});




rl.question('Please input a word in format{ledger,value}: ', function(answer)
{

    inputstring=answer;
    type=inputstring.substring(0,inputstring.indexOf(","));
    type=type.toUpperCase();
  // console.log('You have entered {%s}', inputstring);
        rl.close();
	
	if(type.indexOf("HYPERLEDGER")!=-1)
{
        console.log("you are writing to a hyperledger blockchain");
	flag=0;
}else if(type.indexOf("ETHEREUM")!=-1)
{
        console.log("you are writing to a Ethereum blockchain");
	flag=1;
}else if(type.indexOf("IOTA")!=-1)
{
        console.log("you are writing to a IOTA blockchain");
	flag=2
}
else 
{
	console.log("invalid input");
	flag=-1;
}
//console.log(flag);
if(flag==0)
{
var exec = require('child_process').exec;
var cmdStr = "/home/fabric-deploy/Admin@org2.example.com/peer.sh chaincode invoke -o orderer.example.com:7050  --tls true --cafile /home/fabric-deploy/Admin@org2.example.com/tlsca.example.com-cert.pem -C mychannel -n demo -c \'{\"Args\":[\"write\",\"key1\",\"%KEY1VALUE%\"]}\'";
//console.log(cmdStr);

inputvalue=inputstring.substring(inputstring.indexOf(',')+1, inputstring.length);
console.log("the value you write is:");
console.log(inputvalue);
//cmdStr.replace("%KEY1VALUE%",inputvalue);
//console.log(cmdStr.replace("%KEY1VALUE%",inputvalue));
exec(cmdStr.replace("%KEY1VALUE%",inputvalue), function(err,stdout,stderr){
    if(err) {
        console.log('error');
    }
        else
        {
         console.log("success");
        }
}
);
}
});
//console.log('You have entered {%s}', inputstring);


//inputstring.indexOf("HYPERLEDGER");
/*if(inputstring.indexOf("HYPERLEDGER")!=-1)
{
console.log("this is a hyperledger blockchain");
}else if(inputstring.indexOf("ETHEREUM")!=-1)
{
        console.log("this is a Ethereum blockchain");
}else if(inputstring.indexOf("IOTA")!=-1)
{
        console.log("this is a IOTA blockchain");
}
else console.log("invalid input");
*/

