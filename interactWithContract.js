const Web3 = require('web3');
const contractArtifact = require('./build/contracts/StudentContract.json'); // adjust the path as necessary

const web3 = new Web3('http://localhost:7545'); // or the address of your Ethereum client

const abi = contractArtifact.abi;
const networkId = '5777'; // Replace with the actual network ID used for deployment

// Check if the contract is deployed to the current network
if (contractArtifact.networks[networkId]) {
  const contractAddress = contractArtifact.networks[networkId].address;

  // Create a contract instance
  const studentContract = new web3.eth.Contract(abi, contractAddress);

  // Call the getStudentNumber function
  studentContract.methods.getStudentNumber().call()
    .then(studentNumber => {
      console.log("The student number is:", studentNumber);
    })
    .catch(error => {
      console.error("Error:", error);
    });

} else {
  console.error(`The contract has not been deployed to the network with ID ${networkId}.`);
}
