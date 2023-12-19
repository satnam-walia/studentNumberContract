const readline = require('readline').createInterface({input: process.stdin, output: process.stdout});
const configuration = require('../build/contracts/PubSubContract.json');
const net = require('net');
const Web3 = require('web3');
const web3 = new Web3.Web3('ws://127.0.0.1:7545');

// build contract metadata
const CONTRACT_ABI = configuration.abi;
const CONTRACT_ADDRESS = configuration.networks['5777'].address;
const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

var subscribers = {};

// Server handling
const server = net.createServer(function(socket) {
    console.log('client connected');
    socket.on('data', function(data) {
        // INIT;SUBSCRIBER;ETH_ADDRESS
        if(data.toString().startsWith('INIT;')) {
            const msg = data.toString().split(';');
            if(msg[1] === 'SUBSCRIBER') {
                subscribers[msg[2]] = socket;
            }
        }
    });
    socket.on('error', (err) => {
        // remove socket from subscribers
        for (var key in subscribers) {
            if (subscribers[key] === socket) {
                delete subscribers[key];
            }
        }
    });
    socket.on('end', function() {
        console.log('client disconnected');
    });
});


// Contract event handling
contract.events.MessageReceived().on('data', function(event){
    const topic = event.returnValues.topic;
    const message = event.returnValues.message;
    const sub = event.returnValues.subscriber;
    console.log(`Received message from contract: ${topic} - ${message} - ${sub}`);
    // Send msg over socket to subscriber
    subscribers[sub].write(`MESSAGE;${topic};${message}`);
});


// Start socket server
const PORT = 13337;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

