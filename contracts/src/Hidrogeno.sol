// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "./Elemento.sol";

contract Hidrogeno is Elemento {
    constructor(address materiaAddress) Elemento("Hidrogeno", "H", 1, materiaAddress) {
    }
}
