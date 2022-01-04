// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "./Elemento.sol";

contract Nitrogeno is Elemento {
    constructor (address materiaAddress) Elemento("Nitrogeno", "N", 14, materiaAddress) {
    }
}
