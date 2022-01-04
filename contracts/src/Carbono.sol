// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "./Elemento.sol";

contract Carbono is Elemento {
    constructor (address materiaAddress) Elemento("Carbono", "C", 12, materiaAddress) {
    }
}
