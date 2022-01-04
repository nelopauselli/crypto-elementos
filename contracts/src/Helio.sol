// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "./Elemento.sol";

contract Helio is Elemento {
    constructor (address materiaAddress) Elemento("Helio", "He", 4, materiaAddress) {
    }
}
