const Web3 = require('web3');
const contractABI = require('./build/contracts/PubSubContract.json').abi; // ABI of your contract
const contractAddress = '0x783b6Fbd1dD30b882747f1dC2798Aa350eCC4Cf4'; // Address of your deployed contract

// Set up web3 provider
const web3 = new Web3('http://localhost:7545'); // Or your Ethereum node URL

// Get contract instance
const pubSubContract = new web3.eth.Contract(contractABI, contractAddress);

// Accounts to use for publishing and subscribing
const publisherAccount = '0xD268846E08737D99aA457911fe97429B83abB4dD';

// Example function to advertise a topic
async function advertiseTopic(topicName) {
  try {
    const gasEstimate = await pubSubContract.methods.advertise(topicName).estimateGas({ from: publisherAccount });
    const receipt = await pubSubContract.methods.advertise(topicName).send({
      from: publisherAccount,
      gas: gasEstimate
    });
    console.log('Topic advertised:', receipt);
  } catch (error) {
    console.error('Error advertising topic:', error);
  }
}

// Example function to publish a message
async function publishMessage(topicName, message) {
  try {
    const gasEstimate = await pubSubContract.methods.publish(topicName, message).estimateGas({ from: publisherAccount });
    const receipt = await pubSubContract.methods.publish(topicName, message).send({
      from: publisherAccount,
      gas: gasEstimate
    });
    console.log('Message published:', receipt);
  } catch (error) {
    console.error('Error publishing message:', error);
  }
}


// Example usage
async function main() {
  await advertiseTopic('ExampleTopic');
  await publishMessage('ExampleTopic', 'Hello, this is a test message');
}

main().then(() => console.log('Done!')).catch(console.error);
