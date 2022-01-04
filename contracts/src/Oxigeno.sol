// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "./Elemento.sol";

contract Oxigeno is Elemento {
   constructor(address materiaAddress) Elemento("Oxigeno", "O", 16, materiaAddress) {
    }
}
