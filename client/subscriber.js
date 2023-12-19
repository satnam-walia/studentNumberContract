const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});
const configuration = require('../build/contracts/PubSubContract.json');
const net = require('net');
const Web3 = require('web3');
const web3 = new Web3.Web3('ws://127.0.0.1:7545');

// build contract metadata
const CONTRACT_ABI = configuration.abi;
const CONTRACT_ADDRESS = configuration.networks['5777'].address;
const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);


function setupClient(addr){
    // Setup client socket to broker
    const client = new net.Socket();
    // Connect to the server
    client.connect(13337, '127.0.0.1', () => {
        console.log('Connected to the server');
        // Send metadata to the server
        client.write('INIT;SUBSCRIBER;'+addr);
    });
    client.on('close', () => { console.log('Connection closed'); });
        
    client.on('data', (msg) => {
        if(msg.toString().startsWith('MESSAGE;')) {
            const topic = msg.toString().split(';')[1];
            const message = msg.toString().split(';')[2]; // TODO: handle messages with ;
            console.log(`Received message from server: ${msg.toString()}`);
        }
    });
    client.on('error', (err) => {
        console.log(err);
    });
    return client;
}


const main = async () => {
    // address, topic
    const args = process.argv.slice(2);
    addr = args[0];
    topic = args[1];
    const client = setupClient(addr);
    // call subscribe contract method
    contract.methods.subscribe(topic).send({ from: addr, value: web3.utils.toWei('0.5', 'ether') }).then(function (receipt) {
        console.log(receipt);
    });
};
main();
