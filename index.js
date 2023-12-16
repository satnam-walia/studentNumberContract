// User interaction
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});
const configuration = require('./build/contracts/PubSubContract.json');
const Web3 = require('web3');
const web3 = new Web3.Web3('ws://127.0.0.1:7545');

// build contract metadata
const CONTRACT_ABI = configuration.abi;
const CONTRACT_ADDRESS = configuration.networks['5777'].address;
const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);


function startBroker(){
  // listen to MessageReceived event
  contract.events.MessageReceived().on('data', function(event){
    console.log(event);
  });
  // TODO: send to subscriber directly
}


function startPublisher(){
  readline.question("Ethereum address(0x format): ", addr => {
    readline.question("Topic to advertise: ", topic => {
      // call advertise contract method
      contract.methods.advertise(topic).send({from: addr}).then(function(receipt){
        console.log(receipt);
        readline.question("Message to publish: ", message => {
          // call publish contract method
          contract.methods.publish(topic, message).send({from: addr}).then(function(receipt){
            console.log(receipt);
          });
        });
      });
    });
  });
}


function startSubscriber(){
  readline.question("Ethereum address(0x format): ", addr => {
    readline.question("Topic to subscribe to: ", topic => {
      // call subscribe contract method
      contract.methods.subscribe(topic).send({from: addr, value: web3.utils.toWei('0.5', 'ether')}).then(function(receipt){
        console.log(receipt);

        // TODO: listen to broker instead of the contract event.
        // The broker is the one supposed to send the message to the subscriber
        // See fig. 1 in enonce.pdf
        contract.events.MessageReceived().on('data', function(event){
          var params = event.returnValues;
          if(params.subscriber !== addr) return;
          console.log("New message for topic " + params.topic + ": " + params.message);
        });
      });
    });
  });
}


function showMainMenu(){
  console.log("Pub/sub system powered by smart contracts and blockchain");
  console.log("Note: You must have a broker node running before everything else");
  console.log("1. Broker node");
  console.log("2. Publisher node");
  console.log("3. Subscriber node");
  readline.question("Select an option: ", option => {
    switch(option){
      case "1":
        startBroker();
        break;
      case "2":
        startPublisher();
        break;
      case "3":
        startSubscriber();
        break;
      default:
        console.log("Invalid option");
        showMainMenu();
        break;
    }
  });
}


const main = async () => {
  showMainMenu();
};
main();