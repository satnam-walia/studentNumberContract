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
        require(msg.value == 5400000000000000, "Amount must be 0.0054 ether");
        studentNumber = _studentNumber ; 
        studentToStudentNumber [ student ] = _studentNumber ;
    } 

    function getStudentNumber() public view returns (uint) {
        return studentNumber;
    }

}
