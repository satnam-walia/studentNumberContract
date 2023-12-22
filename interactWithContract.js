const Web3 = require('web3');
const contractArtifact = require('./build/contracts/StudentContract.json'); // Adjust the path as necessary

const web3 = new Web3.Web3('HTTP://127.0.0.1:7545'); // The address of your Ethereum client

const abi = contractArtifact.abi;
const networkId = '5777'; // Replace with the actual network ID used for deployment

// Check if the contract is deployed to the current network
if (contractArtifact.networks[networkId]) {
  const contractAddress = contractArtifact.networks[networkId].address;

  // Create a contract instance
  const studentContract = new web3.eth.Contract(abi, contractAddress);

  // Replace with your account address and desired student number
  const account = '0x356C2c05bBcfBCA2e5ECF173825C355848a7535b';
  const studentNumber = 12345; // Replace with the desired student number
  const etherToSend = web3.utils.toWei('0.0054', 'ether'); // Convert 0.0054 ETH to Wei

  // Set the student number
  studentContract.methods.setStudentNumber(studentNumber).send({ 
    from: account, 
    value: etherToSend 
  }).then(receipt => {
      console.log('Transaction receipt:', receipt);

      // After setting, get the student number to verify
      return studentContract.methods.getStudentNumber().call();
    })
    .then(retrievedStudentNumber => {
      console.log("The student number is now:", retrievedStudentNumber);
    })
    .catch(error => {
      console.error("Error:", error);
    });

} else {
  console.error(`The contract has not been deployed to the network with ID ${networkId}.`);
}
