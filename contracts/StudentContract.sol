//SPDX-License-Identifier: MIT
pragma solidity >=0.5.0; 
contract StudentContract {
    uint public studentNumber ;
    address public student ;
    mapping ( address => uint ) studentToStudentNumber ; 
    constructor () {
        student = msg.sender ;
        studentToStudentNumber [ student ] = 0; 
    }
    function setStudentNumber ( uint _studentNumber ) public payable { 
     //  require(msg.value == 5400000000000000, "Amount must be 0.0054 ether");
        studentNumber = _studentNumber ; 
        studentToStudentNumber [ student ] = _studentNumber ;
    } 

//     function getStudentNumber() public view returns (uint) {
//         return studentNumber;
//     }

//     // La nouvelle fonction methodExample1
//     function methodExample1(uint _studentNumber) public payable {
//         // Coût en gaz pour l'exécution de la méthode
//         uint gas = 100000; // exemple de quantité de gaz
//         uint gasPrice = 20000000000; // exemple de prix unitaire du gaz en wei

//         // Vérifier si l'émetteur a assez de fonds pour payer le gaz
//         require(msg.value >= gas * gasPrice, "Not enough Ether provided.");

//         // Logique pour ajouter le numéro d'étudiant
//         studentNumber = _studentNumber;
//         studentToStudentNumber[msg.sender] = _studentNumber;
//     }
}
