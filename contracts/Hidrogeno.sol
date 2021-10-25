// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "./Elemento.sol";

contract Hidrogeno is Elemento {
    constructor () Elemento("Hidrogeno", "H", 1) {
        _mint(msg.sender, 1000000000);
    }   
    
    function claim() public payable {
        _mint(msg.sender, 1000000000);
    }
}