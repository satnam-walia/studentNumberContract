const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});
const configuration = require('../build/contracts/PubSubContract.json');
const Web3 = require('web3');
const web3 = new Web3.Web3('ws://127.0.0.1:7545');

// build contract metadata
const CONTRACT_ABI = configuration.abi;
const CONTRACT_ADDRESS = configuration.networks['5777'].address;
const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);


function userPublishFromPrompt(addr, topic){
    readline.question("Message to publish: ", message => {
        // call publish contract method
        contract.methods.publish(topic, message).send({from: addr}).then(function(receipt){
            console.log(receipt);
            userPublishFromPrompt(addr, topic);
        });
    });
}

const main = async () => {
    // address, topic
    const args = process.argv.slice(2);
    addr = args[0];
    topic = args[1];
    // call advertise contract method
    contract.methods.advertise(topic).send({from: addr}).then(function(receipt){
        console.log(receipt);
        userPublishFromPrompt(addr, topic);
    });
};

main();
