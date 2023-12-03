const configuration = require('./build/contracts/StudentContract.json');
const Web3 = require('web3');
const web3 = new Web3.Web3('http://127.0.0.1:7545');


const CONTRACT_ABI = configuration.abi;


const main = async () => {
    const CONTRACT_ADDRESS = configuration.networks['5777'].address;
    const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

    const account = '0x58BA1fc7CB0216f3fBC430ab928c845063E51091';
    const studentNumber = 12345;
    const etherToSend = web3.utils.toWei('0.0054', 'ether');

    contract.methods.setStudentNumber(studentNumber).send({ from: account, value: etherToSend }).then(receipt => {
      console.log('Transaction receipt:', receipt);
      // After setting, get the student number to verify
      return contract.methods.getStudentNumber().call();
    })
    .then(retrievedStudentNumber => {
      console.log("The student number is now:", retrievedStudentNumber);
    })
    .catch(error => {
      console.error("Error:", error);
    });
};

main();