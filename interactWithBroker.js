const Web3 = require('web3');
const contractABI = require('./build/contracts/PubSubContract.json').abi;
const contractAddress = '0x57b149133D6822d4c7cDF2BC26e903d1E798F3cA';

// Set up web3 provider using WebSocket for real-time event listening
const web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:7545'));

// Get contract instance
const pubSubContract = new web3.eth.Contract(contractABI, contractAddress);

const publisherAccount = '0xD268846E08737D99aA457911fe97429B83abB4dD';

// Subscriber's Ethereum account (should be securely managed)
const subscriberAccount = '0x4962d547977e4bbC89FD31aFD6Ce6457958b5610';
const subscriberPrivateKey = '0xd0aafdbc0423b0efc715d4c8e3fc2af9321a9ad099004859aecd3ce2cdd47151';

// Function to advertise a topic
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

// Function to publish a message
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

// Function to allow a user to subscribe to a topic
async function subscribeToTopic(topicName, subscriberAccount, subscriberPrivateKey) {
  const data = pubSubContract.methods.subscribe(topicName).encodeABI();
  
  const transaction = {
      to: contractAddress,
      data: data,
      value: web3.utils.toWei('0.5', 'ether'), // Subscription fee
      gas: 2000000, // Set an appropriate gas limit
  };
  
  // Sign and send the transaction
  const signedTx = await web3.eth.accounts.signTransaction(transaction, subscriberPrivateKey);
  const txReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  console.log(`Subscribed to topic: ${topicName}`, txReceipt);
}

// Function to allow a user to unsubscribe from a topic
async function unsubscribeFromTopic(topicName, subscriberAccount, subscriberPrivateKey) {
  const data = pubSubContract.methods.unsubscribe(topicName).encodeABI();
  
  const transaction = {
      to: contractAddress,
      data: data,
      gas: 2000000, // Set an appropriate gas limit
  };
  
  // Sign and send the transaction
  const signedTx = await web3.eth.accounts.signTransaction(transaction, subscriberPrivateKey);
  const txReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  console.log(`Unsubscribed from topic: ${topicName}`, txReceipt);
}


// Simulate broker transfer message behavior
async function brokerTransferMessage(topic, message, subscriberAddress) {
  // This could be a call to an internal method that handles the message
  console.log(`Broker received message for topic '${topic}' to be sent to subscriber at address '${subscriberAddress}': ${message}`);

  // The broker may then decide to trigger the on-chain 'sendToSubscriber' method,
  // which emits an event that the broker (or other services) can listen for
  try {
      const gasEstimate = await pubSubContract.methods.sendToSubscriber(topic, message).estimateGas({ from: subscriberAccount });
      const txReceipt = await pubSubContract.methods.sendToSubscriber(topic, message).send({
          from: subscriberAccount,
          gas: gasEstimate
      });
      console.log(`On-chain sendToSubscriber method called: ${txReceipt}`);
  } catch (error) {
      console.error(`Error when calling on-chain sendToSubscriber: ${error.message}`);
  }
}

// Listen for the MessageReceived event emitted by the smart contract
pubSubContract.events.MessageReceived({
  fromBlock: 'latest'
})
.on('data', async (event) => {
  const { topic, message, subscriber } = event.returnValues;
  console.log(`Event received - Topic: ${topic}, Message: ${message}, Subscriber: ${subscriber}`);
  // Broker takes action when a message is received
  await brokerTransferMessage(topic, message, subscriber);
})
.on('error', console.error);

// Example usage of the functions
async function main() {
  await advertiseTopic('ExampleTopic');
  // Delay to ensure advertisement is processed before subscribing
  setTimeout(async () => {
    await subscribeToTopic('ExampleTopic', subscriberAccount, subscriberPrivateKey);
    // Additional delay to ensure subscription is processed before publishing
    setTimeout(async () => {
      await publishMessage('ExampleTopic', 'Hello, this is a test message');
      // Add more logic here if needed, such as unsubscribing after a certain condition is met
    }, 2000);
  }, 2000);
}

main().then(() => console.log('Done!')).catch(console.error);
